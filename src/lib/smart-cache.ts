// 智能缓存管理系统
interface CacheConfig {
  ttl: number // 存活时间（毫秒）
  maxSize: number // 最大条目数
  strategy: 'lru' | 'fifo' | 'priority' // 缓存策略
}

interface CacheItem<T> {
  data: T
  timestamp: number
  accessCount: number
  priority: number
  size: number
}

class SmartCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private config: CacheConfig
  private totalSize = 0

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5分钟
      maxSize: 100,
      strategy: 'lru',
      ...config
    }
  }

  set(key: string, data: T, priority = 1): void {
    const now = Date.now()
    const size = this.calculateSize(data)
    
    // 检查是否需要清理空间
    this.makeSpace(size)
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      accessCount: 0,
      priority,
      size
    }
    
    // 如果key已存在，先移除旧项
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!
      this.totalSize -= oldItem.size
    }
    
    this.cache.set(key, item)
    this.totalSize += size
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // 检查是否过期
    if (this.isExpired(item)) {
      this.delete(key)
      return null
    }
    
    // 更新访问统计
    item.accessCount++
    item.timestamp = Date.now()
    
    return item.data
  }

  delete(key: string): boolean {
    const item = this.cache.get(key)
    if (item) {
      this.totalSize -= item.size
      return this.cache.delete(key)
    }
    return false
  }

  clear(): void {
    this.cache.clear()
    this.totalSize = 0
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (this.isExpired(item)) {
      this.delete(key)
      return false
    }
    
    return true
  }

  size(): number {
    return this.cache.size
  }

  getStats() {
    const items = Array.from(this.cache.values())
    return {
      totalItems: this.cache.size,
      totalSize: this.totalSize,
      avgAccessCount: items.reduce((sum, item) => sum + item.accessCount, 0) / items.length || 0,
      oldestItem: Math.min(...items.map(item => item.timestamp)),
      newestItem: Math.max(...items.map(item => item.timestamp))
    }
  }

  private isExpired(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > this.config.ttl
  }

  private calculateSize(data: T): number {
    try {
      return JSON.stringify(data).length
    } catch {
      return 1
    }
  }

  private makeSpace(requiredSize: number): void {
    // 首先清理过期项
    this.cleanExpired()
    
    // 如果还需要更多空间，根据策略移除项
    while (this.cache.size >= this.config.maxSize) {
      const keyToRemove = this.selectItemToRemove()
      if (keyToRemove) {
        this.delete(keyToRemove)
      } else {
        break
      }
    }
  }

  private cleanExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.ttl) {
        this.delete(key)
      }
    }
  }

  private selectItemToRemove(): string | null {
    if (this.cache.size === 0) return null
    
    const entries = Array.from(this.cache.entries())
    
    switch (this.config.strategy) {
      case 'lru':
        // 移除最近最少使用的项
        const lruEntry = entries.reduce((oldest, current) => 
          current[1].timestamp < oldest[1].timestamp ? current : oldest
        )
        return lruEntry[0]
        
      case 'fifo':
        // 移除最先进入的项
        const fifoEntry = entries.reduce((oldest, current) => 
          current[1].timestamp < oldest[1].timestamp ? current : oldest
        )
        return fifoEntry[0]
        
      case 'priority':
        // 移除优先级最低的项
        const priorityEntry = entries.reduce((lowest, current) => {
          if (current[1].priority < lowest[1].priority) return current
          if (current[1].priority === lowest[1].priority) {
            return current[1].timestamp < lowest[1].timestamp ? current : lowest
          }
          return lowest
        })
        return priorityEntry[0]
        
      default:
        return entries[0][0]
    }
  }
}

// 预定义的缓存实例
export const productCache = new SmartCache({
  ttl: 10 * 60 * 1000, // 10分钟
  maxSize: 50,
  strategy: 'lru'
})

export const imageCache = new SmartCache({
  ttl: 30 * 60 * 1000, // 30分钟
  maxSize: 100,
  strategy: 'lru'
})

export const apiCache = new SmartCache({
  ttl: 5 * 60 * 1000, // 5分钟
  maxSize: 200,
  strategy: 'priority'
})

export const userPreferenceCache = new SmartCache({
  ttl: 24 * 60 * 60 * 1000, // 24小时
  maxSize: 20,
  strategy: 'priority'
})

// React Hook for caching
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  cache: SmartCache<T> = apiCache,
  priority = 1
) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      // 首先检查缓存
      const cachedData = cache.get(key)
      if (cachedData) {
        setData(cachedData)
        return
      }

      // 缓存未命中，从源获取数据
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        cache.set(key, result, priority)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [key, priority])

  return { data, loading, error }
}

// 缓存装饰器
export function cached<T extends (...args: any[]) => Promise<any>>(
  cache: SmartCache<any>,
  keyGenerator: (...args: Parameters<T>) => string,
  priority = 1
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: Parameters<T>) {
      const key = keyGenerator(...args)
      
      // 检查缓存
      const cached = cache.get(key)
      if (cached) {
        return cached
      }

      // 调用原方法并缓存结果
      const result = await method.apply(this, args)
      cache.set(key, result, priority)
      
      return result
    }

    return descriptor
  }
}

// 缓存管理器
export class CacheManager {
  private caches = new Map<string, SmartCache<any>>()

  registerCache(name: string, cache: SmartCache<any>) {
    this.caches.set(name, cache)
  }

  getCacheStats() {
    const stats: Record<string, any> = {}
    
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats()
    }
    
    return stats
  }

  clearAllCaches() {
    for (const cache of this.caches.values()) {
      cache.clear()
    }
  }

  clearExpired() {
    for (const cache of this.caches.values()) {
      (cache as any).cleanExpired()
    }
  }

  getMemoryUsage() {
    let totalSize = 0
    let totalItems = 0
    
    for (const cache of this.caches.values()) {
      const stats = cache.getStats()
      totalSize += stats.totalSize
      totalItems += stats.totalItems
    }
    
    return { totalSize, totalItems }
  }
}

// 全局缓存管理器实例
export const cacheManager = new CacheManager()

// 注册预定义缓存
cacheManager.registerCache('products', productCache)
cacheManager.registerCache('images', imageCache)
cacheManager.registerCache('api', apiCache)
cacheManager.registerCache('userPreferences', userPreferenceCache)

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.clearExpired()
  }, 5 * 60 * 1000) // 每5分钟清理一次
}