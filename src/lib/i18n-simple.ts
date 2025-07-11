// Simple internationalization implementation
import { messages } from './i18n-messages';

export const locales = ['en', 'zh', 'fr', 'es', 'de', 'it'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale];
}

export function t(key: string, locale: Locale) {
  const msgs = getMessages(locale);
  const keys = key.split('.');
  let value: any = msgs;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  // Debug: log translation attempts
  if (locale !== 'en' && locale !== 'zh') {
    console.log(`🔤 Translation: ${key} -> ${value || key} (locale: ${locale})`);
  }
  
  return value || key;
}

export function useClientTranslations(locale: Locale) {
  return (key: string) => t(key, locale);
}