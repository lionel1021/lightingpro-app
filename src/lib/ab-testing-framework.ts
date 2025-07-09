/**
 * 🧪 A/B测试框架 - SuperClaude + MCP 协作生成
 * 
 * 功能:
 * - 多变量实验设计
 * - 用户分组算法
 * - 实验效果统计
 * - 动态实验配置
 * - 实时结果监控
 */

import { createSupabaseClient } from './supabase-server'

// ================================
// A/B测试核心接口
// ================================

export interface ABExperiment {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  type: 'simple' | 'multivariate' | 'feature_flag'
  
  // 实验配置
  config: ExperimentConfig
  
  // 变体定义
  variants: ExperimentVariant[]
  
  // 目标指标
  metrics: ExperimentMetric[]
  
  // 分流配置
  allocation: TrafficAllocation
  
  // 实验时间
  schedule: ExperimentSchedule
  
  // 统计配置
  statistics: StatisticsConfig
  
  // 元数据
  created_at: Date
  updated_at: Date
  created_by: string
}

export interface ExperimentConfig {
  // 目标页面/功能
  target_pages: string[]
  target_features: string[]
  
  // 用户定向
  user_targeting: UserTargeting
  
  // 实验类型特定配置
  experiment_settings: Record<string, any>
  
  // 质量保证
  quality_assurance: {
    min_sample_size: number
    max_duration_days: number
    significance_level: number
    power: number
  }
}

export interface ExperimentVariant {
  id: string
  name: string
  description: string
  is_control: boolean
  
  // 变体配置
  config: VariantConfig
  
  // 分流权重
  traffic_weight: number
  
  // 预期效果
  expected_impact: {
    metric_id: string
    expected_change: number
    confidence: number
  }[]
}

export interface VariantConfig {
  // 功能开关
  feature_flags: Record<string, boolean>
  
  // UI变更
  ui_changes: {
    component_id: string
    changes: Record<string, any>
  }[]
  
  // 算法参数
  algorithm_params: Record<string, any>
  
  // 推荐策略
  recommendation_strategy?: 'personalized' | 'popular' | 'budget' | 'premium'
}

export interface ExperimentMetric {
  id: string
  name: string
  type: 'conversion' | 'engagement' | 'revenue' | 'retention' | 'custom'
  
  // 指标定义
  definition: MetricDefinition
  
  // 是否为主要指标
  is_primary: boolean
  
  // 预期方向
  expected_direction: 'increase' | 'decrease' | 'no_change'
  
  // 最小检测差异
  minimum_detectable_effect: number
}

export interface MetricDefinition {
  // 数据源
  data_source: 'user_interactions' | 'questionnaire_responses' | 'recommendations' | 'custom'
  
  // 计算逻辑
  calculation: {
    numerator: string // SQL查询或表达式
    denominator?: string
    filters?: Record<string, any>
    time_window?: string
  }
  
  // 聚合方式
  aggregation: 'sum' | 'avg' | 'count' | 'rate' | 'median'
}

export interface UserTargeting {
  // 用户属性过滤
  user_attributes: {
    new_users_only?: boolean
    returning_users_only?: boolean
    subscription_tiers?: string[]
    location_codes?: string[]
  }
  
  // 行为特征
  behavioral_criteria: {
    min_sessions?: number
    min_purchases?: number
    preferred_categories?: string[]
    last_active_days?: number
  }
  
  // 排除条件
  exclusions: {
    exclude_user_ids?: string[]
    exclude_sessions?: string[]
    exclude_if_in_experiments?: string[]
  }
}

export interface TrafficAllocation {
  // 总体分流比例
  total_traffic_percentage: number
  
  // 变体分配
  variant_allocation: {
    variant_id: string
    percentage: number
  }[]
  
  // 分流算法
  allocation_method: 'random' | 'deterministic' | 'stratified'
  
  // 粘性设置
  sticky_assignment: boolean
  sticky_duration_days?: number
}

export interface ExperimentSchedule {
  start_date: Date
  end_date?: Date
  max_duration_days?: number
  
  // 自动停止条件
  auto_stop_conditions: {
    significance_achieved?: boolean
    min_sample_size_reached?: boolean
    max_duration_exceeded?: boolean
    negative_impact_detected?: boolean
  }
}

