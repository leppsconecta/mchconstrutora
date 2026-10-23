import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, Instagram, Facebook, Linkedin, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from '../../components/Link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSiteConfig, generateGoogleMapsEmbedUrl } from '../../contexts/SiteConfigContext';

// Ícone do TikTok
const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.05.86.15V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.82 4.48c1.37-1.37 2.08-3.23 2.08-5.16V8.67a8.21 8.21 0 0 0 4.59 1.4V6.69z"/>
  </svg>
);

export default function ContatoPage() {
  const { t } = useLanguage();
  const { siteConfig } = useSiteConfig();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    assunto: t.contato.subjectOptions[0] || 'Construção Civil / Incorporação',
    mensagem: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white text-[#1B2639]">
      {/* Conteúdo de Contato Clean */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Informações de Contato e Endereço */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9F9F9F] font-semibold block mb-2">
                  {t.contato.tag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2639] tracking-tight">
                  {t.contato.title}
                </h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.contato.subtitle}
                </p>
              </div>

              {/* Endereço e Aviso Obrigatório */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1B2639] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase font-bold text-[#9F9F9F] block">
                      {t.contato.headquarters}
                    </span>
                    <div className="text-base font-bold text-[#1B2639] mt-0.5">
                      {siteConfig.endereco_logradouro 
                        ? `${siteConfig.endereco_logradouro}, ${siteConfig.endereco_numero || 'S/N'}${siteConfig.endereco_complemento ? ' - ' + siteConfig.endereco_complemento : ''}` 
                        : t.contato.addressLine1}
                    </div>
                    <div className="text-xs text-slate-500">
                      {siteConfig.endereco_cidade 
                        ? `${siteConfig.endereco_bairro ? siteConfig.endereco_bairro + ', ' : ''}${siteConfig.endereco_cidade} - ${siteConfig.endereco_estado || 'SP'}, CEP ${siteConfig.endereco_cep || '07790-840'}` 
                        : t.contato.addressLine2}
                    </div>
                  </div>
                </div>

                {/* Mapa Google Maps 100% Automático */}
                <div className="rounded-lg overflow-hidden border border-slate-200/60 h-48 w-full mt-4">
                  <iframe 
                    src={siteConfig.google_maps_url || generateGoogleMapsEmbedUrl(siteConfig)} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  />
                </div>
              </div>

              {/* Contatos Oficiais: WhatsApp e E-mail */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#1B2639]" />
                  <span>
                    <strong>WhatsApp:</strong>{' '}
                    <a 
                      href={`https://wa.me/${(siteConfig.whatsapp || '5511966454023').replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline text-[#1B2639] font-medium"
                    >
                      {siteConfig.whatsapp || '(11) 96645-4023'}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#1B2639]" />
                  <span>
                    <strong>E-mail:</strong>{' '}
                    <a 
                      href={`mailto:${siteConfig.email_principal || 'contato@mchengenharia.com.br'}`}
                      className="hover:underline text-[#1B2639] font-medium"
                    >
                      {siteConfig.email_principal || 'contato@mchengenharia.com.br'}
                    </a>
                  </span>
                </div>
                {siteConfig.horario_funcionamento && (
                  <div className="text-xs text-slate-500 pt-1">
                    {siteConfig.horario_funcionamento}
                  </div>
                )}
              </div>

              {/* Redes Sociais */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                {siteConfig.facebook_url && (
                  <a 
                    href={siteConfig.facebook_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1877F2] hover:text-white transition-colors" 
                    aria-label="Facebook"
                    title="Facebook Oficial"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {siteConfig.tiktok_url && (
                  <a 
                    href={siteConfig.tiktok_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-black hover:text-white transition-colors" 
                    aria-label="TikTok"
                    title="TikTok Oficial"
                  >
                    <TikTokIcon className="w-5 h-5" />
                  </a>
                )}
                {siteConfig.instagram_url && (
                  <a 
                    href={siteConfig.instagram_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#E1306C] hover:text-white transition-colors" 
                    aria-label="Instagram"
                    title="Instagram Oficial"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {siteConfig.linkedin_url && (
                  <a 
                    href={siteConfig.linkedin_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#0A66C2] hover:text-white transition-colors" 
                    aria-label="LinkedIn"
                    title="LinkedIn Oficial"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Card Trabalhe Conosco / Envio de Currículo */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1B2639] to-[#101726] text-white border border-white/10 shadow-xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-cyan-500/10 blur-xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Oportunidades &amp; Vagas
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">Trabalhe Conosco</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Quer fazer parte da equipe Machado Construtora? Cadastre seu currículo diretamente em nosso banco de talentos oficial.
                  </p>
                </div>

                <Link
                  href="/trabalhe-conosco"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1B2639] bg-white hover:bg-slate-100 transition-all shadow-md group/btn cursor-pointer"
                >
                  <span>Cadastrar Currículo</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Formulário de Proposta Comercial */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-2xl font-bold text-[#1B2639]">
                      {t.contato.successMessage}
                    </h3>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-colors"
                    >
                      {t.common.seeMore}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-[#1B2639] mb-4">
                      {t.contato.formTitle}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          {t.contato.nameLabel} *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder={t.contato.namePlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          {t.contato.companyLabel}
                        </label>
                        <input
                          type="text"
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          placeholder={t.contato.companyPlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          {t.contato.emailLabel} *
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t.contato.emailPlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          {t.contato.phoneLabel} *
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder={t.contato.phonePlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        {t.contato.subjectLabel}
                      </label>
                      <select
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                      >
                        {t.contato.subjectOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        {t.contato.messageLabel} *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        placeholder={t.contato.messagePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-md text-sm font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all flex items-center justify-center gap-2 shadow"
                    >
                      <span>{t.contato.submitButton}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
