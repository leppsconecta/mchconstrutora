import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  WifiOff, 
  AlertTriangle, 
  Mail, 
  PhoneCall, 
  Check, 
  Copy, 
  ShieldAlert, 
  Clock, 
  Lock 
} from 'lucide-react';

interface ModuleOfflinePlaceholderProps {
  moduleName: string;
  moduleCode: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ModuleOfflinePlaceholder: React.FC<ModuleOfflinePlaceholderProps> = ({
  moduleName,
  moduleCode,
  description,
  icon: ModuleIcon,
}) => {
  const [copied, setCopied] = useState(false);
  const adminEmail = 'bruno@machado.com.br';

  const copyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between space-y-6">
      {/* Main Full Size Offline Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex-1 w-full flex flex-col justify-center items-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#131C2D] to-[#0D1420] border border-white/10 p-8 sm:p-14 shadow-2xl text-center min-h-[520px]"
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Main Icon Visual */}
          <div className="relative mb-6">
            <div className="w-22 h-22 rounded-2xl bg-gradient-to-br from-[#1B2639] to-[#0f1725] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/40">
              <WifiOff className="w-11 h-11 stroke-[1.6]" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-sky-500 text-white shadow-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Required Message */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Módulo Off Line
          </h2>
          <p className="text-lg text-sky-200 font-semibold mb-4">
            Entre em contato com o administrador.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-lg">
            {description} No momento, a sincronização de dados e os serviços deste módulo estão pausados para manutenção técnica ou liberação de permissão.
          </p>

          {/* Admin Contact Cards / Actions */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {/* Admin Info */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 backdrop-blur-md">
              <div className="p-2.5 rounded-lg bg-white/5 text-slate-300 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Responsável</p>
                <p className="text-sm font-semibold text-white truncate">Bruno Machado</p>
                <p className="text-[11px] text-slate-500">Administrador Geral</p>
              </div>
            </div>

            {/* Email Contact */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 backdrop-blur-md">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 border border-sky-500/20">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">E-mail corporativo</p>
                <p className="text-xs font-mono text-slate-200 truncate">{adminEmail}</p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="mt-1 text-[11px] text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar e-mail</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${adminEmail}?subject=Solicitação de Acesso ao Módulo ${moduleName}&body=Olá Administrador,%0D%0A%0D%0ASolicito a verificação e liberação do módulo [${moduleName} - ${moduleCode}].%0D%0A%0D%0AObrigado.`}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-500 hover:to-sky-500 text-white shadow-lg shadow-sky-600/30 hover:shadow-sky-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Contatar Administrador</span>
            </a>

            <a
              href="https://wa.me/5515997232231?text=Ol%C3%A1%20Bruno,%20estou%20no%20Dashboard%20da%20MCH%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20m%C3%B3dulo%20off-line."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Suporte via WhatsApp</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* System Diagnostic Footer - Full Size Bar */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#131C2D]/60 border border-white/5 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="text-xs">
            <p className="text-slate-400">Nível de Segurança</p>
            <p className="font-semibold text-white">Privado • Criptografia TLS</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131C2D]/60 border border-white/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="text-xs">
            <p className="text-slate-400">Status do Módulo</p>
            <p className="font-semibold text-rose-400">Offline / Standby</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131C2D]/60 border border-white/5 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div className="text-xs">
            <p className="text-slate-400">Dashboard Base</p>
            <p className="font-semibold text-white">Online • v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};
