import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardHeaderProps {
  onToggleMobileMenu: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleMobileMenu }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B111E]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Ver site (aba nova) */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 hover:text-white transition-all duration-200 shadow-sm"
          title="Abrir o site público em uma nova aba"
        >
          <span>Ver site</span>
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
        </a>

        {/* Sair Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600/90 border border-rose-500/20 hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-sm"
          title="Encerrar sessão segura"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};
