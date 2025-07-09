#!/bin/bash

# 🚀 LightingPro 快速部署到 Vercel 免费域名

set -e

echo "🚀 LightingPro 快速部署开始..."
echo "================================"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否登录 Vercel
check_vercel_login() {
    echo -e "${BLUE}🔐 检查Vercel登录状态...${NC}"
    
    if ! vercel whoami &> /dev/null; then
        echo -e "${RED}❌ 未登录Vercel${NC}"
        echo -e "${YELLOW}请先运行: vercel login${NC}"
        echo -e "${YELLOW}选择 'Continue with GitHub' 登录${NC}"
        exit 1
    fi
    
    USERNAME=$(vercel whoami)
    echo -e "${GREEN}✅ 已登录为: $USERNAME${NC}"
}

# 测试构建
test_build() {
    echo -e "${BLUE}🔨 测试构建...${NC}"
    
    if npm run build; then
        echo -e "${GREEN}✅ 构建成功${NC}"
    else
        echo -e "${RED}❌ 构建失败${NC}"
        exit 1
    fi
}

# 初始化 Vercel 项目
init_vercel_project() {
    echo -e "${BLUE}⚙️ 初始化Vercel项目...${NC}"
    
    # 如果是第一次部署
    if [ ! -f ".vercel/project.json" ]; then
        echo -e "${YELLOW}首次部署，配置项目...${NC}"
        
        # 自动配置项目
        vercel --yes --name="lightingpro-$(date +%s)" || {
            echo -e "${RED}❌ 项目初始化失败${NC}"
            exit 1
        }
    else
        echo -e "${GREEN}✅ 项目已存在${NC}"
    fi
}

# 部署到 Vercel
deploy_to_vercel() {
    echo -e "${BLUE}🚀 部署到Vercel...${NC}"
    
    # 部署到预览环境
    echo "📦 部署到预览环境..."
    PREVIEW_URL=$(vercel --yes 2>/dev/null | grep -E "https://.*\.vercel\.app" | head -1)
    
    if [ -n "$PREVIEW_URL" ]; then
        echo -e "${GREEN}✅ 预览部署成功${NC}"
        echo -e "${BLUE}🔗 预览地址: $PREVIEW_URL${NC}"
        
        # 部署到生产环境
        echo "🌍 部署到生产环境..."
        PRODUCTION_URL=$(vercel --prod --yes 2>/dev/null | grep -E "https://.*\.vercel\.app" | head -1)
        
        if [ -n "$PRODUCTION_URL" ]; then
            echo -e "${GREEN}✅ 生产部署成功${NC}"
            echo -e "${BLUE}🌐 生产地址: $PRODUCTION_URL${NC}"
        else
            echo -e "${YELLOW}⚠️ 生产部署可能需要手动确认${NC}"
        fi
    else
        echo -e "${RED}❌ 部署失败${NC}"
        exit 1
    fi
}

# 验证部署
verify_deployment() {
    echo -e "${BLUE}🔍 验证部署...${NC}"
    
    # 获取项目信息
    PROJECT_INFO=$(vercel ls 2>/dev/null | head -5)
    
    if [ -n "$PROJECT_INFO" ]; then
        echo -e "${GREEN}✅ 项目信息:${NC}"
        echo "$PROJECT_INFO"
        
        # 尝试获取最新部署 URL
        LATEST_URL=$(vercel ls --scope="$(vercel whoami)" 2>/dev/null | grep -E "https://.*\.vercel\.app" | head -1 | awk '{print $2}')
        
        if [ -n "$LATEST_URL" ]; then
            echo -e "${BLUE}🎉 最新部署地址: https://$LATEST_URL${NC}"
            
            # 健康检查
            echo "🏥 执行健康检查..."
            if curl -f -s "https://$LATEST_URL/api/health" > /dev/null; then
                echo -e "${GREEN}✅ 应用运行正常${NC}"
            else
                echo -e "${YELLOW}⚠️ 健康检查失败，但应用可能仍在启动中${NC}"
            fi
        fi
    fi
}

# 主函数
main() {
    echo -e "${GREEN}🎯 LightingPro - 智能照明推荐应用${NC}"
    echo -e "${BLUE}📅 部署时间: $(date)${NC}"
    echo ""
    
    check_vercel_login
    echo ""
    
    test_build
    echo ""
    
    init_vercel_project
    echo ""
    
    deploy_to_vercel
    echo ""
    
    verify_deployment
    echo ""
    
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo "================================"
    echo ""
    echo -e "${BLUE}📋 接下来可以做的事情:${NC}"
    echo "1. 🌐 访问你的应用"
    echo "2. 📊 在 Vercel Dashboard 查看部署状态"
    echo "3. 🔧 如需要，可以添加自定义域名"
    echo "4. 📈 配置环境变量优化功能"
    echo ""
    echo -e "${YELLOW}💡 提示: 可以在 https://vercel.com/dashboard 管理你的项目${NC}"
}

# 错误处理
trap 'echo -e "${RED}❌ 部署过程中发生错误${NC}"; exit 1' ERR

# 运行主函数
main "$@"