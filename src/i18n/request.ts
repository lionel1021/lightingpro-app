import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  // 从cookies获取locale，默认为英文（北美市场）
  const cookieStore = await cookies()
  let locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

  // 确保locale是支持的
  if (!['en', 'zh', 'fr', 'es', 'de', 'it'].includes(locale)) {
    locale = 'en'
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})