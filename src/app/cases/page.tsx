import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  HardHat,
  Radio,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '../../components/Link';

interface CaseProject {
  id: number;
  title: string;
  category: 'Telecomunicações' | 'Construção Civil' | 'Reformas Prediais';
  location: string;
  timeframe: string;
  image: string;
  description: string;
  detailedDesc: string;
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
      'Execução de fundação de alta capacidade para suporte a torre autoportante metálica de 42 metros de altura.',
    detailedDesc:
      'Execução integral de fundação de alta capacidade para suporte a torre autoportante metálica de 42 metros. O projeto exigiu escavação controlada, armação pesada de aço CA-50 e concretagem maciça contínua com FCK 35MPa para absorver cargas dinâmicas de vento de até 180 km/h, sem qualquer recalque estrutural.',
    highlights: [
      'Bloco de coroamento com 48m³ de concreto usinado aditivado',
      'Malha profunda de aterramento SPDA com índice inferior a 4 Ohms',
      'Instalação de cercamento perimetral, cabines e esteiramentos',
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
      'Residência contemporânea entregue pronta para morar com equipe 100% própria de engenharia e acabamentos nobres.',
    detailedDesc:
      'Edificação residencial de alto padrão concebida desde a análise geotécnica do terreno até a entrega definitiva das chaves com ambientes mobiliados e decorados. Gestão 100% própria da Machado Engenharia, com supervisão diária de engenheiros civis no canteiro.',
    highlights: [
      'Estrutura em concreto armado com vãos livres e pé-direito duplo',
      'Esquadrias nobres em alumínio preto com isolamento termoacústico',
      'Porcelanatos de grandes formatos e revestimentos nobres nas áreas sociais',
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
      'Intervenção técnica em galpão logístico para operação industrial com nivelamento e piso epóxi de alta resistência.',
    detailedDesc:
      'Intervenção completa em galpão corporativo para operação logística. Execução de nivelamento com piso epóxi industrial de tráfego pesado, revisão total do sistema elétrico de média tensão, recuperação estrutural de pilares de sustentação e automação de docas para carretas.',
    highlights: [
      'Piso com capacidade de suporte de 6 toneladas por m²',
      'Adequação técnica integral às normas regulamentadoras NR-10 e NR-18',
      'Vistoria e emissão célere de AVCB junto ao Corpo de Bombeiros',
      'Cronograma executado em regime especial sem parar o fluxo operacional'
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
      'Instalação de mastro e antenas em laje de cobertura com reforço metálico distribuído e impermeabilização multicamadas.',
    detailedDesc:
      'Implantação de site de telecomunicações no topo de edifício corporativo em área nobre. Incluiu o içamento de vigas metálicas para distribuição homogênea das cargas pontuais, chumbamentos químicos testados com arrancamento e refazimento de impermeabilização.',
    highlights: [
      'Içamento com guindaste e plano de rigging aprovado pela CET',
      'Impermeabilização com manta asfáltica e teste de estanqueidade de 72h',
      'Malha de aterramento interligada ao SPDA central do edifício',
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
      'Gerenciamento civil integral do projeto estrutural ao acabamento definitivo de áreas comerciais e residenciais.',
    detailedDesc:
      'Desenvolvimento executivo e acompanhamento de obras corporativas e habitacionais. Aplicação de métodos modernos de engenharia civil, terraplenagem de precisão, drenagem pluvial e fechamentos rápidos com garantia de solidez.',
    highlights: [
      'Sondagem geológica e cálculo estrutural detalhado',
      'Materiais de primeira linha certificados pelo PBQP-H',
      'Equipe interna especializada com seguro de vida e EPIs',
      'Entrega auditada com termo de garantia estrutural'
    ]
  }
];

export default function CasesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CaseProject | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Telecomunicações' | 'Construção Civil' | 'Reformas Prediais'>('Todos');

  // Autoplay do carrossel em cascata a cada 4 segundos (pausa quando o mouse está sobre o carrosel)
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
          HERO SECTION COM CARROSSEL EM CASCATA (CENTRAL E PASSANDO PARA OS LADOS)
          ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 bg-[#1B2639] text-white overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Cabeçalho da Hero */}
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-12">
            <span className="inline-block text-xs uppercase tracking-widest text-cyan-300 font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
              Portfólio &amp; Cases de Sucesso
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Obras Executadas com Rigor de Engenharia
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">
              Veja em destaque algumas das principais entregas da Machado em infraestrutura de telecomunicações, construções civis e reformas prediais corporativas.
            </p>
          </div>

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

                  {/* Informações no Card Central */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 space-y-2.5 z-20">
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

                    {/* Botão de expansão no card central */}
                    {isCenter && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Clique para expandir detalhes</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-300 bg-black/30 px-2 py-0.5 rounded">
                          {idx + 1} / {CAROUSEL_PROJECTS.length}
                        </span>
                      </div>
                    )}
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
                Clique em qualquer projeto abaixo para visualizar o escopo técnico completo e detalhes executivos.
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
                layoutId={`project-card-${item.id}`}
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
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#1B2639] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      <Maximize2 className="w-4 h-4" />
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

                {/* Rodapé do Card com Gatilho de Expansão */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1B2639] group-hover:underline flex items-center gap-1.5">
                    <span>Ver detalhes completos</span>
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

          {/* CTA após a galeria */}
          <div className="mt-16 text-center">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#1B2639] text-white max-w-3xl mx-auto space-y-4 shadow-xl">
              <h3 className="text-2xl font-bold text-white">
                Precisa de uma estrutura sólida para o seu próximo empreendimento?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Nossa equipe de engenharia analisa projetos civis, cálculo de fundações e reformas corporativas com agilidade e máxima precisão técnica.
              </p>
              <div className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-cyan-300 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Solicitar Avaliação Técnica</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MODAL EXPANSIVO AO CLICAR EM QUALQUER CARD DE PROJETO
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop com desfoque */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-[#1B2639]/70 backdrop-blur-md"
            />

            {/* Caixa do Modal Expandido */}
            <motion.div
              layoutId={`project-card-${selectedProject.id}`}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-slate-200"
            >
              {/* Botão Fechar no Topo Direito */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Fechar detalhes do projeto"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1B2639] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Imagem do Case Expandido */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Corpo com Detalhes Técnicos (Scrollável se necessário) */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                
                {/* Meta dados */}
                <div className="flex flex-wrap items-center gap-6 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-[#1B2639]" />
                    <span className="font-semibold">{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-[#1B2639]" />
                    <span className="font-semibold">{selectedProject.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">CREA-SP &amp; ART Emitida</span>
                  </div>
                </div>

                {/* Descrição Detalhada */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#1B2639]">
                    Visão Geral do Empreendimento
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {selectedProject.detailedDesc}
                  </p>
                </div>

                {/* Escopo Executivo com Checkmarks */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#1B2639]">
                    Diferenciais e Escopo Executivo
                  </h4>
                  <div className="space-y-2.5">
                    {selectedProject.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rodapé com CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Fechar
                  </button>
                  <Link
                    href="/contato"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all shadow-md hover:shadow-lg"
                  >
                    <span>Solicitar Projeto Semelhante</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
