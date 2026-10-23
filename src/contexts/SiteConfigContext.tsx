import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, uploadImageToBucket, deleteImageFromBucket } from '../lib/supabase';

export interface SiteConfig {
  id: string;
  email_principal: string;
  email_comercial: string;
  email_rh: string;
  telefone_principal: string;
  telefone_secundario: string;
  whatsapp: string;
  endereco_logradouro: string;
  endereco_numero: string;
  endereco_complemento?: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_cep: string;
  horario_funcionamento?: string;
  google_maps_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  linkedin_url?: string;
  // Mídias das Páginas e Heroes
  hero_home_media_url?: string;
  hero_home_media_type?: 'image' | 'video';
  hero_construtora_media_url?: string;
  hero_construtora_media_type?: 'image' | 'video';
  hero_reformas_media_url?: string;
  hero_reformas_media_type?: 'image' | 'video';
  reformas_secao2_img_url?: string;
}

/**
 * Gera automaticamente o link de incorporação (embed) do Google Maps
 * baseado no endereço completo configurado.
 */
export function generateGoogleMapsEmbedUrl(config: Partial<SiteConfig>): string {
  const parts = [
    config.endereco_logradouro,
    config.endereco_numero ? `nº ${config.endereco_numero}` : '',
    config.endereco_bairro,
    config.endereco_cidade,
    config.endereco_estado,
    config.endereco_cep ? `CEP ${config.endereco_cep}` : ''
  ].filter(Boolean);

  const query = parts.length > 0 ? parts.join(', ') : 'Cajamar, SP';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  location?: string;
  timeframe?: string;
  description?: string;
  image: string;
  gallery: string[];
  highlights: string[];
  order_index?: number;
  is_active?: boolean;
}

// Alias de retrocompatibilidade
export type SiteCase = PortfolioItem;

const DEFAULT_CONFIG: SiteConfig = {
  id: 'default',
  email_principal: 'contato@mchengenharia.com.br',
  email_comercial: 'comercial@mchengenharia.com.br',
  email_rh: 'rh@mchengenharia.com.br',
  telefone_principal: '(11) 96645-4023',
  telefone_secundario: '(11) 4448-1234',
  whatsapp: '5511966454023',
  endereco_logradouro: 'Av. dos Ipês',
  endereco_numero: '155',
  endereco_complemento: 'Portal dos Ipês (Polvilho)',
  endereco_bairro: 'Portal dos Ipês',
  endereco_cidade: 'Cajamar',
  endereco_estado: 'SP',
  endereco_cep: '07790-840',
  horario_funcionamento: 'Segunda a Sexta: 08h às 18h',
  google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.761794715783!2d-46.86469612399222!3d-23.396825578913395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1b9ad9b54d5d%3A0x6b3061dcaf7ebbc3!2sAv.%20dos%20Ip%C3%AAs%2C%20155%20-%20Portal%20dos%20Ip%C3%AAs%20(Polvilho)%2C%20Cajamar%20-%20SP%2C%2007790-840!5e0!3m2!1spt-BR!2sbr!4v1715802123456!5m2!1spt-BR!2sbr',
  instagram_url: 'https://instagram.com/machado_construtora',
  facebook_url: '',
  tiktok_url: '',
  linkedin_url: '',
  hero_home_media_url: '/hero-bg.jpg',
  hero_home_media_type: 'image',
  hero_construtora_media_url: 'https://txlvjukmjjfjufwkkrzm.supabase.co/storage/v1/object/public/mchconstrutora_imobiliaria/Projeto%202%20-%20Caliandras%202%20-%20Machado.mp4',
  hero_construtora_media_type: 'video',
  hero_reformas_media_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
  hero_reformas_media_type: 'image',
  reformas_secao2_img_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'
};

interface SiteConfigContextType {
  siteConfig: SiteConfig;
  portfolio: PortfolioItem[];
  cases: PortfolioItem[]; // Alias retrocompatível
  loading: boolean;
  error: string | null;
  refreshSiteData: () => Promise<void>;
  updateSiteConfig: (newData: Partial<SiteConfig>) => Promise<void>;
  addPortfolioItem: (itemData: Omit<PortfolioItem, 'id'>) => Promise<PortfolioItem>;
  updatePortfolioItem: (id: string, itemData: Partial<PortfolioItem>) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;
  uploadPortfolioImage: (portfolioId: string, file: File, setAsCover?: boolean) => Promise<string>;
  removePortfolioImage: (portfolioId: string, imageUrl: string) => Promise<void>;
  
  // Aliases retrocompatíveis
  addCase: (caseData: Omit<PortfolioItem, 'id'>) => Promise<PortfolioItem>;
  updateCase: (id: string, caseData: Partial<PortfolioItem>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  uploadCaseImage: (caseId: string, file: File, setAsCover?: boolean) => Promise<string>;
  removeCaseImage: (caseId: string, imageUrl: string) => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Buscar Site Config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (configError) {
        console.warn('Aviso ao carregar site_config:', configError.message);
      } else if (configData) {
        setSiteConfig(configData);
      }

      // 2. Buscar Portfólio da tabela `portfolio` (ou fallback para `site_cases`)
      let { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (portfolioError) {
        console.warn('Tentando fallback para site_cases...', portfolioError.message);
        const fallback = await supabase
          .from('site_cases')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });
        portfolioData = fallback.data;
        portfolioError = fallback.error;
      }

