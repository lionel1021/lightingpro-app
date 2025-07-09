'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { ABExperiment, ABVariant, abTestingEngine } from '@/lib/ab-testing'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

interface ExperimentCardProps {
  experiment: ABExperiment
  onStart: (id: string) => void
  onPause: (id: string) => void
  onStop: (id: string) => void
  onView: (id: string) => void
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onStart,
  onPause,
  onStop,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <Square className="w-4 h-4" />
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{experiment.name}</CardTitle>
          <Badge className={`${getStatusColor(experiment.status)} text-white`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(experiment.status)}
              {experiment.status.toUpperCase()}
            </span>
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{experiment.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">主要指标:</span>
              <p className="text-gray-600">{experiment.primaryMetric}</p>
            </div>
            <div>
              <span className="font-medium">流量分配:</span>
              <p className="text-gray-600">{experiment.trafficAllocation}%</p>
            </div>
          </div>

          {/* 变体概览 */}
          <div>
            <span className="font-medium text-sm">变体配置:</span>
            <div className="mt-2 space-y-1">
              {experiment.variants.map((variant, index) => (
                <div key={variant.id} className="flex items-center justify-between text-sm">
                  <span className={index === 0 ? 'font-medium' : ''}>
                    {variant.name} {index === 0 && '(Control)'}
                  </span>
                  <span className="text-gray-600">{variant.trafficWeight}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            {experiment.status === 'draft' && (
              <Button 
                size="sm" 
                onClick={() => onStart(experiment.id)}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-1" />
                开始测试
              </Button>
            )}
            
            {experiment.status === 'running' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onPause(experiment.id)}
                  className="flex-1"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  暂停
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onStop(experiment.id)}
                  className="flex-1"
                >
                  <Square className="w-4 h-4 mr-1" />
                  停止
                </Button>
              </>
            )}
            
            {experiment.status === 'paused' && (
              <Button 
                size="sm" 
                onClick={() => onStart(experiment.id)}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-1" />
                继续
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(experiment.id)}
            >
              查看详情
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExperimentResultsProps {
  experimentId: string
}

const ExperimentResults: React.FC<ExperimentResultsProps> = ({ experimentId }) => {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await abTestingEngine.getExperimentResults(experimentId)
        setResults(data)
      } catch (error) {
        console.error('加载实验结果失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [experimentId])

  if (loading) {
    return <div className="p-4">加载中...</div>
  }

  if (!results) {
    return <div className="p-4">无法加载实验结果</div>
  }

  const { experiment, results: variantResults, statisticalSignificance, recommendation } = results

  // 准备图表数据
  const chartData = variantResults.map((result: any) => ({
    name: result.variant.name,
    conversion: result.conversionRate || 0,
    sampleSize: result.sampleSize,
    ...result.metrics
  }))

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'stop_winner': return 'text-green-600 bg-green-50'
      case 'stop_inconclusive': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'stop_winner': return <Award className="w-5 h-5" />
      case 'stop_inconclusive': return <AlertTriangle className="w-5 h-5" />
      default: return <TrendingUp className="w-5 h-5" />
    }
  }

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'stop_winner': return '发现获胜变体，建议停止测试并推广获胜方案'
      case 'stop_inconclusive': return '测试时间充足但无显著差异，建议停止测试'
      default: return '继续测试以获得更多数据'
    }
  }

