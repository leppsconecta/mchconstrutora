import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteOptions {
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
}

interface ConfirmDeleteContextType {
  confirmDelete: (options: ConfirmDeleteOptions) => void;
  closeConfirm: () => void;
}

const ConfirmDeleteContext = createContext<ConfirmDeleteContextType | undefined>(undefined);

export const ConfirmDeleteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<ConfirmDeleteOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = useCallback((opts: ConfirmDeleteOptions) => {
    setOptions(opts);
  }, []);

  const closeConfirm = useCallback(() => {
    if (isLoading) return;
    setOptions(null);
  }, [isLoading]);

  const handleExecute = async () => {
    if (!options) return;
    try {
      setIsLoading(true);
      await options.onConfirm();
      setOptions(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options && !isLoading) {
        closeConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, isLoading, closeConfirm]);

  return (
    <ConfirmDeleteContext.Provider value={{ confirmDelete, closeConfirm }}>
      {children}

      {/* Global Confirmation Modal */}
      <AnimatePresence>
        {options && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeConfirm}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-[#101726] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
              role="dialog"
              aria-modal="true"
            >
              {/* Top ambient glow */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Close X button */}
              <button
                type="button"
                onClick={closeConfirm}
                disabled={isLoading}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Trash Icon Badge */}
                <div className="w-13 h-13 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 shadow-inner">
                  <Trash2 className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {options.title || 'Confirmar exclusão'}
                </h3>

                {/* Message */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {options.message || 'Tem certeza que deseja excluir permanentemente este item? Esta ação não pode ser desfeita.'}
                </p>

                {/* Highlighted Item Name (if provided) */}
                {options.itemName && (
                  <div className="w-full mb-5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 font-mono truncate max-w-full">
                    {options.itemName}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={closeConfirm}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                  >
                    {options.cancelText || 'Cancelar'}
                  </button>

                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/40 shadow-lg shadow-rose-900/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isLoading ? 'Excluindo...' : options.confirmText || 'Excluir'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmDeleteContext.Provider>
  );
};

export const useConfirmDelete = () => {
  const context = useContext(ConfirmDeleteContext);
  if (!context) {
    throw new Error('useConfirmDelete deve ser usado dentro de um ConfirmDeleteProvider');
  }
  return context;
};
