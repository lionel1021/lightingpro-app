/**
 * 🚀 Redis缓存集成 - 高性能分布式缓存
 */

import { Redis } from '@upstash/redis'
import { LightingProduct } from './types'

// Redis客户端初始化
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 缓存键命名空间
export const CacheKeys = {
  PRODUCTS: 'products',
  RECOMMENDATIONS: 'recommendations',
  USER_PREFERENCES: 'user_preferences',
  SEARCH_RESULTS: 'search_results',
  ANALYTICS: 'analytics',
} as const

// 缓存配置
export const CacheConfig = {
  // TTL配置（秒）
  TTL: {
    PRODUCTS: 3600, // 1小时
    RECOMMENDATIONS: 1800, // 30分钟
    SEARCH_RESULTS: 900, // 15分钟
    USER_PREFERENCES: 86400, // 24小时
    ANALYTICS: 300, // 5分钟
  },
  
  // 压缩配置
  COMPRESSION: {
    ENABLED: true,
    THRESHOLD: 1024, // 1KB以上数据压缩
  }
} as const

/**
 * 🎯 产品缓存管理
 */
export class ProductCache {
  
  /**
   * 缓存单个产品
   */
  static async setProduct(productId: string, product: LightingProduct): Promise<void> {
    const key = `${CacheKeys.PRODUCTS}:${productId}`
    await redis.setex(key, CacheConfig.TTL.PRODUCTS, JSON.stringify(product))
  }
  
  /**
   * 获取单个产品
   */
  static async getProduct(productId: string): Promise<LightingProduct | null> {
    const key = `${CacheKeys.PRODUCTS}:${productId}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached as string) : null
  }
  
  /**
   * 批量缓存产品
   */
  static async setProducts(products: LightingProduct[]): Promise<void> {
    const pipeline = redis.pipeline()
    
    products.forEach(product => {
      const key = `${CacheKeys.PRODUCTS}:${product.id}`
      pipeline.setex(key, CacheConfig.TTL.PRODUCTS, JSON.stringify(product))
    })
    
    await pipeline.exec()
  }
  
  /**
   * 批量获取产品
   */
  static async getProducts(productIds: string[]): Promise<(LightingProduct | null)[]> {
    const keys = productIds.map(id => `${CacheKeys.PRODUCTS}:${id}`)
    const results = await redis.mget(...keys)
    
    return results.map(result => 
      result ? JSON.parse(result as string) : null
    )
  }
  
  /**
   * 删除产品缓存
   */
  static async deleteProduct(productId: string): Promise<void> {
    const key = `${CacheKeys.PRODUCTS}:${productId}`
    await redis.del(key)
  }
}

/**
 * 🔍 搜索结果缓存
 */
export class SearchCache {
  
  /**
   * 生成搜索缓存键
   */
  private static generateSearchKey(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key]
        return obj
      }, {} as Record<string, any>)
    
    const queryString = new URLSearchParams(sorted).toString()
    return `${CacheKeys.SEARCH_RESULTS}:${Buffer.from(queryString).toString('base64')}`
  }
  
  /**
   * 缓存搜索结果
   */
  static async setSearchResults(
    params: Record<string, any>,
    results: { products: LightingProduct[]; total: number; facets: any }
  ): Promise<void> {
    const key = this.generateSearchKey(params)
    await redis.setex(key, CacheConfig.TTL.SEARCH_RESULTS, JSON.stringify(results))
  }
  
  /**
   * 获取搜索结果
   */
  static async getSearchResults(
    params: Record<string, any>
  ): Promise<{ products: LightingProduct[]; total: number; facets: any } | null> {
    const key = this.generateSearchKey(params)
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached as string) : null
  }
}

/**
 * 🎯 推荐缓存
 */
export class RecommendationCache {
  
  /**
   * 缓存用户推荐
   */
  static async setUserRecommendations(
    userId: string,
    recommendations: LightingProduct[]
  ): Promise<void> {
    const key = `${CacheKeys.RECOMMENDATIONS}:user:${userId}`
    await redis.setex(key, CacheConfig.TTL.RECOMMENDATIONS, JSON.stringify(recommendations))
  }
  
  /**
   * 获取用户推荐
   */
  static async getUserRecommendations(userId: string): Promise<LightingProduct[] | null> {
    const key = `${CacheKeys.RECOMMENDATIONS}:user:${userId}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached as string) : null
  }
  
  /**
   * 缓存会话推荐
   */
  static async setSessionRecommendations(
    sessionId: string,
    recommendations: LightingProduct[]
  ): Promise<void> {
    const key = `${CacheKeys.RECOMMENDATIONS}:session:${sessionId}`
    await redis.setex(key, CacheConfig.TTL.RECOMMENDATIONS, JSON.stringify(recommendations))
  }
  
  /**
   * 获取会话推荐
   */
  static async getSessionRecommendations(sessionId: string): Promise<LightingProduct[] | null> {
    const key = `${CacheKeys.RECOMMENDATIONS}:session:${sessionId}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached as string) : null
  }
}

/**
 * 👤 用户偏好缓存
 */
export class UserPreferenceCache {
  
  /**
   * 缓存用户偏好
   */
  static async setUserPreferences(
    userId: string,
    preferences: Record<string, any>
  ): Promise<void> {
    const key = `${CacheKeys.USER_PREFERENCES}:${userId}`
    await redis.setex(key, CacheConfig.TTL.USER_PREFERENCES, JSON.stringify(preferences))
  }
  
  /**
   * 获取用户偏好
   */
  static async getUserPreferences(userId: string): Promise<Record<string, any> | null> {
    const key = `${CacheKeys.USER_PREFERENCES}:${userId}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached as string) : null
  }
}

