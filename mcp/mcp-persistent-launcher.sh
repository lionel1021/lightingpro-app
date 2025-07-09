#!/bin/bash
# 🚀 SuperClaude + MCP 持久化协同工具启动器
# 解决MCP服务器启动后消失的问题

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 项目配置
PROJECT_ROOT="/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"
MCP_DIR="$PROJECT_ROOT/mcp"

log_info() {
    echo -e "${BLUE}[SuperClaude+MCP]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SuperClaude+MCP]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[SuperClaude+MCP]${NC} $1"
}

log_error() {
    echo -e "${RED}[SuperClaude+MCP]${NC} $1"
}

log_ai() {
    echo -e "${PURPLE}[AI增强]${NC} $1"
}

# 显示启动横幅
show_banner() {
    echo -e "${PURPLE}"
    echo "=============================================="
    echo "🧠 SuperClaude + MCP 智能协同工具系统"
    echo "=============================================="
    echo -e "${NC}"
    echo -e "${BLUE}✨ 功能特性:${NC}"
    echo "  🚀 AI智能代码生成"
    echo "  🔍 代码质量分析"
    echo "  🔄 智能重构优化"
    echo "  📊 性能监控分析"
    echo "  🎯 设计模式应用"
    echo ""
}

# 检查系统环境
check_system() {
    log_info "检查系统环境..."
    
    # 检查Node.js版本
    if ! command -v node &> /dev/null; then
        log_error "Node.js未安装"
        exit 1
    fi
    
    local node_version=$(node --version)
    log_info "Node.js版本: $node_version"
    
    # 检查项目目录
    if [ ! -d "$PROJECT_ROOT" ]; then
        log_error "项目目录不存在: $PROJECT_ROOT"
        exit 1
    fi
    
    # 创建必要目录
    mkdir -p "$MCP_DIR/logs"
    mkdir -p "$MCP_DIR/pids"
    
    log_success "系统环境检查完成"
}

