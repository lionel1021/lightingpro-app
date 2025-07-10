'use client'

import React from 'react'
import { Users, Eye, Clock, Target } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { BaseChart } from '@/components/charts/BaseChart'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { AnalyticsReport } from '@/lib/analytics'

interface OverviewPanelProps {
  report: AnalyticsReport | null
  loading: boolean
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ report, loading }) => {
  const getMetricChangeType = (change: number) => {
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return 'neutral'
  }

  const mockTimelineData = [
    { date: '2024-01-01', users: 120, pageViews: 450, sessions: 89 },
    { date: '2024-01-02', users: 135, pageViews: 520, sessions: 102 },
    { date: '2024-01-03', users: 149, pageViews: 580, sessions: 95 },
    { date: '2024-01-04', users: 162, pageViews: 630, sessions: 118 },
    { date: '2024-01-05', users: 158, pageViews: 595, sessions: 124 },
    { date: '2024-01-06', users: 171, pageViews: 670, sessions: 131 },
    { date: '2024-01-07', users: 183, pageViews: 720, sessions: 145 }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={report?.overview.totalUsers || 1234}
          change={report?.overview.userGrowth || 12.5}
          changeType={getMetricChangeType(report?.overview.userGrowth || 12.5)}
          icon={<Users className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="Page Views"
          value={report?.overview.pageViews || 4567}
          change={report?.overview.pageViewGrowth || 8.3}
          changeType={getMetricChangeType(report?.overview.pageViewGrowth || 8.3)}
          icon={<Eye className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="Avg. Session Duration"
          value={report?.overview.avgSessionDuration || "4m 32s"}
          change={report?.overview.sessionDurationChange || -2.1}
          changeType={getMetricChangeType(report?.overview.sessionDurationChange || -2.1)}
          icon={<Clock className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${report?.overview.conversionRate || 3.4}%`}
          change={report?.overview.conversionChange || 15.7}
          changeType={getMetricChangeType(report?.overview.conversionChange || 15.7)}
          icon={<Target className="w-6 h-6" />}
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          <BaseChart loading={loading}>
            <LineChart data={mockTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'users' ? 'Users' : name]}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#0088FE" 
                strokeWidth={2}
                dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </BaseChart>
        </div>

        {/* Page Views Area Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Page Views Trend</h3>
          <BaseChart loading={loading}>
            <AreaChart data={mockTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [value, 'Page Views']}
              />
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#00C49F" 
                fill="#00C49F" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </BaseChart>
        </div>
      </div>
    </div>
  )
}