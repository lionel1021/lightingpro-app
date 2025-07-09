/**
 * 🎯 用户画像聚类系统 - SuperClaude + MCP 协作生成
 * 
 * 功能:
 * - K-means聚类算法
 * - 用户行为模式分析
 * - 动态用户分群
 * - 个性化策略匹配
 * - 实时聚类更新
 */

import { QuestionnaireData, UserBehaviorEvent } from './types'
import { createSupabaseClient } from './supabase-server'

// ================================
// 用户聚类接口定义
// ================================

export interface UserCluster {
  id: string
  name: string
  description: string
  characteristics: ClusterCharacteristics
  members: UserClusterMember[]
  centroid: number[]
  size: number
  lastUpdated: Date
}

export interface ClusterCharacteristics {
  // 人口统计学特征
  demographics: {
    avg_age?: number
    income_level: 'low' | 'medium' | 'high'
    primary_location: string
    lifestyle: string[]
  }
  
  // 行为特征
  behavior: {
    avg_session_duration: number
    purchase_frequency: 'low' | 'medium' | 'high'
    price_sensitivity: 'low' | 'medium' | 'high'
    brand_loyalty: 'low' | 'medium' | 'high'
    feature_preference: string[]
  }
  
  // 偏好特征
  preferences: {
    preferred_styles: string[]
    preferred_room_types: string[]
    budget_range: [number, number]
    smart_home_adoption: 'early' | 'mainstream' | 'laggard'
  }
  
  // 购买模式
  purchasing: {
    decision_speed: 'fast' | 'medium' | 'slow'
    research_intensity: 'low' | 'medium' | 'high'
    social_influence: 'low' | 'medium' | 'high'
    seasonal_patterns: string[]
  }
}

export interface UserClusterMember {
  userId: string
  clusterProbability: number
  distance: number
  joinedAt: Date
  features: UserFeatureVector
}

export interface UserFeatureVector {
  // 数值特征 (用于聚类计算)
  numerical: number[]
  
  // 分类特征
  categorical: {
    preferred_style: string
    primary_room_type: string
    income_bracket: string
    age_group: string
    device_preference: string
  }
  
  // 行为特征
  behavioral: {
    session_frequency: number
    avg_session_duration: number
    conversion_rate: number
    return_rate: number
    referral_rate: number
  }
}

export interface ClusteringResult {
  clusters: UserCluster[]
  metrics: ClusteringMetrics
  recommendations: ClusterRecommendation[]
}

export interface ClusteringMetrics {
  silhouetteScore: number
  withinClusterSumSquares: number
  betweenClusterSumSquares: number
  totalSumSquares: number
  optimal_k: number
  convergence_iterations: number
}

export interface ClusterRecommendation {
  clusterId: string
  strategy: 'personalized' | 'popular' | 'budget' | 'premium' | 'exploratory'
  weight: number
  explanation: string
}

// ================================
// K-means聚类算法实现
// ================================

export class KMeansClusteringEngine {
  private clusters: UserCluster[] = []
  private supabase = createSupabaseClient()
  
  async performClustering(
    users: UserFeatureVector[],
    k: number = 5,
    maxIterations: number = 100,
    tolerance: number = 1e-4
  ): Promise<ClusteringResult> {
    
    console.log(`🎯 开始用户聚类分析，用户数: ${users.length}, 聚类数: ${k}`)
    
    // 提取数值特征进行聚类
    const dataMatrix = users.map(user => user.numerical)
    
    // 初始化聚类中心
    let centroids = this.initializeCentroids(dataMatrix, k)
    let assignments = new Array(users.length).fill(0)
    let hasConverged = false
    let iteration = 0
    
    // 迭代优化
    while (!hasConverged && iteration < maxIterations) {
      // 分配每个用户到最近的聚类中心
      const newAssignments = this.assignToClusters(dataMatrix, centroids)
      
      // 更新聚类中心
      const newCentroids = this.updateCentroids(dataMatrix, newAssignments, k)
      
      // 检查收敛
      hasConverged = this.checkConvergence(centroids, newCentroids, tolerance)
      
      centroids = newCentroids
      assignments = newAssignments
      iteration++
    }
    
    console.log(`✅ 聚类完成，迭代次数: ${iteration}`)
    
    // 构建聚类结果
    const clusters = this.buildClusters(users, assignments, centroids, k)
    const metrics = this.calculateMetrics(dataMatrix, assignments, centroids)
    const recommendations = this.generateClusterRecommendations(clusters)
    
    this.clusters = clusters
    
    return {
      clusters,
      metrics,
      recommendations
    }
  }

