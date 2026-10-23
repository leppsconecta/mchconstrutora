import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Eye, 
  MessageSquare,
  RefreshCw,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { useConfirmDelete } from '../context/ConfirmDeleteContext';
import { supabase, deleteImageFromBucket } from '../../lib/supabase';

export interface Candidato {
  id: string;
  name: string;
  role: string;
  admission_date: string;
  status: 'Ativo' | 'Em Análise' | 'Aprovado' | 'Banco de Talentos' | 'Desativado';
  phone: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  age_range?: string;
  city?: string;
  neighborhood?: string;
  observations?: string;
  resume_url?: string;
}

const STORAGE_KEY_CURRICULOS = 'mch_curriculos_list';

const INITIAL_CANDIDATOS: Candidato[] = [
  {
    id: 'cand-1',
    name: 'Carlos Eduardo Oliveira',
    role: 'Engenheiro(a) Civil',
    admission_date: '2026-03-15',
    status: 'Ativo',
    phone: '31998765432',
    gender: 'Masculino',
    city: 'Divinópolis',
    neighborhood: 'Centro',
    observations: 'Possui CREA ativo e sólida experiência em gestão de obras de alto padrão.',
    resume_url: '#'
  },
  {
    id: 'cand-2',
    name: 'Juliana Mendes Santos',
    role: 'Arquiteto(a) Urbanista',
    admission_date: '2026-04-02',
    status: 'Ativo',
    phone: '31987654321',
    gender: 'Feminino',
    city: 'Divinópolis',
    neighborhood: 'Santa Clara',
    observations: 'Excelente portfólio contemporâneo e disponibilidade para início imediato.',
    resume_url: '#'
  },
  {
    id: 'cand-3',
    name: 'Marcos Vinícius Pereira',
    role: 'Mestre de Obras',
    admission_date: '2026-02-10',
    status: 'Ativo',
    phone: '31991234567',
    gender: 'Masculino',
    city: 'Divinópolis',
    neighborhood: 'Sidil',
    observations: '',
    resume_url: '#'
  },
  {
    id: 'cand-4',
    name: 'Fernanda Albuquerque Lima',
    role: 'Corretor(a) de Imóveis',
    admission_date: '2026-05-20',
    status: 'Ativo',
    phone: '31993456789',
    gender: 'Feminino',
    city: 'Divinópolis',
    neighborhood: 'Centro',
    observations: '',
    resume_url: '#'
  }
];

