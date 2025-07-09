#!/bin/bash

# =====================================================
# LightingPro Production Deployment Script
# 🚀 Automated deployment with safety checks
# =====================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="LightingPro"
BUILD_DIR="dist"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}🚀 Starting $PROJECT_NAME deployment...${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//')
    MIN_NODE_VERSION="18.0.0"
    if ! npx semver -r ">=$MIN_NODE_VERSION" "$NODE_VERSION" &> /dev/null; then
        print_error "Node.js version $NODE_VERSION is too old. Minimum required: $MIN_NODE_VERSION"
        exit 1
    fi
    print_status "Node.js version $NODE_VERSION ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_status "npm available ✓"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the project root?"
        exit 1
    fi
    print_status "Project structure ✓"
}

# Function to run tests
run_tests() {
    echo -e "${BLUE}🧪 Running tests and quality checks...${NC}"
    
    # Install dependencies
    echo "Installing dependencies..."
    npm ci --production=false
    
    # Type checking
    echo "Running TypeScript type checking..."
    if npx tsc --noEmit; then
        print_status "TypeScript type checking passed"
    else
        print_error "TypeScript type checking failed"
        exit 1
    fi
    
    # Linting
    echo "Running ESLint..."
    if npm run lint; then
        print_status "ESLint checks passed"
    else
        print_warning "ESLint found issues (continuing anyway)"
    fi
    
    # Security audit
    echo "Running security audit..."
    if npm audit --audit-level high; then
        print_status "Security audit passed"
    else
        print_warning "Security audit found issues (review recommended)"
    fi
}

# Function to build project
build_project() {
    echo -e "${BLUE}🏗️  Building project...${NC}"
    
    # Clean previous build
    if [ -d ".next" ]; then
        rm -rf .next
        print_status "Cleaned previous build"
    fi
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the project
    if npm run build; then
        print_status "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
    
    # Check build size
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
    print_status "Build size: $BUILD_SIZE"
    
    # Warn if build is too large
    if [[ "$BUILD_SIZE" == *"M"* ]]; then
        SIZE_NUM=$(echo "$BUILD_SIZE" | sed 's/M//')
        if (( $(echo "$SIZE_NUM > 20" | bc -l) )); then
            print_warning "Build size ($BUILD_SIZE) is quite large. Consider optimization."
        fi
    fi
}

# Function to validate build
validate_build() {
    echo -e "${BLUE}🔍 Validating build...${NC}"
    
    # Check if critical files exist
    CRITICAL_FILES=(
        ".next/BUILD_ID"
        ".next/static"
        ".next/server/app"
    )
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -e "$file" ]; then
            print_status "Found $file"
        else
            print_error "Missing critical file: $file"
            exit 1
        fi
    done
    
    # Check for common issues
    if grep -r "console.log" .next/server/ 2>/dev/null | grep -v node_modules; then
        print_warning "Found console.log statements in production build"
    fi
    
    print_status "Build validation passed"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Install with: npm install -g vercel"
        exit 1
    fi
    
    # Check if user is logged in
    if ! vercel whoami &> /dev/null; then
        print_error "Not logged in to Vercel. Run: vercel login"
        exit 1
    fi
    
    # Deploy to production
    echo "Deploying to production..."
    if vercel --prod --yes; then
        print_status "Deployment to Vercel completed"
    else
        print_error "Vercel deployment failed"
        exit 1
    fi
}

# Function to run post-deployment checks
post_deployment_checks() {
    echo -e "${BLUE}🔍 Running post-deployment checks...${NC}"
    
    # Get deployment URL (this would need to be adapted based on your deployment)
    DEPLOYMENT_URL=""
    if command -v vercel &> /dev/null; then
        DEPLOYMENT_URL=$(vercel ls --limit 1 --format json | jq -r '.[0].url' 2>/dev/null || echo "")
        if [ ! -z "$DEPLOYMENT_URL" ] && [ "$DEPLOYMENT_URL" != "null" ]; then
            DEPLOYMENT_URL="https://$DEPLOYMENT_URL"
        fi
    fi
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        print_warning "Could not determine deployment URL. Skipping health checks."
        return
    fi
    
    echo "Checking deployment at: $DEPLOYMENT_URL"
    
    # Wait a moment for deployment to be ready
    sleep 10
    
    # Health check
    echo "Running health check..."
    if curl -f -s "$DEPLOYMENT_URL/api/health" > /dev/null; then
        print_status "Health check passed"
    else
        print_error "Health check failed"
        exit 1
    fi
    
    # Check main page
    echo "Checking main page..."
    if curl -f -s "$DEPLOYMENT_URL" > /dev/null; then
        print_status "Main page accessible"
    else
        print_error "Main page not accessible"
        exit 1
    fi
    
    # Check API endpoint
    echo "Checking API endpoint..."
    if curl -f -s "$DEPLOYMENT_URL/api/products/recommendations?room_type=客厅" > /dev/null; then
        print_status "API endpoint working"
    else
        print_warning "API endpoint check failed (may be expected if requires auth)"
    fi
    
    print_status "Post-deployment checks completed"
    echo -e "${GREEN}🎉 Deployment URL: $DEPLOYMENT_URL${NC}"
}

# Function to show deployment summary
show_summary() {
    echo -e "${BLUE}📊 Deployment Summary${NC}"
    echo "================================"
    echo "Project: $PROJECT_NAME"
    echo "Environment: production"
    echo "Node.js: $(node --version)"
    echo "Build size: $(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")"
    echo "Deployment time: $(date)"
    echo "================================"
    print_status "Deployment completed successfully! 🎉"
}

# Main deployment flow
main() {
    echo -e "${BLUE}🚀 $PROJECT_NAME Production Deployment${NC}"
    echo "Starting at $(date)"
    echo "======================================="
    
    check_prerequisites
    run_tests
    build_project
    validate_build
    
    # Ask for confirmation before deploying
    echo ""
    read -p "Deploy to production? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_vercel
        post_deployment_checks
        show_summary
    else
        print_status "Deployment cancelled by user"
        exit 0
    fi
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"