import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** true quando o admin ainda precisa definir uma nova senha (primeiro acesso) */
  mustChangePassword: boolean;
  login: (email: string, pass: string) => Promise<AuthResult>;
  changePassword: (newPass: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// O papel de admin vive em app_metadata (só o backend/service_role consegue gravar).
// As políticas RLS do banco checam este MESMO claim, então esta verificação no front
// é apenas UX: a proteção real dos dados está no banco.
const ADMIN_CLAIM_KEY = 'machado_role';
const ADMIN_CLAIM_VALUE = 'admin';

const GENERIC_LOGIN_ERROR = 'E-mail ou senha incorretos. Verifique suas credenciais de acesso.';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

const isAdminSession = (session: Session | null): boolean =>
  !!session && session.user?.app_metadata?.[ADMIN_CLAIM_KEY] === ADMIN_CLAIM_VALUE;

const toAdminUser = (session: Session): AdminUser => ({
  name: (session.user.user_metadata?.name as string) || session.user.email || 'Administrador',
  email: session.user.email || '',
  role: 'Administrador Geral',
  lastLogin: session.user.last_sign_in_at || new Date().toISOString(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const failedAttempts = useRef(0);
  const lockedUntil = useRef(0);

  const applySession = useCallback((next: Session | null) => {
    // Qualquer sessão que não seja de admin é descartada (ex.: outro app do mesmo projeto Supabase)
    if (next && !isAdminSession(next)) {
      void supabase.auth.signOut();
      setSession(null);
      return;
    }
    setSession(next);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) applySession(data.session);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    // Callback síncrono (sem await de chamadas supabase aqui dentro, para evitar deadlock)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) applySession(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [applySession]);

  const login = async (email: string, pass: string): Promise<AuthResult> => {
    const now = Date.now();
    if (now < lockedUntil.current) {
      const secs = Math.ceil((lockedUntil.current - now) / 1000);
      return { success: false, error: `Muitas tentativas. Aguarde ${secs}s e tente novamente.` };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    });

    if (error || !data.session || !isAdminSession(data.session)) {
      // Usuário válido porém sem papel admin: encerra a sessão e responde igual a "senha errada"
      if (data?.session) await supabase.auth.signOut();

      failedAttempts.current += 1;
      if (failedAttempts.current >= MAX_ATTEMPTS) {
        failedAttempts.current = 0;
        lockedUntil.current = Date.now() + LOCKOUT_MS;
      }
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    failedAttempts.current = 0;
    setSession(data.session);
    return { success: true };
  };

  const changePassword = async (newPass: string): Promise<AuthResult> => {
    if (newPass.length < 12) {
      return { success: false, error: 'A nova senha deve ter pelo menos 12 caracteres.' };
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPass,
      data: { must_change_password: false },
    });
    if (error || !data.user) {
      return { success: false, error: 'Não foi possível alterar a senha. Tente novamente.' };
    }
    const { data: refreshed } = await supabase.auth.refreshSession();
    if (refreshed.session) setSession(refreshed.session);
    return { success: true };
  };

  const logout = async () => {
    // scope 'global' invalida os refresh tokens no servidor (logout real)
    await supabase.auth.signOut({ scope: 'global' });
    setSession(null);
  };

  const mustChangePassword = session?.user?.user_metadata?.must_change_password === true;

  return (
    <AuthContext.Provider
      value={{
        user: session ? toAdminUser(session) : null,
        isAuthenticated: !!session,
        isLoading,
        mustChangePassword,
        login,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
