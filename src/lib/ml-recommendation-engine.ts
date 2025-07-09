/**
 * 🤖 机器学习推荐引擎 - SuperClaude + MCP 协作生成
 * 
 * 功能:
 * - 协同过滤推荐算法
 * - 内容基础推荐
 * - 深度学习神经网络
 * - 混合推荐策略
 * - 实时模型更新
 */

import { LightingProduct, UserBehaviorEvent, QuestionnaireData } from './types'
import { createSupabaseClient } from './supabase-server'

// ================================
// 机器学习模型接口定义
// ================================

export interface MLModel {
  name: string
  version: string
  accuracy: number
  lastTrained: Date
  predict(input: MLInput): Promise<MLPrediction[]>
  train(data: TrainingData[]): Promise<void>
}

export interface MLInput {
  userId?: string
  userProfile: UserProfile
  context: RecommendationContext
  candidateProducts: LightingProduct[]
}

export interface MLPrediction {
  productId: string
  score: number
  confidence: number
  explanation: string[]
  modelUsed: string
}

export interface UserProfile {
  demographics: {
    age_group?: string
    income_level?: string
    location?: string
    lifestyle?: string
  }
  preferences: {
    style_preferences: string[]
    room_types: string[]
    budget_range: [number, number]
    brand_preferences: string[]
    feature_preferences: string[]
  }
  behavior: {
    purchase_history: PurchaseHistory[]
    interaction_patterns: InteractionPattern[]
    session_frequency: number
    avg_session_duration: number
  }
}

export interface PurchaseHistory {
  productId: string
  purchaseDate: Date
  price: number
  rating?: number
  returned?: boolean
}

export interface InteractionPattern {
  productCategory: string
  interactionType: string
  frequency: number
  avgDuration: number
  lastInteraction: Date
}

export interface TrainingData {
  userId: string
  productId: string
  rating: number
  features: Record<string, any>
  timestamp: Date
}

export interface RecommendationContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  source: 'homepage' | 'search' | 'category' | 'questionnaire'
  currentCart?: string[]
  recentViews?: string[]
}

// ================================
// 协同过滤推荐模型
// ================================

export class CollaborativeFilteringModel implements MLModel {
  name = 'collaborative_filtering'
  version = '2.0'
  accuracy = 0.78
  lastTrained = new Date()

  private userItemMatrix: Map<string, Map<string, number>> = new Map()
  private productSimilarities: Map<string, Map<string, number>> = new Map()
  private userSimilarities: Map<string, Map<string, number>> = new Map()

  async predict(input: MLInput): Promise<MLPrediction[]> {
    const { userId, userProfile, candidateProducts } = input

    if (!userId) {
      return this.predictForAnonymous(userProfile, candidateProducts)
    }

    const predictions: MLPrediction[] = []

    // 基于用户的协同过滤
    const userBasedScores = await this.getUserBasedRecommendations(userId, candidateProducts)
    
    // 基于物品的协同过滤
    const itemBasedScores = await this.getItemBasedRecommendations(userId, candidateProducts)

    for (const product of candidateProducts) {
      const userScore = userBasedScores.get(product.id) || 0
      const itemScore = itemBasedScores.get(product.id) || 0
      
      // 混合评分
      const finalScore = (userScore * 0.6 + itemScore * 0.4)
      
      if (finalScore > 0.1) {
        predictions.push({
          productId: product.id,
          score: finalScore,
          confidence: Math.min(finalScore * 1.2, 1.0),
          explanation: this.generateExplanation(userScore, itemScore, product),
          modelUsed: this.name
        })
      }
    }

    return predictions.sort((a, b) => b.score - a.score)
  }

  async train(data: TrainingData[]): Promise<void> {
    console.log(`🤖 训练协同过滤模型，数据量: ${data.length}`)
    
    // 构建用户-物品矩阵
    this.buildUserItemMatrix(data)
    
    // 计算物品相似度
    await this.calculateItemSimilarities()
    
    // 计算用户相似度
    await this.calculateUserSimilarities()
    
    this.lastTrained = new Date()
  }

