import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../locales';

interface LanguageSelectorProps {
  className?: string;
  isMobile?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  isMobile = false
}) => {
  const { language, setLanguage, availableLanguages, currentLanguageOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Versão Mobile (Botões em linha ou lista clara)
  if (isMobile) {
    return (
      <div className={`pt-2 border-t border-white/10 ${className}`}>
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.common.languageSelect}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {availableLanguages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <span className="text-sm">{item.flag}</span>
                <span>{item.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Versão Desktop (Dropdown moderno e translúcido)
  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.common.languageSelect}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-xs font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      >
        <span className="text-sm select-none" role="img" aria-label={currentLanguageOption.name}>
          {currentLanguageOption.flag}
        </span>
        <span className="font-semibold tracking-wider">{currentLanguageOption.shortName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Menu Dropdown com Framer Motion (Limpo e Direto) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-40 rounded-xl bg-[#1B2639]/95 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-1.5 z-50 overflow-hidden"
          >
            <div className="space-y-1">
              {availableLanguages.map((item) => {
                const isSelected = item.code === language;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none select-none">{item.flag}</span>
                      <span className="leading-none">{item.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
