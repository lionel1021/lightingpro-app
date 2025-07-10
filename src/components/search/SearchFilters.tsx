'use client'

import React from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'

interface SearchFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  priceRange?: [number, number]
}

interface FilterOptions {
  categories: string[]
  brands: string[]
  priceRange: { min: number; max: number }
}

interface SearchFiltersProps {
  filters: SearchFilters
  filterOptions: FilterOptions
  onFilterChange: (key: keyof SearchFilters, value: any) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  activeFiltersCount: number
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle,
  activeFiltersCount
}) => {
  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>筛选</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">筛选条件</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
                清除全部
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFilterChange('category', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部分类</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌
              </label>
              <select
                value={filters.brand || ''}
                onChange={(e) => onFilterChange('brand', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部品牌</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格范围
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="最低价"
                  value={filters.minPrice || ''}
                  onChange={(e) => onFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="px-2 py-2 text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="最高价"
                  value={filters.maxPrice || ''}
                  onChange={(e) => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低评分
              </label>
              <select
                value={filters.minRating || ''}
                onChange={(e) => onFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">不限</option>
                <option value="4">4星以上</option>
                <option value="3">3星以上</option>
                <option value="2">2星以上</option>
                <option value="1">1星以上</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}