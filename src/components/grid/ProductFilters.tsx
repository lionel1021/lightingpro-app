'use client'

import React from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'

interface ProductFiltersProps {
  categories: string[]
  brands: string[]
  selectedCategory: string
  selectedBrand: string
  priceRange: [number, number]
  maxPrice: number
  onCategoryChange: (category: string) => void
  onBrandChange: (brand: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  activeFiltersCount: number
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部分类</option>
                {categories.map((category) => (
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
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部品牌</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格范围: ¥{priceRange[0]} - ¥{priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="最低价"
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([Number(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                  <span className="px-2 py-1 text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="最高价"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value) || maxPrice])}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}