import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConfirmDelete } from '../context/ConfirmDeleteContext';
import { 
  Folder, 
  FolderPlus, 
  Upload, 
  Trash2, 
  ChevronRight, 
  FileText, 
  FileImage, 
  FileArchive, 
  FileCode, 
  File, 
  Download, 
  MoreVertical,
  Edit2
} from 'lucide-react';

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface FileItem {
  id: string;
  name: string;
  folderId: string | null;
  size: number;
  type: string;
  dataUrl?: string;
  createdAt: string;
}

const STORAGE_KEY_FOLDERS = 'mch_arquivos_folders';
const STORAGE_KEY_FILES = 'mch_arquivos_files';

export const ArquivosModule: React.FC = () => {
  // Navigation State: null = root level
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Global Confirm Delete
  const { confirmDelete } = useConfirmDelete();

  // Search Param from Header
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  // Data State
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'raiz-1', name: 'Documentos da Empresa (CNPJ & Alvarás)', parentId: null, createdAt: new Date().toISOString() },
      { id: 'raiz-2', name: 'Identidade Visual & Logotipos', parentId: null, createdAt: new Date().toISOString() }
    ];
  });

  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FILES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Folder creation inline input state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const createInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3-dots dropdown menu & renaming state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close 3-dots menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-dropdown-container')) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.error(e);
    }
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error(e);
    }
  }, [files]);

  // Focus input when creating folder
  useEffect(() => {
    if (isCreatingFolder) {
      createInputRef.current?.focus();
    }
  }, [isCreatingFolder]);

  // Focus input when renaming
  useEffect(() => {
    if (renamingId) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renamingId]);

  // Filter current level items and search
  const currentFolders = folders.filter((f) => {
    const isInside = f.parentId === currentFolderId;
    if (!searchTerm.trim()) return isInside;
    return isInside && f.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const currentFiles = files.filter((f) => {
    const isInside = f.folderId === currentFolderId;
    if (!searchTerm.trim()) return isInside;
    return isInside && f.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const isAtRoot = currentFolderId === null;

  // Hierarchy depth: 0 = Início, 1 = Pasta, 2 = Subpasta
  const getCurrentDepth = () => {
    if (!currentFolderId) return 0;
    let depth = 0;
    let curr: FolderItem | undefined = folders.find((f) => f.id === currentFolderId);
    while (curr) {
      depth++;
      curr = folders.find((f) => f.id === curr?.parentId);
    }
    return depth;
  };

  const currentDepth = getCurrentDepth();
  // Limite estrito de rotas: apenas Pasta e Subpasta (profundidade máxima 2)
  const canCreateFolder = currentDepth < 2;

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Início' }];
    if (!currentFolderId) return crumbs;

    const path: { id: string; name: string }[] = [];
    let curr: FolderItem | undefined = folders.find((f) => f.id === currentFolderId);

    while (curr) {
      path.unshift({ id: curr.id, name: curr.name });
      curr = folders.find((f) => f.id === curr?.parentId);
    }

    return [...crumbs, ...path];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentFolder = folders.find((f) => f.id === currentFolderId);

  // Handle Save New Folder
  const handleSaveFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed || !canCreateFolder) {
      setIsCreatingFolder(false);
      setNewFolderName('');
      return;
    }

    const newFolder: FolderItem = {
      id: `fld_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: trimmed,
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
    };

    setFolders((prev) => [...prev, newFolder]);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  // Handle Save Rename
  const handleSaveRename = (id: string, isFolder: boolean) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      if (isFolder) {
        setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: trimmed } : f)));
      } else {
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: trimmed } : f)));
      }
    }
    setRenamingId(null);
    setRenameValue('');
  };

  // Delete folder and its contents recursively
  const handleDeleteFolder = (folderId: string, folderName: string) => {
    setActiveMenuId(null);
    confirmDelete({
      title: 'Excluir pasta',
      message: 'Tem certeza que deseja excluir esta pasta e todos os seus arquivos permanentemente?',
      itemName: folderName,
      confirmText: 'Excluir pasta',
      onConfirm: () => {
        const toDeleteFolderIds = new Set<string>([folderId]);
        let added = true;
        while (added) {
          added = false;
          for (const f of folders) {
            if (f.parentId && toDeleteFolderIds.has(f.parentId) && !toDeleteFolderIds.has(f.id)) {
              toDeleteFolderIds.add(f.id);
              added = true;
            }
          }
        }

        setFolders((prev) => prev.filter((f) => !toDeleteFolderIds.has(f.id)));
        setFiles((prev) => prev.filter((f) => !f.folderId || !toDeleteFolderIds.has(f.folderId)));
      },
    });
  };

  // Delete file
  const handleDeleteFile = (fileId: string, fileName: string) => {
    setActiveMenuId(null);
    confirmDelete({
      title: 'Excluir arquivo',
      message: 'Tem certeza que deseja excluir este arquivo permanentemente?',
      itemName: fileName,
      confirmText: 'Excluir arquivo',
      onConfirm: () => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      },
    });
  };

  // Upload files handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0 || isAtRoot) return;

    const fileList = Array.from(uploadedFiles);

    // Limite de até 10 arquivos por seleção
    if (fileList.length > 10) {
      alert('Limite de até 10 arquivos por seleção excedido. Por favor, selecione no máximo 10 arquivos.');
      e.target.value = '';
      return;
    }

    // Arquivos não podem passar de 50 megas
    const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = fileList.filter((f) => f.size > MAX_SIZE_BYTES);

    if (oversizedFiles.length > 0) {
      const names = oversizedFiles
        .map((f) => `• ${f.name} (${(f.size / (1024 * 1024)).toFixed(1)} MB)`)
        .join('\n');
      alert(`Os seguintes arquivos ultrapassam o limite máximo de 50 MB e não podem ser adicionados:\n\n${names}`);
      e.target.value = '';
      return;
    }

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: FileItem = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          folderId: currentFolderId,
          size: file.size,
          type: file.type || 'application/octet-stream',
          dataUrl: event.target?.result as string,
          createdAt: new Date().toISOString(),
        };
        setFiles((prev) => [...prev, newFile]);
      };

      if (file.size < 15 * 1024 * 1024) {
        reader.readAsDataURL(file);
      } else {
        const newFile: FileItem = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          folderId: currentFolderId,
          size: file.size,
          type: file.type || 'application/octet-stream',
          createdAt: new Date().toISOString(),
        };
        setFiles((prev) => [...prev, newFile]);
      }
    });

    e.target.value = '';
  };

  // Download file
  const handleDownloadFile = (file: FileItem) => {
    setActiveMenuId(null);
    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(`Arquivo: ${file.name}`);
    }
  };

  // Helper icon for file types
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(ext || '')) {
      return <FileImage className="w-10 h-10 text-sky-400" />;
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-10 h-10 text-rose-400" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <FileArchive className="w-10 h-10 text-amber-400" />;
    }
    if (['ts', 'tsx', 'js', 'json', 'html', 'css'].includes(ext || '')) {
      return <FileCode className="w-10 h-10 text-emerald-400" />;
    }
    return <File className="w-10 h-10 text-slate-300" />;
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      {/* Sub-bar abaixo do header: Trilha à esquerda & Link sutil Voltar à direita */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/5 min-h-[30px]">
        {/* Breadcrumb Navigation à esquerda */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;

            return (
              <React.Fragment key={crumb.id || 'root'}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                <button
                  type="button"
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer max-w-[200px] truncate ${
                    isLast
                      ? 'text-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={crumb.name}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* No lugar de voltar: Botão Nova pasta */}
        {canCreateFolder && (
          <button
            type="button"
            onClick={() => {
              setIsCreatingFolder(true);
              setNewFolderName('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all cursor-pointer select-none shrink-0"
            title="Criar nova pasta"
          >
            <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
            <span>Nova pasta</span>
          </button>
        )}
      </div>

      {/* Hidden File Input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Grid: 5 Itens por linha (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {/* FOLDERS LIST */}
        {currentFolders.map((folder) => {
          const isMenuOpen = activeMenuId === folder.id;
          const isRenaming = renamingId === folder.id;

          return (
            <div
              key={folder.id}
              onClick={() => {
                if (!isRenaming) {
                  setCurrentFolderId(folder.id);
                }
              }}
              className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-[#101726]/90 hover:bg-[#162136] border border-white/10 hover:border-sky-400/50 transition-all cursor-pointer shadow-sm hover:shadow-lg min-h-[175px] text-center"
            >
              {/* Top Right: 3 Pontinhos Menu */}
              <div className="absolute top-2.5 right-2.5 menu-dropdown-container z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(isMenuOpen ? null : folder.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Mais opções"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Options */}
                {isMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-8 w-36 py-1.5 rounded-xl bg-[#0D1424] border border-white/15 shadow-2xl z-30 flex flex-col text-left"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuId(null);
                        setRenamingId(folder.id);
                        setRenameValue(folder.name);
                      }}
                      className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-sky-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Renomear</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFolder(folder.id, folder.name)}
                      className="px-3.5 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Deletar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Ícone Aumentado da Pasta */}
              <div className="mt-1 mb-3 w-16 h-16 rounded-2xl bg-sky-500/10 group-hover:bg-sky-500/20 flex items-center justify-center text-sky-400 transition-colors shrink-0">
                <Folder className="w-10 h-10 fill-sky-400/25 stroke-[1.7]" />
              </div>

              {/* Nome Abaixo do Ícone com Limite de 2 Linhas Truncado */}
              <div className="w-full flex-1 flex items-center justify-center">
                {isRenaming ? (
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRename(folder.id, true);
                      } else if (e.key === 'Escape') {
                        setRenamingId(null);
                      }
                    }}
                    onBlur={() => handleSaveRename(folder.id, true)}
                    className="w-full text-xs font-medium bg-[#0A0E17] border border-sky-400 rounded-lg px-2 py-1 text-white text-center focus:outline-none"
                  />
                ) : (
                  <p
                    className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white leading-tight break-words px-1"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={folder.name}
                  >
                    {folder.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* NOVA PASTA: Ao lado da última pasta criada */}
        {/* Card de criação de pasta: renderizado apenas quando acionado via botão Nova pasta */}
        {canCreateFolder && isCreatingFolder && (
          <div className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-[#101726]/90 border border-sky-400/70 transition-all shadow-md min-h-[175px] text-center">
            {/* Ícone idêntico ao da pasta normal */}
            <div className="mt-1 mb-3 w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 transition-colors shrink-0">
              <Folder className="w-10 h-10 fill-sky-400/25 stroke-[1.7]" />
            </div>

            {/* Input no mesmo local e dimensão do nome */}
            <div className="w-full flex-1 flex items-center justify-center">
              <input
                ref={createInputRef}
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveFolder();
                  } else if (e.key === 'Escape') {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }
                }}
                onBlur={() => {
                  if (newFolderName.trim()) {
                    handleSaveFolder();
                  } else {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }
                }}
                placeholder="Nome da pasta..."
                className="w-full text-xs sm:text-sm font-semibold bg-[#0A0E17] border border-sky-400 rounded-lg px-2 py-1 text-white text-center placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* FILES LIST */}
        {currentFiles.map((file) => {
          const isMenuOpen = activeMenuId === file.id;
          const isRenaming = renamingId === file.id;

          return (
            <div
              key={file.id}
              onClick={() => {
                if (!isRenaming) {
                  handleDownloadFile(file);
                }
              }}
              className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-[#101726]/85 hover:bg-[#162136] border border-white/10 hover:border-sky-400/50 transition-all cursor-pointer shadow-sm hover:shadow-lg min-h-[175px] text-center"
            >
              {/* Top Right: 3 Pontinhos Menu */}
              <div className="absolute top-2.5 right-2.5 menu-dropdown-container z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(isMenuOpen ? null : file.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Mais opções"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Options */}
                {isMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-8 w-36 py-1.5 rounded-xl bg-[#0D1424] border border-white/15 shadow-2xl z-30 flex flex-col text-left"
                  >
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(file)}
                      className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-sky-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>Baixar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuId(null);
                        setRenamingId(file.id);
                        setRenameValue(file.name);
                      }}
                      className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-sky-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Renomear</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      className="px-3.5 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Deletar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Ícone Aumentado do Arquivo */}
              <div className="mt-1 mb-3 w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors shrink-0">
                {getFileIcon(file.name)}
              </div>

              {/* Nome Abaixo do Ícone com Limite de 2 Linhas Truncado */}
              <div className="w-full flex-1 flex items-center justify-center">
                {isRenaming ? (
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRename(file.id, false);
                      } else if (e.key === 'Escape') {
                        setRenamingId(null);
                      }
                    }}
                    onBlur={() => handleSaveRename(file.id, false)}
                    className="w-full text-xs font-medium bg-[#0A0E17] border border-sky-400 rounded-lg px-2 py-1 text-white text-center focus:outline-none"
                  />
                ) : (
                  <p
                    className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white leading-tight break-words px-1"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* NOVO ARQUIVO: Ao lado do último arquivo anexado (apenas dentro de pastas) */}
        {!isAtRoot && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-sky-400/60 bg-[#101726]/40 hover:bg-sky-500/5 transition-all cursor-pointer min-h-[175px] text-center"
            title="Adicionar Novo Arquivo"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-sky-500/15 flex items-center justify-center text-slate-400 group-hover:text-sky-400 transition-colors mb-3">
              <Upload className="w-8 h-8 stroke-[1.8]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
              Novo Arquivo
            </span>
          </button>
        )}

        {/* Empty search feedback */}
        {searchTerm && currentFolders.length === 0 && currentFiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs sm:text-sm">
            Nenhum item encontrado para "<span className="text-sky-400 font-medium">{searchTerm}</span>".
          </div>
        )}
      </div>
    </div>
  );
};

export default ArquivosModule;
