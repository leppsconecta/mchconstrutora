import React, { useState } from 'react';
import { Settings, X, Plus, Edit, Trash2, Check } from 'lucide-react';
import { CargoItem } from '../types';

interface RolesConfigModalProps {
  isOpen: boolean;
  roles: CargoItem[];
  onClose: () => void;
  onAddRole: (name: string) => void;
  onEditRole: (id: string, newName: string) => void;
  onDeleteRole: (id: string, name: string) => void;
}

export const RolesConfigModal: React.FC<RolesConfigModalProps> = ({
  isOpen,
  roles,
  onClose,
  onAddRole,
  onEditRole,
  onDeleteRole
}) => {
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    onAddRole(trimmed);
    setNewRoleName('');
  };

  const handleStartEdit = (role: CargoItem) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.nome);
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editingRoleName.trim();
    if (!trimmed) return;
    onEditRole(id, trimmed);
    setEditingRoleId(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#101726] border border-white/10 rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <span>Configurar Cargos</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Add New Role */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Novo cargo..."
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>

          {/* Roles Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0E17]/60">
            <div className="max-h-[280px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400">
                      Nome do cargo
                    </th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5">
                        {editingRoleId === role.id ? (
                          <input
                            autoFocus
                            value={editingRoleName}
                            onChange={(e) => setEditingRoleName(e.target.value)}
                            onBlur={() => handleSaveEdit(role.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(role.id)}
                            className="w-full px-2 py-1 text-xs bg-[#101726] border border-sky-400 rounded-lg text-white focus:outline-none"
                          />
                        ) : (
                          <span className="text-xs text-slate-200">{role.nome}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {editingRoleId === role.id ? (
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(role.id)}
                              className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                              title="Salvar"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(role)}
                              className="p-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteRole(role.id, role.nome)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
