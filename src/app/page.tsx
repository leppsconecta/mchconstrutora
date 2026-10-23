import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { HardHat, Radio, Building2, ArrowRight } from 'lucide-react';
import { Link } from '../components/Link';
import { Marquee } from '../components/Marquee';
import { SeoHead } from '../components/SeoHead';
import { getLocalBusinessSchema } from '../lib/schemas';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';

export default function HomePage() {
  const { t } = useLanguage();
  const { siteConfig } = useSiteConfig();

  const heroMediaUrl = siteConfig.hero_home_media_url || '/hero-bg.jpg';
  const isVideo = siteConfig.hero_home_media_type === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(heroMediaUrl);

  // Parallax interativo com mouse suave para a Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Efeito parallax sutil e elegante
  const parallaxX = useSpring(mousePos.x * 14, { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(mousePos.y * 14, { stiffness: 60, damping: 20 });

  return (
    <div className="bg-white text-[#1B2639]">
      <SeoHead
        title="Machado Construtora e Incorporadora | Obras e Reformas SP"
        description="Construtora e incorporadora em Cajamar e SP. Obras civis turnkey, infraestrutura de telecom e reformas prediais B2B. Solicite sua proposta agora!"
        canonicalPath="/"
        image="/casa-alto-padrao.jpg"
        jsonLd={getLocalBusinessSchema()}
      />
      {/* =========================================================================
          2. HERO SECTION COM FOTOGRAFIA DA BASE DE TORRE
          ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1B2639] group"
      >
        {/* MÍDIA DINÂMICA (IMAGEM COM PARALLAX OU VÍDEO EM LOOP) */}
        {isVideo ? (
          <div className="absolute inset-0 overflow-hidden">
            <video
              src={heroMediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
        ) : (
          <motion.div
            className="absolute inset-0 bg-cover scale-105 group-hover:scale-110 transition-transform duration-[3s] ease-out"
            style={{
              backgroundImage: `url(${heroMediaUrl})`,
              backgroundPosition: 'right 30% center',
              x: parallaxX,
              y: parallaxY
            }}
          />
        )}
        
        {/* Overlay escuro em gradiente da esquerda para direita para destacar o texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2639]/95 via-[#1B2639]/40 to-transparent pointer-events-none" />

        {/* TEXTO SUBINDO (Sequência Escalada com Slide Up) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-start mt-20 sm:mt-0">
          <div className="max-w-3xl text-left">
            {/* Frase de impacto */}
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
            >
              {t.home.heroTitle}
            </motion.h1>

            {/* Texto de apoio */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl"
            >
              {t.home.heroSubtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. NOSSAS FRENTES DE ATUAÇÃO (Os 3 Pilares com Efeitos Interativos)
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Cabeçalho da Seção */}
          <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
              {t.home.pillarsTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2639] tracking-tight">
              {t.home.pillarsTitle}
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {t.home.pillarsSubtitle}
            </p>
          </div>

          {/* Grid de 3 Cards com Efeitos Interativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* CARD 1: Construção Civil e Incorporação */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/70 hover:border-[#1B2639]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1B2639] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

              <div>
                <div className="w-14 h-14 rounded-xl bg-[#1B2639] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141d2c] group-hover:rotate-2 transition-all duration-300">
                  <HardHat className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#1B2639] tracking-tight mb-3 group-hover:text-[#141d2c] transition-colors">
                  {t.home.pillar1Title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.home.pillar1Desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/construtora"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] group-hover:text-[#25344d] transition-colors"
                >
                  <span>{t.home.pillar1Link}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1B2639] transition-colors" />
              </div>
            </motion.div>

            {/* CARD 2: Infraestrutura para Telecomunicações */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl shadow-md border-2 border-[#1B2639]/30 hover:border-[#1B2639] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1B2639] via-cyan-600 to-[#1B2639]" />

              <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider text-[#1B2639] bg-slate-100 px-2.5 py-1 rounded border border-slate-200/80">
                {t.home.pillar2Badge}
              </div>

              <div>
                <div className="w-14 h-14 rounded-xl bg-[#1B2639] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141d2c] group-hover:-rotate-2 transition-all duration-300">
                  <Radio className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#1B2639] tracking-tight mb-3">
                  {t.home.pillar2Title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.home.pillar2Desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/telecomunicacoes"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] group-hover:text-black transition-colors"
                >
                  <span>{t.home.pillar2Link}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-200" />
                </Link>
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
              </div>
            </motion.div>

            {/* CARD 3: Reformas Prediais (B2B) */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/70 hover:border-[#1B2639]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1B2639] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

              <div>
                <div className="w-14 h-14 rounded-xl bg-[#1B2639] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141d2c] group-hover:rotate-2 transition-all duration-300">
                  <Building2 className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#1B2639] tracking-tight mb-3 group-hover:text-[#141d2c] transition-colors">
                  {t.home.pillar3Title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.home.pillar3Desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/reformas"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] group-hover:text-[#25344d] transition-colors"
                >
                  <span>{t.home.pillar3Link}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1B2639] transition-colors" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SOBRE NOSSA EXPERIÊNCIA (+10 ANOS)
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#1B2639] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            {/* Lado Esquerdo: Imagem Planejamento de Obra */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex">
              <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-0 rounded-2xl overflow-hidden shadow-2xl group border border-white/10 flex">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80"
                  alt="Planejamento técnico de engenharia e gestão de obras civis em Cajamar - Machado Construtora"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-[#1B2639]/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-[1.5s]" />
              </div>
            </div>

            {/* Lado Direito: Texto com Experiência */}
            <div className="lg:col-span-6 space-y-7 order-1 lg:order-2 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
                  {t.home.historyTag}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {t.home.historyTitle}
                </h2>
                <p className="mt-4 text-base text-slate-300 leading-relaxed">
                  {t.home.historyDesc}
                </p>
              </div>

              {/* Tópicos Minimalistas */}
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                    <HardHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t.home.historyCard1Title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t.home.historyCard1Desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t.home.historyCard2Title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t.home.historyCard2Desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t.home.historyCard3Title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t.home.historyCard3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECÇÃO DE PARCEIROS (Marquee Limpo em Fundo Branco)
          ========================================================================= */}
      <Marquee />
    </div>
  );
}
