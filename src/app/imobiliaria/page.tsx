import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from '../../components/Link';

export default function ImobiliariaPage() {
  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">
      {/* Split Hero Section Compacto */}
      <section className="relative flex flex-col lg:flex-row overflow-hidden bg-[#1B2639] lg:h-[480px]">
        
        {/* Lado Esquerdo: Imagem + Texto (60%) */}
        <div className="relative w-full lg:w-[60%] flex items-center justify-center lg:justify-start lg:pl-16 xl:pl-20 px-6 sm:px-10 py-14 lg:py-0 group overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[4s] ease-out" 
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=2000&q=80")' }} 
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B2639]/95 via-[#1B2639]/80 to-[#1B2639]/95 lg:bg-gradient-to-r lg:from-[#1B2639] lg:via-[#1B2639]/85 lg:to-transparent" />
          
          <div className="relative z-10 max-w-xl text-left">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-3">
              MCH Imobiliária
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white leading-tight">
              Seu Novo Lar, <br /> Nossa Construção
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-light">
              Conectamos famílias aos melhores imóveis e investidores a projetos de alto valor agregado na região de Cajamar e polo metropolitano de São Paulo.
            </p>
          </div>
        </div>

        {/* Lado Direito: Vídeo Recortado (40%) */}
        <div className="relative w-full lg:w-[40%] h-[260px] sm:h-[300px] lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden">
          <video 
            src="https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/sign/mchconstrutora_imobiliaria/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4?token=eyJraWQiOiIyZGMxOWFmZC0wNDI5LTQ1M2EtYWYyOS0yZjI2NDc2NDYxZTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtY2hjb25zdHJ1dG9yYV9pbW9iaWxpYXJpYS9Qcm9qZXRvIDIgLSBDYWxpYW5kcmFzIDIgLSBNYWNoYWRvLm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTEyMTc5MzgsImV4cCI6MTc5MTgyMjczOH0.05O8mFwF55vHze9UkXpT_IeRYAU-jlA48O3mTOiBqZ0"
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1B2639]/10 pointer-events-none" />
        </div>
      </section>

      {/* Serviços Imobiliários */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B2639]">
               Soluções Diretas e Transparentes
             </h2>
             <p className="mt-4 text-slate-600 leading-relaxed text-lg">
               Seja para vender um lote ou comprar a casa dos sonhos, conte com a expertise técnica da MCH Engenharia garantindo segurança em cada transação.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Box 1: Para Proprietários */}
            <div className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group/card flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
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
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span>Avaliação baseada no mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span>Segurança jurídica e documental</span>
                </li>
              </ul>
            </div>

            {/* Box 2: Para Compradores */}
            <div className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group/card flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
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
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span>Habite-se 100% regularizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span>Materiais de primeira linha</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA após os cards */}
          <div className="mt-16 text-center">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all shadow-md"
            >
              <span>Consultar Oportunidades</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-colors shadow-xl"
          >
            <span>Falar com um Consultor MCH</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
