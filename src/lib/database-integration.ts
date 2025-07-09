/**
 * 🤖 MCP + SuperClaude 协作生成
 * 数据库集成优化模块 - 自动适配新表结构
 */

import { createClient } from '@supabase/supabase-js'
import { LightingProduct } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 🏗️ 架构智能体：优化的数据库接口
export interface DatabaseProduct {
  id: string
  name: string
  brand: string // 保持简单字符串类型
  category: string // 保持简单字符串类型
  price: number
  description: string | null
  specifications: Record<string, unknown>
  image_urls: string[]
  affiliate_links: Record<string, unknown>
  commission_rate: number
  rating: number
  review_count: number
  features?: string[]
  created_at: string
  
  // 扩展字段
  brand_info?: {
    id: string
    name: string
    logo_url?: string
    country?: string
  }
  category_info?: {
    id: string
    name: string
    name_en?: string
    icon_name?: string
  }
  affiliate_links_data?: Array<{
    platform: string
    affiliate_url: string
    commission_rate: number
    click_count: number
  }>
  review_stats?: {
    avg_rating: number
    total_reviews: number
    rating_distribution: Record<string, number>
  }
  interaction_stats?: {
    view_count: number
    favorite_count: number
    purchase_count: number
  }
}

// 📊 产品智能体：智能产品数据访问类
export class SmartProductDatabase {
  
