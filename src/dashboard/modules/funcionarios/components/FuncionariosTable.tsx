import React from 'react';
import { ChevronLeft, ChevronRight, Phone, Trash2 } from 'lucide-react';
import { Funcionario } from '../types';

interface FuncionariosTableProps {
  currentItems: Funcionario[];
  startIndex: number;
  itemsPerPage: number;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, newStatus: Funcionario['status']) => void;
  onRowClick: (emp: Funcionario) => void;
  onDelete: (id: string, name: string) => void;
}

export const FuncionariosTable: React.FC<FuncionariosTableProps> = ({
  currentItems,
  startIndex,
  itemsPerPage,
  filteredCount,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateStatus,
  onRowClick,
  onDelete
}) => {
  return (
    <div className="bg-[#101726]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1000px] table-fixed text-left border-collapse">
          <thead>
            <tr className="bg-[#0A0E17]/60 border-b border-white/10 text-slate-400 text-xs font-semibold">
              <th className="pl-5 pr-2 py-3.5 w-[4%] text-center font-semibold">#</th>
              <th className="px-3 py-3.5 w-[9%] font-semibold">Entrada</th>
              <th className="px-3 py-3.5 w-[21%] font-semibold">Funcionário</th>
              <th className="px-3 py-3.5 w-[14%] font-semibold">Contato</th>
              <th className="px-3 py-3.5 w-[16%] font-semibold">Função</th>
              <th className="px-3 py-3.5 w-[10%] font-semibold">Vínculo</th>
              <th className="px-3 py-3.5 w-[13%] font-semibold">PIX</th>
              <th className="px-3 py-3.5 w-[8%] font-semibold">Status</th>
              <th className="pl-2 pr-5 py-3.5 w-[5%] text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentItems.map((emp, index) => {
              const cleanPhone = emp.phone ? emp.phone.replace(/\D/g, '') : '';
              const formattedPhone = cleanPhone.length === 11 
                ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                : emp.phone;

              return (
                <tr
                  key={emp.id}
                  onClick={() => onRowClick(emp)}
                  className="hover:bg-white/5 transition-colors group cursor-pointer h-[52px]"
                  title="Clique para abrir e editar a ficha do funcionário"
                >
                  <td className="pl-5 pr-2 py-2.5 text-xs text-slate-500 font-mono text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-300 whitespace-nowrap">
                    {emp.admission_date ? new Date(emp.admission_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors truncate" title={emp.name}>
                      {emp.name}
                    </div>
                    {emp.email && (
                      <div className="text-[11px] text-slate-400 truncate" title={emp.email}>
                        {emp.email}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10 whitespace-nowrap">
                      {emp.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-xs text-slate-300 truncate" title={`${emp.bank_key_type || 'PIX'}: ${emp.bank_key || '-'}`}>
                      {emp.bank_key ? `${emp.bank_key_type ? emp.bank_key_type + ': ' : ''}${emp.bank_key}` : '-'}
                    </div>
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={emp.status}
                      onChange={(e) => onUpdateStatus(emp.id, e.target.value as Funcionario['status'])}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors w-full ${
                        emp.status === 'Ativo'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : emp.status === 'Em Férias'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : emp.status === 'Afastado'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <option value="Ativo" className="bg-[#101726] text-emerald-400">Ativo</option>
                      <option value="Em Férias" className="bg-[#101726] text-amber-300">Em Férias</option>
                      <option value="Afastado" className="bg-[#101726] text-purple-300">Afastado</option>
                      <option value="Desligado" className="bg-[#101726] text-rose-400">Desligado</option>
                    </select>
                  </td>
                  <td className="pl-2 pr-5 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onDelete(emp.id, emp.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Excluir funcionário"
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
              <tr key={`empty-${i}`} className="h-[52px]">
                <td colSpan={9} className="pl-5 pr-5">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3.5 bg-[#0A0E17]/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-400">
          Mostrando <span className="text-white font-medium">{filteredCount === 0 ? 0 : startIndex + 1}</span> a{' '}
          <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, filteredCount)}</span> de{' '}
          <span className="text-white font-medium">{filteredCount}</span> colaboradores
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                onClick={() => onPageChange(i + 1)}
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
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Próximo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
