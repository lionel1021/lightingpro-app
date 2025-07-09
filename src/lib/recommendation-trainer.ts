// =====================================================
// 推荐算法训练器 - 基于用户反馈的机器学习优化
// 动态调整权重，提升推荐准确性
// =====================================================

import { RecommendationConfig, RecommendationResult, UserPreferences } from './recommendations'

// 用户反馈数据
export interface UserFeedback {
  userId?: string
  questionnaireId: string
  productId: string
  feedbackType: 'view' | 'click' | 'favorite' | 'purchase' | 'ignore' | 'dislike'
  timestamp: Date
  viewDuration?: number
  rating?: number
  reasonCode?: string[]
}

// 训练数据点
export interface TrainingDataPoint {
  features: {
    priceMatch: number
    styleMatch: number
    roomSuitability: number
    userRating: number
    popularityBoost: number
    brandPreference: number
    featureMatch: number
    seasonality: number
  }
  actualOutcome: number // 0-1, 基于用户反馈计算
  recommendationScore: number
  userPreferences: UserPreferences
}

// A/B测试配置
export interface ABTestConfig {
  name: string
  description: string
  config: RecommendationConfig
  targetMetric: 'ctr' | 'conversion' | 'engagement' | 'satisfaction'
  isActive: boolean
  trafficAllocation: number // 0-1
}

// 性能指标
export interface PerformanceMetrics {
  clickThroughRate: number
  conversionRate: number
  averageEngagementTime: number
  userSatisfactionScore: number
  diversityScore: number
  noveltyScore: number
  precisionAt5: number
  precisionAt10: number
  recallAt5: number
  recallAt10: number
}

// 推荐算法训练器类
export class RecommendationTrainer {
  private trainingData: TrainingDataPoint[] = []
  private feedbackHistory: UserFeedback[] = []
  private currentConfig: RecommendationConfig
  private abTests: Map<string, ABTestConfig> = new Map()

  constructor(initialConfig: RecommendationConfig) {
    this.currentConfig = { ...initialConfig }
  }

  // 添加用户反馈
  addFeedback(feedback: UserFeedback): void {
    this.feedbackHistory.push(feedback)
    
    // 实时更新权重（简单版本）
    if (this.feedbackHistory.length % 50 === 0) {
      this.updateWeightsFromFeedback()
    }
  }

  // 添加训练数据
  addTrainingData(dataPoint: TrainingDataPoint): void {
    this.trainingData.push(dataPoint)
    
    // 保持训练数据集大小合理
    if (this.trainingData.length > 10000) {
      this.trainingData = this.trainingData.slice(-8000) // 保留最新8000条
    }
  }

  // 基于反馈更新权重
  private updateWeightsFromFeedback(): void {
    const recentFeedback = this.feedbackHistory.slice(-200) // 分析最近200条反馈
    
    // 计算各维度的成功率
    const dimensionSuccess = {
      priceMatch: this.calculateDimensionSuccess(recentFeedback, 'priceMatch'),
      styleMatch: this.calculateDimensionSuccess(recentFeedback, 'styleMatch'),
      roomSuitability: this.calculateDimensionSuccess(recentFeedback, 'roomSuitability'),
      userRating: this.calculateDimensionSuccess(recentFeedback, 'userRating'),
      popularityBoost: this.calculateDimensionSuccess(recentFeedback, 'popularityBoost'),
      brandPreference: this.calculateDimensionSuccess(recentFeedback, 'brandPreference'),
      featureMatch: this.calculateDimensionSuccess(recentFeedback, 'featureMatch'),
      seasonality: this.calculateDimensionSuccess(recentFeedback, 'seasonality')
    }

    // 根据成功率调整权重
    const totalSuccess = Object.values(dimensionSuccess).reduce((a, b) => a + b, 0)
    const learningRate = 0.1 // 学习率

    Object.keys(dimensionSuccess).forEach(dimension => {
      const currentWeight = this.currentConfig.weights[dimension as keyof typeof this.currentConfig.weights]
      const successRate = dimensionSuccess[dimension as keyof typeof dimensionSuccess]
      const targetWeight = successRate / totalSuccess
      
      // 渐进式更新权重
      this.currentConfig.weights[dimension as keyof typeof this.currentConfig.weights] = 
        currentWeight + learningRate * (targetWeight - currentWeight)
    })

    console.log('权重已更新:', this.currentConfig.weights)
  }