export interface StatisticsConfig {
  significance_level: number // 0.05
  power: number // 0.8
  multiple_testing_correction: 'bonferroni' | 'benjamini_hochberg' | 'none'
  
  // 早停检查
  early_stopping: {
    enabled: boolean
    check_frequency_hours: number
    min_sample_size: number
  }
}

// ================================
// 用户分组管理
// ================================

export interface UserAssignment {
  user_id: string
  session_id: string
  experiment_id: string
  variant_id: string
  
  assigned_at: Date
  assignment_method: string
  assignment_hash: string
  
  // 用户特征快照
  user_snapshot: {
    is_new_user: boolean
    session_count: number
    device_type: string
    location: string
  }
}

export interface ExperimentResult {
  experiment_id: string
  variant_id: string
  metric_id: string
  
  // 统计数据
  sample_size: number
  conversion_rate: number
  confidence_interval: [number, number]
  p_value: number
  statistical_significance: boolean
  
  // 业务指标
  total_events: number
  unique_users: number
  revenue_impact?: number
  
  calculated_at: Date
}

// ================================
// A/B测试引擎
// ================================

export class ABTestingEngine {
  private supabase = createSupabaseClient()
  private experiments: Map<string, ABExperiment> = new Map()
  private userAssignments: Map<string, Map<string, UserAssignment>> = new Map()

  async initialize(): Promise<void> {
    console.log('🧪 初始化A/B测试引擎...')
    
    // 加载活跃实验
    await this.loadActiveExperiments()
    
    // 加载用户分组
    await this.loadUserAssignments()
    
    console.log(`✅ A/B测试引擎初始化完成，活跃实验: ${this.experiments.size}个`)
  }

  // 获取用户的实验变体
  async getUserVariant(
    userId: string,
    sessionId: string,
    experimentId: string,
    userContext?: {
      isNewUser?: boolean
      deviceType?: string
      location?: string
      userAttributes?: Record<string, any>
    }
  ): Promise<{
    variant_id: string
    variant_config: VariantConfig
    is_control: boolean
  } | null> {
    
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') {
      return null
    }

    // 检查用户是否符合定向条件
    if (!await this.isUserEligible(userId, experiment, userContext)) {
      return null
    }

    // 检查现有分组
    const existingAssignment = this.getUserAssignment(userId, experimentId)
    if (existingAssignment) {
      const variant = experiment.variants.find(v => v.id === existingAssignment.variant_id)
      if (variant) {
        return {
          variant_id: variant.id,
          variant_config: variant.config,
          is_control: variant.is_control
        }
      }
    }

    // 进行新的分组
    const assignment = await this.assignUserToVariant(
      userId,
      sessionId,
      experiment,
      userContext
    )

    if (assignment) {
      const variant = experiment.variants.find(v => v.id === assignment.variant_id)!
      return {
        variant_id: variant.id,
        variant_config: variant.config,
        is_control: variant.is_control
      }
    }

