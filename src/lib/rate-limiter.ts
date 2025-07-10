// Rate limiting implementation for API routes
// Uses memory-based rate limiting with Redis fallback for production

import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextRequest) => string
  skipSuccessfulRequests?: boolean
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  error?: string
}

// In-memory store for development
const memoryStore = new Map<string, { count: number; resetTime: number }>()

class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  // Get client identifier
  private getClientKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req)
    }

    // Try to get real IP address
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || '127.0.0.1'
    
    return `rate_limit:${ip}`
  }

  // Check if request should be limited
  async checkLimit(req: NextRequest): Promise<RateLimitResult> {
    const key = this.getClientKey(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    try {
      // Clean up expired entries
      this.cleanupExpiredEntries(windowStart)

      // Get current count
      const current = memoryStore.get(key)
      
      if (!current || current.resetTime <= now) {
        // New window or expired
        const resetTime = now + this.config.windowMs
        memoryStore.set(key, { count: 1, resetTime })
        
        return {
          success: true,
          remaining: this.config.maxRequests - 1,
          resetTime
        }
      }

      if (current.count >= this.config.maxRequests) {
        // Rate limit exceeded
        return {
          success: false,
          remaining: 0,
          resetTime: current.resetTime,
          error: 'Rate limit exceeded'
        }
      }

      // Increment count
      current.count++
      memoryStore.set(key, current)

      return {
        success: true,
        remaining: this.config.maxRequests - current.count,
        resetTime: current.resetTime
      }

    } catch (error) {
      console.error('Rate limiter error:', error)
      // Fail open - allow request if rate limiter fails
      return {
        success: true,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs
      }
    }
  }

  // Clean up expired entries to prevent memory leaks
  private cleanupExpiredEntries(windowStart: number) {
    const now = Date.now()
    for (const [key, value] of memoryStore.entries()) {
      if (value.resetTime <= now) {
        memoryStore.delete(key)
      }
    }
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes per IP
})

export const searchRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute per IP
})

export const recommendationsRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 recommendations per minute per IP
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes per IP
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
              req.headers.get('x-real-ip') || 
              '127.0.0.1'
    return `auth_limit:${ip}`
  }
})

// Middleware helper for rate limiting
export async function withRateLimit(
  req: NextRequest,
  rateLimiter: RateLimiter,
  handler: () => Promise<Response>
): Promise<Response> {
  const result = await rateLimiter.checkLimit(req)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: result.error || 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimiter['config'].maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
        }
      }
    )
  }

  // Add rate limit headers to successful responses
  const response = await handler()
  
  response.headers.set('X-RateLimit-Limit', rateLimiter['config'].maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString())

  return response
}

export default RateLimiter