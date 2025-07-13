import Head from 'next/head'
import { ProductStructuredData, WebSiteStructuredData, OrganizationStructuredData } from './StructuredData'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  productData?: {
    name: string
    price: number
    currency: string
    brand: string
    category: string
    rating: number
    reviewCount: number
    availability: 'in stock' | 'out of stock'
  }
}

export function SEOHead({
  title = 'LightingPro - AI-Powered Lighting Recommendations',
  description = 'Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from premium brands like Philips, Xiaomi, and IKEA.',
  keywords = 'lighting, smart home, LED lights, pendant lights, table lamps, ceiling lights, recommendations, AI, home improvement',
  image = '/og-image.jpg',
  url = 'https://lightingpro.app',
  type = 'website',
  productData
}: SEOHeadProps) {
  const siteTitle = 'LightingPro'
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`
  const canonicalUrl = url

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="LightingPro Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lightingpro" />
      <meta name="twitter:creator" content="@lightingpro" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

    </Head>
  )
}

// 结构化数据组件（在layout中使用）
export function StructuredDataComponents({ 
  type, 
  productData, 
  description, 
  image, 
  canonicalUrl, 
  siteTitle 
}: {
  type: string
  productData?: any
  description: string
  image: string
  canonicalUrl: string
  siteTitle: string
}) {
  return (
    <>
      {/* 产品结构化数据 */}
      {productData && (
        <ProductStructuredData
          productData={productData}
          description={description}
          image={image}
          url={canonicalUrl}
        />
      )}

      {/* 网站结构化数据 */}
      {type === 'website' && (
        <WebSiteStructuredData
          siteTitle={siteTitle}
          description={description}
          url={canonicalUrl}
        />
      )}

      {/* 组织结构化数据 */}
      <OrganizationStructuredData
        siteTitle={siteTitle}
        url={canonicalUrl}
      />
    </>
  )
}

// 页面特定的 SEO 组件
export function ProductSEO({ product }: { product: any }) {
  return (
    <SEOHead
      title={`${product.name} - Premium ${product.category?.name || 'Lighting'}`}
      description={`${product.description} Starting at $${product.price}. Get this ${product.brand?.name || 'premium'} ${product.category?.name || 'lighting product'} with fast shipping and warranty.`}
      keywords={`${product.name}, ${product.brand?.name}, ${product.category?.name}, lighting, smart home, LED, buy online`}
      type="product"
      productData={{
        name: product.name,
        price: product.price,
        currency: product.currency || 'USD',
        brand: product.brand?.name || 'Unknown',
        category: product.category?.name || 'Lighting',
        rating: product.rating || 4.5,
        reviewCount: product.review_count || 0,
        availability: product.stock_quantity > 0 ? 'in stock' : 'out of stock'
      }}
    />
  )
}

export function CategorySEO({ category, productCount }: { category: string; productCount: number }) {
  return (
    <SEOHead
      title={`${category} - Browse ${productCount}+ Premium Lighting Products`}
      description={`Discover ${productCount}+ premium ${category.toLowerCase()} products. AI-powered recommendations to find the perfect lighting for your space.`}
      keywords={`${category}, lighting products, smart lighting, LED ${category.toLowerCase()}, buy ${category.toLowerCase()} online`}
      type="website"
    />
  )
}

export function SearchSEO({ query, resultCount }: { query?: string; resultCount?: number }) {
  const title = query 
    ? `Search results for "${query}" - ${resultCount || 0} products found`
    : 'Search Lighting Products - AI-Powered Product Discovery'
  
  const description = query
    ? `Found ${resultCount || 0} lighting products matching "${query}". Browse premium brands and get AI recommendations.`
    : 'Search our curated collection of 56+ premium lighting products. Use AI-powered filters to find the perfect lights for your space.'

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={`search lighting, ${query || 'lighting products'}, smart home search, LED search`}
      type="website"
    />
  )
}