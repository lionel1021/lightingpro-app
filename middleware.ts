import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/lib/i18n-simple';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('🛡️ Middleware:', pathname);
  
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    console.log('🔄 Redirecting missing locale:', pathname, '->', `/${defaultLocale}${pathname}`);
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // Extract locale from pathname and validate it
  const locale = pathname.split('/')[1];
  
  console.log('🌍 Detected locale:', locale);
  
  if (!locales.includes(locale as any)) {
    console.log('❌ Invalid locale, redirecting:', locale, '->', defaultLocale);
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }
  
  // Create response and set the CORRECT locale cookie
  const response = NextResponse.next();
  response.cookies.set('LOCALE', locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'strict'
  });
  
  console.log('✅ Setting LOCALE cookie:', locale);
  
  return response;
}

export const config = {
  matcher: [
    '/',
    '/(de|en|es|fr|it|zh)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};