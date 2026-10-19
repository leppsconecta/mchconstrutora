import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Eye, 
  MessageSquare 
} from 'lucide-react';
import { useConfirmDelete } from '../context/ConfirmDeleteContext';

export interface Candidato {
  id: string;
  name: string;
  role: string;
  admission_date: string;
  status: 'Ativo' | 'Em Análise' | 'Aprovado' | 'Banco de Talentos' | 'Desativado';
  phone: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
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

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRICULOS, JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  // Update candidate status directly from table dropdown
  const handleUpdateStatus = (id: string, newStatus: Candidato['status']) => {
    setEmployees(prev => prev.map(emp => (emp.id === id ? { ...emp, status: newStatus } : emp)));
    showToast(`Status alterado para "${newStatus}".`);
  };

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

  // Delete employee
  const handleDeleteEmployee = (id: string, name: string) => {
    confirmDelete({
      title: 'Excluir Candidato / Currículo',
      message: 'Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita.',
      itemName: name,
      confirmText: 'Excluir',
      onConfirm: () => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        showToast('Cadastro excluído com sucesso.');
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
                        title={emp.gender || 'Não informado'}
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
                      <div
                        className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${
                          hasObs
                            ? 'text-sky-400 bg-sky-500/15 border-sky-400/30 shadow-sm shadow-sky-500/10 cursor-help'
                            : 'text-slate-600 bg-white/[0.02] border-white/5 cursor-default'
                        }`}
                        title={hasObs ? `Observação: ${emp.observations}` : 'Sem observações'}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
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
    </div>
  );
};

export default CurriculosModule;
