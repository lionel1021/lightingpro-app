'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightbulb, Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, loading, error } = useAuth()
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return t('auth.signup.pleaseFieldRequired')
    }
    if (formData.password !== formData.confirmPassword) {
      return t('auth.signup.passwordMismatch')
    }
    if (formData.password.length < 6) {
      return t('auth.signup.passwordTooShort')
    }
    if (!formData.agreeToTerms) {
      return t('auth.signup.agreeRequired')
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLocalError(null)

    const validationError = validateForm()
    if (validationError) {
      setLocalError(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName
      })
      
      if (result.success) {
        if (result.needsVerification) {
          setNeedsVerification(true)
        } else {
          setSuccess(true)
          setTimeout(() => router.push('/'), 2000)
        }
      } else {
        setLocalError(result.error || t('auth.signup.signupFailed'))
      }
    } catch (err) {
      setLocalError(t('auth.signup.signupError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentError = localError || error

  // 成功状态
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.signup.signupSuccess')}</h2>
            <p className="text-gray-600 mb-4">
              {t('auth.signup.welcomeMessage')}
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-green-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 需要验证邮箱状态
  if (needsVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.signup.verifyEmail')}</h2>
            <p className="text-gray-600 mb-4">
              {t('auth.signup.verificationSent')} <strong>{formData.email}</strong> {t('auth.signup.clickLinkToActivate')}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                {t('auth.signup.resendVerification')}
              </Button>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full">
                  {t('auth.signup.backToSignin')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回首页 */}
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('auth.signup.backToHome')}</span>
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
          <p className="text-gray-600">{t('auth.signup.brandSubtitle')}</p>
        </div>

        {/* 注册表单 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('auth.signup.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.signup.subtitle')}
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

              {/* 姓名输入 */}
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.signup.fullName')} <span className="text-gray-400">{t('auth.signup.optional')}</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('auth.signup.yourName')}
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.signup.email')} <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signup.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.signup.password')} <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
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

              {/* 确认密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.signup.confirmPassword')} <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 同意条款 */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="mt-1 rounded border-gray-300"
                  required
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  {t('auth.signup.agreeToTerms')} <Link href="/terms" className="text-blue-600 hover:text-blue-700">{t('auth.signup.userAgreement')}</Link> {t('auth.signup.and')} <Link href="/privacy" className="text-blue-600 hover:text-blue-700">{t('auth.signup.privacyPolicy')}</Link>
                </Label>
              </div>

              {/* 注册按钮 */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.signup.signingUp')}
                  </>
                ) : (
                  t('auth.signup.createAccount')
                )}
              </Button>

              {/* 社交登录 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.signup.orUse')}</span>
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
                  {t('auth.signup.googleSignup')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 登录链接 */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('auth.signup.alreadyHaveAccount')}{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('auth.signup.signInNow')}
            </Link>
          </p>
        </div>

        {/* 访客模式 */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            {t('auth.signup.continueAsGuest')}
          </Link>
        </div>
      </div>
    </div>
  )
}