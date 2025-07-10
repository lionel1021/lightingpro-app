'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Activity, Smartphone, Globe, Users } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { AnalyticsReport } from '@/lib/analytics'

interface RealtimeStatsPanelProps {
  report: AnalyticsReport | null
  loading: boolean
  onRefresh: () => void
}

export const RealtimeStatsPanel: React.FC<RealtimeStatsPanelProps> = ({ 
  report, 
  loading, 
  onRefresh 
}) => {
  const mockRealtimeData = {
    activeUsers: 47,
    currentSessions: 23,
    recentEvents: [
      { type: 'page_view', page: '/products', timestamp: '2 seconds ago' },
      { type: 'search', query: 'LED lights', timestamp: '15 seconds ago' },
      { type: 'add_to_cart', product: 'Smart Bulb Pro', timestamp: '32 seconds ago' },
      { type: 'page_view', page: '/recommendations', timestamp: '1 minute ago' },
      { type: 'conversion', value: '$89.99', timestamp: '2 minutes ago' }
    ],
    topPages: [
      { path: '/products', users: 12, percentage: 25.5 },
      { path: '/recommendations', users: 8, percentage: 17.0 },
      { path: '/', users: 7, percentage: 14.9 },
      { path: '/search', users: 6, percentage: 12.8 },
      { path: '/questionnaire', users: 5, percentage: 10.6 }
    ],
    deviceBreakdown: [
      { type: 'Desktop', count: 28, percentage: 59.6 },
      { type: 'Mobile', count: 15, percentage: 31.9 },
      { type: 'Tablet', count: 4, percentage: 8.5 }
    ]
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'page_view': return '👁️'
      case 'search': return '🔍'
      case 'add_to_cart': return '🛒'
      case 'conversion': return '💰'
      default: return '📋'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'conversion': return 'bg-green-100 text-green-800'
      case 'add_to_cart': return 'bg-blue-100 text-blue-800'
      case 'search': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Real-time Analytics</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active Users"
          value={mockRealtimeData.activeUsers}
          icon={<Activity className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="Current Sessions"
          value={mockRealtimeData.currentSessions}
          icon={<Users className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="Events/min"
          value="12.3"
          icon={<Globe className="w-6 h-6" />}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Stream */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {mockRealtimeData.recentEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-xl">{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getEventColor(event.type)}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-600">{event.timestamp}</span>
                  </div>
                  <p className="text-sm mt-1">
                    {event.page && `Page: ${event.page}`}
                    {event.query && `Query: "${event.query}"`}
                    {event.product && `Product: ${event.product}`}
                    {event.value && `Value: ${event.value}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages & Device Breakdown */}
        <div className="space-y-6">
          {/* Top Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Top Pages (Live)</h3>
            <div className="space-y-3">
              {mockRealtimeData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{page.path}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold">{page.users}</div>
                    <div className="text-xs text-gray-500">{page.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Device Types</h3>
            <div className="space-y-3">
              {mockRealtimeData.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{device.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{device.count}</div>
                    <div className="text-xs text-gray-500">{device.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}