import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from './Link';
import { useLocation } from 'react-router-dom';

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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo Minimalista MCH */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
              MCH
            </span>
            <div className="h-4 w-[1px] bg-[#9F9F9F]/40" />
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-medium hidden sm:inline-block">
              Engenharia &amp; Imobiliária
            </span>
          </Link>

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
