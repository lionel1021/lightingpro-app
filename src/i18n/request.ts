import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Import all message files statically
import enMessages from '../messages/en.json';
import zhMessages from '../messages/zh.json';
import frMessages from '../messages/fr.json';
import esMessages from '../messages/es.json';
import deMessages from '../messages/de.json';
import itMessages from '../messages/it.json';

// Can be imported from a shared config
const locales = ['en', 'zh', 'fr', 'es', 'de', 'it'];

const messageMap = {
  en: enMessages,
  zh: zhMessages,
  fr: frMessages,
  es: esMessages,
  de: deMessages,
  it: itMessages,
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`Invalid locale: ${locale}`);
    notFound();
  }

  console.log(`Loading messages for locale: ${locale}`);
  return {
    messages: messageMap[locale as keyof typeof messageMap]
  };
});