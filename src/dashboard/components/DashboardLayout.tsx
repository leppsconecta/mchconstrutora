import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { SeoHead } from '../../components/SeoHead';
import { ConfirmDeleteProvider } from '../context/ConfirmDeleteContext';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ConfirmDeleteProvider>
      <div className="min-h-screen bg-[#0B111E] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <SeoHead
        title="Painel de Gestão | Machado Construtora"
        description="Sistema interno de gestão integrada."
        canonicalPath="/admin"
        noindex={true}
      />
      {/* Collapsed Sidebar with hover-expansion */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (Offset by collapsed sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-[76px] min-h-screen transition-all duration-300">
        {/* Header */}
        <DashboardHeader
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Dynamic Module Page Body */}
        <main className="flex-1 pt-2 sm:pt-3 px-4 sm:px-6 lg:px-8 pb-6 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
    </ConfirmDeleteProvider>
  );
};
