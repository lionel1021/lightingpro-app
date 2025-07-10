'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, Download, AlertCircle } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { OverviewPanel } from './OverviewPanel'
import { RealtimeStatsPanel } from './RealtimeStatsPanel'
import { FunnelAnalysisPanel } from './FunnelAnalysisPanel'
import { useAnalytics } from '@/hooks/useAnalytics'

export const AnalyticsDashboard: React.FC = () => {
  const {
    report,
    loading,
    error,
    lastUpdated,
    refreshAnalytics,
    isStale
  } = useAnalytics({
    dateRange: '7d',
    metricType: 'all',
    refreshInterval: 300000 // 5 minutes
  })

  const handleExportData = () => {
    if (!report) return
    
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refreshAnalytics}>Try Again</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Real-time insights and performance metrics
            {lastUpdated && (
              <span className={`ml-2 ${isStale ? 'text-orange-600' : 'text-green-600'}`}>
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshAnalytics}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportData}
            disabled={!report}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewPanel report={report} loading={loading} />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealtimeStatsPanel 
            report={report} 
            loading={loading} 
            onRefresh={refreshAnalytics}
          />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <FunnelAnalysisPanel report={report} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}