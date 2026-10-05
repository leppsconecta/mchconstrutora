import React from 'react';
import { Building, MapPin, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '../../components/Link';

export default function ImobiliariaPage() {
  return (
    <div className="bg-white text-[#1B2639]">
      {/* Header Banner com Fotografia */}
      <section
        className="relative py-28 sm:py-36 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-[#1B2639]/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-3">
            MCH Imobiliária
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Aquisição de Terrenos &amp; Incorporação Residencial
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Conectamos proprietários de terras e investidores a projetos de alto valor agregado na região de Cajamar e polo metropolitano de São Paulo.
          </p>
        </div>
      </section>

      {/* Serviços Imobiliários */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Box 1: Para Proprietários */}
            <div className="p-8 sm:p-12 rounded-xl bg-slate-50 border border-slate-200/60 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
                Para Proprietários de Terrenos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2639] tracking-tight">
                Venda ou Permuta do Seu Terreno
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Possui uma área urbana ou rural em Cajamar, Santana de Parnaíba ou entorno? Nossa equipe realiza due diligence jurídica, levantamento topográfico e análise de viabilidade econômica para compra direta ou parceria de incorporação.
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0" />
                  <span>Avaliação precisa baseada em dados reais de mercado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0" />
                  <span>Segurança jurídica com cartórios e prefeituras locais</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0" />
                  <span>Propostas de permuta estruturada com garantia construtiva</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] hover:text-slate-600 transition-colors"
                >
                  <span>Oferecer Terreno para Avaliação</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Box 2: Para Compradores */}
            <div className="p-8 sm:p-12 rounded-xl bg-slate-50 border border-slate-200/60 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
                Para Compradores de Imóveis
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2639] tracking-tight">
                Casas Prontas e Sob Medida
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compre seu imóvel com a certeza de que a estrutura foi concebida por engenheiros civis qualificados. Entregamos residências com laudos de resistência, isolamento térmico e garantia documental integral.
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0" />
                  <span>Habite-se e averbação imobiliária 100% regularizados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0" />
                  <span>Canteiros monitorados com materiais de primeira linha</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B2639] shrink-0" />
                  <span>Localizações estratégicas próximas a eixos viários e serviços</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] hover:text-slate-600 transition-colors"
                >
                  <span>Consultar Imóveis Disponíveis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