  // 自动确定最优聚类数
  async findOptimalK(
    users: UserFeatureVector[],
    maxK: number = 10
  ): Promise<number> {
    
    const dataMatrix = users.map(user => user.numerical)
    const scores: number[] = []
    
    for (let k = 2; k <= maxK; k++) {
      const result = await this.performClustering(users, k)
      scores.push(result.metrics.silhouetteScore)
    }
    
    // 找到轮廓系数最高的k值
    const optimalK = scores.indexOf(Math.max(...scores)) + 2
    console.log(`🎯 最优聚类数: ${optimalK}`)
    
    return optimalK
  }

  private initializeCentroids(data: number[][], k: number): number[][] {
    const centroids: number[][] = []
    const features = data[0].length
    
    // 使用K-means++初始化
    const firstIndex = Math.floor(Math.random() * data.length)
    centroids.push([...data[firstIndex]])
    
    for (let i = 1; i < k; i++) {
      const distances = data.map(point => {
        const minDistance = Math.min(...centroids.map(centroid => 
          this.euclideanDistance(point, centroid)
        ))
        return minDistance * minDistance
      })
      
      const totalDistance = distances.reduce((sum, d) => sum + d, 0)
      let cumulative = 0
      const random = Math.random() * totalDistance
      
      for (let j = 0; j < distances.length; j++) {
        cumulative += distances[j]
        if (cumulative >= random) {
          centroids.push([...data[j]])
          break
        }
      }
    }
    
    return centroids
  }

  private assignToClusters(data: number[][], centroids: number[][]): number[] {
    return data.map(point => {
      let minDistance = Infinity
      let clusterIndex = 0
      
      centroids.forEach((centroid, index) => {
        const distance = this.euclideanDistance(point, centroid)
        if (distance < minDistance) {
          minDistance = distance
          clusterIndex = index
        }
      })
      
      return clusterIndex
    })
  }

