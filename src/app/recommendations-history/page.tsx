'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Star, Trash2, RefreshCw, TrendingUp, Filter, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-client'
import { LightingProduct } from '@/lib/types'
import { EnhancedRecommendationResult } from '@/lib/enhanced-recommendations'

// 推荐历史记录类型
interface RecommendationHistory {
  id: string
  user_id: string
  session_id: string
  questionnaire_data: any
  recommendations: EnhancedRecommendationResult[]
  created_at: string
  feedback?: {
    liked_products: string[]
    disliked_products: string[]
    overall_satisfaction: number
    comments?: string
  }
}

// 模拟推荐历史数据
const mockRecommendationHistory: RecommendationHistory[] = [
  {
    id: '1',
    user_id: 'user-1',
    session_id: 'session-1',
    questionnaire_data: {
      room_type: '客厅',
      room_size: 'large',
      style_preference: '现代简约',
      budget_min: 300,
      budget_max: 1000
    },
    recommendations: [
      {
        product: {
          id: '1',
          name: 'LED吸顶灯 现代简约',
          brand: 'Philips',
          category: '吸顶灯',
          price: 299.00,
          description: '现代简约风格LED吸顶灯，适合客厅卧室使用，亮度可调节，节能环保。',
          rating: 4.5,
          review_count: 127,
          features: ['可调光', '智能控制', '节能', '现代设计'],
          image_urls: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400'],
          created_at: '2024-01-01T00:00:00Z'
        },
        score: 0.85,
        confidence: 0.9,
        reasons: ['价格符合预算', '符合现代简约风格', '适合客厅'],
        category: 'perfect_match' as const,
        priceRatio: 0.3,
        explanation: '为您推荐LED吸顶灯 现代简约，价格符合您的预算，符合现代简约风格，非常适合您的客厅。',
        confidence_level: 'high' as const,
        personalization_strength: 0.8
      }
    ],
    created_at: '2024-01-15T10:30:00Z',
    feedback: {
      liked_products: ['1'],
      disliked_products: [],
      overall_satisfaction: 5,
      comments: '推荐很准确，已购买！'
    }
  },
  {
    id: '2',
    user_id: 'user-1',
    session_id: 'session-2',
    questionnaire_data: {
      room_type: '卧室',
      room_size: 'medium',
      style_preference: '北欧风',
      budget_min: 100,
      budget_max: 500
    },
    recommendations: [
      {
        product: {
          id: '3',
          name: '北欧风台灯 原木质感',
          brand: 'IKEA',
          category: '台灯',
          price: 199.00,
          description: '北欧风原木台灯，温馨舒适，适合卧室书房使用。',
          rating: 4.7,
          review_count: 203,
          features: ['原木材质', '北欧设计', '护眼光源', '可调光'],
          image_urls: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
          created_at: '2024-01-03T00:00:00Z'
        },
        score: 0.78,
        confidence: 0.85,
        reasons: ['符合北欧风格', '适合卧室', '价格合理'],
        category: 'style_match' as const,
        priceRatio: 0.25,
        explanation: '为您推荐北欧风台灯，符合您喜欢的北欧风格，非常适合您的卧室。',
        confidence_level: 'high' as const,
        personalization_strength: 0.7
      }
    ],
    created_at: '2024-01-10T14:20:00Z'
  }
]

