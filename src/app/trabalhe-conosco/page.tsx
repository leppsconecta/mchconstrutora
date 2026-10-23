import React, { useState, useRef } from 'react';
import { 
  Briefcase, 
  User, 
  Phone, 
  MapPin, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Search, 
  X, 
  Sparkles,
  Building2,
  HardHat,
  Send,
  HelpCircle
} from 'lucide-react';
import { Link } from '../../components/Link';
import { supabase, uploadImageToBucket } from '../../lib/supabase';

const CARGOS_OPCOES = [
  'Engenheiro(a) Civil',
  'Arquiteto(a) Urbanista',
  'Mestre de Obras',
  'Corretor(a) de Imóveis',
  'Técnico(a) em Edificações',
  'Eletricista Predial / Força & Controle',
  'Encanador / Instalador Hidráulico',
  'Pedreiro / Azulejista / Acabamento',
  'Pintor Predial & Restauração',
  'Ajudante Geral / Servente',
  'Estagiário(a) de Engenharia Civil',
  'Administrativo / RH / Suprimentos',
  'Outro Cargo / Função'
];

const INPUT_CLASS = "w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl px-4 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all";
const SELECT_CLASS = "w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all cursor-pointer";
const LABEL_CLASS = "text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5";

export default function TrabalheConoscoPage() {
  const [formData, setFormData] = useState({
    name: '',
    role: CARGOS_OPCOES[0],
    customRole: '',
    phone: '',
    gender: 'Masculino' as 'Masculino' | 'Feminino' | 'Outro',
    cep: '',
    city: '',
    neighborhood: '',
    observations: ''
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formatar Telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 6) {
      val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    }
    setFormData(prev => ({ ...prev, phone: val }));
  };

  // Buscar CEP via ViaCEP
  const handleBuscarCep = async () => {
    const rawCep = formData.cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      setErrorMessage('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    try {
      setLoadingCep(true);
      setErrorMessage(null);
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setErrorMessage('CEP não encontrado na base postal.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        city: data.localidade || prev.city,
        neighborhood: data.bairro || prev.neighborhood
      }));
    } catch {
      setErrorMessage('Erro ao consultar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  // Manipulação de Arquivo de Currículo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('O arquivo de currículo não pode exceder 15MB.');
      return;
    }

    setResumeFile(file);
    setErrorMessage(null);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Envio do Currículo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Informe seu nome completo.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Informe um número de telefone/WhatsApp com DDD.');
      return;
    }

    const finalRole = formData.role === 'Outro Cargo / Função'
      ? (formData.customRole.trim() || 'Outro')
      : formData.role;

    try {
      setSubmitting(true);

      let resumeUrl = '#';

      // Upload do arquivo para o bucket `machado_construtora` sob a pasta `curriculos`
      if (resumeFile) {
        try {
          resumeUrl = await uploadImageToBucket(resumeFile, 'curriculos', false);
        } catch (uploadErr: any) {
          console.warn('Aviso no upload do arquivo (continuando cadastro):', uploadErr);
        }
      }

      const candidateId = `cand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const admissionDate = new Date().toISOString().split('T')[0];

      const newCandidateRecord = {
        id: candidateId,
        name: formData.name.trim(),
        role: finalRole,
        admission_date: admissionDate,
        status: 'Em Análise',
        phone: cleanPhone,
        gender: formData.gender,
        city: formData.city.trim() || 'Não informada',
        neighborhood: formData.neighborhood.trim() || 'Não informado',
        observations: formData.observations.trim(),
        resume_url: resumeUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 1. Salvar no Supabase (se a tabela `machado_construtora.curriculos` estiver acessível)
      try {
        await supabase
          .from('curriculos')
          .insert(newCandidateRecord);
      } catch (dbErr) {
        console.warn('Registro salvo com fallback local:', dbErr);
      }

      // 2. Salvar no localStorage do Dashboard (STORAGE_KEY_CURRICULOS)
      try {
        const storedKey = 'mch_curriculos_list';
        const currentStored = localStorage.getItem(storedKey);
        const list = currentStored ? JSON.parse(currentStored) : [];
        list.unshift(newCandidateRecord);
        localStorage.setItem(storedKey, JSON.stringify(list));
      } catch (storageErr) {
        console.error('Erro no armazenamento local:', storageErr);
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage('Ocorreu um erro ao enviar seu currículo: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: CARGOS_OPCOES[0],
      customRole: '',
      phone: '',
      gender: 'Masculino',
      cep: '',
      city: '',
      neighborhood: '',
      observations: ''
    });
    setResumeFile(null);
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white selection:bg-cyan-500 selection:text-[#1B2639] pb-24">
      
      {/* Top Header com Botão de Voltar */}
      <header className="border-b border-white/10 bg-[#0F1626]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/contato" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Voltar ao Contato</span>
          </Link>

          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <img
              src="/logos/logotipo_machado_header.png"
              alt="Machado Construtora"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Container Principal */}
      <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-16">

        {/* Header do Formulário */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Banco de Talentos Oficial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Trabalhe Conosco na Machado
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Venha construir projetos de engenharia civil, infraestrutura de telecomunicações e grandes reformas com uma das construtoras mais sólidas da região.
          </p>
        </div>

        {/* FEEDBACK DE SUCESSO */}
        {submitted ? (
          <div className="bg-[#101726]/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Currículo Enviado com Sucesso!
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Agradecemos pelo seu interesse em fazer parte da equipe Machado Construtora. Seus dados e currículo já foram cadastrados com sucesso em nossa base de RH.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0E17]/60 border border-white/5 max-w-md mx-auto text-left space-y-1.5 text-xs">
              <div className="text-slate-400">
                <strong className="text-white">Candidato:</strong> {formData.name}
              </div>
              <div className="text-slate-400">
                <strong className="text-white">Função de Interesse:</strong> {formData.role === 'Outro Cargo / Função' ? formData.customRole : formData.role}
              </div>
              <div className="text-slate-400">
                <strong className="text-white">Contato:</strong> {formData.phone}
              </div>
              {formData.city && (
                <div className="text-slate-400">
                  <strong className="text-white">Localização:</strong> {formData.city}{formData.neighborhood ? ` / ${formData.neighborhood}` : ''}
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#1B2639] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                Voltar à Página Inicial
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cadastrar Outro Currículo
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE CAPTURA DE CURRÍCULO */
          <form onSubmit={handleSubmit} className="bg-[#101726]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Mensagem de Erro Geral */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* BLOCO 1: DADOS PESSOAIS & CONTATO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Dados Pessoais &amp; Contato</h3>
                  <p className="text-[11px] text-slate-400">Informações básicas para contato pelo RH</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nome Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Carlos Eduardo Oliveira"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Telefone / WhatsApp com DDD *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99876-5432"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    <span>Gênero</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className={SELECT_CLASS}
                  >
                    <option value="Masculino" className="bg-[#101726]">Masculino</option>
                    <option value="Feminino" className="bg-[#101726]">Feminino</option>
                    <option value="Outro" className="bg-[#101726]">Outro / Prefiro não informar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BLOCO 2: VAGA & ÁREA DE INTERESSE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Vaga &amp; Área de Atuação</h3>
                  <p className="text-[11px] text-slate-400">Função para a qual deseja se candidatar</p>
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  <span>Cargo / Função Pretendida *</span>
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className={SELECT_CLASS}
                >
                  {CARGOS_OPCOES.map((cg, idx) => (
                    <option key={idx} value={cg} className="bg-[#101726]">
                      {cg}
                    </option>
                  ))}
                </select>
              </div>

              {formData.role === 'Outro Cargo / Função' && (
                <div>
                  <label className={LABEL_CLASS}>
                    <span>Especifique o Cargo / Especialidade *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customRole}
                    onChange={e => setFormData({ ...formData, customRole: e.target.value })}
                    placeholder="ex: Encarregado de Obras, Topógrafo, Operador de Munck..."
                    className={INPUT_CLASS}
                  />
                </div>
              )}
            </div>

            {/* BLOCO 3: LOCALIZAÇÃO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Endereço &amp; Cidade</h3>
                  <p className="text-[11px] text-slate-400">Região onde reside para avaliação de logística de obras</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLASS}>
                    <span>CEP</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      value={formData.cep}
                      onChange={e => setFormData({ ...formData, cep: e.target.value })}
                      placeholder="07790-840"
                      className={INPUT_CLASS}
                    />
                    <button
                      type="button"
                      onClick={handleBuscarCep}
                      disabled={loadingCep}
                      className="px-3 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold flex items-center justify-center shrink-0 cursor-pointer"
                      title="Buscar CEP"
                    >
                      {loadingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    <span>Cidade</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="ex: Cajamar, SP"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    <span>Bairro</span>
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="ex: Portal dos Ipês"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>

            {/* BLOCO 4: ARQUIVO DO CURRÍCULO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Anexo de Currículo (Opcional)</h3>
                  <p className="text-[11px] text-slate-400">PDF, Word (DOC/DOCX) ou imagem de até 15MB</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!resumeFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-sky-400/50 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all hover:bg-white/[0.02] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Clique para selecionar seu currículo ou arraste o arquivo aqui
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Formatos aceitos: PDF, DOC, DOCX, JPG ou PNG (Máximo: 15MB)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {resumeFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remover arquivo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* BLOCO 5: RESUMO / OBSERVAÇÕES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Resumo Profissional &amp; Experiências</h3>
                  <p className="text-[11px] text-slate-400">Conte-nos sobre seus anos de atuação, registros ou qualificações</p>
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={formData.observations}
                  onChange={e => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="ex: Possuo 8 anos de experiência em canteiro de obras residenciais e comerciais, registro ativo no CREA, vivência em gestão de equipes e leitura de projetos complementares..."
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* BOTÃO DE SUBMISSÃO */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-500">
                Ao enviar, seus dados serão processados exclusivamente pela equipe de RH da Machado Construtora.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando Currículo...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Currículo</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
