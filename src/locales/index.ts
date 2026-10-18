import { Language, LanguageOption, Translations } from './types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';

export * from './types';

export const locales: Record<Language, Translations> = {
  pt,
  en,
  es
};

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
    shortName: 'PT'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    shortName: 'EN'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    shortName: 'ES'
  }
];

export const DEFAULT_LANGUAGE: Language = 'pt';
