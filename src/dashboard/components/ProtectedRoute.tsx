import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, mustChangePassword } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1725] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          <img
            src="/logo-emblem.png"
            alt="MCH"
            className="w-8 h-8 absolute inset-0 m-auto opacity-80"
          />
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">
          Verificando credenciais seguras...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || mustChangePassword) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
