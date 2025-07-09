/**
 * 🧠 增强推荐系统 - 集成智能算法与模拟数据
 * 提供生产级推荐服务，支持个性化学习
 */

import { SmartRecommendationEngine, UserPreferences, QuestionnaireData, RecommendationResult, createRecommendationEngine, RECOMMENDATION_PRESETS } from './recommendations'
import { mockProducts } from './mock-data'
import { LightingProduct } from './types'

// 用户行为追踪
export interface UserBehaviorTracker {
  sessionId: string
  userId?: string
  interactions: ProductInteraction[]
  preferences: Partial<QuestionnaireData>
  startTime: Date
}

// 产品交互记录
export interface ProductInteraction {
  productId: string
  action: 'view' | 'click' | 'favorite' | 'cart_add' | 'purchase' | 'share'
  timestamp: Date
  duration?: number
  metadata?: Record<string, any>
}

// 推荐上下文
export interface RecommendationContext {
  userBehavior?: UserBehaviorTracker
  sessionHistory?: string[]
  deviceType?: 'mobile' | 'tablet' | 'desktop'
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  source?: 'questionnaire' | 'browse' | 'search' | 'category'
}

// 增强推荐结果
export interface EnhancedRecommendationResult extends RecommendationResult {
  explanation: string
  confidence_level: 'high' | 'medium' | 'low'
  personalization_strength: number
  similar_products?: LightingProduct[]
  price_comparison?: {
    market_position: 'budget' | 'mid-range' | 'premium'
    value_score: number
  }
}

// 推荐策略
export type RecommendationStrategy = 
  | 'personalized'      // 个性化推荐
  | 'popular'          // 热门产品
  | 'budget_optimized' // 预算优化
  | 'style_focused'    // 风格导向
  | 'exploratory'      // 探索性推荐
  | 'seasonal'         // 季节性推荐

// 主推荐服务类
export class EnhancedRecommendationService {
  private engine: SmartRecommendationEngine
  private products: LightingProduct[]
  private userBehaviors: Map<string, UserBehaviorTracker> = new Map()

  constructor(products: LightingProduct[] = mockProducts) {
    this.products = products
    this.engine = createRecommendationEngine(products, 'DEFAULT')
  }

  /**
   * 生成增强推荐
   */
  async generateEnhancedRecommendations(
    questionnaire: QuestionnaireData,
    context: RecommendationContext = {},
    strategy: RecommendationStrategy = 'personalized'
  ): Promise<EnhancedRecommendationResult[]> {
    
    // 构建用户偏好
    const userPreferences = this.buildUserPreferences(questionnaire, context)
    
    // 根据策略选择配置
    const config = this.selectRecommendationConfig(strategy, context)
    this.engine = new SmartRecommendationEngine(this.products, config)
    
    // 生成基础推荐
    const baseRecommendations = await this.engine.generateRecommendations(
      userPreferences,
      context.sessionHistory || []
    )
    
    // 增强推荐结果
    const enhancedResults = await Promise.all(
      baseRecommendations.map(result => this.enhanceRecommendation(result, questionnaire, context))
    )
    
    // 记录用户行为
    this.trackRecommendationGenerated(questionnaire, enhancedResults, context)
    
    return enhancedResults
  }

  /**
   * 快速推荐（用于首页等场景）
   */
  async getQuickRecommendations(
    preferences: Partial<QuestionnaireData> = {},
    limit: number = 6
  ): Promise<EnhancedRecommendationResult[]> {
    
    const defaultQuestionnaire: QuestionnaireData = {
      room_type: preferences.room_type || '客厅',
      room_size: preferences.room_size || 'medium',
      style_preference: preferences.style_preference || '现代简约',
      budget_min: preferences.budget_min || 100,
      budget_max: preferences.budget_max || 1000,
      smart_features: preferences.smart_features || false
    }
    
    const userPreferences: UserPreferences = {
      questionnaire: defaultQuestionnaire
    }
    
    // 使用高转化配置
    const engine = new SmartRecommendationEngine(this.products, RECOMMENDATION_PRESETS.HIGH_CONVERSION)
    const recommendations = await engine.generateRecommendations(userPreferences)
    
    return recommendations.slice(0, limit).map(result => ({
      ...result,
      explanation: this.generateQuickExplanation(result),
      confidence_level: result.confidence > 0.8 ? 'high' : result.confidence > 0.6 ? 'medium' : 'low',
      personalization_strength: 0.3 // 快速推荐个性化程度较低
    }))
  }

