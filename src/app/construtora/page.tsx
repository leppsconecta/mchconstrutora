import React from 'react';
import { HardHat, CheckCircle2, ArrowRight, Hammer, Users, Shield } from 'lucide-react';
import { Link } from '../../components/Link';

export default function ConstrutoraPage() {
  return (
    <div className="bg-white text-[#1B2639]">
      {/* Header Banner com Fotografia */}
      <section
        className="relative py-28 sm:py-36 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-[#1B2639]/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-3">
            MCH Construtora &amp; Incorporadora
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Construção Civil do Básico ao Acabamento
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Atuamos na execução integral de casas, desde a aquisição do terreno até a entrega e venda final do imóvel com excelência construtiva comprovada.
          </p>
        </div>
      </section>

      {/* Visão Geral & Time Próprio */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
                Equipe Especializada In-House
              </span>
              <h2 className="text-3xl font-extrabold text-[#1B2639] tracking-tight">
                Dispomos de um time completo para assumir sua obra sem terceirizações descontroladas.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Nosso diferencial competitivo é a coordenação direta do canteiro. Contamos com pedreiros, carpinteiros, armadores, encanadores e eletricistas sob supervisão permanente de engenheiros civis registrados.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Essa estrutura própria garante velocidade de execução, controle estrito de perdas de materiais e garantia de que o acabamento corresponderá rigorosamente aos projetos arquitetônicos e estruturais.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#1B2639] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2639]">Corpo Operacional Próprio</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Sem repasse de responsabilidades</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#1B2639] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2639]">Garantia Técnica Total</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Emissão de ART em todas as etapas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80"
                  alt="Equipe de engenharia civil no canteiro de obras"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ciclo de Obra Completo */}
      <section className="py-20 bg-[#F8F9FA] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
              Fases Construtivas
            </span>
            <h2 className="text-3xl font-extrabold text-[#1B2639] tracking-tight">
              Do Alicerce à Entrega das Chaves
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <span className="text-xs font-mono font-bold text-[#9F9F9F]">ETAPA 01</span>
              <h3 className="text-lg font-bold text-[#1B2639]">Fundações &amp; Estrutura</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Estudos de sondagem de solo, terraplenagem de precisão, sapatas, estacas e concretagem de lajes de alta resistência.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <span className="text-xs font-mono font-bold text-[#9F9F9F]">ETAPA 02</span>
              <h3 className="text-lg font-bold text-[#1B2639]">Instalações Técnicas</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sistemas elétricos inteligentes, tubulações hidrossanitárias certificadas, impermeabilizações térmicas e acústicas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <span className="text-xs font-mono font-bold text-[#9F9F9F]">ETAPA 03</span>
              <h3 className="text-lg font-bold text-[#1B2639]">Acabamentos Nobres</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Assentamento de porcelanatos, revestimentos especiais, esquadrias sob medida, marcenaria e paisagismo integrado.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all shadow-md"
            >
              <span>Solicitar Orçamento de Construção</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