export const CurriculosModule: React.FC = () => {
  const { confirmDelete } = useConfirmDelete();

  // Candidatos State
  const [employees, setEmployees] = useState<Candidato[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRICULOS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          observations: item.observations !== undefined 
            ? item.observations 
            : (INITIAL_CANDIDATOS.find(c => c.id === item.id)?.observations || '')
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CANDIDATOS;
  });

  // Search Param from Header (Pesquisa Global)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);

  // Estado para Modal de Observação Interativo
  const [selectedObsCandidate, setSelectedObsCandidate] = useState<Candidato | null>(null);
  const [editingObsText, setEditingObsText] = useState('');
  const [isSavingObs, setIsSavingObs] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carregar do Supabase em tempo real com fallback para localStorage
  const loadFromSupabase = useCallback(async (manual = false) => {
    try {
      if (manual) setIsSyncing(true);
      const { data, error } = await supabase
        .from('curriculos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Aviso ao carregar currículos do Supabase:', error);
        if (manual) showToast('Não foi possível sincronizar com o banco.');
        return;
      }

      if (data && data.length > 0) {
        setEmployees(prev => {
          const dbIds = new Set(data.map((d: any) => d.id));
          const existingOnlyLocal = prev.filter(p => !dbIds.has(p.id));
          const combined = [...data, ...existingOnlyLocal];
          try {
            localStorage.setItem(STORAGE_KEY_CURRICULOS, JSON.stringify(combined));
          } catch (e) {
            console.error(e);
          }
          return combined;
        });
        if (manual) showToast('Currículos e observações sincronizados!');
      } else if (manual) {
        showToast('Nenhum currículo encontrado no banco de dados.');
      }
    } catch (err) {
      console.warn('Aviso ao carregar currículos do Supabase:', err);
    } finally {
      if (manual) setIsSyncing(false);
    }
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Carregar inicial e subscrever canais realtime e evento storage
  useEffect(() => {
    loadFromSupabase(false);

    // Escuta em tempo real no Supabase
    const channel = supabase
      .channel('machado_curriculos_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'machado_construtora', table: 'curriculos' },
        () => {
          loadFromSupabase(false);
        }
      )
      .subscribe();

    // Sincronização entre abas locais (quando formulário de trabalhe-conosco é enviado)
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_CURRICULOS);
        if (stored) {
          const parsed = JSON.parse(stored);
          setEmployees(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadFromSupabase]);

  // Sync to localStorage quando employees mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRICULOS, JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  // Abrir Modal de Observação
  const handleOpenObsModal = (emp: Candidato) => {
    setSelectedObsCandidate(emp);
    setEditingObsText(emp.observations || '');
  };

  const handleCloseObsModal = () => {
    setSelectedObsCandidate(null);
    setEditingObsText('');
    setIsSavingObs(false);
  };

  // Salvar Observação e Sincronizar com o Banco Supabase
  const handleSaveObservation = async () => {
    if (!selectedObsCandidate) return;
    setIsSavingObs(true);

    const trimmed = editingObsText.trim();
    const candidateId = selectedObsCandidate.id;

    // Atualiza estado local imediatamente
    setEmployees(prev => {
      const updated = prev.map(e => e.id === candidateId ? { ...e, observations: trimmed } : e);
      try {
        localStorage.setItem(STORAGE_KEY_CURRICULOS, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    // Atualiza no Supabase
    try {
      const { error } = await supabase
        .from('curriculos')
        .update({
          observations: trimmed,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId);

      if (error) {
        console.warn('Aviso ao sincronizar observação com Supabase:', error);
      }
      showToast('Observação salva e sincronizada com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar observação no banco:', err);
      showToast('Observação gravada localmente.');
    } finally {
      setIsSavingObs(false);
      handleCloseObsModal();
    }
  };

  // Update candidate status directly from table dropdown
  const handleUpdateStatus = async (id: string, newStatus: Candidato['status']) => {
    setEmployees(prev => prev.map(emp => (emp.id === id ? { ...emp, status: newStatus } : emp)));
    showToast(`Status alterado para "${newStatus}".`);

    try {
      await supabase.from('curriculos').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn('Aviso ao atualizar status no banco:', e);
    }
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const search = searchTerm.toLowerCase().trim();
      if (!search) return true;

      return (
        emp.name?.toLowerCase().includes(search) ||
        emp.role?.toLowerCase().includes(search) ||
        emp.city?.toLowerCase().includes(search) ||
        emp.neighborhood?.toLowerCase().includes(search) ||
        emp.phone?.includes(search)
      );
    });
  }, [employees, searchTerm]);

  const itemsPerPage = 20;

  const formatDisplayName = (fullName: string) => {
    const parts = fullName.split(' ').filter(Boolean);
    if (parts.length <= 3) return fullName;
    return parts.slice(0, 3).join(' ') + '...';
  };

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Delete employee (e remove arquivo do storage se houver)
  const handleDeleteEmployee = (id: string, name: string) => {
    const target = employees.find(e => e.id === id);

    confirmDelete({
      title: 'Excluir Candidato / Currículo',
      message: 'Tem certeza que deseja excluir este cadastro? O arquivo de currículo também será removido do bucket.',
      itemName: name,
      confirmText: 'Excluir',
      onConfirm: async () => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        showToast('Cadastro excluído com sucesso.');

        try {
          if (target?.resume_url && target.resume_url !== '#') {
            await deleteImageFromBucket(target.resume_url);
          }
          await supabase.from('curriculos').delete().eq('id', id);
        } catch (e) {
          console.warn('Aviso ao deletar do banco:', e);
        }
      }
    });
  };

  // View Resume action
  const handleViewResume = (emp: Candidato) => {
    if (emp.resume_url && emp.resume_url !== '#') {
      window.open(emp.resume_url, '_blank');
    } else {
      showToast(`Visualizando currículo de ${formatDisplayName(emp.name)}.`);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] px-4 py-2.5 rounded-xl bg-[#101726] border border-sky-400/40 text-sky-300 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Barra Superior com Contagem e Botão Sincronizar Banco */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Currículos Recebidos</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              {filteredEmployees.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Cadastros captados no Trabalhe Conosco sincronizados em tempo real com o banco de dados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadFromSupabase(true)}
          disabled={isSyncing}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          title="Sincronizar com o banco de dados Supabase"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Banco'}</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#101726]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-[#0A0E17]/60 border-b border-white/10 text-slate-400 text-xs font-semibold">
                <th className="pl-5 pr-2 py-3.5 w-[3.5%] text-center font-semibold">#</th>
                <th className="px-3 py-3.5 w-[8.5%] font-semibold">Entrada</th>
                <th className="px-3 py-3.5 w-[17%] font-semibold">Candidato</th>
                <th className="px-2 py-3.5 w-[4.5%] text-center font-semibold">Sexo</th>
                <th className="px-3 py-3.5 w-[19%] font-semibold">Cidade / Bairro</th>
                <th className="px-3 py-3.5 w-[12%] font-semibold">Contato</th>
                <th className="px-3 py-3.5 w-[13.5%] font-semibold">Função</th>
                <th className="px-3 py-3.5 w-[10.5%] font-semibold">Status</th>
                <th className="px-2 py-3.5 w-[4.5%] text-center font-semibold">Obs</th>
                <th className="pl-2 pr-5 py-3.5 w-[7%] text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map((emp, index) => {
                const cleanPhone = emp.phone ? emp.phone.replace(/\D/g, '') : '';
                const formattedPhone = cleanPhone.length === 11 
                  ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                  : emp.phone;
                const locationText = [emp.city, emp.neighborhood].filter(Boolean).join(' / ') || '-';
                const genderLetter = emp.gender === 'Feminino' ? 'F' : emp.gender === 'Masculino' ? 'M' : '-';
                const hasObs = Boolean(emp.observations && emp.observations.trim().length > 0);

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-white/5 transition-colors group h-[50px]"
                  >
                    <td className="pl-5 pr-2 py-2.5 text-xs text-slate-500 font-mono text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-300 whitespace-nowrap">
                      {emp.admission_date ? new Date(emp.admission_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors truncate" title={emp.name}>
                        {formatDisplayName(emp.name)}
                      </div>
                      {emp.age_range && (
                        <div className="text-[10px] text-slate-400 font-mono leading-tight">
                          {emp.age_range}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${
                          genderLetter === 'F'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : genderLetter === 'M'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'text-slate-500'
                        }`}
                        title={`${emp.gender || 'Não informado'}${emp.age_range ? ` • Faixa: ${emp.age_range}` : ''}`}
                      >
                        {genderLetter}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-xs text-slate-300 truncate" title={locationText}>
                        {locationText}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {cleanPhone ? (
                        <a
                          href={`https://wa.me/55${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap font-medium"
                          title="Abrir WhatsApp"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{formattedPhone}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20 whitespace-nowrap truncate max-w-full">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={emp.status}
                        onChange={(e) => handleUpdateStatus(emp.id, e.target.value as Candidato['status'])}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors w-full ${
                          emp.status === 'Ativo' || emp.status === 'Aprovado'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : emp.status === 'Em Análise' || emp.status === 'Banco de Talentos'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="Ativo" className="bg-[#101726] text-emerald-400">Ativo</option>
                        <option value="Em Análise" className="bg-[#101726] text-amber-300">Em Análise</option>
                        <option value="Aprovado" className="bg-[#101726] text-emerald-300">Aprovado</option>
                        <option value="Banco de Talentos" className="bg-[#101726] text-sky-300">Banco de Talentos</option>
                        <option value="Desativado" className="bg-[#101726] text-rose-400">Desativado</option>
                      </select>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenObsModal(emp)}
                        className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center cursor-pointer ${
                          hasObs
                            ? 'text-sky-300 bg-sky-500/20 border-sky-400/40 hover:bg-sky-500/30 shadow-sm shadow-sky-500/10'
                            : 'text-slate-500 hover:text-sky-300 bg-white/[0.02] hover:bg-white/10 border-white/5 hover:border-white/15'
                        }`}
                        title={hasObs ? `Observações:\n${emp.observations}\n(Clique para visualizar ou editar)` : 'Adicionar observações'}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {hasObs && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-1 shrink-0 animate-pulse" />
                        )}
                      </button>
                    </td>
                    <td className="pl-2 pr-5 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewResume(emp)}
                          className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Ver currículo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Excluir cadastro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* 20 linhas obrigatórias por página independente de ter valor ou não */}
              {Array.from({ length: Math.max(0, itemsPerPage - currentItems.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-[50px]">
                  <td colSpan={10} className="pl-5 pr-5">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 bg-[#0A0E17]/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Mostrando <span className="text-white font-medium">{filteredEmployees.length === 0 ? 0 : startIndex + 1}</span> a{' '}
            <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> de{' '}
            <span className="text-white font-medium">{filteredEmployees.length}</span> resultados
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Próximo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Interativo de Observações do Candidato */}
      {selectedObsCandidate && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseObsModal}
        >
          <div 
            className="w-full max-w-lg bg-[#101726] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0A0E17]/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    Observações do Candidato
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedObsCandidate.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseObsModal}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Badges Rápidos de Informação */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cargo</span>
                  <span className="font-semibold text-white truncate block" title={selectedObsCandidate.role}>
                    {selectedObsCandidate.role}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Contato</span>
                  <span className="font-semibold text-emerald-400 block font-mono">
                    {selectedObsCandidate.phone || '-'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <span className="font-semibold text-sky-300 block">
                    {selectedObsCandidate.status}
                  </span>
                </div>
              </div>

              {/* Textarea de Observação */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Mensagem Enviada / Observações</span>
                  <span className="text-[10px] text-slate-400 font-normal">Sincronizado com Supabase</span>
                </label>
                <textarea
                  value={editingObsText}
                  onChange={(e) => setEditingObsText(e.target.value)}
                  rows={6}
                  placeholder="Escreva aqui as observações sobre o candidato, feedback de entrevistas ou detalhes adicionais..."
                  className="w-full bg-[#0A0E17] border border-white/15 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/25 transition-all resize-y"
                  autoFocus
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>As alterações salvas aqui atualizam o banco de dados em tempo real.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-[#0A0E17]/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCloseObsModal}
                disabled={isSavingObs}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveObservation}
                disabled={isSavingObs}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingObs ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Salvando no Banco...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Observação</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculosModule;
