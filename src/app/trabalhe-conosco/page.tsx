import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown,
  X
} from 'lucide-react';
import { Link } from '../../components/Link';
import { supabase, uploadImageToBucket } from '../../lib/supabase';

const CARGOS_OPCOES = [
  'Ajudante Geral / Servente',
  'Armador / Ferreiro',
  'Arquiteto(a) Urbanista',
  'Carpinteiro de Formas',
  'Corretor(a) de Imóveis',
  'Eletricista Predial',
  'Encanador / Instalador Hidráulico',
  'Engenheiro(a) Civil',
  'Estagiário(a) de Engenharia / Arquitetura',
  'Gesseiro / Drywall',
  'Mestre de Obras',
  'Operador de Máquinas',
  'Pedreiro / Azulejista',
  'Pintor Predial',
  'Técnico(a) em Edificações',
  'Técnico(a) em Segurança do Trabalho',
  'Administrativo / RH / Financeiro / Suprimentos',
  'Outro Cargo'
];

const FAIXAS_ETARIAS = [
  '13 a 17 anos',
  '18 a 24 anos',
  '25 a 34 anos',
  '35 a 44 anos',
  '45 a 54 anos',
  '+ de 60 anos'
];

const INPUT_CLASS = "w-full h-11 bg-transparent border border-white/15 rounded-lg px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/25 transition-all";

