import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

// 创建国际化中间件 - 支持6种语言，英文为默认
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'zh', 'fr', 'es', 'de', 'it'],
  defaultLocale: 'en',
  localeDetection: false // 关闭自动检测，使用cookie控制
})

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过不需要国际化的路径
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // 获取cookie中的语言设置
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en'
  
  // 如果URL已经包含语言前缀，直接返回
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
    return NextResponse.next()
  }

  // 处理根路径
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return NextResponse.redirect(url)
  }

  // 为其他路径添加语言前缀
  if (!pathname.match(/^\/(en|zh|fr|es|de|it)(\/|$)/)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}