/**
 * 🧪 A/B测试框架 - 数据驱动的优化决策
 * SuperClaude + MCP AI协作开发
 */

import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect, useCallback } from 'react'
import { redis } from './redis-cache'

// A/B测试实验配置
export interface ABExperiment {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  startDate: Date
  endDate?: Date
  
  // 变体配置
  variants: ABVariant[]
  trafficAllocation: number // 0-100，参与测试的用户百分比
  
  // 目标指标
  primaryMetric: string
  secondaryMetrics: string[]
  
  // 分层配置
  segmentation?: {
    userType?: 'new' | 'returning' | 'all'
    deviceType?: 'mobile' | 'desktop' | 'all'
    location?: string[]
  }
  
  // 统计配置
  statisticalPower: number // 0.8 = 80%
  minimumDetectableEffect: number // 最小可检测效应
  confidenceLevel: number // 0.95 = 95%
}

export interface ABVariant {
  id: string
  name: string
  description: string
  trafficWeight: number // 流量权重，variants总和应为100
  config: Record<string, any> // 变体配置参数
}

export interface ABAssignment {
  userId: string
  sessionId: string
  experimentId: string
  variantId: string
  assignedAt: Date
  isControlGroup: boolean
}

export interface ABMetric {
  experimentId: string
  variantId: string
  userId: string
  sessionId: string
  metricName: string
  value: number
  timestamp: Date
  metadata?: Record<string, any>
}

/**
 * 🎯 A/B测试引擎核心类
 */
export class ABTestingEngine {
  private experiments: Map<string, ABExperiment> = new Map()
  private assignments: Map<string, ABAssignment> = new Map()
  
  /**
   * 创建新实验
   */
  async createExperiment(experiment: Omit<ABExperiment, 'id'>): Promise<ABExperiment> {
    const newExperiment: ABExperiment = {
      ...experiment,
      id: uuidv4()
    }
    
    // 验证变体权重总和
    const totalWeight = experiment.variants.reduce((sum, variant) => sum + variant.trafficWeight, 0)
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error('变体流量权重总和必须等于100%')
    }
    
    this.experiments.set(newExperiment.id, newExperiment)
    
    // 持久化到Redis
    await redis.setex(
      `ab_experiment:${newExperiment.id}`, 
      86400 * 30, // 30天
      JSON.stringify(newExperiment)
    )
    
