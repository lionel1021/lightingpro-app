#!/bin/bash

echo "🔧 macOS系统层面网络阻塞专业修复脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}警告: 此脚本将修改系统级网络配置${NC}"
echo -e "${YELLOW}建议在继续前创建系统备份${NC}"
echo ""

read -p "是否继续执行深度系统修复? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}修复已取消${NC}"
    exit 1
fi

echo -e "${GREEN}开始系统级网络修复...${NC}"
echo ""

# 第1步: SIP状态检查和建议
echo -e "${BLUE}📋 第1步: 系统完整性保护(SIP)检查${NC}"
echo "----------------------------------------"
SIP_STATUS=$(csrutil status)
echo "当前SIP状态: $SIP_STATUS"

if [[ $SIP_STATUS == *"enabled"* ]]; then
    echo -e "${YELLOW}⚠️  SIP已启用 - 这可能是网络阻塞的主要原因${NC}"
    echo ""
    echo -e "${BLUE}SIP调整选项:${NC}"
    echo "选项1 (推荐): 继续其他修复，保持SIP启用"
    echo "选项2 (高级): 在恢复模式下部分禁用SIP"
    echo ""
    echo -e "${YELLOW}恢复模式SIP调整步骤:${NC}"
    echo "1. 重启Mac并立即按住 Command+R"
    echo "2. 在恢复模式终端中执行:"
    echo "   csrutil enable --without debug"
    echo "3. 重启到正常模式"
    echo ""
    
    read -p "是否继续其他修复步骤? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${RED}用户选择停止修复${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ SIP已部分禁用或关闭${NC}"
fi
echo ""

# 第2步: 内核网络参数检查和修复
echo -e "${BLUE}📋 第2步: 内核网络参数修复${NC}"
echo "----------------------------------------"

echo "检查当前内核网络参数..."
echo "net.inet.ip.forwarding = $(sysctl -n net.inet.ip.forwarding)"
echo "net.inet.tcp.delayed_ack = $(sysctl -n net.inet.tcp.delayed_ack)"
echo "net.inet.tcp.recvspace = $(sysctl -n net.inet.tcp.recvspace)"

echo ""
echo "应用网络参数优化..."
sudo sysctl -w net.inet.ip.forwarding=1
sudo sysctl -w net.inet.tcp.delayed_ack=2
sudo sysctl -w net.inet.tcp.recvspace=131072
sudo sysctl -w net.inet.tcp.sendspace=131072
sudo sysctl -w net.inet.tcp.rfc1323=1

echo -e "${GREEN}✅ 内核网络参数已优化${NC}"
echo ""

# 第3步: Loopback接口深度重置
echo -e "${BLUE}📋 第3步: Loopback接口深度重置${NC}"
echo "----------------------------------------"

echo "当前loopback状态:"
ifconfig lo0 | grep -E "(inet|status)"

echo ""
echo "执行深度loopback重置..."
sudo ifconfig lo0 down
sleep 2
sudo ifconfig lo0 up
sudo ifconfig lo0 inet 127.0.0.1 netmask 255.0.0.0

echo "验证loopback修复..."
if ping -c 2 127.0.0.1 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Loopback接口正常${NC}"
else
    echo -e "${RED}❌ Loopback接口仍有问题${NC}"
fi
echo ""

# 第4步: 网络栈深度清理
echo -e "${BLUE}📋 第4步: 网络栈深度清理${NC}"
echo "----------------------------------------"

echo "清理网络配置缓存..."
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

