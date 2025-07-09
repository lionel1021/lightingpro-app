# 🚀 LightingPro 生产环境部署指南

> **智能照明推荐应用** - 完整的生产部署解决方案

## 📋 部署前检查清单

### ✅ 安全性检查
- [x] 环境变量已安全隔离
- [x] API输入验证已实现
- [x] 数据库RLS策略已配置
- [x] 安全HTTP头部已设置

### ✅ 性能优化
- [x] Next.js图片优化已启用
- [x] 分层缓存策略已实现
- [x] 构建配置已优化
- [x] Bundle大小已检查 (当前17MB)

### ✅ 代码质量
- [x] TypeScript类型检查通过
- [x] ESLint代码规范检查
- [x] 构建测试成功

## 🏗️ 推荐部署架构

### 选项1: Vercel (推荐) 🌟
- **优势**: 零配置、自动优化、全球CDN
- **适用**: 中小型应用、快速部署
- **成本**: 免费层可用，Pro版$20/月

### 选项2: Cloudflare Pages
- **优势**: 高性能、全球边缘网络、低成本
- **适用**: 静态生成为主的应用
- **成本**: 免费层可用，Pro版$20/月

### 选项3: AWS/阿里云
- **优势**: 企业级、高可用、可扩展
- **适用**: 大型应用、企业部署
- **成本**: 按使用量计费

## 🔧 Vercel 部署步骤 (推荐)

### 1. 环境准备
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login
```

### 2. 项目配置
创建 `vercel.json`:
```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/admin/analytics",
      "permanent": false
    }
  ]
}
```

### 3. 环境变量配置
在Vercel Dashboard设置以下环境变量:

#### 🔒 必需的环境变量
```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# 数据库配置
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

#### 🚀 可选的增强配置
```bash
# Redis缓存 (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# 分析服务
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io

# 邮件服务 (Resend)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com

# 联盟营销
AMAZON_ASSOCIATE_TAG=your-tag
```

### 4. 部署执行
```bash
# 初始化项目
vercel

# 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... 添加其他环境变量

# 部署到生产环境
vercel --prod
```

## 🌐 Cloudflare Pages 部署

### 1. 构建配置
创建 `_worker.js` (Cloudflare Edge Functions):
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // API路由处理
    if (url.pathname.startsWith('/api/')) {
      // 设置CORS头部
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // 转发到Next.js API
      const response = await fetch(request);
      const newResponse = new Response(response.body, response);
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });

      return newResponse;
    }

    // 静态文件处理
    return fetch(request);
  }
};
```

### 2. 部署命令
```bash
# 构建静态文件
npm run build
npm run export  # 如果需要静态导出

# 使用Wrangler部署
npx wrangler pages deploy out
```

## 🗄️ 数据库迁移

### Supabase 生产配置

#### 1. 创建生产项目
```sql
-- 在Supabase Dashboard执行
-- 1. 创建新的生产项目
-- 2. 运行所有迁移脚本
-- 3. 配置RLS策略
-- 4. 设置备份策略
```

#### 2. 数据备份策略
```bash
# 自动备份配置
# 在Supabase Dashboard > Settings > Database
# 启用自动备份: 每日备份，保留30天
# 启用Point-in-time恢复

# 手动备份
pg_dump "postgresql://postgres:password@db.your-project.supabase.co:5432/postgres" > backup.sql
```

## 📊 监控和分析

### 1. 性能监控
```javascript
// app/layout.tsx - 添加Web Vitals
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 2. 错误追踪 (Sentry)
```bash
# 安装Sentry
npm install @sentry/nextjs

# 配置 sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. 日志管理
```javascript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'production') {
      // 发送到日志服务 (如Vercel Logs、CloudWatch)
      console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date().toISOString() }));
    } else {
      console.log(message, meta);
    }
  },
  error: (message: string, error?: Error) => {
    if (process.env.NODE_ENV === 'production') {
      // 发送到错误追踪服务
      console.error(JSON.stringify({ level: 'error', message, error: error?.stack, timestamp: new Date().toISOString() }));
    } else {
      console.error(message, error);
    }
  }
};
```

## 🔒 安全配置

### 1. CSP (Content Security Policy)
```javascript
// next.config.ts - 添加安全头部
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: *.supabase.co *.unsplash.com;
      connect-src 'self' *.supabase.co *.vercel.app;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 2. 环境变量验证
```javascript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

## 📈 性能优化清单

### ✅ 已实现的优化
- [x] Next.js图片优化
- [x] 分层缓存策略
- [x] 代码分割和懒加载
- [x] 现代图片格式 (WebP/AVIF)
- [x] Gzip压缩

### 🚀 生产环境优化
```javascript
// next.config.ts - 生产优化
const productionConfig = {
  // 压缩设置
  compress: true,
  
  // 构建优化
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: ['*.supabase.co', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
  },
  
  // PWA配置 (可选)
  experimental: {
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
    }
  }
};
```

## 🧪 部署测试

### 1. 自动化测试
```bash
# 运行所有测试
npm run test

# 构建测试
npm run build

# 类型检查
npm run type-check

# 安全扫描
npm audit

# 性能测试
npm run lighthouse
```

### 2. 部署后验证
```bash
# 健康检查端点
curl https://your-domain.vercel.app/api/health

# 数据库连接测试
curl https://your-domain.vercel.app/api/test

# 功能测试
curl https://your-domain.vercel.app/api/products/recommendations?room_type=客厅
```

## 📞 故障排除

### 常见问题解决

#### 1. 构建失败
```bash
# 检查依赖
npm install --production

# 清理缓存
rm -rf .next node_modules package-lock.json
npm install

# 类型检查
npm run type-check
```

#### 2. 环境变量问题
```bash
# 验证环境变量
vercel env ls

# 添加缺失变量
vercel env add VARIABLE_NAME
```

#### 3. 数据库连接问题
```bash
# 检查Supabase连接
psql "postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"

# 检查RLS策略
# 在Supabase Dashboard > Authentication > RLS
```

## 🎯 部署成功指标

### 性能目标
- **加载时间**: < 2秒 (First Contentful Paint)
- **响应时间**: < 500ms (API响应)
- **可用性**: > 99.9%
- **错误率**: < 0.1%

### 监控设置
- Vercel Analytics: 实时性能监控
- Supabase Metrics: 数据库性能
- Sentry: 错误追踪和性能监控
- Google Analytics: 用户行为分析

---

## 🎉 部署完成后的后续步骤

1. **域名配置**: 绑定自定义域名
2. **SSL证书**: 确保HTTPS配置
3. **CDN优化**: 配置全球加速
4. **监控设置**: 建立告警机制
5. **备份策略**: 定期数据备份
6. **文档更新**: 维护部署文档

**🚀 准备就绪！LightingPro现在可以安全地部署到生产环境了！**