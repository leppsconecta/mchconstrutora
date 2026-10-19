import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Building2, 
  GraduationCap, 
  CreditCard, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  Settings,
  Sparkles, 
  BookOpen, 
  Award,
  FileText,
  Paperclip,
  AlertCircle,
  Download
} from 'lucide-react';
import { Funcionario, CargoItem, FormacaoCurso, TipoFormacao, CertificadoAnexo } from '../types';

interface FuncionarioFormModalProps {
  isOpen: boolean;
  selectedFuncionario: Funcionario | null;
  roles: CargoItem[];
  onClose: () => void;
  onSave: (data: Funcionario) => void;
  onOpenRolesConfig: () => void;
}

// Títulos em caixa normal (apenas a primeira maiúscula)
const ETAPAS = [
  { id: 1, titulo: 'Dados pessoais', desc: 'Identificação e contatos' },
  { id: 2, titulo: 'Função e vínculo', desc: 'Cargo e admissão' },
  { id: 3, titulo: 'Cursos e vivências', desc: 'Formação e certificados' },
  { id: 4, titulo: 'Bancário e documentos', desc: 'PIX e documentação' },
  { id: 5, titulo: 'Endereço e observações', desc: 'Localização e notas' }
];

// Sem categoria 'Outro' e com títulos em caixa normal
const FORMACOES_OPCOES: TipoFormacao[] = [
  'Graduação / Bacharelado',
  'Tecnólogo',
  'Pós-graduação / MBA',
  'Curso Técnico',
  'Certificação / NR',
  'Conhecimento Prático / Vivência de Vida'
];

const VIVENCIAS_SUGESTOES = [
  'Vivência prática em canteiro de obras',
  'Leitura e interpretação de plantas',
  'Noção prática de carpintaria e formas',
  'Experiência em armação de ferragens',
  'Conhecimento de elétrica predial/residencial',
  'Instalações hidrossanitárias',
  'Assentamento de pisos e porcelanato',
  'Pintura e acabamentos finos',
  'Operação de máquinas e betoneiras',
  'Liderança de equipes e segurança do trabalho'
];

// Classes padronizadas de inputs, selects e labels com placeholders sutis e sem caixa alta
const INPUT_CLASS = "w-full h-10 bg-[#0A0E17] border border-white/10 rounded-xl px-3.5 text-xs sm:text-sm text-white placeholder:text-slate-600 placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all";
const INPUT_ERROR_CLASS = "w-full h-10 bg-[#0A0E17] border border-rose-500/60 rounded-xl px-3.5 text-xs sm:text-sm text-white placeholder:text-slate-600 placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all";
const SELECT_CLASS = "w-full h-10 bg-[#0A0E17] border border-white/10 rounded-xl px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all cursor-pointer";
const LABEL_CLASS = "text-[11px] font-medium text-slate-300 flex items-center gap-1";

