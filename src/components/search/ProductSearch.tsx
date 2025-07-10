'use client'

import React, { useState } from 'react'
import { LightingProduct } from '@/lib/types'
import { useProductSearch } from '@/hooks/useProductSearch'
import { SearchBox } from './SearchBox'
import { SearchFilters } from './SearchFilters'
import { SearchToolbar } from './SearchToolbar'
import { SearchResults } from './SearchResults'
import { SearchPagination } from './SearchPagination'

interface ProductSearchProps {
  onProductSelect?: (product: LightingProduct) => void
  onAddToCart?: (product: LightingProduct) => void
  className?: string
  showFilters?: boolean
  defaultQuery?: string
  defaultFilters?: any
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onProductSelect,
  onAddToCart,
  className = '',
  showFilters = true,
  defaultQuery = '',
  defaultFilters = {}
}) => {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const {
    query,
    filters,
    sortBy,
    products,
    loading,
    error,
    pagination,
    filterOptions,
    activeFiltersCount,
    search,
    updateFilter,
    clearFilters,
    updateSort,
    nextPage,
    prevPage,
    goToPage,
    refresh
  } = useProductSearch({
    initialQuery: defaultQuery,
    initialFilters: defaultFilters
  })

  const handleClearSearch = () => {
    search('')
  }

  const handleFilterToggle = () => {
    setShowFiltersPanel(!showFiltersPanel)
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Search Header */}
      <div className="space-y-4 mb-6">
        {/* Search Box */}
        <SearchBox
          query={query}
          onQueryChange={search}
          onClear={handleClearSearch}
          loading={loading}
          className="w-full"
        />

        {/* Filters */}
        {showFilters && (
          <SearchFilters
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            isOpen={showFiltersPanel}
            onToggle={handleFilterToggle}
            activeFiltersCount={activeFiltersCount}
          />
        )}
      </div>

      {/* Search Toolbar */}
      <SearchToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={updateSort}
        loading={loading}
        onRefresh={refresh}
        resultsCount={products.length}
        totalCount={pagination?.total}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">搜索出错</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={refresh}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  重试
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="mb-6">
        <SearchResults
          products={products}
          viewMode={viewMode}
          loading={loading}
          onProductSelect={onProductSelect}
          onAddToCart={onAddToCart}
        />
      </div>

      {/* Pagination */}
      <SearchPagination
        pagination={pagination}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        loading={loading}
      />
    </div>
  )
}