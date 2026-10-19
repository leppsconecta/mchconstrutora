import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Share2, CheckCircle2 } from 'lucide-react';
import { useConfirmDelete } from '../../context/ConfirmDeleteContext';
import { Funcionario, CargoItem } from './types';
import { 
  STORAGE_KEY_FUNCIONARIOS, 
  STORAGE_KEY_CARGOS, 
  STORAGE_KEY_CONFIG, 
  INITIAL_FUNCIONARIOS, 
  INITIAL_CARGOS, 
  INITIAL_EMPRESAS 
} from './mockData';
import { FuncionariosTable } from './components/FuncionariosTable';
import { FuncionarioFormModal } from './components/FuncionarioFormModal';
import { FuncionarioViewModal } from './components/FuncionarioViewModal';
import { RolesConfigModal } from './components/RolesConfigModal';
import { ShareCaptureModal } from './components/ShareCaptureModal';

export const FuncionariosModule: React.FC = () => {
  const { confirmDelete } = useConfirmDelete();

  // Funcionários State
  const [employees, setEmployees] = useState<Funcionario[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FUNCIONARIOS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FUNCIONARIOS;
  });

  // Cargos State
  const [roles, setRoles] = useState<CargoItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CARGOS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CARGOS;
  });

  // Config State
  const [publicPageEnabled, setPublicPageEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        const config = JSON.parse(stored);
        if (config.publicPageEnabled !== undefined) return config.publicPageEnabled;
      }
    } catch (e) {
      console.error(e);
    }
    return true;
  });

  const companies = INITIAL_EMPRESAS;

  // Search Param from Header (Pesquisa Global)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FUNCIONARIOS, JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARGOS, JSON.stringify(roles));
    } catch (e) {
      console.error(e);
    }
  }, [roles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({ publicPageEnabled }));
    } catch (e) {
      console.error(e);
    }
  }, [publicPageEnabled]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const search = searchTerm.toLowerCase().trim();
      if (!search) return true;

      const compName = companies.find(c => c.id === emp.empresa_id)?.nome || '';

      return (
        emp.name?.toLowerCase().includes(search) ||
        emp.role?.toLowerCase().includes(search) ||
        emp.email?.toLowerCase().includes(search) ||
        emp.phone?.includes(search) ||
        compName.toLowerCase().includes(search)
      );
    });
  }, [employees, searchTerm, companies]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Status Change directly from table
  const handleUpdateStatus = (id: string, newStatus: Funcionario['status']) => {
    setEmployees(prev => prev.map(emp => (emp.id === id ? { ...emp, status: newStatus } : emp)));
    showToast(`Status alterado para "${newStatus}".`);
  };

  // View Detailed Profile
  const handleView = (emp: Funcionario) => {
    setSelectedFuncionario(emp);
    setIsViewModalOpen(true);
  };

  // Open Form to Edit
  const handleEdit = (emp: Funcionario) => {
    setSelectedFuncionario(emp);
    setIsFormModalOpen(true);
  };

  // Open Form to Create New
  const handleNew = () => {
    setSelectedFuncionario(null);
    setIsFormModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = (empData: Funcionario) => {
    if (selectedFuncionario) {
      setEmployees(prev => prev.map(e => (e.id === selectedFuncionario.id ? empData : e)));
      showToast('Colaborador atualizado com sucesso!');
    } else {
      setEmployees(prev => [empData, ...prev]);
      showToast('Novo colaborador cadastrado com sucesso!');
    }
    setIsFormModalOpen(false);
  };

  // Delete with global modal
  const handleDelete = (id: string, name: string) => {
    confirmDelete({
      title: 'Excluir Funcionário',
      message: 'Tem certeza que deseja excluir o cadastro deste colaborador? Esta ação não pode ser desfeita.',
      itemName: name,
      confirmText: 'Excluir',
      onConfirm: () => {
        setEmployees(prev => prev.filter(e => e.id !== id));
        showToast('Funcionário excluído com sucesso.');
      }
    });
  };

  // Roles CRUD
  const handleAddRole = (name: string) => {
    if (roles.some(r => r.nome.toLowerCase() === name.toLowerCase())) {
      showToast('Já existe um cargo cadastrado com este nome.');
      return;
    }
    const newRole: CargoItem = { id: `role_${Date.now()}`, nome: name };
    setRoles(prev => [...prev, newRole]);
    showToast('Cargo adicionado com sucesso!');
  };

  const handleEditRole = (id: string, newName: string) => {
    setRoles(prev => prev.map(r => (r.id === id ? { ...r, nome: newName } : r)));
    showToast('Cargo atualizado.');
  };

  const handleDeleteRole = (id: string, name: string) => {
    confirmDelete({
      title: 'Excluir Cargo',
      message: 'Deseja excluir este cargo da lista da empresa?',
      itemName: name,
      confirmText: 'Excluir',
      onConfirm: () => {
        setRoles(prev => prev.filter(r => r.id !== id));
        showToast('Cargo excluído.');
      }
    });
  };

  return (
    <div className="space-y-4 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[130] px-4 py-2.5 rounded-xl bg-[#101726] border border-sky-400/40 text-sky-300 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#101726]/60 border border-white/5 rounded-2xl p-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Quadro de Colaboradores</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {employees.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Gestão da equipe, dados bancários e fichas cadastrais da MCH Engenharia & Imobiliária.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-white/10 hover:border-sky-400/40 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            title="Compartilhar link de captação externa"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Compartilhar</span>
          </button>

          <button
            type="button"
            onClick={handleNew}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Funcionário</span>
          </button>
        </div>
      </div>

      {/* Tabela de Colaboradores */}
      <FuncionariosTable
        currentItems={currentItems}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        filteredCount={filteredEmployees.length}
        currentPage={currentPage}
        totalPages={totalPages}
        companies={companies}
        onPageChange={setCurrentPage}
        onUpdateStatus={handleUpdateStatus}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal 1: Ficha de Visualização do Funcionário */}
      <FuncionarioViewModal
        isOpen={isViewModalOpen}
        funcionario={selectedFuncionario}
        companies={companies}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEdit}
      />

      {/* Modal 2: Formulário Interno de Cadastro / Edição */}
      <FuncionarioFormModal
        isOpen={isFormModalOpen}
        selectedFuncionario={selectedFuncionario}
        companies={companies}
        roles={roles}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        onOpenRolesConfig={() => setIsRolesModalOpen(true)}
      />

      {/* Modal 3: Configurar Cargos */}
      <RolesConfigModal
        isOpen={isRolesModalOpen}
        roles={roles}
        onClose={() => setIsRolesModalOpen(false)}
        onAddRole={handleAddRole}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
      />

      {/* Modal 4: Compartilhar Link de Captação */}
      <ShareCaptureModal
        isOpen={isShareModalOpen}
        publicPageEnabled={publicPageEnabled}
        onClose={() => setIsShareModalOpen(false)}
        onTogglePublicPage={setPublicPageEnabled}
      />
    </div>
  );
};

export default FuncionariosModule;
