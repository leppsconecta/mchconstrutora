import React from 'react';
import { Signal, Zap, ShieldCheck, ArrowRight, HardHat, Hammer, Users } from 'lucide-react';
import { Link } from '../../components/Link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TelecomunicacoesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1B2639] text-white selection:bg-cyan-500 selection:text-[#1B2639]">
      {/* Split Hero Section */}
      <section className="relative flex flex-col lg:flex-row overflow-hidden bg-[#1B2639] lg:h-[500px] border-b border-white/10">

        {/* Lado Esquerdo (50%): Imagem Telecom + Texto e Sombra */}
        <div className="relative w-full lg:w-1/2 flex items-center px-6 sm:px-12 lg:px-14 py-16 lg:py-0 overflow-hidden group z-10 lg:shadow-[25px_0_50px_rgba(0,0,0,0.7)]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out group-hover:scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2560&q=85)' }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639] via-[#1B2639]/85 to-[#1B2639]/60 lg:bg-gradient-to-r lg:from-[#1B2639] lg:via-[#1B2639]/90 lg:to-[#1B2639]/40 z-[1]" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] z-[2] pointer-events-none" />

          {/* Conteúdo com Sombra Projetada */}
          <div className="relative z-10 max-w-lg text-left">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-3">
              {t.telecom.heroTag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {t.telecom.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light mb-7 max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {t.telecom.heroSubtitle}
            </p>

            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-2xl hover:shadow-cyan-400/20"
            >
              <span>{t.telecom.heroCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lado Direito (50%): Imagem Anexada Limpa */}
        <div className="relative w-full lg:w-1/2 h-[280px] sm:h-[360px] lg:h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out group-hover:scale-105"
            style={{ backgroundImage: 'url(/imagem_torre.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2639]/60 via-transparent to-transparent lg:bg-gradient-to-l lg:from-[#1B2639]/40 lg:to-transparent" />
        </div>
      </section>

      {/* Nossos Profissionais em Campo */}
      <section className="py-24 bg-[#F8F9FA] text-[#1B2639]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
              {t.telecom.teamTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.telecom.teamTitle}
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed text-lg">
              {t.telecom.teamSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1 */}
            <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center h-full">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                <HardHat className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t.telecom.team1Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.telecom.team1Desc}
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center h-full">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t.telecom.team2Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.telecom.team2Desc}
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center h-full">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                <Hammer className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t.telecom.team3Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.telecom.team3Desc}
              </p>
            </div>

            {/* CARD 4 */}
            <div className="bg-[#1B2639] text-white p-8 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center h-full">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-white/10">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t.telecom.team4Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.telecom.team4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Institucional & Impacto */}
      <section className="py-24 bg-[#1B2639] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
              {t.telecom.execTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-white">
              {t.telecom.execTitle}
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              {t.telecom.execSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#151D2C] p-8 rounded-2xl border border-white/10 space-y-6 group hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                <Signal className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{t.telecom.exec1Title}</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {t.telecom.exec1Desc}
              </p>
            </div>

            <div className="bg-[#151D2C] p-8 rounded-2xl border border-white/10 space-y-6 group hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{t.telecom.exec2Title}</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {t.telecom.exec2Desc}
              </p>
            </div>

            <div className="bg-[#151D2C] p-8 rounded-2xl border border-white/10 space-y-6 group hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{t.telecom.exec3Title}</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {t.telecom.exec3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-[#151D2C] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            {t.telecom.ctaTitle}
          </h2>
          <p className="text-slate-300 mb-10 text-lg">
            {t.telecom.ctaSubtitle}
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-[#1B2639] bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-xl"
          >
            <span>{t.telecom.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
