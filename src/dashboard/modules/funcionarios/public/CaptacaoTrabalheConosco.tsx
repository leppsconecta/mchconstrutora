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
  Loader2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Plus,
  Trash2,
  X,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Download
} from 'lucide-react';
import { Funcionario, CargoItem, FormacaoCurso, TipoFormacao, CertificadoAnexo, EstadoCivil } from '../types';

const ESTADO_CIVIL_OPCOES: EstadoCivil[] = [
  'Solteiro(a)',
  'Casado(a)',
  'União Estável',
  'Divorciado(a)',
  'Viúvo(a)'
];
import { 
  STORAGE_KEY_FUNCIONARIOS, 
  STORAGE_KEY_CARGOS, 
  STORAGE_KEY_CONFIG, 
  INITIAL_CARGOS 
} from '../mockData';

// Títulos em caixa normal (apenas a primeira maiúscula)
const ETAPAS = [
  { id: 1, titulo: 'Dados pessoais', desc: 'Identificação e contatos' },
  { id: 2, titulo: 'Vaga pretendida', desc: 'Cargo de interesse' },
  { id: 3, titulo: 'Cursos e vivências', desc: 'Formação e certificados' },
  { id: 4, titulo: 'Bancário e documentos', desc: 'PIX e documentação' },
  { id: 5, titulo: 'Endereço e mensagem', desc: 'Localização e finalização' }
];

// Sem categoria 'Outro'
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

