import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

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

                {/* Mapa Google Maps */}
                <div className="rounded-lg overflow-hidden border border-slate-200/60 h-48 w-full mt-4">
                  <iframe 
                    src={siteConfig.google_maps_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.761794715783!2d-46.86469612399222!3d-23.396825578913395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1b9ad9b54d5d%3A0x6b3061dcaf7ebbc3!2sAv.%20dos%20Ip%C3%AAs%2C%20155%20-%20Portal%20dos%20Ip%C3%AAs%20(Polvilho)%2C%20Cajamar%20-%20SP%2C%2007790-840!5e0!3m2!1spt-BR!2sbr!4v1715802123456!5m2!1spt-BR!2sbr"} 
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

              {/* Contatos Telefônicos e E-mail */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#1B2639]" />
                  <span><strong>Telefone:</strong> {siteConfig.telefone_principal || '(11) 96645-4023'} {siteConfig.telefone_secundario ? `/ ${siteConfig.telefone_secundario}` : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#1B2639]" />
                  <span><strong>E-mail:</strong> {siteConfig.email_principal || 'contato@mchengenharia.com.br'}</span>
                </div>
                {siteConfig.email_comercial && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#1B2639]" />
                    <span><strong>Comercial:</strong> {siteConfig.email_comercial}</span>
                  </div>
                )}
              </div>

              {/* Redes Sociais */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                <a 
                  href={siteConfig.instagram_url || "#"} 
                  target={siteConfig.instagram_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1B2639] hover:text-white transition-colors" 
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1B2639] hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1B2639] hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
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
