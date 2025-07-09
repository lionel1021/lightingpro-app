import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 跳过API路由和静态文件
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // 检查路径是否已包含语言前缀
  const hasLocale = /^\/(?:zh|en)\b/.test(pathname);
  
  if (!hasLocale) {
    // 从cookie获取用户偏好的语言，默认为中文
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = cookieLocale && ['zh', 'en'].includes(cookieLocale) ? cookieLocale : 'zh';
    
    const response = NextResponse.next();
    
    // 如果没有cookie或者cookie值不同，更新cookie
    if (!cookieLocale || cookieLocale !== locale) {
      response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 31536000, // 1年
        sameSite: 'strict'
      });
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)']
};