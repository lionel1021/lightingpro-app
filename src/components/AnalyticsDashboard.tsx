'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  FunnelChart,
  Funnel
} from 'recharts'
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  MousePointer,
  Smartphone,
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { userAnalytics, AnalyticsReport, UserEvent } from '@/lib/analytics'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  loading?: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  loading = false 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="w-3 h-3" />
      case 'negative': return <TrendingDown className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {change !== undefined && (
                  <span className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
                    {getChangeIcon()}
                    {Math.abs(change)}%
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RealtimeStatsProps {
  onRefresh: () => void
  loading: boolean
}

const RealtimeStats: React.FC<RealtimeStatsProps> = ({ onRefresh, loading }) => {
  const [stats, setStats] = useState<any>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await userAnalytics.getRealtimeStats()
        setStats(data)
      } catch (error) {
        console.error('加载实时统计失败:', error)
      }
    }

    loadStats()

    if (autoRefresh) {
      const interval = setInterval(loadStats, 30000) // 30秒刷新
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          实时统计
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 text-green-600' : ''}
          >
            {autoRefresh ? '自动刷新开启' : '自动刷新关闭'}
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="当前活跃用户"
          value={stats?.activeUsers || 0}
          icon={<Users className="w-6 h-6" />}
          loading={!stats}
        />
        <MetricCard
          title="过去1小时访问量"
          value={stats?.pageViewsLastHour || 0}
          icon={<Eye className="w-6 h-6" />}
          loading={!stats}
        />
        <MetricCard
          title="热门页面"
          value={stats?.topPages?.[0]?.path || '暂无数据'}
          icon={<MousePointer className="w-6 h-6" />}
          loading={!stats}
        />
        <MetricCard
          title="实时转化率"
          value="2.4%"
          change={5.2}
          changeType="positive"
          icon={<Target className="w-6 h-6" />}
          loading={!stats}
        />
      </div>

      {/* 最近事件流 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近用户活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats?.recentEvents?.map((event: UserEvent, index: number) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded text-sm">
                <Badge variant="outline" className="text-xs">
                  {event.eventType}
                </Badge>
                <span className="flex-1">{event.eventName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                暂无最近活动
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface OverviewDashboardProps {
  report: AnalyticsReport | null
  loading: boolean
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ report, loading }) => {
  if (!report && !loading) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">无法加载分析数据</p>
      </div>
    )
  }

  const chartData = report?.topPages?.map((page, index) => ({
    name: page.path.length > 20 ? `${page.path.substring(0, 20)}...` : page.path,
    views: page.views,
    uniqueViews: page.uniqueViews,
    bounceRate: page.bounceRate * 100,
    avgDuration: page.avgDuration
  })) || []

  return (
    <div className="space-y-6">
      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="总用户数"
          value={report?.metrics.totalUsers || 0}
          change={12.5}
          changeType="positive"
          icon={<Users className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="页面浏览量"
          value={report?.metrics.pageViews || 0}
          change={8.3}
          changeType="positive"
          icon={<Eye className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="平均会话时长"
          value={`${Math.round((report?.metrics.avgSessionDuration || 0) / 60)}分钟`}
          change={-2.1}
          changeType="negative"
          icon={<Clock className="w-6 h-6" />}
          loading={loading}
        />
        <MetricCard
          title="转化率"
          value={`${((report?.metrics.conversionRate || 0) * 100).toFixed(1)}%`}
          change={15.7}
          changeType="positive"
          icon={<Target className="w-6 h-6" />}
          loading={loading}
        />
      </div>

      {/* 页面分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>热门页面访问量</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="uniqueViews" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>跳出率分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '跳出率']} />
                <Line type="monotone" dataKey="bounceRate" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 用户流分析 */}
      <Card>
        <CardHeader>
          <CardTitle>用户流向分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">来源页面</th>
                  <th className="text-left p-2">目标页面</th>
                  <th className="text-left p-2">用户数</th>
                  <th className="text-left p-2">转化率</th>
                </tr>
              </thead>
              <tbody>
                {report?.userFlow?.slice(0, 10).map((flow, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{flow.fromPage}</td>
                    <td className="p-2">{flow.toPage}</td>
                    <td className="p-2">{flow.count}</td>
                    <td className="p-2">{(flow.conversionRate * 100).toFixed(1)}%</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      暂无用户流数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface FunnelAnalysisProps {
  report: AnalyticsReport | null
  loading: boolean
}

const FunnelAnalysis: React.FC<FunnelAnalysisProps> = ({ report, loading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">转化漏斗分析</h3>
        <Button variant="outline" size="sm">
          <Target className="w-4 h-4 mr-2" />
          创建新漏斗
        </Button>
      </div>

      {report?.funnelAnalysis?.length ? (
        report.funnelAnalysis.map((analysis, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{analysis.funnel.name}</CardTitle>
              <p className="text-sm text-gray-600">{analysis.funnel.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">漏斗步骤</h4>
                  <div className="space-y-2">
                    {analysis.results.map((result, stepIndex) => {
                      const step = analysis.funnel.steps[stepIndex]
                      return (
                        <div key={result.stepId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{step.name}</span>
                            <p className="text-sm text-gray-600">{result.users}位用户</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={result.conversionRate > 0.5 ? "default" : "destructive"}
                            >
                              {(result.conversionRate * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">可视化漏斗</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <Tooltip />
                      <Funnel
                        dataKey="users"
                        data={analysis.results.map((result, i) => ({
                          name: analysis.funnel.steps[i].name,
                          users: result.users,
                          fill: COLORS[i % COLORS.length]
                        }))}
                      />
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium mb-2">还没有转化漏斗</h4>
            <p className="text-gray-600 mb-4">创建转化漏斗来分析用户行为和优化转化率</p>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              创建第一个漏斗
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const AnalyticsDashboard: React.FC = () => {
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    loadReport()
  }, [dateRange])

  const loadReport = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch (dateRange) {
        case '1d':
          startDate.setDate(endDate.getDate() - 1)
          break
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      const data = await userAnalytics.generateReport(startDate, endDate, {
        includeFunnels: true,
        includeUserFlow: true
      })
      
      setReport(data)
    } catch (error) {
      console.error('加载分析报告失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    if (!report) return
    
    const data = JSON.stringify(report, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 头部控制 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">数据分析中心</h1>
          <p className="text-gray-600">用户行为分析和转化跟踪</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">最近1天</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport} disabled={!report}>
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
          <Button variant="outline" onClick={loadReport} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="realtime">实时监控</TabsTrigger>
          <TabsTrigger value="overview">概览分析</TabsTrigger>
          <TabsTrigger value="funnels">转化漏斗</TabsTrigger>
          <TabsTrigger value="segments">用户分群</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <RealtimeStats onRefresh={loadReport} loading={loading} />
        </TabsContent>

        <TabsContent value="overview">
          <OverviewDashboard report={report} loading={loading} />
        </TabsContent>

        <TabsContent value="funnels">
          <FunnelAnalysis report={report} loading={loading} />
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium mb-2">用户分群功能</h4>
              <p className="text-gray-600">即将推出，敬请期待</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}