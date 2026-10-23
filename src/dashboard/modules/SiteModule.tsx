import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Plus, 
  Upload, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Loader2, 
  Search, 
  Image as ImageIcon, 
  Star, 
  ExternalLink, 
  X, 
  Eye, 
  Clock, 
  Save,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Video,
  Film,
  RefreshCw,
  Layers,
  Play,
  Building2,
  Hammer
} from 'lucide-react';
import { useSiteConfig, PortfolioItem, SiteConfig, generateGoogleMapsEmbedUrl } from '../../contexts/SiteConfigContext';
import { useConfirmDelete } from '../context/ConfirmDeleteContext';
import { uploadImageToBucket, deleteImageFromBucket, SUPABASE_BUCKET } from '../../lib/supabase';

// Ícone personalizado e responsivo do TikTok (não existente por padrão no lucide-react)
const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.05.86.15V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.82 4.48c1.37-1.37 2.08-3.23 2.08-5.16V8.67a8.21 8.21 0 0 0 4.59 1.4V6.69z"/>
  </svg>
);

const INPUT_CLASS = "w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl px-4 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all";
const LABEL_CLASS = "text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5";

const CATEGORIAS_PADRAO = [
  'Construção Civil',
  'Telecomunicações',
  'Reformas Prediais',
  'Incorporação Imobiliária',
  'Engenharia Corporativa'
];

