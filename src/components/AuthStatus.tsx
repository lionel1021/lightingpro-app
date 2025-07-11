'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  ShoppingBag, 
  UserPlus, 
  LogIn,
  Loader2,
  Crown
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { useClientTranslations, type Locale } from '@/lib/i18n-simple'

export function AuthStatus() {
  const { user, isAuthenticated, isGuest, loading, signOut } = useAuth()
  const [locale, setLocale] = useState<Locale>('en')
  
  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1] as Locale
    if (pathLocale) {
      setLocale(pathLocale)
    }
  }, [])
  
  const t = (key: string) => {
    const fullKey = `authStatus.${key}`
    const msgs = useClientTranslations(locale)
    return msgs(fullKey)
  }
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  // 客户端挂载前显示统一的加载状态
  if (!mounted || loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    )
  }

  // 已登录状态
  if (isAuthenticated && user) {
    const initials = user.full_name 
      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email.substring(0, 2).toUpperCase()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">
                  {user.full_name || t('user')}
                </p>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  {t('member')}
                </Badge>
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t('profile')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/favorites" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>{t('myFavorites')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>{t('myOrders')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('accountSettings')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            {isSigningOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>{t('signOut')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // 访客状态
  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/signin">
        <Button variant="ghost" size="sm">
          <LogIn className="w-4 h-4 mr-2" />
          {t('signIn')}
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          {t('signUp')}
        </Button>
      </Link>
    </div>
  )
}

// 简化版本，只显示登录状态
export function AuthStatusCompact() {
  const { user, isAuthenticated, loading } = useAuth()
  const [locale, setLocale] = useState<Locale>('en')
  
  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1] as Locale
    if (pathLocale) {
      setLocale(pathLocale)
    }
  }, [])
  
  const t = (key: string) => {
    const fullKey = `authStatus.${key}`
    const msgs = useClientTranslations(locale)
    return msgs(fullKey)
  }
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
  }

  if (isAuthenticated && user) {
    const initials = user.full_name 
      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email.substring(0, 2).toUpperCase()

    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Link href="/auth/signin">
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          {t('signIn')}
        </Button>
      </Link>
    </div>
  )
}