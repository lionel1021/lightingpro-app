/**
 * 🚀 分层缓存策略 - 优化API响应速度
 */

import { NextResponse } from 'next/server';

// 缓存策略类型
export type CachePolicy = 'static' | 'dynamic' | 'realtime' | 'no-cache';

// 缓存时间配置
export const CACHE_TIMES = {
  static: {
    maxAge: 86400,      // 1天
    sMaxAge: 86400,     // CDN缓存1天
    staleWhileRevalidate: 43200  // 12小时内可以返回过期内容
  },
  dynamic: {
    maxAge: 3600,       // 1小时
    sMaxAge: 7200,      // CDN缓存2小时
    staleWhileRevalidate: 1800   // 30分钟内可以返回过期内容
  },
  realtime: {
    maxAge: 300,        // 5分钟
    sMaxAge: 600,       // CDN缓存10分钟
    staleWhileRevalidate: 60     // 1分钟内可以返回过期内容
  },
  'no-cache': {
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0
  }
} as const;

// 内存缓存实现
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number; }>();
  private maxSize = 1000; // 最大缓存条目数

  set(key: string, data: any, ttlSeconds: number): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // 获取缓存统计
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // TODO: 实现命中率统计
    };
  }
}

// 全局内存缓存实例
const memoryCache = new MemoryCache();

/**
 * 生成缓存键
 */
export function generateCacheKey(prefix: string, params: Record<string, any> = {}): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);

  const paramString = JSON.stringify(sortedParams);
  return `${prefix}:${Buffer.from(paramString).toString('base64url')}`;
}

/**
 * 获取缓存控制头
 */
export function getCacheHeaders(policy: CachePolicy): Record<string, string> {
  const config = CACHE_TIMES[policy];
  
  if (policy === 'no-cache') {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }

  return {
    'Cache-Control': `public, max-age=${config.maxAge}, s-maxage=${config.sMaxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
    'Vary': 'Accept-Encoding',
    'ETag': `"${Date.now()}"` // 简单的ETag实现
  };
}

/**
 * 缓存装饰器函数
 */
export function withCache<T>(
  key: string,
  policy: CachePolicy,
  fetcher: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // 检查内存缓存
      const cached = memoryCache.get(key);
      if (cached) {
        resolve(cached);
        return;
      }

      // 执行数据获取
      const data = await fetcher();
      
      // 存储到内存缓存
      if (policy !== 'no-cache') {
        const ttl = CACHE_TIMES[policy].maxAge;
        memoryCache.set(key, data, ttl);
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 创建带缓存的响应
 */
export function createCachedResponse(
  data: any,
  policy: CachePolicy = 'dynamic',
  status: number = 200
): NextResponse {
  const headers = getCacheHeaders(policy);
  
  return NextResponse.json(data, {
    status,
    headers
  });
}

/**
 * 智能缓存策略选择器
 */
export function getOptimalCachePolicy(endpoint: string, params?: any): CachePolicy {
  // 静态数据 - 长时间缓存
  if (endpoint.includes('/brands') || endpoint.includes('/categories')) {
    return 'static';
  }

  // 产品数据 - 中等缓存
  if (endpoint.includes('/products') && !endpoint.includes('/search')) {
    return 'dynamic';
  }

  // 搜索和推荐 - 短时间缓存
  if (endpoint.includes('/search') || endpoint.includes('/recommendations')) {
    return 'realtime';
  }

  // 用户相关 - 不缓存
  if (endpoint.includes('/user') || endpoint.includes('/auth')) {
    return 'no-cache';
  }

  // 默认策略
  return 'dynamic';
}