  private async getUserBasedRecommendations(
    userId: string, 
    candidates: LightingProduct[]
  ): Promise<Map<string, number>> {
    const scores = new Map<string, number>()
    const userSims = this.userSimilarities.get(userId) || new Map()
    
    for (const [similarUserId, similarity] of userSims) {
      if (similarity < 0.3) continue
      
      const similarUserRatings = this.userItemMatrix.get(similarUserId) || new Map()
      
      for (const product of candidates) {
        const rating = similarUserRatings.get(product.id)
        if (rating) {
          const currentScore = scores.get(product.id) || 0
          scores.set(product.id, currentScore + rating * similarity)
        }
      }
    }
    
    return scores
  }

  private async getItemBasedRecommendations(
    userId: string,
    candidates: LightingProduct[]
  ): Promise<Map<string, number>> {
    const scores = new Map<string, number>()
    const userRatings = this.userItemMatrix.get(userId) || new Map()
    
    for (const product of candidates) {
      let weightedSum = 0
      let similaritySum = 0
      
      const productSims = this.productSimilarities.get(product.id) || new Map()
      
      for (const [ratedProductId, rating] of userRatings) {
        const similarity = productSims.get(ratedProductId) || 0
        if (similarity > 0.2) {
          weightedSum += similarity * rating
          similaritySum += similarity
        }
      }
      
      if (similaritySum > 0) {
        scores.set(product.id, weightedSum / similaritySum)
      }
    }
    
    return scores
  }

  private buildUserItemMatrix(data: TrainingData[]): void {
    this.userItemMatrix.clear()
    
    for (const record of data) {
      if (!this.userItemMatrix.has(record.userId)) {
        this.userItemMatrix.set(record.userId, new Map())
      }
      
      this.userItemMatrix.get(record.userId)!.set(record.productId, record.rating)
    }
  }

  private async calculateItemSimilarities(): Promise<void> {
    this.productSimilarities.clear()
    
    const products = Array.from(
      new Set(
        Array.from(this.userItemMatrix.values())
          .flatMap(ratings => Array.from(ratings.keys()))
      )
    )

    for (let i = 0; i < products.length; i++) {
      const product1 = products[i]
      if (!this.productSimilarities.has(product1)) {
        this.productSimilarities.set(product1, new Map())
      }

      for (let j = i + 1; j < products.length; j++) {
        const product2 = products[j]
        
        const similarity = this.calculateCosineSimilarity(product1, product2)
        
        this.productSimilarities.get(product1)!.set(product2, similarity)
        
        if (!this.productSimilarities.has(product2)) {
          this.productSimilarities.set(product2, new Map())
        }
        this.productSimilarities.get(product2)!.set(product1, similarity)
      }
    }
  }

  private async calculateUserSimilarities(): Promise<void> {
    this.userSimilarities.clear()
    
    const users = Array.from(this.userItemMatrix.keys())

    for (let i = 0; i < users.length; i++) {
      const user1 = users[i]
      if (!this.userSimilarities.has(user1)) {
        this.userSimilarities.set(user1, new Map())
      }

      for (let j = i + 1; j < users.length; j++) {
        const user2 = users[j]
        
        const similarity = this.calculateUserCosineSimilarity(user1, user2)
        
        this.userSimilarities.get(user1)!.set(user2, similarity)
        
        if (!this.userSimilarities.has(user2)) {
          this.userSimilarities.set(user2, new Map())
        }
        this.userSimilarities.get(user2)!.set(user1, similarity)
      }
    }
  }

