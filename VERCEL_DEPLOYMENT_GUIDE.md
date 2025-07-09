# 🚀 Vercel部署和免费域名使用指南

## 📋 部署步骤

### 1️⃣ 准备工作
```bash
# 确保项目构建正常
npm run build

# 安装Vercel CLI (已完成)
npm install -g vercel

# 登录Vercel账户
vercel login
```

### 2️⃣ 部署项目
```bash
# 在项目根目录执行
vercel

# 首次部署会询问：
# - Link to existing project? N
# - Project name? lighting-app (或自定义)
# - Directory? ./ (当前目录)
# - Override settings? N (使用vercel.json配置)
```

### 3️⃣ 生产环境部署
```bash
# 部署到生产环境
vercel --prod
```

## 🌐 免费域名方案

### 方案A：Vercel免费子域名 ⭐推荐
- **格式**: `your-project-name.vercel.app`
- **优势**: 
  - ✅ 完全免费
  - ✅ 自动HTTPS
  - ✅ 全球CDN
  - ✅ 即时部署
- **示例**: `lighting-pro.vercel.app`

### 方案B：自定义Vercel域名
- **要求**: 拥有自己的域名
- **配置**: 在Vercel Dashboard添加自定义域名
- **优势**: 品牌域名，专业性强

### 方案C：免费域名服务
#### Freenom (免费)
- **域名**: `.tk`, `.ga`, `.cf`, `.ml`
- **网址**: freenom.com
- **配置**: DNS指向Vercel

#### No-IP (免费)
- **域名**: 多种免费子域名
- **网址**: noip.com
- **限制**: 需要定期确认

#### DuckDNS (免费)
- **域名**: `.duckdns.org`
- **网址**: duckdns.org
- **特点**: 简单易用

## ⚙️ 环境变量配置

### 在Vercel Dashboard设置
```env
# 数据库配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis配置
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# 其他配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📊 自动部署配置

### GitHub集成
1. 连接GitHub仓库
2. 每次Push自动部署
3. PR预览环境

### 部署脚本
```json
{
  "scripts": {
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",
    "deploy:check": "curl -f https://your-domain.vercel.app/api/health"
  }
}
```

## 🎯 推荐域名

### 照明应用相关
- `lighting-pro.vercel.app`
- `smart-lights.vercel.app`
- `illuminate-ai.vercel.app`
- `lightfinder.vercel.app`
- `lumina-app.vercel.app`

### 品牌导向
- `lightingpro-ai.vercel.app`
- `your-brand-lighting.vercel.app`
- `ai-lighting-studio.vercel.app`

## 🔧 域名优化建议

### SEO优化
```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  }
}
```

### 性能优化
- 启用Edge Caching
- 配置CDN
- 优化图片加载

## 🚀 部署检查清单

### 部署前
- [ ] 构建成功 (`npm run build`)
- [ ] 类型检查通过 (`npm run type-check`)
- [ ] 环境变量配置完整
- [ ] 数据库连接正常

### 部署后
- [ ] 网站可访问
- [ ] API接口正常
- [ ] 数据库连接正常
- [ ] 缓存配置生效
- [ ] HTTPS证书有效

## 📈 监控和维护

### Vercel Analytics
- 启用Web Analytics
- 监控性能指标
- 查看访问统计

### 自定义监控
```typescript
// 健康检查端点
// /api/health
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
}
```

## 🔒 安全配置

### 域名安全
- 启用HSTS
- 配置CSP
- 设置安全头部

### Vercel配置
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

## 🎁 免费资源推荐

### 图标和Logo
- [Lucide Icons](https://lucide.dev) - 免费图标库
- [Heroicons](https://heroicons.com) - 精美图标
- [Tabler Icons](https://tabler-icons.io) - 丰富图标集

### 字体
- [Google Fonts](https://fonts.google.com) - 免费字体
- [Font Awesome](https://fontawesome.com) - 图标字体

### 图片
- [Unsplash](https://unsplash.com) - 免费高质量图片
- [Pexels](https://pexels.com) - 免费图片库

## 💡 高级技巧

### 多环境部署
```bash
# 开发环境
vercel --target development

# 预览环境
vercel --target preview

# 生产环境
vercel --target production
```

### 自定义构建
```json
{
  "build": {
    "env": {
      "ENABLE_EXPERIMENTAL_FEATURES": "true"
    }
  }
}
```

## 🆘 常见问题

### Q: 部署失败怎么办？
A: 检查构建日志，通常是依赖或环境变量问题

### Q: 域名不可访问？
A: 等待DNS传播，通常需要几分钟到几小时

### Q: 如何回滚部署？
A: 在Vercel Dashboard的Deployments页面选择之前的版本

### Q: 如何设置自定义404页面？
A: 创建 `pages/404.tsx` 或 `app/not-found.tsx`

---

🚀 **立即部署你的照明推荐应用！**