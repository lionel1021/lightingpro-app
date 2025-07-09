/**
 * 🛡️ ErrorBoundary - LightingPro错误边界组件
 * SuperClaude安全专家 + MCP AI协作生成
 * 
 * 功能:
 * - React错误边界
 * - 优雅错误处理
 * - 错误报告
 * - 用户友好的错误界面
 */

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  allowReset?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: typeof window !== 'undefined' ? `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : 'server-error-id'
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // 调用自定义错误处理
    this.props.onError?.(error, errorInfo)

    // 发送错误报告
    this.reportError(error, errorInfo)

    // 在开发环境下打印详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport = {
        id: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: typeof window !== 'undefined' ? new Date().toISOString() : '1970-01-01T00:00:00.000Z',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        userId: null // TODO: 从认证系统获取用户ID
      }

      // 发送到错误收集服务
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/errors/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorReport)
        }).catch(err => {
          console.error('Failed to report error:', err)
        })
      }
    } catch (reportingError) {
      console.error('Error reporting failed:', reportingError)
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const { error, errorId } = this.state
    const subject = encodeURIComponent(`Bug Report - Error ID: ${errorId}`)
    const body = encodeURIComponent(`
Error Details:
- Error ID: ${errorId}
- Message: ${error?.message}
- Page: ${window.location.href}
- Time: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:

`)
    window.open(`mailto:support@lightingpro.com?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认错误界面
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                哎呀，出现了一些问题
              </CardTitle>
              <p className="text-gray-600 mt-2">
                我们遇到了一个意外错误，但我们正在处理中。
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 错误ID */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-600">错误ID</div>
                <div className="font-mono text-sm text-gray-900 mt-1">
                  {this.state.errorId}
                </div>
              </div>

              {/* 开发环境显示详细错误信息 */}
              {(process.env.NODE_ENV === 'development' || this.props.showDetails) && this.state.error && (
                <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="text-red-800 font-medium cursor-pointer">
                    技术详情 (开发模式)
                  </summary>
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="text-sm font-medium text-red-800">错误消息:</div>
                      <div className="text-sm text-red-700 font-mono bg-red-100 p-2 rounded mt-1">
                        {this.state.error.message}
                      </div>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <div className="text-sm font-medium text-red-800">堆栈跟踪:</div>
                        <pre className="text-xs text-red-700 bg-red-100 p-2 rounded mt-1 overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                {this.props.allowReset !== false && (
                  <Button
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-2"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重试
                  </Button>
                )}
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  刷新页面
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  返回首页
                </Button>
              </div>

              {/* 报告按钮 */}
              <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  如果问题持续存在，请联系我们的支持团队
                </div>
                <Button
                  onClick={this.handleReportBug}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Bug className="w-4 h-4" />
                  报告问题
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * 🎯 简化版错误边界Hook
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return {
    captureError,
    resetError
  }
}

/**
 * 🛡️ 异步错误边界组件
 */
interface AsyncErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error) => void
  fallback?: (error: Error, reset: () => void) => ReactNode
}

export function AsyncErrorBoundary({ children, onError, fallback }: AsyncErrorBoundaryProps) {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  React.useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  // 处理异步错误
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason))
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (error) {
    if (fallback) {
      return fallback(error, resetError)
    }

    return (
      <ErrorBoundary onError={onError}>
        {children}
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary onError={(error) => setError(error)}>
      {children}
    </ErrorBoundary>
  )
}

/**
 * 🎨 页面级错误边界
 */
interface PageErrorBoundaryProps {
  children: ReactNode
  title?: string
}

export function PageErrorBoundary({ children, title = 'LightingPro' }: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error(`[${title}] Page Error:`, error, errorInfo)
      }}
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">页面加载失败</h1>
            <p className="text-gray-600 mb-4">请刷新页面或稍后再试</p>
            <Button onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary