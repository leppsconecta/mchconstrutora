import React from 'react';
import {
  Wrench,
  Zap,
  Paintbrush,
  Sparkles,
  HardHat,
  Hammer,
  Ruler,
  Key,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';
import { SeoHead } from '../../components/SeoHead';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

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
  const { siteConfig } = useSiteConfig();

  const heroMediaUrl = siteConfig.hero_reformas_media_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80';
  const isHeroVideo = siteConfig.hero_reformas_media_type === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(heroMediaUrl);
  const secao2ImgUrl = siteConfig.reformas_secao2_img_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80';

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
      <SeoHead
        title="Reformas Prediais e Corporativas B2B em Cajamar e SP"
        description="Adequação e manutenção predial civil, elétrica e hidráulica para galpões, escritórios e condomínios em SP. Peça seu orçamento técnico sem compromisso!"
        canonicalPath="/reformas"
        image="/casa-alto-padrao.jpg"
      />

      {/* HERO SECTION DE REFORMAS (REFERÊNCIA HERO DE CONSTRUTORA) */}
      <section className="relative flex flex-col lg:flex-row overflow-hidden bg-[#1B2639] lg:h-[480px]">
        {/* Lado Esquerdo: Imagem + Texto (60%) */}
        <div className="relative w-full lg:w-[60%] flex items-center justify-center lg:justify-start lg:pl-16 xl:pl-20 px-6 sm:px-10 py-14 lg:py-0 group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[4s] ease-out" 
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80")' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B2639]/95 via-[#1B2639]/80 to-[#1B2639]/95 lg:bg-gradient-to-r lg:from-[#1B2639] lg:via-[#1B2639]/85 lg:to-transparent" />
          
          <div className="relative z-10 max-w-xl text-left">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-3">
              {t.reformas.heroTag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white leading-tight">
              {t.reformas.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-light mb-7">
              {t.reformas.heroSubtitle}
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-colors shadow-xl"
            >
              <span>{t.common.requestProposal}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lado Direito: Mídia de Destaque de Reforma (Vídeo ou Imagem) (40%) */}
        <div className="relative w-full lg:w-[40%] h-[260px] sm:h-[300px] lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden group">
          {isHeroVideo ? (
            <video 
              src={heroMediaUrl}
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <img 
              src={heroMediaUrl}
              alt="Reformas e Manutenção Predial Machado"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[4s] ease-out"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639]/50 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#1B2639]/30 pointer-events-none" />
        </div>
      </section>

      {/* SEÇÃO 1: SERVIÇOS PREDIAIS & MANUTENÇÃO (SEPARADA ABAIXO DO HERO) */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Informações e Cards de Especialidades (Lado Esquerdo - 6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block">
                  {t.reformas.heroTag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2639] tracking-tight">
                  Serviços Especializados de Manutenção &amp; Reforma
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Equipes multidisciplinares próprias, preparadas para atuar com rapidez, rigor técnico e alto padrão de acabamento em qualquer tipo de imóvel.
                </p>
              </div>

              {/* Cards de Especialidades */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
              >
                {maintenanceServices.map((serv, idx) => {
                  const Icon = serv.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={cardItemVariants}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="p-5 rounded-xl bg-slate-50 text-[#1B2639] border border-slate-200 shadow-sm space-y-2 hover:shadow-lg hover:border-slate-300 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#1B2639] flex items-center justify-center text-white shadow-sm">
                          <Icon className="w-4 h-4 text-cyan-400" />
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

            {/* Imagem (Lado Direito - 6 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group border border-slate-100 flex">
                <img
                  src={secao2ImgUrl}
                  alt="Serviços prediais e manutenção técnica especializada"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 2: RESUMO DAS ETAPAS DO PROCESSO CONSTRUTIVO */}
      <section className="py-20 sm:py-24 bg-[#F8F9FA] border-t border-slate-200/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-12 sm:mb-16 space-y-2"
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

      {/* SEÇÃO 3: CTA FINAL */}
      <section className="py-16 sm:py-20 bg-[#1B2639] text-white text-center border-t border-white/10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pronto para transformar ou modernizar seu imóvel?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Nossos consultores e engenheiros estão à disposição para realizar vistorias técnicas e apresentar a melhor solução de reforma para seu patrimônio.
          </p>
          <div className="pt-2">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-colors shadow-2xl"
            >
              <span>Solicitar Orçamento de Reforma</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
