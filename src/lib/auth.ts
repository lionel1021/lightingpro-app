/**
 * 🔐 LightingPro 认证系统
 * 基于Supabase Auth + 自定义会话管理
 * SuperClaude + MCP AI协作生成
 */

import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  user_metadata?: {
    preferences?: UserPreferences
    onboarding_completed?: boolean
  }
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  room_types: string[]
  style_preferences: string[]
  budget_range: {
    min: number
    max: number
  }
  notification_settings: {
    email: boolean
    push: boolean
    recommendations: boolean
  }
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  full_name?: string
  preferences?: Partial<UserPreferences>
}

export interface SignInData {
  email: string
  password: string
  remember?: boolean
}

/**
 * 🚀 认证管理器
 */
export class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null
  }
  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  constructor() {
    this.initializeAuth()
  }

  /**
   * 初始化认证状态
   */
  private async initializeAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        this.updateState({ user: null, loading: false, error: error.message })
        return
      }

      if (session?.user) {
        const user = await this.fetchUserProfile(session.user.id)
        this.updateState({ user, loading: false, error: null })
      } else {
        this.updateState({ user: null, loading: false, error: null })
      }

      // 监听认证状态变化
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = await this.fetchUserProfile(session.user.id)
          this.updateState({ user, loading: false, error: null })
        } else if (event === 'SIGNED_OUT') {
          this.updateState({ user: null, loading: false, error: null })
        }
      })
    } catch (error) {
      this.updateState({ 
        user: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      })
    }
  }

  /**
   * 获取用户完整档案
   */
  private async fetchUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error)
        return null
      }

      // 如果没有档案，创建一个基础档案
      if (!data) {
        const { data: authUser } = await supabase.auth.getUser()
        if (authUser.user) {
          return {
            id: authUser.user.id,
            email: authUser.user.email!,
            full_name: authUser.user.user_metadata?.full_name,
            avatar_url: authUser.user.user_metadata?.avatar_url,
            user_metadata: authUser.user.user_metadata,
            created_at: authUser.user.created_at,
            updated_at: authUser.user.updated_at || authUser.user.created_at
          }
        }
        return null
      }

      return {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        user_metadata: data.preferences,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }

  /**
   * 📧 用户注册
   */
  async signUp(data: SignUpData): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> {
    try {
      this.updateState({ ...this.authState, loading: true, error: null })

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || '',
            preferences: data.preferences || {}
          }
        }
      })

      if (error) {
        this.updateState({ ...this.authState, loading: false, error: error.message })
        return { success: false, error: error.message }
      }

      if (authData.user && !authData.session) {
        // 需要邮箱验证
        this.updateState({ ...this.authState, loading: false, error: null })
        return { success: true, needsVerification: true }
      }

      if (authData.user && authData.session) {
        // 创建用户档案
        await this.createUserProfile(authData.user.id, {
          email: data.email,
          full_name: data.full_name,
          preferences: data.preferences
        })

        const user = await this.fetchUserProfile(authData.user.id)
        this.updateState({ user, loading: false, error: null })
        return { success: true }
      }

      return { success: false, error: 'Unknown error occurred' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      this.updateState({ ...this.authState, loading: false, error: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * 🔑 用户登录
   */
  async signIn(data: SignInData): Promise<{ success: boolean; error?: string }> {
    try {
      this.updateState({ ...this.authState, loading: true, error: null })

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        this.updateState({ ...this.authState, loading: false, error: error.message })
        return { success: false, error: error.message }
      }

      const user = await this.fetchUserProfile(authData.user.id)
      this.updateState({ user, loading: false, error: null })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      this.updateState({ ...this.authState, loading: false, error: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * 🚪 用户登出
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      this.updateState({ user: null, loading: false, error: null })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      return { success: false, error: errorMessage }
    }
  }

  /**
   * 🔄 重置密码
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      return { success: false, error: errorMessage }
    }
  }

  /**
   * 👤 更新用户档案
   */
  async updateProfile(updates: Partial<UserPreferences & { full_name?: string; avatar_url?: string }>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.authState.user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: this.authState.user.id,
          email: this.authState.user.email,
          full_name: updates.full_name || this.authState.user.full_name,
          avatar_url: updates.avatar_url || this.authState.user.avatar_url,
          preferences: {
            ...this.authState.user.user_metadata?.preferences,
            ...updates
          },
          updated_at: new Date().toISOString()
        })

      if (error) {
        return { success: false, error: error.message }
      }

      // 重新获取用户档案
      const user = await this.fetchUserProfile(this.authState.user.id)
      this.updateState({ ...this.authState, user })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      return { success: false, error: errorMessage }
    }
  }

  /**
   * 创建用户档案
   */
  private async createUserProfile(userId: string, profileData: {
    email: string
    full_name?: string
    preferences?: Partial<UserPreferences>
  }) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: profileData.email,
          full_name: profileData.full_name || '',
          preferences: profileData.preferences || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating user profile:', error)
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  /**
   * 更新认证状态
   */
  private updateState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState }
    this.listeners.forEach(listener => listener(this.authState))
  }

  /**
   * 订阅认证状态变化
   */
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    // 立即调用一次，传递当前状态
    listener(this.authState)
    
    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 获取当前认证状态
   */
  getAuthState(): AuthState {
    return this.authState
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.authState.user
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return !!this.authState.user && !this.authState.loading
  }

  /**
   * 检查是否为访客模式
   */
  isGuest(): boolean {
    return !this.authState.user && !this.authState.loading
  }
}

// 导出单例实例
export const authManager = AuthManager.getInstance()

// 便捷导出
export const {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updateProfile,
  subscribe,
  getAuthState,
  getCurrentUser,
  isAuthenticated,
  isGuest
} = authManager