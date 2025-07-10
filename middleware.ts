import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const supportedLocales = ['en', 'zh', 'fr', 'es', 'de', 'it']

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // 跳过API和静态资源
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // 检查URL中是否已有语言前缀
  const localeMatch = pathname.match(/^\/([a-z]{2})(.*)$/)
  const urlLocale = localeMatch?.[1]
  const pathWithoutLocale = localeMatch?.[2] || ''

  // 获取cookie中的语言设置
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  
  // 确定最终语言（优先使用cookie，fallback到URL或默认）
  let targetLocale = 'en' // 默认英文
  
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    targetLocale = cookieLocale
  } else if (urlLocale && supportedLocales.includes(urlLocale)) {
    targetLocale = urlLocale
  }

  // 如果URL中的语言与目标语言不匹配，需要重定向
  if (urlLocale !== targetLocale) {
    const url = request.nextUrl.clone()
    
    // 构建新的路径
    if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
      url.pathname = `/${targetLocale}`
    } else {
      url.pathname = `/${targetLocale}${pathWithoutLocale}`
    }
    
    // 保留查询参数
    url.search = search
    
    console.log(`重定向: ${pathname} -> ${url.pathname}`)
    return NextResponse.redirect(url)
  }

  // 如果访问根路径，重定向到默认语言
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${targetLocale}`
    console.log(`根路径重定向: / -> /${targetLocale}`)
    return NextResponse.redirect(url)
  }

  // 如果路径没有语言前缀，添加默认语言前缀
  if (!urlLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/${targetLocale}${pathname}`
    console.log(`添加语言前缀: ${pathname} -> ${url.pathname}`)
    return NextResponse.redirect(url)
  }

  // 创建响应并设置正确的语言cookie
  const response = NextResponse.next()
  
  // 传递pathname给next-intl
  response.headers.set('x-pathname', pathname)
  
  // 确保cookie与URL同步
  if (urlLocale && supportedLocales.includes(urlLocale)) {
    response.cookies.set('NEXT_LOCALE', urlLocale, {
      path: '/',
      maxAge: 31536000, // 1年
      sameSite: 'strict'
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}