'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
  robots?: string;
  schema?: any;
}

// 🎯 智能SEO数据生成器
const generateSEOData = (pathname: string): SEOData => {
  const baseUrl = 'https://lightingpro.vercel.app';
  
  const seoMap: Record<string, SEOData> = {
    '/': {
      title: 'LightingPro - AI驱动的智能照明推荐系统 | 专业照明解决方案',
      description: '使用AI神经网络技术为您推荐完美的照明产品。专业的照明专家团队为您提供个性化的照明方案，涵盖LED灯具、智能照明、装饰灯具等产品。',
      keywords: ['智能照明', 'AI推荐', 'LED灯具', '照明设计', '智能家居', '照明产品', '节能灯具', '装饰照明'],
      ogTitle: 'LightingPro - 革命性的AI照明推荐平台',
      ogDescription: '体验下一代智能照明推荐系统，让AI为您找到完美的照明解决方案',
      ogImage: `${baseUrl}/og-image-home.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      schema: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "LightingPro",
        "description": "AI驱动的智能照明推荐系统",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    },
    '/products': {
      title: '产品目录 - LightingPro照明产品大全 | 智能LED灯具商城',
      description: '浏览我们精选的照明产品系列，包括LED灯泡、智能照明系统、装饰灯具、户外照明等。所有产品经过专业测试，品质保证。',
      keywords: ['照明产品', 'LED灯泡', '智能照明', '装饰灯具', '户外照明', '吸顶灯', '台灯', '落地灯'],
      ogTitle: 'LightingPro产品目录 - 专业照明产品商城',
      ogDescription: '发现适合您的完美照明产品，从智能LED到装饰灯具，应有尽有',
      ogImage: `${baseUrl}/og-image-products.jpg`,
      schema: {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "LightingPro照明产品系列",
        "description": "专业照明产品商城，提供LED灯具、智能照明等产品",
        "brand": {
          "@type": "Brand",
          "name": "LightingPro"
        }
      }
    },
    '/questionnaire': {
      title: 'AI照明推荐问卷 - 获取个性化照明方案 | LightingPro',
      description: '通过我们的智能问卷系统，AI将根据您的生活方式、空间需求和偏好，为您推荐最适合的照明产品和解决方案。',
      keywords: ['照明推荐', 'AI问卷', '个性化照明', '照明咨询', '智能推荐系统'],
      ogTitle: 'AI照明推荐 - 个性化照明解决方案',
      ogDescription: '让AI了解您的需求，获取专属的照明推荐方案',
      ogImage: `${baseUrl}/og-image-questionnaire.jpg`,
      schema: {
        "@context": "https://schema.org",
        "@type": "Survey",
        "name": "LightingPro AI照明推荐问卷",
        "description": "智能照明需求分析和产品推荐服务"
      }
    },
    '/recommendations': {
      title: '个性化推荐结果 - AI智能照明方案 | LightingPro',
      description: '基于您的需求分析，我们的AI系统为您精心挑选的照明产品推荐。每个推荐都经过深度学习算法优化，确保满足您的具体需求。',
      keywords: ['照明推荐结果', 'AI分析', '个性化方案', '智能推荐', '照明解决方案'],
      ogTitle: '您的专属照明推荐方案 - LightingPro',
      ogDescription: 'AI为您量身定制的照明产品推荐，满足您的个性化需求',
      ogImage: `${baseUrl}/og-image-recommendations.jpg`
    }
  };

  return seoMap[pathname] || seoMap['/'];
};

// 🚀 SEO优化Hook
export const useSEO = (customSEO?: Partial<SEOData>) => {
  const pathname = usePathname();
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  useEffect(() => {
    const baseSEO = generateSEOData(pathname);
    const finalSEO = { ...baseSEO, ...customSEO };
    setSeoData(finalSEO);
  }, [pathname, customSEO]);

  return seoData;
};

// 📊 结构化数据组件
export const StructuredData = ({ schema }: { schema: any }) => {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
};

// 🎯 SEO优化器主组件
export const SEOOptimizer = ({ customSEO }: { customSEO?: Partial<SEOData> }) => {
  const seoData = useSEO(customSEO);
  const pathname = usePathname();

  if (!seoData) return null;

  const canonicalUrl = `https://lightingpro.vercel.app${pathname}`;

  return (
    <>
      <Head>
        {/* 基础SEO */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords.join(', ')} />
        <meta name="robots" content={seoData.robots || 'index, follow'} />
        <link rel="canonical" href={seoData.canonical || canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.ogTitle || seoData.title} />
        <meta property="og:description" content={seoData.ogDescription || seoData.description} />
        <meta property="og:type" content={seoData.ogType || 'website'} />
        <meta property="og:url" content={canonicalUrl} />
        {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
        <meta property="og:site_name" content="LightingPro" />
        <meta property="og:locale" content="zh_CN" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content={seoData.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={seoData.ogTitle || seoData.title} />
        <meta name="twitter:description" content={seoData.ogDescription || seoData.description} />
        {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}
        
        {/* 移动端优化 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* 性能优化 */}
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        
        {/* PWA支持 */}
        <meta name="theme-color" content="#1e40af" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* 语言和地区 */}
        <meta httpEquiv="content-language" content="zh-CN" />
        <meta name="geo.region" content="CN" />
        <meta name="geo.country" content="China" />
        
        {/* 版权和作者 */}
        <meta name="author" content="LightingPro Team" />
        <meta name="copyright" content="© 2025 LightingPro. All rights reserved." />
        
        {/* 安全性 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </Head>
      
      {/* 结构化数据 */}
      {seoData.schema && <StructuredData schema={seoData.schema} />}
    </>
  );
};

// 🏪 产品页面专用SEO组件
export const ProductSEO = ({ 
  product,
  images = []
}: { 
  product: any;
  images?: string[];
}) => {
  const customSEO: Partial<SEOData> = {
    title: `${product.name} - ${product.brand} | LightingPro专业照明`,
    description: `${product.name}，来自${product.brand}的优质照明产品。${product.description || '专业照明解决方案，品质保证。'} 现价¥${product.price}，支持在线咨询和购买。`,
    keywords: [product.name, product.brand, product.category, '照明产品', 'LED灯具'],
    ogTitle: `${product.name} - 专业照明产品`,
    ogDescription: `${product.name}，${product.brand}品牌，现价¥${product.price}`,
    ogImage: product.image_urls?.[0] || '/og-image-product-default.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "offers": {
        "@type": "Offer",
        "url": `https://lightingpro.vercel.app/products/${product.id}`,
        "priceCurrency": "CNY",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "LightingPro"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.review_count || 1
      } : undefined,
      "image": images.length ? images : [product.image_urls?.[0]].filter(Boolean)
    }
  };

  return <SEOOptimizer customSEO={customSEO} />;
};

// 📱 移动端性能监控Meta标签
export const MobilePerformanceMeta = () => {
  return (
    <>
      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* 关键CSS内联 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for immediate rendering */
          body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          .hero-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e40af, #7c3aed); }
        `
      }} />
      
      {/* 性能提示 */}
      <meta name="resource-hints" content="prefetch, preload, preconnect" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      
      {/* Service Worker注册 */}
      <script dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then((registration) => console.log('SW registered'))
                .catch((registrationError) => console.log('SW registration failed'));
            });
          }
        `
      }} />
    </>
  );
};

export default SEOOptimizer;