export const FuncionarioFormModal: React.FC<FuncionarioFormModalProps> = ({
  isOpen,
  selectedFuncionario,
  roles,
  onClose,
  onSave,
  onOpenRolesConfig
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [stepWarning, setStepWarning] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Funcionario>>({
    status: 'Ativo',
    type: 'CLT',
    admission_date: new Date().toISOString().split('T')[0],
    gender: 'Masculino',
    bank_key_type: 'CPF',
    document_type: 'RG',
    empresa_id: 'emp-1'
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

  // Cursos e Formações
  const [cursos, setCursos] = useState<FormacaoCurso[]>([]);
  const [novoCurso, setNovoCurso] = useState<{
    tipo: TipoFormacao;
    nomeCurso: string;
    instituicao: string;
    dataInicio: string;
    dataFim: string;
    observacoes: string;
    status: FormacaoCurso['status'];
    certificados: CertificadoAnexo[];
  }>({
    tipo: 'Graduação / Bacharelado',
    nomeCurso: '',
    instituicao: '',
    dataInicio: '',
    dataFim: '',
    observacoes: '',
    status: 'Concluído',
    certificados: []
  });

  // Conhecimentos de Vida / Noções Práticas
  const [conhecimentosVida, setConhecimentosVida] = useState<string[]>([]);
  const [novoConhecimento, setNovoConhecimento] = useState('');

  // Auxiliares
  const [roleSearch, setRoleSearch] = useState('');
  const [isRoleListOpen, setIsRoleListOpen] = useState(false);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  // Bloqueio do fundo ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      setCursos(selectedFuncionario.formacoesCursos || []);
      setConhecimentosVida(selectedFuncionario.conhecimentosVida || []);
      setRoleSearch(selectedFuncionario.role || '');
    } else {
      setFormData({
        status: 'Ativo',
        type: 'CLT',
        admission_date: new Date().toISOString().split('T')[0],
        gender: 'Masculino',
        bank_key_type: 'CPF',
        document_type: 'RG',
        empresa_id: 'emp-1'
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
      setCursos([]);
      setConhecimentosVida([]);
      setRoleSearch('');
    }
    setCurrentStep(1);
    setStepErrors({});
    setStepWarning(null);
  }, [selectedFuncionario, isOpen]);

  if (!isOpen) return null;

  // Validação estrita por etapa (não avança sem finalizar)
  const validateStep = (stepNumber: number): { valid: boolean; errors: Record<string, string>; message?: string } => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name?.trim()) {
        errors.name = 'Nome completo é obrigatório.';
      }

      const cleanPhone = (formData.phone || '').replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        errors.phone = 'Telefone pessoal válido com DDD é obrigatório.';
      }

      // Telefone para recado: OBRIGATÓRIO E NÃO PODE SER O MESMO NÚMERO PESSOAL
      const cleanEmergency = (formData.emergency_phone || '').replace(/\D/g, '');
      if (!cleanEmergency) {
        errors.emergency_phone = 'Telefone para recado é obrigatório.';
      } else if (cleanEmergency.length < 10) {
        errors.emergency_phone = 'Informe um telefone para recado válido com DDD.';
      } else if (cleanPhone && cleanEmergency === cleanPhone) {
        errors.emergency_phone = 'O telefone para recado não pode ser o mesmo número pessoal.';
      }

      if (!formData.gender) {
        errors.gender = 'Selecione o sexo do colaborador.';
      }

      if (formData.birth_date) {
        const today = new Date().toISOString().split('T')[0];
        if (formData.birth_date > today) {
          errors.birth_date = 'Data de nascimento não pode ser no futuro.';
        }
      }
    } else if (stepNumber === 2) {
      if (!formData.role?.trim()) {
        errors.role = 'Selecione ou informe a função/cargo pretendido.';
      }
      if (!formData.type) {
        errors.type = 'Selecione o tipo de vínculo contratual.';
      }
      if (!formData.admission_date) {
        errors.admission_date = 'Data de admissão é obrigatória.';
      }
    } else if (stepNumber === 3) {
      // Cursos e vivências
    } else if (stepNumber === 4) {
      if (!formData.document?.trim()) {
        errors.document = 'Número do documento (RG ou CNH) é obrigatório.';
      }
      if (!formData.bank_key?.trim()) {
        errors.bank_key = 'Chave PIX é obrigatória para recebimentos.';
      }
    } else if (stepNumber === 5) {
      if (!address.cep?.trim() || address.cep.replace(/\D/g, '').length !== 8) {
        errors.cep = 'Informe um CEP válido com 8 dígitos.';
      }
      if (!address.street?.trim()) {
        errors.street = 'Rua/logradouro é obrigatório.';
      }
      if (!address.number?.trim()) {
        errors.number = 'Número da residência é obrigatório.';
      }
      if (!address.neighborhood?.trim()) {
        errors.neighborhood = 'Bairro é obrigatório.';
      }
      if (!address.city?.trim()) {
        errors.city = 'Cidade é obrigatória.';
      }
    }

    const valid = Object.keys(errors).length === 0;
    const firstMsg = Object.values(errors)[0];
    return { valid, errors, message: firstMsg };
  };

  const handleNextStep = () => {
    const check = validateStep(currentStep);
    if (!check.valid) {
      setStepErrors(check.errors);
      setStepWarning(check.message || 'Por favor, preencha os campos obrigatórios da etapa atual antes de avançar.');
      return;
    }

    setStepErrors({});
    setStepWarning(null);
    setCurrentStep(prev => Math.min(ETAPAS.length, prev + 1));
  };

  const handlePrevStep = () => {
    setStepErrors({});
    setStepWarning(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep === currentStep) return;

    if (targetStep < currentStep) {
      setStepErrors({});
      setStepWarning(null);
      setCurrentStep(targetStep);
      return;
    }

    // Avançar: todas as etapas anteriores DEVEM estar válidas
    for (let s = 1; s < targetStep; s++) {
      const check = validateStep(s);
      if (!check.valid) {
        setStepErrors(check.errors);
        setStepWarning(`Finalize a etapa ${s} (${ETAPAS[s - 1].titulo}) antes de avançar para a etapa ${targetStep}.`);
        setCurrentStep(s);
        return;
      }
    }

    setStepErrors({});
    setStepWarning(null);
    setCurrentStep(targetStep);
  };

  // Upload de Certificados (múltiplos anexos por curso)
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`O arquivo ${file.name} excede o limite de 20MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const anexo: CertificadoAnexo = {
          id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          nome: file.name,
          url,
          tamanho: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        };

        setNovoCurso(prev => ({
          ...prev,
          certificados: [...prev.certificados, anexo]
        }));
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveCertificate = (certId: string) => {
    setNovoCurso(prev => ({
      ...prev,
      certificados: prev.certificados.filter(c => c.id !== certId)
    }));
  };

  // Adicionar Curso à Ficha
  const handleAddCurso = () => {
    if (!novoCurso.nomeCurso.trim()) {
      alert('Informe o nome do curso ou formação.');
      return;
    }

    const item: FormacaoCurso = {
      id: `fc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tipo: novoCurso.tipo,
      nomeCurso: novoCurso.nomeCurso.trim(),
      instituicao: novoCurso.instituicao.trim() || undefined,
      dataInicio: novoCurso.dataInicio.trim() || undefined,
      dataFim: novoCurso.dataFim.trim() || undefined,
      anoConclusao: novoCurso.dataFim.trim() || undefined,
      observacoes: novoCurso.observacoes.trim() || undefined,
      status: novoCurso.status,
      certificados: novoCurso.certificados
    };

    setCursos(prev => [...prev, item]);
    setNovoCurso({
      tipo: 'Graduação / Bacharelado',
      nomeCurso: '',
      instituicao: '',
      dataInicio: '',
      dataFim: '',
      observacoes: '',
      status: 'Concluído',
      certificados: []
    });
  };

  const handleRemoveCurso = (id: string) => {
    setCursos(prev => prev.filter(c => c.id !== id));
  };

  // Adicionar Conhecimento de Vida
  const handleAddConhecimento = (texto?: string) => {
    const val = (texto || novoConhecimento).trim();
    if (!val) return;
    if (conhecimentosVida.includes(val)) return;

    setConhecimentosVida(prev => [...prev, val]);
    setNovoConhecimento('');
  };

  const handleRemoveConhecimento = (item: string) => {
    setConhecimentosVida(prev => prev.filter(c => c !== item));
  };

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
        setStepErrors(prev => {
          const n = { ...prev };
          delete n.cep;
          delete n.street;
          delete n.neighborhood;
          delete n.city;
          return n;
        });
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
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    for (let s = 1; s <= ETAPAS.length; s++) {
      const check = validateStep(s);
      if (!check.valid) {
        setStepErrors(check.errors);
        setStepWarning(`Por favor, complete a etapa ${s} (${ETAPAS[s - 1].titulo}) antes de salvar.`);
        setCurrentStep(s);
        return;
      }
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
      formacoesCursos: cursos,
      conhecimentosVida: conhecimentosVida,
      ...address
    };

    onSave(funcionarioData);
  };

  const progressPercent = Math.round((currentStep / ETAPAS.length) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Bloqueio total do fundo: backdrop escurecido com blur */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        aria-hidden="true" 
      />

      {/* Container com dimensões rígidas: NÃO muda de tamanho nem pula entre etapas */}
      <div className="relative w-full max-w-3xl h-[88vh] bg-[#101726] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 transition-none select-text">
        
        {/* Header Fixo com Título & Progresso (sem caixa alta) */}
        <div className="px-6 pt-5 pb-4 border-b border-white/10 bg-[#0F1626] shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedFuncionario ? `Editar colaborador: ${selectedFuncionario.name}` : 'Cadastro de funcionário'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Etapa <span className="text-sky-400 font-bold">{currentStep}</span> de {ETAPAS.length} • {ETAPAS[currentStep - 1].titulo}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso Contínua */}
          <div className="space-y-2">
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-sky-500/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Pills de Navegação das Etapas */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {ETAPAS.map((etapa) => {
                const isActive = etapa.id === currentStep;
                const isCompleted = etapa.id < currentStep;

                return (
                  <button
                    key={etapa.id}
                    type="button"
                    onClick={() => handleStepClick(etapa.id)}
                    className={`text-left p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-500/15 border-sky-500/40 text-white'
                        : isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                        : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <span className={`text-[10px] font-bold ${isActive ? 'text-sky-400' : 'text-slate-500'}`}>
                          0{etapa.id}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold truncate block">
                        {etapa.titulo}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerta de Validação de Etapa */}
        {stepWarning && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-300 text-xs shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{stepWarning}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setStepWarning(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Corpo Scrollável da Etapa Atual (dimensões fixas) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* =========================================================
              ETAPA 1: DADOS PESSOAIS
             ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-400" />
                  <span>Identificação e contatos</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Preencha os dados básicos e contatos do colaborador.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
                {/* Nome Completo */}
                <div className="space-y-1 md:col-span-4">
                  <label className={LABEL_CLASS}>
                    <span>Nome completo</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="input-name"
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    value={formData.name || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (stepErrors.name) setStepErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={stepErrors.name ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.name && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.name}</span>
                  )}
                </div>

                {/* Sexo */}
                <div className="space-y-1 md:col-span-2">
                  <label className={LABEL_CLASS}>
                    <span>Sexo</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.gender || 'Masculino'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className={SELECT_CLASS}
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-1 md:col-span-2">
                  <label className={LABEL_CLASS}>
                    <span>Data de nascimento</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.birth_date || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, birth_date: e.target.value });
                      if (stepErrors.birth_date) setStepErrors(prev => ({ ...prev, birth_date: '' }));
                    }}
                    className={stepErrors.birth_date ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.birth_date && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.birth_date}</span>
                  )}
                </div>

                {/* Telefone Pessoal */}
                <div className="space-y-1 md:col-span-2">
                  <label className={LABEL_CLASS}>
                    <span>Telefone pessoal / WhatsApp</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="input-phone"
                    placeholder="(31) 90000-0000"
                    value={formData.phone || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (stepErrors.phone) setStepErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={stepErrors.phone ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.phone && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.phone}</span>
                  )}
                </div>

                {/* Telefone para Recado */}
                <div className="space-y-1 md:col-span-2">
                  <label className={LABEL_CLASS}>
                    <span>Telefone para recado</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="input-emergency-phone"
                    placeholder="(31) 90000-0000 (familiar)"
                    value={formData.emergency_phone || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, emergency_phone: e.target.value });
                      if (stepErrors.emergency_phone) setStepErrors(prev => ({ ...prev, emergency_phone: '' }));
                    }}
                    className={stepErrors.emergency_phone ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.emergency_phone ? (
                    <span className="text-[11px] text-rose-400 font-medium block leading-tight">
                      {stepErrors.emergency_phone}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 block">
                      Obrigatório. Não pode ser o mesmo número pessoal.
                    </span>
                  )}
                </div>

                {/* E-mail */}
                <div className="space-y-1 md:col-span-6">
                  <label className={LABEL_CLASS}>
                    <span>E-mail corporativo ou pessoal</span>
                  </label>
                  <input
                    type="email"
                    placeholder="colaborador@mch.com.br"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ETAPA 2: FUNÇÃO & VÍNCULO CONTRATUAL
             ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>Cargo, vínculo e admissão</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Defina a função exercida, tipo de contrato e data de entrada.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
                {/* Tipo de Vínculo */}
                <div className="space-y-1 md:col-span-3">
                  <label className={LABEL_CLASS}>
                    <span>Tipo de vínculo contratual</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.type || 'CLT'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className={SELECT_CLASS}
                  >
                    <option value="CLT">CLT (carteira assinada)</option>
                    <option value="Jurídico">PJ / jurídico</option>
                    <option value="Freelance">Diária / freelance</option>
                    <option value="Estágio">Estágio</option>
                    <option value="Menor Aprendiz">Menor aprendiz</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1 md:col-span-3">
                  <label className={LABEL_CLASS}>
                    <span>Status atual</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.status || 'Ativo'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={SELECT_CLASS}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Em Férias">Em férias</option>
                    <option value="Afastado">Afastado</option>
                    <option value="Desligado">Desligado</option>
                  </select>
                </div>

                {/* Função / Cargo */}
                <div className="space-y-1 md:col-span-4">
                  <div className="flex items-center justify-between">
                    <label className={LABEL_CLASS}>
                      <span>Função / cargo</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={onOpenRolesConfig}
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Gerenciar cargos</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="select-role"
                      placeholder="Pesquisar ou digitar cargo..."
                      value={roleSearch}
                      onChange={(e) => {
                        setRoleSearch(e.target.value);
                        setFormData({ ...formData, role: e.target.value });
                        setIsRoleListOpen(true);
                        if (stepErrors.role) setStepErrors(prev => ({ ...prev, role: '' }));
                      }}
                      onFocus={() => {
                        setRoleSearch(formData.role || '');
                        setIsRoleListOpen(true);
                      }}
                      onBlur={() => setTimeout(() => setIsRoleListOpen(false), 200)}
                      className={stepErrors.role ? INPUT_ERROR_CLASS : INPUT_CLASS}
                    />
                    {stepErrors.role && (
                      <span className="text-[11px] text-rose-400 font-medium block mt-1">{stepErrors.role}</span>
                    )}
                    {isRoleListOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-[#101726] border border-white/15 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {roles
                          .filter(r => r.nome.toLowerCase().includes(roleSearch.toLowerCase()))
                          .map((role) => (
                            <div
                              key={role.id}
                              onClick={() => {
                                setRoleSearch(role.nome);
                                setFormData({ ...formData, role: role.nome });
                                setIsRoleListOpen(false);
                                setStepErrors(prev => ({ ...prev, role: '' }));
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

                <div className="space-y-1 md:col-span-2">
                  <label className={LABEL_CLASS}>
                    <span>Data de admissão</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.admission_date || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, admission_date: e.target.value });
                      if (stepErrors.admission_date) setStepErrors(prev => ({ ...prev, admission_date: '' }));
                    }}
                    className={stepErrors.admission_date ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.admission_date && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.admission_date}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ETAPA 3: CURSOS, FORMAÇÕES & CONHECIMENTOS DE VIDA
             ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-sky-400" />
                  <span>Cursos, formações e conhecimentos de vida</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adicione cursos, graduações, certificados anexados e noções práticas da vivência do colaborador.
                </p>
              </div>

              {/* Seção A: Cursos e Formações */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cursos e formações ({cursos.length})</span>
                  </span>
                </div>

                {/* Formulário para Adicionar Curso */}
                <div className="p-4 rounded-xl bg-[#0A0E17]/90 border border-white/10 space-y-3.5 shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
                    {/* Tipo de Formação */}
                    <div className="md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Tipo de formação</label>
                      <select
                        value={novoCurso.tipo}
                        onChange={(e) => setNovoCurso({ ...novoCurso, tipo: e.target.value as TipoFormacao })}
                        className={SELECT_CLASS}
                      >
                        {FORMACOES_OPCOES.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Nome do Curso */}
                    <div className="md:col-span-4 space-y-1">
                      <label className={LABEL_CLASS}>Nome do curso ou especialização</label>
                      <input
                        placeholder="Ex: Engenharia Civil, Técnico em Edificações, NR-35..."
                        value={novoCurso.nomeCurso}
                        onChange={(e) => setNovoCurso({ ...novoCurso, nomeCurso: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Instituição */}
                    <div className="md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Instituição de ensino</label>
                      <input
                        placeholder="Ex: UFMG, SENAI, Estácio..."
                        value={novoCurso.instituicao}
                        onChange={(e) => setNovoCurso({ ...novoCurso, instituicao: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Início */}
                    <div className="md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Início (mês/ano ou ano)</label>
                      <input
                        placeholder="Ex: 02/2018 ou 2018"
                        value={novoCurso.dataInicio}
                        onChange={(e) => setNovoCurso({ ...novoCurso, dataInicio: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Fim */}
                    <div className="md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Fim ou conclusão</label>
                      <input
                        placeholder="Ex: 12/2022 ou Concluído"
                        value={novoCurso.dataFim}
                        onChange={(e) => setNovoCurso({ ...novoCurso, dataFim: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Observação */}
                    <div className="md:col-span-4 space-y-1">
                      <label className={LABEL_CLASS}>Observação</label>
                      <input
                        placeholder="Informações adicionais, carga horária..."
                        value={novoCurso.observacoes}
                        onChange={(e) => setNovoCurso({ ...novoCurso, observacoes: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Status</label>
                      <select
                        value={novoCurso.status}
                        onChange={(e) => setNovoCurso({ ...novoCurso, status: e.target.value as any })}
                        className={SELECT_CLASS}
                      >
                        <option value="Concluído">Concluído</option>
                        <option value="Em Andamento">Em andamento</option>
                        <option value="Vivência / Prática">Vivência / prática</option>
                      </select>
                    </div>

                    {/* Anexar Certificado */}
                    <div className="md:col-span-6 space-y-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className={LABEL_CLASS}>
                          <span className="flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                            <span>Anexar certificado ou comprovante</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">(opcional • múltiplos arquivos)</span>
                        </label>
                        
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Selecionar arquivos</span>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            onChange={handleCertificateUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {novoCurso.certificados.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {novoCurso.certificados.map((cert) => (
                            <div 
                              key={cert.id}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300"
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                              <span className="truncate max-w-[180px] font-medium" title={cert.nome}>
                                {cert.nome}
                              </span>
                              {cert.tamanho && (
                                <span className="text-[10px] text-sky-400/70">({cert.tamanho})</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveCertificate(cert.id)}
                                className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                                title="Remover anexo"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddCurso}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar curso à ficha</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Cursos Cadastrados */}
                {cursos.length > 0 ? (
                  <div className="space-y-2">
                    {cursos.map((c) => (
                      <div 
                        key={c.id} 
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 group hover:border-sky-500/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-white">{c.nomeCurso}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                                {c.tipo}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {c.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">
                              {c.instituicao ? `${c.instituicao} • ` : ''}
                              {c.dataInicio || c.dataFim ? `Período: ${c.dataInicio || 'Início não inf.'} até ${c.dataFim || 'Fim não inf.'}` : ''}
                            </p>

                            {c.observacoes && (
                              <p className="text-[11px] text-slate-400 italic">
                                Obs: {c.observacoes}
                              </p>
                            )}

                            {/* Certificados Anexados salvos neste curso */}
                            {c.certificados && c.certificados.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {c.certificados.map((cert) => (
                                  <a
                                    key={cert.id}
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={cert.nome}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-sky-300 transition-colors"
                                    title="Clique para baixar / visualizar certificado"
                                  >
                                    <Download className="w-3 h-3 text-sky-400" />
                                    <span className="truncate max-w-[150px]">{cert.nome}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCurso(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                          title="Remover curso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">Nenhum curso adicionado ainda.</p>
                )}
              </div>

              {/* Seção B: Conhecimento de Vida & Noções Práticas */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div>
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Conhecimento de vida e noções práticas</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Habilidades que o colaborador domina por experiência e vivência, mesmo sem ter formação acadêmica formal.
                  </p>
                </div>

                {/* Input para Adicionar Noção de Vida */}
                <div className="flex gap-2">
                  <input
                    placeholder="Ex: Noção de solda, vivência em carpintaria, assentamento de pisos..."
                    value={novoConhecimento}
                    onChange={(e) => setNovoConhecimento(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddConhecimento())}
                    className={INPUT_CLASS}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddConhecimento()}
                    className="px-4 h-10 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {/* Tags Rápidas de Sugestão */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-500">Sugestões rápidas do setor:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {VIVENCIAS_SUGESTOES.map((sug) => {
                      const jaPossui = conhecimentosVida.includes(sug);
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleAddConhecimento(sug)}
                          disabled={jaPossui}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            jaPossui
                              ? 'bg-white/5 text-slate-500 border-white/5 opacity-50 cursor-not-allowed'
                              : 'bg-[#0A0E17] text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-amber-300'
                          }`}
                        >
                          + {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags Selecionadas */}
                {conhecimentosVida.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <span className="text-[11px] font-semibold text-amber-300">
                      Vivências cadastradas ({conhecimentosVida.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {conhecimentosVida.map((item) => (
                        <span 
                          key={item}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#101726] border border-amber-500/30 text-white shadow-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveConhecimento(item)}
                            className="text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Remover"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              ETAPA 4: DADOS BANCÁRIOS & DOCUMENTOS
             ========================================================= */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Dados para pagamento e documentação</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Informações de chave PIX e fotos/arquivos de documentos.</p>
              </div>

              {/* PIX e Banco */}
              <div className="p-4 rounded-xl bg-[#0A0E17]/60 border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-sky-400 block">Chave PIX e conta bancária</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>Titular da conta</label>
                    <input
                      placeholder="Nome do titular como no banco"
                      value={formData.bank_account_name || ''}
                      onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>Instituição bancária</label>
                    <input
                      placeholder="Ex: Nubank, Itaú, Banco do Brasil..."
                      value={formData.bank_name || ''}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>Tipo da chave PIX</label>
                    <select
                      value={formData.bank_key_type || 'CPF'}
                      onChange={(e) => setFormData({ ...formData, bank_key_type: e.target.value as any })}
                      className={SELECT_CLASS}
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Telefone">Telefone</option>
                      <option value="Chave Aleatória">Chave aleatória</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Chave PIX</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
                      placeholder="Insira a chave PIX"
                      value={formData.bank_key || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, bank_key: e.target.value });
                        if (stepErrors.bank_key) setStepErrors(prev => ({ ...prev, bank_key: '' }));
                      }}
                      className={stepErrors.bank_key ? INPUT_ERROR_CLASS : INPUT_CLASS}
                    />
                    {stepErrors.bank_key && (
                      <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.bank_key}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="p-4 rounded-xl bg-[#0A0E17]/60 border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-sky-400 block">Documentação pessoal</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>Tipo de documento</label>
                    <select
                      value={formData.document_type || 'RG'}
                      onChange={(e) => setFormData({ ...formData, document_type: e.target.value as any })}
                      className={SELECT_CLASS}
                    >
                      <option value="RG">RG</option>
                      <option value="CNH">CNH</option>
                      <option value="Passaporte">Passaporte</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Número do documento</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
                      placeholder="00.000.000-0"
                      value={formData.document || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, document: e.target.value });
                        if (stepErrors.document) setStepErrors(prev => ({ ...prev, document: '' }));
                      }}
                      className={stepErrors.document ? INPUT_ERROR_CLASS : INPUT_CLASS}
                    />
                    {stepErrors.document && (
                      <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.document}</span>
                    )}
                  </div>

                  {/* Upload Frente */}
                  <div className="relative group border border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors min-h-[120px]">
                    <input
                      type="file"
                      id="file-front-func"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'front')}
                      disabled={isUploadingFront}
                    />
                    {isUploadingFront ? (
                      <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                    ) : formData.document_front ? (
                      <div className="space-y-2">
                        <img 
                          src={formData.document_front} 
                          alt="Frente Documento" 
                          className="h-16 w-auto object-cover rounded-lg border border-white/10 mx-auto" 
                        />
                        <span className="text-[11px] text-emerald-400 block font-semibold">Frente anexada</span>
                        <label 
                          htmlFor="file-front-func" 
                          className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer block"
                        >
                          Trocar arquivo
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="file-front-func" className="cursor-pointer space-y-1">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto group-hover:text-sky-400 transition-colors" />
                        <span className="text-xs text-slate-300 font-semibold block">Anexar frente do documento</span>
                        <span className="text-[10px] text-slate-500 block">PNG, JPG ou PDF até 25MB</span>
                      </label>
                    )}
                  </div>

                  {/* Upload Verso */}
                  <div className="relative group border border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors min-h-[120px]">
                    <input
                      type="file"
                      id="file-back-func"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'back')}
                      disabled={isUploadingBack}
                    />
                    {isUploadingBack ? (
                      <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                    ) : formData.document_back ? (
                      <div className="space-y-2">
                        <img 
                          src={formData.document_back} 
                          alt="Verso Documento" 
                          className="h-16 w-auto object-cover rounded-lg border border-white/10 mx-auto" 
                        />
                        <span className="text-[11px] text-emerald-400 block font-semibold">Verso anexado</span>
                        <label 
                          htmlFor="file-back-func" 
                          className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer block"
                        >
                          Trocar arquivo
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="file-back-func" className="cursor-pointer space-y-1">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto group-hover:text-sky-400 transition-colors" />
                        <span className="text-xs text-slate-300 font-semibold block">Anexar verso do documento</span>
                        <span className="text-[10px] text-slate-500 block">PNG, JPG ou PDF até 25MB</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ETAPA 5: ENDEREÇO RESIDENCIAL & OBSERVAÇÕES
             ========================================================= */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>Endereço residencial e observações</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Localização de moradia e anotações internas da liderança/RH.</p>
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div className="space-y-1">
                  <label className={LABEL_CLASS}>
                    <span>CEP</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    placeholder="00000-000"
                    value={address.cep}
                    onChange={handleCEPChange}
                    className={stepErrors.cep ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.cep && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.cep}</span>
                  )}
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className={LABEL_CLASS}>
                    <span>Rua / logradouro</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    placeholder="Rua ou avenida"
                    value={address.street}
                    onChange={(e) => {
                      setAddress({ ...address, street: e.target.value });
                      if (stepErrors.street) setStepErrors(prev => ({ ...prev, street: '' }));
                    }}
                    className={stepErrors.street ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.street && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.street}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={LABEL_CLASS}>
                    <span>Número</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="input-number"
                    placeholder="123"
                    value={address.number}
                    onChange={(e) => {
                      setAddress({ ...address, number: e.target.value });
                      if (stepErrors.number) setStepErrors(prev => ({ ...prev, number: '' }));
                    }}
                    className={stepErrors.number ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.number && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.number}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={LABEL_CLASS}>Complemento</label>
                  <input
                    placeholder="Apto, bloco..."
                    value={address.complement}
                    onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1">
                  <label className={LABEL_CLASS}>
                    <span>Bairro</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    placeholder="Bairro"
                    value={address.neighborhood}
                    onChange={(e) => {
                      setAddress({ ...address, neighborhood: e.target.value });
                      if (stepErrors.neighborhood) setStepErrors(prev => ({ ...prev, neighborhood: '' }));
                    }}
                    className={stepErrors.neighborhood ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.neighborhood && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.neighborhood}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={LABEL_CLASS}>
                    <span>Cidade / UF</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    placeholder="Cidade"
                    value={address.city ? `${address.city}${address.state ? ' - ' + address.state : ''}` : ''}
                    onChange={(e) => {
                      setAddress({ ...address, city: e.target.value });
                      if (stepErrors.city) setStepErrors(prev => ({ ...prev, city: '' }));
                    }}
                    className={stepErrors.city ? INPUT_ERROR_CLASS : INPUT_CLASS}
                  />
                  {stepErrors.city && (
                    <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.city}</span>
                  )}
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className={LABEL_CLASS}>Anotações internas e histórico</label>
                <textarea
                  rows={3}
                  placeholder="Informações adicionais sobre o colaborador, histórico de feedback, orientações..."
                  value={formData.observations || ''}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer com Navegação Entre Etapas (Fixo) */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0F1626] flex items-center justify-between shrink-0">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}

            {currentStep < ETAPAS.length ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>{selectedFuncionario ? 'Salvar alterações' : 'Concluir cadastro'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