    return newExperiment
  }
  
  /**
   * 获取用户的实验分配
   */
  async assignUserToExperiment(
    experimentId: string, 
    userId: string, 
    sessionId: string,
    userContext?: Record<string, any>
  ): Promise<ABAssignment | null> {
    const experiment = await this.getExperiment(experimentId)
    if (!experiment || experiment.status !== 'running') {
      return null
    }
    
    // 检查是否已有分配
    const existingAssignment = await this.getUserAssignment(experimentId, userId)
    if (existingAssignment) {
      return existingAssignment
    }
    
    // 检查用户是否符合分层条件
    if (!this.isUserEligible(experiment, userContext)) {
      return null
    }
    
    // 检查用户是否在流量分配范围内
    const userHash = this.hashUserId(userId, experimentId)
    if (userHash > experiment.trafficAllocation / 100) {
      return null
    }
    
    // 分配变体
    const variant = this.selectVariant(experiment, userHash)
    
    const assignment: ABAssignment = {
      userId,
      sessionId,
      experimentId,
      variantId: variant.id,
      assignedAt: new Date(),
      isControlGroup: variant.id === experiment.variants[0].id // 第一个变体为对照组
    }
    
    // 保存分配
    await this.saveAssignment(assignment)
    
    return assignment
  }
  
  /**
   * 获取用户在特定实验中的变体配置
   */
  async getUserVariant(experimentId: string, userId: string): Promise<ABVariant | null> {
    const assignment = await this.getUserAssignment(experimentId, userId)
    if (!assignment) return null
    
    const experiment = await this.getExperiment(experimentId)
    if (!experiment) return null
    
    return experiment.variants.find(v => v.id === assignment.variantId) || null
  }
  
  /**
   * 记录转化指标
   */
  async trackMetric(
    experimentId: string,
    userId: string,
    sessionId: string,
    metricName: string,
    value: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    // 检查用户是否参与此实验
    const assignment = await this.getUserAssignment(experimentId, userId)
    if (!assignment) return
    
    const metric: ABMetric = {
      experimentId,
      variantId: assignment.variantId,
      userId,
      sessionId,
      metricName,
      value,
      timestamp: new Date(),
      metadata
    }
    
    // 保存指标到Redis
    const key = `ab_metric:${experimentId}:${assignment.variantId}:${metricName}`
    await redis.lpush(key, JSON.stringify(metric))
    await redis.expire(key, 86400 * 90) // 90天过期
    
    // 实时指标聚合
    await this.updateRealtimeMetrics(metric)
  }
  
  /**
   * 获取实验结果分析
   */
  async getExperimentResults(experimentId: string): Promise<{
    experiment: ABExperiment
    results: Array<{
      variant: ABVariant
      metrics: Record<string, {
        count: number
        sum: number
        mean: number
        standardDeviation: number
        confidenceInterval: [number, number]
      }>
      sampleSize: number
      conversionRate?: number
    }>
    statisticalSignificance: Record<string, boolean>
    recommendation: 'continue' | 'stop_winner' | 'stop_inconclusive'
  }> {
    const experiment = await this.getExperiment(experimentId)
    if (!experiment) {
      throw new Error('实验不存在')
    }
    
    const results = []
    const allMetrics = [experiment.primaryMetric, ...experiment.secondaryMetrics]
    
    // 为每个变体计算指标
    for (const variant of experiment.variants) {
      const variantMetrics: Record<string, any> = {}
      
      for (const metricName of allMetrics) {
        const metrics = await this.getVariantMetrics(experimentId, variant.id, metricName)
        variantMetrics[metricName] = this.calculateMetricStats(metrics)
      }
      
      const sampleSize = await this.getVariantSampleSize(experimentId, variant.id)
      
      results.push({
        variant,
        metrics: variantMetrics,
        sampleSize,
        conversionRate: variantMetrics[experiment.primaryMetric]?.mean
      })
    }
    
    // 统计显著性检验
    const statisticalSignificance = await this.calculateStatisticalSignificance(
      experiment, 
      results
    )
    
    // 生成推荐
    const recommendation = this.generateRecommendation(experiment, results, statisticalSignificance)
    
    return {
      experiment,
      results,
      statisticalSignificance,
      recommendation
    }
  }
  
  /**
   * 私有方法：获取实验
   */
  private async getExperiment(experimentId: string): Promise<ABExperiment | null> {
    // 先从内存缓存获取
    if (this.experiments.has(experimentId)) {
      return this.experiments.get(experimentId)!
    }
    
    // 从Redis获取
    const cached = await redis.get(`ab_experiment:${experimentId}`)
    if (cached) {
      const experiment = JSON.parse(cached as string)
      this.experiments.set(experimentId, experiment)
      return experiment
    }
    
    return null
  }
  
  /**
   * 私有方法：检查用户资格
   */
  private isUserEligible(experiment: ABExperiment, userContext?: Record<string, any>): boolean {
    if (!experiment.segmentation || !userContext) return true
    
    const { segmentation } = experiment
    
    // 检查用户类型
    if (segmentation.userType && segmentation.userType !== 'all') {
      if (userContext.userType !== segmentation.userType) return false
    }
    
    // 检查设备类型
    if (segmentation.deviceType && segmentation.deviceType !== 'all') {
      if (userContext.deviceType !== segmentation.deviceType) return false
    }
    
    // 检查地理位置
    if (segmentation.location && segmentation.location.length > 0) {
      if (!segmentation.location.includes(userContext.location)) return false
    }
    
    return true
  }
  
  /**
   * 私有方法：用户ID哈希
   */
  private hashUserId(userId: string, salt: string): number {
    let hash = 0
    const str = userId + salt
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash) / 2147483647 // 归一化到[0,1]
  }
  
  /**
   * 私有方法：选择变体
   */
  private selectVariant(experiment: ABExperiment, userHash: number): ABVariant {
    let cumulativeWeight = 0
    const normalizedHash = userHash * experiment.trafficAllocation / 100
    
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.trafficWeight / 100
      if (normalizedHash <= cumulativeWeight) {
        return variant
      }
    }
    
    // 兜底返回第一个变体
    return experiment.variants[0]
  }
  
  /**
   * 私有方法：保存用户分配
   */
  private async saveAssignment(assignment: ABAssignment): Promise<void> {
    const key = `ab_assignment:${assignment.experimentId}:${assignment.userId}`
    await redis.setex(key, 86400 * 30, JSON.stringify(assignment))
    
    // 内存缓存
    this.assignments.set(`${assignment.experimentId}:${assignment.userId}`, assignment)
  }
  
  /**
   * 私有方法：获取用户分配
   */
  private async getUserAssignment(experimentId: string, userId: string): Promise<ABAssignment | null> {
    const cacheKey = `${experimentId}:${userId}`
    
    // 内存缓存
    if (this.assignments.has(cacheKey)) {
      return this.assignments.get(cacheKey)!
    }
    
    // Redis缓存
    const key = `ab_assignment:${experimentId}:${userId}`
    const cached = await redis.get(key)
    if (cached) {
      const assignment = JSON.parse(cached as string)
      this.assignments.set(cacheKey, assignment)
      return assignment
    }
    
    return null
  }
  
  /**
   * 私有方法：获取变体指标数据
   */
  private async getVariantMetrics(
    experimentId: string, 
    variantId: string, 
    metricName: string
  ): Promise<ABMetric[]> {
    const key = `ab_metric:${experimentId}:${variantId}:${metricName}`
    const rawMetrics = await redis.lrange(key, 0, -1)
    return rawMetrics.map(raw => JSON.parse(raw))
  }
  
  /**
   * 私有方法：计算指标统计信息
   */
  private calculateMetricStats(metrics: ABMetric[]) {
    if (metrics.length === 0) {
      return { count: 0, sum: 0, mean: 0, standardDeviation: 0, confidenceInterval: [0, 0] }
    }
    
    const values = metrics.map(m => m.value)
    const count = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = sum / count
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
    const standardDeviation = Math.sqrt(variance)
    
    // 95%置信区间
    const marginOfError = 1.96 * (standardDeviation / Math.sqrt(count))
    const confidenceInterval: [number, number] = [mean - marginOfError, mean + marginOfError]
    
    return {
      count,
      sum,
      mean,
      standardDeviation,
      confidenceInterval
    }
  }
  
  /**
   * 私有方法：更新实时指标
   */
  private async updateRealtimeMetrics(metric: ABMetric): Promise<void> {
    const key = `ab_realtime:${metric.experimentId}:${metric.variantId}:${metric.metricName}`
    
    // 更新计数和总和
    await redis.incrbyfloat(`${key}:sum`, metric.value)
    await redis.incr(`${key}:count`)
    await redis.expire(`${key}:sum`, 86400)
    await redis.expire(`${key}:count`, 86400)
  }
  
  /**
   * 私有方法：获取变体样本大小
   */
  private async getVariantSampleSize(experimentId: string, variantId: string): Promise<number> {
    const pattern = `ab_assignment:${experimentId}:*`
    const keys = await redis.keys(pattern)
    
    let count = 0
    for (const key of keys) {
      const assignment = await redis.get(key)
      if (assignment) {
        const parsed = JSON.parse(assignment as string)
        if (parsed.variantId === variantId) {
          count++
        }
      }
    }
    
    return count
  }
  
  /**
   * 私有方法：计算统计显著性
   */
  private async calculateStatisticalSignificance(
    experiment: ABExperiment,
    results: any[]
  ): Promise<Record<string, boolean>> {
    const significance: Record<string, boolean> = {}
    
    if (results.length < 2) return significance
    
    const controlGroup = results.find(r => r.variant.id === experiment.variants[0].id)
    const testGroups = results.filter(r => r.variant.id !== experiment.variants[0].id)
    
    for (const testGroup of testGroups) {
      const metricName = experiment.primaryMetric
      const controlMetric = controlGroup.metrics[metricName]
      const testMetric = testGroup.metrics[metricName]
      
      // 简化的t检验（实际应用中应使用更严格的统计检验）
      if (controlMetric.count > 0 && testMetric.count > 0) {
        const pooledStd = Math.sqrt(
          ((controlMetric.count - 1) * Math.pow(controlMetric.standardDeviation, 2) +
           (testMetric.count - 1) * Math.pow(testMetric.standardDeviation, 2)) /
          (controlMetric.count + testMetric.count - 2)
        )
        
        const standardError = pooledStd * Math.sqrt(
          1 / controlMetric.count + 1 / testMetric.count
        )
        
        const tStat = Math.abs(controlMetric.mean - testMetric.mean) / standardError
        const criticalValue = 1.96 // 95%置信度
        
        significance[`${testGroup.variant.id}_vs_control`] = tStat > criticalValue
      }
    }
    
    return significance
  }
  
  /**
   * 私有方法：生成推荐
   */
  private generateRecommendation(
    experiment: ABExperiment,
    results: any[],
    significance: Record<string, boolean>
  ): 'continue' | 'stop_winner' | 'stop_inconclusive' {
    const hasSignificantResults = Object.values(significance).some(Boolean)
    
    if (!hasSignificantResults) {
      // 检查是否已运行足够长时间
      const runningDays = (Date.now() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24)
      return runningDays > 14 ? 'stop_inconclusive' : 'continue'
    }
    
    return 'stop_winner'
  }
}

