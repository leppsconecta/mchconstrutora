import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Building2, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  X, 
  Save, 
  ExternalLink, 
  Copy, 
  Clock, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox
} from 'lucide-react';
import { useConfirmDelete } from '../context/ConfirmDeleteContext';
import { supabase } from '../../lib/supabase';

export interface SolicitacaoContato {
  id: string;
  nome: string;
  empresa?: string | null;
  email: string;
  telefone: string;
  assunto?: string | null;
  mensagem: string;
  status: 'Novo' | 'Em Atendimento' | 'Respondido' | 'Arquivado';
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string;
}

const STORAGE_KEY_CONTATOS = 'mch_contatos_list';

export const ContatoModule: React.FC = () => {
  const { confirmDelete } = useConfirmDelete();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  // Lista de Contatos
  const [contatos, setContatos] = useState<SolicitacaoContato[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONTATOS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modais
  const [selectedDetails, setSelectedDetails] = useState<SolicitacaoContato | null>(null);
  const [selectedObsItem, setSelectedObsItem] = useState<SolicitacaoContato | null>(null);
  const [editingObsText, setEditingObsText] = useState('');
  const [isSavingObs, setIsSavingObs] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carrega do Supabase
  const loadFromSupabase = useCallback(async (manual = false) => {
    try {
      if (manual) setIsSyncing(true);

      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Aviso ao carregar contatos do Supabase:', error);
        if (manual) showToast('Não foi possível sincronizar com o banco.');
        return;
      }

      if (data && data.length > 0) {
        setContatos(prev => {
          const dbIds = new Set(data.map((d: any) => d.id));
          const existingOnlyLocal = prev.filter(p => !dbIds.has(p.id));
          const combined = [...data, ...existingOnlyLocal];
          try {
            localStorage.setItem(STORAGE_KEY_CONTATOS, JSON.stringify(combined));
          } catch (e) {
            console.error(e);
          }
          return combined;
        });
        if (manual) showToast('Contatos sincronizados com sucesso!');
      } else if (manual) {
        showToast('Nenhuma solicitação de contato encontrada no banco.');
      }
    } catch (err) {
      console.warn('Erro ao carregar contatos:', err);
    } finally {
      if (manual) setIsSyncing(false);
    }
  }, []);

  // Reset page when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Carregamento inicial e assinatura Realtime
  useEffect(() => {
    loadFromSupabase(false);

    const channel = supabase
      .channel('machado_contatos_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'machado_construtora', table: 'contatos' },
        () => {
          loadFromSupabase(false);
        }
      )
      .subscribe();

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_CONTATOS);
        if (stored) {
          setContatos(JSON.parse(stored));
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

  // Sincroniza estado para localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTATOS, JSON.stringify(contatos));
    } catch (e) {
      console.error(e);
    }
  }, [contatos]);

  // Contadores
  const stats = useMemo(() => {
    const total = contatos.length;
    const novos = contatos.filter(c => c.status === 'Novo').length;
    const emAtendimento = contatos.filter(c => c.status === 'Em Atendimento').length;
    const respondidos = contatos.filter(c => c.status === 'Respondido').length;
    const arquivados = contatos.filter(c => c.status === 'Arquivado').length;
    return { total, novos, emAtendimento, respondidos, arquivados };
  }, [contatos]);

  // Filtragem dos contatos
  const filteredContatos = useMemo(() => {
    return contatos.filter(item => {
      // Filtro de Status
      if (statusFilter !== 'todos' && item.status !== statusFilter) {
        return false;
      }

      // Busca por texto
      const search = searchTerm.toLowerCase().trim();
      if (!search) return true;

      return (
        item.nome?.toLowerCase().includes(search) ||
        item.empresa?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.telefone?.includes(search) ||
        item.assunto?.toLowerCase().includes(search) ||
        item.mensagem?.toLowerCase().includes(search) ||
        item.observacoes?.toLowerCase().includes(search)
      );
    });
  }, [contatos, searchTerm, statusFilter]);

  // Paginação
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredContatos.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredContatos.slice(startIndex, startIndex + itemsPerPage);

  // Alterar Status
  const handleUpdateStatus = async (id: string, newStatus: SolicitacaoContato['status']) => {
    setContatos(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedDetails && selectedDetails.id === id) {
      setSelectedDetails(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Status atualizado para "${newStatus}".`);

    try {
      await supabase
        .from('contatos')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {
      console.warn('Aviso ao sincronizar status no banco:', e);
    }
  };

  // Abrir Modal de Observações
  const handleOpenObsModal = (item: SolicitacaoContato) => {
    setSelectedObsItem(item);
    setEditingObsText(item.observacoes || '');
  };

  const handleCloseObsModal = () => {
    setSelectedObsItem(null);
    setEditingObsText('');
    setIsSavingObs(false);
  };

  // Salvar Observação
  const handleSaveObservation = async () => {
    if (!selectedObsItem) return;
    setIsSavingObs(true);
    const trimmed = editingObsText.trim();
    const itemId = selectedObsItem.id;

    setContatos(prev => prev.map(c => c.id === itemId ? { ...c, observacoes: trimmed } : c));
    if (selectedDetails && selectedDetails.id === itemId) {
      setSelectedDetails(prev => prev ? { ...prev, observacoes: trimmed } : null);
    }

    try {
      const { error } = await supabase
        .from('contatos')
        .update({ observacoes: trimmed, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) {
        console.warn('Aviso ao sincronizar observação no Supabase:', error);
      }
      showToast('Observação interna salva com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Observação gravada localmente.');
    } finally {
      setIsSavingObs(false);
      handleCloseObsModal();
    }
  };

  // Excluir solicitação
  const handleDeleteContato = (id: string, nome: string) => {
    confirmDelete({
      title: 'Excluir Solicitação de Contato',
      message: 'Tem certeza que deseja excluir esta mensagem do cliente? Esta operação não pode ser desfeita.',
      itemName: `${nome}`,
      confirmText: 'Excluir',
      onConfirm: async () => {
        setContatos(prev => prev.filter(c => c.id !== id));
        if (selectedDetails && selectedDetails.id === id) {
          setSelectedDetails(null);
        }
        showToast('Solicitação de contato excluída.');

        try {
          await supabase.from('contatos').delete().eq('id', id);
        } catch (e) {
          console.warn('Aviso ao deletar contato no banco:', e);
        }
      }
    });
  };

  // Formatação de data
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Helper de WhatsApp
  const getWhatsAppLink = (phone: string, nome: string) => {
    const clean = phone.replace(/\D/g, '');
    const number = clean.startsWith('55') ? clean : `55${clean}`;
    const text = encodeURIComponent(`Olá ${nome}, tudo bem? Sou da Machado Construtora e estou retornando sua solicitação de contato enviada através do nosso site.`);
    return `https://wa.me/${number}?text=${text}`;
  };

  // Copiar para área de transferência
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copiado para a área de transferência!`);
  };

  return (
    <div className="space-y-5 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] px-4 py-2.5 rounded-xl bg-[#101726] border border-sky-400/40 text-sky-300 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cards de Resumo no Topo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('todos')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'todos'
              ? 'bg-sky-500/10 border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
              : 'bg-[#101726]/80 hover:bg-[#101726] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total de Mensagens</span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">{stats.total}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Novo')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Novo'
              ? 'bg-sky-500/15 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
              : 'bg-[#101726]/80 hover:bg-[#101726] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Novas
            </span>
            <Mail className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-300 tracking-tight">{stats.novos}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Em Atendimento')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Em Atendimento'
              ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              : 'bg-[#101726]/80 hover:bg-[#101726] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">Em Atendimento</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 tracking-tight">{stats.emAtendimento}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Respondido')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Respondido'
              ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              : 'bg-[#101726]/80 hover:bg-[#101726] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">Respondidas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-300 tracking-tight">{stats.respondidos}</div>
        </div>
      </div>

      {/* Barra de Ações: Título, Filtros por Pill e Botão de Sincronizar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Solicitações de Contato</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              {filteredContatos.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Mensagens enviadas através da página pública <span className="text-sky-400 font-mono">/contato</span> sincronizadas em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Pills de Filtro de Status */}
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'todos'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Novo')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'Novo'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-sky-300'
              }`}
            >
              Novos ({stats.novos})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Em Atendimento')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'Em Atendimento'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              Atendimento ({stats.emAtendimento})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Respondido')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'Respondido'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Respondidos ({stats.respondidos})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Arquivado')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'Arquivado'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Arquivados ({stats.arquivados})
            </button>
          </div>

          {/* Botão Sincronizar Banco */}
          <button
            type="button"
            onClick={() => loadFromSupabase(true)}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm ml-auto lg:ml-0"
            title="Sincronizar com o banco Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Banco'}</span>
          </button>
        </div>
      </div>

      {/* Tabela de Contatos */}
      <div className="bg-[#101726]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1050px] table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-[#0A0E17]/60 border-b border-white/10 text-slate-400 text-xs font-semibold">
                <th className="pl-5 pr-2 py-3.5 w-[4%] text-center">#</th>
                <th className="px-3 py-3.5 w-[11%]">Data / Hora</th>
                <th className="px-3 py-3.5 w-[20%]">Solicitante</th>
                <th className="px-3 py-3.5 w-[15%]">Contato</th>
                <th className="px-3 py-3.5 w-[15%]">Assunto</th>
                <th className="px-3 py-3.5 w-[18%]">Mensagem</th>
                <th className="px-3 py-3.5 w-[11%]">Status</th>
                <th className="px-2 py-3.5 w-[4%] text-center">Obs</th>
                <th className="pl-2 pr-5 py-3.5 w-[8%] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                    <Inbox className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
                    <span>Nenhuma solicitação de contato encontrada</span>
                    {searchTerm && (
                      <span className="block text-slate-500 text-xs mt-1">
                        Tente ajustar os termos da pesquisa "{searchTerm}".
                      </span>
                    )}
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => {
                  const cleanPhone = item.telefone ? item.telefone.replace(/\D/g, '') : '';
                  const formattedPhone = cleanPhone.length === 11 
                    ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                    : cleanPhone.length === 10
                    ? cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
                    : item.telefone;
                  
                  const hasObs = Boolean(item.observacoes && item.observacoes.trim().length > 0);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors group h-[58px]"
                    >
                      {/* # Index */}
                      <td className="pl-5 pr-2 py-2.5 text-xs text-slate-500 font-mono text-center">
                        {startIndex + index + 1}
                      </td>

                      {/* Data / Hora */}
                      <td className="px-3 py-2.5 text-xs text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{formatDateTime(item.created_at)}</span>
                        </div>
                      </td>

                      {/* Solicitante (Nome & Empresa) */}
                      <td className="px-3 py-2.5">
                        <div 
                          onClick={() => setSelectedDetails(item)}
                          className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors truncate cursor-pointer hover:underline" 
                          title={item.nome}
                        >
                          {item.nome}
                        </div>
                        {item.empresa ? (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate mt-0.5" title={item.empresa}>
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{item.empresa}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 font-mono">Pessoa Física</div>
                        )}
                      </td>

                      {/* Contato (WhatsApp & E-mail) */}
                      <td className="px-3 py-2.5">
                        <div className="space-y-1">
                          {cleanPhone ? (
                            <a
                              href={getWhatsAppLink(item.telefone, item.nome)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap font-medium"
                              title="Conversar no WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{formattedPhone}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500">-</span>
                          )}

                          <div className="text-[11px] text-slate-400 truncate" title={item.email}>
                            <a
                              href={`mailto:${item.email}?subject=${encodeURIComponent('Retorno de Contato - Machado Construtora')}`}
                              className="hover:text-sky-300 transition-colors inline-flex items-center gap-1 truncate max-w-full"
                            >
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Assunto */}
                      <td className="px-3 py-2.5">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20 truncate max-w-full"
                          title={item.assunto || 'Não informado'}
                        >
                          {item.assunto || 'Geral'}
                        </span>
                      </td>

                      {/* Mensagem snippet */}
                      <td className="px-3 py-2.5">
                        <div 
                          onClick={() => setSelectedDetails(item)}
                          className="text-xs text-slate-300 line-clamp-2 cursor-pointer hover:text-white transition-colors"
                          title="Clique para ler a mensagem completa"
                        >
                          {item.mensagem}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value as SolicitacaoContato['status'])}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors w-full ${
                            item.status === 'Novo'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-400/40'
                              : item.status === 'Em Atendimento'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-400/40'
                              : item.status === 'Respondido'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
                              : 'bg-slate-700/40 text-slate-300 border-slate-600'
                          }`}
                        >
                          <option value="Novo" className="bg-[#101726] text-sky-300">Novo</option>
                          <option value="Em Atendimento" className="bg-[#101726] text-amber-300">Em Atendimento</option>
                          <option value="Respondido" className="bg-[#101726] text-emerald-300">Respondido</option>
                          <option value="Arquivado" className="bg-[#101726] text-slate-400">Arquivado</option>
                        </select>
                      </td>

                      {/* Obs */}
                      <td className="px-2 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenObsModal(item)}
                          className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center cursor-pointer ${
                            hasObs
                              ? 'text-sky-300 bg-sky-500/20 border-sky-400/40 hover:bg-sky-500/30 shadow-sm shadow-sky-500/10'
                              : 'text-slate-500 hover:text-sky-300 bg-white/[0.02] hover:bg-white/10 border-white/5 hover:border-white/15'
                          }`}
                          title={hasObs ? `Ver observação: "${item.observacoes}"` : 'Adicionar anotação interna'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="pl-2 pr-5 py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Ver Detalhes */}
                          <button
                            type="button"
                            onClick={() => setSelectedDetails(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 transition-colors cursor-pointer"
                            title="Ver mensagem completa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* WhatsApp direto */}
                          {cleanPhone && (
                            <a
                              href={getWhatsAppLink(item.telefone, item.nome)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                              title="Responder via WhatsApp"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}

                          {/* Excluir */}
                          <button
                            type="button"
                            onClick={() => handleDeleteContato(item.id, item.nome)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Excluir mensagem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela com Paginação */}
        {filteredContatos.length > 0 && (
          <div className="px-5 py-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-[#0A0E17]/40">
            <div>
              Mostrando <span className="font-semibold text-white">{startIndex + 1}</span> a{' '}
              <span className="font-semibold text-white">
                {Math.min(startIndex + itemsPerPage, filteredContatos.length)}
              </span>{' '}
              de <span className="font-semibold text-white">{filteredContatos.length}</span> solicitações
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-3 py-1 rounded-lg bg-white/5 text-white font-mono font-medium">
                  {currentPage} / {totalPages}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Próxima página"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL DE DETALHES COMPLETOS DA SOLICITAÇÃO
         ======================================================== */}
      {selectedDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedDetails(null)} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />

          <div className="relative w-full max-w-2xl bg-[#101726] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            {/* Header do Modal */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0A0E17]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {selectedDetails.nome}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Enviado em {formatDateTime(selectedDetails.created_at)}</span>
                    {selectedDetails.empresa && (
                      <>
                        <span>•</span>
                        <span className="text-sky-300">{selectedDetails.empresa}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Grid com Dados de Contato e Assunto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* E-mail */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>E-mail</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedDetails.email, 'E-mail')}
                      className="text-slate-400 hover:text-sky-300 transition-colors"
                      title="Copiar e-mail"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <a
                    href={`mailto:${selectedDetails.email}`}
                    className="text-sm font-medium text-white hover:text-sky-300 transition-colors break-all"
                  >
                    {selectedDetails.email}
                  </a>
                </div>

                {/* Telefone / WhatsApp */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Telefone / WhatsApp</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedDetails.telefone, 'Telefone')}
                      className="text-slate-400 hover:text-sky-300 transition-colors"
                      title="Copiar telefone"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {selectedDetails.telefone}
                  </div>
                </div>

                {/* Assunto */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Assunto do Contato
                  </div>
                  <div className="text-sm font-semibold text-sky-300">
                    {selectedDetails.assunto || 'Construção Civil / Geral'}
                  </div>
                </div>
              </div>

              {/* Mensagem Enviada */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Mensagem Completa
                </label>
                <div className="p-4 rounded-xl bg-[#0A0E17] border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                  {selectedDetails.mensagem}
                </div>
              </div>

              {/* Status e Observações da Equipe */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status do Atendimento
                  </label>
                  <select
                    value={selectedDetails.status}
                    onChange={(e) => handleUpdateStatus(selectedDetails.id, e.target.value as SolicitacaoContato['status'])}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#101726] text-white border border-white/15 focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="Novo">Novo</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Respondido">Respondido</option>
                    <option value="Arquivado">Arquivado</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-400">
                      Observações / Anotações Internas:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenObsModal(selectedDetails)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer underline"
                    >
                      {selectedDetails.observacoes ? 'Editar Anotação' : '+ Adicionar Anotação'}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                    {selectedDetails.observacoes || 'Nenhuma observação interna cadastrada ainda.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé com Ações Rápidas */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#0A0E17]/60 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDeleteContato(selectedDetails.id, selectedDetails.nome)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedDetails.email}?subject=${encodeURIComponent('Retorno de Contato - Machado Construtora')}`}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>Responder por E-mail</span>
                </a>

                {selectedDetails.telefone && (
                  <a
                    href={getWhatsAppLink(selectedDetails.telefone, selectedDetails.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Abrir WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE OBSERVAÇÃO / NOTA INTERNA
         ======================================================== */}
      {selectedObsItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            onClick={handleCloseObsModal} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />

          <div className="relative w-full max-w-lg bg-[#101726] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Anotação Interna
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseObsModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-300">
                Contato: <strong className="text-white">{selectedObsItem.nome}</strong>
                {selectedObsItem.empresa && <span> ({selectedObsItem.empresa})</span>}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Estas anotações são visíveis apenas para os administradores no painel.
              </p>
            </div>

            <div className="mb-5">
              <textarea
                rows={5}
                value={editingObsText}
                onChange={(e) => setEditingObsText(e.target.value)}
                placeholder="Ex: Entramos em contato via WhatsApp no dia 23/10. Cliente solicitou orçamento para galpão industrial..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseObsModal}
                disabled={isSavingObs}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveObservation}
                disabled={isSavingObs}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-lg shadow-sky-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingObs ? 'Salvando...' : 'Salvar Anotação'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContatoModule;
