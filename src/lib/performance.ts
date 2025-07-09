/**
 * 📊 性能监控系统 - SuperClaude性能专家 + MCP AI协作
 * 
 * 功能:
 * - Web Vitals监控
 * - 自定义性能指标
 * - 实时性能分析
 * - 性能预算警告
 * - 用户体验评分
 */

import { supabase } from './supabase'

// ================================
// 性能指标类型定义
// ================================

export interface WebVitalsMetric {
  id: string
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  navigationType?: string
}

export interface CustomMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
  timestamp: number
  context?: Record<string, any>
}

export interface PerformanceReport {
  id: string
  session_id: string
  user_id?: string
  page_url: string
  
  // Web Vitals
  web_vitals: WebVitalsMetric[]
  
  // 自定义指标
  custom_metrics: CustomMetric[]
  
  // 页面加载性能
  navigation_timing?: PerformanceNavigationTiming
  
  // 资源加载性能
  resource_timing?: PerformanceResourceTiming[]
  
  // 设备信息
  device_info: {
    user_agent: string
    screen_resolution: string
    memory?: number
    cores?: number
    connection?: {
      effective_type: string
      downlink?: number
      rtt?: number
    }
  }
  
  // 用户体验评分
  user_experience_score?: number
  
  timestamp: string
}

