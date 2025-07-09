# 🚨 网页无法打开问题解决指南

## 问题症状
- Next.js 显示 "✓ Ready in XXXXms" 但网页无法访问
- curl 提示 "Connection refused"
- 端口显示在监听但实际无响应

## 🔍 根本原因分析

### 1. **主要问题：next-intl 中间件阻塞** ⭐ 最关键
```javascript
// middleware.ts 中的问题代码
import createMiddleware from 'next-intl/middleware';
export default createMiddleware({
  locales, defaultLocale, localePrefix: 'as-needed'
});
```

**症状**: Next.js 启动成功但所有请求被中间件拦截
**解决方案**: 
```bash
# 禁用问题中间件
mv middleware.ts middleware.ts.disabled
```

### 2. **构建错误：next-intl 路由冲突**
```bash
Error: `useTranslations` is not callable within an async component
Export encountered an error on /[locale]/page: /en
```

**解决方案**:
```bash
# 删除冲突的locale路由
rm -rf src/app/[locale]/
```

### 3. **Next.js 15 组件传递函数错误**
```bash
Error: Event handlers cannot be passed to Client Component props
{onProductSelect: function onProductSelect, onAddToCart: ...}
```

**解决方案**: 简化组件，避免传递函数props给客户端组件

### 4. **端口冲突问题**
**症状**: 特定端口无法连接
**解决方案**: 使用不同端口范围 (如 9000+ 端口)

## ⚡ 快速修复流程

### 步骤1: 检查并禁用问题中间件
```bash
cd your-nextjs-project
# 检查是否有middleware.ts
ls middleware.ts

# 如果存在，先备份再禁用
mv middleware.ts middleware.ts.backup
```

### 步骤2: 清理next-intl相关路由
```bash
# 检查是否有[locale]文件夹
ls src/app/[locale]/

# 如果存在，删除它
rm -rf src/app/[locale]/
```

### 步骤3: 清理构建缓存
```bash
rm -rf .next
npm run build
```

### 步骤4: 使用不同端口启动
```bash
# 避免使用常见端口3000-8080
npx next dev --port 9002
```

### 步骤5: 验证修复
```bash
# 测试连接
curl -I http://localhost:9002

# 测试主要页面
curl -s http://localhost:9002 | head -5
curl -s http://localhost:9002/products | head -5
```

## 🔧 预防措施

### 1. 避免复杂中间件配置
- 如果不使用国际化，不要安装next-intl
- 中间件要谨慎配置路径匹配规则

### 2. Next.js 15 最佳实践
- 避免将函数作为props传递给'use client'组件
- 使用事件处理器时直接在组件内定义

### 3. 端口管理
- 开发时使用9000+端口避免冲突
- 检查端口占用: `lsof -i :PORT`

### 4. 构建验证
- 修改配置后总是先运行 `npm run build`
- 检查构建日志中的prerender错误

## 📋 诊断检查清单

当网页无法打开时，按顺序检查：

- [ ] Next.js进程是否真的在运行? `ps aux | grep next`
- [ ] 端口是否在监听? `lsof -i :PORT`
- [ ] 是否有middleware.ts文件? `ls middleware.ts`
- [ ] 是否有[locale]路由? `ls src/app/[locale]/`
- [ ] 构建是否成功? `npm run build`
- [ ] 是否有ESLint/TypeScript错误?

## 🚀 成功标志

修复成功后应该看到：
```bash
✓ Ready in 2.6s
GET / 200 in 42ms          # 快速响应
GET /products 200 in 116ms # 所有页面正常
```

## 📝 常见错误模式

1. **"Ready" 但连接拒绝** = 中间件问题
2. **构建失败 + locale错误** = next-intl配置问题  
3. **函数props错误** = Next.js 15兼容性问题
4. **端口冲突** = 网络环境问题

---
**最后更新**: 2025-07-08
**验证环境**: Next.js 15.3.5, Node.js v24.3.0
**成功案例**: LightingPro项目完全修复