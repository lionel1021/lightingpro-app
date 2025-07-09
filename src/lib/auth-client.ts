/**
 * 🔐 客户端认证系统 - Supabase Auth集成
 */

'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 用户类型定义
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'premium' | 'pro'
  created_at: string
}

// 认证状态 Hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
          return
        }

        if (session?.user) {
          await loadUserProfile(session.user.id)
        }
      } catch (err) {
        setError('获取会话失败')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session?.user?.email)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // 加载用户资料
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('加载用户资料失败:', error)
        return
      }

      if (profile) {
        setUser({
          id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          subscription_tier: profile.subscription_tier,
          created_at: profile.created_at
        })
      } else {
        // 创建用户资料
        await createUserProfile(userId)
      }
    } catch (err) {
      console.error('用户资料加载错误:', err)
    }
  }

  // 创建用户资料
  const createUserProfile = async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser()
      
      if (!authUser.user) return

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            email: authUser.user.email!,
            full_name: authUser.user.user_metadata?.full_name || '',
            avatar_url: authUser.user.user_metadata?.avatar_url || '',
            subscription_tier: 'free'
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('创建用户资料失败:', error)
        return
      }

      if (profile) {
        setUser({
          id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          subscription_tier: profile.subscription_tier,
          created_at: profile.created_at
        })
      }
    } catch (err) {
      console.error('创建用户资料错误:', err)
    }
  }

  // 登录方法
  const signIn = async (email: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = '登录失败'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 注册方法
  const signUp = async (email: string, password: string, fullName?: string) => {
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || ''
          }
        }
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        user: data.user,
        needsConfirmation: !data.session
      }
    } catch (err) {
      const errorMessage = '注册失败'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 社交登录
  const signInWithProvider = async (provider: 'google' | 'github') => {
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = `${provider}登录失败`
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // 登出方法
  const signOut = async () => {
    setError(null)

    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      setUser(null)
      return { success: true }
    } catch (err) {
      const errorMessage = '登出失败'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // 更新用户资料
  const updateProfile = async (updates: {
    full_name?: string
    avatar_url?: string
  }) => {
    if (!user) return { success: false, error: '用户未登录' }

    setError(null)

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      // 更新本地状态
      setUser(prev => prev ? { ...prev, ...updates } : null)
      return { success: true, data }
    } catch (err) {
      const errorMessage = '更新资料失败'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = '重置密码失败'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user
  }
}

// 认证相关工具函数
export const authUtils = {
  // 获取当前用户
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 检查是否已认证
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  },

  // 获取访问令牌
  getAccessToken: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  },

  // 刷新会话
  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession()
    return { session: data.session, error }
  }
}