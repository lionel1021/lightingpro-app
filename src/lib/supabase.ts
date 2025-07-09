import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig, isDemoMode, showDemoWarning } from './demo-mode'

const config = getSupabaseConfig()
const supabaseUrl = config.url
const supabaseAnonKey = config.anonKey

// 在演示模式下显示警告
if (isDemoMode()) {
  showDemoWarning()
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for SSR
export const createSupabaseBrowserClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      questionnaire_responses: {
        Row: {
          id: string
          user_id: string
          room_type: string
          room_size: string
          style_preference: string
          budget_range: string
          current_lighting: string | null
          special_requirements: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          room_type: string
          room_size: string
          style_preference: string
          budget_range: string
          current_lighting?: string | null
          special_requirements?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          room_type?: string
          room_size?: string
          style_preference?: string
          budget_range?: string
          current_lighting?: string | null
          special_requirements?: string | null
          created_at?: string
        }
      }
      lighting_products: {
        Row: {
          id: string
          name: string
          brand: string
          category: string
          price: number
          description: string | null
          specifications: Record<string, unknown>
          image_urls: string[]
          affiliate_links: Record<string, unknown>
          commission_rate: number
          rating: number
          review_count: number
          features?: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          category: string
          price: number
          description?: string | null
          specifications?: Record<string, unknown>
          image_urls?: string[]
          affiliate_links?: Record<string, unknown>
          commission_rate?: number
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          category?: string
          price?: number
          description?: string | null
          specifications?: Record<string, unknown>
          image_urls?: string[]
          affiliate_links?: Record<string, unknown>
          commission_rate?: number
          rating?: number
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type UserProfile = Tables<'user_profiles'>
export type QuestionnaireResponse = Tables<'questionnaire_responses'>
export type LightingProduct = Tables<'lighting_products'>