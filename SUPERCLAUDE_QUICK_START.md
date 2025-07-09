# 🚀 SuperClaude + MCP 协同工具快速启动指南

## 📖 概述

SuperClaude + MCP 协同工具是一个强大的AI智能协作系统，集成了多重人格身份切换、智能代码生成、性能分析等功能。

## ⚡ 一键启动（推荐）

### 最简单的启动方式

```bash
# 进入项目目录并一键启动
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app" && ./start-superclaude.sh
```

这将启动交互式菜单，让你选择需要的功能模式。

## 🎯 具体启动指令

### 1. 🤖 AI协同演示（推荐新手）

```bash
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"
node mcp/simple-mcp-demo.js
```

**功能特点：**
- 🔍 AI代码分析
- 🚀 智能代码生成
- 📊 系统性能监控
- 🟢 持久化运行状态

### 2. 🧠 智能身份切换系统

#### 交互模式（推荐）
```bash
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"
node mcp/superclaude-persona-switcher.js
```

#### 自动演示模式
```bash
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"
node mcp/superclaude-persona-switcher.js demo
```

**可用身份：**
- 🏗️ 系统架构师 - 系统设计、架构规划
- 💻 全栈开发者 - 前后端开发、API设计
- 🎨 UI/UX设计师 - 用户体验、界面设计
- 📊 数据科学家 - 数据分析、机器学习
- 🛡️ 网络安全专家 - 安全架构、漏洞分析
- 🚀 产品经理 - 产品规划、需求分析
- ⚡ 性能优化工程师 - 性能调优、监控分析
- 🤝 项目协调者 - 项目管理、团队协作

### 3. 🔧 完整MCP服务器集群

```bash
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"

# 启动所有MCP服务
./mcp/mcp-persistent-launcher.sh start

# 查看运行状态
./mcp/mcp-persistent-launcher.sh status

# 实时监控
./mcp/mcp-persistent-launcher.sh monitor

# 停止所有服务
./mcp/mcp-persistent-launcher.sh stop

# 重启服务
./mcp/mcp-persistent-launcher.sh restart
```

## 🛠️ 高级配置

### 设置命令别名（可选）

在你的shell配置文件中添加别名，实现全局快速启动：

```bash
# 编辑配置文件
nano ~/.zshrc  # 或 ~/.bash_profile

# 添加别名
alias superclaude='cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app" && ./start-superclaude.sh'
alias sc-demo='cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app" && node mcp/simple-mcp-demo.js'
alias sc-persona='cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app" && node mcp/superclaude-persona-switcher.js'

# 重新加载配置
source ~/.zshrc
```

设置后可以在任何目录直接使用：
```bash
superclaude     # 一键启动菜单
sc-demo         # AI协同演示
sc-persona      # 智能身份切换
```

## 📊 系统状态检查

### 检查所有服务状态

```bash
cd "/Users/macbookpro/Documents/claude编码/claude练手/lighting-app"

# 检查LightingPro应用（应该在localhost:3005）
curl -s -I http://localhost:3005 | head -1

# 检查MCP服务器状态
./mcp/mcp-persistent-launcher.sh status

# 查看进程
ps aux | grep node | grep mcp
```

## 🎮 交互式使用指南

### 智能身份切换交互命令

当你启动交互模式后，可以使用以下命令：

```bash
# 特殊命令
status          # 查看当前身份状态
history         # 查看身份切换历史
switch <身份ID>  # 手动切换身份
exit            # 退出系统

# 身份ID列表
architect           # 系统架构师
developer          # 全栈开发者
designer           # UI/UX设计师
data_scientist     # 数据科学家
security_expert    # 网络安全专家
product_manager    # 产品经理
performance_engineer # 性能优化工程师
coordinator        # 项目协调者
```

### 示例对话

```
> 设计一个用户认证系统
[身份切换]🏗️ 激活: 系统架构师
💭 我是系统架构师，专注于构建稳定、可扩展的技术架构。

> 实现登录页面的React组件
[身份切换]💻 激活: 全栈开发者
💭 我是全栈开发者，擅长将想法转化为高质量的代码实现。

> status
当前身份: 💻 全栈开发者
专业领域: 前端开发、后端开发、数据库设计、API开发
```

## 🔧 故障排除

### 常见问题及解决方案

#### 1. 端口占用问题
```bash
# 检查端口占用
lsof -ti:3001,3002,3003,3005

# 终止占用进程
kill -9 $(lsof -ti:3001,3002,3003,3005)
```

#### 2. Node.js版本问题
```bash
# 检查Node.js版本（需要v16+）
node --version

# 如果版本过低，更新Node.js
# 使用nvm管理版本（推荐）
```

#### 3. 权限问题
```bash
# 给脚本添加执行权限
chmod +x start-superclaude.sh
chmod +x mcp/*.sh
```

#### 4. 重置所有服务
```bash
# 停止所有相关进程
pkill -f "node.*mcp"
pkill -f "next"

# 重新启动
./start-superclaude.sh
```

## 🏗️ 项目结构

```
lighting-app/
├── start-superclaude.sh                    # 🚀 一键启动脚本
├── mcp/                                     # MCP协同工具目录
│   ├── simple-mcp-demo.js                  # 🤖 AI协同演示
│   ├── superclaude-persona-switcher.js     # 🧠 智能身份切换
│   ├── mcp-persistent-launcher.sh          # 🔧 MCP服务器管理
│   ├── enhanced-codegen-pro.js             # 🎯 AI代码生成器
│   ├── smart-codegen.js                    # 🚀 智能代码生成
│   ├── server.js                           # 📡 基础MCP服务器
│   └── logs/                                # 📝 日志文件
└── src/                                     # 主应用源码
```

## 📚 功能说明

### SuperClaude + MCP 核心功能

1. **🧠 智能身份切换**
   - 基于任务内容自动切换专业身份
   - 8个专业身份覆盖开发全流程
   - 智能关键词识别和上下文分析

2. **🤖 AI协同工具**
   - 代码质量分析和建议
   - 智能代码生成和模板
   - 系统性能监控和优化
   - 实时状态监控

3. **🔧 MCP服务器集群**
   - 分布式服务架构
   - 可扩展的工具集
   - 持久化运行机制
   - 实时日志监控

## 🎯 使用建议

1. **新手推荐：** 先使用 `./start-superclaude.sh` 体验各种功能
2. **开发工作：** 使用智能身份切换进行任务分析和代码生成
3. **系统监控：** 使用MCP服务器集群进行持续监控
4. **学习探索：** 查看日志文件了解AI工作原理

## 🔗 相关文件

- [项目总览](./README.md)
- [MCP文档](./mcp/README.md)
- [数据库设置](./SETUP_DATABASE.md)
- [部署指南](./PROJECT_STATUS.md)

---

**🎉 享受SuperClaude + MCP协同工具带来的AI增强开发体验！**

*最后更新：2025-07-07*