  return (
    <div className="space-y-6">
      {/* 实验概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            实验概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {variantResults.reduce((sum: number, r: any) => sum + r.sampleSize, 0)}
              </div>
              <div className="text-sm text-gray-600">总参与用户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {variantResults.length}
              </div>
              <div className="text-sm text-gray-600">测试变体数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(statisticalSignificance).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-600">显著性差异</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 推荐结果 */}
      <Card>
        <CardHeader>
          <CardTitle>测试建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border-l-4 ${getRecommendationColor(recommendation)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getRecommendationIcon(recommendation)}
              <span className="font-semibold">
                {recommendation === 'stop_winner' ? '测试成功' : 
                 recommendation === 'stop_inconclusive' ? '无显著差异' : '继续测试'}
              </span>
            </div>
            <p className="text-sm">{getRecommendationText(recommendation)}</p>
          </div>
        </CardContent>
      </Card>

      {/* 转化率对比 */}
      <Card>
        <CardHeader>
          <CardTitle>转化率对比</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${(Number(value) * 100).toFixed(2)}%`, 
                  '转化率'
                ]}
              />
              <Bar dataKey="conversion" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 详细结果表格 */}
      <Card>
        <CardHeader>
          <CardTitle>详细结果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">变体</th>
                  <th className="text-left p-2">样本大小</th>
                  <th className="text-left p-2">转化率</th>
                  <th className="text-left p-2">置信区间</th>
                  <th className="text-left p-2">显著性</th>
                </tr>
              </thead>
              <tbody>
                {variantResults.map((result: any, index: number) => {
                  const isControl = index === 0
                  const significance = statisticalSignificance[`${result.variant.id}_vs_control`]
                  const metric = result.metrics[experiment.primaryMetric]
                  
                  return (
                    <tr key={result.variant.id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className={isControl ? 'font-semibold' : ''}>
                            {result.variant.name}
                          </span>
                          {isControl && <Badge variant="outline">Control</Badge>}
                        </div>
                      </td>
                      <td className="p-2">{result.sampleSize.toLocaleString()}</td>
                      <td className="p-2">
                        {metric?.mean ? `${(metric.mean * 100).toFixed(2)}%` : 'N/A'}
                      </td>
                      <td className="p-2">
                        {metric?.confidenceInterval ? 
                          `[${(metric.confidenceInterval[0] * 100).toFixed(2)}%, ${(metric.confidenceInterval[1] * 100).toFixed(2)}%]` : 
                          'N/A'
                        }
                      </td>
                      <td className="p-2">
                        {isControl ? (
                          <Badge variant="outline">基准</Badge>
                        ) : significance ? (
                          <Badge className="bg-green-500 text-white">显著</Badge>
                        ) : (
                          <Badge variant="outline">不显著</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const ABTestingDashboard: React.FC = () => {
  const [experiments, setExperiments] = useState<ABExperiment[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiments()
  }, [])

  const loadExperiments = async () => {
    try {
      // 这里应该从API加载实验列表
      // 暂时使用模拟数据
      setExperiments([])
    } catch (error) {
      console.error('加载实验列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExperimentAction = async (action: string, experimentId: string) => {
    try {
      switch (action) {
        case 'start':
          // 开始实验逻辑
          break
        case 'pause':
          // 暂停实验逻辑
          break
        case 'stop':
          // 停止实验逻辑
          break
        case 'view':
          setSelectedExperiment(experimentId)
          break
      }
      await loadExperiments()
    } catch (error) {
      console.error('实验操作失败:', error)
    }
  }

  if (selectedExperiment) {
    return (
      <div>
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedExperiment(null)}
          >
            ← 返回实验列表
          </Button>
        </div>
        <ExperimentResults experimentId={selectedExperiment} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">A/B 测试管理</h1>
          <p className="text-gray-600">数据驱动的产品优化决策</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          创建新实验
        </Button>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">运行中的实验</p>
                <p className="text-2xl font-bold text-green-600">
                  {experiments.filter(e => e.status === 'running').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总实验数</p>
                <p className="text-2xl font-bold text-blue-600">{experiments.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">成功测试</p>
                <p className="text-2xl font-bold text-purple-600">
                  {experiments.filter(e => e.status === 'completed').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">参与用户</p>
                <p className="text-2xl font-bold text-orange-600">0</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 实验列表 */}
      <Card>
        <CardHeader>
          <CardTitle>实验列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : experiments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">还没有创建任何实验</p>
              <Button onClick={() => setShowCreateForm(true)}>
                创建第一个实验
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiments.map(experiment => (
                <ExperimentCard
                  key={experiment.id}
                  experiment={experiment}
                  onStart={(id) => handleExperimentAction('start', id)}
                  onPause={(id) => handleExperimentAction('pause', id)}
                  onStop={(id) => handleExperimentAction('stop', id)}
                  onView={(id) => handleExperimentAction('view', id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}