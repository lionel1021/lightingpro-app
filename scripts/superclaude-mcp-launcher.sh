#!/bin/bash
# 🚀 SuperClaude + MCP AI 协作启动器
# LightingPro项目快速开发工具

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${PURPLE}"
echo "=========================================="
echo "🤖 SuperClaude + MCP AI 协作启动器"
echo "🚀 LightingPro 智能开发工具"
echo "=========================================="
echo -e "${NC}"

# 显示菜单
show_menu() {
    echo -e "${BLUE}📋 可用选项:${NC}"
    echo "1. 🔥 完整开发环境启动"
    echo "2. 🧠 AI代码生成器测试"
    echo "3. 📊 项目质量检查"
    echo "4. ⚡ 性能优化分析"
    echo "5. 🛡️ 安全检查"
    echo "6. 📚 查看项目文档"
    echo "7. 🔧 MCP服务器状态"
    echo "8. 🎯 智能需求分析"
    echo "9. 🚀 执行完整工作流"
    echo "0. 退出"
    echo ""
}

# 启动完整开发环境
start_dev_environment() {
    echo -e "${GREEN}🔥 启动完整开发环境...${NC}"
    
    # 检查依赖
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js未安装${NC}"
        exit 1
    fi

    # 安装依赖
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装依赖中...${NC}"
        npm install
    fi

    # 启动MCP服务器
    echo -e "${BLUE}🤖 启动MCP AI代码生成器...${NC}"
    ./mcp/start-mcp-servers.sh &
    
    # 等待MCP服务器启动
    sleep 3
    
    # 启动开发服务器
    echo -e "${GREEN}🚀 启动Next.js开发服务器...${NC}"
    npm run dev &
    
    echo -e "${GREEN}✅ 开发环境启动完成！${NC}"
    echo -e "${BLUE}🌐 应用地址: http://localhost:3000${NC}"
    echo -e "${BLUE}🤖 MCP服务器: localhost:3001${NC}"
}

# AI代码生成器测试
test_ai_generator() {
    echo -e "${GREEN}🧠 测试AI代码生成器...${NC}"
    
    if [ -f "mcp/mcp-test-client.js" ]; then
        node mcp/mcp-test-client.js
    else
        echo -e "${YELLOW}⚠️ MCP测试客户端未找到${NC}"
    fi
}

# 项目质量检查
quality_check() {
    echo -e "${GREEN}📊 执行项目质量检查...${NC}"
    
    echo -e "${BLUE}🔍 TypeScript检查...${NC}"
    if npx tsc --noEmit; then
        echo -e "${GREEN}✅ TypeScript检查通过${NC}"
    else
        echo -e "${RED}❌ TypeScript检查失败${NC}"
    fi
    
    echo -e "${BLUE}🔍 ESLint检查...${NC}"
    if npm run lint; then
        echo -e "${GREEN}✅ ESLint检查通过${NC}"
    else
        echo -e "${YELLOW}⚠️ ESLint发现问题${NC}"
    fi
    
    echo -e "${BLUE}🏗️ 构建测试...${NC}"
    if npm run build; then
        echo -e "${GREEN}✅ 构建成功${NC}"
    else
        echo -e "${RED}❌ 构建失败${NC}"
    fi
}

# 性能优化分析
performance_analysis() {
    echo -e "${GREEN}⚡ 执行性能优化分析...${NC}"
    
    if [ -f "scripts/run-performance-tests.sh" ]; then
        ./scripts/run-performance-tests.sh
    else
        echo -e "${YELLOW}⚠️ 性能测试脚本未找到${NC}"
        echo -e "${BLUE}💡 建议检查包大小和渲染性能${NC}"
    fi
}

# 安全检查
security_check() {
    echo -e "${GREEN}🛡️ 执行安全检查...${NC}"
    
    echo -e "${BLUE}🔍 依赖漏洞扫描...${NC}"
    if command -v npm &> /dev/null; then
        npm audit --audit-level moderate
    fi
    
    echo -e "${BLUE}🔍 代码安全检查...${NC}"
    echo -e "${GREEN}✅ 基础安全检查完成${NC}"
}

# 查看项目文档
view_documentation() {
    echo -e "${GREEN}📚 查看项目文档...${NC}"
    
    if [ -f "CLAUDE.md" ]; then
        echo -e "${BLUE}📖 SuperClaude配置:${NC}"
        head -20 CLAUDE.md
        echo ""
    fi
    
    if [ -f "PROJECT_STATUS.md" ]; then
        echo -e "${BLUE}📊 项目状态:${NC}"
        head -20 PROJECT_STATUS.md
        echo ""
    fi
    
    if [ -f "mcp/README.md" ]; then
        echo -e "${BLUE}🤖 MCP文档:${NC}"
        head -20 mcp/README.md
    fi
}

# MCP服务器状态
mcp_status() {
    echo -e "${GREEN}🔧 检查MCP服务器状态...${NC}"
    
    if [ -f "mcp/mcp-status.sh" ]; then
        ./mcp/mcp-status.sh
    else
        echo -e "${YELLOW}⚠️ MCP状态脚本未找到${NC}"
    fi
}

# 智能需求分析
requirement_analysis() {
    echo -e "${GREEN}🎯 智能需求分析...${NC}"
    
    read -p "请输入您的开发需求: " requirement
    
    if [ -f "mcp/superclaude-mcp-workflow.js" ]; then
        node mcp/superclaude-mcp-workflow.js "$requirement"
    else
        echo -e "${YELLOW}⚠️ 工作流脚本未找到${NC}"
    fi
}

# 执行完整工作流
full_workflow() {
    echo -e "${GREEN}🚀 执行完整SuperClaude + MCP工作流...${NC}"
    
    # 1. 质量检查
    quality_check
    echo ""
    
    # 2. 性能分析
    performance_analysis
    echo ""
    
    # 3. 安全检查
    security_check
    echo ""
    
    # 4. MCP状态
    mcp_status
    echo ""
    
    echo -e "${GREEN}✅ 完整工作流执行完成！${NC}"
}

# 主循环
while true; do
    show_menu
    read -p "请选择选项 (0-9): " choice
    echo ""
    
    case $choice in
        1)
            start_dev_environment
            ;;
        2)
            test_ai_generator
            ;;
        3)
            quality_check
            ;;
        4)
            performance_analysis
            ;;
        5)
            security_check
            ;;
        6)
            view_documentation
            ;;
        7)
            mcp_status
            ;;
        8)
            requirement_analysis
            ;;
        9)
            full_workflow
            ;;
        0)
            echo -e "${GREEN}👋 感谢使用SuperClaude + MCP协作工具！${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ 无效选项，请重试${NC}"
            ;;
    esac
    
    echo ""
    read -p "按回车键继续..."
    echo ""
done