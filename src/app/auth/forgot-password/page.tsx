'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightbulb, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!email) {
      setError('请输入邮箱地址')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || '重置密码失败')
      }
    } catch (err) {
      setError('发送重置邮件时出现错误')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 成功状态
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link href="/auth/signin" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>返回登录</span>
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">邮件已发送</h2>
              <p className="text-gray-600 mb-4">
                我们已向 <strong>{email}</strong> 发送了密码重置邮件。
                请查收邮件并点击其中的链接来重置您的密码。
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setSuccess(false)} 
                  variant="outline" 
                  className="w-full"
                >
                  重新发送邮件
                </Button>
                <Link href="/auth/signin" className="block">
                  <Button className="w-full">
                    返回登录
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回登录 */}
        <div className="mb-6">
          <Link href="/auth/signin" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>返回登录</span>
          </Link>
        </div>

        {/* 品牌标识 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LightingPro</h1>
          </div>
          <p className="text-gray-600">重置您的账户密码</p>
        </div>

        {/* 密码重置表单 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">忘记密码</CardTitle>
            <CardDescription className="text-center">
              输入您的邮箱地址，我们将为您发送密码重置链接
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 错误提示 */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  请输入您注册时使用的邮箱地址
                </p>
              </div>

              {/* 发送重置邮件按钮 */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    发送中...
                  </>
                ) : (
                  '发送重置邮件'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 其他选项 */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600">
            记起密码了？{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              立即登录
            </Link>
          </p>
          <p className="text-gray-600">
            还没有账户？{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              立即注册
            </Link>
          </p>
        </div>

        {/* 访客模式 */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            或者以访客身份继续浏览
          </Link>
        </div>
      </div>
    </div>
  )
}