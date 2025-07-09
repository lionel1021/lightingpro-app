/**
 * 🔍 高级分析系统 - 用户行为分析和转化跟踪
 * SuperClaude + MCP AI协作开发
 */

import { redis } from './redis-cache'
import { supabase } from './supabase'

// 用户行为事件类型
export interface UserEvent {
  userId?: string
  sessionId: string
  eventType: 'page_view' | 'click' | 'scroll' | 'form_submit' | 'search' | 'product_view' | 'add_to_cart' | 'purchase' | 'questionnaire_start' | 'questionnaire_complete'
  eventName: string
  properties?: Record<string, any>
  timestamp: Date
  userAgent?: string
  ip?: string
  referrer?: string
  path: string
  duration?: number
}

// 用户会话信息
export interface UserSession {
  sessionId: string
  userId?: string
  startTime: Date
  endTime?: Date
  pageViews: number
  events: UserEvent[]
  deviceInfo: {
    userAgent: string
    screenResolution: string
    language: string
    timezone: string
  }
  location?: {
    ip: string
    country?: string
    city?: string
  }
}

// 转化漏斗配置
export interface ConversionFunnel {
  id: string
  name: string
  description: string
  steps: Array<{
    id: string
    name: string
    eventType: string
    properties?: Record<string, any>
    timeWindow?: number // 分钟
  }>
  isActive: boolean
  createdAt: Date
}

// 分析报告
export interface AnalyticsReport {
  timeRange: {
    startDate: Date
    endDate: Date
  }
  metrics: {
    totalUsers: number
    activeUsers: number
    pageViews: number
    avgSessionDuration: number
    bounceRate: number
    conversionRate: number
  }
  topPages: Array<{
    path: string
    views: number
    uniqueViews: number
    avgDuration: number
    bounceRate: number
  }>
  userFlow: Array<{
    fromPage: string
    toPage: string
    count: number
    conversionRate: number
  }>
  funnelAnalysis: Array<{
    funnel: ConversionFunnel
    results: Array<{
      stepId: string
      users: number
      conversionRate: number
      dropOffRate: number
    }>
  }>
}

/**
 * 🎯 用户行为分析引擎
 */
