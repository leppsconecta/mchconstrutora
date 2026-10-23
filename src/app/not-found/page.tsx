import React from 'react';
import { Home, ArrowLeft, Building2, Radio, Wrench, PhoneCall } from 'lucide-react';
import { Link } from '../../components/Link';
import { SeoHead } from '../../components/SeoHead';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] bg-[#F8F9FA] text-[#1B2639] flex items-center justify-center px-6 py-20">
      <SeoHead
        title="Página Não Encontrada (404) | Machado Construtora"
        description="A página solicitada não foi encontrada ou foi movida. Conheça nossos serviços de construção civil, reformas e telecomunicações."
        canonicalPath="/404"
        noindex={true}
      />

      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Erro 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1B2639] tracking-tight">
            Página Não Encontrada
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-md mx-auto">
            O link acessado pode estar incorreto ou a página foi atualizada. Explore nossos canais principais abaixo:
          </p>
        </div>

        {/* Links rápidos para serviços principais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <Link
            href="/construtora"
            className="p-4 rounded-xl bg-white border border-slate-200/70 hover:border-[#1B2639] hover:shadow-md transition-all group"
          >
            <Building2 className="w-5 h-5 text-[#1B2639] mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-[#1B2639]">Construtora</div>
            <div className="text-[11px] text-slate-500">Casas e Obras Civis</div>
          </Link>

          <Link
            href="/telecomunicacoes"
            className="p-4 rounded-xl bg-white border border-slate-200/70 hover:border-[#1B2639] hover:shadow-md transition-all group"
          >
            <Radio className="w-5 h-5 text-[#1B2639] mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-[#1B2639]">Telecom</div>
            <div className="text-[11px] text-slate-500">Bases e Torres</div>
          </Link>

          <Link
            href="/reformas"
            className="p-4 rounded-xl bg-white border border-slate-200/70 hover:border-[#1B2639] hover:shadow-md transition-all group"
          >
            <Wrench className="w-5 h-5 text-[#1B2639] mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-[#1B2639]">Reformas</div>
            <div className="text-[11px] text-slate-500">Adequação B2B</div>
          </Link>
        </div>

        {/* Botão de retorno à home */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Voltar para a Página Inicial</span>
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Falar com a Engenharia</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
