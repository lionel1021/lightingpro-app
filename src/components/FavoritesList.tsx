'use client'

import React, { useState, useMemo } from 'react'
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Search
} from 'lucide-react'
import { LightingProduct } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'
import { mockProducts } from '@/lib/mock-data'

interface FavoritesListProps {
  userId?: string
  className?: string
  onProductSelect?: (product: LightingProduct) => void
}

type SortOption = 'name' | 'price' | 'rating' | 'addedAt'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'grid' | 'list'

export const FavoritesList: React.FC<FavoritesListProps> = ({
  userId,
  className = '',
  onProductSelect
}) => {
  const { favorites, toggleFavorite, addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('addedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Get favorite products from mock data
  const favoriteProducts = useMemo(() => {
    return mockProducts.filter(product => favorites.has(product.id))
  }, [favorites])

  // Filter and sort favorites
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favoriteProducts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        case 'addedAt':
          // Since we don't have addedAt in our simple context, use id as fallback
          aValue = a.id
          bValue = b.id
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [favoriteProducts, searchQuery, sortBy, sortOrder])

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
      favoriteProducts.forEach(product => {
        toggleFavorite(product.id)
      })
    }
  }

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortOrder('desc')
    }
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">暂无收藏</h3>
          <p className="text-sm mb-6">
            浏览产品时点击心形图标，将喜欢的照明产品加入收藏
          </p>
          <button
            onClick={() => window.location.href = '/search'}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>去逛逛</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">我的收藏</h2>
              <p className="text-sm text-gray-600">
                共 {favoriteProducts.length} 个收藏商品
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleClearAll}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="清空收藏"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索收藏的产品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">排序:</span>
              {[
                { key: 'addedAt', label: '添加时间' },
                { key: 'name', label: '名称' },
                { key: 'price', label: '价格' },
                { key: 'rating', label: '评分' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key as SortOption)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    sortBy === key 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{label}</span>
                  {sortBy === key && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-6">
        {filteredAndSortedFavorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>没有找到匹配的收藏商品</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedFavorites.map((product) => (
              <div
                key={product.id}
                className={`
                  group bg-white border border-gray-200 rounded-lg overflow-hidden 
                  hover:shadow-md transition-all duration-200 cursor-pointer
                  ${viewMode === 'list' ? 'flex' : ''}
                `}
                onClick={() => onProductSelect?.(product)}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img
                    src={product.image_urls?.[0] || '/placeholder-product.png'}
                    alt={product.name}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'
                    }`}
                  />
                  
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(product.id)
                      }}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                  </div>
                  
                  {product.rating && (
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>

                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-4' : ''}`}>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-green-600">
                        ¥{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">
                        已收藏
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="加入购物车"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onProductSelect?.(product)
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesList