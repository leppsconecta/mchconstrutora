import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onFinish?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Faster pulse, then trigger opening animation
    const timer = setTimeout(() => {
      setIsOpening(true);
    }, 400);

    const completionTimer = setTimeout(() => {
      setIsRemoved(true);
      if (onFinish) onFinish();
    }, 1200);

    return () => {
      clearTimeout(timer);
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
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#1B2639] z-20"
        initial={{ x: 0 }}
        animate={isOpening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Right Shutter Panel */}
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#1B2639] z-20"
        initial={{ x: 0 }}
        animate={isOpening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Centered MCH Brand with subtle pulse */}
      <motion.div
        className="relative z-30 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.05 : [0.98, 1.02, 0.98]
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <img
          src="/logos/logotipo_footer_white.png"
          alt="MCH Engenharia &amp; Imobiliária"
          className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
        />
      </motion.div>
    </div>
  );
};

export default Preloader;
