import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

type FilterType = 'all' | 'telecom' | 'civil' | 'reformas';

export default function CasesPage() {
  const { t } = useLanguage();
  const projects = t.cases.projects;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const selectedProject = useMemo(() => {
    if (selectedProjectId === null) return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  const filterOptions = [
    { key: 'all' as FilterType, label: t.cases.filterAll },
    { key: 'telecom' as FilterType, label: t.cases.filterTelecom },
    { key: 'civil' as FilterType, label: t.cases.filterCivil },
    { key: 'reformas' as FilterType, label: t.cases.filterReformas }
  ];

  // Filtra projetos baseado no ID ou categoria
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'all') return projects;
    if (selectedFilter === 'telecom') {
      return projects.filter((p) => p.id === 1 || p.id === 4);
    }
    if (selectedFilter === 'civil') {
      return projects.filter((p) => p.id === 2 || p.id === 5);
    }
    if (selectedFilter === 'reformas') {
      return projects.filter((p) => p.id === 3);
    }
    return projects;
  }, [projects, selectedFilter]);

  // Bloqueia o scroll de toda a página ao fundo quando o modal estiver aberto
  useEffect(() => {
    if (selectedProject) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedProject]);

  // Autoplay do carrossel em cascata a cada 4 segundos
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, projects.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  // Navegação no Modal (ir para o próximo ou anterior)
  const handleModalPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedProject) return;
    const currentIdx = projects.findIndex((p) => p.id === selectedProject.id);
    const prevIdx = (currentIdx - 1 + projects.length) % projects.length;
    setSelectedProjectId(projects[prevIdx].id);
  };

  const handleModalNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedProject) return;
    const currentIdx = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIdx = (currentIdx + 1) % projects.length;
    setSelectedProjectId(projects[nextIdx].id);
  };

  // Navegação por teclado (Setas e ESC) quando o modal está aberto
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleModalPrev();
      } else if (e.key === 'ArrowRight') {
        handleModalNext();
      } else if (e.key === 'Escape') {
        setSelectedProjectId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  // Cálculo de posição para efeito Coverflow / Cascata
  const getSlideProps = (index: number) => {
    const total = projects.length;
    let diff = index - currentIndex;

    if (diff > Math.floor(total / 2)) {
      diff -= total;
    } else if (diff < -Math.floor(total / 2)) {
      diff += total;
    }

    if (diff === 0) {
      return {
        x: '0%',
        scale: 1,
        zIndex: 30,
        opacity: 1,
        rotateY: 0,
        filter: 'brightness(1)',
        pointerEvents: 'auto' as const
      };
    } else if (diff === 1) {
      return {
        x: '60%',
        scale: 0.82,
        zIndex: 20,
        opacity: 0.75,
        rotateY: -8,
        filter: 'brightness(0.7)',
        pointerEvents: 'auto' as const
      };
    } else if (diff === -1) {
      return {
        x: '-60%',
        scale: 0.82,
        zIndex: 20,
        opacity: 0.75,
        rotateY: 8,
        filter: 'brightness(0.7)',
        pointerEvents: 'auto' as const
      };
    } else if (diff === 2) {
      return {
        x: '105%',
        scale: 0.65,
        zIndex: 10,
        opacity: 0.35,
        rotateY: -14,
        filter: 'brightness(0.4)',
        pointerEvents: 'auto' as const
      };
    } else if (diff === -2) {
      return {
        x: '-105%',
        scale: 0.65,
        zIndex: 10,
        opacity: 0.35,
        rotateY: 14,
        filter: 'brightness(0.4)',
        pointerEvents: 'auto' as const
      };
    }

    return {
      x: diff > 0 ? '140%' : '-140%',
      scale: 0.5,
      zIndex: 0,
      opacity: 0,
      rotateY: diff > 0 ? -20 : 20,
      filter: 'brightness(0.2)',
      pointerEvents: 'none' as const
    };
  };

  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">
      {/* =========================================================================
          HERO & CARROSSEL 3D EM CASCATA
          ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 bg-[#1B2639] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Cabeçalho Minimalista da Página */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-3">
              {t.cases.heroTag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.cases.heroTitle}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.cases.heroSubtitle}
            </p>
          </div>

          {/* PALCO DO CARROSSEL EM CASCATA COM PERSPECTIVA 3D */}
          <div
            className="relative h-[360px] sm:h-[440px] md:h-[480px] w-full max-w-5xl mx-auto flex items-center justify-center perspective-[1200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {projects.map((proj, idx) => {
              const slide = getSlideProps(idx);
              const isCenter = idx === currentIndex;

              return (
                <motion.div
                  key={proj.id}
                  animate={{
                    x: slide.x,
                    scale: slide.scale,
                    zIndex: slide.zIndex,
                    opacity: slide.opacity,
                    rotateY: slide.rotateY,
                    filter: slide.filter
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedProjectId(proj.id);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  className={`absolute w-[82%] sm:w-[68%] md:w-[60%] h-[320px] sm:h-[400px] md:h-[430px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer border border-white/10 group select-none ${
                    isCenter ? 'ring-2 ring-cyan-400/50 shadow-cyan-500/10' : ''
                  }`}
                  style={{ pointerEvents: slide.pointerEvents }}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639] via-[#1B2639]/40 to-transparent" />

                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 space-y-2 z-20">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold uppercase tracking-wider text-cyan-300 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                        {proj.category}
                      </span>
                      <span className="text-white/60">·</span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {proj.location}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug line-clamp-2">
                      {proj.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}

            {/* Botões de Navegação Lateral */}
            <button
              onClick={handlePrev}
              aria-label="Anterior"
              className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-[#1B2639]/80 hover:bg-[#1B2639] text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo"
              className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-[#1B2639]/80 hover:bg-[#1B2639] text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicadores de Bolinhas */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {projects.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Case ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-8 h-2.5 bg-cyan-400'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          GRADE DE CARDS DOS PROJETOS (AO CLICAR EXPANDE)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block mb-1">
                {t.cases.heroTag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2639] tracking-tight">
                {t.cases.heroTitle}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                {t.cases.viewDetails}
              </p>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap items-center gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedFilter(opt.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFilter === opt.key
                      ? 'bg-[#1B2639] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cards de Projetos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedProjectId(item.id)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#1B2639]/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#1B2639] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1B2639] tracking-tight group-hover:text-[#141d2c] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1B2639] group-hover:underline flex items-center gap-1.5">
                    <span>{t.cases.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{t.cases.deliveredOnTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          MODAL EXPANSIVO
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ overscrollBehavior: 'contain' }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProjectId(null)}
              className="fixed inset-0 bg-[#0c131f]/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full h-[520px] max-h-[92vh] bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-200 flex flex-col md:flex-row items-stretch"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão Fechar no Topo Direito */}
              <button
                onClick={() => setSelectedProjectId(null)}
                aria-label={t.cases.modalClose}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1B2639] flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LADO ESQUERDO: IMAGEM */}
              <div className="w-full md:w-[48%] h-[240px] md:h-full p-4 sm:p-5 shrink-0 flex items-center justify-center bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md group border border-slate-200 bg-slate-900 flex items-center justify-center">
                  <img
                    key={selectedProject.id}
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Seta Voltar na Imagem */}
                  <button
                    onClick={handleModalPrev}
                    aria-label="Anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95 border border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Seta Próximo na Imagem */}
                  <button
                    onClick={handleModalNext}
                    aria-label="Próximo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95 border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Indicador de Número */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/10 pointer-events-none">
                    {projects.findIndex((p) => p.id === selectedProject.id) + 1} / {projects.length}
                  </div>
                </div>
              </div>

              {/* LADO DIREITO: AS INFORMAÇÕES E DESCRIÇÃO DO PROJETO */}
              <div className="flex-1 h-full p-6 sm:p-8 flex flex-col justify-center overflow-y-auto space-y-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#1B2639] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {selectedProject.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#1B2639]" />
                    {selectedProject.location}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2639] tracking-tight leading-snug">
                  {selectedProject.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#1B2639] block">
                    {t.cases.highlightsTitle}
                  </span>
                  {selectedProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
