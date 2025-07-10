// Legacy ProductGrid - Redirects to new modular version
'use client'

import React from 'react'
import { ProductGrid as NewProductGrid } from './grid/ProductGrid'
import { PRODUCTS_DATABASE, Product as DatabaseProduct } from '../lib/product-database'

type Product = DatabaseProduct

interface ProductGridProps {
  products?: Product[]
  loading?: boolean
  error?: string
  onProductClick?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  showFilters?: boolean
  showSearch?: boolean
  showSort?: boolean
  showViewToggle?: boolean
  defaultView?: 'grid' | 'list'
  itemsPerPage?: number
}

// Re-export the new modular component for backward compatibility
export const ProductGrid: React.FC<ProductGridProps> = ({
  products = PRODUCTS_DATABASE,
  ...props
}) => {
  // Transform the data to match the new component's expected format
  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images || [],
    brand: product.brand,
    category: product.category,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tags: product.tags,
    features: product.features
  }))

  return <NewProductGrid products={transformedProducts} {...props} />
}

export default ProductGrid