export const CaptacaoTrabalheConosco: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [publicEnabled, setPublicEnabled] = useState(true);
  const [roles, setRoles] = useState<CargoItem[]>(INITIAL_CARGOS);

  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [stepWarning, setStepWarning] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Funcionario>>({
    status: 'Ativo',
    type: 'CLT',
    gender: 'Masculino',
    bank_key_type: 'CPF',
    document_type: 'RG',
    empresa_id: 'emp-1',
    marital_status: 'Solteiro(a)',
    nacionalidade: 'Brasileira'
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

  // Cursos e Vivências
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

  const [conhecimentosVida, setConhecimentosVida] = useState<string[]>([]);
  const [novoConhecimento, setNovoConhecimento] = useState('');

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
        setStepErrors(prev => {
          const n = { ...prev };
          delete n.cep;
          delete n.street;
          delete n.neighborhood;
          delete n.city;
          return n;
        });
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

  // Upload múltiplos certificados em Cursos
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

  // Validação estrita de etapas
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

      // Telefone de recado obrigatório e NÃO PODE SER O MESMO
      const cleanEmergency = (formData.emergency_phone || '').replace(/\D/g, '');
      if (!cleanEmergency) {
        errors.emergency_phone = 'Telefone para recado é obrigatório.';
      } else if (cleanEmergency.length < 10) {
        errors.emergency_phone = 'Informe um telefone para recado válido com DDD.';
      } else if (cleanPhone && cleanEmergency === cleanPhone) {
        errors.emergency_phone = 'O telefone para recado não pode ser o mesmo número pessoal.';
      }

      if (!formData.gender) {
        errors.gender = 'Selecione seu sexo.';
      }

      if (formData.birth_date) {
        const today = new Date().toISOString().split('T')[0];
        if (formData.birth_date > today) {
          errors.birth_date = 'Data de nascimento não pode ser no futuro.';
        }
      }
    } else if (stepNumber === 2) {
      if (!formData.role?.trim()) {
        errors.role = 'Selecione a função pretendida.';
      }
    } else if (stepNumber === 3) {
      // Cursos e Vivências
    } else if (stepNumber === 4) {
      if (!formData.document?.trim()) {
        errors.document = 'Número do documento é obrigatório.';
      }
      if (!formData.bank_key?.trim()) {
        errors.bank_key = 'Chave PIX é obrigatória.';
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

    // Avançar: todas as anteriores devem ser válidas
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    for (let s = 1; s <= ETAPAS.length; s++) {
      const check = validateStep(s);
      if (!check.valid) {
        setStepErrors(check.errors);
        setStepWarning(`Por favor, complete a etapa ${s} (${ETAPAS[s - 1].titulo}) antes de enviar.`);
        setCurrentStep(s);
        return;
      }
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
      emergency_phone: formData.emergency_phone || '',
      email: formData.email || '',
      gender: formData.gender || 'Masculino',
      birth_date: formData.birth_date || '',
      marital_status: formData.marital_status || 'Solteiro(a)',
      naturalidade: formData.naturalidade || '',
      nacionalidade: formData.nacionalidade || 'Brasileira',
      father_name: formData.father_name || '',
      mother_name: formData.mother_name || '',
      voter_title: formData.voter_title || '',
      voter_zone: formData.voter_zone || '',
      voter_section: formData.voter_section || '',
      military_certificate: formData.military_certificate || '',
      ctps_number: formData.ctps_number || '',
      pis_pasep: formData.pis_pasep || '',
      bank_account_name: formData.bank_account_name || '',
      bank_name: formData.bank_name || '',
      bank_key_type: formData.bank_key_type || 'CPF',
      bank_key: formData.bank_key || '',
      document_type: formData.document_type || 'RG',
      document: formData.document || '',
      document_front: formData.document_front || '',
      document_back: formData.document_back || '',
      observations: formData.observations || 'Cadastro enviado via página pública Trabalhe Conosco.',
      formacoesCursos: cursos,
      conhecimentosVida: conhecimentosVida,
      ...address
    };

    try {
      const currentStored = localStorage.getItem(STORAGE_KEY_FUNCIONARIOS);
      const list: Funcionario[] = currentStored ? JSON.parse(currentStored) : [];
      list.unshift(newColaborador);
      localStorage.setItem(STORAGE_KEY_FUNCIONARIOS, JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  const progressPercent = Math.round((currentStep / ETAPAS.length) * 100);

  if (!publicEnabled) {
    return (
      <div className="min-h-screen bg-[#0B111E] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#101726] border border-white/10 rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-white">Captação temporariamente pausada</h2>
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
        <div className="max-w-md w-full bg-[#101726] border border-white/10 rounded-3xl p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Cadastro enviado com sucesso!</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seus dados, cursos, certificados e histórico foram enviados com segurança para o RH da MCH Engenharia & Imobiliária.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B111E] text-white py-4 sm:py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Logotipo Oficial Machado Centralizado (Sem link de voltar) */}
        <div className="flex items-center justify-center py-1 sm:py-2">
          <h1 className="sr-only">
            Trabalhe Conosco | Cadastro de Colaboradores e Oportunidades - Machado Construtora e Incorporadora
          </h1>
          <img
            src="/logos/logotipo_machado_header.png"
            alt="Machado Engenharia & Imobiliária"
            className="h-8 sm:h-11 w-auto object-contain"
          />
        </div>

        {/* Card Principal da Aplicação */}
        <div className="bg-[#101726] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header de Progresso com Pills */}
          <div className="px-3.5 sm:px-6 pt-4 pb-3.5 sm:pt-5 sm:pb-4 border-b border-white/10 bg-[#0F1626] space-y-3 sm:space-y-4">
            
            {/* Desktop: Título e % */}
            <div className="hidden sm:flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Ficha cadastral do candidato
                </h3>
                <p className="text-xs text-slate-400">
                  Etapa <span className="text-sky-400 font-bold">{currentStep}</span> de {ETAPAS.length} • {ETAPAS[currentStep - 1].titulo}
                </p>
              </div>
              <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                {progressPercent}%
              </span>
            </div>

            {/* Mobile: Exibe CENTRALIZADO apenas a etapa que o usuário está */}
            <div className="sm:hidden text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-bold">
                <span>Etapa {currentStep} de {ETAPAS.length}</span>
                <span className="text-slate-600">•</span>
                <span>{progressPercent}%</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {ETAPAS[currentStep - 1].titulo}
              </h3>
              <p className="text-[11px] text-slate-400">
                {ETAPAS[currentStep - 1].desc}
              </p>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="w-full bg-white/5 rounded-full h-1.5 sm:h-2 overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-sky-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Pills de Navegação - Apenas Desktop (no mobile fica oculto) */}
              <div className="hidden sm:grid sm:grid-cols-5 gap-1.5 pt-1">
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

          {/* Alerta de Validação */}
          {stepWarning && (
            <div className="mx-3.5 sm:mx-6 mt-3 sm:mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-300 text-xs shrink-0 animate-in fade-in">
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

          {/* Conteúdo da Etapa - Padding otimizado para não achatar inputs no mobile */}
          <div className="p-3.5 sm:p-8 space-y-5 sm:space-y-6 min-h-[420px] sm:min-h-[460px]">
            
            {/* ETAPA 1: DADOS PESSOAIS */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 sm:gap-3.5">
                  <div className="col-span-2 md:col-span-4 space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Nome completo</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
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

                  {/* Sexo e Data de nascimento na mesma linha no mobile */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
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

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className={LABEL_CLASS}>Data de nascimento</label>
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

                  <div className="col-span-2 sm:col-span-1 md:col-span-2 space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Telefone pessoal / WhatsApp</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
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
                  <div className="col-span-2 sm:col-span-1 md:col-span-2 space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Telefone para recado</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
                      placeholder="(31) 90000-0000 (familiar)"
                      value={formData.emergency_phone || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, emergency_phone: e.target.value });
                        if (stepErrors.emergency_phone) setStepErrors(prev => ({ ...prev, emergency_phone: '' }));
                      }}
                      className={stepErrors.emergency_phone ? INPUT_ERROR_CLASS : INPUT_CLASS}
                    />
                    {stepErrors.emergency_phone && (
                      <span className="text-[11px] text-rose-400 font-medium block leading-tight">
                        {stepErrors.emergency_phone}
                      </span>
                    )}
                  </div>

                  {/* Estado Civil e Nacionalidade */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className={LABEL_CLASS}>Estado civil</label>
                    <select
                      value={formData.marital_status || 'Solteiro(a)'}
                      onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as any })}
                      className={SELECT_CLASS}
                    >
                      {ESTADO_CIVIL_OPCOES.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className={LABEL_CLASS}>Nacionalidade</label>
                    <input
                      placeholder="Ex: Brasileira"
                      value={formData.nacionalidade || ''}
                      onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Naturalidade */}
                  <div className="col-span-2 md:col-span-2 space-y-1">
                    <label className={LABEL_CLASS}>Naturalidade (cidade / UF natal)</label>
                    <input
                      placeholder="Ex: Belo Horizonte - MG"
                      value={formData.naturalidade || ''}
                      onChange={(e) => setFormData({ ...formData, naturalidade: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Filiação */}
                  <div className="col-span-2 md:col-span-3 space-y-1">
                    <label className={LABEL_CLASS}>Nome da mãe</label>
                    <input
                      placeholder="Nome completo da mãe"
                      value={formData.mother_name || ''}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-3 space-y-1">
                    <label className={LABEL_CLASS}>Nome do pai</label>
                    <input
                      placeholder="Nome completo do pai (opcional)"
                      value={formData.father_name || ''}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-6 space-y-1">
                    <label className={LABEL_CLASS}>E-mail</label>
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: VAGA PRETENDIDA (SEM EMPRESA DE INTERESSE) */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Função / cargo pretendido</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.role || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value });
                        if (stepErrors.role) setStepErrors(prev => ({ ...prev, role: '' }));
                      }}
                      className={stepErrors.role ? INPUT_ERROR_CLASS : SELECT_CLASS}
                    >
                      <option value="">Selecione a função pretendida...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.nome}>{r.nome}</option>
                      ))}
                    </select>
                    {stepErrors.role && (
                      <span className="text-[11px] text-rose-400 font-medium block">{stepErrors.role}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className={LABEL_CLASS}>Regime de contratação preferencial</label>
                    <select
                      value={formData.type || 'CLT'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className={SELECT_CLASS}
                    >
                      <option value="CLT">CLT (carteira assinada)</option>
                      <option value="Jurídico">PJ / prestador de serviço</option>
                      <option value="Freelance">Diária / freelancer</option>
                      <option value="Estágio">Estágio</option>
                      <option value="Menor Aprendiz">Menor aprendiz</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: CURSOS, FORMAÇÕES & CONHECIMENTOS DE VIDA */}
            {currentStep === 3 && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
                {/* Formulário de Adição de Cursos */}
                <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E17]/90 border border-white/10 space-y-3 sm:space-y-3.5 shadow-md">
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Adicionar formação ou curso ({cursos.length})</span>
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 sm:gap-3.5">
                    <div className="col-span-2 md:col-span-2 space-y-1">
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

                    <div className="col-span-2 md:col-span-4 space-y-1">
                      <label className={LABEL_CLASS}>Nome do curso ou especialização</label>
                      <input
                        placeholder="Ex: Engenharia Civil, Técnico em Edificações, NR-35..."
                        value={novoCurso.nomeCurso}
                        onChange={(e) => setNovoCurso({ ...novoCurso, nomeCurso: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-2 md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Instituição</label>
                      <input
                        placeholder="Ex: UFMG, SENAI, Estácio..."
                        value={novoCurso.instituicao}
                        onChange={(e) => setNovoCurso({ ...novoCurso, instituicao: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Início e Fim na mesma linha no mobile */}
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Início</label>
                      <input
                        placeholder="Ex: 02/2019"
                        value={novoCurso.dataInicio}
                        onChange={(e) => setNovoCurso({ ...novoCurso, dataInicio: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>Fim ou conclusão</label>
                      <input
                        placeholder="Ex: 12/2023"
                        value={novoCurso.dataFim}
                        onChange={(e) => setNovoCurso({ ...novoCurso, dataFim: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-2 md:col-span-4 space-y-1">
                      <label className={LABEL_CLASS}>Observação</label>
                      <input
                        placeholder="Detalhes ou informações adicionais..."
                        value={novoCurso.observacoes}
                        onChange={(e) => setNovoCurso({ ...novoCurso, observacoes: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-2 md:col-span-2 space-y-1">
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
                    <div className="col-span-2 md:col-span-6 space-y-2 pt-1 border-t border-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className={LABEL_CLASS}>
                          <span className="flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                            <span>Anexar certificado ou comprovante</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">(opcional • múltiplos arquivos)</span>
                        </label>
                        
                        <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
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
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {novoCurso.certificados.map((cert) => (
                            <div 
                              key={cert.id}
                              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300 max-w-full"
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                              <span className="truncate max-w-[140px] sm:max-w-[200px] font-medium" title={cert.nome}>{cert.nome}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveCertificate(cert.id)}
                                className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer ml-auto"
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
                      className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar curso à ficha</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Cursos Adicionados */}
                {cursos.length > 0 && (
                  <div className="space-y-2">
                    {cursos.map((c) => (
                      <div 
                        key={c.id} 
                        className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
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
                              <p className="text-[11px] text-slate-400 italic">Obs: {c.observacoes}</p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCurso(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vivências de Vida */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Conhecimento de vida e noções práticas</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Habilidades que você domina por experiência e vivência, mesmo sem diploma formal.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      placeholder="Ex: Vivência em carpintaria, assentamento de pisos..."
                      value={novoConhecimento}
                      onChange={(e) => setNovoConhecimento(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddConhecimento())}
                      className={INPUT_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddConhecimento()}
                      className="px-3 sm:px-4 h-10 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Adicionar</span>
                    </button>
                  </div>

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

                  {conhecimentosVida.length > 0 && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-wrap gap-1.5">
                      {conhecimentosVida.map((item) => (
                        <span 
                          key={item}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#101726] border border-amber-500/30 text-white shadow-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveConhecimento(item)}
                            className="text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 4: DADOS BANCÁRIOS & DOCUMENTOS */}
            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                {/* PIX e Banco */}
                <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E17]/60 border border-white/10 space-y-3">
                  <span className="text-xs font-semibold text-sky-400 block">Chave PIX e conta bancária</span>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className={LABEL_CLASS}>Titular da conta</label>
                      <input
                        placeholder="Nome do titular como no banco"
                        value={formData.bank_account_name || ''}
                        onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className={LABEL_CLASS}>Instituição bancária</label>
                      <input
                        placeholder="Ex: Nubank, Itaú, Banco do Brasil..."
                        value={formData.bank_name || ''}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-1 space-y-1">
                      <label className={LABEL_CLASS}>Tipo da chave</label>
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

                    <div className="col-span-1 space-y-1">
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

                {/* Documentação */}
                <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E17]/60 border border-white/10 space-y-3">
                  <span className="text-xs font-semibold text-sky-400 block">Documentação pessoal</span>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                    <div className="col-span-1 space-y-1">
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

                    <div className="col-span-1 space-y-1">
                      <label className={LABEL_CLASS}>
                        <span>Número</span>
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

                    {/* Upload Frente e Verso lado a lado */}
                    <div className="col-span-1 relative group border border-dashed border-white/15 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors min-h-[115px]">
                      <input
                        type="file"
                        id="pub-front"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        disabled={isUploadingFront}
                      />
                      {isUploadingFront ? (
                        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                      ) : formData.document_front ? (
                        <div className="space-y-1.5">
                          <img src={formData.document_front} alt="Frente" className="h-12 w-auto object-cover rounded-lg mx-auto" />
                          <span className="text-[10px] text-emerald-400 block font-semibold">Frente anexada</span>
                          <label htmlFor="pub-front" className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer block">Trocar</label>
                        </div>
                      ) : (
                        <label htmlFor="pub-front" className="cursor-pointer space-y-1">
                          <Upload className="w-4 h-4 text-slate-400 mx-auto group-hover:text-sky-400 transition-colors" />
                          <span className="text-[11px] text-slate-300 font-semibold block leading-tight">Frente do doc.</span>
                          <span className="text-[9px] text-slate-500 block">Até 25MB</span>
                        </label>
                      )}
                    </div>

                    <div className="col-span-1 relative group border border-dashed border-white/15 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors min-h-[115px]">
                      <input
                        type="file"
                        id="pub-back"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, 'back')}
                        disabled={isUploadingBack}
                      />
                      {isUploadingBack ? (
                        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                      ) : formData.document_back ? (
                        <div className="space-y-1.5">
                          <img src={formData.document_back} alt="Verso" className="h-12 w-auto object-cover rounded-lg mx-auto" />
                          <span className="text-[10px] text-emerald-400 block font-semibold">Verso anexado</span>
                          <label htmlFor="pub-back" className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer block">Trocar</label>
                        </div>
                      ) : (
                        <label htmlFor="pub-back" className="cursor-pointer space-y-1">
                          <Upload className="w-4 h-4 text-slate-400 mx-auto group-hover:text-sky-400 transition-colors" />
                          <span className="text-[11px] text-slate-300 font-semibold block leading-tight">Verso do doc.</span>
                          <span className="text-[9px] text-slate-500 block">Até 25MB</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documentos Profissionais e Eleitorais */}
                <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E17]/60 border border-white/10 space-y-3">
                  <span className="text-xs font-semibold text-sky-400 block">Documentos profissionais e eleitorais</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                    {/* CTPS Digital */}
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>
                        <span>CTPS (Carteira de trabalho)</span>
                      </label>
                      <input
                        placeholder="Geralmente CPF ou nº da física"
                        value={formData.ctps_number || ''}
                        onChange={(e) => setFormData({ ...formData, ctps_number: e.target.value })}
                        className={INPUT_CLASS}
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Na CTPS Digital, basta o CPF.
                      </span>
                    </div>

                    {/* PIS/PASEP */}
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>
                        <span>PIS / PASEP</span>
                      </label>
                      <input
                        placeholder="000.00000.00-0"
                        value={formData.pis_pasep || ''}
                        onChange={(e) => setFormData({ ...formData, pis_pasep: e.target.value })}
                        className={INPUT_CLASS}
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Número do PIS/NIS/PASEP se houver.
                      </span>
                    </div>

                    {/* Título de Eleitor */}
                    <div className="col-span-2 md:col-span-2 space-y-1">
                      <label className={LABEL_CLASS}>
                        <span>Título de eleitor</span>
                      </label>
                      <input
                        placeholder="Número do título de eleitor"
                        value={formData.voter_title || ''}
                        onChange={(e) => setFormData({ ...formData, voter_title: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-1 space-y-1">
                      <label className={LABEL_CLASS}>Zona</label>
                      <input
                        placeholder="Ex: 102"
                        value={formData.voter_zone || ''}
                        onChange={(e) => setFormData({ ...formData, voter_zone: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-1 space-y-1">
                      <label className={LABEL_CLASS}>Seção</label>
                      <input
                        placeholder="Ex: 045"
                        value={formData.voter_section || ''}
                        onChange={(e) => setFormData({ ...formData, voter_section: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </div>

                    {/* Certificado de Reservista (apenas homens) */}
                    {formData.gender === 'Masculino' && (
                      <div className="col-span-2 md:col-span-4 space-y-1 pt-1 border-t border-white/5 animate-in fade-in">
                        <label className={LABEL_CLASS}>
                          <span>Certificado de reservista / alistamento militar</span>
                          <span className="text-[10px] text-sky-400 font-normal">(homens)</span>
                        </label>
                        <input
                          placeholder="Número do certificado de reservista ou dispensa de incorporação"
                          value={formData.military_certificate || ''}
                          onChange={(e) => setFormData({ ...formData, military_certificate: e.target.value })}
                          className={INPUT_CLASS}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 5: ENDEREÇO & MENSAGEM */}
            {currentStep === 5 && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                  <div className="col-span-1 space-y-1">
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

                  <div className="col-span-1 space-y-1">
                    <label className={LABEL_CLASS}>
                      <span>Número</span>
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
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

                  <div className="col-span-2 md:col-span-2 space-y-1">
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

                  <div className="col-span-1 space-y-1">
                    <label className={LABEL_CLASS}>Complemento</label>
                    <input
                      placeholder="Apto, bloco..."
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
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

                  <div className="col-span-2 md:col-span-2 space-y-1">
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

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className={LABEL_CLASS}>Carta de apresentação ou observações</label>
                  <textarea
                    rows={3}
                    placeholder="Conte-nos um pouco sobre suas expectativas, disponibilidade..."
                    value={formData.observations || ''}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    className="w-full bg-[#0A0E17] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer com Navegação Entre Etapas */}
          <div className="px-3.5 sm:px-6 py-3.5 sm:py-4 border-t border-white/10 bg-[#0F1626] flex items-center justify-between shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-3 sm:px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStep < ETAPAS.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 sm:px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <span>Próxima etapa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-4 sm:px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Finalizar candidatura</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CaptacaoTrabalheConosco;
