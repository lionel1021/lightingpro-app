'use client'

import React from 'react'
import { Search, Grid, List, SortAsc, SortDesc, RefreshCw, X } from 'lucide-react'

type SortOption = 'name' | 'price' | 'rating' | 'newest' | 'popular'
type SortOrder = 'asc' | 'desc'

interface ProductGridToolbarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearchClear: () => void
  sortBy: SortOption
  sortOrder: SortOrder
  onSortChange: (sortBy: SortOption, order: SortOrder) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  showSearch?: boolean
  showSort?: boolean
  showViewToggle?: boolean
  loading?: boolean
  onRefresh?: () => void
  resultsCount?: number
  totalCount?: number
}

const SORT_OPTIONS = [
  { value: 'popular', label: '最受欢迎', order: 'desc' as const },
  { value: 'newest', label: '最新上架', order: 'desc' as const },
  { value: 'name', label: '名称 A-Z', order: 'asc' as const },
  { value: 'name', label: '名称 Z-A', order: 'desc' as const },
  { value: 'price', label: '价格从低到高', order: 'asc' as const },
  { value: 'price', label: '价格从高到低', order: 'desc' as const },
  { value: 'rating', label: '评分从高到低', order: 'desc' as const }
]

export const ProductGridToolbar: React.FC<ProductGridToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchClear,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  showSearch = true,
  showSort = true,
  showViewToggle = true,
  loading = false,
  onRefresh,
  resultsCount,
  totalCount
}) => {
  const currentSortOption = SORT_OPTIONS.find(opt => opt.value === sortBy && opt.order === sortOrder)
  const sortLabel = currentSortOption?.label || '自定义排序'

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
      {/* Left side - Search and Results Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索产品..."
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            {searchTerm && (
              <button
                onClick={onSearchClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Results Info */}
        {resultsCount !== undefined && (
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {totalCount !== undefined ? (
              <span>显示 {resultsCount} 个，共 {totalCount} 个结果</span>
            ) : (
              <span>{resultsCount} 个结果</span>
            )}
          </div>
        )}
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        {showSort && (
          <div className="flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-') as [SortOption, SortOrder]
                onSortChange(newSortBy, newOrder)
              }}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {SORT_OPTIONS.map((option) => (
                <option 
                  key={`${option.value}-${option.order}`} 
                  value={`${option.value}-${option.order}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* View Mode Toggle */}
        {showViewToggle && (
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="网格视图"
              disabled={loading}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="列表视图"
              disabled={loading}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            title="刷新结果"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    </div>
  )
}