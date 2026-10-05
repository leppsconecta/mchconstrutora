import React, { useState } from 'react';
import { MapPin, Phone, Mail, Info, Send, CheckCircle2, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    assunto: 'Construção Civil / Incorporação',
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
                  Canais Oficiais
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2639] tracking-tight">
                  Estamos prontos para atender sua demanda técnica.
                </h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Nossos engenheiros estão habituados aos prazos críticos e exigências de conformidade de grandes concessionárias, empresas e investidores.
                </p>
              </div>

              {/* Endereço e Aviso Obrigatório */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1B2639] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase font-bold text-[#9F9F9F] block">Sede Operacional</span>
                    <div className="text-base font-bold text-[#1B2639] mt-0.5">
                      Av. dos Ipês, 155 - 2º Andar
                    </div>
                    <div className="text-xs text-slate-500">Portal dos Ipês, Cajamar - SP, 07790-840</div>
                  </div>
                </div>

                {/* Mapa Google Maps */}
                <div className="rounded-lg overflow-hidden border border-slate-200/60 h-48 w-full mt-4">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.761794715783!2d-46.86469612399222!3d-23.396825578913395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1b9ad9b54d5d%3A0x6b3061dcaf7ebbc3!2sAv.%20dos%20Ip%C3%AAs%2C%20155%20-%20Portal%20dos%20Ip%C3%AAs%20(Polvilho)%2C%20Cajamar%20-%20SP%2C%2007790-840!5e0!3m2!1spt-BR!2sbr!4v1715802123456!5m2!1spt-BR!2sbr" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Contatos Telefônicos e E-mail */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#1B2639]" />
                  <span><strong>Telefone Comercial:</strong> (11) 96645-4023</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#1B2639]" />
                  <span><strong>E-mail Técnico:</strong> contato@mchengenharia.com.br</span>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1B2639] hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1B2639] hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2639] hover:bg-[#1B2639] hover:text-white transition-colors">
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
                      Mensagem Enviada com Sucesso
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Agradecemos o contato. Nossa diretoria de engenharia avaliará as especificações técnicas da sua mensagem e retornará em breve.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-colors"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-[#1B2639] mb-4">
                      Solicitação de Proposta / Contato Técnico
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder="Seu nome"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Empresa / Instituição
                        </label>
                        <input
                          type="text"
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          placeholder="Razão Social ou Nome Fantasia"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          E-mail Corporativo *
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@empresa.com.br"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Telefone / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Área de Interesse
                      </label>
                      <select
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                      >
                        <option value="Construção Civil / Incorporação">
                          Construção Civil &amp; Incorporação Residencial
                        </option>
                        <option value="Infraestrutura para Telecomunicações">
                          Infraestrutura para Telecomunicações (Bases e Torres)
                        </option>
                        <option value="Reformas Prediais (B2B)">
                          Reformas Prediais &amp; Galpões Corporativos (B2B)
                        </option>
                        <option value="Aquisição / Venda de Terrenos">
                          Imobiliária: Aquisição / Permuta de Terrenos
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Detalhes do Projeto / Mensagem *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        placeholder="Descreva a localização da obra, dimensões, cronograma previsto ou escopo técnico..."
                        className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-sm text-[#1B2639] focus:outline-none focus:border-[#1B2639]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-md text-sm font-semibold uppercase tracking-wider text-white bg-[#1B2639] hover:bg-[#25344d] transition-all flex items-center justify-center gap-2 shadow"
                    >
                      <span>Enviar Solicitação de Orçamento</span>
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