// 单例模式
export const abTestingEngine = new ABTestingEngine()

/**
 * 🎯 React Hook for A/B Testing
 */
export function useABTest(experimentId: string, userId?: string, userContext?: Record<string, any>) {
  const [variant, setVariant] = useState<ABVariant | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    
    const loadVariant = async () => {
      try {
        const sessionId = generateSessionId()
        const assignment = await abTestingEngine.assignUserToExperiment(
          experimentId, 
          userId, 
          sessionId,
          userContext
        )
        
        if (assignment) {
          const userVariant = await abTestingEngine.getUserVariant(experimentId, userId)
          setVariant(userVariant)
        }
      } catch (error) {
        console.error('A/B测试分配失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadVariant()
  }, [experimentId, userId, userContext])
  
  const trackConversion = useCallback(async (metricName: string, value: number = 1, metadata?: Record<string, any>) => {
    if (!userId) return
    
    const sessionId = generateSessionId()
    await abTestingEngine.trackMetric(experimentId, userId, sessionId, metricName, value, metadata)
  }, [experimentId, userId])
  
  return {
    variant,
    loading,
    trackConversion,
    isInExperiment: variant !== null
  }
}

/**
 * 工具函数
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 需要安装: npm install uuid
// 在页面中需要添加: import { useState, useEffect, useCallback } from 'react'