  /**
   * 相似产品推荐
   */
  async getSimilarProducts(
    productId: string,
    limit: number = 4
  ): Promise<LightingProduct[]> {
    
    const targetProduct = this.products.find(p => p.id === productId)
    if (!targetProduct) return []
    
    // 基于类别、价格、品牌的相似度计算
    const similarities = this.products
      .filter(p => p.id !== productId)
      .map(product => ({
        product,
        similarity: this.calculateProductSimilarity(targetProduct, product)
      }))
      .sort((a, b) => b.similarity - a.similarity)
    
    return similarities.slice(0, limit).map(item => item.product)
  }

  /**
   * 记录用户行为
   */
  trackUserBehavior(
    sessionId: string,
    interaction: Omit<ProductInteraction, 'timestamp'>
  ): void {
    
    let tracker = this.userBehaviors.get(sessionId)
    if (!tracker) {
      tracker = {
        sessionId,
        interactions: [],
        preferences: {},
        startTime: new Date()
      }
      this.userBehaviors.set(sessionId, tracker)
    }
    
    tracker.interactions.push({
      ...interaction,
      timestamp: new Date()
    })
    
    // 限制存储大小，只保留最近的100条记录
    if (tracker.interactions.length > 100) {
      tracker.interactions = tracker.interactions.slice(-100)
    }
  }