  // 计算某个维度的成功率
  private calculateDimensionSuccess(feedback: UserFeedback[], dimension: string): number {
    const positiveFeedback = feedback.filter(f => 
      ['click', 'favorite', 'purchase'].includes(f.feedbackType)
    )
    
    // 这里需要根据实际的推荐算法结果来计算
    // 简化版本：假设成功率与反馈类型相关
    const successCount = positiveFeedback.length
    const totalCount = feedback.length
    
    return totalCount > 0 ? successCount / totalCount : 0.5
  }

  // 创建A/B测试
  createABTest(config: ABTestConfig): void {
    this.abTests.set(config.name, config)
  }

  // 获取用户的测试组配置
  getConfigForUser(userId: string): RecommendationConfig {
    // 简单的hash分组
    const hash = this.hashString(userId || 'anonymous')
    
    for (const [name, test] of this.abTests) {
      if (test.isActive && hash % 100 < test.trafficAllocation * 100) {
        return test.config
      }
    }
    
    return this.currentConfig
  }

  // 分析A/B测试结果
  analyzeABTest(testName: string): PerformanceMetrics | null {
    const test = this.abTests.get(testName)
    if (!test) return null

    const testFeedback = this.feedbackHistory.filter(f => 
      // 这里需要根据实际情况过滤测试组用户的反馈
      this.getUserTestGroup(f.userId || 'anonymous') === testName
    )

    return this.calculateMetrics(testFeedback)
  }

  // 计算性能指标
  private calculateMetrics(feedback: UserFeedback[]): PerformanceMetrics {
    const totalViews = feedback.filter(f => f.feedbackType === 'view').length
    const totalClicks = feedback.filter(f => f.feedbackType === 'click').length
    const totalPurchases = feedback.filter(f => f.feedbackType === 'purchase').length
    
    const ctr = totalViews > 0 ? totalClicks / totalViews : 0
    const conversionRate = totalClicks > 0 ? totalPurchases / totalClicks : 0
    
    const avgEngagementTime = feedback
      .filter(f => f.viewDuration)
      .reduce((sum, f) => sum + (f.viewDuration || 0), 0) / 
      feedback.filter(f => f.viewDuration).length || 0

    const avgRating = feedback
      .filter(f => f.rating)
      .reduce((sum, f) => sum + (f.rating || 0), 0) /
      feedback.filter(f => f.rating).length || 0

    return {
      clickThroughRate: ctr,
      conversionRate: conversionRate,
      averageEngagementTime: avgEngagementTime,
      userSatisfactionScore: avgRating / 5,
      diversityScore: this.calculateDiversityScore(feedback),
      noveltyScore: this.calculateNoveltyScore(feedback),
      precisionAt5: this.calculatePrecision(feedback, 5),
      precisionAt10: this.calculatePrecision(feedback, 10),
      recallAt5: this.calculateRecall(feedback, 5),
      recallAt10: this.calculateRecall(feedback, 10)
    }
  }

  // 计算多样性分数
  private calculateDiversityScore(feedback: UserFeedback[]): number {
    const uniqueProducts = new Set(feedback.map(f => f.productId))
    return feedback.length > 0 ? uniqueProducts.size / feedback.length : 0
  }

  // 计算新颖性分数
  private calculateNoveltyScore(feedback: UserFeedback[]): number {
    // 简化版本：基于产品的点击率倒数
    const productCounts = new Map<string, number>()
    feedback.forEach(f => {
      productCounts.set(f.productId, (productCounts.get(f.productId) || 0) + 1)
    })
    
    const noveltyScores = Array.from(productCounts.values()).map(count => 1 / count)
    return noveltyScores.reduce((a, b) => a + b, 0) / noveltyScores.length || 0
  }

