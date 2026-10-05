import React from 'react';
import { motion } from 'framer-motion';

const LOGOS_ROW_1 = [
  '/logos/Cajamar.png',
  '/logos/Claro.png',
  '/logos/JBS.png',
  '/logos/Seara.png',
  '/logos/Sites.png'
];

const LOGOS_ROW_2 = [
  '/logos/Sites.png',
  '/logos/Seara.png',
  '/logos/JBS.png',
  '/logos/Claro.png',
  '/logos/Cajamar.png'
];

const LogoItem = ({ src }: { src: string }) => (
  <div className="group relative w-40 h-20 mx-6 sm:mx-10 flex-shrink-0 cursor-pointer">
    {/* Imagem original colorida (Visível no Hover) */}
    <img 
      src={src} 
      alt="Partner Logo" 
      className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 drop-shadow-sm" 
    />
    {/* Máscara Azul Marinho (Visível por Padrão) */}
    <div 
      className="absolute inset-0 bg-[#1B2639] group-hover:opacity-0 transition-opacity duration-300"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center'
      }}
    />
  </div>
);

export const Marquee: React.FC = () => {
  // Triple array to guarantee a seamless, uninterrupted loop
  const row1 = [...LOGOS_ROW_1, ...LOGOS_ROW_1, ...LOGOS_ROW_1, ...LOGOS_ROW_1];
  const row2 = [...LOGOS_ROW_2, ...LOGOS_ROW_2, ...LOGOS_ROW_2, ...LOGOS_ROW_2];

  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold">
          Parcerias de Confiança Institucional
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        
        {/* ROW 1 - Scrolling Left */}
        <motion.div
          className="flex items-center whitespace-nowrap w-max"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            ease: 'linear',
            duration: 25,
            repeat: Infinity
          }}
        >
          {row1.map((src, index) => (
            <LogoItem key={`r1-${index}`} src={src} />
          ))}
        </motion.div>

        {/* ROW 2 - Scrolling Right */}
        <motion.div
          className="flex items-center whitespace-nowrap w-max"
          animate={{ x: ['-33.333%', '0%'] }}
          transition={{
            ease: 'linear',
            duration: 25,
            repeat: Infinity
          }}
        >
          {row2.map((src, index) => (
            <LogoItem key={`r2-${index}`} src={src} />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Marquee;
