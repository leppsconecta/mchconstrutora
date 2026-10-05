import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Footer from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

// Real Pages (Next.js App Router Structure)
import HomePage from './app/page';
import ConstrutoraPage from './app/construtora/page';
import ImobiliariaPage from './app/imobiliaria/page';
import CasesPage from './app/cases/page';
import QuemSomosPage from './app/quem-somos/page';
import ContatoPage from './app/contato/page';
import TorresPage from './app/torres/page';

/**
 * Scroll to top on every route transition
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Smooth Scroll with Lenis
 */
function SmoothScrollSetup() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollSetup />
      <ScrollToTop />
      {/* Preloader de Abertura Inicial (1.5s com efeito janela) */}
      <Preloader />

      <div className="min-h-screen bg-white text-[#1B2639] flex flex-col font-sans selection:bg-[#1B2639] selection:text-white">
        {/* Header Fixo com Backdrop-Blur e Links Reais */}
        <Header />

        {/* Rotas Reais da Aplicação (Sem Modais) */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/construtora" element={<ConstrutoraPage />} />
            <Route path="/imobiliaria" element={<ImobiliariaPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/quem-somos" element={<QuemSomosPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/torres" element={<TorresPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Rodapé Minimalista com Morada e Ressalva Visual */}
        <Footer />
        
        {/* Botão Flutuante do WhatsApp */}
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}
