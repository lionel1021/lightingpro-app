import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/lib/i18n-simple';

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

  // Extract locale from pathname and validate it
  const locale = pathname.split('/')[1];
  
  if (!locales.includes(locale as any)) {
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
  
  return response;
}

export const config = {
  matcher: ['/', '/(de|en|es|fr|it|zh)/:path*']
};