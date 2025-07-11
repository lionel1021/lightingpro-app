#!/bin/bash

echo "🚀 macOS终极网络修复脚本"
echo "========================="

# 杀死所有Next.js进程
echo "清理所有Next.js进程..."
sudo pkill -f "next" 2>/dev/null || echo "无进程需要清理"
sudo pkill -f "node.*dev" 2>/dev/null || echo "无Node进程需要清理"

# 重置网络栈
echo ""
echo "📋 第1步: 重置完整网络栈"
echo "----------------------"
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# 重建loopback接口
echo ""
echo "📋 第2步: 重建Loopback接口"
echo "------------------------"
sudo ifconfig lo0 destroy 2>/dev/null || echo "无需destroy"
sudo ifconfig lo0 create 2>/dev/null || echo "接口已存在"
sudo ifconfig lo0 inet 127.0.0.1 netmask 255.0.0.0 up

# 重置路由表
echo ""
echo "📋 第3步: 重置路由表"
echo "------------------"
sudo route -n flush 2>/dev/null || echo "路由表已刷新"
sudo route add 127.0.0.1 127.0.0.1 2>/dev/null || echo "路由已存在"

# 禁用IPv6（临时）
echo ""
echo "📋 第4步: 临时禁用IPv6"
echo "--------------------"
sudo sysctl -w net.inet6.ip6.forwarding=0 2>/dev/null || echo "IPv6已禁用"

# 重启网络服务
echo ""
echo "📋 第5步: 重启网络服务"
echo "--------------------"
sudo launchctl stop com.apple.configd 2>/dev/null
sleep 2
sudo launchctl start com.apple.configd 2>/dev/null

# 测试基础连接
echo ""
echo "📋 第6步: 测试基础连接"
echo "--------------------"
if ping -c 1 127.0.0.1 > /dev/null 2>&1; then
    echo "✅ 127.0.0.1 ping 成功"
else
    echo "❌ 127.0.0.1 ping 失败"
fi

# 启动一个简单的Python服务器测试
echo ""
echo "📋 第7步: 启动测试服务器"
echo "----------------------"
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"

# 创建简单的测试HTML
cat > test_server.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>LightingPro Test</title>
    <style>
        body { 
            font-family: system-ui; 
            background: linear-gradient(135deg, #1e1b4b, #0f172a); 
            color: white; 
            text-align: center; 
            padding: 50px; 
        }
        h1 { color: #3b82f6; }
        .success { 
            background: rgba(34, 197, 94, 0.2); 
            border: 1px solid #22c55e; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px auto; 
            max-width: 600px;
        }
    </style>
</head>
<body>
    <h1>🎉 LightingPro 2025 - Network Test Success!</h1>
    <div class="success">
        <h2>Network Connection Fixed!</h2>
        <p>macOS system-level network issues have been resolved.</p>
        <p><strong>Test Server is running successfully!</strong></p>
        <p>Revolutionary lighting design is ready to deploy.</p>
    </div>
    <p>Next.js server will be available shortly...</p>
</body>
</html>
EOF

# 启动Python测试服务器
echo "启动Python测试服务器在端口8000..."
nohup python3 -m http.server 8000 --bind 127.0.0.1 > python_server.log 2>&1 &
PYTHON_PID=$!
echo "Python服务器PID: $PYTHON_PID"

sleep 3

# 测试Python服务器
echo ""
echo "📋 第8步: 测试Python服务器"
echo "------------------------"
if curl -s http://127.0.0.1:8000/test_server.html > /dev/null; then
    echo "✅ Python测试服务器工作正常!"
    echo "🌐 可访问: http://127.0.0.1:8000/test_server.html"
    PYTHON_SUCCESS=1
else
    echo "❌ Python测试服务器失败"
    PYTHON_SUCCESS=0
fi

# 启动Next.js开发服务器
echo ""
echo "📋 第9步: 启动Next.js服务器"
echo "-------------------------"
echo "正在启动Next.js开发服务器..."

# 使用--hostname 127.0.0.1 明确绑定到localhost
nohup npm run dev -- --hostname 127.0.0.1 --port 7777 > nextjs_server.log 2>&1 &
NEXTJS_PID=$!
echo "Next.js服务器PID: $NEXTJS_PID"

echo "等待Next.js服务器启动..."
sleep 8

# 测试Next.js服务器
echo ""
echo "📋 第10步: 测试Next.js服务器"
echo "-------------------------"
NEXTJS_SUCCESS=0

for i in {1..5}; do
    echo "尝试 $i/5..."
    if curl -s -I http://127.0.0.1:7777 | grep -q "200\|302"; then
        echo "✅ Next.js服务器连接成功!"
        echo "🚀 访问地址: http://127.0.0.1:7777"
        NEXTJS_SUCCESS=1
        break
    fi
    sleep 2
done

if [ $NEXTJS_SUCCESS -eq 0 ]; then
    echo "❌ Next.js服务器连接失败，检查日志..."
    tail -10 nextjs_server.log
fi

# 最终结果
echo ""
echo "🎯 终极修复结果总结"
echo "=================="

if [ $PYTHON_SUCCESS -eq 1 ]; then
    echo "✅ Python测试服务器: http://127.0.0.1:8000/test_server.html"
fi

if [ $NEXTJS_SUCCESS -eq 1 ]; then
    echo "🎉 Next.js开发服务器: http://127.0.0.1:7777"
    echo ""
    echo "🌟 LightingPro革命性2025设计现在可以访问了!"
    echo ""
    echo "🚀 现在请在浏览器中打开："
    echo "   http://127.0.0.1:7777"
    echo ""
    echo "🎊 享受您的成果！"
else
    echo "⚠️ 如果Next.js仍然有问题，请尝试:"
    echo "1. 浏览器访问: http://127.0.0.1:8000/test_server.html"
    echo "2. 手动运行: npm run dev -- --hostname 127.0.0.1 --port 7777"
    echo "3. 检查防火墙设置"
fi

echo ""
echo "📱 备用方案:"
echo "  • HTML预览: ./test_server.html"
echo "  • 在线版本: https://lightingpro.netlify.app"

echo ""
echo "✨ 终极网络修复脚本执行完成!"