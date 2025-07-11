// Simple internationalization implementation
import enMessages from '../messages/en.json';
import zhMessages from '../messages/zh.json';
import frMessages from '../messages/fr.json';
import esMessages from '../messages/es.json';
import deMessages from '../messages/de.json';
import itMessages from '../messages/it.json';

export const locales = ['en', 'zh', 'fr', 'es', 'de', 'it'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

const messages = {
  en: enMessages,
  zh: zhMessages,
  fr: frMessages,
  es: esMessages,
  de: deMessages,
  it: itMessages,
};

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
  
  return value || key;
}

export function useClientTranslations(locale: Locale) {
  return (key: string) => t(key, locale);
}