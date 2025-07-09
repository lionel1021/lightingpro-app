'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Lightbulb, 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Heart,
  ShoppingBag,
  ArrowLeft,
  Edit3,
  Save,
  X,
  CheckCircle
} from 'lucide-react'
import { useAuth, useUserPreferences } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user, updateProfile, loading, isAuthenticated } = useAuth()
  const { preferences, updatePreferences, isOnboardingCompleted } = useUserPreferences()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email
      })
    }
  }, [user])

  // 如果未登录，重定向到登录页
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
            <p className="text-gray-600 mb-4">
              您需要登录才能访问个人资料页面
            </p>
            <div className="space-y-3">
              <Link href="/auth/signin" className="block">
                <Button className="w-full">
                  立即登录
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  返回首页
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载用户信息...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await updateProfile({
        full_name: formData.full_name
      })

      if (result.success) {
        setSuccess(true)
        setIsEditing(false)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || '更新失败')
      }
    } catch (err) {
      setError('更新过程中出现错误')
    } finally {
      setIsSaving(false)
    }
  }

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email.substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">LightingPro</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 成功提示 */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              个人资料更新成功！
            </AlertDescription>
          </Alert>
        )}

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左侧：基本信息 */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.email} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">
                  {user?.full_name || '用户'}
                </CardTitle>
                <CardDescription>
                  {user?.email}
                </CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge variant="secondary" className="text-xs">
                    LightingPro 会员
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      加入时间：{user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '未知'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Settings className="w-4 h-4" />
                    <span>
                      入门向导：{isOnboardingCompleted ? '已完成' : '待完成'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快捷操作 */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/favorites" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    我的收藏
                  </Button>
                </Link>
                <Link href="/cart" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    购物车
                  </Button>
                </Link>
                <Link href="/questionnaire" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    智能推荐
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：详细信息 */}
          <div className="md:col-span-2 space-y-6">
            {/* 基本信息编辑 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>
                    管理您的基本资料信息
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      取消
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">姓名</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="请输入您的姓名"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{user?.full_name || '未设置'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <div className="flex items-center gap-2 py-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user?.email}</span>
                    <Badge variant="secondary" className="text-xs">已验证</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 偏好设置 */}
            <Card>
              <CardHeader>
                <CardTitle>偏好设置</CardTitle>
                <CardDescription>
                  您的照明偏好和推荐设置
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(preferences).length > 0 ? (
                  <div className="space-y-4">
                    {preferences.room_types && (
                      <div>
                        <h4 className="font-medium mb-2">偏好房间类型</h4>
                        <div className="flex flex-wrap gap-2">
                          {preferences.room_types.map((type, index) => (
                            <Badge key={index} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {preferences.style_preferences && (
                      <div>
                        <h4 className="font-medium mb-2">装修风格偏好</h4>
                        <div className="flex flex-wrap gap-2">
                          {preferences.style_preferences.map((style, index) => (
                            <Badge key={index} variant="outline">{style}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {preferences.budget_range && (
                      <div>
                        <h4 className="font-medium mb-2">预算范围</h4>
                        <div className="text-gray-600">
                          ¥{preferences.budget_range.min} - ¥{preferences.budget_range.max}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">您还没有设置偏好信息</p>
                    <Link href="/questionnaire">
                      <Button>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        开始设置偏好
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 账户统计 */}
            <Card>
              <CardHeader>
                <CardTitle>账户统计</CardTitle>
                <CardDescription>
                  您在 LightingPro 的活动记录
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">推荐次数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">收藏产品</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">购买记录</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-gray-600">积分余额</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}