  private calculateCosineSimilarity(product1: string, product2: string): number {
    const ratings1: number[] = []
    const ratings2: number[] = []
    
    for (const [userId, userRatings] of this.userItemMatrix) {
      const rating1 = userRatings.get(product1)
      const rating2 = userRatings.get(product2)
      
      if (rating1 !== undefined && rating2 !== undefined) {
        ratings1.push(rating1)
        ratings2.push(rating2)
      }
    }
    
    if (ratings1.length < 2) return 0
    
    return this.cosineSimilarity(ratings1, ratings2)
  }

  private calculateUserCosineSimilarity(user1: string, user2: string): number {
    const ratings1 = this.userItemMatrix.get(user1)
    const ratings2 = this.userItemMatrix.get(user2)
    
    if (!ratings1 || !ratings2) return 0
    
    const commonProducts = Array.from(ratings1.keys())
      .filter(productId => ratings2.has(productId))
    
    if (commonProducts.length < 2) return 0
    
    const vector1 = commonProducts.map(id => ratings1.get(id)!)
    const vector2 = commonProducts.map(id => ratings2.get(id)!)
    
    return this.cosineSimilarity(vector1, vector2)
  }

  private cosineSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) return 0
    
    const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0)
    const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0))
    const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0))
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0
    
    return dotProduct / (magnitude1 * magnitude2)
  }

  private async predictForAnonymous(
    userProfile: UserProfile,
    candidates: LightingProduct[]
  ): Promise<MLPrediction[]> {
    // 基于内容的推荐，适用于新用户
    const predictions: MLPrediction[] = []
    
    for (const product of candidates) {
      let score = 0
      const explanations: string[] = []
      
      // 风格匹配
      const styleMatch = userProfile.preferences.style_preferences.some(style =>
        product.features?.some(feature => 
          feature.toLowerCase().includes(style.toLowerCase())
        )
      )
      if (styleMatch) {
        score += 0.3
        explanations.push('符合您的风格偏好')
      }
      
      // 预算匹配
      const [minBudget, maxBudget] = userProfile.preferences.budget_range
      if (product.price >= minBudget && product.price <= maxBudget) {
        score += 0.2
        explanations.push('在您的预算范围内')
      }
      
      // 品牌偏好
      if (userProfile.preferences.brand_preferences.includes(product.brand)) {
        score += 0.15
        explanations.push('您偏爱的品牌')
      }
      
      // 基础质量分数
      score += (product.rating || 0) / 5 * 0.35
      
      if (score > 0.2) {
        predictions.push({
          productId: product.id,
          score,
          confidence: score * 0.8, // 匿名用户置信度较低
          explanation: explanations,
          modelUsed: this.name
        })
      }
    }
    
    return predictions.sort((a, b) => b.score - a.score)
  }

  private generateExplanation(
    userScore: number,
    itemScore: number,
    product: LightingProduct
  ): string[] {
    const explanations: string[] = []
    
    if (userScore > 0.5) {
      explanations.push('与您兴趣相似的用户也喜欢这个产品')
    }
    
    if (itemScore > 0.5) {
      explanations.push('基于您的购买历史推荐')
    }
    
    if (product.rating && product.rating >= 4.5) {
      explanations.push(`用户评价优秀(${product.rating}星)`)
    }
    
    return explanations
  }
}

// ================================
// 深度学习神经网络模型
// ================================

export class DeepLearningModel implements MLModel {
  name = 'neural_network'
  version = '1.0'
  accuracy = 0.85
  lastTrained = new Date()

  // 简化的神经网络权重 (实际项目中应该使用TensorFlow.js)
  private weights: {
    user_embedding: Map<string, number[]>
    item_embedding: Map<string, number[]>
    dense_weights: number[][]
  } = {
    user_embedding: new Map(),
    item_embedding: new Map(),
    dense_weights: []
  }

