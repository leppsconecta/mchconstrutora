import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FolderKanban, 
  UserCheck,
  Users2, 
  Files, 
  Wallet, 
  GraduationCap, 
  Users
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const navigationItems = [
  {
    name: 'Projetos',
    path: '/admin/projetos',
    icon: FolderKanban,
  },
  {
    name: 'Clientes',
    path: '/admin/clientes',
    icon: UserCheck,
  },
  {
    name: 'CRM | Leads',
    path: '/admin/crm-leads',
    icon: Users2,
  },
  {
    name: 'Arquivos',
    path: '/admin/arquivos',
    icon: Files,
  },
  {
    name: 'Financeiro',
    path: '/admin/financeiro',
    icon: Wallet,
  },
  {
    name: 'Currículos',
    path: '/admin/curriculos',
    icon: GraduationCap,
  },
  {
    name: 'Funcionários',
    path: '/admin/funcionarios',
    icon: Users,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F1626] border-r border-white/10 transition-all duration-300 ease-in-out shadow-2xl ${
          // Desktop sizing: 76px when collapsed, 260px when hovered
          isHovered ? 'lg:w-64' : 'lg:w-[76px]'
        } ${
          // Mobile positioning
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 sm:h-20 flex items-center px-4 border-b border-white/10 overflow-hidden shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B2639] to-[#0A0E17] border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <img
                src="/logo-emblem.png"
                alt="Machado"
                className="w-7 h-7 object-contain"
              />
            </div>

            {/* Expanded Brand Name */}
            <div
              className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                isHovered || mobileOpen
                  ? 'opacity-100 max-w-[180px] translate-x-0'
                  : 'opacity-0 max-w-0 -translate-x-4 pointer-events-none'
              }`}
            >
              <h2 className="font-bold text-base tracking-tight text-white leading-tight">
                Machado
              </h2>
              <p className="text-[10px] text-sky-400 font-mono tracking-wider uppercase">
                Painel Corporativo
              </p>
            </div>
          </div>
        </div>

        {/* Modules Section Label */}
        <div className="px-4 pt-5 pb-2">
          <div
            className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
              isHovered || mobileOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
            }`}
          >
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              Módulos do Sistema
            </span>
          </div>
          {!(isHovered || mobileOpen) && (
            <div className="w-8 mx-auto h-[1px] bg-white/10" />
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `group relative flex items-center h-12 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.12)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  } ${isHovered || mobileOpen ? 'px-3.5' : 'justify-center px-0'}`
                }
                title={!(isHovered || mobileOpen) ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Accent Bar on Left */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-400 rounded-r-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                    )}

                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'text-sky-400'
                          : 'text-slate-400 group-hover:text-sky-300 transition-colors'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    {/* Expanded Label */}
                    <div
                      className={`flex items-center flex-1 ml-3 min-w-0 transition-all duration-200 overflow-hidden whitespace-nowrap ${
                        isHovered || mobileOpen
                          ? 'opacity-100 max-w-[170px] translate-x-0'
                          : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                    </div>

                    {/* Hover tooltip for collapsed state */}
                    {!(isHovered || mobileOpen) && (
                      <div className="absolute left-[80px] px-2.5 py-1.5 rounded-lg bg-[#1B2639] border border-white/10 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl z-50">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
