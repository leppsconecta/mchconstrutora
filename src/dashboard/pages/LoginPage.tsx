import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, KeyRound } from 'lucide-react';
import { SeoHead } from '../../components/SeoHead';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, changePassword, isAuthenticated, mustChangePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/projetos';

  // Redireciona caso já esteja autenticado (e sem troca de senha pendente)
  React.useEffect(() => {
    if (isAuthenticated && !mustChangePassword) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, mustChangePassword, navigate, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setPassword('');
    if (!res.success) {
      setError(res.error || 'Credenciais inválidas.');
    }
    setIsSubmitting(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setIsSubmitting(true);
    const res = await changePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    if (!res.success) {
      setError(res.error || 'Não foi possível alterar a senha.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-sky-500 selection:text-white">
      <SeoHead
        title="Acesso Restrito | Machado Construtora"
        description="Painel administrativo interno da Machado Construtora."
        canonicalPath="/admin/login"
        noindex={true}
      />
      {/* Background ambient lighting - tons de azul escuro e azul claro */}
      <div className="absolute top-[-20%] left-[-10%] w-[550px] h-[550px] bg-[#1B2639]/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf808_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* Card Modal de Login */}
        <div className="bg-[#101726]/95 backdrop-blur-2xl border border-sky-500/20 rounded-2xl p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_35px_rgba(56,189,248,0.08)] relative">
          
          {/* Topo do Modal: Logo da Empresa */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B2639] to-[#0A0E17] border border-sky-400/30 flex items-center justify-center shadow-lg shadow-sky-950/60 mb-3">
              <img
                src="/logo-emblem.png"
                alt="MCH Logo"
                className="w-9 h-9 object-contain"
              />
            </div>

            <img
              src="/logos/logotipo_machado_header.png"
              alt="Machado Construtora & Incorporadora"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Mensagem de Erro com Alerta */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {mustChangePassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <p className="text-xs text-slate-300">
                Primeiro acesso: defina uma nova senha (mínimo 12 caracteres) para continuar.
              </p>
              <input
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
                className="w-full px-4 py-2.5 text-sm bg-[#080D18] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
              />
              <input
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full px-4 py-2.5 text-sm bg-[#080D18] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 border border-sky-400/30 shadow-lg shadow-sky-600/20 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvando...' : 'Definir nova senha'}
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                E-mail corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  placeholder="seu@email.com.br"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#080D18] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Senha
                </label>
                <span className="text-[11px] text-sky-400/80 font-medium">
                  Acesso seguro
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#080D18] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão Entrar com Detalhes em Azul Claro */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-500 hover:to-sky-500 border border-sky-400/30 shadow-lg shadow-sky-600/20 hover:shadow-sky-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Validando credenciais...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-sky-200" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>
          )}
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-mono">
          © {new Date().getFullYear()} MCH Engenharia & Imobiliária • Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
};
