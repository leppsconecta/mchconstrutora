import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Globe } from 'lucide-react';

interface ShareCaptureModalProps {
  isOpen: boolean;
  publicPageEnabled: boolean;
  onClose: () => void;
  onTogglePublicPage: (enabled: boolean) => void;
}

export const ShareCaptureModal: React.FC<ShareCaptureModalProps> = ({
  isOpen,
  publicPageEnabled,
  onClose,
  onTogglePublicPage
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/trabalhe-conosco`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#101726] border border-white/10 rounded-2xl shadow-2xl p-6 z-10 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <span>Captação de Colaboradores</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Compartilhe este link com novos contratados ou candidatos. Eles poderão preencher a ficha cadastral completa diretamente pelo navegador ou celular.
        </p>

        {/* Link box */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-slate-400">Link público de captação</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-[#0A0E17] border border-white/10 rounded-xl text-xs text-sky-300 font-mono truncate select-all">
              {publicUrl}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Switch ativar/desativar captação */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-xs font-semibold text-white">Recebimento de Cadastros</div>
              <div className="text-[11px] text-slate-400">
                {publicPageEnabled ? 'O link está ativo para envios' : 'A captação está temporariamente pausada'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTogglePublicPage(!publicPageEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              publicPageEnabled ? 'bg-sky-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                publicPageEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <a
            href="/trabalhe-conosco"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir página pública</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
