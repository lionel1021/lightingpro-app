import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh', 'fr', 'es', 'de', 'it'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  
  // Create response and set the correct locale cookie
  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000, // 1 year
    sameSite: 'strict'
  });
  
  return response;
}

export const config = {
  matcher: ['/', '/(de|en|es|fr|it|zh)/:path*']
};