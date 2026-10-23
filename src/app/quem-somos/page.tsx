import React from 'react';
import { Shield, Award, Users, ArrowRight, Radio, Building2, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../../components/Link';
import { useLanguage } from '../../contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

export default function QuemSomosPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white text-[#1B2639] selection:bg-[#1B2639] selection:text-white">

      {/* Conteúdo Institucional Clean */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Imagem (Lado Esquerdo) */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[400px] lg:h-full group">
               <img
                  src="/quem-somos-projetos.jpg"
                  alt="Projetos técnicos, plantas de engenharia e planejamento sobre a mesa - Machado"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
               />
               <div className="absolute inset-0 bg-[#1B2639]/10 group-hover:bg-transparent transition-colors duration-[2s]" />
            </div>

            {/* Informações (Lado Direito) */}
            <div className="space-y-6 py-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B2639] tracking-tight leading-tight">
                {t.quemSomos.mainTitle}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                {t.quemSomos.introP1}
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                {t.quemSomos.introP2}
              </p>

              {/* Tópicos: O que fazemos */}
              <div className="pt-8 border-t border-slate-100 space-y-5">
                <h3 className="font-extrabold text-lg text-[#1B2639]">{t.quemSomos.areasTitle}</h3>
                <div className="grid gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1B2639]/5 flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 text-[#1B2639]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B2639]">{t.quemSomos.areasTelecomTitle}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.quemSomos.areasTelecomDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1B2639]/5 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#1B2639]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B2639]">{t.quemSomos.areasConstrutoraTitle}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.quemSomos.areasConstrutoraDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1B2639]/5 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5 text-[#1B2639]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B2639]">{t.quemSomos.areasImobiliariaTitle}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.quemSomos.areasImobiliariaDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pilares Institucionais - Cards Azul Marinho Animados em Fila */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              variants={cardItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-4 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">{t.quemSomos.val1Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.quemSomos.val1Desc}
              </p>
            </motion.div>

            <motion.div
              variants={cardItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-4 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <Award className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">{t.quemSomos.val2Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.quemSomos.val2Desc}
              </p>
            </motion.div>

            <motion.div
              variants={cardItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-[#1B2639] border border-white/5 space-y-4 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <Users className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">{t.quemSomos.val3Title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.quemSomos.val3Desc}
              </p>
            </motion.div>
          </motion.div>

          {/* Sede e Atendimento */}
          <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 flex flex-col md:flex-row gap-8 items-center justify-between">
             <div className="space-y-4 max-w-2xl">
                <h3 className="text-xl font-extrabold text-[#1B2639]">
                  {t.quemSomos.presenceTitle}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.quemSomos.presenceDesc}
                </p>
             </div>
             <div className="shrink-0 w-full md:w-auto">
                <Link
                  href="/contato"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-cyan-700 transition-colors shadow-lg"
                >
                  <span>{t.quemSomos.presenceCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
}
