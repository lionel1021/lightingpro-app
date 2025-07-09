'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Lightbulb, CheckCircle, Play, Database, Zap, Brain } from "lucide-react"

export default function DemoPage() {
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)

  useEffect(() => {
    // 测试API状态
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => console.error('API测试失败:', err))

    // 测试推荐API
    fetch('/api/products/recommendations?room_type=客厅&budget_range=300-800')
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error('推荐API测试失败:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">LightingPro Demo</h1>
            </div>
            <Link href="/">
              <Button variant="outline">返回首页</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能演示标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 LightingPro 功能演示
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI驱动的智能照明推荐系统 - 展示完整功能和技术能力
          </p>
        </div>

        {/* 系统状态 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API & 数据库状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              {apiStatus ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>API运行正常</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    产品数量: {apiStatus.data?.products_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    状态: {apiStatus.data?.database_status}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">检查中...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI推荐引擎
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>推荐引擎运行正常</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    算法: {recommendations.data?.algorithm}
                  </div>
                  <div className="text-sm text-gray-600">
                    推荐数量: {recommendations.data?.total_count || 0}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">测试中...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 核心功能展示 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600">💡 智能问卷</CardTitle>
              <CardDescription>
                5步交互式问卷，收集用户需求和偏好
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">✅ 房间类型选择</div>
                <div className="text-sm">✅ 空间大小评估</div>
                <div className="text-sm">✅ 风格偏好匹配</div>
                <div className="text-sm">✅ 预算范围设定</div>
                <div className="text-sm">✅ 特殊需求识别</div>
                <Link href="/questionnaire">
                  <Button className="w-full mt-4">
                    <Play className="h-4 w-4 mr-2" />
                    开始体验
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">🧠 AI推荐</CardTitle>
              <CardDescription>
                基于用户偏好的智能产品推荐算法
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">✅ 个性化匹配</div>
                <div className="text-sm">✅ 多维度筛选</div>
                <div className="text-sm">✅ 评分排序</div>
                <div className="text-sm">✅ 实时计算</div>
                <div className="text-sm">✅ 缓存优化</div>
                <Link href="/recommendations">
                  <Button className="w-full mt-4" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    查看推荐
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-600">🔍 产品搜索</CardTitle>
              <CardDescription>
                强大的产品搜索和筛选功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">✅ 实时搜索</div>
                <div className="text-sm">✅ 分类筛选</div>
                <div className="text-sm">✅ 价格范围</div>
                <div className="text-sm">✅ 品牌选择</div>
                <div className="text-sm">✅ 收藏功能</div>
                <Link href="/search">
                  <Button className="w-full mt-4" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    产品搜索
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 技术特性 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🛠️ 技术架构特性</CardTitle>
            <CardDescription>现代化的全栈技术实现</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">前端技术</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>✅ Next.js 15 + TypeScript</div>
                  <div>✅ Tailwind CSS + Radix UI</div>
                  <div>✅ 响应式设计</div>
                  <div>✅ React Hooks</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">后端服务</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>✅ API Routes</div>
                  <div>✅ Supabase集成</div>
                  <div>✅ Redis缓存</div>
                  <div>✅ 性能优化</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">AI功能</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>✅ 智能推荐算法</div>
                  <div>✅ 用户偏好学习</div>
                  <div>✅ 实时计算</div>
                  <div>✅ 模型优化</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速测试 */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 快速功能测试</CardTitle>
            <CardDescription>一键体验核心功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/api/test">
                <Button variant="outline" className="w-full">
                  API状态
                </Button>
              </Link>
              <Link href="/api/products/recommendations">
                <Button variant="outline" className="w-full">
                  推荐API
                </Button>
              </Link>
              <Link href="/questionnaire">
                <Button variant="outline" className="w-full">
                  智能问卷
                </Button>
              </Link>
              <Link href="/favorites">
                <Button variant="outline" className="w-full">
                  收藏功能
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}