      if (portfolioError) {
        console.warn('Aviso ao carregar portfólio:', portfolioError.message);
      } else if (portfolioData) {
        setPortfolio(
          portfolioData.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            location: item.location || '',
            timeframe: item.timeframe || '',
            description: item.description || '',
            image: item.image || '',
            gallery: Array.isArray(item.gallery) ? item.gallery : [],
            highlights: Array.isArray(item.highlights) ? item.highlights : [],
            order_index: item.order_index ?? 0,
            is_active: item.is_active ?? true,
          }))
        );
      }
    } catch (err: any) {
      console.error('Erro na sincronização com Supabase:', err);
      setError(err?.message || 'Erro ao sincronizar dados do site.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteData();
  }, [refreshSiteData]);

  // Atualizar Configurações do Site (E-mails, Telefones, Endereço, etc.)
  const updateSiteConfig = async (newData: Partial<SiteConfig>) => {
    const updated = {
      ...siteConfig,
      ...newData,
      id: 'default',
      updated_at: new Date().toISOString()
    };

    // Atualização otimista imediata no front
    setSiteConfig(updated);

    const { error: upsertError } = await supabase
      .from('site_config')
      .upsert(updated);

    if (upsertError) {
      console.error('Erro ao salvar site_config no banco:', upsertError);
      throw upsertError;
    }
  };

  // Adicionar Novo Item ao Portfólio
  const addPortfolioItem = async (itemData: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> => {
    const newRecord = {
      ...itemData,
      gallery: itemData.gallery || (itemData.image ? [itemData.image] : []),
      highlights: itemData.highlights || [],
      order_index: itemData.order_index ?? portfolio.length + 1,
      is_active: itemData.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error: insertError } = await supabase
      .from('portfolio')
      .insert(newRecord)
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao adicionar item ao portfólio:', insertError);
      throw insertError;
    }

    const createdItem: PortfolioItem = {
      id: data.id,
      title: data.title,
      category: data.category,
      location: data.location || '',
      timeframe: data.timeframe || '',
      description: data.description || '',
      image: data.image || '',
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      order_index: data.order_index ?? 0,
      is_active: data.is_active ?? true,
    };

    setPortfolio(prev => [...prev, createdItem]);
    return createdItem;
  };

  // Atualizar Item do Portfólio Existente
  const updatePortfolioItem = async (id: string, itemData: Partial<PortfolioItem>) => {
    const existing = portfolio.find(c => c.id === id);
    if (!existing) return;

    const updated = {
      ...existing,
      ...itemData,
      updated_at: new Date().toISOString()
    };

    // Atualização otimista
    setPortfolio(prev => prev.map(c => (c.id === id ? updated : c)));

    const { error: updateError } = await supabase
      .from('portfolio')
      .update(updated)
      .eq('id', id);

    if (updateError) {
      console.error('Erro ao atualizar item do portfólio:', updateError);
      throw updateError;
    }
  };

  // Excluir Item do Portfólio
  const deletePortfolioItem = async (id: string) => {
    const toDelete = portfolio.find(c => c.id === id);
    if (!toDelete) return;

    setPortfolio(prev => prev.filter(c => c.id !== id));

    const { error: deleteError } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erro ao excluir do portfólio:', deleteError);
      throw deleteError;
    }
  };

  // Upload de Imagem para o Portfólio (salva em pasta portfolio/ no bucket)
  const uploadPortfolioImage = async (portfolioId: string, file: File, setAsCover = false): Promise<string> => {
    const uploadedUrl = await uploadImageToBucket(file, 'portfolio');

    const existing = portfolio.find(c => c.id === portfolioId);
    if (existing) {
      const newGallery = existing.gallery.includes(uploadedUrl) 
        ? existing.gallery 
        : [...existing.gallery, uploadedUrl];

      const patch: Partial<PortfolioItem> = {
        gallery: newGallery,
        image: setAsCover || !existing.image ? uploadedUrl : existing.image
      };

      await updatePortfolioItem(portfolioId, patch);
    }

    return uploadedUrl;
  };

  // Remover Imagem do Portfólio
  const removePortfolioImage = async (portfolioId: string, imageUrl: string) => {
    const existing = portfolio.find(c => c.id === portfolioId);
    if (!existing) return;

    const newGallery = existing.gallery.filter(url => url !== imageUrl);
    const newCover = existing.image === imageUrl 
      ? (newGallery[0] || '') 
      : existing.image;

    await updatePortfolioItem(portfolioId, {
      gallery: newGallery,
      image: newCover
    });

    // Remove do bucket de storage
    await deleteImageFromBucket(imageUrl);
  };

  return (
    <SiteConfigContext.Provider
      value={{
        siteConfig,
        portfolio,
        cases: portfolio, // Alias
        loading,
        error,
        refreshSiteData,
        updateSiteConfig,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        uploadPortfolioImage,
        removePortfolioImage,

        // Aliases
        addCase: addPortfolioItem,
        updateCase: updatePortfolioItem,
        deleteCase: deletePortfolioItem,
        uploadCaseImage: uploadPortfolioImage,
        removeCaseImage: removePortfolioImage
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig deve ser usado dentro de um SiteConfigProvider');
  }
  return context;
};
