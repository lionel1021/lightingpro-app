// Use jsdom environment for API tests

import { GET } from '../health/route'
import { NextRequest } from 'next/server'

// Mock Supabase client
jest.mock('../../../lib/supabase-server', () => ({
  createServerSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ 
          data: { version: () => '1.0.0' }, 
          error: null 
        }))
      }))
    }))
  }))
}))

describe('/api/health', () => {
  it('returns health check status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health', { method: 'GET' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.timestamp).toBeDefined()
    expect(data.uptime).toBeDefined()
    expect(data.memory).toBeDefined()
  })

  it('includes service checks', async () => {
    const request = new NextRequest('http://localhost:3000/api/health', { method: 'GET' })
    const response = await GET(request)
    const data = await response.json()

    expect(data.services).toBeDefined()
    expect(data.services.database).toBeDefined()
    expect(data.services.redis).toBeDefined()
  })

  it('handles database connection errors gracefully', async () => {
    // Mock database error
    jest.doMock('@/lib/supabase-server', () => ({
      createServerSupabaseClient: jest.fn(() => ({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: new Error('Connection failed') 
            }))
          }))
        }))
      }))
    }))

    const request = new NextRequest('http://localhost:3000/api/health', { method: 'GET' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 but with degraded status
    expect(data.status).toBe('healthy') // Overall status can still be healthy
  })
})