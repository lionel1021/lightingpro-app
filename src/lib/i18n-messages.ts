// Static message imports to avoid dynamic import issues
import enMessages from '../messages/en.json';
import zhMessages from '../messages/zh.json';
import frMessages from '../messages/fr.json';
import esMessages from '../messages/es.json';
import deMessages from '../messages/de.json';
import itMessages from '../messages/it.json';

export const messages = {
  en: enMessages,
  zh: zhMessages,
  fr: frMessages,
  es: esMessages,
  de: deMessages,
  it: itMessages,
} as const;