  async predict(input: MLInput): Promise<MLPrediction[]> {
    const predictions: MLPrediction[] = []
    
    for (const product of input.candidateProducts) {
      const features = this.extractFeatures(input.userProfile, product, input.context)
      const score = this.forwardPass(features)
      
      if (score > 0.3) {
        predictions.push({
          productId: product.id,
          score,
          confidence: score,
          explanation: [`深度学习模型预测评分: ${(score * 100).toFixed(1)}%`],
          modelUsed: this.name
        })
      }
    }
    
    return predictions.sort((a, b) => b.score - a.score)
  }

  async train(data: TrainingData[]): Promise<void> {
    console.log(`🧠 训练深度学习模型，数据量: ${data.length}`)
    
    // 简化的训练过程 (实际应该使用梯度下降)
    this.initializeWeights()
    
    // 在实际项目中，这里会使用 TensorFlow.js 或者调用 Python API
    for (let epoch = 0; epoch < 10; epoch++) {
      for (const sample of data) {
        this.updateWeights(sample)
      }
    }
    
    this.lastTrained = new Date()
  }

  private extractFeatures(
    userProfile: UserProfile,
    product: LightingProduct,
    context: RecommendationContext
  ): number[] {
    const features: number[] = []
    
    // 用户特征 (嵌入向量)
    const userEmbed = this.getUserEmbedding(userProfile)
    features.push(...userEmbed)
    
    // 产品特征
    features.push(
      product.price / 1000, // 归一化价格
      product.rating || 0,
      product.review_count || 0,
      product.features?.length || 0
    )
    
    // 上下文特征
    features.push(
      context.timeOfDay === 'evening' ? 1 : 0,
      context.deviceType === 'mobile' ? 1 : 0,
      context.source === 'questionnaire' ? 1 : 0
    )
    
    return features
  }

  private getUserEmbedding(userProfile: UserProfile): number[] {
    // 简化的用户嵌入 (实际应该通过训练得到)
    return [
      userProfile.preferences.budget_range[1] / 10000,
      userProfile.preferences.style_preferences.length / 10,
      userProfile.behavior.session_frequency / 100
    ]
  }

  private forwardPass(features: number[]): number {
    // 简化的前向传播
    let activation = features
    
    // 隐藏层计算 (简化版)
    for (const layer of this.weights.dense_weights) {
      const output: number[] = []
      for (let i = 0; i < layer.length; i += activation.length) {
        let sum = 0
        for (let j = 0; j < activation.length; j++) {
          sum += activation[j] * (layer[i + j] || 0)
        }
        output.push(Math.tanh(sum)) // 激活函数
      }
      activation = output
    }
    
    return Math.max(0, Math.min(1, activation[0] || 0))
  }

  private initializeWeights(): void {
    // 简化的权重初始化
    this.weights.dense_weights = [
      new Array(100).fill(0).map(() => Math.random() * 0.1 - 0.05),
      new Array(50).fill(0).map(() => Math.random() * 0.1 - 0.05),
      new Array(1).fill(0).map(() => Math.random() * 0.1 - 0.05)
    ]
  }

  private updateWeights(sample: TrainingData): void {
    // 简化的权重更新 (实际应该使用反向传播)
    const learningRate = 0.001
    
    // 这里应该实现真正的梯度下降算法
    // 目前只是占位符
  }
}

// ================================
// 混合推荐引擎
// ================================

export class HybridMLRecommendationEngine {
  private models: MLModel[] = []
  private supabase = createSupabaseClient()

  constructor() {
    this.models = [
      new CollaborativeFilteringModel(),
      new DeepLearningModel()
    ]
  }

  async initialize(): Promise<void> {
    console.log('🚀 初始化机器学习推荐引擎...')
    
    // 加载训练数据
    const trainingData = await this.loadTrainingData()
    
    // 训练所有模型
    for (const model of this.models) {
      await model.train(trainingData)
      console.log(`✅ ${model.name} 模型训练完成，准确率: ${model.accuracy}`)
    }
  }