export default function RecommendationHistoryPage() {
  const [historyData, setHistoryData] = useState<RecommendationHistory[]>([])
  const [filteredHistory, setFilteredHistory] = useState<RecommendationHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all')
  const [selectedSatisfaction, setSelectedSatisfaction] = useState<string>('all')
  
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }
    
    // 加载推荐历史数据
    loadRecommendationHistory()
  }, [isAuthenticated, router])

  useEffect(() => {
    // 应用筛选条件
    applyFilters()
  }, [historyData, selectedTimeRange, selectedSatisfaction])

  const loadRecommendationHistory = async () => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 使用模拟数据
      setHistoryData(mockRecommendationHistory)
      
    } catch (error) {
      console.error('加载推荐历史失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...historyData]
    
    // 时间筛选
    if (selectedTimeRange !== 'all') {
      const now = new Date()
      const days = parseInt(selectedTimeRange)
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= cutoffDate
      )
    }
    
    // 满意度筛选
    if (selectedSatisfaction !== 'all') {
      const minSatisfaction = parseInt(selectedSatisfaction)
      filtered = filtered.filter(item => 
        item.feedback && item.feedback.overall_satisfaction >= minSatisfaction
      )
    }
    
    setFilteredHistory(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLikeProduct = async (historyId: string, productId: string) => {
    // 更新用户反馈
    setHistoryData(prev => prev.map(item => {
      if (item.id === historyId) {
        const feedback = item.feedback || {
          liked_products: [],
          disliked_products: [],
          overall_satisfaction: 3
        }
        
        const isLiked = feedback.liked_products.includes(productId)
        
        return {
          ...item,
          feedback: {
            ...feedback,
            liked_products: isLiked 
              ? feedback.liked_products.filter(id => id !== productId)
              : [...feedback.liked_products, productId],
            disliked_products: feedback.disliked_products.filter(id => id !== productId)
          }
        }
      }
      return item
    }))
  }

  const regenerateRecommendations = async (questionnaire: any) => {
    try {
      const response = await fetch('/api/products/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionnaire_data: questionnaire
        })
      })
      
      if (response.ok) {
        router.push('/recommendations')
      }
    } catch (error) {
      console.error('重新生成推荐失败:', error)
    }
  }

  const deleteHistoryItem = (historyId: string) => {
    if (confirm('确定要删除这条推荐历史吗？')) {
      setHistoryData(prev => prev.filter(item => item.id !== historyId))
    }
  }

  // 统计数据
  const stats = {
    totalRecommendations: historyData.length,
    totalProducts: historyData.reduce((sum, item) => sum + item.recommendations.length, 0),
    avgSatisfaction: historyData
      .filter(item => item.feedback)
      .reduce((sum, item) => sum + (item.feedback?.overall_satisfaction || 0), 0) / 
      historyData.filter(item => item.feedback).length || 0,
    likedProducts: historyData.reduce((sum, item) => 
      sum + (item.feedback?.liked_products.length || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载推荐历史中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">推荐历史</h1>
              <p className="text-sm text-gray-500">查看您的个性化推荐记录和反馈</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/questionnaire')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                新建推荐
              </Button>
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">推荐次数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecommendations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">推荐产品数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">满意度</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgSatisfaction > 0 ? `${stats.avgSatisfaction.toFixed(1)}/5` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">喜欢的产品</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.likedProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选条件 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              筛选条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <option value="all">全部时间</option>
                  <option value="7">最近7天</option>
                  <option value="30">最近30天</option>
                  <option value="90">最近90天</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">满意度</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedSatisfaction}
                  onChange={(e) => setSelectedSatisfaction(e.target.value)}
                >
                  <option value="all">全部评分</option>
                  <option value="5">5星</option>
                  <option value="4">4星及以上</option>
                  <option value="3">3星及以上</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSelectedTimeRange('all')
                    setSelectedSatisfaction('all')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  清除筛选
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 推荐历史列表 */}
        <div className="space-y-6">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐历史</h3>
                <p className="text-gray-500 mb-6">开始您的第一次照明推荐吧！</p>
                <Button 
                  onClick={() => router.push('/questionnaire')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  开始推荐
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((history) => (
              <Card key={history.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {history.questionnaire_data.room_type} • {history.questionnaire_data.style_preference}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(history.created_at)}
                        </div>
                        <div>
                          预算: ¥{history.questionnaire_data.budget_min} - ¥{history.questionnaire_data.budget_max}
                        </div>
                        <div>
                          房间大小: {history.questionnaire_data.room_size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {history.feedback && (
                        <div className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          <Star className="h-4 w-4" />
                          {history.feedback.overall_satisfaction}/5
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateRecommendations(history.questionnaire_data)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteHistoryItem(history.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <img
                            src={rec.product.image_urls?.[0] || '/placeholder-product.jpg'}
                            alt={rec.product.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{rec.product.name}</h4>
                            <p className="text-sm text-gray-600">{rec.product.brand}</p>
                            <p className="text-lg font-bold text-green-600">¥{rec.product.price}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                rec.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                                rec.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {rec.confidence_level === 'high' ? '高匹配' :
                                 rec.confidence_level === 'medium' ? '中匹配' : '低匹配'}
                              </span>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`p-1 ${
                                  history.feedback?.liked_products.includes(rec.product.id)
                                    ? 'text-red-600'
                                    : 'text-gray-400'
                                }`}
                                onClick={() => handleLikeProduct(history.id, rec.product.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {rec.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {history.feedback?.comments && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>您的评价：</strong>{history.feedback.comments}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}