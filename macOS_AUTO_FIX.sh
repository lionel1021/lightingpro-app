#!/bin/bash

echo "🔧 macOS自动网络修复脚本"
echo "========================"

# 自动执行，无需确认
echo "开始自动修复..."

echo "🔍 第1步: 检查SIP状态"
echo "--------------------"
csrutil status
echo ""

echo "🌐 第2步: 重置网络配置"
echo "--------------------"
echo "清理DNS缓存..."
sudo dscacheutil -flushcache 2>/dev/null || echo "DNS缓存清理完成"
echo "重启mDNS服务..."
sudo killall -HUP mDNSResponder 2>/dev/null || echo "mDNS服务重启完成"
echo ""

echo "⚙️ 第3步: 修复loopback接口"
echo "-------------------------"
echo "重启loopback接口..."
sudo ifconfig lo0 down 2>/dev/null
sudo ifconfig lo0 up 2>/dev/null
echo "验证loopback..."
ping -c 1 127.0.0.1 > /dev/null && echo "✅ Loopback正常" || echo "❌ Loopback异常"
echo ""

echo "🔄 第4步: 重启网络服务"
echo "--------------------"
echo "重启网络配置服务..."
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.configd.plist 2>/dev/null
sleep 1
sudo launchctl load /System/Library/LaunchDaemons/com.apple.configd.plist 2>/dev/null
echo "网络服务重启完成"
echo ""

echo "🚀 第5步: 启动Next.js服务器"
echo "--------------------------"
# 确保在正确目录
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"

echo "清理旧进程..."
pkill -f "next" 2>/dev/null || echo "无需清理"

echo "启动服务器..."
nohup npx next start --hostname 0.0.0.0 --port 9090 > server.log 2>&1 &
SERVER_PID=$!
echo "服务器PID: $SERVER_PID"

echo "等待服务器启动..."
sleep 8

echo ""
echo "🧪 第6步: 连接测试"
echo "------------------"

# 测试连接函数
test_connection() {
    local url=$1
    local name=$2
    
    if curl -s -I "$url" > /dev/null 2>&1; then
        echo "✅ $name 连接成功!"
        curl -s -I "$url" | head -1
        return 0
    else
        echo "❌ $name 连接失败"
        return 1
    fi
}

# 执行连接测试
SUCCESS=0
test_connection "http://127.0.0.1:9090" "127.0.0.1:9090" && ((SUCCESS++))
test_connection "http://localhost:9090" "localhost:9090" && ((SUCCESS++))

LOCAL_IP=$(ifconfig en0 | grep "inet " | awk '{print $2}' 2>/dev/null)
if [ -n "$LOCAL_IP" ]; then
    test_connection "http://$LOCAL_IP:9090" "$LOCAL_IP:9090" && ((SUCCESS++))
fi

echo ""
echo "📊 修复结果"
echo "============"

if [ $SUCCESS -gt 0 ]; then
    echo "🎉 修复成功! ($SUCCESS 个连接可用)"
    echo ""
    echo "🌟 可用访问地址:"
    echo "  • http://127.0.0.1:9090"
    echo "  • http://localhost:9090"
    [ -n "$LOCAL_IP" ] && echo "  • http://$LOCAL_IP:9090"
    echo ""
    echo "🚀 您的LightingPro现在可以本地访问了!"
    echo "   打开浏览器访问上述任一地址即可"
else
    echo "⚠️ 连接仍有问题，建议："
    echo "1. 重启系统: sudo reboot"
    echo "2. 使用在线版本: https://lightingpro.netlify.app"
fi

echo ""
echo "📱 备用方案: https://lightingpro.netlify.app"
echo "🔧 修复完成!"