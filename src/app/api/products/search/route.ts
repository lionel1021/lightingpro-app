import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取搜索参数
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const minRating = searchParams.get('min_rating')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sort_by') || 'name'
    const sortOrder = searchParams.get('sort_order') || 'asc'

    // 使用模拟数据进行搜索
    let filteredProducts = [...mockProducts]

    // 应用文本搜索
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery)
      )
    }

    // 应用分类筛选
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category)
    }

    // 应用品牌筛选
    if (brand) {
      filteredProducts = filteredProducts.filter(product => product.brand === brand)
    }

    // 应用价格筛选
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice))
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice))
    }

    // 应用评分筛选
    if (minRating) {
      filteredProducts = filteredProducts.filter(product => product.rating >= parseFloat(minRating))
    }

    // 排序
    filteredProducts.sort((a, b) => {
      let aValue, bValue
      
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
          aValue = a.rating
          bValue = b.rating
          break
        case 'created_at':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

    // 分页
    const total = filteredProducts.length
    const offset = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    // 获取筛选选项
    const categories = [...new Set(mockProducts.map(p => p.category))]
    const brands = [...new Set(mockProducts.map(p => p.brand))]
    const prices = mockProducts.map(p => p.price)
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }

    const searchResults = {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: (page * limit) < total,
        hasPrev: page > 1
      },
      filters: {
        categories,
        brands,
        priceRange
      },
      query: {
        q: query,
        category,
        brand,
        min_price: minPrice,
        max_price: maxPrice,
        min_rating: minRating,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }

    return NextResponse.json({
      success: true,
      data: searchResults
    })

  } catch (error) {
    console.error('Search API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search products',
        details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      query = '', 
      filters = {},
      sort = { by: 'name', order: 'asc' },
      pagination = { page: 1, limit: 20 }
    } = body

    // 使用模拟数据进行搜索 (与GET方法相同的逻辑)
    let filteredProducts = [...mockProducts]

    // 应用文本搜索
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery)
      )
    }

    // 应用筛选器
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        switch (key) {
          case 'category':
            filteredProducts = filteredProducts.filter(product => product.category === value)
            break
          case 'brand':
            filteredProducts = filteredProducts.filter(product => product.brand === value)
            break
          case 'minPrice':
            filteredProducts = filteredProducts.filter(product => product.price >= value)
            break
          case 'maxPrice':
            filteredProducts = filteredProducts.filter(product => product.price <= value)
            break
          case 'minRating':
            filteredProducts = filteredProducts.filter(product => product.rating >= value)
            break
          case 'priceRange':
            if (Array.isArray(value) && value.length === 2) {
              filteredProducts = filteredProducts.filter(product => 
                product.price >= value[0] && product.price <= value[1]
              )
            }
            break
        }
      }
    })

    // 排序
    filteredProducts.sort((a, b) => {
      let aValue, bValue
      
      switch (sort.by) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'created_at':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (sort.order === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

    // 分页
    const total = filteredProducts.length
    const offset = (pagination.page - 1) * pagination.limit
    const paginatedProducts = filteredProducts.slice(offset, offset + pagination.limit)

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          pages: Math.ceil(total / pagination.limit),
          hasNext: (pagination.page * pagination.limit) < total,
          hasPrev: pagination.page > 1
        },
        appliedFilters: filters,
        query
      }
    })

  } catch (error) {
    console.error('Advanced search API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform advanced search',
        details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
      },
      { status: 500 }
    )
  }
}