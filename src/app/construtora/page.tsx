import React from 'react';
import {
  HardHat,
  CheckCircle2,
  ArrowRight,
  Hammer,
  Ruler,
  Key,
  Wrench,
  Zap,
  Paintbrush,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';

const STEPS = [
  {
    step: '01',
    title: 'Planejamento & Projetos',
    desc: 'Análise do terreno, compatibilização de projetos estruturais e arquitetônicos e orçamento fechado sem custos surpresa.',
    icon: Ruler
  },
  {
    step: '02',
    title: 'Fundação & Estrutura',
    desc: 'Terraplenagem, fundações profundas e concretagem executadas exclusivamente por equipe própria e engenheiros no canteiro.',
    icon: Hammer
  },
  {
    step: '03',
    title: 'Instalações Técnicas',
    desc: 'Sistemas elétricos, redes hidrossanitárias certificadas e impermeabilização multicamadas com rigor técnico.',
    icon: HardHat
  },
  {
    step: '04',
    title: 'Acabamentos & Chaves',
    desc: 'Assentamento de porcelanatos, esquadrias nobres, pintura fina e entrega da casa 100% pronta para morar.',
    icon: Key
  }
];

const MAINTENANCE_SERVICES = [
  {
    title: 'Encanador & Hidráulica',
    desc: 'Caça-vazamentos, bombas pressurizadoras, caixas d’água e tubulações de esgoto/água quente.',
    icon: Wrench
  },
  {
    title: 'Eletricista & Elétrica',
    desc: 'Quadros de distribuição, cabeamento estruturado, iluminação técnica e balanceamento de carga.',
    icon: Zap
  },
  {
    title: 'Pintor & Restauração',
    desc: 'Pintura interna e externa, tratamento de trincas, umidade, aplicação de texturas e vernizes.',
    icon: Paintbrush
  },
  {
    title: 'Limpeza Pós-Obra',
    desc: 'Higienização profunda especializada pós-reforma, limpeza de vidros e conservação predial.',
    icon: Sparkles
  }
];

// Variantes para animações em fila suaves (stagger)
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
      ease: [0.22, 1, 0.36, 1]
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
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function ConstrutoraPage() {
  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">

      {/* =========================================================================
          SEÇÃO 1: CONSTRUÇÃO DE CASAS DO BÁSICO AO ACABAMENTO
          (Imagem na Esquerda | Texto na Direita)
          ========================================================================= */}
      <section className="pt-8 pb-16 sm:pt-12 sm:pb-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Imagem (Lado Esquerdo) com fade-in e scale suave */}
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
                  alt="Casa de alto padrão construída pela MCH"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

            {/* Informações (Lado Direito) com fade suave */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block">
                  MCH Construtora &amp; Incorporadora
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B2639] tracking-tight leading-tight">
                  Construção de Casas do Básico ao Acabamento
                </h1>
              </div>

              <p className="text-base text-slate-600 leading-relaxed">
                Atuamos na execução integral de residências, desde a escolha do terreno até a entrega definitiva das chaves. Equipe própria, supervisão permanente de engenheiros e padrão de acabamento superior.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Construção Turnkey (Chave na Mão):</strong> cuidamos da fundação, estrutura, acabamentos nobres e entrega pronta para morar.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Casas para Venda e Incorporação:</strong> desenvolvemos projetos próprios de alto padrão com garantia de qualidade.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Time 100% Próprio &amp; CREA-SP:</strong> sem terceirizações desreguladas e com emissão de ART em todas as etapas.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all shadow-md hover:shadow-lg"
                >
                  <span>Solicitar Orçamento de Construção</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: SERVIÇOS PREDIAIS & MANUTENÇÃO (SEÇÃO AZUL MARINHO + CARDS BRANCOS EM FILA)
          (Texto na Esquerda | Imagem na Direita)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#1B2639] text-white border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Texto (Lado Esquerdo) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="inline-block text-xs uppercase tracking-widest text-cyan-300 font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                  Manutenção &amp; Facilities
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Serviços Prediais &amp; Reparos Especializados
                </h2>
              </div>

              <p className="text-base text-slate-300 leading-relaxed">
                Dispomos de corpo técnico próprio e qualificado para manutenção preventiva e corretiva, pequenos reparos e conservação contínua de residências, edifícios e ambientes comerciais.
              </p>

              {/* Grid 2x2 com os 4 Serviços em Cards Brancos Animados em Fila (Stagger) */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
              >
                {MAINTENANCE_SERVICES.map((serv, idx) => {
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

              <div className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-cyan-300 transition-all shadow-xl hover:shadow-2xl"
                >
                  <span>Solicitar Atendimento Predial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Imagem (Lado Direito) com transição suave */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
                  alt="Serviços prediais e manutenção técnica especializada da MCH"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 3: RESUMO DAS ETAPAS DO PROCESSO (CARDS AZUL MARINHO ANIMADOS EM FILA)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-14 space-y-2"
          >
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold block">
              Processo Construtivo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2639] tracking-tight">
              Os caminhos que seguimos em sua obra
            </h2>
            <p className="text-sm text-slate-600">
              Metodologia clara para garantir prazo, economia e a qualidade de cada detalhe da sua casa.
            </p>
          </motion.div>

          {/* Cards das 4 etapas animados em sequência com efeito stagger */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STEPS.map((s, idx) => {
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
                      ETAPA {s.step}
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