  /**
   * 获取热门产品
   */
  getPopularProducts(limit: number = 8): LightingProduct[] {
    return this.products
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * Math.log(a.review_count || 1)
        const scoreB = (b.rating || 0) * Math.log(b.review_count || 1)
        return scoreB - scoreA
      })
      .slice(0, limit)
  }

  /**
   * 获取预算友好的产品
   */
  getBudgetFriendlyProducts(
    maxPrice: number,
    limit: number = 6
  ): LightingProduct[] {
    return this.products
      .filter(p => p.price <= maxPrice)
      .sort((a, b) => {
        // 按性价比排序：评分/价格
        const valueA = (a.rating || 0) / a.price
        const valueB = (b.rating || 0) / b.price
        return valueB - valueA
      })
      .slice(0, limit)
  }

  /**
   * 构建用户偏好
   */
  private buildUserPreferences(
    questionnaire: QuestionnaireData,
    context: RecommendationContext
  ): UserPreferences {
    
    const preferences: UserPreferences = { questionnaire }
    
    // 添加行为历史
    if (context.userBehavior) {
      const tracker = context.userBehavior
      
      preferences.clickHistory = tracker.interactions
        .filter(i => i.action === 'click')
        .map(i => ({
          productId: i.productId,
          timestamp: i.timestamp,
          type: 'click' as const,
          duration: i.duration
        }))
      
      preferences.favoriteHistory = tracker.interactions
        .filter(i => i.action === 'favorite')
        .map(i => i.productId)
      
      preferences.viewTimeData = tracker.interactions
        .filter(i => i.action === 'view' && i.duration)
        .map(i => ({
          productId: i.productId,
          viewTime: i.duration!,
          timestamp: i.timestamp
        }))
    }
    
    return preferences
  }

  /**
   * 选择推荐配置
   */
  private selectRecommendationConfig(
    strategy: RecommendationStrategy,
    context: RecommendationContext
  ) {
    switch (strategy) {
      case 'personalized':
        return RECOMMENDATION_PRESETS.DEFAULT
      case 'popular':
      case 'budget_optimized':
        return RECOMMENDATION_PRESETS.HIGH_CONVERSION
      case 'exploratory':
      case 'seasonal':
        return RECOMMENDATION_PRESETS.EXPLORATION
      default:
        return RECOMMENDATION_PRESETS.DEFAULT
    }
  }

  /**
   * 增强推荐结果
   */
  private async enhanceRecommendation(
    result: RecommendationResult,
    questionnaire: QuestionnaireData,
    context: RecommendationContext
  ): Promise<EnhancedRecommendationResult> {
    
    // 生成详细解释
    const explanation = this.generateDetailedExplanation(result, questionnaire)
    
    // 确定置信度等级
    const confidence_level = result.confidence > 0.8 ? 'high' as const : 
                           result.confidence > 0.6 ? 'medium' as const : 'low' as const
    
    // 计算个性化强度
    const personalization_strength = context.userBehavior 
      ? Math.min(context.userBehavior.interactions.length / 20, 1.0)
      : 0.1
    
    // 获取相似产品
    const similar_products = await this.getSimilarProducts(result.product.id, 3)
    
    // 价格比较分析
    const price_comparison = this.analyzePricePosition(result.product, questionnaire)
    
    return {
      ...result,
      explanation,
      confidence_level,
      personalization_strength,
      similar_products,
      price_comparison
    }
  }

  /**
   * 生成详细解释
   */
  private generateDetailedExplanation(
    result: RecommendationResult,
    questionnaire: QuestionnaireData
  ): string {
    
    const product = result.product
    const reasons = result.reasons
    
    let explanation = `为您推荐${product.name}，`
    
    if (reasons.includes('价格符合您的预算')) {
      explanation += '价格在您的预算范围内，'
    }
    
    if (reasons.some(r => r.includes('风格'))) {
      explanation += `符合您喜欢的${questionnaire.style_preference}风格，`
    }
    
    if (reasons.some(r => r.includes('适合'))) {
      explanation += `非常适合您的${questionnaire.room_type}，`
    }
    
    if (product.rating && product.rating >= 4.5) {
      explanation += `用户评价出色（${product.rating}星），`
    }
    
    explanation += `是${result.category === 'perfect_match' ? '完美匹配' : 
                        result.category === 'popular_choice' ? '热门之选' : 
                        result.category === 'budget_friendly' ? '超值推荐' : '优质选择'}。`
    
    return explanation
  }

  /**
   * 生成快速解释
   */
  private generateQuickExplanation(result: RecommendationResult): string {
    const reasons = result.reasons.slice(0, 2)
    return reasons.length > 0 ? reasons.join('，') : '为您精心挑选'
  }

  /**
   * 计算产品相似度
   */
  private calculateProductSimilarity(
    product1: LightingProduct,
    product2: LightingProduct
  ): number {
    
    let similarity = 0
    
    // 类别相似度
    if (product1.category === product2.category) {
      similarity += 0.4
    }
    
    // 价格相似度
    const priceRatio = Math.min(product1.price, product2.price) / 
                      Math.max(product1.price, product2.price)
    similarity += priceRatio * 0.3
    
    // 品牌相似度
    if (product1.brand === product2.brand) {
      similarity += 0.2
    }
    
    // 功能相似度
    const features1 = product1.features || []
    const features2 = product2.features || []
    const commonFeatures = features1.filter(f => features2.includes(f))
    const featureSimilarity = commonFeatures.length / Math.max(features1.length, features2.length, 1)
    similarity += featureSimilarity * 0.1
    
    return similarity
  }

  /**
   * 分析价格位置
   */
  private analyzePricePosition(
    product: LightingProduct,
    questionnaire: QuestionnaireData
  ) {
    
    const budgetRange = questionnaire.budget_max - questionnaire.budget_min
    const productPosition = (product.price - questionnaire.budget_min) / budgetRange
    
    let market_position: 'budget' | 'mid-range' | 'premium'
    if (productPosition <= 0.3) {
      market_position = 'budget'
    } else if (productPosition <= 0.7) {
      market_position = 'mid-range'
    } else {
      market_position = 'premium'
    }
    
    // 计算性价比分数
    const value_score = (product.rating || 0) / (product.price / 100)
    
    return {
      market_position,
      value_score: Math.min(value_score, 10) // 限制在0-10范围
    }
  }

  /**
   * 记录推荐生成事件
   */
  private trackRecommendationGenerated(
    questionnaire: QuestionnaireData,
    results: EnhancedRecommendationResult[],
    context: RecommendationContext
  ): void {
    
    // 这里可以记录到分析系统
    console.log('Recommendation generated:', {
      questionnaire,
      resultCount: results.length,
      avgConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
      context
    })
  }
}

// 单例服务实例
export const recommendationService = new EnhancedRecommendationService()

// 便捷函数
export const getSmartRecommendations = (
  questionnaire: QuestionnaireData,
  context?: RecommendationContext
) => recommendationService.generateEnhancedRecommendations(questionnaire, context)

export const getQuickRecommendations = (
  preferences?: Partial<QuestionnaireData>,
  limit?: number
) => recommendationService.getQuickRecommendations(preferences, limit)

export const trackUserInteraction = (
  sessionId: string,
  interaction: Omit<ProductInteraction, 'timestamp'>
) => recommendationService.trackUserBehavior(sessionId, interaction)

export default EnhancedRecommendationService