# CLAUDE.md - LightingPro SuperClaude + MCP 协作配置

## 🚀 项目概述
LightingPro - AI驱动的智能照明推荐应用，集成SuperClaude与MCP AI代码生成器。

## 🛠️ 开发环境
- **框架**: Next.js 15 + TypeScript + Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **缓存**: Redis (Upstash)
- **部署**: Cloudflare Pages
- **AI增强**: MCP (Model Context Protocol) 代码生成器

## ⚡ 快速命令
```bash
# 开发环境 (推荐使用端口9002避免冲突)
npm run dev
# 或者指定端口: npx next dev --port 9002

# 代码检查和类型检查
npm run lint
npm run build

# 🚨 网页无法打开时的紧急修复
# 1. 禁用问题中间件
mv middleware.ts middleware.ts.disabled
# 2. 删除locale路由冲突
rm -rf src/app/[locale]/
# 3. 清理缓存重新构建
rm -rf .next && npm run build
# 4. 使用不同端口启动
npx next dev --port 9002

# MCP AI代码生成器
npm run mcp:server    # 启动MCP服务器
npm run mcp:client    # MCP客户端
./mcp/mcp-status.sh   # 检查MCP状态

# 数据库操作
npm run mcp:db        # 数据库管理
node scripts/run-migrations.js  # 运行迁移
```

## 🧠 SuperClaude + MCP 协作模式

### 智能代码生成流程
1. **需求分析** → SuperClaude理解需求
2. **模式识别** → MCP AI分析代码库
3. **智能生成** → 协作生成优化代码
4. **质量检查** → 自动优化和验证

### MCP AI代码生成器功能
- 🎯 **智能组件生成**: React组件、API路由、数据库函数
- 🔄 **代码重构优化**: 性能优化、模式应用
- 📊 **质量分析**: 类型覆盖率、复杂度分析
- 🛡️ **安全检查**: 漏洞扫描、最佳实践验证

## 🎨 代码规范
- **组件**: PascalCase (ProductCard.tsx)
- **文件**: kebab-case (product-search.tsx)  
- **Hook**: usePrefix (useProductSearch.ts)
- **类型**: TypeSuffix (ProductType)
- **接口**: PropsSuffix (ProductCardProps)

## 📈 质量标准
- **类型覆盖率**: ≥85%
- **代码复杂度**: ≤15
- **测试覆盖率**: ≥70%
- **包大小限制**: ≤500kb
- **可访问性**: WCAG AA级

## 🔧 MCP服务器配置
- **基础服务器**: lighting-basic-server (数据库操作)
- **智能代码生成**: lighting-smart-codegen (模板生成)
- **AI专业版**: lighting-enhanced-codegen-pro (AI增强)

## 🚀 高效工作流

### 新功能开发
1. 使用SuperClaude分析需求和设计
2. 调用MCP AI生成器创建基础代码
3. SuperClaude进行代码审查和优化
4. 运行自动化测试和质量检查

### 代码优化
1. MCP性能分析识别瓶颈
2. SuperClaude提供优化策略
3. AI生成器重构关键代码
4. 验证性能提升效果

### 调试和修复
1. SuperClaude诊断问题根因
2. MCP AI分析相关代码模式
3. 协作生成修复方案
4. 自动化测试验证修复

## 🎯 最佳实践
- 优先使用现有组件和模式
- 遵循项目代码约定
- 确保类型安全
- 保持代码简洁易读
- 定期运行质量检查

## 📊 项目架构
```
src/
├── app/           # Next.js App Router
├── components/    # 可复用组件
├── hooks/         # 自定义Hooks
├── lib/           # 工具库和配置
└── types.ts       # 类型定义

mcp/               # MCP AI代码生成器
├── enhanced-codegen-pro.js  # AI专业版
├── smart-codegen.js         # 智能生成器
└── server.js               # 基础服务器
```

## 🔗 有用链接
- [Supabase仪表板](https://supabase.com/dashboard)
- [MCP文档](./mcp/README.md)
- [项目状态](./PROJECT_STATUS.md)

---
*SuperClaude v2.0.1 + MCP AI代码生成器 | 智能协作开发*