export const SiteModule: React.FC = () => {
  const { 
    siteConfig, 
    portfolio, 
    loading, 
    updateSiteConfig, 
    addPortfolioItem, 
    updatePortfolioItem, 
    deletePortfolioItem, 
    uploadPortfolioImage, 
    removePortfolioImage 
  } = useSiteConfig();

  const { confirmDelete } = useConfirmDelete();

  // Active Tab: 'contatos' | 'endereco' | 'portfolio' | 'home' | 'construtora' | 'reformas'
  const [activeTab, setActiveTab] = useState<'contatos' | 'endereco' | 'portfolio' | 'home' | 'construtora' | 'reformas'>('contatos');

  // Form States for Contacts, Address, and Page Media
  const [contactForm, setContactForm] = useState<Partial<SiteConfig>>({});
  const [addressForm, setAddressForm] = useState<Partial<SiteConfig>>({});
  const [mediaForm, setMediaForm] = useState<{
    hero_home_media_url: string;
    hero_home_media_type: 'image' | 'video';
    hero_construtora_media_url: string;
    hero_construtora_media_type: 'image' | 'video';
    hero_reformas_media_url: string;
    hero_reformas_media_type: 'image' | 'video';
    reformas_secao2_img_url: string;
  }>({
    hero_home_media_url: '/hero-bg.jpg',
    hero_home_media_type: 'image',
    hero_construtora_media_url: 'https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/public/mchconstrutora_imobiliaria/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4',
    hero_construtora_media_type: 'video',
    hero_reformas_media_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    hero_reformas_media_type: 'image',
    reformas_secao2_img_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  });

  const [savingContacts, setSavingContacts] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingMedia, setSavingMedia] = useState(false);
  const [uploadingMediaField, setUploadingMediaField] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  // Hidden file input refs for each hero/section
  const homeFileInputRef = useRef<HTMLInputElement>(null);
  const construtoraFileInputRef = useRef<HTMLInputElement>(null);
  const reformasFileInputRef = useRef<HTMLInputElement>(null);
  const secao2FileInputRef = useRef<HTMLInputElement>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync initial state from siteConfig
  useEffect(() => {
    if (siteConfig) {
      setContactForm({
        email_principal: siteConfig.email_principal || '',
        whatsapp: siteConfig.whatsapp || '',
        horario_funcionamento: siteConfig.horario_funcionamento || '',
        facebook_url: siteConfig.facebook_url || '',
        tiktok_url: siteConfig.tiktok_url || '',
        instagram_url: siteConfig.instagram_url || '',
        linkedin_url: siteConfig.linkedin_url || '',
      });

      setAddressForm({
        endereco_cep: siteConfig.endereco_cep || '',
        endereco_logradouro: siteConfig.endereco_logradouro || '',
        endereco_numero: siteConfig.endereco_numero || '',
        endereco_complemento: siteConfig.endereco_complemento || '',
        endereco_bairro: siteConfig.endereco_bairro || '',
        endereco_cidade: siteConfig.endereco_cidade || '',
        endereco_estado: siteConfig.endereco_estado || '',
        google_maps_url: siteConfig.google_maps_url || generateGoogleMapsEmbedUrl(siteConfig),
      });

      setMediaForm({
        hero_home_media_url: siteConfig.hero_home_media_url || '/hero-bg.jpg',
        hero_home_media_type: (siteConfig.hero_home_media_type as 'image' | 'video') || 'image',
        hero_construtora_media_url: siteConfig.hero_construtora_media_url || 'https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/public/mchconstrutora_imobiliaria/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4',
        hero_construtora_media_type: (siteConfig.hero_construtora_media_type as 'image' | 'video') || 'video',
        hero_reformas_media_url: siteConfig.hero_reformas_media_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
        hero_reformas_media_type: (siteConfig.hero_reformas_media_type as 'image' | 'video') || 'image',
        reformas_secao2_img_url: siteConfig.reformas_secao2_img_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      });
    }
  }, [siteConfig]);

  // Handle Save Contacts & Social
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingContacts(true);
      await updateSiteConfig(contactForm);
      showToast('Canais de atendimento e redes sociais atualizados com sucesso!');
    } catch (err: any) {
      showToast('Erro ao salvar contatos: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setSavingContacts(false);
    }
  };

  // Handle CEP Search
  const handleBuscarCep = async () => {
    const rawCep = (addressForm.endereco_cep || '').replace(/\D/g, '');
    if (rawCep.length !== 8) {
      showToast('Informe um CEP válido com 8 dígitos.');
      return;
    }

    try {
      setLoadingCep(true);
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        showToast('CEP não encontrado na base dos Correios.');
        return;
      }

      setAddressForm(prev => ({
        ...prev,
        endereco_logradouro: data.logradouro || prev.endereco_logradouro,
        endereco_bairro: data.bairro || prev.endereco_bairro,
        endereco_cidade: data.localidade || prev.endereco_cidade,
        endereco_estado: data.uf || prev.endereco_estado
      }));

      showToast('Endereço preenchido via CEP!');
    } catch (e) {
      showToast('Erro ao consultar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  // Handle Save Address (com geração 100% automática da URL do Google Maps)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      const autoUrl = generateGoogleMapsEmbedUrl(addressForm);
      const payload = {
        ...addressForm,
        google_maps_url: autoUrl
      };
      await updateSiteConfig(payload);
      setAddressForm(payload);
      showToast('Endereço e mapa atualizados automaticamente com sucesso!');
    } catch (err: any) {
      showToast('Erro ao salvar endereço: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setSavingAddress(false);
    }
  };

  // ==========================================
  // HEROES & PAGE MEDIA MANAGEMENT
  // ==========================================
  const handleUploadMediaFile = async (
    fieldKey: 'hero_home' | 'hero_construtora' | 'hero_reformas' | 'reformas_secao2',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMediaField(fieldKey);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
      
      // Regra de compressão: imagens passam pela compressão inteligente WebP Full HD (0.82), vídeos sobem diretamente
      const shouldCompress = !isVideo;
      const newUrl = await uploadImageToBucket(file, 'site', shouldCompress);

      let previousUrl = '';
      let updatedPayload: Partial<SiteConfig> = {};

      if (fieldKey === 'hero_home') {
        previousUrl = mediaForm.hero_home_media_url;
        updatedPayload = {
          hero_home_media_url: newUrl,
          hero_home_media_type: isVideo ? 'video' : 'image'
        };
        setMediaForm(prev => ({ ...prev, ...updatedPayload }));
      } else if (fieldKey === 'hero_construtora') {
        previousUrl = mediaForm.hero_construtora_media_url;
        updatedPayload = {
          hero_construtora_media_url: newUrl,
          hero_construtora_media_type: isVideo ? 'video' : 'image'
        };
        setMediaForm(prev => ({ ...prev, ...updatedPayload }));
      } else if (fieldKey === 'hero_reformas') {
        previousUrl = mediaForm.hero_reformas_media_url;
        updatedPayload = {
          hero_reformas_media_url: newUrl,
          hero_reformas_media_type: isVideo ? 'video' : 'image'
        };
        setMediaForm(prev => ({ ...prev, ...updatedPayload }));
      } else if (fieldKey === 'reformas_secao2') {
        previousUrl = mediaForm.reformas_secao2_img_url;
        updatedPayload = {
          reformas_secao2_img_url: newUrl
        };
        setMediaForm(prev => ({ ...prev, ...updatedPayload }));
      }

      // Regra do bucket: deletar arquivo substituído se ele pertencia ao bucket
      if (previousUrl && previousUrl.includes(SUPABASE_BUCKET)) {
        await deleteImageFromBucket(previousUrl);
      }

      // Salvar imediatamente no banco de dados e sincronizar o front
      await updateSiteConfig(updatedPayload);
      showToast('Mídia enviada e sincronizada com o site em tempo real!');
    } catch (err: any) {
      console.error('Erro no upload de mídia:', err);
      showToast('Erro ao realizar upload da mídia: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setUploadingMediaField(null);
      e.target.value = '';
    }
  };

  const handleResetMedia = (
    fieldKey: 'hero_home' | 'hero_construtora' | 'hero_reformas' | 'reformas_secao2'
  ) => {
    let defaultUrl = '';
    let defaultType: 'image' | 'video' = 'image';
    let previousUrl = '';
    let fieldLabel = '';

    if (fieldKey === 'hero_home') {
      fieldLabel = 'Hero da Home';
      defaultUrl = '/hero-bg.jpg';
      defaultType = 'image';
      previousUrl = mediaForm.hero_home_media_url;
    } else if (fieldKey === 'hero_construtora') {
      fieldLabel = 'Hero da Construtora';
      defaultUrl = 'https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/public/mchconstrutora_imobiliaria/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4';
      defaultType = 'video';
      previousUrl = mediaForm.hero_construtora_media_url;
    } else if (fieldKey === 'hero_reformas') {
      fieldLabel = 'Hero de Reformas';
      defaultUrl = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80';
      defaultType = 'image';
      previousUrl = mediaForm.hero_reformas_media_url;
    } else if (fieldKey === 'reformas_secao2') {
      fieldLabel = 'Imagem da 2ª Seção de Reformas';
      defaultUrl = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80';
      previousUrl = mediaForm.reformas_secao2_img_url;
    }

    confirmDelete({
      title: `Restaurar padrão: ${fieldLabel}`,
      message: `Deseja remover a mídia personalizada e restaurar o arquivo padrão original? O arquivo enviado do storage será apagado.`,
      itemName: fieldLabel,
      confirmText: 'Restaurar Padrão',
      onConfirm: async () => {
        try {
          if (previousUrl && previousUrl.includes(SUPABASE_BUCKET)) {
            await deleteImageFromBucket(previousUrl);
          }

          let updatedPayload: Partial<SiteConfig> = {};
          if (fieldKey === 'hero_home') {
            updatedPayload = { hero_home_media_url: defaultUrl, hero_home_media_type: defaultType };
            setMediaForm(prev => ({ ...prev, ...updatedPayload }));
          } else if (fieldKey === 'hero_construtora') {
            updatedPayload = { hero_construtora_media_url: defaultUrl, hero_construtora_media_type: defaultType };
            setMediaForm(prev => ({ ...prev, ...updatedPayload }));
          } else if (fieldKey === 'hero_reformas') {
            updatedPayload = { hero_reformas_media_url: defaultUrl, hero_reformas_media_type: defaultType };
            setMediaForm(prev => ({ ...prev, ...updatedPayload }));
          } else if (fieldKey === 'reformas_secao2') {
            updatedPayload = { reformas_secao2_img_url: defaultUrl };
            setMediaForm(prev => ({ ...prev, ...updatedPayload }));
          }

          await updateSiteConfig(updatedPayload);
          showToast('Mídia restaurada com sucesso!');
        } catch (err: any) {
          showToast('Erro ao restaurar mídia: ' + (err?.message || 'Tente novamente.'));
        }
      }
    });
  };

  const handleSaveMediaForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingMedia(true);
      await updateSiteConfig({
        hero_home_media_url: mediaForm.hero_home_media_url,
        hero_home_media_type: mediaForm.hero_home_media_type,
        hero_construtora_media_url: mediaForm.hero_construtora_media_url,
        hero_construtora_media_type: mediaForm.hero_construtora_media_type,
        hero_reformas_media_url: mediaForm.hero_reformas_media_url,
        hero_reformas_media_type: mediaForm.hero_reformas_media_type,
        reformas_secao2_img_url: mediaForm.reformas_secao2_img_url,
      });
      showToast('Configurações de mídias salvas com sucesso!');
    } catch (err: any) {
      showToast('Erro ao salvar mídias: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setSavingMedia(false);
    }
  };

  // ==========================================
  // PORTFOLIO MODAL & IMAGE MANAGEMENT
  // ==========================================
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [portfolioFormData, setPortfolioFormData] = useState<Partial<PortfolioItem>>({
    title: '',
    category: 'Construção Civil',
    location: '',
    timeframe: '',
    description: '',
    image: '',
    gallery: [],
    highlights: [],
    order_index: 1,
    is_active: true
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open modal to create portfolio item
  const handleOpenNewItem = () => {
    setEditingItem(null);
    setPortfolioFormData({
      title: '',
      category: 'Construção Civil',
      location: '',
      timeframe: '',
      description: '',
      image: '',
      gallery: [],
      highlights: [],
      order_index: portfolio.length + 1,
      is_active: true
    });
    setIsPortfolioModalOpen(true);
  };

  // Open modal to edit existing portfolio item
  const handleOpenEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setPortfolioFormData({
      ...item,
      gallery: Array.isArray(item.gallery) ? [...item.gallery] : [],
      highlights: Array.isArray(item.highlights) ? [...item.highlights] : []
    });
    setIsPortfolioModalOpen(true);
  };

  // Add highlight bullet
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setPortfolioFormData(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlight.trim()]
    }));
    setNewHighlight('');
  };

  // Remove highlight bullet
  const handleRemoveHighlight = (idx: number) => {
    setPortfolioFormData(prev => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx)
    }));
  };

  // Handle Image Upload for Portfolio Item
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      showToast('Enviando imagem para o bucket machado_construtora...');

      // Upload direto para o bucket `machado_construtora`
      const publicUrl = await uploadImageToBucket(file, 'portfolio');

      // Se já estiver editando um item salvo no banco, sincroniza via context
      if (editingItem?.id) {
        await uploadPortfolioImage(editingItem.id, file, !portfolioFormData.image);
      }

      setPortfolioFormData(prev => {
        const newGallery = prev.gallery ? [...prev.gallery, publicUrl] : [publicUrl];
        return {
          ...prev,
          image: prev.image || publicUrl,
          gallery: newGallery
        };
      });

      showToast('Imagem adicionada com sucesso ao portfólio!');
    } catch (err: any) {
      showToast('Erro no upload da imagem: ' + (err?.message || 'Falha ao enviar.'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Set an image from gallery as main cover
  const handleSetAsCover = (imageUrl: string) => {
    setPortfolioFormData(prev => ({ ...prev, image: imageUrl }));
    if (editingItem?.id) {
      updatePortfolioItem(editingItem.id, { image: imageUrl });
    }
    showToast('Imagem definida como capa principal!');
  };

  // Remove an image from gallery
  const handleRemoveImage = async (imageUrl: string) => {
    const newGallery = (portfolioFormData.gallery || []).filter(url => url !== imageUrl);
    const newCover = portfolioFormData.image === imageUrl ? (newGallery[0] || '') : portfolioFormData.image;

    setPortfolioFormData(prev => ({
      ...prev,
      gallery: newGallery,
      image: newCover
    }));

    if (editingItem?.id) {
      await removePortfolioImage(editingItem.id, imageUrl);
    }
    showToast('Imagem removida do portfólio e do storage.');
  };

  // Save Portfolio Item (Create or Update)
  const handleSaveItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioFormData.title?.trim()) {
      showToast('O título do projeto é obrigatório.');
      return;
    }

    try {
      setSavingItem(true);

      const payload = {
        title: portfolioFormData.title,
        category: portfolioFormData.category || 'Construção Civil',
        location: portfolioFormData.location || '',
        timeframe: portfolioFormData.timeframe || '',
        description: portfolioFormData.description || '',
        image: portfolioFormData.image || (portfolioFormData.gallery?.[0] || ''),
        gallery: portfolioFormData.gallery || [],
        highlights: portfolioFormData.highlights || [],
        order_index: Number(portfolioFormData.order_index) || 1,
        is_active: portfolioFormData.is_active ?? true
      };

      if (editingItem?.id) {
        await updatePortfolioItem(editingItem.id, payload);
        showToast('Projeto do portfólio atualizado com sucesso no site!');
      } else {
        await addPortfolioItem(payload);
        showToast('Novo projeto publicado no portfólio do site!');
      }

      setIsPortfolioModalOpen(false);
    } catch (err: any) {
      showToast('Erro ao salvar no portfólio: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setSavingItem(false);
    }
  };

  // Delete Portfolio Item
  const handleDeleteItem = (item: PortfolioItem) => {
    confirmDelete({
      title: 'Excluir Projeto do Portfólio',
      message: 'Tem certeza que deseja excluir este projeto? Todas as imagens associadas no bucket serão excluídas automaticamente.',
      itemName: item.title,
      confirmText: 'Excluir do Portfólio',
      onConfirm: async () => {
        try {
          await deletePortfolioItem(item.id);
          showToast(`Projeto "${item.title}" excluído com sucesso.`);
        } catch (err: any) {
          showToast('Erro ao excluir projeto: ' + (err?.message || 'Tente novamente.'));
        }
      }
    });
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] px-4 py-3 rounded-xl bg-[#101726] border border-sky-400/40 text-sky-300 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navegação por Abas Limpa e Direta (sem o banner) */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('contatos')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'contatos'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contatos</span>
        </button>

        <button
          onClick={() => setActiveTab('endereco')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'endereco'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Local</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Portfólio ({portfolio.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'home'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('construtora')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'construtora'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Construtora</span>
        </button>

        <button
          onClick={() => setActiveTab('reformas')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reformas'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Reformas</span>
        </button>
      </div>

      {/* ====================================================
          TAB 1: CONTATOS & REDES SOCIAIS
         ==================================================== */}
      {activeTab === 'contatos' && (
        <form onSubmit={handleSaveContacts} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bloco 1: Canais de Atendimento Oficial */}
            <div className="bg-[#101726]/90 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Canais de Atendimento Oficial</h3>
                  <p className="text-[11px] text-slate-400">Exibidos no rodapé, página de contato e botão flutuante de atendimento</p>
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>E-mail Principal / Atendimento Geral</span>
                </label>
                <input
                  type="email"
                  value={contactForm.email_principal || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, email_principal: e.target.value }))}
                  placeholder="ex: contato@mchengenharia.com.br"
                  className={INPUT_CLASS}
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Canal central para recebimento de mensagens e orçamentos do site.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Oficial (DDI + DDD + Número)</span>
                  </label>
                  {contactForm.whatsapp && (
                    <a
                      href={`https://wa.me/${contactForm.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                    >
                      <span>Testar link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={contactForm.whatsapp || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="ex: 5511966454023"
                  className={INPUT_CLASS}
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  O botão flutuante do site direcionará diretamente para este número de WhatsApp.
                </p>
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Horário de Atendimento / Funcionamento</span>
                </label>
                <input
                  type="text"
                  value={contactForm.horario_funcionamento || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, horario_funcionamento: e.target.value }))}
                  placeholder="ex: Segunda a Sexta: 08h às 18h"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {/* Bloco 2: Redes Sociais Oficiais */}
            <div className="bg-[#101726]/90 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Redes Sociais Oficiais</h3>
                  <p className="text-[11px] text-slate-400">Links para os perfis sociais exibidos na página de contato e no rodapé</p>
                </div>
              </div>

              {/* Facebook */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Facebook className="w-3.5 h-3.5 text-blue-400" />
                    <span>Facebook URL</span>
                  </label>
                  {contactForm.facebook_url && (
                    <a
                      href={contactForm.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={contactForm.facebook_url || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                  placeholder="https://facebook.com/machado.construtora"
                  className={INPUT_CLASS}
                />
              </div>

              {/* TikTok */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <TikTokIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>TikTok URL</span>
                  </label>
                  {contactForm.tiktok_url && (
                    <a
                      href={contactForm.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-mono"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={contactForm.tiktok_url || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, tiktok_url: e.target.value }))}
                  placeholder="https://tiktok.com/@machado_construtora"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Instagram */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-purple-400" />
                    <span>Instagram URL</span>
                  </label>
                  {contactForm.instagram_url && (
                    <a
                      href={contactForm.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={contactForm.instagram_url || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/machado_construtora"
                  className={INPUT_CLASS}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <span>LinkedIn URL</span>
                  </label>
                  {contactForm.linkedin_url && (
                    <a
                      href={contactForm.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={contactForm.linkedin_url || ''}
                  onChange={e => setContactForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/company/machado-construtora"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar Contatos */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={savingContacts}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingContacts ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando no banco de dados...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Contatos &amp; Redes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ====================================================
          TAB 2: ENDEREÇO & LOCALIZAÇÃO
         ==================================================== */}
      {activeTab === 'endereco' && (
        <form onSubmit={handleSaveAddress} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bloco do Endereço */}
            <div className="lg:col-span-7 bg-[#101726]/90 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Endereço da Sede &amp; Escritório</h3>
                  <p className="text-[11px] text-slate-400">Endereço oficial exibido no rodapé e na página de contato</p>
                </div>
              </div>

              {/* CEP com Busca ViaCEP */}
              <div>
                <label className={LABEL_CLASS}>
                  CEP (Busca automática de endereço)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addressForm.endereco_cep || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_cep: e.target.value }))}
                    placeholder="07790-840"
                    maxLength={9}
                    className={INPUT_CLASS}
                  />
                  <button
                    type="button"
                    onClick={handleBuscarCep}
                    disabled={loadingCep}
                    className="px-4 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  >
                    {loadingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Buscar CEP</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>Logradouro / Avenida / Rua</label>
                  <input
                    type="text"
                    value={addressForm.endereco_logradouro || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_logradouro: e.target.value }))}
                    placeholder="Av. dos Ipês"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Número</label>
                  <input
                    type="text"
                    value={addressForm.endereco_numero || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_numero: e.target.value }))}
                    placeholder="155"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Complemento / Sala</label>
                  <input
                    type="text"
                    value={addressForm.endereco_complemento || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_complemento: e.target.value }))}
                    placeholder="Sala 204, Galpão A"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Bairro</label>
                  <input
                    type="text"
                    value={addressForm.endereco_bairro || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_bairro: e.target.value }))}
                    placeholder="Portal dos Ipês (Polvilho)"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>Cidade</label>
                  <input
                    type="text"
                    value={addressForm.endereco_cidade || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_cidade: e.target.value }))}
                    placeholder="Cajamar"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Estado (UF)</label>
                  <input
                    type="text"
                    value={addressForm.endereco_estado || ''}
                    onChange={e => setAddressForm(prev => ({ ...prev, endereco_estado: e.target.value }))}
                    placeholder="SP"
                    maxLength={2}
                    className={INPUT_CLASS}
                    required
                  />
                </div>
              </div>

              {/* Informação sobre o Embed Automático */}
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
                <span className="font-semibold block text-white mb-1">Localização e Mapa 100% Automáticos</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  O mapa interativo no site é traçado automaticamente a partir do endereço acima (Logradouro, Número, Bairro, Cidade e CEP). Não é necessário colar URLs de iframe manuais.
                </p>
              </div>
            </div>

            {/* Preview do Mapa e Resumo */}
            <div className="lg:col-span-5 bg-[#101726]/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                    Pré-visualização do Mapa
                  </h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gerado 100% Automático
                  </span>
                </div>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-[#0A0E17] relative">
                  <iframe
                    src={generateGoogleMapsEmbedUrl(addressForm)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Google Maps Automático"
                  />
                </div>

                {/* Resumo formatado */}
                <div className="mt-4 p-4 rounded-xl bg-[#0A0E17]/60 border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-mono text-sky-400 block font-semibold">
                    Como será exibido no site:
                  </span>
                  <p className="text-white font-medium">
                    {addressForm.endereco_logradouro || 'Logradouro'}, {addressForm.endereco_numero || 'S/N'}
                    {addressForm.endereco_complemento ? ` - ${addressForm.endereco_complemento}` : ''}
                  </p>
                  <p className="text-slate-400">
                    {addressForm.endereco_bairro || 'Bairro'} - {addressForm.endereco_cidade || 'Cidade'} / {addressForm.endereco_estado || 'UF'}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    CEP: {addressForm.endereco_cep || '07790-840'}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingAddress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando Endereço...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar Endereço &amp; Atualizar Mapa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ====================================================
          TAB 3: PORTFÓLIO (COM ADICIONAR IMAGENS)
         ==================================================== */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Top Bar with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101726]/60 border border-white/10 p-4 rounded-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Projetos do Portfólio Publicados</h3>
              <p className="text-xs text-slate-400">
                Gerencie as obras exibidas no site público, adicione fotos em alta resolução e organize as galerias.
              </p>
            </div>
            <button
              onClick={handleOpenNewItem}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Projeto</span>
            </button>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => {
              const galleryCount = item.gallery?.length || (item.image ? 1 : 0);

              return (
                <div
                  key={item.id}
                  className="bg-[#101726]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-sky-500/30 transition-all flex flex-col group"
                >
                  {/* Item Cover Image */}
                  <div className="relative h-48 w-full bg-[#0A0E17] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs">Sem foto de capa</span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0A0E17]/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-sky-400">
                      {item.category}
                    </div>

                    {/* Gallery Count Badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#0A0E17]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                      <span>{galleryCount} foto{galleryCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </h4>
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                      {item.timeframe && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{item.timeframe}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                        {item.description || 'Sem descrição cadastrada.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditItem(item)}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 border border-white/10 hover:border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                        <span>Editar &amp; Imagens</span>
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center justify-center transition-all cursor-pointer"
                        title="Excluir do portfólio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 4: PÁGINA INICIAL (HOME)
         ==================================================== */}
      {activeTab === 'home' && (
        <form onSubmit={handleSaveMediaForm} className="space-y-6 animate-in fade-in">
          <input
            type="file"
            ref={homeFileInputRef}
            onChange={(e) => handleUploadMediaFile('hero_home', e)}
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101726]/60 border border-white/10 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Hero da Página Inicial (Home)</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Configure a mídia de abertura exibida no topo da página principal. Você pode optar por uma imagem fotográfica de alta definição com efeito parallax ou um vídeo institucional em loop contínuo.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingMedia}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {savingMedia ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando Home...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações da Home</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#101726]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl">
            {/* Seletor de Tipo */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <label className="text-sm font-semibold text-white block">Formato da Mídia do Hero</label>
                <p className="text-xs text-slate-400">Escolha se deseja exibir uma imagem com parallax ou um vídeo de fundo</p>
              </div>

              <div className="flex items-center p-1 bg-[#0A0E17] border border-white/10 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setMediaForm(prev => ({ ...prev, hero_home_media_type: 'image' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mediaForm.hero_home_media_type === 'image'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Imagem</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaForm(prev => ({ ...prev, hero_home_media_type: 'video' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mediaForm.hero_home_media_type === 'video'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vídeo</span>
                </button>
              </div>
            </div>

            {/* Preview Ao Vivo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300">Pré-visualização do Hero</label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                  {mediaForm.hero_home_media_type === 'video' ? 'Modo Vídeo Ativo' : 'Modo Imagem Ativa'}
                </span>
              </div>

              <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-[#0A0E17] relative group">
                {mediaForm.hero_home_media_type === 'video' ? (
                  <video
                    key={mediaForm.hero_home_media_url}
                    src={mediaForm.hero_home_media_url}
                    controls
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaForm.hero_home_media_url || '/hero-bg.jpg'}
                    alt="Hero da Home"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
            </div>

            {/* Input de URL e Ações */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={LABEL_CLASS}>URL Direta da Mídia</label>
                {mediaForm.hero_home_media_url && (
                  <a
                    href={mediaForm.hero_home_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                  >
                    <span>Abrir arquivo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={mediaForm.hero_home_media_url}
                onChange={e => setMediaForm(prev => ({ ...prev, hero_home_media_url: e.target.value }))}
                placeholder="/hero-bg.jpg ou https://..."
                className={INPUT_CLASS}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
              <span className="font-semibold block text-white mb-0.5">Regra de Otimização &amp; Bucket</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Imagens enviadas passam por compressão inteligente Canvas WebP (máx. 1920px a 82%), reduzindo peso para carregamento instantâneo. Arquivos anteriores no storage são deletados automaticamente para não ocupar espaço desnecessário.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleResetMedia('hero_home')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Restaurar Padrão da Home</span>
              </button>

              <button
                type="button"
                disabled={uploadingMediaField === 'hero_home'}
                onClick={() => homeFileInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadingMediaField === 'hero_home' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Comprimindo &amp; Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Substituir Arquivo da Home</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ====================================================
          TAB 5: PÁGINA CONSTRUTORA (/CONSTRUTORA)
         ==================================================== */}
      {activeTab === 'construtora' && (
        <form onSubmit={handleSaveMediaForm} className="space-y-6 animate-in fade-in">
          <input
            type="file"
            ref={construtoraFileInputRef}
            onChange={(e) => handleUploadMediaFile('hero_construtora', e)}
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101726]/60 border border-white/10 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Hero da Construtora (/construtora)</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Gerencie a mídia recortada exibida na lateral direita (40%) do Hero da página de Construtora. Alterne livremente entre vídeo MP4 institucional e imagem de alta resolução.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingMedia}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {savingMedia ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando Construtora...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações de Construtora</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#101726]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl">
            {/* Seletor de Tipo */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <label className="text-sm font-semibold text-white block">Tipo de Mídia do Hero</label>
                <p className="text-xs text-slate-400">Atualmente configurado para vídeo institucional recortado</p>
              </div>

              <div className="flex items-center p-1 bg-[#0A0E17] border border-white/10 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setMediaForm(prev => ({ ...prev, hero_construtora_media_type: 'video' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mediaForm.hero_construtora_media_type === 'video'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vídeo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaForm(prev => ({ ...prev, hero_construtora_media_type: 'image' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mediaForm.hero_construtora_media_type === 'image'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Imagem</span>
                </button>
              </div>
            </div>

            {/* Preview Ao Vivo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300">Pré-visualização da Lateral do Hero (40%)</label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                  {mediaForm.hero_construtora_media_type === 'video' ? 'Vídeo Ativo' : 'Imagem Ativa'}
                </span>
              </div>

              <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-[#0A0E17] relative group">
                {mediaForm.hero_construtora_media_type === 'video' ? (
                  <video
                    key={mediaForm.hero_construtora_media_url}
                    src={mediaForm.hero_construtora_media_url}
                    controls
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaForm.hero_construtora_media_url}
                    alt="Hero Construtora"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
            </div>

            {/* Input de URL e Ações */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={LABEL_CLASS}>URL da Mídia (ou Envie um Arquivo)</label>
                {mediaForm.hero_construtora_media_url && (
                  <a
                    href={mediaForm.hero_construtora_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                  >
                    <span>Abrir arquivo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={mediaForm.hero_construtora_media_url}
                onChange={e => setMediaForm(prev => ({ ...prev, hero_construtora_media_url: e.target.value }))}
                placeholder="https://..."
                className={INPUT_CLASS}
              />
            </div>

            {/* Botões de Ação */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleResetMedia('hero_construtora')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Restaurar Padrão da Construtora</span>
              </button>

              <button
                type="button"
                disabled={uploadingMediaField === 'hero_construtora'}
                onClick={() => construtoraFileInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadingMediaField === 'hero_construtora' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando &amp; Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Substituir Arquivo da Construtora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ====================================================
          TAB 6: PÁGINA REFORMAS (/REFORMAS)
         ==================================================== */}
      {activeTab === 'reformas' && (
        <form onSubmit={handleSaveMediaForm} className="space-y-6 animate-in fade-in">
          <input
            type="file"
            ref={reformasFileInputRef}
            onChange={(e) => handleUploadMediaFile('hero_reformas', e)}
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
          />
          <input
            type="file"
            ref={secao2FileInputRef}
            onChange={(e) => handleUploadMediaFile('reformas_secao2', e)}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101726]/60 border border-white/10 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Hammer className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Gestão da Página de Reformas (/reformas)</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Altere a mídia do <strong>Hero de Reformas</strong> (imagem ou vídeo) e a fotografia técnica da <strong>2ª Seção (Serviços Prediais &amp; Manutenção)</strong> com compressão automática WebP.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingMedia}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {savingMedia ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando Reformas...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações de Reformas</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* BLOCO 1: HERO DE REFORMAS */}
            <div className="bg-[#101726]/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">1. Hero de Reformas (Lateral 40%)</h4>
                      <p className="text-[11px] text-slate-400">Mídia recortada da seção de abertura</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    Hero
                  </span>
                </div>

                {/* Seletor de Tipo */}
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-300">Tipo de Mídia:</label>
                  <div className="flex items-center p-1 bg-[#0A0E17] border border-white/10 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setMediaForm(prev => ({ ...prev, hero_reformas_media_type: 'image' }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        mediaForm.hero_reformas_media_type === 'image'
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Imagem</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaForm(prev => ({ ...prev, hero_reformas_media_type: 'video' }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        mediaForm.hero_reformas_media_type === 'video'
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Vídeo</span>
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-[#0A0E17] relative group">
                  {mediaForm.hero_reformas_media_type === 'video' ? (
                    <video
                      key={mediaForm.hero_reformas_media_url}
                      src={mediaForm.hero_reformas_media_url}
                      controls
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaForm.hero_reformas_media_url}
                      alt="Hero Reformas"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                    {mediaForm.hero_reformas_media_type === 'video' ? 'Vídeo Ativo' : 'Imagem Ativa'}
                  </div>
                </div>

                {/* URL Direta */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={LABEL_CLASS}>URL da Mídia do Hero</label>
                    {mediaForm.hero_reformas_media_url && (
                      <a
                        href={mediaForm.hero_reformas_media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={mediaForm.hero_reformas_media_url}
                    onChange={e => setMediaForm(prev => ({ ...prev, hero_reformas_media_url: e.target.value }))}
                    placeholder="https://..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Botões Hero */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleResetMedia('hero_reformas')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>

                <button
                  type="button"
                  disabled={uploadingMediaField === 'hero_reformas'}
                  onClick={() => reformasFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploadingMediaField === 'hero_reformas' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Substituir Hero</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* BLOCO 2: REFORMAS - 2ª SEÇÃO (SERVIÇOS PREDIAIS) */}
            <div className="bg-[#101726]/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">2. Imagem da 2ª Seção (Serviços Prediais)</h4>
                      <p className="text-[11px] text-slate-400">Foto técnica ilustrando os serviços especializados</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    WebP Full HD
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-semibold block text-white mb-0.5">Compressão Automática Ativa</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Fotos são redimensionadas para até 1920x1920 e comprimidas para WebP (~150KB), garantindo nitidez e rapidez.
                  </p>
                </div>

                {/* Preview */}
                <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-[#0A0E17] relative group">
                  <img
                    src={mediaForm.reformas_secao2_img_url}
                    alt="2ª Seção de Reformas"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                    Foto da 2ª Seção
                  </div>
                </div>

                {/* URL Direta */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={LABEL_CLASS}>URL da Imagem da 2ª Seção</label>
                    {mediaForm.reformas_secao2_img_url && (
                      <a
                        href={mediaForm.reformas_secao2_img_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={mediaForm.reformas_secao2_img_url}
                    onChange={e => setMediaForm(prev => ({ ...prev, reformas_secao2_img_url: e.target.value }))}
                    placeholder="https://..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Botões 2ª Seção */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleResetMedia('reformas_secao2')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>

                <button
                  type="button"
                  disabled={uploadingMediaField === 'reformas_secao2'}
                  onClick={() => secao2FileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploadingMediaField === 'reformas_secao2' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Comprimindo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Substituir Foto</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      )}

      {/* ====================================================
          MODAL: EDITAR / CRIAR NO PORTFÓLIO & ADICIONAR IMAGENS
         ==================================================== */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#101726] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0A0E17]/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingItem ? 'Editar Projeto & Galeria de Imagens' : 'Novo Projeto no Portfólio'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cadastre informações e faça upload de fotos para o bucket <strong>machado_construtora</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPortfolioModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveItemSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Título & Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>Título do Projeto *</label>
                  <input
                    type="text"
                    value={portfolioFormData.title || ''}
                    onChange={e => setPortfolioFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="ex: Construção de Torre Autoportante para Telecom (48m)"
                    className={INPUT_CLASS}
                    required
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Categoria *</label>
                  <select
                    value={portfolioFormData.category || 'Construção Civil'}
                    onChange={e => setPortfolioFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-all cursor-pointer"
                  >
                    {CATEGORIAS_PADRAO.map(cat => (
                      <option key={cat} value={cat} className="bg-[#101726] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Localização & Prazo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Localização</label>
                  <input
                    type="text"
                    value={portfolioFormData.location || ''}
                    onChange={e => setPortfolioFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="ex: Cajamar - SP (Rodovia Anhanguera)"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Prazo de Entrega / Tempo de Obra</label>
                  <input
                    type="text"
                    value={portfolioFormData.timeframe || ''}
                    onChange={e => setPortfolioFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                    placeholder="ex: 45 dias da fundação à entrega"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className={LABEL_CLASS}>Descrição Técnica da Obra</label>
                <textarea
                  rows={3}
                  value={portfolioFormData.description || ''}
                  onChange={e => setPortfolioFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o escopo da obra, diferenciais técnicos e métodos construtivos utilizados..."
                  className="w-full bg-[#0A0E17] border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all resize-none"
                />
              </div>

              {/* Destaques Técnicos (Highlights) */}
              <div>
                <label className={LABEL_CLASS}>Destaques / Pontos Fortes (Bullets)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={e => setNewHighlight(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                    placeholder="ex: Estrutura em concreto armado com vãos livres..."
                    className={INPUT_CLASS}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {(portfolioFormData.highlights || []).map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0A0E17] border border-white/5 text-xs text-slate-300"
                    >
                      <span className="flex-1 truncate pr-2">• {h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* =========================================================
                  SEÇÃO DE UPLOAD E GALERIA DE IMAGENS DO PORTFÓLIO
                 ========================================================= */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>Galeria de Imagens do Portfólio</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Adicione fotos reais da obra. Os arquivos serão salvos diretamente no bucket <strong>machado_construtora</strong>.
                    </p>
                  </div>

                  {/* Input File Oculto e Botão de Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImageFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando foto...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Adicionar Imagem</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Grid de Imagens da Galeria */}
                {(portfolioFormData.gallery && portfolioFormData.gallery.length > 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {portfolioFormData.gallery.map((imgUrl, idx) => {
                      const isCover = portfolioFormData.image === imgUrl;

                      return (
                        <div
                          key={idx}
                          className={`group relative h-28 rounded-xl overflow-hidden border transition-all ${
                            isCover ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Badge de Capa */}
                          {isCover && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Capa
                            </span>
                          )}

                          {/* Overlay com Ações */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(imgUrl)}
                                className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-colors cursor-pointer"
                                title="Definir como capa"
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <a
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                              title="Ver em tamanho real"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(imgUrl)}
                              className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                              title="Remover foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-dashed border-white/15 rounded-xl p-8 text-center bg-[#0A0E17]/40">
                    <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
                    <p className="text-xs text-slate-400">Nenhuma imagem adicionada a este projeto.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Clique no botão &quot;Adicionar Imagem&quot; acima para enviar arquivos do seu computador.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer / Save */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingItem ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando no Portfólio...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingItem ? 'Atualizar Projeto' : 'Publicar no Portfólio'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteModule;
