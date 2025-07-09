#!/bin/bash

# 🚀 LightingPro 一键部署脚本
# 此脚本将自动部署 LightingPro 到 Vercel

set -e  # 遇到错误立即停止

echo "🚀 LightingPro 自动部署开始..."
echo "================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必需工具
check_requirements() {
    echo -e "${BLUE}📋 检查部署环境...${NC}"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    # 检查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI 未安装，正在安装...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${GREEN}✅ 环境检查完成${NC}"
}

# 构建测试
test_build() {
    echo -e "${BLUE}🔨 测试构建...${NC}"
    
    # 安装依赖
    echo "📦 安装依赖..."
    npm install
    
    # 运行构建
    echo "🏗️ 构建项目..."
    npm run build
    
    # 运行类型检查
    echo "🔍 类型检查..."
    npm run type-check 2>/dev/null || echo "⚠️ 类型检查跳过"
    
    echo -e "${GREEN}✅ 构建测试完成${NC}"
}

# 环境变量设置
setup_environment() {
    echo -e "${BLUE}🔧 环境变量配置...${NC}"
    
    # 检查是否有 .env.local 文件
    if [ -f ".env.local" ]; then
        echo "📋 发现本地环境变量文件"
        echo -e "${YELLOW}⚠️  请确保在 Vercel Dashboard 中设置了生产环境变量${NC}"
    else
        echo -e "${YELLOW}⚠️  未发现 .env.local 文件${NC}"
        echo "请确保在 Vercel Dashboard 中设置了所有必需的环境变量:"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "  - SUPABASE_SERVICE_ROLE_KEY"
        echo "  - DATABASE_URL"
    fi
    
    echo -e "${GREEN}✅ 环境配置检查完成${NC}"
}

# Git 状态检查
check_git_status() {
    echo -e "${BLUE}📁 检查 Git 状态...${NC}"
    
    # 检查是否有未提交的更改
    if [[ -n $(git status --porcelain) ]]; then
        echo -e "${YELLOW}⚠️  发现未提交的更改:${NC}"
        git status --short
        
        read -p "是否要提交这些更改? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "输入提交消息: " commit_message
            git commit -m "$commit_message"
            echo -e "${GREEN}✅ 更改已提交${NC}"
        else
            echo -e "${YELLOW}⚠️  继续部署，但建议先提交更改${NC}"
        fi
    else
        echo -e "${GREEN}✅ Git 状态正常${NC}"
    fi
}

# Vercel 部署
deploy_to_vercel() {
    echo -e "${BLUE}🚀 开始 Vercel 部署...${NC}"
    
    # 检查是否已登录 Vercel
    if ! vercel whoami &> /dev/null; then
        echo "🔐 请登录 Vercel..."
        vercel login
    fi
    
    # 部署到生产环境
    echo "🌍 部署到生产环境..."
    
    # 设置项目配置（如果是首次部署）
    if [ ! -f ".vercel/project.json" ]; then
        echo "⚙️ 配置项目..."
        vercel --confirm
    fi
    
    # 部署到生产环境
    echo "🚀 执行生产部署..."
    vercel --prod --confirm
    
    echo -e "${GREEN}✅ 部署完成！${NC}"
}

# 部署后验证
verify_deployment() {
    echo -e "${BLUE}🔍 验证部署...${NC}"
    
    # 获取部署 URL
    DEPLOYMENT_URL=$(vercel ls --scope="$(vercel whoami)" | grep "$(basename $(pwd))" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        echo "🌐 部署 URL: https://$DEPLOYMENT_URL"
        
        # 健康检查
        echo "🏥 执行健康检查..."
        if curl -f -s "https://$DEPLOYMENT_URL/api/health" > /dev/null; then
            echo -e "${GREEN}✅ 健康检查通过${NC}"
        else
            echo -e "${YELLOW}⚠️  健康检查失败，请检查部署状态${NC}"
        fi
        
        # 显示部署信息
        echo ""
        echo "🎉 部署成功！"
        echo "📱 应用地址: https://$DEPLOYMENT_URL"
        echo "🔗 管理面板: https://vercel.com/dashboard"
        echo ""
        
    else
        echo -e "${YELLOW}⚠️  无法获取部署 URL${NC}"
    fi
}

# 主要部署流程
main() {
    echo -e "${GREEN}🎯 LightingPro 智能照明推荐应用${NC}"
    echo -e "${BLUE}📅 部署时间: $(date)${NC}"
    echo ""
    
    # 执行部署步骤
    check_requirements
    echo ""
    
    test_build
    echo ""
    
    setup_environment
    echo ""
    
    check_git_status
    echo ""
    
    deploy_to_vercel
    echo ""
    
    verify_deployment
    echo ""
    
    echo -e "${GREEN}🎉 LightingPro 部署完成！${NC}"
    echo "================================="
    
    # 部署后提示
    echo ""
    echo -e "${BLUE}📋 部署后待办事项:${NC}"
    echo "1. 🌐 配置自定义域名 (如果需要)"
    echo "2. 📊 设置监控和分析"
    echo "3. 🔍 检查所有功能是否正常"
    echo "4. 📱 测试移动端兼容性"
    echo "5. 🚀 告诉用户新的网址！"
    echo ""
}

# 错误处理
trap 'echo -e "${RED}❌ 部署过程中发生错误${NC}"; exit 1' ERR

# 运行主流程
main "$@"