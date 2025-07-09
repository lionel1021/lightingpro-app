/**
 * 🚨 错误报告API - SuperClaude安全专家 + MCP AI协作
 * 
 * 功能:
 * - 收集和记录客户端错误
 * - 错误分类和优先级
 * - 自动错误聚合
 * - 性能影响分析
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AppError, ErrorSeverity } from '@/lib/types'

interface ErrorReportPayload {
  id: string
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  
  // 额外上下文
  browserInfo?: {
    name: string
    version: string
    os: string
    screen: string
    language: string
  }
  
  // 性能信息
  performanceMetrics?: {
    memory?: number
    timing?: Record<string, number>
    resources?: number
  }
  
  // 用户操作历史
  userActions?: Array<{
    action: string
    timestamp: string
    element?: string
  }>
}

/**
 * 🔍 错误严重性分析器
 */
function analyzeErrorSeverity(error: ErrorReportPayload): ErrorSeverity {
  const message = error.message.toLowerCase()
  const stack = error.stack?.toLowerCase() || ''
  
  // 🔴 严重错误
  if (
    message.includes('chunkloaderror') ||
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('script error') ||
    message.includes('uncaught') ||
    stack.includes('auth') ||
    stack.includes('payment') ||
    stack.includes('checkout')
  ) {
    return 'critical'
  }
  
  // 🟡 高级错误
  if (
    message.includes('typeerror') ||
    message.includes('referenceerror') ||
    message.includes('syntaxerror') ||
    stack.includes('recommendation') ||
    stack.includes('search') ||
    stack.includes('favorite')
  ) {
    return 'high'
  }
  
  // 🟠 中级错误
  if (
    message.includes('warning') ||
    message.includes('deprecated') ||
    stack.includes('ui') ||
    stack.includes('component')
  ) {
    return 'medium'
  }
  
  // 🟢 低级错误
  return 'low'
}

/**
 * 🎯 错误分类器
 */
function categorizeError(error: ErrorReportPayload): string {
  const message = error.message.toLowerCase()
  const stack = error.stack?.toLowerCase() || ''
  const url = error.url.toLowerCase()
  
  // 网络错误
  if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
    return 'network'
  }
  
  // 认证错误
  if (stack.includes('auth') || url.includes('signin') || url.includes('signup')) {
    return 'authentication'
  }
  
  // 推荐系统错误
  if (stack.includes('recommendation') || url.includes('recommendation')) {
    return 'recommendation'
  }
  
  // 搜索错误
  if (stack.includes('search') || url.includes('search')) {
    return 'search'
  }
  
  // 产品相关错误
  if (stack.includes('product') || url.includes('product')) {
    return 'product'
  }
  
  // UI/组件错误
  if (stack.includes('component') || stack.includes('ui')) {
    return 'ui'
  }
  
  // JavaScript错误
  if (message.includes('typeerror') || message.includes('referenceerror')) {
    return 'javascript'
  }
  
  // 数据库错误
  if (stack.includes('supabase') || stack.includes('database')) {
    return 'database'
  }
  
  return 'unknown'
}

/**
 * 🧹 清理和规范化错误数据
 */
function sanitizeErrorData(error: ErrorReportPayload): Partial<ErrorReportPayload> {
  // 移除敏感信息
  const sanitized = { ...error }
  
  // 清理URL中的敏感参数
  if (sanitized.url) {
    const url = new URL(sanitized.url)
    url.searchParams.delete('token')
    url.searchParams.delete('key')
    url.searchParams.delete('password')
    sanitized.url = url.toString()
  }
  
  // 清理User Agent中的敏感信息
  if (sanitized.userAgent) {
    sanitized.userAgent = sanitized.userAgent.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
  }
  
  // 限制stack trace长度
  if (sanitized.stack && sanitized.stack.length > 5000) {
    sanitized.stack = sanitized.stack.substring(0, 5000) + '...[truncated]'
  }
  
  return sanitized
}

/**
 * 📊 错误聚合检查
 */
async function checkErrorAggregation(errorHash: string, timeWindow: number = 3600000) { // 1 hour
  const since = new Date(Date.now() - timeWindow).toISOString()
  
  const { data, error } = await supabase
    .from('error_reports')
    .select('id, created_at')
    .eq('error_hash', errorHash)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error checking aggregation:', error)
    return { count: 0, isSpam: false }
  }
  
  const count = data?.length || 0
  const isSpam = count > 50 // 如果1小时内同样错误超过50次，认为是spam
  
  return { count, isSpam, recentErrors: data }
}