  private updateCentroids(
    data: number[][],
    assignments: number[],
    k: number
  ): number[][] {
    const newCentroids: number[][] = []
    const features = data[0].length
    
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, index) => assignments[index] === i)
      
      if (clusterPoints.length === 0) {
        // 如果聚类为空，随机重新初始化
        const randomIndex = Math.floor(Math.random() * data.length)
        newCentroids.push([...data[randomIndex]])
      } else {
        const centroid = new Array(features).fill(0)
        
        clusterPoints.forEach(point => {
          point.forEach((value, featureIndex) => {
            centroid[featureIndex] += value
          })
        })
        
        centroid.forEach((sum, index) => {
          centroid[index] = sum / clusterPoints.length
        })
        
        newCentroids.push(centroid)
      }
    }
    
    return newCentroids
  }

  private checkConvergence(
    oldCentroids: number[][],
    newCentroids: number[][],
    tolerance: number
  ): boolean {
    for (let i = 0; i < oldCentroids.length; i++) {
      const distance = this.euclideanDistance(oldCentroids[i], newCentroids[i])
      if (distance > tolerance) {
        return false
      }
    }
    return true
  }

  private euclideanDistance(point1: number[], point2: number[]): number {
    const sumSquares = point1.reduce((sum, value, index) => {
      const diff = value - point2[index]
      return sum + diff * diff
    }, 0)
    
    return Math.sqrt(sumSquares)
  }

  private buildClusters(
    users: UserFeatureVector[],
    assignments: number[],
    centroids: number[][],
    k: number
  ): UserCluster[] {
    const clusters: UserCluster[] = []
    
    for (let i = 0; i < k; i++) {
      const members: UserClusterMember[] = []
      
      users.forEach((user, index) => {
        if (assignments[index] === i) {
          const distance = this.euclideanDistance(user.numerical, centroids[i])
          members.push({
            userId: `user_${index}`, // 实际应该是真实的用户ID
            clusterProbability: 1.0, // 硬聚类，概率为1
            distance,
            joinedAt: new Date(),
            features: user
          })
        }
      })
      
      const characteristics = this.analyzeClusterCharacteristics(members)
      
      clusters.push({
        id: `cluster_${i}`,
        name: this.generateClusterName(characteristics),
        description: this.generateClusterDescription(characteristics),
        characteristics,
        members,
        centroid: centroids[i],
        size: members.length,
        lastUpdated: new Date()
      })
    }
    
    return clusters
  }

  private analyzeClusterCharacteristics(members: UserClusterMember[]): ClusterCharacteristics {
    if (members.length === 0) {
      return this.getDefaultCharacteristics()
    }

    // 分析行为特征
    const avgSessionDuration = members.reduce((sum, m) => 
      sum + m.features.behavioral.session_frequency, 0) / members.length
    
    const avgConversionRate = members.reduce((sum, m) => 
      sum + m.features.behavioral.conversion_rate, 0) / members.length

    // 分析偏好特征
    const stylePreferences = new Map<string, number>()
    const roomPreferences = new Map<string, number>()
    
    members.forEach(member => {
      const style = member.features.categorical.preferred_style
      const room = member.features.categorical.primary_room_type
      
      stylePreferences.set(style, (stylePreferences.get(style) || 0) + 1)
      roomPreferences.set(room, (roomPreferences.get(room) || 0) + 1)
    })

    const topStyles = Array.from(stylePreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style]) => style)

    const topRooms = Array.from(roomPreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([room]) => room)

    return {
      demographics: {
        income_level: this.determineIncomeLevel(members),
        primary_location: 'unknown',
        lifestyle: []
      },
      behavior: {
        avg_session_duration: avgSessionDuration,
        purchase_frequency: this.categorizePurchaseFrequency(avgConversionRate),
        price_sensitivity: this.determinePriceSensitivity(members),
        brand_loyalty: 'medium',
        feature_preference: []
      },
      preferences: {
        preferred_styles: topStyles,
        preferred_room_types: topRooms,
        budget_range: this.calculateBudgetRange(members),
        smart_home_adoption: 'mainstream'
      },
      purchasing: {
        decision_speed: 'medium',
        research_intensity: 'medium',
        social_influence: 'medium',
        seasonal_patterns: []
      }
    }
  }

  private generateClusterName(characteristics: ClusterCharacteristics): string {
    const style = characteristics.preferences.preferred_styles[0] || '通用'
    const behavior = characteristics.behavior.purchase_frequency
    
    const nameMap = {
      'modern': '现代风格爱好者',
      'traditional': '传统风格偏好者',
      'minimalist': '极简主义者',
      'industrial': '工业风追随者',
      'scandinavian': '北欧风格用户'
    }
    
    const behaviorSuffix = {
      'high': '(高频购买)',
      'medium': '(中等活跃)',
      'low': '(价格敏感)'
    }
    
    return (nameMap[style as keyof typeof nameMap] || '通用用户') + 
           (behaviorSuffix[behavior] || '')
  }

  private generateClusterDescription(characteristics: ClusterCharacteristics): string {
    const { preferences, behavior } = characteristics
    
    return `该用户群体主要偏好${preferences.preferred_styles.join('、')}风格的照明产品，` +
           `经常为${preferences.preferred_room_types.join('、')}选购照明设备。` +
           `购买频率${behavior.purchase_frequency}，价格敏感度${behavior.price_sensitivity}。`
  }

  private determineIncomeLevel(members: UserClusterMember[]): 'low' | 'medium' | 'high' {
    const incomes = members.map(m => m.features.categorical.income_bracket)
    const highIncomeCount = incomes.filter(i => i === 'high').length
    const mediumIncomeCount = incomes.filter(i => i === 'medium').length
    
    if (highIncomeCount / members.length > 0.5) return 'high'
    if (mediumIncomeCount / members.length > 0.4) return 'medium'
    return 'low'
  }

  private categorizePurchaseFrequency(conversionRate: number): 'low' | 'medium' | 'high' {
    if (conversionRate > 0.1) return 'high'
    if (conversionRate > 0.05) return 'medium'
    return 'low'
  }

  private determinePriceSensitivity(members: UserClusterMember[]): 'low' | 'medium' | 'high' {
    // 基于用户行为模式判断价格敏感度
    const avgReturnRate = members.reduce((sum, m) => 
      sum + m.features.behavioral.return_rate, 0) / members.length
    
    if (avgReturnRate > 0.15) return 'high'
    if (avgReturnRate > 0.08) return 'medium'
    return 'low'
  }

  private calculateBudgetRange(members: UserClusterMember[]): [number, number] {
    // 根据用户收入水平估算预算范围
    const incomes = members.map(m => m.features.categorical.income_bracket)
    const highIncomeRatio = incomes.filter(i => i === 'high').length / members.length
    
    if (highIncomeRatio > 0.6) return [500, 3000]
    if (highIncomeRatio > 0.3) return [200, 1500]
    return [50, 800]
  }

  private getDefaultCharacteristics(): ClusterCharacteristics {
    return {
      demographics: {
        income_level: 'medium',
        primary_location: 'unknown',
        lifestyle: []
      },
      behavior: {
        avg_session_duration: 300,
        purchase_frequency: 'medium',
        price_sensitivity: 'medium',
        brand_loyalty: 'medium',
        feature_preference: []
      },
      preferences: {
        preferred_styles: ['modern'],
        preferred_room_types: ['living_room'],
        budget_range: [100, 1000],
        smart_home_adoption: 'mainstream'
      },
      purchasing: {
        decision_speed: 'medium',
        research_intensity: 'medium',
        social_influence: 'medium',
        seasonal_patterns: []
      }
    }
  }

  private calculateMetrics(
    data: number[][],
    assignments: number[],
    centroids: number[][]
  ): ClusteringMetrics {
    
    // 计算轮廓系数
    const silhouetteScore = this.calculateSilhouetteScore(data, assignments, centroids)
    
    // 计算簇内平方和
    const withinClusterSumSquares = this.calculateWithinClusterSS(data, assignments, centroids)
    
    // 计算簇间平方和
    const totalMean = this.calculateMean(data)
    const betweenClusterSumSquares = this.calculateBetweenClusterSS(centroids, totalMean, assignments)
    
    const totalSumSquares = withinClusterSumSquares + betweenClusterSumSquares
    
    return {
      silhouetteScore,
      withinClusterSumSquares,
      betweenClusterSumSquares,
      totalSumSquares,
      optimal_k: centroids.length,
      convergence_iterations: 0 // 这里应该传入实际的迭代次数
    }
  }

  private calculateSilhouetteScore(
    data: number[][],
    assignments: number[],
    centroids: number[][]
  ): number {
    let totalScore = 0
    
    data.forEach((point, i) => {
      const clusterIndex = assignments[i]
      
      // 计算簇内平均距离
      const sameClusterPoints = data.filter((_, j) => assignments[j] === clusterIndex && i !== j)
      const a = sameClusterPoints.length > 0 
        ? sameClusterPoints.reduce((sum, p) => sum + this.euclideanDistance(point, p), 0) / sameClusterPoints.length
        : 0
      
      // 计算最近邻簇的平均距离
      let minB = Infinity
      centroids.forEach((centroid, clusterIdx) => {
        if (clusterIdx !== clusterIndex) {
          const otherClusterPoints = data.filter((_, j) => assignments[j] === clusterIdx)
          if (otherClusterPoints.length > 0) {
            const b = otherClusterPoints.reduce((sum, p) => sum + this.euclideanDistance(point, p), 0) / otherClusterPoints.length
            minB = Math.min(minB, b)
          }
        }
      })
      
      const silhouette = minB === Infinity ? 0 : (minB - a) / Math.max(a, minB)
      totalScore += silhouette
    })
    
    return totalScore / data.length
  }

  private calculateWithinClusterSS(
    data: number[][],
    assignments: number[],
    centroids: number[][]
  ): number {
    let totalSS = 0
    
    data.forEach((point, i) => {
      const clusterIndex = assignments[i]
      const distance = this.euclideanDistance(point, centroids[clusterIndex])
      totalSS += distance * distance
    })
    
    return totalSS
  }

  private calculateBetweenClusterSS(
    centroids: number[][],
    totalMean: number[],
    assignments: number[]
  ): number {
    let totalSS = 0
    
    centroids.forEach((centroid, i) => {
      const clusterSize = assignments.filter(a => a === i).length
      const distance = this.euclideanDistance(centroid, totalMean)
      totalSS += clusterSize * distance * distance
    })
    
    return totalSS
  }

  private calculateMean(data: number[][]): number[] {
    const features = data[0].length
    const mean = new Array(features).fill(0)
    
    data.forEach(point => {
      point.forEach((value, index) => {
        mean[index] += value
      })
    })
    
    return mean.map(sum => sum / data.length)
  }

  private generateClusterRecommendations(clusters: UserCluster[]): ClusterRecommendation[] {
    return clusters.map(cluster => {
      const { behavior, preferences } = cluster.characteristics
      
      let strategy: ClusterRecommendation['strategy'] = 'personalized'
      let weight = 1.0
      let explanation = ''
      
      // 根据聚类特征确定推荐策略
      if (behavior.price_sensitivity === 'high') {
        strategy = 'budget'
        weight = 0.8
        explanation = '该用户群体价格敏感，建议重点推荐性价比高的产品'
      } else if (behavior.purchase_frequency === 'high') {
        strategy = 'premium'
        weight = 1.2
        explanation = '该用户群体购买力强，可推荐高端产品'
      } else if (preferences.preferred_styles.length > 2) {
        strategy = 'exploratory'
        weight = 0.9
        explanation = '该用户群体偏好多样，建议提供多元化推荐'
      }
      
      return {
        clusterId: cluster.id,
        strategy,
        weight,
        explanation
      }
    })
  }

  // 预测用户所属聚类
  async predictUserCluster(userFeatures: UserFeatureVector): Promise<{
    clusterId: string
    probability: number
    distance: number
  }> {
    if (this.clusters.length === 0) {
      throw new Error('聚类模型尚未训练')
    }
    
    let minDistance = Infinity
    let bestCluster = this.clusters[0]
    
    this.clusters.forEach(cluster => {
      const distance = this.euclideanDistance(userFeatures.numerical, cluster.centroid)
      if (distance < minDistance) {
        minDistance = distance
        bestCluster = cluster
      }
    })
    
    // 计算概率 (基于距离的softmax)
    const distances = this.clusters.map(cluster => 
      this.euclideanDistance(userFeatures.numerical, cluster.centroid)
    )
    
    const expDistances = distances.map(d => Math.exp(-d))
    const sumExp = expDistances.reduce((sum, exp) => sum + exp, 0)
    const probability = Math.exp(-minDistance) / sumExp
    
    return {
      clusterId: bestCluster.id,
      probability,
      distance: minDistance
    }
  }

  // 获取聚类统计信息
  getClusterStats() {
    return this.clusters.map(cluster => ({
      id: cluster.id,
      name: cluster.name,
      size: cluster.size,
      characteristics: cluster.characteristics,
      avgDistance: cluster.members.reduce((sum, m) => sum + m.distance, 0) / cluster.members.length
    }))
  }
}

