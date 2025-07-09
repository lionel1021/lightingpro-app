#!/bin/bash
# 🚀 SuperClaude + MCP 一键启动脚本

echo "🧠 SuperClaude + MCP 协同工具启动器"
echo "===================================="
echo ""
echo "选择启动模式："
echo "1. 🎯 AI协同演示 (推荐)"
echo "2. 🧠 智能身份切换 - 交互模式"
echo "3. 🎭 智能身份切换 - 自动演示"
echo "4. 🔧 完整MCP服务器集群"
echo "5. 📊 查看系统状态"
echo ""

read -p "请选择 (1-5): " choice

case $choice in
    1)
        echo "🚀 启动AI协同演示..."
        node mcp/simple-mcp-demo.js
        ;;
    2)
        echo "🧠 启动智能身份切换 (交互模式)..."
        node mcp/superclaude-persona-switcher.js
        ;;
    3)
        echo "🎭 启动智能身份切换 (自动演示)..."
        node mcp/superclaude-persona-switcher.js demo
        ;;
    4)
        echo "🔧 启动完整MCP服务器集群..."
        ./mcp/mcp-persistent-launcher.sh start
        ;;
    5)
        echo "📊 系统状态："
        echo ""
        echo "🌐 LightingPro应用:"
        curl -s -I http://localhost:3005 | head -1 || echo "  ❌ 未运行"
        echo ""
        echo "🤖 MCP服务器:"
        ./mcp/mcp-persistent-launcher.sh status
        ;;
    *)
        echo "❌ 无效选择，默认启动AI协同演示..."
        node mcp/simple-mcp-demo.js
        ;;
esac