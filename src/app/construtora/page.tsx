import React from 'react';
import {
  HardHat,
  CheckCircle2,
  ArrowRight,
  Hammer,
  Ruler,
  Key
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';
import { SeoHead } from '../../components/SeoHead';
import { getBreadcrumbSchema, getServiceSchema } from '../../lib/schemas';
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

export default function ConstrutoraPage() {
  const { t } = useLanguage();
  const { siteConfig } = useSiteConfig();

  const heroMediaUrl = siteConfig.hero_construtora_media_url || 'https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/public/machado_construtora/site/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4';
  const isVideo = siteConfig.hero_construtora_media_type === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(heroMediaUrl);

  const steps = [
    {
      step: '01',
      title: t.construtora.step1Title,
      desc: t.construtora.step1Desc,
      icon: Ruler
    },
    {
      step: '02',
      title: t.construtora.step2Title,
      desc: t.construtora.step2Desc,
      icon: Hammer
    },
    {
      step: '03',
      title: t.construtora.step3Title,
      desc: t.construtora.step3Desc,
      icon: HardHat
    },
    {
      step: '04',
      title: t.construtora.step4Title,
      desc: t.construtora.step4Desc,
      icon: Key
    }
  ];

  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">
      <SeoHead
        title="Construção Civil e Casas Turnkey em Cajamar | Machado"
        description="Execução completa de residências e obras civis do terreno à entrega de chaves em Cajamar e SP. Mão de obra própria e CREA-SP. Conheça nossos projetos!"
        canonicalPath="/construtora"
        image="/casa-alto-padrao.jpg"
        jsonLd={[
          getBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Construtora', path: '/construtora' }
          ]),
          getServiceSchema({
            name: 'Construção Civil Residencial Turnkey e Incorporação',
            description: 'Execução integral de residências e obras civis do terreno à entrega das chaves com equipe própria e acompanhamento técnico CREA-SP.',
            path: '/construtora',
            serviceType: 'Construção Civil'
          })
        ]}
      />

      {/* HERO SECTION COM VÍDEO REAL DO PROJETO CALIANDRAS 2 (MACHADO) */}
      <section className="relative flex flex-col lg:flex-row overflow-hidden bg-[#1B2639] lg:h-[480px]">
        {/* Lado Esquerdo: Imagem + Texto (60%) */}
        <div className="relative w-full lg:w-[60%] flex items-center justify-center lg:justify-start lg:pl-16 xl:pl-20 px-6 sm:px-10 py-14 lg:py-0 group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[4s] ease-out" 
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=2000&q=80")' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B2639]/95 via-[#1B2639]/80 to-[#1B2639]/95 lg:bg-gradient-to-r lg:from-[#1B2639] lg:via-[#1B2639]/85 lg:to-transparent" />
          
          <div className="relative z-10 max-w-xl text-left">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-3">
              {t.construtora.heroTag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white leading-tight">
              {t.construtora.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-light mb-7">
              {t.construtora.heroSubtitle}
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-colors shadow-xl"
            >
              <span>{t.construtora.heroCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lado Direito: Mídia do Hero (Vídeo ou Imagem) (40%) */}
        <div className="relative w-full lg:w-[40%] h-[260px] sm:h-[300px] lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden group">
          {isVideo ? (
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
              alt="Obras e casas de alto padrão turnkey - Machado Construtora em Cajamar e SP"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[4s] ease-out"
            />
          )}
          <div className="absolute inset-0 bg-[#1B2639]/10 pointer-events-none" />
        </div>
      </section>

      {/* SEÇÃO 1: CONSTRUÇÃO DE CASAS DO BÁSICO AO ACABAMENTO */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Imagem (Lado Esquerdo) */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                <img
                  src="/casa-alto-padrao.jpg"
                  alt="Casa de alto padrão residencial construída pela Machado Construtora em Cajamar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

            {/* Informações (Lado Direito) */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="space-y-4">
                <p className="text-base text-[#1B2639] font-bold leading-relaxed">
                  {t.construtora.section1Title}
                </p>

                <p className="text-base text-slate-600 leading-relaxed">
                  {t.construtora.section1Desc}
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{t.construtora.bullet1Title}</strong> {t.construtora.bullet1Desc}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{t.construtora.bullet2Title}</strong> {t.construtora.bullet2Desc}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{t.construtora.bullet3Title}</strong> {t.construtora.bullet3Desc}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all shadow-md hover:shadow-lg"
                >
                  <span>{t.construtora.section1Cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 2: RESUMO DAS ETAPAS DO PROCESSO CONSTRUTIVO */}
      <section className="py-20 sm:py-28 bg-[#F8F9FA] border-t border-slate-200/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-14 space-y-2"
          >
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block">
              {t.construtora.processTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2639] tracking-tight">
              {t.construtora.processTitle}
            </h2>
            <p className="text-sm text-slate-600">
              {t.construtora.processSubtitle}
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
                      {t.construtora.stepWord} {s.step}
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

      {/* CTA FINAL */}
      <section className="py-24 bg-[#1B2639] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            {t.construtora.ctaTitle}
          </h2>
          <p className="text-slate-300 mb-10 text-lg">
            {t.construtora.ctaSubtitle}
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-colors shadow-xl"
          >
            <span>{t.construtora.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
