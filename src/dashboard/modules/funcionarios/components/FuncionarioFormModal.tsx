import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  CreditCard, 
  FileText, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  Settings,
  MessageSquare
} from 'lucide-react';
import { Funcionario, EmpresaItem, CargoItem } from '../types';

interface FuncionarioFormModalProps {
  isOpen: boolean;
  selectedFuncionario: Funcionario | null;
  companies: EmpresaItem[];
  roles: CargoItem[];
  onClose: () => void;
  onSave: (data: Funcionario) => void;
  onOpenRolesConfig: () => void;
}

export const FuncionarioFormModal: React.FC<FuncionarioFormModalProps> = ({
  isOpen,
  selectedFuncionario,
  companies,
  roles,
  onClose,
  onSave,
  onOpenRolesConfig
}) => {
  const [formData, setFormData] = useState<Partial<Funcionario>>({
    status: 'Ativo',
    type: 'CLT',
    admission_date: new Date().toISOString().split('T')[0],
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

  const [roleSearch, setRoleSearch] = useState('');
  const [isRoleListOpen, setIsRoleListOpen] = useState(false);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  useEffect(() => {
    if (selectedFuncionario) {
      setFormData(selectedFuncionario);
      setAddress({
        cep: selectedFuncionario.cep || '',
        street: selectedFuncionario.street || '',
        number: selectedFuncionario.number || '',
        complement: selectedFuncionario.complement || '',
        neighborhood: selectedFuncionario.neighborhood || '',
        city: selectedFuncionario.city || '',
        state: selectedFuncionario.state || ''
      });
      setRoleSearch(selectedFuncionario.role || '');
    } else {
      setFormData({
        status: 'Ativo',
        type: 'CLT',
        admission_date: new Date().toISOString().split('T')[0],
        gender: 'Masculino',
        bank_key_type: 'CPF',
        document_type: 'RG'
      });
      setAddress({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      });
      setRoleSearch('');
    }
  }, [selectedFuncionario, isOpen]);

  if (!isOpen) return null;

  // ViaCEP integration
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
        setTimeout(() => {
          document.getElementById('input-number')?.focus();
        }, 100);
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

    if (file.size > 25 * 1024 * 1024) {
      alert('O arquivo selecionado deve ter no máximo 25 MB.');
      return;
    }

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
    reader.onerror = () => {
      if (type === 'front') setIsUploadingFront(false);
      else setIsUploadingBack(false);
      alert('Falha ao processar arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert('Preencha o nome completo do funcionário.');
      document.getElementById('input-name')?.focus();
      return;
    }

    if (!formData.role?.trim()) {
      alert('Selecione ou insira o cargo do funcionário.');
      document.getElementById('select-role')?.focus();
      return;
    }

    if (!formData.phone?.trim()) {
      alert('Insira o telefone do funcionário.');
      document.getElementById('input-phone')?.focus();
      return;
    }

    const funcionarioData: Funcionario = {
      id: selectedFuncionario ? selectedFuncionario.id : `func_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name || '',
      role: formData.role || '',
      empresa_id: formData.empresa_id || 'emp-1',
      status: formData.status || 'Ativo',
      type: formData.type || 'CLT',
      gender: formData.gender || 'Masculino',
      document_type: formData.document_type || 'RG',
      bank_key_type: formData.bank_key_type || 'CPF',
      admission_date: formData.admission_date || new Date().toISOString().split('T')[0],
      phone: formData.phone || '',
      emergency_phone: formData.emergency_phone || '',
      email: formData.email || '',
      birth_date: formData.birth_date || '',
      bank_account_name: formData.bank_account_name || '',
      bank_name: formData.bank_name || '',
      bank_key: formData.bank_key || '',
      document: formData.document || '',
      document_front: formData.document_front || '',
      document_back: formData.document_back || '',
      observations: formData.observations || '',
      ...address
    };

    onSave(funcionarioData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl bg-[#101726] border border-white/10 rounded-2xl shadow-2xl h-[90vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0F1626]">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" />
            <span>{selectedFuncionario ? `Editar Funcionário: ${selectedFuncionario.name}` : 'Novo Colaborador'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Seção 1: Vaga e Empresa */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Dados da Empresa & Vínculo</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="space-y-1 md:col-span-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Empresa / Unidade</label>
                <select
                  value={formData.empresa_id || 'emp-1'}
                  onChange={(e) => setFormData({ ...formData, empresa_id: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Tipo de Contrato</label>
                <select
                  value={formData.type || 'CLT'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="CLT">CLT (Efetivo)</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Menor Aprendiz">Menor Aprendiz</option>
                  <option value="Jurídico">Jurídico (PJ)</option>
                  <option value="Freelance">Freelance / Prestador</option>
                </select>
              </div>

              {/* Cargo com busca e botão de cargos */}
              <div className="space-y-1 md:col-span-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Função / Cargo <span className="text-rose-400">*</span></label>
                  <button
                    type="button"
                    onClick={onOpenRolesConfig}
                    className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    title="Configurar Cargos"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Gerenciar</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="select-role"
                    placeholder="Pesquisar cargo..."
                    value={roleSearch}
                    onChange={(e) => {
                      setRoleSearch(e.target.value);
                      setFormData({ ...formData, role: e.target.value });
                      setIsRoleListOpen(true);
                    }}
                    onFocus={() => {
                      setRoleSearch(formData.role || '');
                      setIsRoleListOpen(true);
                    }}
                    onBlur={() => setTimeout(() => setIsRoleListOpen(false), 200)}
                    className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                  />
                  {isRoleListOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-[#101726] border border-white/15 rounded-xl shadow-2xl max-h-44 overflow-y-auto">
                      {roles
                        .filter(r => r.nome.toLowerCase().includes(roleSearch.toLowerCase()))
                        .map((role) => (
                          <div
                            key={role.id}
                            onClick={() => {
                              setRoleSearch(role.nome);
                              setFormData({ ...formData, role: role.nome });
                              setIsRoleListOpen(false);
                            }}
                            className="px-3.5 py-2 text-xs text-slate-300 hover:bg-sky-500/10 hover:text-sky-300 cursor-pointer transition-colors"
                          >
                            {role.nome}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Data de Entrada / Admissão</label>
                <input
                  type="date"
                  value={formData.admission_date || ''}
                  onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Dados Pessoais */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Dados Pessoais</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="space-y-1 md:col-span-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Nome Completo <span className="text-rose-400">*</span></label>
                <input
                  id="input-name"
                  placeholder="Nome do colaborador"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">E-mail</label>
                <input
                  type="email"
                  placeholder="email@mch.com.br"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Sexo</label>
                <select
                  value={formData.gender || 'Masculino'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Telefone / WhatsApp <span className="text-rose-400">*</span></label>
                <input
                  id="input-phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Telefone de Emergência</label>
                <input
                  placeholder="(00) 00000-0000"
                  value={formData.emergency_phone || ''}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Dados Bancários & PIX */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>Dados Bancários & PIX para Pagamento</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Titular da Conta</label>
                <input
                  placeholder="Nome do titular como no banco"
                  value={formData.bank_account_name || ''}
                  onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Instituição Bancária</label>
                <input
                  placeholder="Ex: Itaú, Nubank, Banco do Brasil"
                  value={formData.bank_name || ''}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Tipo da Chave PIX</label>
                <select
                  value={formData.bank_key_type || 'CPF'}
                  onChange={(e) => setFormData({ ...formData, bank_key_type: e.target.value as any })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
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
                  placeholder="Insira a chave PIX"
                  value={formData.bank_key || ''}
                  onChange={(e) => setFormData({ ...formData, bank_key: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Documentos & Anexos */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Documentos Pessoais & Fotos</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Tipo de Documento</label>
                <select
                  value={formData.document_type || 'RG'}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value as any })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="RG">RG</option>
                  <option value="CNH">CNH</option>
                  <option value="Passaporte">Passaporte</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Número do Documento</label>
                <input
                  placeholder="00.000.000-0"
                  value={formData.document || ''}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* Upload Frente */}
              <div className="relative group border border-dashed border-white/15 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors min-h-[130px]">
                <input
                  type="file"
                  id="file-front-func"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'front')}
                  disabled={isUploadingFront}
                />
                {isUploadingFront ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                    <span className="text-xs text-white">Carregando...</span>
                  </div>
                ) : formData.document_front ? (
                  <div className="flex flex-col items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Documento (Frente)</span>
                    <span className="text-[11px] text-slate-400">Arquivo anexado</span>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={formData.document_front}
                        download="documento_frente"
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium"
                      >
                        Baixar
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, document_front: '' })}
                        className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="file-front-func" className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <Upload className="w-6 h-6 text-sky-400" />
                    <span className="text-xs font-semibold text-white">Documento (Frente)</span>
                    <span className="text-[11px] text-slate-400">Clique para selecionar imagem ou PDF</span>
                  </label>
                )}
              </div>

              {/* Upload Verso */}
              <div className="relative group border border-dashed border-white/15 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors min-h-[130px]">
                <input
                  type="file"
                  id="file-back-func"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'back')}
                  disabled={isUploadingBack}
                />
                {isUploadingBack ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                    <span className="text-xs text-white">Carregando...</span>
                  </div>
                ) : formData.document_back ? (
                  <div className="flex flex-col items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Documento (Verso)</span>
                    <span className="text-[11px] text-slate-400">Arquivo anexado</span>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={formData.document_back}
                        download="documento_verso"
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium"
                      >
                        Baixar
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, document_back: '' })}
                        className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="file-back-func" className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <Upload className="w-6 h-6 text-sky-400" />
                    <span className="text-xs font-semibold text-white">Documento (Verso)</span>
                    <span className="text-[11px] text-slate-400">Clique para selecionar imagem ou PDF</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Seção 5: Endereço */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Endereço Residencial</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">CEP</label>
                <input
                  placeholder="00000-000"
                  value={address.cep}
                  onChange={handleCEPChange}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Rua / Logradouro</label>
                <input
                  placeholder="Rua ou avenida"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Número</label>
                <input
                  id="input-number"
                  placeholder="123"
                  value={address.number}
                  onChange={(e) => setAddress({ ...address, number: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Complemento</label>
                <input
                  placeholder="Apto, Bloco"
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Bairro</label>
                <input
                  placeholder="Bairro"
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Cidade / UF</label>
                <input
                  placeholder="Cidade"
                  value={address.city ? `${address.city}${address.state ? ' - ' + address.state : ''}` : ''}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Seção 6: Observações */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Observações & Histórico</span>
            </h4>
            <textarea
              rows={2}
              placeholder="Anotações internas sobre o colaborador..."
              value={formData.observations || ''}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              className="w-full bg-[#0A0E17] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-sky-500/20"
            >
              {selectedFuncionario ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
