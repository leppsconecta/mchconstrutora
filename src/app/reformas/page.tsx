import React from 'react';
import {
  Wrench,
  Zap,
  Paintbrush,
  Sparkles,
  HardHat,
  Hammer,
  Ruler,
  Key
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const stepCardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

export default function ReformasPage() {
  const { t } = useLanguage();

  const maintenanceServices = [
    {
      title: t.reformas.service1Title,
      desc: t.reformas.service1Desc,
      icon: Wrench
    },
    {
      title: t.reformas.service2Title,
      desc: t.reformas.service2Desc,
      icon: Zap
    },
    {
      title: t.reformas.service3Title,
      desc: t.reformas.service3Desc,
      icon: Paintbrush
    },
    {
      title: t.reformas.service4Title,
      desc: t.reformas.service4Desc,
      icon: Sparkles
    }
  ];

  const steps = [
    {
      step: '01',
      title: t.reformas.step1Title,
      desc: t.reformas.step1Desc,
      icon: Ruler
    },
    {
      step: '02',
      title: t.reformas.step2Title,
      desc: t.reformas.step2Desc,
      icon: Hammer
    },
    {
      step: '03',
      title: t.reformas.step3Title,
      desc: t.reformas.step3Desc,
      icon: HardHat
    },
    {
      step: '04',
      title: t.reformas.step4Title,
      desc: t.reformas.step4Desc,
      icon: Key
    }
  ];

  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">

      {/* SEÇÃO 1: SERVIÇOS PREDIAIS & MANUTENÇÃO */}
      <section className="py-10 sm:py-14 bg-[#1B2639] text-white border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            
            {/* Informações (Lado Esquerdo) */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between py-1">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
                  {t.reformas.heroTag}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {t.reformas.heroTitle}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                  {t.reformas.heroSubtitle}
                </p>
              </div>

              {/* Cards de Especialidades */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
              >
                {maintenanceServices.map((serv, idx) => {
                  const Icon = serv.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={cardItemVariants}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="p-4 rounded-xl bg-white text-[#1B2639] border border-slate-100 shadow-md space-y-1.5 hover:shadow-xl transition-shadow cursor-default"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1B2639]/10 flex items-center justify-center text-[#1B2639]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-[#1B2639]">{serv.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {serv.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

            </div>

            {/* Imagem (Lado Direito) */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-0 rounded-2xl overflow-hidden shadow-2xl group border border-white/10 flex">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
                  alt="Serviços prediais e manutenção técnica especializada"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 2: RESUMO DAS ETAPAS DO PROCESSO CONSTRUTIVO */}
      <section className="py-10 sm:py-14 bg-white border-t border-slate-200/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-8 sm:mb-10 space-y-2"
          >
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block">
              {t.reformas.processTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2639] tracking-tight">
              {t.reformas.processTitle}
            </h2>
            <p className="text-sm text-slate-600">
              {t.reformas.processSubtitle}
            </p>
          </motion.div>

          {/* Cards das 4 etapas */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={idx}
                  variants={stepCardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="p-6 rounded-xl bg-[#1B2639] text-white border border-slate-700/60 shadow-lg hover:shadow-2xl transition-shadow space-y-4 cursor-default"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {t.reformas.stepWord} {s.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

    </div>
  );
}