// ================================
// 性能监控管理器
// ================================

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private sessionId: string
  private userId?: string
  private metrics: Map<string, CustomMetric[]> = new Map()
  private webVitalsBuffer: WebVitalsMetric[] = []
  private reportingInterval: number = 30000 // 30秒
  private reportingTimer?: NodeJS.Timeout
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeWebVitalsTracking()
    this.initializeCustomTracking()
    this.startPeriodicReporting()
  }
  
  private generateSessionId(): string {
    if (typeof window === 'undefined') {
      return 'server-session-id'
    }
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * 🎯 Web Vitals 监控初始化
   */
  private initializeWebVitalsTracking() {
    if (typeof window === 'undefined') return
    
    // 动态导入 web-vitals
    import('web-vitals').then(({ onCLS, onFCP, onFID, onLCP, onTTFB }) => {
      onCLS(this.onWebVital.bind(this))
      onFCP(this.onWebVital.bind(this))
      onFID(this.onWebVital.bind(this))
      onLCP(this.onWebVital.bind(this))
      onTTFB(this.onWebVital.bind(this))
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error)
    })
  }
  
  /**
   * 📊 Web Vital 指标处理
   */
  private onWebVital(metric: any) {
    const webVitalMetric: WebVitalsMetric = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType
    }
    
    this.webVitalsBuffer.push(webVitalMetric)
    
    // 立即报告关键指标
    if (metric.name === 'LCP' || metric.name === 'FID' || metric.rating === 'poor') {
      this.reportCriticalMetric(webVitalMetric)
    }
  }
  
  /**
   * 🔧 自定义性能追踪初始化
   */
  private initializeCustomTracking() {
    if (typeof window === 'undefined') return
    
    // 监控页面可见性变化
    document.addEventListener('visibilitychange', () => {
      this.recordCustomMetric('page_visibility_change', {
        name: 'page_visibility',
        value: document.hidden ? 0 : 1,
        unit: 'count',
        timestamp: Date.now(),
        context: { state: document.hidden ? 'hidden' : 'visible' }
      })
    })
    
    // 监控网络连接变化
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        connection.addEventListener('change', () => {
          this.recordCustomMetric('network_change', {
            name: 'network_quality',
            value: this.getNetworkScore(connection),
            unit: 'percentage',
            timestamp: Date.now(),
            context: {
              effective_type: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt
            }
          })
        })
      }
    }
    
    // 监控内存使用
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory) {
          this.recordCustomMetric('memory_usage', {
            name: 'memory_used',
            value: memory.usedJSHeapSize,
            unit: 'bytes',
            timestamp: Date.now(),
            context: {
              total: memory.totalJSHeapSize,
              limit: memory.jsHeapSizeLimit,
              percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
            }
          })
        }
      }, 10000) // 每10秒检查一次
    }
  }
  
  /**
   * 📈 网络质量评分
   */
  private getNetworkScore(connection: any): number {
    const effectiveTypeScores: Record<string, number> = {
      'slow-2g': 10,
      '2g': 25,
      '3g': 50,
      '4g': 75,
      '5g': 95
    }
    
    const baseScore = effectiveTypeScores[connection.effectiveType] || 50
    
    // 基于RTT调整评分
    if (connection.rtt) {
      if (connection.rtt < 100) return Math.min(baseScore + 20, 100)
      if (connection.rtt > 500) return Math.max(baseScore - 30, 0)
    }
    
    return baseScore
  }
  
  /**
   * 📊 记录自定义指标
   */
  recordCustomMetric(category: string, metric: CustomMetric) {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, [])
    }
    
    this.metrics.get(category)!.push(metric)
    
    // 限制内存使用 - 每个类别最多保留100个指标
    const categoryMetrics = this.metrics.get(category)!
    if (categoryMetrics.length > 100) {
      categoryMetrics.splice(0, categoryMetrics.length - 100)
    }
  }
  
  /**
   * ⚡ 快速性能测量
   */
  measurePerformance<T>(name: string, fn: () => T): T {
    const start = performance.now()
    
    try {
      const result = fn()
      
      // 如果是Promise，异步测量
      if (result instanceof Promise) {
        result.finally(() => {
          const duration = performance.now() - start
          this.recordCustomMetric('function_performance', {
            name,
            value: duration,
            unit: 'ms',
            timestamp: Date.now(),
            context: { type: 'async' }
          })
        })
      } else {
        // 同步测量
        const duration = performance.now() - start
        this.recordCustomMetric('function_performance', {
          name,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
          context: { type: 'sync' }
        })
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordCustomMetric('function_performance', {
        name: `${name}_error`,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        context: { type: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
      })
      throw error
    }
  }
  
  /**
   * 🔄 异步性能测量装饰器
   */
  static measureAsync<T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!
    
    descriptor.value = async function(...args: any[]) {
      const monitor = PerformanceMonitor.getInstance()
      const start = performance.now()
      
      try {
        const result = await method.apply(this, args)
        const duration = performance.now() - start
        
        monitor.recordCustomMetric('method_performance', {
          name: `${target.constructor.name}.${propertyName}`,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
          context: { status: 'success', args: args.length }
        })
        
        return result
      } catch (error) {
        const duration = performance.now() - start
        
        monitor.recordCustomMetric('method_performance', {
          name: `${target.constructor.name}.${propertyName}_error`,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
          context: { 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error',
            args: args.length
          }
        })
        
        throw error
      }
    } as T
    
    return descriptor
  }
  
  /**
   * 🚨 关键指标即时报告
   */
  private async reportCriticalMetric(metric: WebVitalsMetric) {
    if (metric.rating === 'poor') {
      console.warn(`🚨 Poor ${metric.name} performance:`, metric.value)
      
      // 发送即时警报
      try {
        await this.sendPerformanceAlert({
          type: 'critical',
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to send performance alert:', error)
      }
    }
  }
  
  /**
   * 📊 计算用户体验评分
   */
  private calculateUserExperienceScore(): number {
    const vitals = this.webVitalsBuffer
    if (vitals.length === 0) return 100
    
    const scores: Record<string, number> = {
      'good': 100,
      'needs-improvement': 60,
      'poor': 20
    }
    
    const totalScore = vitals.reduce((sum, vital) => sum + scores[vital.rating], 0)
    return Math.round(totalScore / vitals.length)
  }
  
  /**
   * 📤 定期性能报告
   */
  private startPeriodicReporting() {
    this.reportingTimer = setInterval(() => {
      this.sendPerformanceReport()
    }, this.reportingInterval)
    
    // 页面卸载时发送最终报告
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.sendPerformanceReport(true)
      })
    }
  }
  
  /**
   * 📊 发送性能报告
   */
  private async sendPerformanceReport(isFinal: boolean = false) {
    if (typeof window === 'undefined') return
    
    try {
      const allCustomMetrics: CustomMetric[] = []
      this.metrics.forEach(metrics => allCustomMetrics.push(...metrics))
      
      const report: PerformanceReport = {
        id: `${this.sessionId}_${Date.now()}`,
        session_id: this.sessionId,
        user_id: this.userId,
        page_url: window.location.href,
        web_vitals: [...this.webVitalsBuffer],
        custom_metrics: allCustomMetrics,
        navigation_timing: this.getNavigationTiming(),
        resource_timing: this.getResourceTiming(),
        device_info: this.getDeviceInfo(),
        user_experience_score: this.calculateUserExperienceScore(),
        timestamp: new Date().toISOString()
      }
      
      // 发送到后端
      const response = await fetch('/api/performance/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...report, is_final: isFinal })
      })
      
      if (response.ok) {
        // 清理已发送的数据
        this.webVitalsBuffer.length = 0
        this.metrics.clear()
      }
      
    } catch (error) {
      console.error('Failed to send performance report:', error)
    }
  }
  
  /**
   * 🔧 获取导航时间信息
   */
  private getNavigationTiming(): PerformanceNavigationTiming | undefined {
    if (typeof window === 'undefined' || !window.performance) return undefined
    
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return navigation
  }
  
  /**
   * 📦 获取资源加载时间
   */
  private getResourceTiming(): PerformanceResourceTiming[] {
    if (typeof window === 'undefined' || !window.performance) return []
    
    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    // 只返回最新的50个资源
    return resources.slice(-50).map(resource => ({
      name: resource.name,
      startTime: resource.startTime,
      duration: resource.duration,
      transferSize: resource.transferSize,
      encodedBodySize: resource.encodedBodySize,
      decodedBodySize: resource.decodedBodySize
    } as PerformanceResourceTiming))
  }
  
  /**
   * 📱 获取设备信息
   */
  private getDeviceInfo() {
    const deviceInfo: any = {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`
    }
    
    // 内存信息
    if ('memory' in performance) {
      deviceInfo.memory = (performance as any).memory?.jsHeapSizeLimit
    }
    
    // CPU核心数
    if ('hardwareConcurrency' in navigator) {
      deviceInfo.cores = navigator.hardwareConcurrency
    }
    
    // 网络连接信息
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        deviceInfo.connection = {
          effective_type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        }
      }
    }
    
    return deviceInfo
  }
  
  /**
   * 🚨 发送性能警报
   */
  private async sendPerformanceAlert(alert: any) {
    try {
      await fetch('/api/performance/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      })
    } catch (error) {
      console.error('Failed to send performance alert:', error)
    }
  }
  
  /**
   * 👤 设置用户ID
   */
  setUserId(userId: string) {
    this.userId = userId
  }
  
  /**
   * 🧹 清理资源
   */
  destroy() {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer)
    }
    
    // 发送最终报告
    this.sendPerformanceReport(true)
  }
}

// ================================
// 导出接口
// ================================

export const performanceMonitor = PerformanceMonitor.getInstance()

/**
 * 📊 性能测量装饰器
 */
export function measurePerformance(name?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const metricName = name || `${target.constructor.name}.${propertyName}`
    
    descriptor.value = function (...args: any[]) {
      return performanceMonitor.measurePerformance(metricName, () => method.apply(this, args))
    }
    
    return descriptor
  }
}

/**
 * ⚡ 快速性能测量函数
 */
export function measureFunction<T>(name: string, fn: () => T): T {
  return performanceMonitor.measurePerformance(name, fn)
}

/**
 * 📈 记录自定义指标
 */
export function recordMetric(name: string, value: number, unit: CustomMetric['unit'] = 'count', context?: Record<string, any>) {
  performanceMonitor.recordCustomMetric('custom', {
    name,
    value,
    unit,
    timestamp: Date.now(),
    context
  })
}

/**
 * 🎯 性能预算检查
 */
export const PerformanceBudgets = {
  // Web Vitals 预算
  LCP: 2500, // 毫秒
  FID: 100,  // 毫秒
  CLS: 0.1,  // 分数
  FCP: 1800, // 毫秒
  TTFB: 800, // 毫秒
  
  // 自定义预算
  bundleSize: 250 * 1024, // 250KB
  apiResponseTime: 1000,   // 1秒
  memoryUsage: 50 * 1024 * 1024, // 50MB
  
  checkBudget(metric: string, value: number): boolean {
    const budget = (this as any)[metric]
    return budget ? value <= budget : true
  }
}

export default performanceMonitor