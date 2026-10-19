import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