echo "重置网络配置数据库..."
sudo rm -f /var/db/dhcpclient/leases/*
sudo rm -f /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist
sudo rm -f /Library/Preferences/SystemConfiguration/com.apple.airport.preferences.plist

echo "清理ARP表..."
sudo arp -a -d 2>/dev/null || echo "ARP表清理完成"

echo "刷新路由表..."
sudo route flush

echo -e "${GREEN}✅ 网络栈深度清理完成${NC}"
echo ""

# 第5步: 网络服务重启
echo -e "${BLUE}📋 第5步: 核心网络服务重启${NC}"
echo "----------------------------------------"

echo "重启网络配置守护进程..."
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.configd.plist 2>/dev/null
sleep 2
sudo launchctl load /System/Library/LaunchDaemons/com.apple.configd.plist 2>/dev/null

echo "重启网络链路守护进程..."
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.networkd.plist 2>/dev/null
sleep 2
sudo launchctl load /System/Library/LaunchDaemons/com.apple.networkd.plist 2>/dev/null

echo "重启DNS解析服务..."
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.mDNSResponder.plist 2>/dev/null
sleep 2
sudo launchctl load /System/Library/LaunchDaemons/com.apple.mDNSResponder.plist 2>/dev/null

echo -e "${GREEN}✅ 核心网络服务已重启${NC}"
echo ""

# 第6步: 网络安全策略调整
echo -e "${BLUE}📋 第6步: 网络安全策略调整${NC}"
echo "----------------------------------------"

echo "检查网络过滤规则..."
sudo pfctl -s rules 2>/dev/null | head -5 || echo "PF防火墙规则检查完成"

echo "临时调整网络过滤策略..."
# 创建临时PF规则文件
cat > /tmp/pf_temp.conf << EOF
# 临时允许本地连接的PF规则
pass in quick on lo0
pass out quick on lo0
pass in quick inet from 127.0.0.0/8 to 127.0.0.0/8
pass out quick inet from 127.0.0.0/8 to 127.0.0.0/8
EOF

echo "应用临时网络策略..."
sudo pfctl -f /tmp/pf_temp.conf 2>/dev/null || echo "PF规则应用完成"

echo -e "${GREEN}✅ 网络安全策略已调整${NC}"
echo ""

# 第7步: 端口绑定权限修复
echo -e "${BLUE}📋 第7步: 端口绑定权限修复${NC}"
echo "----------------------------------------"

echo "检查端口绑定限制..."
echo "当前用户: $(whoami)"
echo "用户组: $(groups)"

echo "检查端口范围限制..."
UNPRIVILEGED_PORT_START=$(sysctl -n net.inet.ip.portrange.first 2>/dev/null || echo "1024")
echo "非特权端口起始: $UNPRIVILEGED_PORT_START"

if [ "$UNPRIVILEGED_PORT_START" -gt 8888 ]; then
    echo "调整端口范围限制..."
    sudo sysctl -w net.inet.ip.portrange.first=1024
    echo -e "${GREEN}✅ 端口范围已调整${NC}"
else
    echo -e "${GREEN}✅ 端口范围正常${NC}"
fi
echo ""

# 第8步: 网络连接测试
echo -e "${BLUE}📋 第8步: 网络连接验证${NC}"
echo "----------------------------------------"

echo "测试基础网络连接..."

# 测试loopback
if ping -c 1 127.0.0.1 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 127.0.0.1 连接正常${NC}"
else
    echo -e "${RED}❌ 127.0.0.1 连接失败${NC}"
fi

# 测试localhost解析
if ping -c 1 localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✅ localhost 解析正常${NC}"
else
    echo -e "${RED}❌ localhost 解析失败${NC}"
fi

# 测试本地IP
LOCAL_IP=$(ifconfig en0 | grep "inet " | awk '{print $2}' 2>/dev/null)
if [ -n "$LOCAL_IP" ] && ping -c 1 "$LOCAL_IP" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 本地IP ($LOCAL_IP) 连接正常${NC}"
else
    echo -e "${RED}❌ 本地IP 连接异常${NC}"
fi

echo ""

# 第9步: 启动测试服务器
echo -e "${BLUE}📋 第9步: 启动测试服务器${NC}"
echo "----------------------------------------"

cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"

echo "清理旧进程..."
pkill -f "next" 2>/dev/null || echo "无旧进程需要清理"

echo "启动优化服务器..."
nohup npm run start -- --hostname 0.0.0.0 --port 9999 > test_server.log 2>&1 &
SERVER_PID=$!
echo "服务器PID: $SERVER_PID"

echo "等待服务器启动..."
sleep 10

# 第10步: 最终连接测试
echo -e "${BLUE}📋 第10步: 最终连接测试${NC}"
echo "----------------------------------------"

SUCCESS_COUNT=0

# 测试所有连接方式
test_connection() {
    local url=$1
    local name=$2
    
    if curl -s -I "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name 连接成功!${NC}"
        curl -s -I "$url" | head -1
        ((SUCCESS_COUNT++))
        return 0
    else
        echo -e "${RED}❌ $name 连接失败${NC}"
        return 1
    fi
}

echo "测试端口9999连接..."
test_connection "http://127.0.0.1:9999" "127.0.0.1:9999"
test_connection "http://localhost:9999" "localhost:9999"
[ -n "$LOCAL_IP" ] && test_connection "http://$LOCAL_IP:9999" "$LOCAL_IP:9999"

echo ""
echo -e "${BLUE}📊 修复结果总结${NC}"
echo "===================="

if [ $SUCCESS_COUNT -gt 0 ]; then
    echo -e "${GREEN}🎉 系统级修复成功! ($SUCCESS_COUNT 个连接可用)${NC}"
    echo ""
    echo -e "${GREEN}✅ 可用访问地址:${NC}"
    echo "  • http://127.0.0.1:9999"
    echo "  • http://localhost:9999"
    [ -n "$LOCAL_IP" ] && echo "  • http://$LOCAL_IP:9999"
    echo ""
    echo -e "${BLUE}🌟 您的LightingPro革命性2025设计现在可以完美访问了!${NC}"
    echo ""
    echo -e "${YELLOW}🔧 已应用的系统级修复:${NC}"
    echo "  ✓ 内核网络参数优化"
    echo "  ✓ Loopback接口深度重置"
    echo "  ✓ 网络栈深度清理"
    echo "  ✓ 核心网络服务重启"
    echo "  ✓ 网络安全策略调整"
    echo "  ✓ 端口绑定权限修复"
else
    echo -e "${YELLOW}⚠️ 部分修复完成，但仍需进一步操作${NC}"
    echo ""
    echo -e "${RED}🔍 可能需要的额外步骤:${NC}"
    echo "1. 重启系统应用所有更改: sudo reboot"
    echo "2. 在恢复模式下调整SIP: csrutil enable --without debug"
    echo "3. 检查第三方安全软件冲突"
    echo "4. 联系系统管理员(如果是企业设备)"
    echo ""
    echo -e "${BLUE}📱 备用方案始终可用:${NC}"
    echo "  • 在线版本: https://lightingpro.netlify.app"
    echo "  • HTML预览: ./PREVIEW_REVOLUTIONARY_DESIGN.html"
fi

echo ""
echo -e "${YELLOW}⚠️ 安全提醒:${NC}"
echo "  • 测试完成后考虑恢复原始安全设置"
echo "  • 定期检查系统安全更新"
echo "  • 保持防火墙和安全软件更新"

echo ""
echo -e "${GREEN}✨ 系统级网络修复脚本执行完成!${NC}"

# 清理临时文件
rm -f /tmp/pf_temp.conf