import React from 'react';
import { motion } from 'framer-motion';

const PARTNERS = [
  'Claro',
  'Sites',
  'JBS',
  'Seara',
  'Prefeitura de Cajamar'
];

export const Marquee: React.FC = () => {
  // Triple array to guarantee a seamless, uninterrupted loop
  const repeatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold">
          Parcerias &amp; Confiança Institucional
        </p>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex items-center gap-16 whitespace-nowrap w-max"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            ease: 'linear',
            duration: 18,
            repeat: Infinity
          }}
        >
          {repeatedPartners.map((partner, index) => (
            <div
              key={`${partner}-${index}`}
              className="flex items-center gap-3 px-6 py-2 text-[#9F9F9F] hover:text-[#1B2639] transition-colors"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight uppercase font-mono">
                {partner}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Marquee;
