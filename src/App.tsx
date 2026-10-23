import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import { LanguageProvider } from './contexts/LanguageContext';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Footer from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

// Real Pages (Public Institutional Website)
import HomePage from './app/page';
import ConstrutoraPage from './app/construtora/page';
import ReformasPage from './app/reformas/page';
import TelecomunicacoesPage from './app/telecomunicacoes/page';
import ImobiliariaPage from './app/imobiliaria/page';
import PortfolioPage from './app/portfolio/page';
import QuemSomosPage from './app/quem-somos/page';
import ContatoPage from './app/contato/page';
import NotFoundPage from './app/not-found/page';

// Dashboard / Admin Imports
import { AuthProvider } from './dashboard/context/AuthContext';
import { ProtectedRoute } from './dashboard/components/ProtectedRoute';
import { DashboardLayout } from './dashboard/components/DashboardLayout';
import { LoginPage } from './dashboard/pages/LoginPage';

// Independent Module Files
import ProjetosModule from './dashboard/modules/ProjetosModule';
import ClientesModule from './dashboard/modules/ClientesModule';
import CrmLeadsModule from './dashboard/modules/CrmLeadsModule';
import ArquivosModule from './dashboard/modules/ArquivosModule';
import FinanceiroModule from './dashboard/modules/FinanceiroModule';
import CurriculosModule from './dashboard/modules/CurriculosModule';
import ContatoModule from './dashboard/modules/ContatoModule';
import FuncionariosModule from './dashboard/modules/FuncionariosModule';
import SiteModule from './dashboard/modules/SiteModule';
import TrabalheConoscoPage from './app/trabalhe-conosco/page';
import { CaptacaoTrabalheConosco } from './dashboard/modules/funcionarios/public/CaptacaoTrabalheConosco';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

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
 * Smooth Scroll com Lenis (Inércia ultra suave para o site público)
 */
function SmoothScrollSetup() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Desativa Lenis nas rotas do painel administrativo
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/login')
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.6, // Inércia mais longa e sedosa
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenis.scrollTo(0, { immediate: true });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}

/**
 * Layout do Site Público Institucional (com Header, Footer e WhatsApp)
 */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-[#1B2639] flex flex-col font-sans selection:bg-[#1B2639] selection:text-white">
      {/* Preloader exclusivo do site público institucional */}
      <Preloader />

      {/* Header Fixo com Backdrop-Blur e Links Reais */}
      <Header />

      {/* Rotas Públicas */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Rodapé Minimalista */}
      <Footer />

      {/* Botão Flutuante do WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SiteConfigProvider>
          <BrowserRouter>
            <SmoothScrollSetup />
            <ScrollToTop />

            <Routes>
              {/* =========================================
                  ROTAS PÚBLICAS / INSTITUCIONAL
                 ========================================= */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/telecomunicacoes" element={<TelecomunicacoesPage />} />
                <Route path="/reformas" element={<ReformasPage />} />
                <Route path="/construtora" element={<ConstrutoraPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/quem-somos" element={<QuemSomosPage />} />
                <Route path="/contato" element={<ContatoPage />} />

                {/* Rotas legadas, atalhos e compatibilidade do site */}
                <Route path="/cases" element={<Navigate to="/portfolio" replace />} />
                <Route path="/torres" element={<Navigate to="/telecomunicacoes" replace />} />
                <Route path="/telecom" element={<Navigate to="/telecomunicacoes" replace />} />
                <Route path="/torres-telecom" element={<Navigate to="/telecomunicacoes" replace />} />
                <Route path="/imobiliaria" element={<ImobiliariaPage />} />
                <Route path="/imoveis" element={<Navigate to="/imobiliaria" replace />} />
                <Route path="/sobre" element={<Navigate to="/quem-somos" replace />} />
                <Route path="/sobre-nos" element={<Navigate to="/quem-somos" replace />} />
                <Route path="/obras" element={<Navigate to="/construtora" replace />} />
                <Route path="/projetos" element={<Navigate to="/portfolio" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Página Pública de Captação de Currículos / Trabalhe Conosco */}
              <Route path="/trabalhe-conosco" element={<TrabalheConoscoPage />} />
              <Route path="/cadastro-funcionario" element={<CaptacaoTrabalheConosco />} />
              <Route path="/trabalhe-conosco-completo" element={<CaptacaoTrabalheConosco />} />

              {/* =========================================
                  AUTENTICAÇÃO / LOGIN
                 ========================================= */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />

              {/* =========================================
                  PAINEL DE CONTROLE / DASHBOARD (PROTEGIDO)
                 ========================================= */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/admin/projetos" replace />} />
                  <Route path="projetos" element={<ProjetosModule />} />
                  <Route path="clientes" element={<ClientesModule />} />
                  <Route path="crm-leads" element={<CrmLeadsModule />} />
                  <Route path="contato" element={<ContatoModule />} />
                  <Route path="arquivos" element={<ArquivosModule />} />
                  <Route path="financeiro" element={<FinanceiroModule />} />
                  <Route path="curriculos" element={<CurriculosModule />} />
                  <Route path="funcionarios" element={<FuncionariosModule />} />
                  <Route path="site" element={<SiteModule />} />
                </Route>

                {/* Atalhos para o dashboard */}
                <Route path="/dashboard" element={<Navigate to="/admin/projetos" replace />} />
                <Route path="/dashboard/*" element={<Navigate to="/admin/projetos" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SiteConfigProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
