// Legacy ProductSearch - Redirects to new modular version
'use client'

import React from 'react'
import { ProductSearch as NewProductSearch } from './search/ProductSearch'
import { LightingProduct } from '@/lib/types'

interface ProductSearchProps {
  onProductSelect?: (product: LightingProduct) => void
  onAddToCart?: (product: LightingProduct) => void
  className?: string
  showFilters?: boolean
  defaultQuery?: string
  defaultFilters?: any
}

// Re-export the new modular component for backward compatibility
export const ProductSearch: React.FC<ProductSearchProps> = (props) => {
  return <NewProductSearch {...props} />
}

export default ProductSearch