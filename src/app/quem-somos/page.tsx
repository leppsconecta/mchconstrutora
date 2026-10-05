import React from 'react';
import { Shield, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from '../../components/Link';

export default function QuemSomosPage() {
  return (
    <div className="bg-white text-[#1B2639]">
      {/* Header Banner com Fotografia */}
      <section
        className="relative py-28 sm:py-36 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-[#1B2639]/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-3">
            Institucional &amp; Diretrizes
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Quem Somos · MCH Engenharia &amp; Imobiliária
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Uma empresa moldada na responsabilidade técnica direta, presente em campo para garantir fundações invioláveis e construções duradouras.
          </p>
        </div>
      </section>

      {/* Conteúdo Institucional Clean */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block">
              Nossa Origem e DNA
            </span>
            <h2 className="text-3xl font-extrabold text-[#1B2639] tracking-tight">
              Engenharia séria não se faz apenas em escritório; se faz no terreno.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              A MCH nasceu da constatação de que o mercado da construção civil e de infraestrutura crítica sofria com a terceirização desregulada e a falta de acompanhamento técnico real nas frentes de serviço.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              Estruturamos nossa operação com equipes próprias e capacitadas — pedreiros, carpinteiros, eletricistas e operadores — supervisionadas integralmente por engenheiros com registro ativo no CREA-SP. Dessa forma, eliminamos gargalos de comunicação e garantimos que o cálculo estrutural seja seguido à risca no canteiro.
            </p>
          </div>

          {/* Pilares Institucionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
              <Shield className="w-6 h-6 text-[#1B2639]" />
              <h3 className="text-base font-bold text-[#1B2639]">Segurança &amp; Normas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rigor absoluto com normas regulamentadoras NR-18 e NR-35. Zero concessões quando o assunto é integridade física e operacional.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
              <Award className="w-6 h-6 text-[#1B2639]" />
              <h3 className="text-base font-bold text-[#1B2639]">Pontualidade</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Planejamento executivo e cumprimento de cronogramas. Entregamos o que nos comprometemos, sem surpresas contratuais.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
              <Users className="w-6 h-6 text-[#1B2639]" />
              <h3 className="text-base font-bold text-[#1B2639]">Time Próprio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Capacidade produtiva controlada com mão de obra qualificada, reduzindo retrabalho e elevando o padrão de acabamento.
              </p>
            </div>
          </div>

          {/* Sede e Atendimento */}
          <div className="p-8 rounded-xl bg-[#F8F9FA] border border-slate-200/60 space-y-4">
            <h3 className="text-xl font-bold text-[#1B2639]">
              Presença Estratégica em Cajamar / SP
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nossa sede localiza-se na Av dos Ypes 155, Cajamar - SP, no coração de um dos maiores eixos logísticos e industriais do Brasil. Essa posição nos permite mobilizar rapidamente equipamentos, materiais e equipes técnicas para qualquer ponto da Grande São Paulo e interior.
            </p>
            <div className="pt-2">
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B2639] hover:text-slate-600 transition-colors"
              >
                <span>Entrar em Contato com a Diretoria</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
