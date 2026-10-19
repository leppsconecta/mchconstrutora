import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  CreditCard, 
  FileText, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Funcionario, CargoItem, EmpresaItem } from '../types';
import { 
  STORAGE_KEY_FUNCIONARIOS, 
  STORAGE_KEY_CARGOS, 
  STORAGE_KEY_CONFIG, 
  INITIAL_CARGOS, 
  INITIAL_EMPRESAS 
} from '../mockData';

export const CaptacaoTrabalheConosco: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [publicEnabled, setPublicEnabled] = useState(true);
  const [roles, setRoles] = useState<CargoItem[]>(INITIAL_CARGOS);
  const [companies] = useState<EmpresaItem[]>(INITIAL_EMPRESAS);

  const [formData, setFormData] = useState<Partial<Funcionario>>({
    status: 'Ativo',
    type: 'CLT',
    gender: 'Masculino',
    bank_key_type: 'CPF',
    document_type: 'RG'
  });

  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        if (config.publicPageEnabled !== undefined) {
          setPublicEnabled(config.publicPageEnabled);
        }
      }

      const storedRoles = localStorage.getItem(STORAGE_KEY_CARGOS);
      if (storedRoles) {
        setRoles(JSON.parse(storedRoles));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchCEP = async (cepToFetch: string) => {
    const cleanCEP = cepToFetch.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setAddress(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    let formatted = value;
    if (value.length > 5) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    setAddress(prev => ({ ...prev, cep: formatted }));

    if (value.length === 8) {
      fetchCEP(value);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'front') setIsUploadingFront(true);
    else setIsUploadingBack(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'front') {
        setFormData(prev => ({ ...prev, document_front: result }));
        setIsUploadingFront(false);
      } else {
        setFormData(prev => ({ ...prev, document_back: result }));
        setIsUploadingBack(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.phone?.trim() || !formData.role?.trim()) {
      alert('Por favor, preencha nome completo, cargo e telefone.');
      return;
    }

    const newColaborador: Funcionario = {
      id: `func_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name || '',
      role: formData.role || '',
      empresa_id: formData.empresa_id || 'emp-1',
      status: 'Ativo',
      type: formData.type || 'CLT',
      admission_date: new Date().toISOString().split('T')[0],
      phone: formData.phone || '',
      email: formData.email || '',
      gender: formData.gender || 'Masculino',
      bank_account_name: formData.bank_account_name || '',
      bank_name: formData.bank_name || '',
      bank_key_type: formData.bank_key_type || 'CPF',
      bank_key: formData.bank_key || '',
      document_type: formData.document_type || 'RG',
      document: formData.document || '',
      document_front: formData.document_front || '',
      document_back: formData.document_back || '',
      observations: 'Cadastro enviado via página pública Trabalhe Conosco.',
      ...address
    };

    try {
      const currentStored = localStorage.getItem(STORAGE_KEY_FUNCIONARIOS);
      const list: Funcionario[] = currentStored ? JSON.parse(currentStored) : [];
      list.unshift(newColaborador);
      localStorage.setItem(STORAGE_KEY_FUNCIONARIOS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setSubmitted(true);
  };

  if (!publicEnabled) {
    return (
      <div className="min-h-screen bg-[#0B111E] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#101726] border border-white/10 rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-white">Captação Temporariamente Pausada</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            O recebimento de novas fichas cadastrais está temporariamente fechado no momento. Entre em contato diretamente com o setor de RH da MCH Engenharia.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao site principal</span>
          </a>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0B111E] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#101726] border border-white/10 rounded-3xl p-8 space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Cadastro Enviado com Sucesso!</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seus dados e documentos foram enviados com segurança para o setor de RH e Gestão de Pessoas da MCH Engenharia & Imobiliária.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all shadow-lg shadow-sky-500/20"
          >
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B111E] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Institucional */}
        <div className="text-center space-y-2">
          <a href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao site da MCH</span>
          </a>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trabalhe Conosco • MCH Engenharia & Imobiliária
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Preencha seus dados para admissão ou banco de colaboradores oficiais.
          </p>
        </div>

        {/* Formulário Card */}
        <form onSubmit={handleSubmit} className="bg-[#101726] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Vaga e Empresa */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Dados da Vaga</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Empresa de Destino</label>
                <select
                  value={formData.empresa_id || 'emp-1'}
                  onChange={(e) => setFormData({ ...formData, empresa_id: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Função / Cargo Pretendido</label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="">Selecione sua função...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.nome}>{r.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Dados Pessoais</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Nome Completo <span className="text-rose-400">*</span></label>
                <input
                  required
                  placeholder="Nome completo"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">WhatsApp / Telefone <span className="text-rose-400">*</span></label>
                <input
                  required
                  placeholder="(00) 00000-0000"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">E-mail</label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>Chave PIX para Recebimento</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Tipo da Chave</label>
                <select
                  value={formData.bank_key_type || 'CPF'}
                  onChange={(e) => setFormData({ ...formData, bank_key_type: e.target.value as any })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Telefone">Telefone</option>
                  <option value="Chave Aleatória">Chave Aleatória</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Chave PIX</label>
                <input
                  placeholder="Insira sua chave PIX"
                  value={formData.bank_key || ''}
                  onChange={(e) => setFormData({ ...formData, bank_key: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Documentos</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Tipo</label>
                <select
                  value={formData.document_type || 'RG'}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value as any })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="RG">RG</option>
                  <option value="CNH">CNH</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Número</label>
                <input
                  placeholder="00.000.000-0"
                  value={formData.document || ''}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="relative border border-dashed border-white/15 rounded-xl p-4 text-center">
                <input type="file" id="pub-front" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'front')} />
                <label htmlFor="pub-front" className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-5 h-5 text-sky-400" />
                  <span className="text-xs font-medium text-white">{formData.document_front ? 'Doc Frente Anexado' : 'Foto Frente'}</span>
                </label>
              </div>

              <div className="relative border border-dashed border-white/15 rounded-xl p-4 text-center">
                <input type="file" id="pub-back" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'back')} />
                <label htmlFor="pub-back" className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-5 h-5 text-sky-400" />
                  <span className="text-xs font-medium text-white">{formData.document_back ? 'Doc Verso Anexado' : 'Foto Verso'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Endereço</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">CEP</label>
                <input
                  placeholder="00000-000"
                  value={address.cep}
                  onChange={handleCEPChange}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Rua / Bairro</label>
                <input
                  placeholder="Rua e Bairro"
                  value={address.street ? `${address.street} - ${address.neighborhood || ''}` : ''}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all shadow-xl shadow-sky-500/25 cursor-pointer mt-4"
          >
            Enviar Ficha Cadastral
          </button>
        </form>
      </div>
    </div>
  );
};