    return null
  }

  // 记录实验事件
  async trackExperimentEvent(
    userId: string,
    sessionId: string,
    experimentId: string,
    metricId: string,
    eventData: {
      value?: number
      properties?: Record<string, any>
      timestamp?: Date
    }
  ): Promise<void> {
    
    const assignment = this.getUserAssignment(userId, experimentId)
    if (!assignment) return

    // 记录事件
    await this.supabase
      .from('experiment_events')
      .insert({
        user_id: userId,
        session_id: sessionId,
        experiment_id: experimentId,
        variant_id: assignment.variant_id,
        metric_id: metricId,
        event_value: eventData.value || 1,
        event_properties: eventData.properties || {},
        created_at: (eventData.timestamp || new Date()).toISOString()
      })
  }

  // 获取实验结果
  async getExperimentResults(
    experimentId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    experiment: ABExperiment
    results: ExperimentResult[]
    statistical_summary: StatisticalSummary
  }> {
    
    const experiment = this.experiments.get(experimentId)
    if (!experiment) {
      throw new Error(`实验 ${experimentId} 不存在`)
    }

    // 计算各变体的指标结果
    const results: ExperimentResult[] = []
    
    for (const variant of experiment.variants) {
      for (const metric of experiment.metrics) {
        const result = await this.calculateVariantMetric(
          experimentId,
          variant.id,
          metric,
          startDate,
          endDate
        )
        results.push(result)
      }
    }

    // 进行统计分析
    const statisticalSummary = this.performStatisticalAnalysis(
      experiment,
      results
    )

    return {
      experiment,
      results,
      statistical_summary: statisticalSummary
    }
  }

  private async loadActiveExperiments(): Promise<void> {
    const { data: experiments } = await this.supabase
      .from('ab_experiments')
      .select('*')
      .eq('status', 'running')

    if (experiments) {
      experiments.forEach(exp => {
        this.experiments.set(exp.id, {
          ...exp,
          created_at: new Date(exp.created_at),
          updated_at: new Date(exp.updated_at),
          schedule: {
            ...exp.schedule,
            start_date: new Date(exp.schedule.start_date),
            end_date: exp.schedule.end_date ? new Date(exp.schedule.end_date) : undefined
          }
        })
      })
    }
  }

  private async loadUserAssignments(): Promise<void> {
    const { data: assignments } = await this.supabase
      .from('experiment_assignments')
      .select('*')
      .gte('assigned_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // 最近30天

    if (assignments) {
      assignments.forEach(assignment => {
        if (!this.userAssignments.has(assignment.user_id)) {
          this.userAssignments.set(assignment.user_id, new Map())
        }
        
        this.userAssignments.get(assignment.user_id)!.set(assignment.experiment_id, {
          ...assignment,
          assigned_at: new Date(assignment.assigned_at)
        })
      })
    }
  }

  private async isUserEligible(
    userId: string,
    experiment: ABExperiment,
    userContext?: any
  ): Promise<boolean> {
    
    const targeting = experiment.config.user_targeting

    // 检查排除条件
    if (targeting.exclusions.exclude_user_ids?.includes(userId)) {
      return false
    }

    // 检查是否在其他实验中
    if (targeting.exclusions.exclude_if_in_experiments?.length) {
      for (const expId of targeting.exclusions.exclude_if_in_experiments) {
        if (this.getUserAssignment(userId, expId)) {
          return false
        }
      }
    }

    // 检查用户属性
    if (userContext) {
      if (targeting.user_attributes.new_users_only && !userContext.isNewUser) {
        return false
      }
      
      if (targeting.user_attributes.returning_users_only && userContext.isNewUser) {
        return false
      }
    }

    // 检查行为特征 (需要查询数据库)
    if (targeting.behavioral_criteria.min_sessions) {
      const { data: sessionCount } = await this.supabase
        .from('user_sessions')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)

      if (!sessionCount || sessionCount.length < targeting.behavioral_criteria.min_sessions) {
        return false
      }
    }

    return true
  }

  private async assignUserToVariant(
    userId: string,
    sessionId: string,
    experiment: ABExperiment,
    userContext?: any
  ): Promise<UserAssignment | null> {
    
    // 检查流量分配
    const random = this.generateDeterministicRandom(userId, experiment.id)
    if (random > experiment.allocation.total_traffic_percentage / 100) {
      return null // 不在实验流量中
    }

    // 选择变体
    const variant = this.selectVariant(experiment, random)
    if (!variant) return null

    // 创建分组记录
    const assignment: UserAssignment = {
      user_id: userId,
      session_id: sessionId,
      experiment_id: experiment.id,
      variant_id: variant.id,
      assigned_at: new Date(),
      assignment_method: experiment.allocation.allocation_method,
      assignment_hash: this.hashUserExperiment(userId, experiment.id),
      user_snapshot: {
        is_new_user: userContext?.isNewUser || false,
        session_count: 0, // 需要查询
        device_type: userContext?.deviceType || 'unknown',
        location: userContext?.location || 'unknown'
      }
    }

    // 保存到数据库
    await this.supabase
      .from('experiment_assignments')
      .insert({
        user_id: assignment.user_id,
        session_id: assignment.session_id,
        experiment_id: assignment.experiment_id,
        variant_id: assignment.variant_id,
        assigned_at: assignment.assigned_at.toISOString(),
        assignment_method: assignment.assignment_method,
        assignment_hash: assignment.assignment_hash,
        user_snapshot: assignment.user_snapshot
      })

    // 更新内存缓存
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map())
    }
    this.userAssignments.get(userId)!.set(experiment.id, assignment)

    return assignment
  }

  private selectVariant(experiment: ABExperiment, random: number): ExperimentVariant | null {
    let cumulative = 0
    
    for (const allocation of experiment.allocation.variant_allocation) {
      cumulative += allocation.percentage / 100
      if (random <= cumulative) {
        return experiment.variants.find(v => v.id === allocation.variant_id) || null
      }
    }
    
    return null
  }

  private generateDeterministicRandom(userId: string, experimentId: string): number {
    // 使用用户ID和实验ID生成确定性随机数
    const hash = this.hashUserExperiment(userId, experimentId)
    const num = parseInt(hash.substring(0, 8), 16)
    return (num % 10000) / 10000
  }

  private hashUserExperiment(userId: string, experimentId: string): string {
    // 简化的哈希函数 (生产环境应该使用加密哈希)
    const str = `${userId}_${experimentId}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash).toString(16)
  }

  private getUserAssignment(userId: string, experimentId: string): UserAssignment | null {
    return this.userAssignments.get(userId)?.get(experimentId) || null
  }

  private async calculateVariantMetric(
    experimentId: string,
    variantId: string,
    metric: ExperimentMetric,
    startDate?: Date,
    endDate?: Date
  ): Promise<ExperimentResult> {
    
    // 构建查询条件
    let query = this.supabase
      .from('experiment_events')
      .select('*')
      .eq('experiment_id', experimentId)
      .eq('variant_id', variantId)
      .eq('metric_id', metric.id)

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString())
    }

    const { data: events } = await query

    if (!events || events.length === 0) {
      return {
        experiment_id: experimentId,
        variant_id: variantId,
        metric_id: metric.id,
        sample_size: 0,
        conversion_rate: 0,
        confidence_interval: [0, 0],
        p_value: 1,
        statistical_significance: false,
        total_events: 0,
        unique_users: 0,
        calculated_at: new Date()
      }
    }

    // 计算指标
    const uniqueUsers = new Set(events.map(e => e.user_id)).size
    const totalEvents = events.length
    const totalValue = events.reduce((sum, e) => sum + (e.event_value || 0), 0)

    let conversionRate = 0
    if (metric.type === 'conversion') {
      conversionRate = totalEvents / uniqueUsers
    } else if (metric.type === 'revenue') {
      conversionRate = totalValue / uniqueUsers
    }

    // 计算置信区间 (简化版本)
    const standardError = Math.sqrt(conversionRate * (1 - conversionRate) / uniqueUsers)
    const marginOfError = 1.96 * standardError // 95%置信区间
    
    return {
      experiment_id: experimentId,
      variant_id: variantId,
      metric_id: metric.id,
      sample_size: uniqueUsers,
      conversion_rate: conversionRate,
      confidence_interval: [
        Math.max(0, conversionRate - marginOfError),
        Math.min(1, conversionRate + marginOfError)
      ],
      p_value: 0.05, // 需要实际计算
      statistical_significance: uniqueUsers > 100 && marginOfError < 0.05,
      total_events: totalEvents,
      unique_users: uniqueUsers,
      revenue_impact: metric.type === 'revenue' ? totalValue : undefined,
      calculated_at: new Date()
    }
  }

  private performStatisticalAnalysis(
    experiment: ABExperiment,
    results: ExperimentResult[]
  ): StatisticalSummary {
    
    // 按指标分组结果
    const resultsByMetric = new Map<string, ExperimentResult[]>()
    results.forEach(result => {
      if (!resultsByMetric.has(result.metric_id)) {
        resultsByMetric.set(result.metric_id, [])
      }
      resultsByMetric.get(result.metric_id)!.push(result)
    })

    const metricAnalysis: MetricAnalysis[] = []
    
    resultsByMetric.forEach((metricResults, metricId) => {
      const controlResult = metricResults.find(r => {
        const variant = experiment.variants.find(v => v.id === r.variant_id)
        return variant?.is_control
      })

      if (!controlResult) return

      const treatmentResults = metricResults.filter(r => r.variant_id !== controlResult.variant_id)
      
      const variantComparisons = treatmentResults.map(treatmentResult => {
        const lift = ((treatmentResult.conversion_rate - controlResult.conversion_rate) / controlResult.conversion_rate) * 100
        const isSignificant = treatmentResult.statistical_significance && controlResult.statistical_significance
        
        return {
          variant_id: treatmentResult.variant_id,
          control_rate: controlResult.conversion_rate,
          treatment_rate: treatmentResult.conversion_rate,
          lift_percentage: lift,
          p_value: treatmentResult.p_value,
          is_significant: isSignificant,
          confidence_interval: treatmentResult.confidence_interval,
          sample_size: treatmentResult.sample_size
        }
      })

      metricAnalysis.push({
        metric_id: metricId,
        variant_comparisons: variantComparisons,
        overall_significance: variantComparisons.some(c => c.is_significant)
      })
    })

    return {
      experiment_id: experiment.id,
      metric_analysis: metricAnalysis,
      overall_conclusion: this.generateOverallConclusion(metricAnalysis),
      recommendation: this.generateRecommendation(experiment, metricAnalysis),
      calculated_at: new Date()
    }
  }

  private generateOverallConclusion(analysis: MetricAnalysis[]): string {
    const significantMetrics = analysis.filter(a => a.overall_significance)
    
    if (significantMetrics.length === 0) {
      return '实验结果尚无统计显著性，建议继续观察或增加样本量'
    }
    
    const positiveLifts = significantMetrics.filter(a => 
      a.variant_comparisons.some(c => c.lift_percentage > 0 && c.is_significant)
    )
    
    if (positiveLifts.length > 0) {
      return `发现显著的正向效果，${positiveLifts.length}个指标表现出色`
    }
    
    return '实验结果显示显著差异，但需要进一步分析业务影响'
  }

  private generateRecommendation(
    experiment: ABExperiment,
    analysis: MetricAnalysis[]
  ): string {
    
    const primaryMetrics = analysis.filter(a => {
      const metric = experiment.metrics.find(m => m.id === a.metric_id)
      return metric?.is_primary
    })

    if (primaryMetrics.length === 0) return '需要更多数据进行决策'

    const bestPerformingVariants = primaryMetrics.map(metric => {
      const bestComparison = metric.variant_comparisons
        .filter(c => c.is_significant)
        .sort((a, b) => b.lift_percentage - a.lift_percentage)[0]
      
      return bestComparison?.variant_id
    }).filter(Boolean)

    if (bestPerformingVariants.length > 0) {
      const mostCommonVariant = this.getMostFrequent(bestPerformingVariants)
      return `推荐采用变体 ${mostCommonVariant}，在主要指标上表现最佳`
    }

    return '继续观察实验结果，暂不建议做出决策'
  }

  private getMostFrequent<T>(arr: T[]): T {
    const counts = new Map<T, number>()
    arr.forEach(item => {
      counts.set(item, (counts.get(item) || 0) + 1)
    })
    
    let maxCount = 0
    let mostFrequent = arr[0]
    
    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count
        mostFrequent = item
      }
    })
    
    return mostFrequent
  }
}

// ================================
// 统计分析接口
// ================================

export interface StatisticalSummary {
  experiment_id: string
  metric_analysis: MetricAnalysis[]
  overall_conclusion: string
  recommendation: string
  calculated_at: Date
}

export interface MetricAnalysis {
  metric_id: string
  variant_comparisons: VariantComparison[]
  overall_significance: boolean
}

export interface VariantComparison {
  variant_id: string
  control_rate: number
  treatment_rate: number
  lift_percentage: number
  p_value: number
  is_significant: boolean
  confidence_interval: [number, number]
  sample_size: number
}

// ================================
// 实验管理器
// ================================

export class ExperimentManager {
  private engine = new ABTestingEngine()

  async createExperiment(config: Partial<ABExperiment>): Promise<ABExperiment> {
    const experiment: ABExperiment = {
      id: `exp_${Date.now()}`,
      name: config.name || '未命名实验',
      description: config.description || '',
      status: 'draft',
      type: config.type || 'simple',
      config: config.config || this.getDefaultConfig(),
      variants: config.variants || this.getDefaultVariants(),
      metrics: config.metrics || this.getDefaultMetrics(),
      allocation: config.allocation || this.getDefaultAllocation(),
      schedule: config.schedule || this.getDefaultSchedule(),
      statistics: config.statistics || this.getDefaultStatistics(),
      created_at: new Date(),
      updated_at: new Date(),
      created_by: config.created_by || 'system'
    }

    // 保存到数据库
    await this.engine['supabase']
      .from('ab_experiments')
      .insert(experiment)

    return experiment
  }

  async startExperiment(experimentId: string): Promise<void> {
    await this.engine['supabase']
      .from('ab_experiments')
      .update({ 
        status: 'running',
        updated_at: new Date().toISOString()
      })
      .eq('id', experimentId)
  }

  async stopExperiment(experimentId: string): Promise<void> {
    await this.engine['supabase']
      .from('ab_experiments')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', experimentId)
  }

  private getDefaultConfig(): ExperimentConfig {
    return {
      target_pages: ['/recommendations'],
      target_features: ['recommendation_algorithm'],
      user_targeting: {
        user_attributes: {},
        behavioral_criteria: {},
        exclusions: {}
      },
      experiment_settings: {},
      quality_assurance: {
        min_sample_size: 100,
        max_duration_days: 30,
        significance_level: 0.05,
        power: 0.8
      }
    }
  }

  private getDefaultVariants(): ExperimentVariant[] {
    return [
      {
        id: 'control',
        name: '对照组',
        description: '当前版本',
        is_control: true,
        config: {
          feature_flags: {},
          ui_changes: [],
          algorithm_params: {},
          recommendation_strategy: 'personalized'
        },
        traffic_weight: 50,
        expected_impact: []
      },
      {
        id: 'treatment',
        name: '实验组',
        description: '新版本',
        is_control: false,
        config: {
          feature_flags: {},
          ui_changes: [],
          algorithm_params: {},
          recommendation_strategy: 'popular'
        },
        traffic_weight: 50,
        expected_impact: []
      }
    ]
  }

  private getDefaultMetrics(): ExperimentMetric[] {
    return [
      {
        id: 'click_through_rate',
        name: '点击率',
        type: 'conversion',
        definition: {
          data_source: 'user_interactions',
          calculation: {
            numerator: 'COUNT(*) WHERE interaction_type = "click"',
            denominator: 'COUNT(DISTINCT user_id)',
            filters: {},
            time_window: '1d'
          },
          aggregation: 'rate'
        },
        is_primary: true,
        expected_direction: 'increase',
        minimum_detectable_effect: 0.05
      }
    ]
  }

  private getDefaultAllocation(): TrafficAllocation {
    return {
      total_traffic_percentage: 100,
      variant_allocation: [
        { variant_id: 'control', percentage: 50 },
        { variant_id: 'treatment', percentage: 50 }
      ],
      allocation_method: 'random',
      sticky_assignment: true,
      sticky_duration_days: 30
    }
  }

  private getDefaultSchedule(): ExperimentSchedule {
    return {
      start_date: new Date(),
      max_duration_days: 30,
      auto_stop_conditions: {
        significance_achieved: true,
        min_sample_size_reached: true,
        max_duration_exceeded: true,
        negative_impact_detected: true
      }
    }
  }

  private getDefaultStatistics(): StatisticsConfig {
    return {
      significance_level: 0.05,
      power: 0.8,
      multiple_testing_correction: 'benjamini_hochberg',
      early_stopping: {
        enabled: true,
        check_frequency_hours: 24,
        min_sample_size: 100
      }
    }
  }
}

// 导出单例实例
export const abTestingEngine = new ABTestingEngine()
export const experimentManager = new ExperimentManager()

// 便捷函数
export const initializeABTesting = () => abTestingEngine.initialize()

export const getUserExperimentVariant = (
  userId: string,
  sessionId: string,
  experimentId: string,
  userContext?: any
) => abTestingEngine.getUserVariant(userId, sessionId, experimentId, userContext)

export const trackExperimentMetric = (
  userId: string,
  sessionId: string,
  experimentId: string,
  metricId: string,
  eventData: any
) => abTestingEngine.trackExperimentEvent(userId, sessionId, experimentId, metricId, eventData)

export default ABTestingEngine