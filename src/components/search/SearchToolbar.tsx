'use client'

import React from 'react'
import { Grid, List, ArrowUpDown, RefreshCw } from 'lucide-react'

interface SortOption {
  by: string
  order: 'asc' | 'desc'
  label: string
}

interface SearchToolbarProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  loading: boolean
  onRefresh: () => void
  resultsCount?: number
  totalCount?: number
}

const SORT_OPTIONS: SortOption[] = [
  { by: 'name', order: 'asc', label: '名称 A-Z' },
  { by: 'name', order: 'desc', label: '名称 Z-A' },
  { by: 'price', order: 'asc', label: '价格从低到高' },
  { by: 'price', order: 'desc', label: '价格从高到低' },
  { by: 'rating', order: 'desc', label: '评分从高到低' },
  { by: 'created_at', order: 'desc', label: '最新添加' }
]

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  loading,
  onRefresh,
  resultsCount,
  totalCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
      {/* Results Info */}
      <div className="text-sm text-gray-600">
        {resultsCount !== undefined && totalCount !== undefined && (
          <span>
            显示 {resultsCount} 个结果，共 {totalCount} 个
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            value={`${sortBy.by}-${sortBy.order}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-')
              const option = SORT_OPTIONS.find(opt => opt.by === by && opt.order === order)
              if (option) {
                onSortChange(option)
              }
            }}
            className="px-3 py-1 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option 
                key={`${option.by}-${option.order}`} 
                value={`${option.by}-${option.order}`}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            title="网格视图"
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
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          title="刷新结果"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}