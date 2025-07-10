import createIntlMiddleware from 'next-intl/middleware';
 
export default createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'fr', 'es', 'de', 'it'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en|es|fr|it|zh)/:path*']
};