export class UserAnalytics {
  private static instance: UserAnalytics
  private activeSessions: Map<string, UserSession> = new Map()
  private funnels: Map<string, ConversionFunnel> = new Map()
  
  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics()
    }
    return UserAnalytics.instance
  }
  
  /**
   * 跟踪用户事件
   */
  async trackEvent(event: Omit<UserEvent, 'timestamp'>): Promise<void> {
    const fullEvent: UserEvent = {
      ...event,
      timestamp: new Date()
    }
    
    try {
      // 存储到Redis（实时处理）
      await this.storeEventToRedis(fullEvent)
      
      // 存储到Supabase（持久化）
      await this.storeEventToDatabase(fullEvent)
      
      // 更新会话信息
      await this.updateSession(fullEvent)
      
      // 实时转化漏斗分析
      await this.checkConversionFunnels(fullEvent)
      
    } catch (error) {
      console.error('事件跟踪失败:', error)
    }
  }
  
  /**
   * 开始用户会话
   */
  async startSession(sessionId: string, userId?: string, deviceInfo?: any): Promise<UserSession> {
    const session: UserSession = {
      sessionId,
      userId,
      startTime: new Date(),
      pageViews: 0,
      events: [],
      deviceInfo: deviceInfo || {
        userAgent: '',
        screenResolution: '',
        language: '',
        timezone: ''
      }
    }
    
    this.activeSessions.set(sessionId, session)
    
    // 存储到Redis
    await redis.setex(
      `session:${sessionId}`,
      3600, // 1小时
      JSON.stringify(session)
    )
    
    return session
  }
  
  /**
   * 结束用户会话
   */
  async endSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (session) {
      session.endTime = new Date()
      
      // 存储到数据库
      await this.storeSessionToDatabase(session)
      
      // 清理内存
      this.activeSessions.delete(sessionId)
      
      // 清理Redis
      await redis.del(`session:${sessionId}`)
    }
  }
  
  /**
   * 创建转化漏斗
   */
  async createConversionFunnel(funnel: Omit<ConversionFunnel, 'id' | 'createdAt'>): Promise<ConversionFunnel> {
    const newFunnel: ConversionFunnel = {
      ...funnel,
      id: `funnel_${Date.now()}`,
      createdAt: new Date()
    }
    
    this.funnels.set(newFunnel.id, newFunnel)
    
    // 存储到数据库
    await supabase.from('conversion_funnels').insert({
      id: newFunnel.id,
      name: newFunnel.name,
      description: newFunnel.description,
      steps: newFunnel.steps,
      is_active: newFunnel.isActive,
      created_at: newFunnel.createdAt
    })
    
    return newFunnel
  }
  
  /**
   * 生成分析报告
   */
  async generateReport(
    startDate: Date,
    endDate: Date,
    options?: {
      includeFunnels?: boolean
      includeUserFlow?: boolean
      segment?: string
    }
  ): Promise<AnalyticsReport> {
    const report: AnalyticsReport = {
      timeRange: { startDate, endDate },
      metrics: await this.calculateMetrics(startDate, endDate),
      topPages: await this.getTopPages(startDate, endDate),
      userFlow: options?.includeUserFlow ? await this.getUserFlow(startDate, endDate) : [],
      funnelAnalysis: options?.includeFunnels ? await this.analyzeFunnels(startDate, endDate) : []
    }
    
    return report
  }
  
  /**
   * 实时获取当前活跃用户数
   */
  async getActiveUsers(timeWindow: number = 5): Promise<number> {
    const now = Date.now()
    const cutoff = now - (timeWindow * 60 * 1000)
    
    const activeSessionKeys = await redis.keys('session:*')
    let activeCount = 0
    
    for (const key of activeSessionKeys) {
      const session = await redis.get(key)
      if (session) {
        const sessionData = JSON.parse(session)
        const lastActivity = new Date(sessionData.lastActivity || sessionData.startTime).getTime()
        if (lastActivity > cutoff) {
          activeCount++
        }
      }
    }
    
    return activeCount
  }
  
  /**
   * 获取实时统计数据
   */
  async getRealtimeStats(): Promise<{
    activeUsers: number
    pageViewsLastHour: number
    topPages: Array<{ path: string; views: number }>
    recentEvents: UserEvent[]
  }> {
    const activeUsers = await this.getActiveUsers()
    const pageViewsLastHour = await this.getPageViewsLastHour()
    const topPages = await this.getTopPagesRealtime()
    const recentEvents = await this.getRecentEvents()
    
    return {
      activeUsers,
      pageViewsLastHour,
      topPages,
      recentEvents
    }
  }
  
  /**
   * 私有方法：存储事件到Redis
   */
  private async storeEventToRedis(event: UserEvent): Promise<void> {
    const key = `events:${event.sessionId}`
    await redis.lpush(key, JSON.stringify(event))
    await redis.expire(key, 3600) // 1小时过期
    
    // 实时统计
    const dateKey = new Date().toISOString().split('T')[0]
    await redis.incr(`stats:${dateKey}:events`)
    await redis.incr(`stats:${dateKey}:${event.eventType}`)
    await redis.expire(`stats:${dateKey}:events`, 86400 * 7) // 7天过期
    await redis.expire(`stats:${dateKey}:${event.eventType}`, 86400 * 7)
  }
  
  /**
   * 私有方法：存储事件到数据库
   */
  private async storeEventToDatabase(event: UserEvent): Promise<void> {
    await supabase.from('user_events').insert({
      user_id: event.userId,
      session_id: event.sessionId,
      event_type: event.eventType,
      event_name: event.eventName,
      properties: event.properties,
      timestamp: event.timestamp,
      user_agent: event.userAgent,
      ip: event.ip,
      referrer: event.referrer,
      path: event.path,
      duration: event.duration
    })
  }
  
  /**
   * 私有方法：更新会话信息
   */
  private async updateSession(event: UserEvent): Promise<void> {
    let session = this.activeSessions.get(event.sessionId)
    
    if (!session) {
      // 尝试从Redis加载
      const cached = await redis.get(`session:${event.sessionId}`)
      if (cached) {
        session = JSON.parse(cached)
        this.activeSessions.set(event.sessionId, session!)
      }
    }
    
    if (session) {
      session.events.push(event)
      if (event.eventType === 'page_view') {
        session.pageViews++
      }
      
      // 更新Redis
      await redis.setex(
        `session:${event.sessionId}`,
        3600,
        JSON.stringify(session)
      )
    }
  }
  
  /**
   * 私有方法：检查转化漏斗
   */
  private async checkConversionFunnels(event: UserEvent): Promise<void> {
    for (const funnel of this.funnels.values()) {
      if (!funnel.isActive) continue
      
      const matchingStep = funnel.steps.find(step => 
        step.eventType === event.eventType &&
        this.matchesProperties(event.properties, step.properties)
      )
      
      if (matchingStep) {
        await this.recordFunnelProgress(funnel.id, matchingStep.id, event)
      }
    }
  }
  
  /**
   * 私有方法：属性匹配
   */
  private matchesProperties(eventProps?: Record<string, any>, stepProps?: Record<string, any>): boolean {
    if (!stepProps) return true
    if (!eventProps) return false
    
    for (const [key, value] of Object.entries(stepProps)) {
      if (eventProps[key] !== value) return false
    }
    
    return true
  }
  
  /**
   * 私有方法：记录漏斗进度
   */
  private async recordFunnelProgress(funnelId: string, stepId: string, event: UserEvent): Promise<void> {
    const key = `funnel:${funnelId}:${stepId}`
    const userKey = `${event.userId || event.sessionId}`
    
    await redis.sadd(key, userKey)
    await redis.expire(key, 86400 * 30) // 30天过期
    
    // 记录时间戳
    await redis.hset(
      `funnel_time:${funnelId}:${userKey}`,
      stepId,
      event.timestamp.getTime()
    )
  }
  
  /**
   * 私有方法：存储会话到数据库
   */
  private async storeSessionToDatabase(session: UserSession): Promise<void> {
    const duration = session.endTime ? 
      (session.endTime.getTime() - session.startTime.getTime()) / 1000 : null
    
    await supabase.from('user_sessions').insert({
      session_id: session.sessionId,
      user_id: session.userId,
      start_time: session.startTime,
      end_time: session.endTime,
      page_views: session.pageViews,
      duration,
      device_info: session.deviceInfo,
      location: session.location
    })
  }
  
  /**
   * 私有方法：计算基础指标
   */
  private async calculateMetrics(startDate: Date, endDate: Date): Promise<AnalyticsReport['metrics']> {
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('*')
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
    
    const { data: events } = await supabase
      .from('user_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
    
    const totalUsers = new Set(sessions?.map(s => s.user_id).filter(Boolean)).size
    const activeUsers = sessions?.length || 0
    const pageViews = events?.filter(e => e.event_type === 'page_view').length || 0
    const avgSessionDuration = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) / activeUsers || 0
    const bounceRate = sessions?.filter(s => s.page_views <= 1).length / activeUsers || 0
    const conversions = events?.filter(e => e.event_type === 'purchase').length || 0
    const conversionRate = conversions / activeUsers || 0
    
    return {
      totalUsers,
      activeUsers,
      pageViews,
      avgSessionDuration,
      bounceRate,
      conversionRate
    }
  }
  
  /**
   * 私有方法：获取热门页面
   */
  private async getTopPages(startDate: Date, endDate: Date): Promise<AnalyticsReport['topPages']> {
    const { data: pageViews } = await supabase
      .from('user_events')
      .select('path, session_id, duration')
      .eq('event_type', 'page_view')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
    
    const pageStats = new Map<string, {
      views: number
      sessions: Set<string>
      totalDuration: number
      bounces: number
    }>()
    
    pageViews?.forEach(pv => {
      const path = pv.path
      if (!pageStats.has(path)) {
        pageStats.set(path, {
          views: 0,
          sessions: new Set(),
          totalDuration: 0,
          bounces: 0
        })
      }
      
      const stats = pageStats.get(path)!
      stats.views++
      stats.sessions.add(pv.session_id)
      stats.totalDuration += pv.duration || 0
    })
    
    return Array.from(pageStats.entries())
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        uniqueViews: stats.sessions.size,
        avgDuration: stats.totalDuration / stats.views,
        bounceRate: stats.bounces / stats.sessions.size
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  }
  
  /**
   * 私有方法：获取用户流
   */
  private async getUserFlow(startDate: Date, endDate: Date): Promise<AnalyticsReport['userFlow']> {
    const { data: events } = await supabase
      .from('user_events')
      .select('session_id, path, timestamp')
      .eq('event_type', 'page_view')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: true })
    
    const flows = new Map<string, number>()
    const sessions = new Map<string, string[]>()
    
    // 按会话分组
    events?.forEach(event => {
      if (!sessions.has(event.session_id)) {
        sessions.set(event.session_id, [])
      }
      sessions.get(event.session_id)!.push(event.path)
    })
    
    // 计算页面流
    sessions.forEach(pages => {
      for (let i = 0; i < pages.length - 1; i++) {
        const flow = `${pages[i]} → ${pages[i + 1]}`
        flows.set(flow, (flows.get(flow) || 0) + 1)
      }
    })
    
    return Array.from(flows.entries())
      .map(([flow, count]) => {
        const [fromPage, toPage] = flow.split(' → ')
        return {
          fromPage,
          toPage,
          count,
          conversionRate: count / (sessions.size || 1)
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
  }
  
  /**
   * 私有方法：分析转化漏斗
   */
  private async analyzeFunnels(startDate: Date, endDate: Date): Promise<AnalyticsReport['funnelAnalysis']> {
    const analyses = []
    
    for (const funnel of this.funnels.values()) {
      const results = []
      let previousStepUsers = 0
      
      for (let i = 0; i < funnel.steps.length; i++) {
        const step = funnel.steps[i]
        const stepUsers = await this.getFunnelStepUsers(funnel.id, step.id, startDate, endDate)
        
        const conversionRate = i === 0 ? 1 : stepUsers / previousStepUsers
        const dropOffRate = 1 - conversionRate
        
        results.push({
          stepId: step.id,
          users: stepUsers,
          conversionRate,
          dropOffRate
        })
        
        previousStepUsers = stepUsers
      }
      
      analyses.push({
        funnel,
        results
      })
    }
    
    return analyses
  }
  
  /**
   * 私有方法：获取漏斗步骤用户数
   */
  private async getFunnelStepUsers(funnelId: string, stepId: string, startDate: Date, endDate: Date): Promise<number> {
    const key = `funnel:${funnelId}:${stepId}`
    const users = await redis.smembers(key)
    
    // 这里可以添加时间范围过滤逻辑
    return users.length
  }
  
  /**
   * 私有方法：获取最近1小时页面浏览量
   */
  private async getPageViewsLastHour(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 3600000)
    const { count } = await supabase
      .from('user_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('timestamp', oneHourAgo.toISOString())
    
    return count || 0
  }
  
  /**
   * 私有方法：获取实时热门页面
   */
  private async getTopPagesRealtime(): Promise<Array<{ path: string; views: number }>> {
    const oneHourAgo = new Date(Date.now() - 3600000)
    const { data } = await supabase
      .from('user_events')
      .select('path')
      .eq('event_type', 'page_view')
      .gte('timestamp', oneHourAgo.toISOString())
    
    const pageViews = new Map<string, number>()
    data?.forEach(event => {
      pageViews.set(event.path, (pageViews.get(event.path) || 0) + 1)
    })
    
    return Array.from(pageViews.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  }
  
  /**
   * 私有方法：获取最近事件
   */
  private async getRecentEvents(): Promise<UserEvent[]> {
    const { data } = await supabase
      .from('user_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)
    
    return data?.map(event => ({
      userId: event.user_id,
      sessionId: event.session_id,
      eventType: event.event_type,
      eventName: event.event_name,
      properties: event.properties,
      timestamp: new Date(event.timestamp),
      userAgent: event.user_agent,
      ip: event.ip,
      referrer: event.referrer,
      path: event.path,
      duration: event.duration
    })) || []
  }
}

// 单例实例
export const userAnalytics = UserAnalytics.getInstance()

/**
 * 🎯 React Hook for Analytics
 */
export function useAnalytics() {
  const trackEvent = async (
    eventType: UserEvent['eventType'],
    eventName: string,
    properties?: Record<string, any>
  ) => {
    const sessionId = getSessionId()
    await userAnalytics.trackEvent({
      sessionId,
      eventType,
      eventName,
      properties,
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    })
  }
  
  const trackPageView = async (path?: string) => {
    await trackEvent('page_view', 'page_viewed', {
      path: path || window.location.pathname
    })
  }
  
  const trackClick = async (element: string, properties?: Record<string, any>) => {
    await trackEvent('click', 'element_clicked', {
      element,
      ...properties
    })
  }
  
  const trackConversion = async (type: string, value?: number) => {
    await trackEvent('purchase', 'conversion', {
      type,
      value
    })
  }
  
  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackConversion
  }
}

/**
 * 工具函数
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// 需要安装: npm install (已包含在现有依赖中)
// 需要创建数据库表: user_events, user_sessions, conversion_funnels