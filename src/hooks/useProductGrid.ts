'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

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

type SortOption = 'name' | 'price' | 'rating' | 'newest' | 'popular'
type SortOrder = 'asc' | 'desc'

interface UseProductGridOptions {
  initialProducts: Product[]
  itemsPerPage?: number
  defaultView?: 'grid' | 'list'
  defaultSort?: { by: SortOption; order: SortOrder }
}

interface GridState {
  searchTerm: string
  selectedCategory: string
  selectedBrand: string
  priceRange: [number, number]
  sortBy: SortOption
  sortOrder: SortOrder
  viewMode: 'grid' | 'list'
  currentPage: number
  showFiltersPanel: boolean
}

export const useProductGrid = ({
  initialProducts,
  itemsPerPage = 12,
  defaultView = 'grid',
  defaultSort = { by: 'popular', order: 'desc' }
}: UseProductGridOptions) => {
  const [products] = useState<Product[]>(initialProducts)
  const [state, setState] = useState<GridState>({
    searchTerm: '',
    selectedCategory: '',
    selectedBrand: '',
    priceRange: [0, 1000],
    sortBy: defaultSort.by,
    sortOrder: defaultSort.order,
    viewMode: defaultView,
    currentPage: 1,
    showFiltersPanel: false
  })

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price), 1000)
  }, [products])

  // Update price range when max price changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], Math.max(prev.priceRange[1], maxPrice)]
    }))
  }, [maxPrice])

  // Get unique categories and brands
  const { categories, brands } = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    const brandsSet = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))
    return { categories: cats, brands: brandsSet }
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Search filter
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        product.features?.some(feature => feature.toLowerCase().includes(searchLower))
      )
    }

    // Category filter
    if (state.selectedCategory) {
      filtered = filtered.filter(product => product.category === state.selectedCategory)
    }

    // Brand filter
    if (state.selectedBrand) {
      filtered = filtered.filter(product => product.brand === state.selectedBrand)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= state.priceRange[0] && product.price <= state.priceRange[1]
    )

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (state.sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'newest':
          // Assume newer products have higher IDs
          aValue = parseInt(a.id) || 0
          bValue = parseInt(b.id) || 0
          break
        case 'popular':
          aValue = a.reviewCount
          bValue = b.reviewCount
          break
        default:
          return 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return state.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return state.sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    return filtered
  }, [products, state])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (state.selectedCategory) count++
    if (state.selectedBrand) count++
    if (state.priceRange[0] > 0 || state.priceRange[1] < maxPrice) count++
    return count
  }, [state.selectedCategory, state.selectedBrand, state.priceRange, maxPrice])

  // Actions
  const updateSearchTerm = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term, currentPage: 1 }))
  }, [])

  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchTerm: '', currentPage: 1 }))
  }, [])

  const updateCategory = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category, currentPage: 1 }))
  }, [])

  const updateBrand = useCallback((brand: string) => {
    setState(prev => ({ ...prev, selectedBrand: brand, currentPage: 1 }))
  }, [])

  const updatePriceRange = useCallback((range: [number, number]) => {
    setState(prev => ({ ...prev, priceRange: range, currentPage: 1 }))
  }, [])

  const updateSort = useCallback((sortBy: SortOption, sortOrder: SortOrder) => {
    setState(prev => ({ ...prev, sortBy, sortOrder, currentPage: 1 }))
  }, [])

  const updateViewMode = useCallback((viewMode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode }))
  }, [])

  const updatePage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }))
  }, [])

  const toggleFiltersPanel = useCallback(() => {
    setState(prev => ({ ...prev, showFiltersPanel: !prev.showFiltersPanel }))
  }, [])

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCategory: '',
      selectedBrand: '',
      priceRange: [0, maxPrice],
      searchTerm: '',
      currentPage: 1
    }))
  }, [maxPrice])

  const refresh = useCallback(() => {
    // Force re-render by updating a timestamp or similar
    setState(prev => ({ ...prev, currentPage: prev.currentPage }))
  }, [])

  return {
    // State
    ...state,
    filteredProducts,
    categories,
    brands,
    maxPrice,
    activeFiltersCount,
    totalPages: Math.ceil(filteredProducts.length / itemsPerPage),
    totalItems: filteredProducts.length,
    
    // Actions
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
  }
}