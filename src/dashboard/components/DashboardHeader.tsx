import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ExternalLink, LogOut, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardHeaderProps {
  onToggleMobileMenu: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleMobileMenu }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (val.trim()) {
          next.set('q', val);
        } else {
          next.delete('q');
        }
        return next;
      },
      { replace: true }
    );
  };

  const handleClearSearch = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        return next;
      },
      { replace: true }
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B111E]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Pesquisar expandido até ao lado de Ver site */}
      <div className="flex items-center gap-3 flex-1">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
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
