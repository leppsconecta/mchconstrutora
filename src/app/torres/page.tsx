import React from 'react';
import { Signal, Zap, ShieldCheck, ArrowRight, Radio, HardHat, Bolt, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';

export default function TorresPage() {
  return (
    <div className="min-h-screen bg-[#1B2639] text-white selection:bg-cyan-500 selection:text-[#1B2639]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2560&q=85)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639] via-[#1B2639]/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 font-semibold tracking-widest uppercase text-xs mb-6">
              <Radio className="w-4 h-4" />
              <span>Base Civil e Infraestrutura</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-white">
              Infraestrutura para Telecom
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Nós ajudamos a construir o futuro da conectividade. A MCH não fabrica nem opera as antenas, mas somos a força construtora que <strong>executa toda a infraestrutura civil e as fundações</strong> que permitem que as torres operem com máxima segurança no Brasil.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nossos Profissionais em Campo (Cards) */}
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
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-700 mb-6">
                 <HardHat className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2">Engenheiros Civis</h3>
               <p className="text-sm text-slate-500">Supervisão in loco, emissão de ART, controle de qualidade e gestão rigorosa de cronograma.</p>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-700 mb-6">
                 <Bolt className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2">Eletricistas</h3>
               <p className="text-sm text-slate-500">Aterramentos, infraestrutura de calhas e toda a passagem elétrica necessária para a base.</p>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-700 mb-6">
                 <Building2 className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2">Pedreiros & Armadores</h3>
               <p className="text-sm text-slate-500">Execução pesada: lajes, fundações de concreto usinado, ferragens e estruturas definitivas.</p>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
               <div className="w-14 h-14 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-700 mb-6">
                 <Users className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold mb-2">Carpinteiros & Equipe</h3>
               <p className="text-sm text-slate-500">Montagem precisa de formas para concretagem, topografia, nivelamento e suporte civil contínuo.</p>
             </div>
           </div>
        </div>
      </section>

      {/* Conteúdo Institucional & Impacto */}
      <section className="py-24 bg-white text-[#1B2639]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
           <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
               O que nós executamos no terreno
             </h2>
             <p className="text-slate-600 leading-relaxed text-lg">
               A expansão de antenas exige uma base infraestrutural que não permite falhas. Nós somos a construtora responsável pela fundação e obra civil que sustenta essas tecnologias.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="space-y-6 group cursor-default">
               <div className="w-16 h-16 bg-[#1B2639] rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                 <Signal className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight">Implantação Civil (Greenfield)</h3>
               <p className="text-slate-600 leading-relaxed">
                 Obras civis turn-key para novos sites. Preparamos o terreno, as fundações profundas e a concretagem pesada para suportar fisicamente as novas torres.
               </p>
             </div>
             
             <div className="space-y-6 group cursor-default">
               <div className="w-16 h-16 bg-[#1B2639] rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                 <Zap className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight">Adequações em Topos (Roof-Top)</h3>
               <p className="text-slate-600 leading-relaxed">
                 Obras de reforço estrutural em prédios e galpões. Executamos as adequações civis e bases metálicas para que a estrutura atual aguente a carga da antena.
               </p>
             </div>
             
             <div className="space-y-6 group cursor-default">
               <div className="w-16 h-16 bg-[#1B2639] rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight">Sinalização e Acabamento</h3>
               <p className="text-slate-600 leading-relaxed">
                 Construção de alambrados, muretas, calçadas, impermeabilização e preparação final da base, deixando tudo pronto para os engenheiros de telecomunicações operarem.
               </p>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-[#1B2639] border-t border-white/10">
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