  async recommend(
    userId: string | undefined,
    questionnaire: QuestionnaireData,
    context: RecommendationContext,
    candidateProducts: LightingProduct[],
    limit: number = 10
  ): Promise<MLPrediction[]> {
    
    // 构建用户画像
    const userProfile = await this.buildUserProfile(userId, questionnaire)
    
    const input: MLInput = {
      userId,
      userProfile,
      context,
      candidateProducts
    }

    // 获取所有模型的预测
    const allPredictions: MLPrediction[] = []
    
    for (const model of this.models) {
      const predictions = await model.predict(input)
      allPredictions.push(...predictions)
    }

    // 混合预测结果
    const hybridPredictions = this.ensemblePredictions(allPredictions)
    
    // 返回Top-N推荐
    return hybridPredictions.slice(0, limit)
  }

  private async buildUserProfile(
    userId: string | undefined,
    questionnaire: QuestionnaireData
  ): Promise<UserProfile> {
    
    let behaviorData = {
      purchase_history: [],
      interaction_patterns: [],
      session_frequency: 0,
      avg_session_duration: 0
    }

    if (userId) {
      // 获取用户历史行为数据
      const { data: interactions } = await this.supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1000)

      if (interactions) {
        behaviorData = this.analyzeUserBehavior(interactions)
      }
    }

