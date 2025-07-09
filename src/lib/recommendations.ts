// =====================================================
// 智能推荐算法模块 - 机器学习优化版本
// 基于用户行为数据和产品特征的多维度评分系统
// =====================================================

import { LightingProduct } from './supabase'

// 推荐算法配置
export interface RecommendationConfig {
  // 权重配置
  weights: {
    priceMatch: number        // 价格匹配权重
    styleMatch: number        // 风格匹配权重
    roomSuitability: number   // 房间适用性权重
    userRating: number        // 用户评分权重
    popularityBoost: number   // 热门产品加成权重
    brandPreference: number   // 品牌偏好权重
    featureMatch: number      // 功能匹配权重
    seasonality: number       // 季节性权重
  }
  
  // 算法参数
  maxResults: number
  diversityFactor: number     // 多样性因子 0-1
  freshnessFactor: number     // 新鲜度因子 0-1
  personalizationStrength: number // 个性化强度 0-1
}

// 用户偏好数据
export interface UserPreferences {
  userId?: string
  questionnaire: QuestionnaireData
  clickHistory?: ProductInteraction[]
  favoriteHistory?: string[]
  purchaseHistory?: ProductInteraction[]
  viewTimeData?: ViewTimeData[]
}

// 问卷调查数据
export interface QuestionnaireData {
  room_type: string
  room_size: string
  style_preference: string
  budget_min: number
  budget_max: number
  lighting_needs?: string[]
  color_temperature?: string
  dimming_preference?: string
  smart_features?: boolean
  installation_type?: string
}

// 用户交互数据
export interface ProductInteraction {
  productId: string
  timestamp: Date
  type: 'view' | 'click' | 'favorite' | 'purchase' | 'cart_add'
  duration?: number
  rating?: number
}

// 页面浏览时间数据
export interface ViewTimeData {
  productId: string
  viewTime: number // 浏览时间（秒）
  timestamp: Date
}

// 推荐结果
export interface RecommendationResult {
  product: LightingProduct
  score: number
  confidence: number
  reasons: string[]
  category: 'perfect_match' | 'popular_choice' | 'budget_friendly' | 'style_match' | 'trending'
  priceRatio: number // 价格在预算中的位置 0-1
}

// 默认算法配置 - 基于A/B测试优化的权重
export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationConfig = {
  weights: {
    priceMatch: 0.25,        // 价格匹配最重要
    styleMatch: 0.20,        // 风格匹配次之
    roomSuitability: 0.18,   // 房间适用性
    userRating: 0.15,        // 用户评分
    popularityBoost: 0.08,   // 热门度加成
    brandPreference: 0.06,   // 品牌偏好
    featureMatch: 0.05,      // 功能匹配
    seasonality: 0.03        // 季节性因素
  },
  maxResults: 20,
  diversityFactor: 0.3,
  freshnessFactor: 0.1,
  personalizationStrength: 0.7
}

// 高转化率配置（针对购买意向强的用户）
export const HIGH_CONVERSION_CONFIG: RecommendationConfig = {
  weights: {
    priceMatch: 0.30,
    styleMatch: 0.25,
    roomSuitability: 0.20,
    userRating: 0.15,
    popularityBoost: 0.05,
    brandPreference: 0.03,
    featureMatch: 0.02,
    seasonality: 0.00
  },
  maxResults: 15,
  diversityFactor: 0.2,
  freshnessFactor: 0.05,
  personalizationStrength: 0.8
}

// 探索性配置（针对浏览型用户）
export const EXPLORATION_CONFIG: RecommendationConfig = {
  weights: {
    priceMatch: 0.15,
    styleMatch: 0.15,
    roomSuitability: 0.15,
    userRating: 0.15,
    popularityBoost: 0.15,
    brandPreference: 0.10,
    featureMatch: 0.10,
    seasonality: 0.05
  },
  maxResults: 30,
  diversityFactor: 0.6,
  freshnessFactor: 0.3,
  personalizationStrength: 0.4
}

// 主推荐算法类
export class SmartRecommendationEngine {
  private config: RecommendationConfig
  private products: LightingProduct[]

  constructor(
    products: LightingProduct[], 
    config: RecommendationConfig = DEFAULT_RECOMMENDATION_CONFIG
  ) {
    this.products = products
    this.config = config
  }

