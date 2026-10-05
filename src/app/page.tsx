import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { HardHat, Radio, Building2, ArrowRight, ShieldCheck, Clock, CheckCircle2, Home } from 'lucide-react';
import { Link } from '../components/Link';
import { Marquee } from '../components/Marquee';

const heroImage = '/hero-bg.jpg';

export default function HomePage() {
  // Parallax interativo com mouse suave para a Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Efeito parallax sutil e elegante
  const parallaxX = useSpring(mousePos.x * 14, { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(mousePos.y * 14, { stiffness: 60, damping: 20 });



  return (
    <div className="bg-white text-[#1B2639]">
      {/* =========================================================================
          2. HERO SECTION COM FOTOGRAFIA DA BASE DE TORRE
             Animação: A imagem desliza para cima e em seguida o texto sobe
          ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1B2639] group"
      >
        {/* IMAGEM ESTÁTICA ÚNICA COM LEVE ZOOM AO PASSAR O MOUSE E PARALLAX */}
        <motion.div
          className="absolute inset-0 bg-cover scale-105 group-hover:scale-110 transition-transform duration-[3s] ease-out"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: 'right 30% center', // Ajusta para garantir que a torre do lado direito apareça bem
            x: parallaxX,
            y: parallaxY
          }}
        />
        
        {/* Overlay escuro em gradiente da esquerda para direita para destacar o texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2639]/95 via-[#1B2639]/40 to-transparent" />

        {/* EM SEGUIDA O TEXTO SUBINDO (Sequência Escalada com Slide Up) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-start mt-20 sm:mt-0">
          <div className="max-w-2xl text-left">
            {/* Tag de Autoridade Minimalista */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold mb-6"
            >
              MCH Engenharia &amp; Imobiliária
            </motion.div>

            {/* H1 Principal com Peso e Legibilidade - Discreto e Reduzido */}
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Nós executamos infraestrutura para torres e antenas 3G.
            </motion.h1>

            {/* Subtítulo Solicitado - Discreto e Reduzido */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-lg"
            >
              Especialistas na construção e fundação pesada de bases para telecomunicações. Entregamos excelência civil, segurança irrestrita e máximo rigor técnico direto no canteiro de obras.
            </motion.p>

            {/* Ações / Links Reais */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-col sm:flex-row items-start justify-start gap-4"
            >
              <Link
                href="/construtora"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-all shadow-xl active:scale-95 group"
              >
                <span>Nossas Frentes</span>
                <ArrowRight className="w-4 h-4 text-[#1B2639] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contato"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold uppercase tracking-wider text-white border border-white/40 hover:bg-white/10 transition-all active:scale-95"
              >
                <span>Falar com a Engenharia</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. NOSSAS FRENTES DE ATUAÇÃO (Os 3 Pilares com Efeitos Interativos)
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Cabeçalho da Seção com Respiro */}
          <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
              Frentes de Atuação
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2639] tracking-tight">
              Os Três Pilares da Machado
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Atuação especializada para demandas civis complexas, infraestrutura crítica de telecomunicações e adequações corporativas.
            </p>
          </div>

          {/* Grid de 3 Cards com Efeitos Interativos (Hover lift, Border glow, Icon bounce, Stagger reveal) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* CARD 1: Construção Civil e Incorporação */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/70 hover:border-[#1B2639]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Linha de Destaque Superior que se expande no Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1B2639] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

              <div>
                {/* Ícone com Efeito Interativo de Escala e Rotação Suave */}
                <div className="w-14 h-14 rounded-xl bg-[#1B2639] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141d2c] group-hover:rotate-2 transition-all duration-300">
                  <HardHat className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#1B2639] tracking-tight mb-3 group-hover:text-[#141d2c] transition-colors">
                  Construção Civil e Incorporação
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Atuamos na execução de casas, desde a aquisição do terreno até a venda final do imóvel. Dispomos de um time completo (pedreiros, carpinteiros, eletricistas) para assumir a obra civil do básico ao acabamento.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/construtora"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] group-hover:text-[#25344d] transition-colors"
                >
                  <span>Conhecer a Construtora</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1B2639] transition-colors" />
              </div>
            </motion.div>

            {/* CARD 2: Infraestrutura para Telecomunicações (Destaque Estratégico) */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl shadow-md border-2 border-[#1B2639]/30 hover:border-[#1B2639] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Borda de Destaque Superior Iluminada */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1B2639] via-cyan-600 to-[#1B2639]" />

              {/* Selo Sutil de Referência */}
              <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider text-[#1B2639] bg-slate-100 px-2.5 py-1 rounded border border-slate-200/80">
                Pilar Especialista
              </div>

              <div>
                {/* Ícone de Telecom com Efeito de Pulso e Escala */}
                <div className="w-14 h-14 rounded-xl bg-[#1B2639] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141d2c] group-hover:-rotate-2 transition-all duration-300">
                  <Radio className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#1B2639] tracking-tight mb-3">
                  Infraestrutura para Telecomunicações
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Referência na execução de toda a infraestrutura e base civil que suporta torres de comunicação. Realizamos implantações, reforços estruturais, elétrica, hidráulica, cercas e impermeabilizações de alta performance.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/cases"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] group-hover:text-black transition-colors"
                >
                  <span>Ver Infraestrutura Telecom</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-200" />
                </Link>
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
              </div>
            </motion.div>

            {/* CARD 3: Reformas Prediais (B2B) */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/70 hover:border-[#1B2639]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Linha de Destaque Superior que se expande no Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1B2639] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

              <div>
                {/* Ícone com Efeito Interativo */}
                <div className="w-14 h-14 rounded-xl bg-[#1B2639] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141d2c] group-hover:rotate-2 transition-all duration-300">
                  <Building2 className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#1B2639] tracking-tight mb-3 group-hover:text-[#141d2c] transition-colors">
                  Reformas Prediais (B2B)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Atendimento exclusivo para empresas. Executamos adequações completas de salas e galpões corporativos, abrangendo toda a parte civil, elétrica, hidráulica, mecânica e de automação, do zero ao acabamento.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] group-hover:text-[#25344d] transition-colors"
                >
                  <span>Solicitar Adequação B2B</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1B2639] transition-colors" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SOBRE NOSSA EXPERIÊNCIA (+10 ANOS)
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#1B2639] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Lado Esquerdo: Imagem Planejamento de Obra */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3] group border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80"
                  alt="Planejamento de Obra MCH"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[1.5s] ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-[#1B2639]/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-[1.5s]" />
              </div>
            </div>

            {/* Lado Direito: Texto com Experiência */}
            <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
                  História e Solidez
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  + 10 anos de experiência
                </h2>
                <p className="mt-4 text-base text-slate-300 leading-relaxed">
                  Consolidamos nossa marca unindo a visão estratégica do mercado imobiliário com a execução técnica de alto padrão da construção civil. Uma década de resultados sólidos.
                </p>
              </div>

              {/* Tópicos Minimalistas */}
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                    <HardHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Construção</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Gerenciamento e execução de obras civis e infraestruturas complexas. Do projeto estrutural ao acabamento final, garantimos máxima qualidade e segurança.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Imobiliária</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Inteligência de mercado para aquisição, venda e gestão de ativos imobiliários, conectando os melhores negócios aos nossos clientes com transparência.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Link
                  href="/quem-somos"
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white hover:text-slate-300 transition-colors"
                >
                  <span>Conhecer nossa história completa</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECÇÃO DE PARCEIROS (Marquee Limpo em Fundo Branco)
          ========================================================================= */}
      <Marquee />
    </div>
  );
}
