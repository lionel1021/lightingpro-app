'use client'

import React from 'react'
import { useProductGrid } from '@/hooks/useProductGrid'
import { ProductFilters } from './ProductFilters'
import { ProductGridToolbar } from './ProductGridToolbar'
import { ProductGridDisplay } from './ProductGridDisplay'
import { ProductGridPagination } from './ProductGridPagination'

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

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  loading = false,
  error,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  showFilters = true,
  showSearch = true,
  showSort = true,
  showViewToggle = true,
  defaultView = 'grid',
  itemsPerPage = 12
}) => {
  const {
    searchTerm,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    sortOrder,
    viewMode,
    currentPage,
    showFiltersPanel,
    filteredProducts,
    categories,
    brands,
    maxPrice,
    activeFiltersCount,
    totalPages,
    totalItems,
    updateSearchTerm,
    clearSearch,
    updateCategory,
    updateBrand,
    updatePriceRange,
    updateSort,
    updateViewMode,
    updatePage,
    toggleFiltersPanel,
    clearFilters,
    refresh
  } = useProductGrid({
    initialProducts: products,
    itemsPerPage,
    defaultView
  })

  return (
    <div className="w-full space-y-6">
      {/* Toolbar */}
      <ProductGridToolbar
        searchTerm={searchTerm}
        onSearchChange={updateSearchTerm}
        onSearchClear={clearSearch}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={updateSort}
        viewMode={viewMode}
        onViewModeChange={updateViewMode}
        showSearch={showSearch}
        showSort={showSort}
        showViewToggle={showViewToggle}
        loading={loading}
        onRefresh={refresh}
        resultsCount={filteredProducts.length}
        totalCount={products.length}
      />

      {/* Filters */}
      {showFilters && (
        <ProductFilters
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          priceRange={priceRange}
          maxPrice={maxPrice}
          onCategoryChange={updateCategory}
          onBrandChange={updateBrand}
          onPriceRangeChange={updatePriceRange}
          onClearFilters={clearFilters}
          isOpen={showFiltersPanel}
          onToggle={toggleFiltersPanel}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Product Display */}
      <ProductGridDisplay
        products={filteredProducts}
        loading={loading}
        error={error}
        viewMode={viewMode}
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Pagination */}
      <ProductGridPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={updatePage}
      />
    </div>
  )
}