  // 计算精确率
  private calculatePrecision(feedback: UserFeedback[], k: number): number {
    const relevantFeedback = feedback
      .filter(f => ['click', 'favorite', 'purchase'].includes(f.feedbackType))
      .slice(0, k)
    
    return k > 0 ? relevantFeedback.length / k : 0
  }

  // 计算召回率
  private calculateRecall(feedback: UserFeedback[], k: number): number {
    const totalRelevant = feedback
      .filter(f => ['favorite', 'purchase'].includes(f.feedbackType)).length
    
    const retrievedRelevant = feedback
      .filter(f => ['favorite', 'purchase'].includes(f.feedbackType))
      .slice(0, k).length
    
    return totalRelevant > 0 ? retrievedRelevant / totalRelevant : 0
  }

  // 获取用户测试组
  private getUserTestGroup(userId: string): string {
    const hash = this.hashString(userId)
    
    for (const [name, test] of this.abTests) {
      if (test.isActive && hash % 100 < test.trafficAllocation * 100) {
        return name
      }
    }
    
    return 'control'
  }

  // 简单哈希函数
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash)
  }

  // 导出训练数据
  exportTrainingData(): TrainingDataPoint[] {
    return [...this.trainingData]
  }

  // 导出当前配置
  exportCurrentConfig(): RecommendationConfig {
    return { ...this.currentConfig }
  }

  // 导入训练数据
  importTrainingData(data: TrainingDataPoint[]): void {
    this.trainingData = [...data]
  }

  // 重置权重
  resetWeights(config?: RecommendationConfig): void {
    if (config) {
      this.currentConfig = { ...config }
    } else {
      // 重置为默认权重
      this.currentConfig.weights = {
        priceMatch: 0.25,
        styleMatch: 0.20,
        roomSuitability: 0.18,
        userRating: 0.15,
        popularityBoost: 0.08,
        brandPreference: 0.06,
        featureMatch: 0.05,
        seasonality: 0.03
      }
    }
  }

  // 获取训练统计信息
  getTrainingStats(): {
    totalFeedback: number
    trainingDataPoints: number
    activeTests: number
    lastUpdate: Date | null
  } {
    return {
      totalFeedback: this.feedbackHistory.length,
      trainingDataPoints: this.trainingData.length,
      activeTests: Array.from(this.abTests.values()).filter(t => t.isActive).length,
      lastUpdate: this.feedbackHistory.length > 0 
        ? this.feedbackHistory[this.feedbackHistory.length - 1].timestamp 
        : null
    }
  }
}

// 预定义的A/B测试配置
export const PREDEFINED_AB_TESTS: ABTestConfig[] = [
  {
    name: 'price_focused',
    description: '增加价格权重，针对价格敏感用户',
    config: {
      weights: {
        priceMatch: 0.35,
        styleMatch: 0.15,
        roomSuitability: 0.15,
        userRating: 0.15,
        popularityBoost: 0.08,
        brandPreference: 0.07,
        featureMatch: 0.03,
        seasonality: 0.02
      },
      maxResults: 20,
      diversityFactor: 0.2,
      freshnessFactor: 0.1,
      personalizationStrength: 0.7
    },
    targetMetric: 'conversion',
    isActive: false,
    trafficAllocation: 0.2
  },
  {
    name: 'style_focused',
    description: '增加风格权重，针对设计导向用户',
    config: {
      weights: {
        priceMatch: 0.15,
        styleMatch: 0.35,
        roomSuitability: 0.20,
        userRating: 0.12,
        popularityBoost: 0.08,
        brandPreference: 0.05,
        featureMatch: 0.03,
        seasonality: 0.02
      },
      maxResults: 20,
      diversityFactor: 0.4,
      freshnessFactor: 0.2,
      personalizationStrength: 0.8
    },
    targetMetric: 'engagement',
    isActive: false,
    trafficAllocation: 0.2
  }
]

export default RecommendationTrainer