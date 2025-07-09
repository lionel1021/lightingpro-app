'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightbulb, Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

export default function SignInPage() {
  const router = useRouter()
  const { signIn, loading, error } = useAuth()
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLocalError(null)

    try {
      const result = await signIn(formData)
      
      if (result.success) {
        router.push('/')
      } else {
        setLocalError(result.error || t('auth.signin.signinFailed'))
      }
    } catch (err) {
      setLocalError(t('auth.signin.signinError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentError = localError || error

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回首页 */}
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('auth.signin.backToHome')}</span>
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
          <p className="text-gray-600">{t('auth.signin.brandSubtitle')}</p>
        </div>

        {/* 登录表单 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('auth.signin.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.signin.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 错误提示 */}
              {currentError && (
                <Alert variant="destructive">
                  <AlertDescription>{currentError}</AlertDescription>
                </Alert>
              )}

              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.signin.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signin.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.signin.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.signin.passwordPlaceholder')}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 记住我和忘记密码 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={formData.remember}
                    onChange={(e) => setFormData(prev => ({ ...prev, remember: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm">{t('auth.signin.rememberMe')}</Label>
                </div>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {t('auth.signin.forgotPassword')}
                </Link>
              </div>

              {/* 登录按钮 */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.signin.signingIn')}
                  </>
                ) : (
                  t('auth.signin.signIn')
                )}
              </Button>

              {/* 社交登录 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.signin.orUse')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" type="button" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {t('auth.signin.googleSignin')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 注册链接 */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('auth.signin.noAccount')}{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('auth.signin.signUpNow')}
            </Link>
          </p>
        </div>

        {/* 访客模式 */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            {t('auth.signin.continueAsGuest')}
          </Link>
        </div>
      </div>
    </div>
  )
}