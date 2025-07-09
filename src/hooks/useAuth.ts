/**
 * 🔐 useAuth Hook - LightingPro认证状态管理
 * SuperClaude系统架构师 + MCP智能代码生成器协作产出
 */

'use client'

import { useState, useEffect } from 'react'
import { authManager, AuthState, User, SignUpData, SignInData, UserPreferences } from '@/lib/auth'

export interface UseAuthReturn {
  // 状态
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isGuest: boolean
  
  // 认证操作
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  
  // 用户档案操作
  updateProfile: (updates: Partial<UserPreferences & { full_name?: string; avatar_url?: string }>) => Promise<{ success: boolean; error?: string }>
  
  // 工具方法
  clearError: () => void
  refreshUser: () => Promise<void>
}

/**
 * 🎯 主要认证Hook
 */
export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 客户端挂载后再获取认证状态
    setAuthState(authManager.getAuthState())
    
    // 订阅认证状态变化
    const unsubscribe = authManager.subscribe(setAuthState)
    
    return unsubscribe
  }, [])

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  const refreshUser = async () => {
    // 触发重新获取用户信息
    if (authState.user) {
      setAuthState(prev => ({ ...prev, loading: true }))
      // 认证管理器会自动更新状态
    }
  }

  return {
    // 状态
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: mounted ? authManager.isAuthenticated() : false,
    isGuest: mounted ? authManager.isGuest() : true,
    
    // 认证操作
    signUp: authManager.signUp.bind(authManager),
    signIn: authManager.signIn.bind(authManager),
    signOut: authManager.signOut.bind(authManager),
    resetPassword: authManager.resetPassword.bind(authManager),
    
    // 用户档案操作
    updateProfile: authManager.updateProfile.bind(authManager),
    
    // 工具方法
    clearError,
    refreshUser
  }
}

/**
 * 🚪 登录状态检查Hook
 */
export function useAuthCheck() {
  const { user, loading, isAuthenticated } = useAuth()
  
  return {
    user,
    loading,
    isAuthenticated,
    needsAuth: !loading && !isAuthenticated
  }
}

/**
 * 👤 用户偏好设置Hook
 */
export function useUserPreferences() {
  const { user, updateProfile } = useAuth()
  
  const preferences = user?.user_metadata?.preferences || {}
  
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    return await updateProfile(newPreferences)
  }
  
  const isOnboardingCompleted = user?.user_metadata?.onboarding_completed || false
  
  const markOnboardingCompleted = async () => {
    return await updateProfile({ onboarding_completed: true } as any)
  }
  
  return {
    preferences,
    updatePreferences,
    isOnboardingCompleted,
    markOnboardingCompleted,
    hasPreferences: Object.keys(preferences).length > 0
  }
}

/**
 * 🛡️ 路由保护Hook
 */
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (redirectTo) {
        window.location.href = redirectTo
      } else {
        // 默认重定向到登录页
        window.location.href = '/auth/signin'
      }
    }
  }, [isAuthenticated, loading, redirectTo])
  
  return {
    isAuthenticated,
    loading,
    shouldRender: isAuthenticated && !loading
  }
}

/**
 * 🎯 访客模式Hook
 */
export function useGuestMode() {
  const { isGuest, loading } = useAuth()
  
  return {
    isGuest,
    loading,
    canUseGuestFeatures: isGuest && !loading
  }
}

/**
 * 📧 邮箱验证状态Hook
 */
export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  
  const resendVerification = async (email: string) => {
    setIsVerifying(true)
    try {
      const result = await authManager.resetPassword(email)
      if (result.success) {
        setVerificationSent(true)
      }
      return result
    } finally {
      setIsVerifying(false)
    }
  }
  
  return {
    isVerifying,
    verificationSent,
    resendVerification
  }
}

/**
 * 🔄 会话管理Hook
 */
export function useSession() {
  const { user, isAuthenticated, signOut } = useAuth()
  const [sessionExpired, setSessionExpired] = useState(false)
  
  useEffect(() => {
    // 监听会话过期
    const checkSession = () => {
      if (user && !isAuthenticated) {
        setSessionExpired(true)
      }
    }
    
    const interval = setInterval(checkSession, 60000) // 每分钟检查一次
    
    return () => clearInterval(interval)
  }, [user, isAuthenticated])
  
  const handleSessionExpired = async () => {
    await signOut()
    setSessionExpired(false)
    window.location.href = '/auth/signin?expired=true'
  }
  
  return {
    sessionExpired,
    handleSessionExpired,
    extendSession: () => setSessionExpired(false)
  }
}

/**
 * 📱 社交登录Hook
 */
export function useSocialAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const signInWithProvider = async (provider: 'google' | 'github' | 'apple') => {
    setLoading(true)
    setError(null)
    
    try {
      // 这里需要实现具体的社交登录逻辑
      // 目前只是占位符
      console.log(`Sign in with ${provider}`)
      throw new Error('Social login not implemented yet')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Social login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  return {
    loading,
    error,
    signInWithProvider,
    clearError: () => setError(null)
  }
}

export default useAuth