// ================================
// 用户聚类管理器
// ================================

export class UserClusteringManager {
  private engine = new KMeansClusteringEngine()
  private supabase = createSupabaseClient()
  private lastUpdate = new Date(0)
  private updateInterval = 24 * 60 * 60 * 1000 // 24小时

  async initializeClustering(): Promise<void> {
    console.log('🎯 初始化用户聚类系统...')
    
    const users = await this.loadUserFeatures()
    
    if (users.length < 10) {
      console.log('⚠️ 用户数据不足，使用默认聚类')
      return
    }
    
    // 自动确定最优聚类数
    const optimalK = await this.engine.findOptimalK(users)
    
    // 执行聚类
    const result = await this.engine.performClustering(users, optimalK)
    
    // 保存聚类结果
    await this.saveClusteringResult(result)
    
    this.lastUpdate = new Date()
    
    console.log(`✅ 用户聚类完成，发现 ${result.clusters.length} 个用户群体`)
  }

  async getUserCluster(userId: string): Promise<{
    clusterId: string
    clusterName: string
    probability: number
    recommendations: string[]
  } | null> {
    
    const userFeatures = await this.extractUserFeatures(userId)
    if (!userFeatures) return null
    
    const prediction = await this.engine.predictUserCluster(userFeatures)
    const cluster = this.engine.getClusterStats().find(c => c.id === prediction.clusterId)
    
    if (!cluster) return null
    
    return {
      clusterId: prediction.clusterId,
      clusterName: cluster.name,
      probability: prediction.probability,
      recommendations: this.generatePersonalizedRecommendations(cluster.characteristics)
    }
  }

  async shouldUpdateClusters(): Promise<boolean> {
    return Date.now() - this.lastUpdate.getTime() > this.updateInterval
  }

  private async loadUserFeatures(): Promise<UserFeatureVector[]> {
    // 从数据库加载用户特征数据
    const { data: userProfiles } = await this.supabase
      .from('user_profiles')
      .select(`
        user_id,
        preferences,
        user_interactions(*),
        questionnaire_responses(*)
      `)
      .not('user_interactions', 'is', null)
      .limit(1000)

    if (!userProfiles) return []

    return userProfiles.map(profile => this.buildFeatureVector(profile))
  }

  private buildFeatureVector(profileData: any): UserFeatureVector {
    const interactions = profileData.user_interactions || []
    const questionnaires = profileData.questionnaire_responses || []
    const preferences = profileData.preferences || {}

    // 计算行为特征
    const sessionFrequency = this.calculateSessionFrequency(interactions)
    const avgSessionDuration = this.calculateAvgSessionDuration(interactions)
    const conversionRate = this.calculateConversionRate(interactions)
    const returnRate = this.calculateReturnRate(interactions)

    // 构建数值特征向量 (用于聚类)
    const numerical = [
      sessionFrequency,
      avgSessionDuration / 1000, // 归一化到秒
      conversionRate * 100,
      returnRate * 100,
      questionnaires.length,
      Object.keys(preferences).length
    ]

    // 分类特征
    const latestQuestionnaire = questionnaires[0] || {}
    
    return {
      numerical,
      categorical: {
        preferred_style: latestQuestionnaire.style_preference || 'modern',
        primary_room_type: latestQuestionnaire.room_type || 'living_room',
        income_bracket: this.inferIncomeFromBudget(latestQuestionnaire.budget_max || 1000),
        age_group: 'unknown',
        device_preference: this.inferDevicePreference(interactions)
      },
      behavioral: {
        session_frequency: sessionFrequency,
        avg_session_duration: avgSessionDuration,
        conversion_rate: conversionRate,
        return_rate: returnRate,
        referral_rate: 0 // 需要额外计算
      }
    }
  }