export default function TrabalheConoscoPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'Masculino' as 'Masculino' | 'Feminino',
    ageRange: '25 a 34 anos',
    city: '',
    neighborhood: '',
    role: '',
    observations: ''
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formatar Telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 6) {
      val = `${val.substring(0, 2)} ${val.substring(2, 3)} ${val.substring(3, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      val = `${val.substring(0, 2)} ${val.substring(2)}`;
    }
    setFormData(prev => ({ ...prev, phone: val }));
  };

  // Manipulação de Arquivo de Currículo (máx 5MB)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('O arquivo de currículo não pode exceder o limite de 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setResumeFile(file);
    setErrorMessage(null);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Envio do Formulário de Currículo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Informe seu nome completo.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Informe um número de telefone com DDD válido.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage('Informe sua cidade.');
      return;
    }

    if (!formData.neighborhood.trim()) {
      setErrorMessage('Informe seu bairro.');
      return;
    }

    if (!formData.role) {
      setErrorMessage('Selecione o cargo de interesse.');
      return;
    }

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
        role: formData.role,
        admission_date: admissionDate,
        status: 'Em Análise',
        phone: cleanPhone,
        gender: formData.gender,
        age_range: formData.ageRange,
        city: formData.city.trim(),
        neighborhood: formData.neighborhood.trim(),
        observations: formData.observations.trim(),
        resume_url: resumeUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Grava no banco (machado_construtora.curriculos). Se falhar, avisa o candidato em vez de fingir sucesso.
      const { error: insertErr } = await supabase
        .from('curriculos')
        .insert(newCandidateRecord);
      if (insertErr) {
        console.error('Falha ao salvar currículo:', insertErr);
        setErrorMessage('Não foi possível enviar seu currículo agora. Tente novamente em instantes.');
        return;
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
      phone: '',
      gender: 'Masculino',
      ageRange: '25 a 34 anos',
      city: '',
      neighborhood: '',
      role: '',
      observations: ''
    });
    setResumeFile(null);
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white selection:bg-sky-500 selection:text-white pb-24">
      
      {/* Top Header com Botão de Voltar */}
      <header className="border-b border-white/10 bg-[#0F131A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/contato" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Voltar ao Contato</span>
          </Link>

          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <img
              src="/logos/logotipo_machado_header.png"
              alt="Machado Construtora"
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Container Principal do Formulário (Sem título da página, conforme solicitado) */}
      <div className="max-w-xl mx-auto px-6 pt-10 sm:pt-14">

        {/* FEEDBACK DE SUCESSO APÓS ENVIO */}
        {submitted ? (
          <div className="bg-[#121316] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Currículo Enviado com Sucesso!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Seus dados foram cadastrados e sincronizados com o departamento de RH da Machado Construtora.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 max-w-sm mx-auto text-left space-y-1.5 text-xs">
              <div className="text-slate-400">
                <strong className="text-white">Candidato:</strong> {formData.name}
              </div>
              <div className="text-slate-400">
                <strong className="text-white">Cargo:</strong> {formData.role}
              </div>
              <div className="text-slate-400">
                <strong className="text-white">Contato:</strong> {formData.phone}
              </div>
              <div className="text-slate-400">
                <strong className="text-white">Faixa Etária:</strong> {formData.ageRange}
              </div>
              <div className="text-slate-400">
                <strong className="text-white">Localização:</strong> {formData.city} / {formData.neighborhood}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#1B2639] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                Página Inicial
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Enviar Outro Currículo
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO EXATO CONFORME MODELO DAS IMAGENS */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensagem de Erro de Validação */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
                <HelpCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nome Completo * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                className={INPUT_CLASS}
              />
            </div>

            {/* Telefone * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="11 9 1234-5678"
                className={INPUT_CLASS}
              />
            </div>

            {/* Sexo * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2.5">
                Sexo *
              </label>
              <div className="flex items-center gap-6">
                {(['Masculino', 'Feminino'] as const).map((opt) => {
                  const isChecked = formData.gender === opt;
                  return (
                    <label 
                      key={opt} 
                      className="flex items-center gap-2.5 cursor-pointer select-none group text-sm text-slate-200"
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isChecked ? 'border-sky-400 ring-2 ring-sky-500/20' : 'border-white/30 group-hover:border-white/50'
                      }`}>
                        {isChecked && <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />}
                      </span>
                      <input
                        type="radio"
                        name="gender"
                        value={opt}
                        checked={isChecked}
                        onChange={() => setFormData(prev => ({ ...prev, gender: opt }))}
                        className="sr-only"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Faixa Etária * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2.5">
                Faixa Etária *
              </label>
              <div className="space-y-3">
                {FAIXAS_ETARIAS.map((range) => {
                  const isChecked = formData.ageRange === range;
                  return (
                    <label 
                      key={range} 
                      className="flex items-center gap-2.5 cursor-pointer select-none group text-sm text-slate-200"
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                        isChecked ? 'border-sky-400 ring-2 ring-sky-500/20' : 'border-white/30 group-hover:border-white/50'
                      }`}>
                        {isChecked && <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />}
                      </span>
                      <input
                        type="radio"
                        name="ageRange"
                        value={range}
                        checked={isChecked}
                        onChange={() => setFormData(prev => ({ ...prev, ageRange: range }))}
                        className="sr-only"
                      />
                      <span>{range}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Cidade * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="Sua cidade"
                className={INPUT_CLASS}
              />
            </div>

            {/* Bairro * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Bairro *
              </label>
              <input
                type="text"
                required
                value={formData.neighborhood}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="Seu bairro"
                className={INPUT_CLASS}
              />
            </div>

            {/* Cargo de Interesse * */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Cargo de Interesse *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-11 bg-[#121316] border border-white/15 rounded-lg px-4 pr-10 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/25 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[#121316] text-slate-500">
                    Selecione o cargo
                  </option>
                  {CARGOS_OPCOES.map((cargo) => (
                    <option key={cargo} value={cargo} className="bg-[#121316] text-white">
                      {cargo}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Mensagem Adicional / Observações (sem asterisco, opcional) */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Mensagem Adicional / Observações
              </label>
              <textarea
                value={formData.observations}
                onChange={e => setFormData({ ...formData, observations: e.target.value })}
                rows={4}
                placeholder="Conte-nos um pouco sobre você, sobre suas experiências na área ou observações adicionais..."
                className="w-full bg-transparent border border-white/15 rounded-lg p-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/25 transition-all resize-y"
              />
            </div>

            {/* Anexar Currículo (máx. 1 arquivo, 5MB) */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Anexar Currículo (máx. 1 arquivo, 5MB)
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-file-input"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-11 bg-transparent border border-white/15 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:border-white/30 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-xs text-white font-medium shrink-0">
                    Escolher arquivo
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {resumeFile 
                      ? `${resumeFile.name} (${(resumeFile.size / (1024 * 1024)).toFixed(1)} MB)` 
                      : 'Nenhum arquivo escolhido'}
                  </span>
                </div>

                {resumeFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Remover arquivo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Botão Enviar Currículo em Azul Oficial do Projeto */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 active:scale-[0.99] disabled:opacity-50"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando Currículo...</span>
                  </div>
                ) : (
                  <span>Enviar Currículo</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
