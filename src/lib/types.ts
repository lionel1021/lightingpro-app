/**
 * 🔒 强化类型安全 - SuperClaude + MCP AI协作优化
 * 
 * 功能:
 * - 增强的TypeScript类型定义
 * - 数据库模式同步
 * - 严格的类型检查
 * - 运行时类型验证
 */

// ================================
// 基础类型定义
// ================================

export type UUID = string
export type Timestamp = string
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }

// 问卷数据类型
export interface QuestionnaireData {
  room_type: string
  room_size: string
  style_preference: string
  budget_min: number
  budget_max: number
  smart_features?: boolean
  lighting_needs?: string[]
  color_temperature?: 'warm' | 'neutral' | 'cool'
  dimming_preference?: boolean
  installation_type?: 'ceiling' | 'wall' | 'floor' | 'table'
}

// 数据库产品类型
export interface LightingProduct {
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
  // 扩展属性用于推荐
  image?: string // 兼容属性，等同于 image_urls[0]
  reviews?: number // 兼容属性，等同于 review_count
  matchScore?: number // 推荐匹配分数
  affiliateLinks?: Record<string, unknown> // 兼容属性，等同于 affiliate_links
}

// ================================
// 产品相关类型
// ================================

export interface ProductImage {
  url: string
  alt: string
  is_primary?: boolean
  width?: number
  height?: number
  size?: number // bytes
  format?: 'jpg' | 'png' | 'webp' | 'avif'
}

export interface ProductDimensions {
  height?: number
  width?: number
  depth?: number
  weight?: number // grams
  unit?: 'cm' | 'inch'
}

export interface ProductSpecifications {
  // 照明规格
  wattage?: number
  lumens?: number
  color_temperature?: string // e.g., "3000K", "Warm White"
  beam_angle?: number
  dimmable?: boolean
  
  // 智能功能
  smart_compatible?: boolean
  wifi_enabled?: boolean
  bluetooth_enabled?: boolean
  voice_control?: string[] // ["Alexa", "Google Assistant"]
  
  // 物理规格
  dimensions?: ProductDimensions
  material?: string
  finish?: string
  ip_rating?: string // e.g., "IP65"
  
  // 认证和保修
  warranty?: string
  certifications?: string[] // ["UL", "CE", "Energy Star"]
  energy_rating?: 'A++' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'E'
  
  // 安装
  installation_difficulty?: 'easy' | 'medium' | 'hard' | 'professional'
  tools_required?: string[]
  
  // 其他
  lifespan_hours?: number
  replacement_parts_available?: boolean
}

export interface AffiliateLink {
  id: UUID
  provider: 'amazon' | 'homedepot' | 'wayfair' | 'lowes' | 'walmart' | 'other'
  url: string
  price?: number
  original_price?: number // For discount calculation
  currency?: string
  commission_rate?: number
  availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'preorder'
  delivery_time?: string
  shipping_cost?: number
  last_updated: Timestamp
  is_active: boolean
}

export interface EnhancedLightingProduct {
  // 基础信息
  id: UUID
  name: string
  brand_id: UUID
  brand_name?: string // Populated via join
  category_id: UUID
  category_name?: string // Populated via join
  subcategory?: string
  
  // 描述和营销
  description: string
  short_description?: string
  highlights?: string[] // Key selling points
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  
  // 定价
  price: number
  original_price?: number
  currency: string
  price_history?: Array<{ price: number; date: Timestamp }>
  
  // 媒体
  images: ProductImage[]
  videos?: Array<{ url: string; title: string; thumbnail?: string }>
  documents?: Array<{ url: string; title: string; type: 'manual' | 'spec_sheet' | 'installation_guide' }>
  
  // 评价和反馈
  rating: number
  review_count: number
  reviews_summary?: {
    five_star: number
    four_star: number
    three_star: number
    two_star: number
    one_star: number
  }
  
  // 联盟营销
  affiliate_links: AffiliateLink[]
  default_affiliate?: UUID // Primary affiliate link
  
  // 详细规格
  specifications: ProductSpecifications
  
  // 分类和标签
  room_suitability: string[] // ['living_room', 'bedroom', 'kitchen']
  style_tags: string[] // ['modern', 'minimalist', 'industrial']
  color_options: string[] // ['white', 'black', 'bronze']
  theme_tags?: string[] // ['christmas', 'outdoor', 'security']
  
  // 库存和可用性
  stock_status: 'in_stock' | 'out_of_stock' | 'limited' | 'discontinued' | 'coming_soon'
  stock_quantity?: number
  availability_date?: Timestamp
  backorder_allowed?: boolean
  
  // 安装和兼容性
  installation_type: 'hardwired' | 'plug_in' | 'battery' | 'solar' | 'candle' | 'other'
  mounting_type?: string[] // ['ceiling', 'wall', 'table', 'floor']
  compatibility_requirements?: string[]
  
