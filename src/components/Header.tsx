import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from './Link';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHidden(true); // scrolling down
      } else {
        setIsHidden(false); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Torres Telecom', href: '/torres' },
    { label: 'Construtora', href: '/construtora' },
    { label: 'Imobiliária', href: '/imobiliaria' },
    { label: 'Cases', href: '/cases' },
    { label: 'Quem Somos', href: '/quem-somos' },
    { label: 'Contato', href: '/contato' }
  ];

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#1B2639]/90 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
      isHidden ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo no formato do exemplo com animação na abertura */}
          <motion.div
            initial={{ opacity: 0, x: -25, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center shrink-0"
          >
            <Link
              href="/"
              className="flex items-center group relative select-none"
              aria-label="MCH Engenharia &amp; Imobiliária"
            >
              {/* Bloco Arquitetônico do Emblema M (formato do exemplo anexado) */}
              <div className="h-14 sm:h-16 w-14 sm:w-16 bg-[#E6E6E6] rounded flex items-center justify-center p-2.5 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-lg shrink-0 relative overflow-hidden">
                {/* Reflexo / Sweep Shine ao abrir o site */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                  initial={{ x: '-120%' }}
                  animate={{ x: '220%' }}
                  transition={{ duration: 1.1, delay: 0.7, ease: 'easeInOut' }}
                />
                <img
                  src="/logo-emblem.png"
                  alt="Emblema MCH"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Logotipo Tipográfico: MCH ENGENHARIA & IMOBILIÁRIA */}
              <div className="ml-3 sm:ml-4 flex items-center overflow-hidden">
                <motion.img
                  initial={{ opacity: 0, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                  src="/logos/logotipo_header.png"
                  alt="MCH Engenharia &amp; Imobiliária"
                  className="h-6 sm:h-7 md:h-8 lg:h-8.5 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
            </Link>
          </motion.div>

          {/* Navegação Desktop com Links Reais */}
          <nav className="hidden lg:flex items-center gap-8 ml-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const isHighlight = link.label === 'Torres Telecom';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:origin-left after:transition-transform after:duration-300 ${
                    isHighlight 
                      ? 'text-cyan-400 font-bold hover:text-cyan-300 after:bg-cyan-400' 
                      : (isActive ? 'text-white font-semibold after:bg-white' : 'text-slate-300 font-medium hover:text-white after:bg-white')
                  } ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1B2639] border-b border-white/10 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const isHighlight = link.label === 'Torres 5,6G';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base py-2 transition-colors ${
                    isHighlight
                      ? 'text-cyan-400 font-bold'
                      : (isActive ? 'text-white font-bold' : 'text-slate-300 font-medium hover:text-white')
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>
      )}
    </header>
  );
};

export default Header;
