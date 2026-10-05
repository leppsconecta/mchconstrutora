import React from 'react';
import { Radio, Building, HardHat, CheckCircle2, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';

const CASES_LIST = [
  {
    title: 'Implantação de Base Civil para Torre de Telecomunicações 5G',
    category: 'Infraestrutura de Telecomunicações',
    location: 'Região Metropolitana de São Paulo',
    timeframe: 'Entregue em 35 dias (100% no prazo)',
    image: '/imagem_torre.png',
    description:
      'Execução de fundação de alta capacidade para suporte a torre autoportante metálica de 42 metros de altura. O projeto exigiu escavação controlada, armação pesada de aço e concretagem maciça contínua com FCK 35MPa para absorver cargas dinâmicas de vento.',
    highlights: [
      'Bloco de coroamento com 48m³ de concreto usinado aditivado',
      'Malha profunda de aterramento SPDA com índice inferior a 4 Ohms',
      'Instalação de cercamento perimetral e cabines técnicas'
    ]
  },
  {
    title: 'Adequação Estrutural e Reforma de Galpão B2B (4.200 m²)',
    category: 'Reformas Prediais & Corporativas',
    location: 'Polo Logístico de Cajamar - SP',
    timeframe: 'Entregue em 60 dias sem interrupção de tráfego',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Intervenção completa em galpão industrial para nova operação logística. Execução de nivelamento de piso epóxi de alto tráfego, revisão total do sistema elétrico de média tensão, recuperação estrutural de pilares e docas automatizadas.',
    highlights: [
      'Piso com capacidade de 6 toneladas por ponto de apoio',
      'Adequação técnica integral às normas NR-10 e NR-18',
      'Aprovação célere de vistoria do Corpo de Bombeiros (AVCB)'
    ]
  },
  {
    title: 'Construção Civil Residencial Turnkey de Alto Padrão',
    category: 'Construção Civil & Incorporação',
    location: 'São Paulo - SP',
    timeframe: 'Obra concluída e averbada em cartório',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description:
      'Edificação residencial de 540 m² de área construída. A MCH liderou todas as frentes com time próprio: fundações profundas, alvenaria estrutural, tubulações hidrossanitárias, infraestrutura para automação e acabamento nobre com pedras e marcenaria.',
    highlights: [
      'Equipe 100% própria: pedreiros, carpinteiros e eletricistas',
      'Isolamento termoacústico de alto desempenho',
      'Zero retrabalhos na entrega definitiva das chaves'
    ]
  }
];

export default function CasesPage() {
  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">
      {/* Lista de Cases Direta */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="space-y-24">
          {CASES_LIST.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
            >
              {/* Imagem do Case */}
              <div className="lg:col-span-6">
                <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3] group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>

              {/* Descrição do Case */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#9F9F9F]">
                    {item.category}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#1B2639]" />
                    {item.location}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2639] tracking-tight">
                  {item.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase tracking-wider text-[#1B2639] font-bold block">
                    Escopo Executivo:
                  </span>
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs font-semibold text-[#1B2639] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#9F9F9F]" />
                  <span>{item.timeframe}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="p-8 sm:p-12 rounded-xl bg-slate-50 border border-slate-200/60 max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-[#1B2639]">
              Precisa de uma estrutura sólida para o seu próximo empreendimento?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Nossa equipe de engenharia analisa projetos civis, cálculo de fundações e adequações corporativas com agilidade e precisão.
            </p>
            <div className="pt-2">
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all shadow"
              >
                <span>Solicitar Avaliação Técnica</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
}