  // 分析和优化
  view_count: number
  favorite_count: number
  purchase_count: number
  click_through_rate?: number
  conversion_rate?: number
  return_rate?: number
  
  // SEO和搜索
  search_keywords?: string[]
  search_boost?: number // For search ranking
  featured?: boolean
  promoted?: boolean
  
  // 时间戳
  created_at: Timestamp
  updated_at: Timestamp
  published_at?: Timestamp
  discontinued_at?: Timestamp
}

// ================================
// 用户相关类型
// ================================

export interface UserPreferences {
  // 房间偏好
  room_types: string[]
  room_sizes: string[] // ['small', 'medium', 'large']
  
  // 风格偏好
  style_preferences: string[]
  color_preferences: string[]
  theme_preferences?: string[]
  
  // 预算设置
  budget_min: number
  budget_max: number
  currency: string
  budget_flexibility?: 'strict' | 'flexible' | 'very_flexible'
  
  // 品牌偏好
  preferred_brands: UUID[]
  avoided_brands?: UUID[]
  brand_loyalty?: 'high' | 'medium' | 'low'
  
  // 技术偏好
  smart_home_preference: boolean
  energy_efficiency_priority: boolean
  durability_priority?: boolean
  design_over_function?: boolean
  
  // 购买偏好
  installation_preference?: 'diy' | 'professional' | 'no_preference'
  warranty_importance?: 'high' | 'medium' | 'low'
  brand_reputation_importance?: 'high' | 'medium' | 'low'
  
  // 通知设置
  notification_preferences: {
    email: boolean
    push: boolean
    sms?: boolean
    recommendations: boolean
    price_alerts: boolean
    stock_alerts: boolean
    new_products: boolean
  }
  
  // 推荐算法偏好
  algorithm_preference: 'DEFAULT' | 'HIGH_CONVERSION' | 'EXPLORATION' | 'DIVERSITY' | 'BUDGET_FOCUSED'
  recommendation_frequency?: 'daily' | 'weekly' | 'monthly' | 'never'
}

export interface EnhancedUserProfile {
  id: UUID
  user_id: UUID // Auth user ID
  email: string
  
  // 个人信息
  full_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  
  // 地址信息
  addresses?: Array<{
    id: UUID
    type: 'home' | 'work' | 'other'
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    country: string
    postal_code: string
    is_default: boolean
  }>
  
  // 偏好设置
  preferences: UserPreferences
  
  // 账户设置
  account_status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  email_verified: boolean
  phone_verified?: boolean
  subscription_tier?: 'free' | 'premium' | 'pro'
  
  // 活动统计
  total_purchases?: number
  total_spent?: number
  favorite_products_count?: number
  reviews_written?: number
  last_login?: Timestamp
  
  // 隐私设置
  privacy_settings?: {
    profile_visibility: 'public' | 'private'
    allow_marketing: boolean
    allow_analytics: boolean
    allow_personalization: boolean
  }
  
  // 时间戳
  created_at: Timestamp
  updated_at: Timestamp
  onboarding_completed_at?: Timestamp
}

export interface UserFavorite {
  id: UUID
  user_id: UUID
  product_id: UUID
  
  // 收藏元数据
  notes?: string
  tags?: string[]
  priority?: 'high' | 'medium' | 'low'
  
  // 购买意向
  purchase_intent?: 'immediate' | 'planned' | 'wishlist'
  target_price?: number
  
  // 时间戳
  created_at: Timestamp
  updated_at: Timestamp
  
  // 关联数据 (populated via joins)
  product?: EnhancedLightingProduct
}

// ================================
// 分析和行为类型
// ================================

export type UserEventType = 
  | 'page_view'
  | 'product_view'
  | 'product_like'
  | 'product_unlike'
  | 'search'
  | 'filter_apply'
  | 'recommendation_click'
  | 'affiliate_click'
  | 'purchase_intent'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_start'
  | 'checkout_complete'
  | 'questionnaire_start'
  | 'questionnaire_complete'
  | 'review_submit'
  | 'comparison_add'
  | 'comparison_remove'
  | 'share_product'
  | 'contact_seller'

export interface UserBehaviorEvent {
  id: UUID
  user_id?: UUID // null for anonymous users
  session_id: UUID
  
  // 事件信息
  event_type: UserEventType
  event_data: JSONValue
  
  // 上下文信息
  product_id?: UUID
  category_id?: UUID
  brand_id?: UUID
  page_url?: string
  referrer_url?: string
  
  // 设备和位置信息
  user_agent?: string
  device_type?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  os?: string
  screen_resolution?: string
  country_code?: string
  region?: string
  city?: string
  timezone?: string
  
  // 实验和个性化
  ab_test_groups?: Record<string, string>
  recommendation_context?: UUID // Link to recommendation log
  
  // 时间戳
  created_at: Timestamp
}

