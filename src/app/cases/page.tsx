import React, { useState, useEffect } from 'react';
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

interface CaseProject {
  id: number;
  title: string;
  category: 'Telecomunicações' | 'Construção Civil' | 'Reformas Prediais';
  location: string;
  timeframe: string;
  image: string;
  description: string;
  highlights: string[];
}

const CAROUSEL_PROJECTS: CaseProject[] = [
  {
    id: 1,
    title: 'Implantação de Base Civil para Torre de Telecomunicações 5G/6G',
    category: 'Telecomunicações',
    location: 'Região Metropolitana de São Paulo',
    timeframe: 'Entregue em 35 dias (100% no prazo)',
    image: '/hero-bg.jpg',
    description:
      'Execução de fundação maciça contínua de alta capacidade para suporte a torre autoportante metálica de 42 metros, absorvendo cargas dinâmicas de vento de até 180 km/h sem recalque estrutural.',
    highlights: [
      'Bloco de coroamento com 48m³ de concreto usinado FCK 35MPa',
      'Malha profunda de aterramento SPDA com índice inferior a 4 Ohms',
      'Emissão de ART e conformidade integral com normas Telebrás e ABNT'
    ]
  },
  {
    id: 2,
    title: 'Construção Civil Residencial Turnkey de Alto Padrão - Caliandras 2',
    category: 'Construção Civil',
    location: 'Portal dos Ipês, Cajamar - SP',
    timeframe: 'Entrega Chave na Mão',
    image: '/casa-alto-padrao.jpg',
    description:
      'Residência de alto padrão construída desde a análise do terreno até a entrega definitiva das chaves, com acabamentos nobres, esquadrias pretas e ambientes mobiliados e decorados.',
    highlights: [
      'Estrutura em concreto armado com vãos livres e pé-direito duplo',
      'Esquadrias nobres com isolamento termoacústico e porcelanatos de grande formato',
      'Habite-se 100% regularizado e averbado em cartório'
    ]
  },
  {
    id: 3,
    title: 'Adequação Estrutural e Reforma de Galpão B2B (4.200 m²)',
    category: 'Reformas Prediais',
    location: 'Polo Logístico de Cajamar - SP',
    timeframe: 'Entregue em 60 dias sem interrupção',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Intervenção técnica completa em galpão logístico corporativo com recuperação de piso epóxi de alto tráfego, revisão elétrica de média tensão e modernização de docas industriais.',
    highlights: [
      'Piso com capacidade de suporte de 6 toneladas por m²',
      'Adequação técnica integral às normas NR-10 e NR-18',
      'Vistoria e emissão célere de AVCB junto ao Corpo de Bombeiros'
    ]
  },
  {
    id: 4,
    title: 'Reforço Estrutural e Instalação de Torre em Topo de Edifício (Rooftop)',
    category: 'Telecomunicações',
    location: 'Av. Paulista, São Paulo - SP',
    timeframe: '20 dias em regime de janela técnica',
    image: '/imagem_torre.png',
    description:
      'Instalação de mastro e antenas em laje de cobertura com reforço metálico distribuído, chumbamentos químicos testados e impermeabilização multicamadas com teste de estanqueidade.',
    highlights: [
      'Içamento com guindaste e plano de rigging aprovado pelos órgãos de trânsito',
      'Impermeabilização com manta asfáltica e teste de estanqueidade de 72h',
      'Zero interrupção nas atividades do condomínio corporativo'
    ]
  },
  {
    id: 5,
    title: 'Edificação Corporativa & Engenharia Completa',
    category: 'Construção Civil',
    location: 'Polo Metropolitano de São Paulo',
    timeframe: 'Concluído com rigor normativo',
    image: '/quem-somos-projetos.jpg',
    description:
      'Gerenciamento civil integral do projeto estrutural ao acabamento definitivo de áreas comerciais e residenciais com equipe própria e métodos modernos de engenharia civil.',
    highlights: [
      'Sondagem geológica e cálculo estrutural detalhado',
      'Materiais de primeira linha certificados pelo PBQP-H',
      'Equipe interna especializada com seguro de vida e EPIs'
    ]
  }
];