  // 🚀 项目智能体：高性能产品查询
  static async getProducts(filters: {
    category?: string
    brand?: string
    priceRange?: [number, number]
    features?: string[]
    rating?: number
    search?: string
    limit?: number
    offset?: number
    sortBy?: 'price' | 'rating' | 'popularity' | 'created_at'
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<{
    products: DatabaseProduct[]
    total: number
    facets: {
      brands: Array<{ name: string; count: number }>
      categories: Array<{ name: string; count: number }>
      priceRanges: Array<{ range: string; count: number }>
      avgRating: number
    }
  }> {
    
    const {
      category,
      brand,
      priceRange,
      features,
      rating,
      search,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = filters

    // 🧠 SuperClaude：构建智能查询 - 优化版本避免N+1问题
    let query = supabase
      .from('lighting_products')
      .select(`
        *,
        brands!inner(id, name, logo_url, country),
        categories!inner(id, name, name_en, icon_name)
      `)
      .eq('status', 'active')
      .eq('is_available', true)

    // 应用筛选条件 - 简化版本
    if (category) {
      query = query.eq('category_name', category)
    }
    
    if (brand) {
      query = query.eq('brand_name', brand)
    }
    
    if (priceRange) {
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1])
    }
    
    if (rating) {
      query = query.gte('rating', rating)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,features.cs.{${search}}`)
    }
    
    if (features && features.length > 0) {
      query = query.contains('features', features)
    }

    // 获取总数
    const { count } = await query.select('*', { count: 'exact', head: true })
    const total = count || 0

    // 排序和分页
    const sortColumn = sortBy === 'popularity' ? 'view_count' : sortBy
    const { data: products, error } = await query
      .order(sortColumn, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('🔴 产品查询失败:', error)
      throw new Error('查询产品失败')
    }

    // 🤖 MCP：智能数据转换 - 优化版本
    const transformedProducts: DatabaseProduct[] = (products || []).map(product => ({
      ...product,
      brand: product.brands?.name || product.brand_name || 'Unknown Brand',
      category: product.categories?.name || product.category_name || 'General',
      brand_info: product.brands,
      category_info: product.categories,
      affiliate_links_data: [],
      interaction_stats: {
        view_count: product.view_count || 0,
        favorite_count: product.favorite_count || 0,
        purchase_count: product.purchase_count || 0
      }
    }))

    // 🔧 MCP：生成分面数据
    const facets = await this.generateFacets(filters)

    return {
      products: transformedProducts,
      total,
      facets
    }
  }

  // 🧠 SuperClaude：智能推荐查询
  static async getRecommendedProducts(options: {
    userId?: string
    sessionId?: string
    roomType?: string
    stylePreference?: string
    budgetRange?: [number, number]
    excludeIds?: string[]
    limit?: number
  }): Promise<DatabaseProduct[]> {
    
    const {
      userId,
      roomType,
      stylePreference,
      budgetRange,
      excludeIds = [],
      limit = 6
    } = options

    // 获取用户行为数据（如果有用户ID）
    let userPreferences: any = {}
    if (userId) {
      userPreferences = await this.getUserPreferences(userId)
    }

    // 🤖 MCP + 🧠 SuperClaude：智能推荐算法 - 优化查询
    let query = supabase
      .from('lighting_products')
      .select(`
        *,
        brands!inner(id, name, logo_url, country),
        categories!inner(id, name, name_en, icon_name)
      `)
      .eq('status', 'active')
      .eq('is_available', true)

    // 排除已选产品
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    // 预算筛选
    if (budgetRange) {
      query = query.gte('price', budgetRange[0]).lte('price', budgetRange[1])
    }

    // 房间类型智能匹配
    if (roomType) {
      const categoryMapping = {
        '客厅': ['吸顶灯', '吊灯', '射灯', '筒灯'],
        '卧室': ['吸顶灯', '台灯', '壁灯', '落地灯'],
        '书房': ['台灯', '射灯', '筒灯'],
        '餐厅': ['吊灯', '射灯'],
        '厨房': ['筒灯', '射灯'],
        '卫生间': ['吸顶灯', '壁灯', '筒灯']
      }
      
      const suitableCategories = categoryMapping[roomType as keyof typeof categoryMapping]
      if (suitableCategories) {
        query = query.in('categories.name', suitableCategories)
      }
    }

    // 🚀 项目智能体：混合排序算法
    const { data: products } = await query
      .order('rating', { ascending: false })
      .order('view_count', { ascending: false })
      .order('is_featured', { ascending: false })
      .limit(limit * 2) // 获取更多数据进行二次筛选

    if (!products) return []

    // 🧠 SuperClaude：个性化评分和重排序
    const scoredProducts = products.map(product => {
      let score = 0
      
      // 基础评分
      score += (product.rating || 0) * 20
      score += Math.log(product.view_count + 1) * 5
      score += product.is_featured ? 10 : 0
      
      // 用户偏好加成
      if (userPreferences.favoriteBrands?.includes(product.brands?.name)) {
        score += 15
      }
      
      if (userPreferences.favoriteCategories?.includes(product.categories?.name)) {
        score += 10
      }

      // 风格匹配
      if (stylePreference && product.features?.some(f => 
        f.toLowerCase().includes(stylePreference.toLowerCase())
      )) {
        score += 8
      }

      return { ...product, recommendScore: score }
    })

    // 返回评分最高的产品
    return scoredProducts
      .sort((a, b) => b.recommendScore - a.recommendScore)
      .slice(0, limit)
      .map(p => ({
        ...p,
        brand: p.brands,
        category: p.categories,
        affiliate_links_data: p.affiliate_links || []
      }))
  }

  // 🔧 MCP：用户偏好分析
  private static async getUserPreferences(userId: string) {
    try {
      // 获取用户收藏的品牌和分类
      const { data: favorites } = await supabase
        .from('user_favorites')
        .select(`
          lighting_products(
            brands(name),
            categories(name)
          )
        `)
        .eq('user_id', userId)

      const favoriteBrands = favorites?.map(f => f.lighting_products.brands?.name).filter(Boolean) || []
      const favoriteCategories = favorites?.map(f => f.lighting_products.categories?.name).filter(Boolean) || []

      return {
        favoriteBrands: [...new Set(favoriteBrands)],
        favoriteCategories: [...new Set(favoriteCategories)]
      }
    } catch (error) {
      console.error('获取用户偏好失败:', error)
      return {}
    }
  }

  // 🤖 MCP：分面数据生成
  private static async generateFacets(baseFilters: any) {
    try {
      // 并行查询分面数据
      const [brandsData, categoriesData] = await Promise.all([
        supabase
          .from('lighting_products')
          .select('brands(name)')
          .eq('status', 'active'),
        supabase
          .from('lighting_products')
          .select('categories(name)')
          .eq('status', 'active')
      ])

      // 统计品牌分布
      const brandCounts: Record<string, number> = {}
      brandsData.data?.forEach(item => {
        const brand = item.brands?.name
        if (brand) brandCounts[brand] = (brandCounts[brand] || 0) + 1
      })

      // 统计分类分布
      const categoryCounts: Record<string, number> = {}
      categoriesData.data?.forEach(item => {
        const category = item.categories?.name
        if (category) categoryCounts[category] = (categoryCounts[category] || 0) + 1
      })

      return {
        brands: Object.entries(brandCounts).map(([name, count]) => ({ name, count })),
        categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
        priceRanges: [
          { range: '0-200', count: 0 },
          { range: '200-500', count: 0 },
          { range: '500-1000', count: 0 },
          { range: '1000+', count: 0 }
        ],
        avgRating: 4.2
      }
    } catch (error) {
      console.error('生成分面数据失败:', error)
      return {
        brands: [],
        categories: [],
        priceRanges: [],
        avgRating: 0
      }
    }
  }

  // 📊 产品智能体：用户行为记录
  static async recordUserInteraction(data: {
    userId?: string
    sessionId: string
    productId: string
    interactionType: 'view' | 'click' | 'favorite' | 'unfavorite' | 'share'
    durationSeconds?: number
    metadata?: Record<string, any>
  }) {
    try {
      await supabase.from('user_interactions').insert({
        user_id: data.userId || null,
        session_id: data.sessionId,
        product_id: data.productId,
        interaction_type: data.interactionType,
        duration_seconds: data.durationSeconds,
        metadata: data.metadata || {},
        created_at: new Date().toISOString()
      })

      // 🚀 项目智能体：实时更新产品统计
      if (data.interactionType === 'view') {
        await supabase.rpc('increment_view_count', { product_id: data.productId })
      }
    } catch (error) {
      console.error('记录用户行为失败:', error)
    }
  }
}

// 🧠 SuperClaude：导出智能数据库实例
export const smartDatabase = SmartProductDatabase
export default SmartProductDatabase