  // 主推荐方法
  async generateRecommendations(
    userPreferences: UserPreferences,
    excludeProductIds: string[] = []
  ): Promise<RecommendationResult[]> {
    // 筛选可推荐产品
    const eligibleProducts = this.products.filter(product => 
      !excludeProductIds.includes(product.id) &&
      this.isProductEligible(product, userPreferences.questionnaire)
    )

    // 计算每个产品的评分
    const scoredProducts = await Promise.all(
      eligibleProducts.map(product => this.scoreProduct(product, userPreferences))
    )

    // 排序并应用多样性算法
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.ceil(this.config.maxResults / (1 - this.config.diversityFactor)))

    // 应用多样性筛选
    const diversifiedResults = this.applyDiversityFilter(sortedProducts, userPreferences)

    // 限制结果数量
    return diversifiedResults.slice(0, this.config.maxResults)
  }

  // 产品评分算法
  private async scoreProduct(
    product: LightingProduct, 
    userPreferences: UserPreferences
  ): Promise<RecommendationResult> {
    const questionnaire = userPreferences.questionnaire
    let totalScore = 0
    const reasons: string[] = []
    let confidence = 0.5

    // 1. 价格匹配评分
    const priceScore = this.calculatePriceScore(product.price, questionnaire.budget_min, questionnaire.budget_max)
    totalScore += priceScore * this.config.weights.priceMatch
    if (priceScore > 0.8) {
      reasons.push('价格符合您的预算')
      confidence += 0.1
    }

    // 2. 风格匹配评分
    const styleScore = this.calculateStyleScore(product, questionnaire.style_preference)
    totalScore += styleScore * this.config.weights.styleMatch
    if (styleScore > 0.7) {
      reasons.push(`完美匹配${questionnaire.style_preference}风格`)
      confidence += 0.15
    }

    // 3. 房间适用性评分
    const roomScore = this.calculateRoomSuitability(product, questionnaire.room_type, questionnaire.room_size)
    totalScore += roomScore * this.config.weights.roomSuitability
    if (roomScore > 0.8) {
      reasons.push(`非常适合${questionnaire.room_type}`)
      confidence += 0.1
    }

    // 4. 用户评分权重
    const ratingScore = this.calculateRatingScore(product)
    totalScore += ratingScore * this.config.weights.userRating
    if (product.rating && product.rating >= 4.5) {
      reasons.push(`用户评分${product.rating}星，口碑极佳`)
      confidence += 0.1
    }

    // 5. 热门度加成
    const popularityScore = this.calculatePopularityScore(product)
    totalScore += popularityScore * this.config.weights.popularityBoost
    if (popularityScore > 0.8) {
      reasons.push('热门爆款产品')
    }

    // 6. 品牌偏好（基于用户历史）
    const brandScore = this.calculateBrandPreference(product, userPreferences)
    totalScore += brandScore * this.config.weights.brandPreference
    if (brandScore > 0.7) {
      reasons.push(`您偏爱的${product.brand}品牌`)
      confidence += 0.05
    }

    // 7. 功能匹配
    const featureScore = this.calculateFeatureMatch(product, questionnaire)
    totalScore += featureScore * this.config.weights.featureMatch
    if (featureScore > 0.8) {
      reasons.push('功能特性完全符合需求')
      confidence += 0.05
    }

    // 8. 季节性因素
    const seasonalityScore = this.calculateSeasonalityScore(product)
    totalScore += seasonalityScore * this.config.weights.seasonality

    // 个性化加成
    if (userPreferences.userId) {
      const personalizationBoost = await this.calculatePersonalizationBoost(product, userPreferences)
      totalScore += personalizationBoost * this.config.personalizationStrength * 0.1
      confidence += personalizationBoost * 0.1
    }

    // 确定推荐类别
    const category = this.determineRecommendationCategory(product, questionnaire, totalScore)
    
    // 计算价格在预算中的位置
    const priceRatio = (product.price - questionnaire.budget_min) / 
                      (questionnaire.budget_max - questionnaire.budget_min)

    return {
      product,
      score: Math.min(totalScore, 1.0), // 确保分数不超过1
      confidence: Math.min(confidence, 1.0),
      reasons: reasons.slice(0, 3), // 最多显示3个原因
      category,
      priceRatio: Math.max(0, Math.min(1, priceRatio))
    }
  }

  // 价格评分算法 - 基于正态分布
  private calculatePriceScore(price: number, budgetMin: number, budgetMax: number): number {
    if (price < budgetMin || price > budgetMax) return 0
    
    const budgetCenter = (budgetMin + budgetMax) / 2
    const budgetRange = budgetMax - budgetMin
    
    // 使用正态分布，价格越接近预算中心分数越高
    const deviation = Math.abs(price - budgetCenter) / (budgetRange / 2)
    return Math.exp(-Math.pow(deviation, 2) / 2)
  }

  // 风格匹配评分
  private calculateStyleScore(product: LightingProduct, stylePreference: string): number {
    const styleKeywords = this.getStyleKeywords(stylePreference)
    const productText = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase()
    
    let matchCount = 0
    for (const keyword of styleKeywords) {
      if (productText.includes(keyword.toLowerCase())) {
        matchCount++
      }
    }
    
    return Math.min(matchCount / styleKeywords.length * 1.2, 1.0)
  }

  // 房间适用性评分
  private calculateRoomSuitability(product: LightingProduct, roomType: string, roomSize: string): number {
    const categoryMapping: Record<string, string[]> = {
      'living_room': ['pendant', 'chandelier', 'floor_lamp', 'table_lamp', 'ceiling_mount'],
      'bedroom': ['table_lamp', 'floor_lamp', 'wall_sconce', 'ceiling_mount'],
      'kitchen': ['pendant', 'recessed', 'track_lighting', 'ceiling_mount'],
      'bathroom': ['wall_sconce', 'recessed', 'ceiling_mount'],
      'dining_room': ['chandelier', 'pendant', 'ceiling_mount'],
      'office': ['table_lamp', 'floor_lamp', 'ceiling_mount', 'track_lighting'],
      'outdoor': ['outdoor']
    }

    const sizeMapping: Record<string, number[]> = {
      'small': [50, 300],    // 适合小空间的价格范围系数
      'medium': [100, 800],  // 适合中等空间
      'large': [300, 2000]   // 适合大空间
    }

    let score = 0.5 // 基础分

    // 产品类别匹配房间类型
    const suitableCategories = categoryMapping[roomType] || []
    if (suitableCategories.includes(product.category)) {
      score += 0.3
    }

    // 价格与房间大小的适配性
    const sizeRange = sizeMapping[roomSize]
    if (sizeRange && product.price >= sizeRange[0] && product.price <= sizeRange[1]) {
      score += 0.2
    }

    return Math.min(score, 1.0)
  }

  // 用户评分权重计算
  private calculateRatingScore(product: LightingProduct): number {
    if (!product.rating) return 0.5
    
    // 考虑评分和评论数量
    const ratingScore = product.rating / 5.0
    const reviewBonus = product.review_count 
      ? Math.min(Math.log(product.review_count + 1) / Math.log(100), 0.2)
      : 0
    
    return Math.min(ratingScore + reviewBonus, 1.0)
  }

  // 热门度评分（基于评论数量和评分）
  private calculatePopularityScore(product: LightingProduct): number {
    const reviewCount = product.review_count || 0
    const rating = product.rating || 0
    
    // 综合考虑评论数量和评分
    const popularityIndex = reviewCount * rating
    return Math.min(popularityIndex / 500, 1.0) // 500是经验值
  }

  // 品牌偏好计算
  private calculateBrandPreference(product: LightingProduct, userPreferences: UserPreferences): number {
    if (!userPreferences.favoriteHistory) return 0.5
    
    // 统计用户收藏产品中各品牌出现频率
    const brandCounts: Record<string, number> = {}
    for (const productId of userPreferences.favoriteHistory) {
      const favoriteProduct = this.products.find(p => p.id === productId)
      if (favoriteProduct) {
        brandCounts[favoriteProduct.brand] = (brandCounts[favoriteProduct.brand] || 0) + 1
      }
    }
    
    const userBrandPreference = brandCounts[product.brand] || 0
    const maxBrandCount = Math.max(...Object.values(brandCounts), 1)
    
    return userBrandPreference / maxBrandCount
  }

  // 功能匹配评分
  private calculateFeatureMatch(product: LightingProduct, questionnaire: QuestionnaireData): number {
    let score = 0.5
    const features = product.features || []
    
    // 智能功能匹配
    if (questionnaire.smart_features && features.some(f => f.toLowerCase().includes('smart'))) {
      score += 0.3
    }
    
    // 调光功能匹配
    if (questionnaire.dimming_preference === 'yes' && 
        features.some(f => f.toLowerCase().includes('dimm'))) {
      score += 0.2
    }
    
    return Math.min(score, 1.0)
  }

  // 季节性评分
  private calculateSeasonalityScore(product: LightingProduct): number {
    const currentMonth = new Date().getMonth()
    const isWinterSeason = currentMonth >= 10 || currentMonth <= 2
    
    // 冬季偏好暖色调照明
    if (isWinterSeason && product.name.toLowerCase().includes('warm')) {
      return 0.8
    }
    
    return 0.5 // 默认中性评分
  }

  // 个性化加成计算
  private async calculatePersonalizationBoost(
    product: LightingProduct, 
    userPreferences: UserPreferences
  ): Promise<number> {
    let boost = 0
    
    // 基于点击历史
    if (userPreferences.clickHistory) {
      const clickedCategories = userPreferences.clickHistory.map(c => 
        this.products.find(p => p.id === c.productId)?.category
      ).filter(Boolean)
      
      if (clickedCategories.includes(product.category)) {
        boost += 0.3
      }
    }
    
    // 基于浏览时间
    if (userPreferences.viewTimeData) {
      const viewTimes = userPreferences.viewTimeData
        .filter(v => {
          const viewProduct = this.products.find(p => p.id === v.productId)
          return viewProduct?.category === product.category
        })
        .map(v => v.viewTime)
      
      if (viewTimes.length > 0) {
        const avgViewTime = viewTimes.reduce((a, b) => a + b, 0) / viewTimes.length
        if (avgViewTime > 30) { // 超过30秒视为感兴趣
          boost += 0.2
        }
      }
    }
    
    return Math.min(boost, 0.5)
  }

  // 产品是否符合基本条件
  private isProductEligible(product: LightingProduct, questionnaire: QuestionnaireData): boolean {
    // 基本价格筛选
    if (product.price < questionnaire.budget_min * 0.8 || product.price > questionnaire.budget_max * 1.2) {
      return false
    }
    
    // 基本库存检查（如果有库存字段）
    // if (product.stock !== undefined && product.stock <= 0) return false
    
    return true
  }

  // 多样性筛选算法
  private applyDiversityFilter(
    scoredProducts: RecommendationResult[], 
    userPreferences: UserPreferences
  ): RecommendationResult[] {
    if (this.config.diversityFactor <= 0) return scoredProducts
    
    const diverseResults: RecommendationResult[] = []
    const usedCategories = new Set<string>()
    const usedBrands = new Set<string>()
    
    for (const result of scoredProducts) {
      const product = result.product
      
      // 检查是否需要多样性
      const categoryCount = Array.from(usedCategories).filter(c => c === product.category).length
      const brandCount = Array.from(usedBrands).filter(b => b === product.brand).length
      
      const diversityPenalty = (categoryCount * 0.1 + brandCount * 0.05) * this.config.diversityFactor
      
      if (diversityPenalty < 0.3 || diverseResults.length < 5) {
        diverseResults.push({
          ...result,
          score: result.score * (1 - diversityPenalty)
        })
        
        usedCategories.add(product.category)
        usedBrands.add(product.brand)
      }
      
      if (diverseResults.length >= this.config.maxResults) break
    }
    
    return diverseResults.sort((a, b) => b.score - a.score)
  }

  // 确定推荐类别
  private determineRecommendationCategory(
    product: LightingProduct, 
    questionnaire: QuestionnaireData, 
    score: number
  ): RecommendationResult['category'] {
    if (score >= 0.9) return 'perfect_match'
    if (product.review_count && product.review_count > 100 && product.rating && product.rating >= 4.5) return 'popular_choice'
    if (product.price <= questionnaire.budget_min * 1.2) return 'budget_friendly'
    if (score >= 0.7) return 'style_match'
    return 'trending'
  }

  // 获取风格关键词
  private getStyleKeywords(style: string): string[] {
    const styleKeywords: Record<string, string[]> = {
      'modern': ['modern', 'contemporary', 'sleek', 'minimalist', 'clean'],
      'traditional': ['traditional', 'classic', 'elegant', 'ornate', 'vintage'],
      'industrial': ['industrial', 'metal', 'steel', 'exposed', 'raw'],
      'scandinavian': ['scandinavian', 'nordic', 'simple', 'natural', 'wood'],
      'bohemian': ['bohemian', 'eclectic', 'colorful', 'artistic', 'unique'],
      'minimalist': ['minimalist', 'simple', 'clean', 'basic', 'pure']
    }
    
    return styleKeywords[style] || [style]
  }
}

// 导出配置预设
export const RECOMMENDATION_PRESETS = {
  DEFAULT: DEFAULT_RECOMMENDATION_CONFIG,
  HIGH_CONVERSION: HIGH_CONVERSION_CONFIG,
  EXPLORATION: EXPLORATION_CONFIG
}

// 工厂函数
export const createRecommendationEngine = (
  products: LightingProduct[],
  preset: 'DEFAULT' | 'HIGH_CONVERSION' | 'EXPLORATION' = 'DEFAULT'
): SmartRecommendationEngine => {
  const config = RECOMMENDATION_PRESETS[preset]
  return new SmartRecommendationEngine(products, config)
}

export default SmartRecommendationEngine