  private async extractUserFeatures(userId: string): Promise<UserFeatureVector | null> {
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select(`
        preferences,
        user_interactions(*),
        questionnaire_responses(*)
      `)
      .eq('user_id', userId)
      .single()

    if (!profile) return null

    return this.buildFeatureVector(profile)
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
    
    return sessionDurations.size > 0 ? totalDuration / sessionDurations.size : 0
  }

  private calculateConversionRate(interactions: any[]): number {
    const totalInteractions = interactions.length
    const conversions = interactions.filter(i => i.interaction_type === 'purchase').length
    
    return totalInteractions > 0 ? conversions / totalInteractions : 0
  }

  private calculateReturnRate(interactions: any[]): number {
    // 简化计算：假设有退货标记
    const purchases = interactions.filter(i => i.interaction_type === 'purchase')
    const returns = interactions.filter(i => i.interaction_type === 'return')
    
    return purchases.length > 0 ? returns.length / purchases.length : 0
  }

  private inferIncomeFromBudget(maxBudget: number): string {
    if (maxBudget > 2000) return 'high'
    if (maxBudget > 500) return 'medium'
    return 'low'
  }

  private inferDevicePreference(interactions: any[]): string {
    const deviceCounts = new Map<string, number>()
    
    interactions.forEach(interaction => {
      const userAgent = interaction.user_agent || ''
      let device = 'desktop'
      
      if (userAgent.includes('Mobile')) device = 'mobile'
      else if (userAgent.includes('Tablet')) device = 'tablet'
      
      deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1)
    })
    
    let maxDevice = 'desktop'
    let maxCount = 0
    
    deviceCounts.forEach((count, device) => {
      if (count > maxCount) {
        maxCount = count
        maxDevice = device
      }
    })
    
    return maxDevice
  }

  private async saveClusteringResult(result: ClusteringResult): Promise<void> {
    // 保存聚类结果到数据库
    try {
      await this.supabase
        .from('user_clusters')
        .upsert(result.clusters.map(cluster => ({
          id: cluster.id,
          name: cluster.name,
          description: cluster.description,
          characteristics: cluster.characteristics,
          centroid: cluster.centroid,
          size: cluster.size,
          last_updated: cluster.lastUpdated.toISOString()
        })))
    } catch (error) {
      console.error('保存聚类结果失败:', error)
    }
  }

  private generatePersonalizedRecommendations(characteristics: ClusterCharacteristics): string[] {
    const recommendations: string[] = []
    
    if (characteristics.behavior.price_sensitivity === 'high') {
      recommendations.push('重点展示价格优势和性价比')
      recommendations.push('提供优惠券和促销信息')
    }
    
    if (characteristics.behavior.purchase_frequency === 'high') {
      recommendations.push('推荐高端和创新产品')
      recommendations.push('提供VIP服务和优先体验')
    }
    
    if (characteristics.preferences.smart_home_adoption === 'early') {
      recommendations.push('优先推荐智能照明产品')
      recommendations.push('强调技术创新和智能功能')
    }
    
    return recommendations
  }
}

// 导出单例实例
export const userClusteringManager = new UserClusteringManager()

// 便捷函数
export const initializeUserClustering = () => userClusteringManager.initializeClustering()

export const getUserClusterInfo = (userId: string) => userClusteringManager.getUserCluster(userId)

export default UserClusteringManager