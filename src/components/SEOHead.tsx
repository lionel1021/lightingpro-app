import Head from 'next/head'

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

      {/* 产品结构化数据 */}
      {productData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: productData.name,
              description: description,
              brand: {
                '@type': 'Brand',
                name: productData.brand
              },
              category: productData.category,
              offers: {
                '@type': 'Offer',
                price: productData.price,
                priceCurrency: productData.currency,
                availability: productData.availability === 'in stock' 
                  ? 'https://schema.org/InStock' 
                  : 'https://schema.org/OutOfStock',
                url: canonicalUrl
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: productData.rating,
                reviewCount: productData.reviewCount,
                bestRating: 5,
                worstRating: 1
              },
              image: image
            })
          }}
        />
      )}

      {/* 网站结构化数据 */}
      {type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteTitle,
              description: description,
              url: canonicalUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${canonicalUrl}/search?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      )}

      {/* 组织结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteTitle,
            description: 'AI-powered lighting recommendation platform',
            url: canonicalUrl,
            logo: `${canonicalUrl}/logo.png`,
            sameAs: [
              'https://twitter.com/lightingpro',
              'https://facebook.com/lightingpro',
              'https://instagram.com/lightingpro'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: ['English', 'Chinese', 'Spanish', 'French']
            }
          })
        }}
      />

      {/* PWA Meta 标签 */}
      <meta name="application-name" content={siteTitle} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#2563eb" />

      {/* Favicon 和图标 */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* 预加载关键资源 */}
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      
      {/* 性能优化 */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Head>
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