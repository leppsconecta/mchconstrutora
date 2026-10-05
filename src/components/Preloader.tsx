import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MchEmblemAnimated } from './MchEmblemAnimated';

interface PreloaderProps {
  onFinish?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // 1. As peças do logo M convergem e formam o emblema (~1.15s)
    // 2. Abertura da página em exatamente 2 segundos (2000ms)
    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 2000);

    // 3. Conclusão total do deslizamento dos painéis e liberação da página (~2.8s)
    const completionTimer = setTimeout(() => {
      setIsRemoved(true);
      if (onFinish) onFinish();
    }, 2850);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(completionTimer);
    };
  }, [onFinish]);

  if (isRemoved) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Left Shutter Panel */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#1B2639] z-20 border-r border-white/5"
        initial={{ x: 0 }}
        animate={isOpening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Right Shutter Panel */}
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#1B2639] z-20 border-l border-white/5"
        initial={{ x: 0 }}
        animate={isOpening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Central Content Container - Apenas o Logotipo M isolado */}
      <motion.div
        className="relative z-30 flex flex-col items-center justify-center text-center px-6"
        initial={{ opacity: 1 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.08 : 1,
        }}
        transition={{
          opacity: { duration: 0.35 },
          scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        {/* Glow suave e estático de profundidade arquitetônica */}
        <div className="absolute -inset-20 bg-radial from-cyan-500/10 via-white/5 to-transparent blur-3xl pointer-events-none" />

        {/* Emblema Arquitetônico M cujas peças vêm voando dos cantos da página */}
        <div className="relative flex items-center justify-center">
          <MchEmblemAnimated
            size={165}
            theme="light"
            animate={true}
            assemblyAnimation={true}
            className="filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.55)]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Preloader;
