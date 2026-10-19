import React from 'react';
import { 
  X, 
  User, 
  Building2, 
  CreditCard, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  Edit,
  Download
} from 'lucide-react';
import { Funcionario, EmpresaItem } from '../types';

interface FuncionarioViewModalProps {
  isOpen: boolean;
  funcionario: Funcionario | null;
  companies: EmpresaItem[];
  onClose: () => void;
  onEdit: (func: Funcionario) => void;
}

export const FuncionarioViewModal: React.FC<FuncionarioViewModalProps> = ({
  isOpen,
  funcionario,
  companies,
  onClose,
  onEdit
}) => {
  if (!isOpen || !funcionario) return null;

  const companyName = companies.find(c => c.id === funcionario.empresa_id)?.nome || 'MCH Matriz';
  const cleanPhone = funcionario.phone ? funcionario.phone.replace(/\D/g, '') : '';
  const formattedPhone = cleanPhone.length === 11 
    ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : funcionario.phone;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-[#101726] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden z-10">
        {/* Header com Avatar e Nome */}
        <div className="p-6 border-b border-white/10 bg-[#0F1626] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xl">
              {funcionario.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{funcionario.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  funcionario.status === 'Ativo'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {funcionario.status}
                </span>
              </div>
              <p className="text-xs text-sky-400 font-medium mt-0.5">{funcionario.role} • {companyName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações em Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          {/* Card Contratual & Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0A0E17]/60 border border-white/5">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span>Contrato</span>
              </div>
              <p><strong>Vínculo:</strong> {funcionario.type}</p>
              <p><strong>Entrada:</strong> {funcionario.admission_date ? new Date(funcionario.admission_date).toLocaleDateString('pt-BR') : '-'}</p>
              <p><strong>Gênero:</strong> {funcionario.gender}</p>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contato</span>
              </div>
              <p>
                <strong>Telefone:</strong>{' '}
                {cleanPhone ? (
                  <a href={`https://wa.me/55${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    {formattedPhone}
                  </a>
                ) : '-'}
              </p>
              <p><strong>E-mail:</strong> {funcionario.email || '-'}</p>
              {funcionario.emergency_phone && (
                <p><strong>Emergência:</strong> {funcionario.emergency_phone}</p>
              )}
            </div>
          </div>

          {/* Dados Bancários & PIX */}
          <div className="p-4 rounded-xl bg-[#0A0E17]/60 border border-white/5 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Dados para Pagamento</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p><strong>Banco:</strong> {funcionario.bank_name || '-'}</p>
              <p><strong>Titular:</strong> {funcionario.bank_account_name || '-'}</p>
              <p><strong>Tipo de Chave:</strong> {funcionario.bank_key_type || '-'}</p>
              <p><strong>Chave PIX:</strong> {funcionario.bank_key || '-'}</p>
            </div>
          </div>

          {/* Documentos & Endereço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0A0E17]/60 border border-white/5 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Documentos</span>
              </div>
              <p><strong>{funcionario.document_type || 'Documento'}:</strong> {funcionario.document || '-'}</p>
              <div className="pt-2 flex flex-col gap-1.5">
                {funcionario.document_front ? (
                  <a
                    href={funcionario.document_front}
                    download="doc_frente"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
                  >
                    <Download className="w-3 h-3" /> Baixar Doc Frente
                  </a>
                ) : (
                  <span className="text-slate-500 text-[11px]">Frente não anexada</span>
                )}
                {funcionario.document_back ? (
                  <a
                    href={funcionario.document_back}
                    download="doc_verso"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
                  >
                    <Download className="w-3 h-3" /> Baixar Doc Verso
                  </a>
                ) : (
                  <span className="text-slate-500 text-[11px]">Verso não anexado</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E17]/60 border border-white/5 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Endereço</span>
              </div>
              <p><strong>CEP:</strong> {funcionario.cep || '-'}</p>
              <p><strong>Logradouro:</strong> {funcionario.street ? `${funcionario.street}, ${funcionario.number || 'S/N'}` : '-'}</p>
              {funcionario.complement && <p><strong>Compl:</strong> {funcionario.complement}</p>}
              <p><strong>Bairro / Cidade:</strong> {[funcionario.neighborhood, funcionario.city, funcionario.state].filter(Boolean).join(' - ') || '-'}</p>
            </div>
          </div>

          {/* Observações */}
          {funcionario.observations && (
            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1">
              <span className="text-[11px] font-semibold text-sky-400 uppercase">Observações Internas:</span>
              <p className="text-slate-300 leading-relaxed">{funcionario.observations}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0F1626] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(funcionario);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors inline-flex items-center gap-2 cursor-pointer font-semibold"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editar Cadastro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