# 清理旧进程
cleanup_old_processes() {
    log_info "清理旧的MCP进程..."
    
    # 查找并终止旧的MCP进程
    local old_pids=$(ps aux | grep "mcp.*\.js" | grep -v grep | awk '{print $2}')
    
    if [ ! -z "$old_pids" ]; then
        echo "$old_pids" | while read pid; do
            if [ ! -z "$pid" ]; then
                kill -9 "$pid" 2>/dev/null || true
                log_info "终止旧进程: $pid"
            fi
        done
    fi
    
    # 清理PID文件
    rm -f "$MCP_DIR/pids"/*.pid
    
    log_success "旧进程清理完成"
}

# 启动单个MCP服务器
start_mcp_service() {
    local service_name=$1
    local script_file=$2
    local description=$3
    local port=$4
    
    log_info "启动 $service_name..."
    log_ai "$description"
    
    # 检查脚本文件
    if [ ! -f "$MCP_DIR/$script_file" ]; then
        log_error "脚本文件不存在: $script_file"
        return 1
    fi
    
    # 启动服务器并使用tmux/screen保持会话
    cd "$PROJECT_ROOT"
    
    # 使用nohup确保进程持续运行
    local log_file="$MCP_DIR/logs/${service_name}.log"
    local pid_file="$MCP_DIR/pids/${service_name}.pid"
    
    # 启动进程
    nohup node "$MCP_DIR/$script_file" >> "$log_file" 2>&1 &
    local pid=$!
    
    # 保存PID
    echo $pid > "$pid_file"
    
    # 等待启动
    sleep 3
    
    # 验证进程状态
    if kill -0 $pid 2>/dev/null; then
        log_success "$service_name 启动成功 (PID: $pid, Port: $port)"
        echo "    📝 日志文件: $log_file"
        echo "    🔢 进程ID: $pid"
        return 0
    else
        log_error "$service_name 启动失败"
        cat "$log_file" | tail -10
        return 1
    fi
}

# 启动所有MCP服务
start_all_services() {
    log_info "启动SuperClaude + MCP协同工具集群..."
    echo ""
    
    # 基础MCP服务器
    start_mcp_service \
        "lighting-basic-server" \
        "server.js" \
        "基础MCP服务器 - 数据库操作和系统分析" \
        "3001"
    
    sleep 2
    
    # 智能代码生成器
    start_mcp_service \
        "lighting-smart-codegen" \
        "smart-codegen.js" \
        "智能代码生成器 - 模板生成和模式识别" \
        "3002"
    
    sleep 2
    
    # AI增强专业版
    start_mcp_service \
        "lighting-enhanced-codegen-pro" \
        "enhanced-codegen-pro.js" \
        "AI增强代码生成器专业版 - 深度分析和智能优化" \
        "3003"
    
    echo ""
    log_success "🎉 SuperClaude + MCP协同工具系统启动完成！"
}

# 显示服务状态
show_status() {
    echo ""
    log_info "📊 MCP服务器运行状态:"
    echo ""
    
    local services=("lighting-basic-server" "lighting-smart-codegen" "lighting-enhanced-codegen-pro")
    local running_count=0
    
    for service in "${services[@]}"; do
        local pid_file="$MCP_DIR/pids/${service}.pid"
        
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            
            if kill -0 $pid 2>/dev/null; then
                echo -e "  ${GREEN}✓${NC} $service (PID: $pid) - 🟢 运行中"
                ((running_count++))
            else
                echo -e "  ${RED}✗${NC} $service - 🔴 已停止"
                rm -f "$pid_file"
            fi
        else
            echo -e "  ${YELLOW}⚠${NC} $service - 🟡 未启动"
        fi
    done
    
    echo ""
    if [ $running_count -eq 3 ]; then
        log_success "🚀 所有MCP服务器正常运行！"
    elif [ $running_count -gt 0 ]; then
        log_warning "⚠️ 部分MCP服务器运行中 ($running_count/3)"
    else
        log_error "❌ 没有MCP服务器运行"
    fi
}

# 显示使用指南
show_usage_guide() {
    echo ""
    log_info "🔧 SuperClaude + MCP 使用指南:"
    echo ""
    echo -e "  ${PURPLE}🧠 AI智能工具:${NC}"
    echo "    • ai_analyze_code      - 🔍 AI代码深度分析"
    echo "    • ai_generate_code     - 🚀 AI智能代码生成"
    echo "    • ai_refactor_code     - 🔄 AI代码重构优化"
    echo "    • generate_feature     - 🏗️ 完整功能模块生成"
    echo "    • apply_patterns       - 🎨 设计模式智能应用"
    echo "    • optimize_performance - ⚡ 性能分析和优化"
    echo ""
    echo -e "  ${BLUE}📊 监控命令:${NC}"
    echo "    • 查看状态: $0 status"
    echo "    • 查看日志: tail -f mcp/logs/lighting-enhanced-codegen-pro.log"
    echo "    • 重启系统: $0 restart"
    echo ""
    echo -e "  ${BLUE}🎯 快速测试:${NC}"
    echo "    • 智能生成演示: node mcp/demo-intelligent-codegen.js"
    echo "    • MCP客户端测试: node mcp/mcp-test-client.js"
    echo ""
}

# 实时监控模式
monitor_mode() {
    log_info "进入实时监控模式..."
    echo "按 Ctrl+C 退出监控"
    echo ""
    
    while true; do
        clear
        show_banner
        show_status
        
        echo ""
        log_info "⏰ $(date '+%Y-%m-%d %H:%M:%S') - 系统监控中..."
        
        # 检查日志文件更新
        if [ -f "$MCP_DIR/logs/lighting-enhanced-codegen-pro.log" ]; then
            echo ""
            echo -e "${PURPLE}📋 最新日志 (enhanced-codegen-pro):${NC}"
            tail -3 "$MCP_DIR/logs/lighting-enhanced-codegen-pro.log" 2>/dev/null || echo "  无新日志"
        fi
        
        sleep 10
    done
}

# 停止所有服务
stop_all_services() {
    log_info "停止所有MCP服务..."
    
    local services=("lighting-basic-server" "lighting-smart-codegen" "lighting-enhanced-codegen-pro")
    
    for service in "${services[@]}"; do
        local pid_file="$MCP_DIR/pids/${service}.pid"
        
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            
            if kill -0 $pid 2>/dev/null; then
                kill $pid
                log_info "停止 $service (PID: $pid)"
            fi
            
            rm -f "$pid_file"
        fi
    done
    
    cleanup_old_processes
    log_success "所有MCP服务已停止"
}

# 主函数
main() {
    local command="${1:-start}"
    
    case "$command" in
        "start")
            show_banner
            check_system
            cleanup_old_processes
            start_all_services
            show_status
            show_usage_guide
            ;;
        "stop")
            stop_all_services
            ;;
        "restart")
            show_banner
            stop_all_services
            sleep 2
            check_system
            start_all_services
            show_status
            ;;
        "status")
            show_banner
            show_status
            ;;
        "monitor")
            monitor_mode
            ;;
        "help"|"-h"|"--help")
            show_banner
            echo "用法: $0 [start|stop|restart|status|monitor|help]"
            show_usage_guide
            ;;
        *)
            log_error "未知命令: $command"
            echo "用法: $0 [start|stop|restart|status|monitor|help]"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"