'use client'

import React from 'react'
import { Loader2, Package } from 'lucide-react'
import { ProductCard } from '../ProductCard'

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  brand: string
  category: string
  rating: number
  reviewCount: number
  tags?: string[]
  features?: string[]
}

interface ProductGridDisplayProps {
  products: Product[]
  loading: boolean
  error?: string
  viewMode: 'grid' | 'list'
  onProductClick?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  currentPage: number
  itemsPerPage: number
}

export const ProductGridDisplay: React.FC<ProductGridDisplayProps> = ({
  products,
  loading,
  error,
  viewMode,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  currentPage,
  itemsPerPage
}) => {
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = products.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (paginatedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Package className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到产品</h3>
        <p className="text-gray-600">请尝试调整搜索条件或筛选器</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {paginatedProducts.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  )
}

// List view product item component
const ProductListItem: React.FC<{
  product: Product
  onProductClick?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
}> = ({ product, onProductClick, onAddToCart, onAddToWishlist }) => {
  const imageUrl = product.images?.[0] || '/placeholder-image.jpg'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-image.jpg'
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand} · {product.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">¥{product.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">
                ⭐ {product.rating} ({product.reviewCount})
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

          {product.features && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {product.features.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                    +{product.features.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onProductClick?.(product.id)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              查看详情
            </button>
            <button
              onClick={() => onAddToCart?.(product.id)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              加入购物车
            </button>
            <button
              onClick={() => onAddToWishlist?.(product.id)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              title="加入收藏"
            >
              ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}