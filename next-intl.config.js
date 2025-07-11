import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const defaultLocale = 'en'
export const locales = ['en', 'zh', 'fr', 'es', 'de', 'it']

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  defaultLocale
})