export interface RecommendationLog {
  id: UUID
  user_id?: UUID
  session_id: UUID
  
  // 算法信息
  algorithm_used: string
  algorithm_version: string
  model_version?: string
  
  // 输入参数
  input_preferences?: JSONValue
  algorithm_parameters?: JSONValue
  context_data?: JSONValue
  
  // 推荐结果
  recommended_products: UUID[]
  total_score?: number
  confidence_score?: number
  diversity_score?: number
  
  // 个性化信息
  personalization_applied: boolean
  user_segment?: string
  
  // 用户交互反馈
  user_clicked_products: UUID[]
  user_liked_products: UUID[]
  user_purchased_products: UUID[]
  user_ignored_products?: UUID[]
  
  // 性能指标
  response_time_ms?: number
  click_through_rate?: number
  conversion_rate?: number
  user_satisfaction_score?: number // 1-5
  
  // 业务指标
  revenue_generated?: number
  commission_earned?: number
  
  // 时间戳
  created_at: Timestamp
  updated_at: Timestamp
  expires_at?: Timestamp // When recommendations become stale
}

// ================================
// API响应类型
// ================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  timestamp?: Timestamp
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchResponse {
  products: EnhancedLightingProduct[]
  filters: {
    categories: Array<{ id: UUID; name: string; count: number }>
    brands: Array<{ id: UUID; name: string; count: number }>
    price_range: { min: number; max: number }
    styles: Array<{ name: string; count: number }>
    rooms: Array<{ name: string; count: number }>
  }
  suggestions?: string[]
  total_count: number
  search_time_ms: number
}

export interface RecommendationResponse {
  products: EnhancedLightingProduct[]
  algorithm_info: {
    algorithm_used: string
    confidence: number
    explanation: string
  }
  personalization_applied: boolean
  total_score: number
  recommendation_id: UUID
}

// ================================
// 表单和验证类型
// ================================

export interface QuestionnaireAnswers {
  roomType: string
  roomSize: string
  style: string
  budget: string
  currentLighting: string
  special_requirements?: string
  timeline?: string
  installation_preference?: string
}

export interface SearchFilters {
  query?: string
  category_ids?: UUID[]
  brand_ids?: UUID[]
  min_price?: number
  max_price?: number
  min_rating?: number
  room_types?: string[]
  style_tags?: string[]
  color_options?: string[]
  installation_types?: string[]
  smart_compatible?: boolean
  energy_ratings?: string[]
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
  limit?: number
  offset?: number
}

// ================================
// 错误类型
// ================================

export interface AppError {
  code: string
  message: string
  details?: any
  stack?: string
  timestamp: Timestamp
  user_id?: UUID
  session_id?: UUID
  request_id?: UUID
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface ErrorReport {
  id: UUID
  error: AppError
  severity: ErrorSeverity
  context: JSONValue
  resolved: boolean
  resolution_notes?: string
  created_at: Timestamp
  resolved_at?: Timestamp
}

// ================================
// 运行时类型验证辅助函数
// ================================

export function isUUID(value: any): value is UUID {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function isTimestamp(value: any): value is Timestamp {
  return typeof value === 'string' && !isNaN(Date.parse(value))
}

export function validateProductImage(image: any): image is ProductImage {
  return (
    typeof image === 'object' &&
    image !== null &&
    typeof image.url === 'string' &&
    typeof image.alt === 'string' &&
    image.url.length > 0 &&
    image.alt.length > 0
  )
}

export function validateUserPreferences(prefs: any): prefs is UserPreferences {
  return (
    typeof prefs === 'object' &&
    prefs !== null &&
    Array.isArray(prefs.room_types) &&
    Array.isArray(prefs.style_preferences) &&
    typeof prefs.budget_min === 'number' &&
    typeof prefs.budget_max === 'number' &&
    prefs.budget_min >= 0 &&
    prefs.budget_max > prefs.budget_min
  )
}

// ================================
// 类型守卫函数
// ================================

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return typeof obj === 'object' && obj !== null && typeof obj.success === 'boolean'
}

export function isEnhancedLightingProduct(obj: any): obj is EnhancedLightingProduct {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    isUUID(obj.id) &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    Array.isArray(obj.images)
  )
}

// ================================
// 默认值和常量
// ================================

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  room_types: [],
  room_sizes: ['medium'],
  style_preferences: [],
  color_preferences: [],
  budget_min: 50,
  budget_max: 500,
  currency: 'USD',
  preferred_brands: [],
  smart_home_preference: false,
  energy_efficiency_priority: true,
  notification_preferences: {
    email: true,
    push: false,
    recommendations: true,
    price_alerts: false,
    stock_alerts: false,
    new_products: false
  },
  algorithm_preference: 'DEFAULT'
}

export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const
export const ENERGY_RATINGS = ['A++', 'A+', 'A', 'B', 'C', 'D', 'E'] as const