export default function CasesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CaseProject | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Telecomunicações' | 'Construção Civil' | 'Reformas Prediais'>('Todos');

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

  // Autoplay do carrossel em cascata a cada 4 segundos (pausa quando o mouse está sobre o carrossel)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_PROJECTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_PROJECTS.length) % CAROUSEL_PROJECTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_PROJECTS.length);
  };

  // Navegação no Modal (ir para o próximo ou anterior)
  const handleModalPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedProject) return;
    const currentIdx = CAROUSEL_PROJECTS.findIndex((p) => p.id === selectedProject.id);
    const prevIdx = (currentIdx - 1 + CAROUSEL_PROJECTS.length) % CAROUSEL_PROJECTS.length;
    setSelectedProject(CAROUSEL_PROJECTS[prevIdx]);
  };

  const handleModalNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedProject) return;
    const currentIdx = CAROUSEL_PROJECTS.findIndex((p) => p.id === selectedProject.id);
    const nextIdx = (currentIdx + 1) % CAROUSEL_PROJECTS.length;
    setSelectedProject(CAROUSEL_PROJECTS[nextIdx]);
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
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  // Cálculo de posição para efeito Coverflow / Cascata
  const getSlideProps = (index: number) => {
    const total = CAROUSEL_PROJECTS.length;
    let diff = index - currentIndex;

    // Normaliza para o menor caminho no círculo
    if (diff > Math.floor(total / 2)) {
      diff -= total;
    } else if (diff < -Math.floor(total / 2)) {
      diff += total;
    }

    if (diff === 0) {
      // 1 - CENTRAL
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
      // Direita 1 (efeito cascata lateral)
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
      // Esquerda 1 (efeito cascata lateral)
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
      // Direita 2
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
      // Esquerda 2
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
      rotateY: 0,
      filter: 'brightness(0.2)',
      pointerEvents: 'none' as const
    };
  };

  const filteredProjects = selectedFilter === 'Todos'
    ? CAROUSEL_PROJECTS
    : CAROUSEL_PROJECTS.filter((p) => p.category === selectedFilter);

  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">
      
      {/* =========================================================================
          HERO SECTION COM CARROSSEL EM CASCATA
          ========================================================================= */}
      <section className="relative pt-8 pb-14 sm:pt-12 sm:pb-20 bg-[#1B2639] text-white overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* PALCO DO CARROSSEL EM CASCATA (COVERFLOW 3D PERSPECTIVE) */}
          <div
            className="relative w-full max-w-5xl mx-auto h-[340px] sm:h-[440px] md:h-[480px] flex items-center justify-center perspective-[1200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {CAROUSEL_PROJECTS.map((proj, idx) => {
              const slideProps = getSlideProps(idx);
              const isCenter = idx === currentIndex;

              return (
                <motion.div
                  key={proj.id}
                  animate={slideProps}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedProject(proj);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  className="absolute w-[82%] sm:w-[68%] md:w-[60%] lg:w-[54%] h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer group select-none border border-white/15 bg-[#141d2c]"
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Imagem do Case */}
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Overlay gradiente para legibilidade das informações */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639] via-[#1B2639]/40 to-transparent" />

                  {/* Informações no Card */}
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

            {/* Botões de Navegação Lateral Esquerda / Direita */}
            <button
              onClick={handlePrev}
              aria-label="Projeto anterior"
              className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-[#1B2639]/80 hover:bg-[#1B2639] text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo projeto"
              className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-[#1B2639]/80 hover:bg-[#1B2639] text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicadores de Bolinhas (Dots) abaixo do carrossel */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {CAROUSEL_PROJECTS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Ir para case ${dotIdx + 1}`}
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
          SEÇÃO ABAIXO: CARDS DOS PROJETOS JÁ FEITOS (AO CLICAR EXPANDE)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Cabeçalho da Grade de Cards */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block mb-1">
                Portfólio de Obras
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2639] tracking-tight">
                Projetos Entregues no Canteiro de Obras
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Clique em qualquer projeto abaixo para visualizar os detalhes técnicos.
              </p>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap items-center gap-2">
              {(['Todos', 'Telecomunicações', 'Construção Civil', 'Reformas Prediais'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFilter === cat
                      ? 'bg-[#1B2639] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {cat}
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
                onClick={() => setSelectedProject(item)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Foto com Efeito Zoom */}
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

                  {/* Informações Rápidas */}
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
                    <span>Ver detalhes do projeto</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Concluído</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          MODAL EXPANSIVO: IMAGEM 4x4 COM BORDAS ARREDONDADAS + DESCRIÇÃO AO LADO DIREITO
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Backdrop escuro com desfoque que bloqueia 100% o fundo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-[#0c131f]/85 backdrop-blur-md cursor-pointer"
            />

            {/* Container Principal: Imagem 4x4 na Esquerda | Informações e Descrição na Direita */}
            {/* Modal Box com Tamanho Fixo */}
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
                onClick={() => setSelectedProject(null)}
                aria-label="Fechar modal"
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1B2639] flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LADO ESQUERDO: IMAGEM ENCAIXADA VERTICALMENTE COM BORDAS ARREDONDADAS E NAVEGAÇÃO */}
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
                    aria-label="Projeto anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95 border border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Seta Próximo na Imagem */}
                  <button
                    onClick={handleModalNext}
                    aria-label="Próximo projeto"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95 border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Indicador de Número */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/10 pointer-events-none">
                    {CAROUSEL_PROJECTS.findIndex((p) => p.id === selectedProject.id) + 1} / {CAROUSEL_PROJECTS.length}
                  </div>
                </div>
              </div>

              {/* LADO DIREITO: AS INFORMAÇÕES E DESCRIÇÃO DO PROJETO */}
              <div className="flex-1 h-full p-6 sm:p-8 flex flex-col justify-center overflow-y-auto space-y-4">
                {/* Badge e Localização */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#1B2639] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {selectedProject.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#1B2639]" />
                    {selectedProject.location}
                  </span>
                </div>

                {/* Título */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2639] tracking-tight leading-snug">
                  {selectedProject.title}
                </h3>

                {/* Descrição ao Lado Direito */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Destaques Técnicos */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#1B2639] block">
                    Diferenciais Executivos:
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
