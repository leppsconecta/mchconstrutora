import React from 'react';
import { Signal, Zap, ShieldCheck, ArrowRight, HardHat, Bolt, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';

export default function TorresPage() {
  return (
    <div className="min-h-screen bg-[#1B2639] text-white selection:bg-cyan-500 selection:text-[#1B2639]">
      {/* Split Hero Section: Texto e Sombra no Lado Esquerdo + Imagem Anexada Limpa no Lado Direito */}
      <section className="relative flex flex-col lg:flex-row overflow-hidden bg-[#1B2639] lg:h-[500px] border-b border-white/10">
        
        {/* Lado Esquerdo (50%): Imagem Telecom + Texto e Sombra */}
        <div className="relative w-full lg:w-1/2 flex items-center px-6 sm:px-12 lg:px-14 py-16 lg:py-0 overflow-hidden group z-10 lg:shadow-[25px_0_50px_rgba(0,0,0,0.7)]">
          {/* Imagem de Fundo (Torre Telecom) */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out group-hover:scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2560&q=85)' }}
          />
          
          {/* Sombra / Overlay Escuro de Alto Contraste e Profundidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639] via-[#1B2639]/85 to-[#1B2639]/60 lg:bg-gradient-to-r lg:from-[#1B2639] lg:via-[#1B2639]/90 lg:to-[#1B2639]/40 z-[1]" />
          
          {/* Sombra Interna (Vignette) para reforçar a profundidade e sombra na imagem com texto */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] z-[2] pointer-events-none" />

          {/* Conteúdo com Sombra Projetada */}
          <div className="relative z-10 max-w-lg text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Infraestrutura <br className="hidden sm:inline" /> para Telecom
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light mb-7 max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              A força construtora que executa as fundações profundas, lajes maciças e adequações estruturais que sustentam as torres com máxima segurança no Brasil.
            </p>

            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-2xl hover:shadow-cyan-400/20"
            >
              <span>Falar com a Engenharia</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lado Direito (50%): Imagem Anexada Limpa (Foto Real do Canteiro e Laje de Concreto) */}
        <div className="relative w-full lg:w-1/2 h-[280px] sm:h-[360px] lg:h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out group-hover:scale-105"
            style={{ backgroundImage: 'url(/imagem_torre.png)' }}
          />
          {/* Suave vinheta nas bordas para integração arquitetônica com o tema escuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639]/60 via-transparent to-transparent lg:bg-gradient-to-l lg:from-[#1B2639]/40 lg:to-transparent" />
        </div>
      </section>

      {/* Nossos Profissionais em Campo (Cards em Azul Marinho) */}
      <section className="py-24 bg-[#F8F9FA] text-[#1B2639]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
           <div className="text-center max-w-3xl mx-auto mb-16">
             <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">Quem faz acontecer no Canteiro</span>
             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
               Mão de Obra Própria e Especializada
             </h2>
             <p className="mt-4 text-slate-600 leading-relaxed text-lg">
               Toda a base da sua rede construída por profissionais experientes. Dispomos de um time completo de especialistas civis atuando diretamente na linha de frente para garantir que a fundação e infraestrutura da sua torre sejam impecáveis.
             </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                 <HardHat className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Engenheiros Civis</h3>
               <p className="text-sm text-slate-300 leading-relaxed">Supervisão in loco, emissão de ART, controle de qualidade e gestão rigorosa de cronograma.</p>
             </div>

             <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                 <Bolt className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Eletricistas</h3>
               <p className="text-sm text-slate-300 leading-relaxed">Aterramentos, infraestrutura de calhas e toda a passagem elétrica necessária para a base.</p>
             </div>

             <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                 <Building2 className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Pedreiros &amp; Armadores</h3>
               <p className="text-sm text-slate-300 leading-relaxed">Execução pesada: lajes, fundações de concreto usinado, ferragens e estruturas definitivas.</p>
             </div>

             <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                 <Users className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Carpinteiros &amp; Equipe</h3>
               <p className="text-sm text-slate-300 leading-relaxed">Montagem precisa de formas para concretagem, topografia, nivelamento e suporte civil contínuo.</p>
             </div>
           </div>
        </div>
      </section>

      {/* Conteúdo Institucional & Impacto (Seção em Azul Marinho, sem o texto roof top) */}
      <section className="py-24 bg-[#1B2639] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
           <div className="text-center max-w-3xl mx-auto mb-20">
             <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">Engenharia e Execução</span>
             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-white">
               O que nós executamos no terreno
             </h2>
             <p className="text-slate-300 leading-relaxed text-lg font-light">
               A expansão de antenas exige uma base infraestrutural que não permite falhas. Nós somos a construtora responsável pela fundação e obra civil que sustenta essas tecnologias.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-[#151D2C] p-8 rounded-2xl border border-white/10 space-y-6 group hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                 <Signal className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-white">Implantação Civil (Greenfield)</h3>
               <p className="text-slate-300 leading-relaxed text-sm">
                 Obras civis turn-key para novos sites. Preparamos o terreno, as fundações profundas e a concretagem pesada para suportar fisicamente as novas torres.
               </p>
             </div>
             
             <div className="bg-[#151D2C] p-8 rounded-2xl border border-white/10 space-y-6 group hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                 <Zap className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-white">Adequações em Topos de Edifícios</h3>
               <p className="text-slate-300 leading-relaxed text-sm">
                 Obras de reforço estrutural em prédios e galpões. Executamos as adequações civis e bases metálicas para que a estrutura atual aguente a carga da antena.
               </p>
             </div>
             
             <div className="bg-[#151D2C] p-8 rounded-2xl border border-white/10 space-y-6 group hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-white">Sinalização e Acabamento</h3>
               <p className="text-slate-300 leading-relaxed text-sm">
                 Construção de alambrados, muretas, calçadas, impermeabilização e preparação final da base, deixando tudo pronto para os engenheiros de telecomunicações operarem.
               </p>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-[#151D2C] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">Precisa de uma construtora para sua base telecom?</h2>
          <p className="text-slate-300 mb-10 text-lg">
            Terceirize a execução civil pesada com a MCH. Deixe o terreno pronto e a base sólida conosco.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-xl"
          >
            <span>Falar com a Engenharia</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
