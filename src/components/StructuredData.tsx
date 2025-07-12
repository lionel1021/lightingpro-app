'use client'

import Script from 'next/script'

interface ProductStructuredDataProps {
  productData: {
    name: string
    price: number
    currency: string
    brand: string
    category: string
    rating: number
    reviewCount: number
    availability: 'in stock' | 'out of stock'
  }
  description: string
  image: string
  url: string
}

export function ProductStructuredData({ productData, description, image, url }: ProductStructuredDataProps) {
  const structuredData = {
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
      url: url
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: productData.rating,
      reviewCount: productData.reviewCount,
      bestRating: 5,
      worstRating: 1
    },
    image: image
  }

  return (
    <Script 
      id="product-structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
  )
}

interface WebSiteStructuredDataProps {
  siteTitle: string
  description: string
  url: string
}

export function WebSiteStructuredData({ siteTitle, description, url }: WebSiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    description: description,
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Script 
      id="website-structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
  )
}

interface OrganizationStructuredDataProps {
  siteTitle: string
  url: string
}

export function OrganizationStructuredData({ siteTitle, url }: OrganizationStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteTitle,
    description: 'AI-powered lighting recommendation platform',
    url: url,
    logo: `${url}/logo.png`,
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
  }

  return (
    <Script 
      id="organization-structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
  )
}