/**
 * 📊 分析数据缓存
 */
export class AnalyticsCache {
  
  /**
   * 缓存分析数据
   */
  static async setAnalytics(
    key: string,
    data: Record<string, any>
  ): Promise<void> {
    const cacheKey = `${CacheKeys.ANALYTICS}:${key}`
    await redis.setex(cacheKey, CacheConfig.TTL.ANALYTICS, JSON.stringify(data))
  }
  
  /**
   * 获取分析数据
   */
  static async getAnalytics(key: string): Promise<Record<string, any> | null> {
    const cacheKey = `${CacheKeys.ANALYTICS}:${key}`
    const cached = await redis.get(cacheKey)
    return cached ? JSON.parse(cached as string) : null
  }
}

/**
 * 🔧 缓存工具函数
 */
export class CacheUtils {
  
  /**
   * 清除所有缓存
   */
  static async clearAll(): Promise<void> {
    const keys = await redis.keys('*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
  
  /**
   * 清除特定命名空间的缓存
   */
  static async clearNamespace(namespace: string): Promise<void> {
    const keys = await redis.keys(`${namespace}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
  
  /**
   * 获取缓存统计信息
   */
  static async getCacheStats(): Promise<{
    totalKeys: number
    memoryUsage: string
    hitRate: number
  }> {
    const info = await redis.info('memory')
    const keys = await redis.keys('*')
    
    return {
      totalKeys: keys.length,
      memoryUsage: 'N/A', // Redis云服务通常不提供详细内存信息
      hitRate: 0 // 需要应用层统计
    }
  }
  
  /**
   * 检查缓存健康状态
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await redis.ping()
      return true
    } catch (error) {
      return false
    }
  }
}

/**
 * 🎯 高级缓存装饰器
 */
export function withCache<T>(
  cacheKey: string,
  ttl: number = 3600
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = `${cacheKey}:${JSON.stringify(args)}`
      
      // 尝试从缓存获取
      const cached = await redis.get(key)
      if (cached) {
        return JSON.parse(cached as string)
      }
      
      // 执行原方法
      const result = await method.apply(this, args)
      
      // 缓存结果
      await redis.setex(key, ttl, JSON.stringify(result))
      
      return result
    }
  }
}

// 导出Redis客户端
export { redis }