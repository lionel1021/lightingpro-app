'use client'

import React from 'react'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { LightingProduct } from '@/lib/types'
import FavoriteButton from '../FavoriteButton'

interface SearchResultsProps {
  products: LightingProduct[]
  viewMode: 'grid' | 'list'
  loading: boolean
  onProductSelect?: (product: LightingProduct) => void
  onAddToCart?: (product: LightingProduct) => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  viewMode,
  loading,
  onProductSelect,
  onAddToCart
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">搜索中...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Eye className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关产品</h3>
        <p className="text-gray-600">请尝试调整搜索条件或筛选器</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onProductSelect={onProductSelect}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductGridItem
          key={product.id}
          product={product}
          onProductSelect={onProductSelect}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

// Grid view product item
const ProductGridItem: React.FC<{
  product: LightingProduct
  onProductSelect?: (product: LightingProduct) => void
  onAddToCart?: (product: LightingProduct) => void
}> = ({ product, onProductSelect, onAddToCart }) => {
  const imageUrl = product.image_urls?.[0] || product.image || '/placeholder-image.jpg'

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-image.jpg'
          }}
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton productId={product.id} />
        </div>
        {product.matchScore && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            {Math.round(product.matchScore * 100)}% 匹配
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.review_count || product.reviews || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            ¥{product.price.toLocaleString()}
          </span>
          {product.commission_rate > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              返利 {product.commission_rate}%
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onProductSelect?.(product)}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 inline mr-1" />
            查看
          </button>
          <button
            onClick={() => onAddToCart?.(product)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <ShoppingCart className="w-4 h-4 inline mr-1" />
            购买
          </button>
        </div>
      </div>
    </div>
  )
}

// List view product item
const ProductListItem: React.FC<{
  product: LightingProduct
  onProductSelect?: (product: LightingProduct) => void
  onAddToCart?: (product: LightingProduct) => void
}> = ({ product, onProductSelect, onAddToCart }) => {
  const imageUrl = product.image_urls?.[0] || product.image || '/placeholder-image.jpg'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-image.jpg'
            }}
          />
          {product.matchScore && (
            <div className="absolute -top-1 -right-1 bg-green-500 text-white px-1 py-0.5 rounded-full text-xs">
              {Math.round(product.matchScore * 100)}%
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand}</p>
            </div>
            <div className="flex-shrink-0">
              <FavoriteButton productId={product.id} />
            </div>
          </div>

          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.review_count || product.reviews || 0})
            </span>
            {product.commission_rate > 0 && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded ml-4">
                返利 {product.commission_rate}%
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              ¥{product.price.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onProductSelect?.(product)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                <Eye className="w-4 h-4 inline mr-1" />
                查看
              </button>
              <button
                onClick={() => onAddToCart?.(product)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <ShoppingCart className="w-4 h-4 inline mr-1" />
                购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}