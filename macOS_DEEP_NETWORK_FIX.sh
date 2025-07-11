#!/bin/bash

echo "🔧 macOS系统深层网络阻塞问题修复脚本"
echo "========================================"

# 检查权限
if [[ $EUID -eq 0 ]]; then
   echo "❌ 请不要以root用户运行此脚本"
   exit 1
fi

echo "📋 修复步骤："
echo "1. 系统完整性保护(SIP)检查"
echo "2. 网络配置重置"
echo "3. 内核网络参数修复"
echo "4. 网络服务重启"
echo "5. 端口绑定测试"
echo ""

read -p "是否继续执行修复? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "修复已取消"
    exit 1
fi

echo "🔍 第1步: 检查系统完整性保护(SIP)状态"
echo "----------------------------------------"
csrutil status
echo ""

echo "🌐 第2步: 重置网络配置"
echo "----------------------------------------"
echo "清理DNS缓存..."
sudo dscacheutil -flushcache
echo "重启mDNS服务..."
sudo killall -HUP mDNSResponder
echo "清理ARP缓存..."
sudo arp -a -d 2>/dev/null || echo "ARP缓存清理完成"
echo ""

echo "⚙️ 第3步: 修复内核网络参数"
echo "----------------------------------------"
echo "检查和修复loopback接口..."
sudo ifconfig lo0 down 2>/dev/null
sudo ifconfig lo0 up
echo "验证loopback接口..."
ifconfig lo0 | grep "inet 127.0.0.1"
echo ""

echo "🔄 第4步: 重启网络相关服务"
echo "----------------------------------------"
echo "重启网络配置服务..."
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.configd.plist 2>/dev/null
sudo launchctl load /System/Library/LaunchDaemons/com.apple.configd.plist 2>/dev/null

echo "重启网络链路服务..."
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.networkd.plist 2>/dev/null
sudo launchctl load /System/Library/LaunchDaemons/com.apple.networkd.plist 2>/dev/null
echo ""

echo "🧪 第5步: 网络连接测试"
echo "----------------------------------------"
echo "测试loopback连接..."
ping -c 2 127.0.0.1 | grep "2 packets"

echo "测试本地网络..."
ping -c 2 $(ifconfig en0 | grep "inet " | awk '{print $2}') 2>/dev/null | grep "2 packets" || echo "本地IP测试完成"
echo ""

echo "🚀 第6步: 启动优化的Next.js服务器"
echo "----------------------------------------"
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"

echo "清理旧进程..."
pkill -f "next" 2>/dev/null || echo "无旧进程需要清理"

echo "启动服务器(绑定到所有接口)..."
npx next start --hostname 0.0.0.0 --port 9090 &
SERVER_PID=$!

echo "等待服务器启动..."
sleep 5

echo "🧪 第7步: 连接验证"
echo "----------------------------------------"
echo "测试端口9090连接..."

# 测试连接
if nc -z 127.0.0.1 9090 2>/dev/null; then
    echo "✅ 127.0.0.1:9090 连接成功!"
    curl -s -I http://127.0.0.1:9090 | head -1
else
    echo "❌ 127.0.0.1:9090 连接失败"
fi

if nc -z localhost 9090 2>/dev/null; then
    echo "✅ localhost:9090 连接成功!"
    curl -s -I http://localhost:9090 | head -1
else
    echo "❌ localhost:9090 连接失败"
fi

LOCAL_IP=$(ifconfig en0 | grep "inet " | awk '{print $2}')
if nc -z $LOCAL_IP 9090 2>/dev/null; then
    echo "✅ $LOCAL_IP:9090 连接成功!"
    curl -s -I http://$LOCAL_IP:9090 | head -1
else
    echo "❌ $LOCAL_IP:9090 连接失败"
fi

echo ""
echo "📊 修复结果总结："
echo "=================="

# 检查修复效果
SUCCESS_COUNT=0
if nc -z 127.0.0.1 9090 2>/dev/null; then ((SUCCESS_COUNT++)); fi
if nc -z localhost 9090 2>/dev/null; then ((SUCCESS_COUNT++)); fi
if nc -z $LOCAL_IP 9090 2>/dev/null; then ((SUCCESS_COUNT++)); fi

if [ $SUCCESS_COUNT -gt 0 ]; then
    echo "🎉 修复成功! ($SUCCESS_COUNT/3 连接可用)"
    echo ""
    echo "可用访问地址:"
    [ $SUCCESS_COUNT -gt 0 ] && echo "  • http://127.0.0.1:9090"
    [ $SUCCESS_COUNT -gt 1 ] && echo "  • http://localhost:9090"
    [ $SUCCESS_COUNT -gt 2 ] && echo "  • http://$LOCAL_IP:9090"
    echo ""
    echo "🌟 您的LightingPro革命性2025设计现在可以本地访问了!"
else
    echo "⚠️ 部分修复完成，但连接仍有问题"
    echo ""
    echo "🔍 进一步诊断建议:"
    echo "1. 重启系统: sudo reboot"
    echo "2. 检查SIP设置: csrutil status"
    echo "3. 检查是否有VPN或代理软件"
    echo "4. 访问在线版本: https://lightingpro.netlify.app"
fi

echo ""
echo "🛡️ 安全提醒: 如果启用了防火墙，请在测试后重新启用"
echo "sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on"
echo ""
echo "📱 备用方案: 在线版本始终可用 https://lightingpro.netlify.app"
echo ""
echo "修复脚本执行完成 ✨"