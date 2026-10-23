import { useEffect } from 'react';

export interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE_DOMAIN = 'https://www.construcoesmachado.com.br';
const DEFAULT_IMAGE = `${SITE_DOMAIN}/casa-alto-padrao.jpg`;
const SITE_NAME = 'Machado Construtora e Incorporadora';

function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const SeoHead: React.FC<SeoProps> = ({
  title,
  description,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Título da página
    document.title = title;

    // 2. URL Canônica absoluta
    const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = `${SITE_DOMAIN}${normalizedPath === '/' ? '' : normalizedPath}`;
    updateCanonical(canonicalUrl);

    // 3. Meta Description
    updateMetaTag('name', 'description', description);

    // 4. Meta Robots (indexação vs noindex)
    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 5. Open Graph (Facebook, WhatsApp, LinkedIn)
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:site_name', SITE_NAME);
    updateMetaTag('property', 'og:locale', 'pt_BR');
    updateMetaTag('property', 'og:image', image.startsWith('http') ? image : `${SITE_DOMAIN}${image}`);
    updateMetaTag('property', 'og:image:width', '1200');
    updateMetaTag('property', 'og:image:height', '630');
    updateMetaTag('property', 'og:image:alt', title);

    // 6. Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image.startsWith('http') ? image : `${SITE_DOMAIN}${image}`);

    // 7. Dados estruturados JSON-LD (se fornecidos)
    let scriptElement: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.id = 'page-jsonld-schema';
      scriptElement.text = JSON.stringify(jsonLd);
      
      const existing = document.getElementById('page-jsonld-schema');
      if (existing) {
        existing.remove();
      }
      document.head.appendChild(scriptElement);
    }

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [title, description, canonicalPath, image, type, noindex, jsonLd]);

  return null;
};