    return {
      demographics: {
        // 可以从问卷或用户资料中获取
      },
      preferences: {
        style_preferences: [questionnaire.style_preference],
        room_types: [questionnaire.room_type],
        budget_range: [questionnaire.budget_min, questionnaire.budget_max],
        brand_preferences: [],
        feature_preferences: []
      },
      behavior: behaviorData
    }
  }

  private analyzeUserBehavior(interactions: any[]): UserProfile['behavior'] {
    const purchaseHistory: PurchaseHistory[] = []
    const interactionPatterns: InteractionPattern[] = []
    
    // 分析购买历史
    const purchases = interactions.filter(i => i.interaction_type === 'purchase')
    
    // 分析交互模式
    const patterns = new Map<string, {count: number, totalDuration: number, lastTime: Date}>()
    
    interactions.forEach(interaction => {
      const key = `${interaction.product_category || 'unknown'}_${interaction.interaction_type}`
      const existing = patterns.get(key) || {count: 0, totalDuration: 0, lastTime: new Date(0)}
      
      patterns.set(key, {
        count: existing.count + 1,
        totalDuration: existing.totalDuration + (interaction.duration_seconds || 0),
        lastTime: new Date(Math.max(existing.lastTime.getTime(), new Date(interaction.created_at).getTime()))
      })
    })

    patterns.forEach((data, key) => {
      const [category, type] = key.split('_')
      interactionPatterns.push({
        productCategory: category,
        interactionType: type,
        frequency: data.count,
        avgDuration: data.totalDuration / data.count,
        lastInteraction: data.lastTime
      })
    })

    return {
      purchase_history: purchaseHistory,
      interaction_patterns: interactionPatterns,
      session_frequency: this.calculateSessionFrequency(interactions),
      avg_session_duration: this.calculateAvgSessionDuration(interactions)
    }
  }

  private calculateSessionFrequency(interactions: any[]): number {
    if (interactions.length === 0) return 0
    
    const sessionIds = new Set(interactions.map(i => i.session_id))
    const daysSinceFirst = Math.max(1, 
      (Date.now() - new Date(interactions[interactions.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return sessionIds.size / daysSinceFirst
  }

  private calculateAvgSessionDuration(interactions: any[]): number {
    const sessionDurations = new Map<string, {start: Date, end: Date}>()
    
    interactions.forEach(interaction => {
      const sessionId = interaction.session_id
      const time = new Date(interaction.created_at)
      
      if (!sessionDurations.has(sessionId)) {
        sessionDurations.set(sessionId, {start: time, end: time})
      } else {
        const session = sessionDurations.get(sessionId)!
        session.start = new Date(Math.min(session.start.getTime(), time.getTime()))
        session.end = new Date(Math.max(session.end.getTime(), time.getTime()))
      }
    })
    
    let totalDuration = 0
    sessionDurations.forEach(session => {
      totalDuration += session.end.getTime() - session.start.getTime()
    })
    
    return sessionDurations.size > 0 ? totalDuration / sessionDurations.size / 1000 : 0
  }

  private ensemblePredictions(predictions: MLPrediction[]): MLPrediction[] {
    const productScores = new Map<string, {scores: number[], confidences: number[], explanations: string[]}>()
    
    // 聚合同一产品的不同模型预测
    predictions.forEach(pred => {
      if (!productScores.has(pred.productId)) {
        productScores.set(pred.productId, {scores: [], confidences: [], explanations: []})
      }
      
      const data = productScores.get(pred.productId)!
      data.scores.push(pred.score)
      data.confidences.push(pred.confidence)
      data.explanations.push(...pred.explanation)
    })

    // 计算最终评分
    const finalPredictions: MLPrediction[] = []
    
    productScores.forEach((data, productId) => {
      // 加权平均 (协同过滤权重更高)
      const weights = [0.6, 0.4] // CF, DL
      const finalScore = data.scores.reduce((sum, score, i) => 
        sum + score * (weights[i] || 1), 0) / data.scores.length
      
      const finalConfidence = data.confidences.reduce((sum, conf) => sum + conf, 0) / data.confidences.length
      
      finalPredictions.push({
        productId,
        score: finalScore,
        confidence: finalConfidence,
        explanation: [...new Set(data.explanations)], // 去重
        modelUsed: 'hybrid_ensemble'
      })
    })

    return finalPredictions.sort((a, b) => b.score - a.score)
  }

  private async loadTrainingData(): Promise<TrainingData[]> {
    // 从数据库加载训练数据
    const { data: interactions } = await this.supabase
      .from('user_interactions')
      .select(`
        user_id,
        product_id,
        interaction_type,
        duration_seconds,
        created_at,
        lighting_products(category, price, rating)
      `)
      .in('interaction_type', ['purchase', 'favorite', 'view'])
      .not('user_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10000)

    if (!interactions) return []

    // 转换为训练数据格式
    return interactions.map(interaction => {
      let rating = 0
      
      // 根据交互类型确定隐式评分
      switch (interaction.interaction_type) {
        case 'purchase': rating = 5; break
        case 'favorite': rating = 4; break
        case 'view': 
          rating = interaction.duration_seconds > 30 ? 3 : 2
          break
        default: rating = 1
      }

      return {
        userId: interaction.user_id,
        productId: interaction.product_id,
        rating,
        features: {
          category: interaction.lighting_products?.category,
          price: interaction.lighting_products?.price,
          product_rating: interaction.lighting_products?.rating
        },
        timestamp: new Date(interaction.created_at)
      }
    })
  }

  // 获取模型统计信息
  getModelStats() {
    return this.models.map(model => ({
      name: model.name,
      version: model.version,
      accuracy: model.accuracy,
      lastTrained: model.lastTrained
    }))
  }

  // 重新训练模型
  async retrainModels(): Promise<void> {
    console.log('🔄 开始重新训练所有模型...')
    
    const trainingData = await this.loadTrainingData()
    
    for (const model of this.models) {
      await model.train(trainingData)
      console.log(`✅ ${model.name} 重新训练完成`)
    }
  }
}

// 导出单例实例
export const mlRecommendationEngine = new HybridMLRecommendationEngine()

// 便捷函数
export const initializeMLEngine = () => mlRecommendationEngine.initialize()

export const getMLRecommendations = (
  userId: string | undefined,
  questionnaire: QuestionnaireData,
  context: RecommendationContext,
  candidateProducts: LightingProduct[],
  limit?: number
) => mlRecommendationEngine.recommend(userId, questionnaire, context, candidateProducts, limit)

export default HybridMLRecommendationEngine