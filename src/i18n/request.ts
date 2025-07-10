import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const supportedLocales = ['en', 'zh', 'fr', 'es', 'de', 'it']
  
  // 首先从URL路径获取locale
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-url') || ''
  const urlLocale = pathname.match(/^\/([a-z]{2})/)?.[1]
  
  let locale = 'en' // 面向北美市场，默认英文
  
  if (urlLocale && supportedLocales.includes(urlLocale)) {
    locale = urlLocale
  } else {
    // 如果URL中没有语言，从cookies获取（但仍优先英文）
    const cookieStore = await cookies()
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value
    if (cookieLocale && supportedLocales.includes(cookieLocale)) {
      locale = cookieLocale
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})