/**
 * 🔐 安全验证
 */
function validateErrorReport(data: any): data is ErrorReportPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.message === 'string' &&
    typeof data.timestamp === 'string' &&
    typeof data.url === 'string' &&
    data.message.length > 0 &&
    data.message.length < 10000 &&
    data.url.startsWith('http')
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 🔐 验证请求数据
    if (!validateErrorReport(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid error report format' },
        { status: 400 }
      )
    }
    
    // 🧹 清理敏感数据
    const sanitizedError = sanitizeErrorData(body)
    
    // 🎯 分析错误
    const severity = analyzeErrorSeverity(body)
    const category = categorizeError(body)
    
    // 📊 生成错误哈希用于聚合
    const errorContent = `${body.message}:${body.stack?.split('\n')[0] || ''}`
    const errorHash = Buffer.from(errorContent).toString('base64').substring(0, 32)
    
    // 🚫 检查是否为垃圾信息
    const { count, isSpam } = await checkErrorAggregation(errorHash)
    
    if (isSpam) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Error report received (rate limited)',
          aggregated: true
        },
        { status: 200 }
      )
    }
    
    // 📝 准备数据库记录
    const errorRecord = {
      id: body.id,
      error_hash: errorHash,
      message: body.message,
      stack: sanitizedError.stack,
      component_stack: sanitizedError.componentStack,
      severity,
      category,
      
      // 上下文信息
      url: sanitizedError.url,
      user_agent: sanitizedError.userAgent,
      user_id: body.userId || null,
      session_id: body.sessionId || null,
      
      // 浏览器信息
      browser_info: body.browserInfo || null,
      
      // 性能指标
      performance_metrics: body.performanceMetrics || null,
      
      // 用户操作
      user_actions: body.userActions || null,
      
      // 聚合信息
      occurrence_count: count + 1,
      first_seen: count === 0 ? body.timestamp : undefined,
      
      // 状态
      resolved: false,
      
      // 时间戳
      timestamp: body.timestamp,
      created_at: new Date().toISOString()
    }
    
    // 💾 保存到数据库
    const { data, error } = await supabase
      .from('error_reports')
      .insert(errorRecord)
    
    if (error) {
      console.error('Database error saving error report:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save error report' },
        { status: 500 }
      )
    }
    
    // 🚨 严重错误立即通知
    if (severity === 'critical') {
      // TODO: 发送即时通知到团队
      console.error(`🚨 CRITICAL ERROR REPORTED:`, {
        id: body.id,
        message: body.message,
        url: body.url,
        userId: body.userId
      })
      
      // 可以集成 Slack, Discord, 或邮件通知
      try {
        await notifyCriticalError(errorRecord)
      } catch (notificationError) {
        console.error('Failed to send critical error notification:', notificationError)
      }
    }
    
    // 📊 更新错误统计
    await updateErrorStatistics(category, severity)
    
    return NextResponse.json({
      success: true,
      message: 'Error report received',
      errorId: body.id,
      severity,
      category,
      aggregated: count > 0
    })
    
  } catch (error) {
    console.error('Error processing error report:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error processing error report'
      },
      { status: 500 }
    )
  }
}

/**
 * 🚨 严重错误通知
 */
async function notifyCriticalError(errorRecord: any) {
  // 这里可以集成各种通知服务
  
  // 示例: Webhook 通知
  if (process.env.CRITICAL_ERROR_WEBHOOK) {
    await fetch(process.env.CRITICAL_ERROR_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Critical Error in LightingPro`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Error ID:* ${errorRecord.id}\n*Message:* ${errorRecord.message}\n*URL:* ${errorRecord.url}\n*User:* ${errorRecord.user_id || 'Anonymous'}`
            }
          }
        ]
      })
    }).catch(console.error)
  }
}

/**
 * 📊 更新错误统计
 */
async function updateErrorStatistics(category: string, severity: ErrorSeverity) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    await supabase
      .from('error_statistics')
      .upsert({
        date: today,
        category,
        severity,
        count: 1
      }, {
        onConflict: 'date,category,severity'
      })
  } catch (error) {
    console.error('Failed to update error statistics:', error)
  }
}

// GET 方法用于健康检查
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Error reporting endpoint is healthy',
    timestamp: new Date().toISOString()
  })
}