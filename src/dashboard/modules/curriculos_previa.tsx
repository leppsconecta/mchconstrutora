import { useState, useMemo, useEffect } from "react";
import { 
    Search, 
    Share2, 
    Plus,
    RefreshCw,
    Trash2,
    Copy,
    Upload,
    Download,
    ChevronLeft,
    ChevronRight,
    Settings,
    Edit,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { employeeService, type Employee, type EmployeeRole } from "@/services/employeeService";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { companyService, type Company } from "./ativos/companies/companyService";

const EmployeesPage = () => {
    const { toast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [roles, setRoles] = useState<EmployeeRole[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    // const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
    const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [publicPageEnabled, setPublicPageEnabled] = useState(true);
    const [roleSearch, setRoleSearch] = useState("");
    const [isRoleListOpen, setIsRoleListOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
    const [editingRoleName, setEditingRoleName] = useState("");
    const [isUploadingFront, setIsUploadingFront] = useState(false);
    const [isUploadingBack, setIsUploadingBack] = useState(false);
    
    // Address State
    const [address, setAddress] = useState({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: ""
    });

    const [formData, setFormData] = useState<Partial<Employee>>({
        status: "Ativo",
        type: "CLT",
        admission_date: new Date().toISOString().split('T')[0],
        gender: "Masculino",
        bank_key_type: "CPF",
        document_type: "RG"
    });

    const loadData = async () => {
        // setIsLoading(true);
        try {
            const [empsData, rolesData, publicPageStatus, compsData] = await Promise.all([
                employeeService.getEmployees(),
                employeeService.getRoles(),
                employeeService.getSetting('public_registration_enabled'),
                companyService.getCompanies()
            ]);
            setEmployees(empsData);
            setRoles(rolesData);
            setPublicPageEnabled(publicPageStatus === true || publicPageStatus === 'active');
            setCompanies(compsData || []);
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao carregar dados", variant: "destructive" });
        } finally {
            // setIsLoading(false);
        }
    };

    const fetchCEP = async (cepToFetch: string) => {
        const cleanCEP = cepToFetch.replace(/\D/g, '');
        if (cleanCEP.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                setAddress(prev => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }));
                setTimeout(() => {
                    document.getElementById('input-number')?.focus();
                }, 100);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
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

    useEffect(() => {
        loadData();

        const employeesSubscription = supabase
            .channel('public:funcionarios')
            .on('postgres_changes', { event: '*', schema: 'erp_central', table: 'funcionarios' }, () => {
                loadData();
            })
            .subscribe();

        const rolesSubscription = supabase
            .channel('public:cargos_funcionarios')
            .on('postgres_changes', { event: '*', schema: 'erp_central', table: 'cargos_funcionarios' }, () => {
                loadData();
            })
            .subscribe();

        const settingsSubscription = supabase
            .channel('public:settings')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'erp_central',
                    table: 'settings',
                    filter: "key=eq.public_registration_enabled"
                },
                (payload) => {
                const newValue = payload.new as any;
                if (newValue) {
                    setPublicPageEnabled(newValue.value === true || newValue.value === 'active');
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(employeesSubscription);
            supabase.removeChannel(rolesSubscription);
            supabase.removeChannel(settingsSubscription);
        };
    }, []);

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            if (emp.role === 'Cadastro Pessoal') return false;
            
            const search = searchTerm.toLowerCase();
            return (
                emp.name?.toLowerCase().includes(search) ||
                emp.role?.toLowerCase().includes(search) ||
                emp.email?.toLowerCase().includes(search)
            );
        });
    }, [employees, searchTerm]);

    const itemsPerPage = 20;

    const formatDisplayName = (fullName: string) => {
        const parts = fullName.split(' ').filter(Boolean);
        if (parts.length <= 3) return fullName;
        return parts.slice(0, 3).join(' ') + '...';
    };

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    const handleRowClick = (emp: Employee) => {
        setSelectedEmployee(emp);
        setFormData(emp);
        setAddress({
            cep: emp.cep || "",
            street: emp.street || "",
            number: emp.number || "",
            complement: emp.complement || "",
            neighborhood: emp.neighborhood || "",
            city: emp.city || "",
            state: emp.state || ""
        });
        setIsNewEmployeeModalOpen(true);
    };

    const handleNewEmployee = () => {
        setSelectedEmployee(null);
        setFormData({
            status: "Ativo",
            type: "CLT",
            admission_date: new Date().toISOString().split('T')[0],
            gender: "Masculino",
            bank_key_type: "CPF",
            document_type: "RG"
        });
        setAddress({
            cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: ""
        });
        setRoleSearch("");
        setIsNewEmployeeModalOpen(true);
    };

    const handleAddRole = async () => {
        if (!newRoleName.trim()) return;
        
        // Check for duplicates locally
        if (roles.some(r => r.nome.toLowerCase() === newRoleName.trim().toLowerCase())) {
            toast({ 
                title: "Cargo já existe", 
                description: "Já existe um cargo cadastrado com este nome.", 
                variant: "destructive" 
            });
            return;
        }

        try {
            await employeeService.addRole(newRoleName.trim());
            setNewRoleName("");
            // loadData(); // The subscription will update the list
            toast({ title: "Sucesso", description: "Cargo adicionado com sucesso" });
        } catch (error: any) {
            toast({ 
                title: "Erro", 
                description: error?.message || "Não foi possível adicionar o cargo", 
                variant: "destructive" 
            });
        }
    };

    const handleDeleteRole = async (id: string) => {
        try {
            await employeeService.deleteRole(id);
            loadData();
        } catch (error) {
            toast({ title: "Erro", description: "Não foi possível excluir o cargo", variant: "destructive" });
        }
    };

    const handleStartEditRole = (index: number) => {
        setEditingRoleIndex(index);
        setEditingRoleName(roles[index].nome);
    };

    const handleSaveEditRole = async () => {
        if (editingRoleIndex === null || !editingRoleName.trim()) return;
        const role = roles[editingRoleIndex];
        
        // Check for duplicates locally (excluding the current one)
        if (roles.some((r, i) => i !== editingRoleIndex && r.nome.toLowerCase() === editingRoleName.trim().toLowerCase())) {
            toast({ 
                title: "Cargo já existe", 
                description: "Já existe outro cargo com este nome.", 
                variant: "destructive" 
            });
            return;
        }

        try {
            await employeeService.updateRole(role.id, editingRoleName.trim());
            setEditingRoleIndex(null);
            // loadData();
            toast({ title: "Sucesso", description: "Cargo atualizado com sucesso" });
        } catch (error: any) {
            toast({ 
                title: "Erro", 
                description: error?.message || "Não foi possível atualizar o cargo", 
                variant: "destructive" 
            });
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        const file = event.target.files?.[0];
        if (!file) return;

        // If there's an existing file, delete it first to keep storage clean
        const oldFileUrl = type === 'front' ? formData.document_front : formData.document_back;
        if (oldFileUrl) {
            await employeeService.deleteFileByUrl(oldFileUrl);
        }

        if (type === 'front') setIsUploadingFront(true);
        else setIsUploadingBack(true);

        try {
            const url = await employeeService.uploadDocument(file, type);
            if (type === 'front') {
                setFormData(prev => ({ ...prev, document_front: url }));
            } else {
                setFormData(prev => ({ ...prev, document_back: url }));
            }
            toast({ title: "Sucesso", description: "Documento anexado com sucesso." });
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao enviar documento.", variant: "destructive" });
        } finally {
            if (type === 'front') setIsUploadingFront(false);
            else setIsUploadingBack(false);
        }
    };

    const handleSaveEmployee = async () => {
        try {
            const employeeData: Partial<Employee> = {
                status: formData.status || "Ativo",
                type: formData.type || "CLT",
                gender: formData.gender || "Masculino",
                document_type: formData.document_type || "RG",
                bank_key_type: formData.bank_key_type || "CPF",
                admission_date: formData.admission_date || new Date().toISOString().split('T')[0],
                ...formData,
                ...address
            };

            const requiredFields = formData.type === 'Freelance' ? [
                { key: 'name', id: 'input-name', label: 'Nome Completo' },
                { key: 'role', id: 'select-role', label: 'Cargo' },
                { key: 'phone', id: 'input-phone', label: 'Telefone Principal' },
                { key: 'bank_account_name', id: 'input-bank_account_name', label: 'Nome do Titular' },
                { key: 'bank_name', id: 'input-bank_name', label: 'Banco' },
                { key: 'bank_key_type', id: 'select-bank_key_type', label: 'Tipo da Chave PIX' },
                { key: 'bank_key', id: 'input-bank_key', label: 'Chave PIX' }
            ] : [
                { key: 'name', id: 'input-name', label: 'Nome Completo' },
                { key: 'role', id: 'select-role', label: 'Cargo' },
                { key: 'phone', id: 'input-phone', label: 'Telefone Principal' },
                { key: 'admission_date', id: 'input-admission_date', label: 'Data de Entrada' },
                { key: 'bank_key', id: 'input-bank_key', label: 'Chave PIX' },
                { key: 'document', id: 'input-document', label: 'Número do Documento' },
                { key: 'cep', id: 'input-cep', label: 'CEP' }
            ];

            const missingField = requiredFields.find(f => !employeeData[f.key as keyof Employee] || String(employeeData[f.key as keyof Employee]).trim() === "");

            if (missingField) {
                toast({ title: "Campo Obrigatório", description: `Preencha o campo: ${missingField.label}`, variant: "destructive" });
                const el = document.getElementById(missingField.id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.focus();
                }
                return;
            }

            await employeeService.saveEmployee(employeeData);
            
            toast({
                title: "Sucesso!",
                description: "Funcionário salvo com sucesso.",
            });
            
            setIsNewEmployeeModalOpen(false);
            loadData();
        } catch (error) {
            toast({
                title: "Erro ao salvar",
                description: "Ocorreu um erro ao conectar com o banco de dados.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteEmployee = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;
        try {
            await employeeService.deleteEmployee(id);
            toast({ title: "Sucesso", description: "Funcionário excluído com sucesso." });
            loadData();
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao excluir funcionário", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl text-white flex items-center gap-2 font-normal">
                        Funcionários
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Painel administrativo sincronizado com o banco.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome..."
                            className="pl-10 bg-[#0B1120] border-slate-700/50 text-white font-normal"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsShareModalOpen(true)}
                        className="bg-[#0B1120] border-slate-700/50 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 font-normal whitespace-nowrap"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        COMPARTILHAR
                    </Button>
                    <Button 
                        onClick={handleNewEmployee}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-normal whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        NOVO FUNCIONÁRIO
                    </Button>
                </div>
            </div>

            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="w-full">
                    <table className="w-full table-fixed text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[4%] text-center font-normal">#</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[10%] font-normal">Entrada</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[16%] font-normal">Funcionário</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[14%] font-normal">Empresa</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[12%] font-normal">Contato</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[10%] font-normal">Função</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[8%] font-normal">Vínculo</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[10%] font-normal">Pix</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[8%] font-normal">Status</th>
                                <th className="px-4 py-4 text-xs text-slate-400 tracking-wider w-[8%] text-right font-normal">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {/* {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-20 text-center">
                                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm">Carregando dados...</p>
                                    </td>
                                </tr>
                            ) : ( */}
                                <>
                                    {currentItems.map((emp, index) => (
                                        <tr 
                                            key={emp.id} 
                                            onClick={() => handleRowClick(emp)}
                                            className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-4 py-3.5 text-sm text-slate-500 font-mono text-center">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-slate-300">
                                                {new Date(emp.admission_date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="text-sm text-white truncate max-w-[200px]" title={emp.name}>
                                                    {formatDisplayName(emp.name)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="text-sm text-slate-300 truncate max-w-[150px]" title={companies.find(c => c.id === emp.empresa_id)?.nome || companies.find(c => c.id === emp.empresa_id)?.name || 'Sem Empresa'}>
                                                    {companies.find(c => c.id === emp.empresa_id)?.nome || companies.find(c => c.id === emp.empresa_id)?.name || <span className="text-slate-500 italic">Sem Empresa</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <a 
                                                    href={`https://wa.me/55${emp.phone}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
                                                >
                                                    {emp.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                                                    {emp.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="text-sm text-slate-300 truncate">{emp.type}</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="text-sm text-slate-300 truncate">{emp.bank_key}</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap",
                                                    emp.status === "Ativo" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    "bg-red-500/10 text-red-400 border border-red-500/20"
                                                )}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => handleDeleteEmployee(emp.id)}
                                                        className="p-1.5 text-slate-200 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all bg-slate-800/20" 
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Empty rows to maintain 20 rows per page */}
                                    {Array.from({ length: Math.max(0, itemsPerPage - currentItems.length) }).map((_, i) => (
                                        <tr key={`empty-${i}`} className="h-[53px]">
                                            <td colSpan={9}>&nbsp;</td>
                                        </tr>
                                    ))}
                                </>
                            {/* )} */}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Mostrando <span className="text-white">{startIndex + 1}</span> a <span className="text-white">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> de <span className="text-white">{filteredEmployees.length}</span> resultados
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="bg-[#0B1120] border-slate-700 text-slate-300 hover:bg-slate-800 font-normal"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-xs transition-all",
                                        currentPage === i + 1 
                                            ? "bg-primary text-white" 
                                            : "text-slate-400 hover:bg-slate-800"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="bg-[#0B1120] border-slate-700 text-slate-300 hover:bg-slate-800 font-normal"
                        >
                            Próximo <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogContent className="bg-[#1e293b] border-slate-700 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Compartilhar Cadastro</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-6">
                        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold text-white">Página Pública</Label>
                                <p className="text-sm text-slate-400 mt-1">Ao ativar, qualquer pessoa com o link poderá preencher o formulário.</p>
                            </div>
                            <Switch 
                                checked={publicPageEnabled} 
                                onCheckedChange={async (checked) => {
                                    setPublicPageEnabled(checked);
                                    try {
                                        await employeeService.updateSetting('public_registration_enabled', checked);
                                        toast({ title: "Sucesso", description: `Página pública ${checked ? 'ativada' : 'desativada'}` });
                                    } catch (err: any) {
                                        toast({ 
                                            title: "Erro", 
                                            description: err?.message || "Não foi possível atualizar a configuração", 
                                            variant: "destructive" 
                                        });
                                        setPublicPageEnabled(!checked);
                                    }
                                }} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">LINK DE ACESSO</Label>
                            <div className="flex items-center gap-2">
                                <Input readOnly value={`${window.location.origin}/cadastro-equipe`} className="bg-[#0f172a] border-slate-700 text-slate-300" />
                                <Button 
                                    size="icon" 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/cadastro-equipe`);
                                        toast({ title: "Sucesso", description: "Link copiado!" });
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button variant="outline" onClick={() => setIsShareModalOpen(false)} className="bg-transparent border-slate-600 text-white hover:bg-slate-800">
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Roles Management Modal */}
            <Dialog open={isRolesModalOpen} onOpenChange={setIsRolesModalOpen}>
                <DialogContent className="bg-[#1e293b] border-slate-700 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Settings className="h-5 w-5 text-indigo-400" />
                            Configurar Cargos
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Novo cargo..." 
                                className="bg-[#0f172a] border-slate-700" 
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                            />
                            <Button 
                                onClick={handleAddRole}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 shrink-0"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#1e293b]/50 border-b border-slate-800">
                                        <tr>
                                            <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome do Cargo</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {roles.map((role, i) => (
                                            <tr key={role.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-2.5">
                                                    {editingRoleIndex === i ? (
                                                        <Input 
                                                            autoFocus
                                                            className="h-8 bg-[#1e293b] border-indigo-500 text-sm" 
                                                            value={editingRoleName}
                                                            onChange={(e) => setEditingRoleName(e.target.value)}
                                                            onBlur={handleSaveEditRole}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEditRole()}
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-slate-300">{role.nome}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {editingRoleIndex === i ? (
                                                            <button 
                                                                onClick={handleSaveEditRole}
                                                                className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleStartEditRole(i)}
                                                                className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDeleteRole(role.id)}
                                                            className="p-1 text-slate-400 hover:text-red-400 transition-colors" 
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
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
                            <Button variant="outline" onClick={() => setIsRolesModalOpen(false)} className="bg-transparent border-slate-600 text-white hover:bg-slate-800">
                                Fechar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isNewEmployeeModalOpen} onOpenChange={setIsNewEmployeeModalOpen}>
                <DialogContent className="bg-[#1e293b] border-slate-700 text-white sm:max-w-3xl h-[90vh] p-0 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <span className="text-red-500">⚠</span> {selectedEmployee ? `Editar Funcionário: ${selectedEmployee.name}` : "Novo Funcionário"}
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                        {/* Dados da Empresa */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="p-1 bg-indigo-500/10 rounded">🏢</span> DADOS DA EMPRESA
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                {/* Linha 1 */}
                                <div className="space-y-1.5 md:col-span-3">
                                    <div className="h-5 flex items-center">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">EMPRESA</Label>
                                    </div>
                                    <select 
                                        id="select-company"
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-md p-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                        value={formData.empresa_id || ""}
                                        onChange={(e) => setFormData({...formData, empresa_id: e.target.value})}
                                    >
                                        <option value="">Selecione uma empresa...</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.nome || c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5 md:col-span-3">
                                    <div className="h-5 flex items-center">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">TIPO DE CONTRATO</Label>
                                    </div>
                                    <select 
                                        id="select-type"
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-md p-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                        value={formData.type || "CLT"}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                    >
                                        <option value="CLT">CLT</option>
                                        <option value="Estágio">Estágio</option>
                                        <option value="Menor Aprendiz">Menor Aprendiz</option>
                                        <option value="Jurídico">Jurídico</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>

                                {/* Linha 2 */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <div className="h-5 flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">FUNÇÃO/CARGO</Label>
                                        <button 
                                            onClick={() => setIsRolesModalOpen(true)}
                                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                            title="Configurar Cargos"
                                        >
                                            <Settings className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input 
                                            id="select-role"
                                            placeholder="Pesquisar cargo..." 
                                            className="bg-[#0f172a] border-slate-700 w-full" 
                                            value={roleSearch}
                                            onChange={(e) => {
                                                setRoleSearch(e.target.value);
                                                setFormData({...formData, role: e.target.value});
                                                setIsRoleListOpen(true);
                                            }}
                                            onFocus={() => {
                                                setRoleSearch(formData.role || "");
                                                setIsRoleListOpen(true);
                                            }}
                                            onBlur={() => setTimeout(() => setIsRoleListOpen(false), 200)}
                                        />
                                        {isRoleListOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-[#1e293b] border border-slate-700 rounded-md shadow-2xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                                                {roles
                                                    .filter(r => r.nome.toLowerCase().includes(roleSearch.toLowerCase()))
                                                    .map((role, i) => (
                                                        <div 
                                                            key={i}
                                                            onClick={() => {
                                                                 setRoleSearch(role.nome);
                                                                 setFormData({...formData, role: role.nome});
                                                                 setIsRoleListOpen(false);
                                                            }}
                                                            className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
                                                        >
                                                            {role.nome}
                                                        </div>
                                                    ))}
                                                {roles.filter(r => r.nome.toLowerCase().includes(roleSearch.toLowerCase())).length === 0 && (
                                                    <div className="px-4 py-3 text-xs text-slate-500 italic">Nenhum cargo encontrado</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <div className="h-5 flex items-center">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">DATA ENTRADA</Label>
                                    </div>
                                    <Input 
                                        id="input-admission_date"
                                        type="date" 
                                        className="bg-[#0f172a] border-slate-700 text-slate-300" 
                                        value={formData.admission_date || ""}
                                        onChange={(e) => setFormData({...formData, admission_date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <div className="h-5 flex items-center">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</Label>
                                    </div>
                                    <select 
                                        id="select-status"
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-md p-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                        value={formData.status || "Ativo"}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Afastado">Afastado</option>
                                        <option value="Férias">Férias</option>
                                        <option value="Justa causa">Justa causa</option>
                                        <option value="Desativado">Desativado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="p-1 bg-indigo-500/10 rounded">👤</span> DADOS PESSOAIS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1 space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NOME COMPLETO <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="input-name"
                                        className="bg-[#0f172a] border-slate-700" 
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">TELEFONE PRINCIPAL <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="input-phone"
                                        placeholder="(00) 00000-0000" 
                                        className="bg-[#0f172a] border-slate-700" 
                                        value={formData.phone || ""}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">TELEFONE RECADO</Label>
                                    <Input 
                                        id="input-emergency_phone"
                                        placeholder="(00) 00000-0000" 
                                        className="bg-[#0f172a] border-slate-700" 
                                        value={formData.emergency_phone || ""}
                                        onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                                    />
                                </div>
                                {formData.type !== 'Freelance' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEXO <span className="text-red-500">*</span></Label>
                                            <select 
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-md p-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                                value={formData.gender || "Masculino"}
                                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                            >
                                                <option value="Masculino">Masculino</option>
                                                <option value="Feminino">Feminino</option>
                                                <option value="Outro">Outro</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">DATA NASCIMENTO <span className="text-red-500">*</span></Label>
                                            <Input 
                                                type="date" 
                                                className="bg-[#0f172a] border-slate-700 text-white" 
                                                value={formData.birth_date || ""}
                                                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-MAIL</Label>
                                            <Input 
                                                type="email" 
                                                placeholder="exemplo@email.com" 
                                                className="bg-[#0f172a] border-slate-700" 
                                                value={formData.email || ""}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Dados Bancários */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="p-1 bg-indigo-500/10 rounded">💳</span> DADOS BANCÁRIOS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NOME DO TITULAR <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="input-bank_account_name"
                                        placeholder="Nome completo como no banco" 
                                        className="bg-[#0f172a] border-slate-700" 
                                        value={formData.bank_account_name || ""}
                                        onChange={(e) => setFormData({...formData, bank_account_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">BANCO <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="input-bank_name"
                                        placeholder="Ex: Nubank, Itaú" 
                                        className="bg-[#0f172a] border-slate-700" 
                                        value={formData.bank_name || ""}
                                        onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">TIPO DE CHAVE PIX <span className="text-red-500">*</span></Label>
                                    <select 
                                        id="select-bank_key_type"
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-md p-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                        value={formData.bank_key_type || "CPF"}
                                        onChange={(e) => setFormData({...formData, bank_key_type: e.target.value})}
                                    >
                                        <option value="CPF">CPF</option>
                                        <option value="CNPJ">CNPJ</option>
                                        <option value="E-mail">E-mail</option>
                                        <option value="Telefone">Telefone</option>
                                        <option value="Chave Aleatória">Chave Aleatória</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CHAVE PIX <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="input-bank_key"
                                        placeholder="Chave PIX" 
                                        className="bg-[#0f172a] border-slate-700" 
                                        value={formData.bank_key || ""}
                                        onChange={(e) => setFormData({...formData, bank_key: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.type !== 'Freelance' && (
                            <>
                                {/* Documentos */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                        <span className="p-1 bg-indigo-500/10 rounded">📄</span> DOCUMENTOS E FOTOS
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">TIPO DE DOCUMENTO <span className="text-red-500">*</span></Label>
                                            <select 
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-md p-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                                value={formData.document_type || "RG"}
                                                onChange={(e) => setFormData({...formData, document_type: e.target.value})}
                                            >
                                                <option value="RG">RG</option>
                                                <option value="CNH">CNH</option>
                                                <option value="Passaporte">Passaporte</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NÚMERO DO DOCUMENTO <span className="text-red-500">*</span></Label>
                                            <Input 
                                                id="input-document"
                                                placeholder="00.000.000-0" 
                                                className="bg-[#0f172a] border-slate-700" 
                                                value={formData.document || ""}
                                                onChange={(e) => setFormData({...formData, document: e.target.value})}
                                            />
                                        </div>
                                        <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2">
                                            <div className="relative group">
                                                <label className="border border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 transition-colors relative overflow-hidden h-full">
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleFileUpload(e, 'front')}
                                                        disabled={isUploadingFront}
                                                    />
                                                    {isUploadingFront ? (
                                                        <div className="flex flex-col items-center">
                                                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                                                            <span className="text-sm font-bold text-white">Enviando...</span>
                                                        </div>
                                                    ) : formData.document_front ? (
                                                        <div className="flex flex-col items-center text-emerald-400">
                                                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                                                                <Upload className="h-5 w-5" />
                                                            </div>
                                                            <span className="text-sm font-bold">Foto Frente (Doc)</span>
                                                            <span className="text-xs text-slate-400 mt-1">Anexado com sucesso</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                                                                <Upload className="h-5 w-5 text-indigo-400" />
                                                            </div>
                                                            <span className="text-sm font-bold text-white">Foto Frente (Doc)</span>
                                                            <span className="text-xs text-slate-400 mt-1">Clique para enviar</span>
                                                        </div>
                                                    )}
                                                </label>
                                                {formData.document_front && (
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <Button 
                                                            size="icon"
                                                            variant="secondary" 
                                                            onClick={() => window.open(formData.document_front, '_blank')}
                                                            className="h-8 w-8 bg-slate-900/80 hover:bg-indigo-600 text-white border-none"
                                                            title="Visualizar Documento"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button 
                                                            size="icon"
                                                            variant="destructive" 
                                                            onClick={async () => {
                                                                if (formData.document_front) {
                                                                    await employeeService.deleteFileByUrl(formData.document_front);
                                                                    setFormData(prev => ({ ...prev, document_front: "" }));
                                                                    toast({ title: "Sucesso", description: "Documento removido." });
                                                                }
                                                            }}
                                                            className="h-8 w-8 bg-red-900/80 hover:bg-red-600 text-white border-none"
                                                            title="Remover Documento"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative group">
                                                <label className="border border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 transition-colors relative overflow-hidden h-full">
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleFileUpload(e, 'back')}
                                                        disabled={isUploadingBack}
                                                    />
                                                    {isUploadingBack ? (
                                                        <div className="flex flex-col items-center">
                                                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                                                            <span className="text-sm font-bold text-white">Enviando...</span>
                                                        </div>
                                                    ) : formData.document_back ? (
                                                        <div className="flex flex-col items-center text-emerald-400">
                                                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                                                                <Upload className="h-5 w-5" />
                                                            </div>
                                                            <span className="text-sm font-bold">Foto Verso (Doc)</span>
                                                            <span className="text-xs text-slate-400 mt-1">Anexado com sucesso</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                                                                <Upload className="h-5 w-5 text-indigo-400" />
                                                            </div>
                                                            <span className="text-sm font-bold text-white">Foto Verso (Doc)</span>
                                                            <span className="text-xs text-slate-400 mt-1">Clique para enviar</span>
                                                        </div>
                                                    )}
                                                </label>
                                                {formData.document_back && (
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <Button 
                                                            size="icon"
                                                            variant="secondary" 
                                                            onClick={() => window.open(formData.document_back, '_blank')}
                                                            className="h-8 w-8 bg-slate-900/80 hover:bg-indigo-600 text-white border-none"
                                                            title="Visualizar Documento"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button 
                                                            size="icon"
                                                            variant="destructive" 
                                                            onClick={async () => {
                                                                if (formData.document_back) {
                                                                    await employeeService.deleteFileByUrl(formData.document_back);
                                                                    setFormData(prev => ({ ...prev, document_back: "" }));
                                                                    toast({ title: "Sucesso", description: "Documento removido." });
                                                                }
                                                            }}
                                                            className="h-8 w-8 bg-red-900/80 hover:bg-red-600 text-white border-none"
                                                            title="Remover Documento"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {formData.type !== 'Freelance' && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                    <span className="p-1 bg-indigo-500/10 rounded">📍</span> ENDEREÇO COMPLETO
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CEP <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input 
                                            id="input-cep"
                                            placeholder="00000-000" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.cep}
                                            onChange={handleCEPChange}
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">RUA / LOGRADOURO <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input 
                                            placeholder="Nome da Rua" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.street}
                                            onChange={(e) => setAddress({...address, street: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NÚMERO <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input 
                                            id="input-number"
                                            placeholder="123" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.number}
                                            onChange={(e) => setAddress({...address, number: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">COMPLEMENTO</Label>
                                        </div>
                                        <Input 
                                            placeholder="Apto, Bloco" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.complement}
                                            onChange={(e) => setAddress({...address, complement: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">BAIRRO <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input 
                                            placeholder="Bairro" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.neighborhood}
                                            onChange={(e) => setAddress({...address, neighborhood: e.target.value})}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CIDADE <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input 
                                            placeholder="Cidade" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.city}
                                            onChange={(e) => setAddress({...address, city: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-5 flex items-center">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ESTADO <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input 
                                            placeholder="UF" 
                                            className="bg-[#0f172a] border-slate-700"
                                            value={address.state}
                                            onChange={(e) => setAddress({...address, state: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>

                    <div className="p-6 border-t border-slate-800 bg-[#1e293b] flex justify-end gap-3 shrink-0">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsNewEmployeeModalOpen(false)}
                            className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleSaveEmployee}
                            className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
                        >
                            {selectedEmployee ? "Salvar Alterações" : "Salvar Funcionário"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeesPage;

