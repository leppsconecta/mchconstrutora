import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from './Link';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';

export const Footer: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { siteConfig } = useSiteConfig();

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <footer className="bg-[#1B2639] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <Link
              href="/"
              className="inline-block group transition-transform duration-300 hover:opacity-95"
              aria-label="Machado Construtora &amp; Incorporadora"
            >
              <img
                src="/logos/logotipo_machado_header.png"
                alt="Machado Construtora &amp; Incorporadora"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {t.footer.brandBio}
            </p>
            <div className="text-xs text-[#9F9F9F] space-y-1 font-mono pt-2">
              <div>{t.footer.creaActive}</div>
              <div>{t.footer.nrStandards}</div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold">
              {t.footer.navTitle}
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/telecomunicacoes" className="hover:text-white transition-colors">
                  {t.nav.telecom}
                </Link>
              </li>
              <li>
                <Link href="/reformas" className="hover:text-white transition-colors">
                  {t.nav.reformas}
                </Link>
              </li>
              <li>
                <Link href="/construtora" className="hover:text-white transition-colors">
                  {t.nav.construtora}
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  {t.nav.cases}
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="hover:text-white transition-colors">
                  {t.nav.quemSomos}
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  {t.nav.contato}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Mandatory Notice */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs uppercase tracking-widest text-[#9F9F9F] font-bold">
              {t.footer.locationTitle}
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9F9F9F] shrink-0 mt-1" />
                <div>
                  <div className="text-white font-medium">
                    {siteConfig.endereco_logradouro 
                      ? `${siteConfig.endereco_logradouro}, ${siteConfig.endereco_numero || 'S/N'}${siteConfig.endereco_complemento ? ' - ' + siteConfig.endereco_complemento : ''}` 
                      : t.footer.officeAddress}
                  </div>
                  <div className="text-xs text-[#9F9F9F]">
                    {siteConfig.endereco_cidade 
                      ? `${siteConfig.endereco_bairro ? siteConfig.endereco_bairro + ', ' : ''}${siteConfig.endereco_cidade} - ${siteConfig.endereco_estado || 'SP'}, CEP ${siteConfig.endereco_cep || '07790-840'}` 
                      : t.footer.officeCity}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#9F9F9F]" />
                  <span>{siteConfig.telefone_principal || t.footer.phoneLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#9F9F9F]" />
                  <span>{siteConfig.email_principal || t.footer.emailLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9F9F9F]">
          <div>
            &copy; {new Date().getFullYear()} Machado Construtora &amp; Incorporadora. {t.footer.rightsReserved}
          </div>
          <div>
            {t.footer.locationFootnote}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
