import React from 'react';
import { MapPin, Phone, Mail, Info } from 'lucide-react';
import { Link } from './Link';
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1B2639] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <Link
              href="/"
              className="inline-block group transition-transform duration-300 hover:opacity-95"
              aria-label="MCH Engenharia &amp; Imobiliária"
            >
              <img
                src="/logos/logotipo_footer_white.png"
                alt="MCH Engenharia &amp; Imobiliária"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Entregamos bases sólidas e infraestrutura de ponta. Excelência técnica em obras civis, fundações para telecomunicações e reformas prediais B2B.
            </p>
            <div className="text-xs text-[#9F9F9F] space-y-1 font-mono pt-2">
              <div>Registro Técnico CREA-SP Ativo</div>
              <div>Conformidade com Normas NR-18 e NR-35</div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold">
              Navegação
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/construtora" className="hover:text-white transition-colors">
                  Construtora &amp; Incorporação
                </Link>
              </li>
              <li>
                <Link href="/imobiliaria" className="hover:text-white transition-colors">
                  Imobiliária
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-white transition-colors">
                  Cases de Sucesso
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="hover:text-white transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Mandatory Notice */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold">
              Localização &amp; Atendimento
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9F9F9F] shrink-0 mt-1" />
                <div>
                  <div className="text-white font-medium">Av. dos Ipês, 155 - 2º Andar</div>
                  <div className="text-xs text-[#9F9F9F]">Portal dos Ipês, Cajamar - SP, 07790-840</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#9F9F9F]" />
                  <span>(11) 96645-4023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#9F9F9F]" />
                  <span>contato@mchengenharia.com.br</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9F9F9F]">
          <div>
            &copy; {new Date().getFullYear()} MCH Engenharia &amp; Imobiliária. Todos os direitos reservados.
          </div>
          <div>
            Cajamar · São Paulo · Brasil
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
