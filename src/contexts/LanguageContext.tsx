import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  LanguageOption,
  Translations,
  locales,
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE
} from '../locales';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  availableLanguages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const STORAGE_KEY = 'mch_language_preference';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Checa preferência salva no localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
        if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) {
          return saved;
        }

        // 2. Detecção automática de idioma do navegador se for o primeiro acesso
        const browserLang = navigator.language?.toLowerCase() || '';
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('es')) return 'es';
      } catch {
        // Fallback seguro caso localStorage esteja indisponível
      }
    }
    return DEFAULT_LANGUAGE;
  });

  // Atualiza HTML lang e persiste no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignora erro se cookies/storage estiverem bloqueados
    }

    // Atualiza a tag lang do HTML para SEO e acessibilidade
    const htmlTag = document.documentElement;
    if (htmlTag) {
      const langMapping: Record<Language, string> = {
        pt: 'pt-BR',
        en: 'en',
        es: 'es'
      };
      htmlTag.lang = langMapping[language] || 'pt-BR';
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = locales[language] || locales[DEFAULT_LANGUAGE];
  const currentLanguageOption =
    AVAILABLE_LANGUAGES.find((item) => item.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: AVAILABLE_LANGUAGES,
        currentLanguageOption
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextProps {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser utilizado dentro de um <LanguageProvider>');
  }
  return context;
}
