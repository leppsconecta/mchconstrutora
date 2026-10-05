import React from 'react';
import { Building, MapPin, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '../../components/Link';

export default function ImobiliariaPage() {
  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1B2639] group">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[4s] ease-out" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=2000&q=80")' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639] via-[#1B2639]/70 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center pt-20">
          <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-6">
            MCH Imobiliária
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight">
            Seu Novo Lar <br /> Nossa Construção
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Conectamos famílias aos melhores imóveis e investidores a projetos de alto valor agregado na região de Cajamar e polo metropolitano de São Paulo.
          </p>
        </div>
      </section>

      {/* Serviços Imobiliários */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Lado Esquerdo: Vídeo */}
            <div className="lg:col-span-5 w-full">
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group">
                <video 
                  src="https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/sign/mchconstrutora_imobiliaria/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4?token=eyJraWQiOiIyZGMxOWFmZC0wNDI5LTQ1M2EtYWYyOS0yZjI2NDc2NDYxZTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtY2hjb25zdHJ1dG9yYV9pbW9iaWxpYXJpYS9Qcm9qZXRvIDIgLSBDYWxpYW5kcmFzIDIgLSBNYWNoYWRvLm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTEyMTc5MzgsImV4cCI6MTc5MTgyMjczOH0.05O8mFwF55vHze9UkXpT_IeRYAU-jlA48O3mTOiBqZ0"
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-[#1B2639]/5 pointer-events-none" />
              </div>
            </div>

            {/* Lado Direito: Texto e Cards */}
            <div className="lg:col-span-7 space-y-10">
              <div className="text-left">
                 <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B2639]">
                   Soluções Diretas e Transparentes
                 </h2>
                 <p className="mt-4 text-slate-600 leading-relaxed text-lg">
                   Seja para vender um lote ou comprar a casa dos sonhos, conte com a expertise técnica da MCH Engenharia garantindo segurança em cada transação.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {/* Box 1: Para Proprietários */}
                <div className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group/card flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold block">
                    Para Proprietários
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Venda ou Permuta
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1">
                    Nossa equipe realiza due diligence jurídica, topografia e análise de viabilidade para compra ou parceria.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300 pt-4 border-t border-white/10">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Avaliação baseada no mercado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Segurança jurídica e documental</span>
                    </li>
                  </ul>
                </div>

                {/* Box 2: Para Compradores */}
                <div className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group/card flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold block">
                    Para Compradores
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Casas Prontas
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1">
                    Compre seu imóvel com a certeza de que a estrutura foi concebida por engenheiros civis qualificados.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300 pt-4 border-t border-white/10">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Habite-se 100% regularizado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Materiais de primeira linha</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-[#1B2639] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">Pronto para dar o próximo passo?</h2>
          <p className="text-slate-300 mb-10 text-lg">
            Nossos consultores imobiliários e engenheiros estão à disposição para avaliar seu terreno ou apresentar as melhores opções de residências para sua família.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-xl"
          >
            <span>Falar com um Consultor MCH</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
