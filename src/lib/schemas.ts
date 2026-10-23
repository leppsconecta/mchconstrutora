/**
 * ==============================================================================
 * DADOS ESTRUTURADOS SCHEMA.ORG (JSON-LD) - MACHADO CONSTRUTORA E INCORPORADORA
 * ==============================================================================
 */

export const SITE_URL = 'https://www.construcoesmachado.com.br';
export const BUSINESS_NAME = 'Machado Construtora e Incorporadora';
export const LOGO_URL = `${SITE_URL}/logos/logotipo_machado_header.png`;
export const DEFAULT_IMAGE = `${SITE_URL}/casa-alto-padrao.jpg`;

/**
 * Schema principal LocalBusiness / GeneralContractor
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['HomeAndConstructionBusiness', 'GeneralContractor'],
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    alternateName: 'Machado Engenharia & Construtora',
    legalName: 'Machado Construtora e Incorporadora',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: '300',
      height: '60'
    },
    image: DEFAULT_IMAGE,
    description: 'Empresa de construção civil de alto padrão, incorporação imobiliária residencial turnkey, fundações civis pesadas para torres de telecomunicações e reformas prediais e corporativas B2B.',
    telephone: '+55-11-96645-4023',
    email: 'contato@mchengenharia.com.br',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. dos Ipês, 155 - 2º Andar, Portal dos Ipês (Polvilho)',
      addressLocality: 'Cajamar',
      addressRegion: 'SP',
      postalCode: '07790-840',
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.4076,
      longitude: -46.8525
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '08:00',
        closes: '18:00'
      }
    ],
    areaServed: [
      { '@type': 'City', name: 'Cajamar' },
      { '@type': 'City', name: 'Santana de Parnaíba' },
      { '@type': 'City', name: 'Barueri' },
      { '@type': 'AdministrativeArea', name: 'Alphaville' },
      { '@type': 'City', name: 'Jundiaí' },
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'AdministrativeArea', name: 'Grande São Paulo' }
    ],
    priceRange: '$$$$',
    currenciesAccepted: 'BRL',
    paymentAccepted: 'Transferência bancária, Boleto, Financiamento Imobiliário',
    knowsAbout: [
      'Construção Civil Residencial Turnkey',
      'Incorporação Imobiliária',
      'Infraestrutura Civil para Torres de Telecomunicações',
      'Fundações e Bases Maciças Greenfield e Rooftop',
      'Reformas Prediais e Corporativas B2B',
      'Adequações Elétricas e Hidráulicas',
      'Normas Regulamentadoras CREA-SP, NR-18 e NR-35'
    ],
    sameAs: [
      'https://www.instagram.com/machado_construtora_',
      'https://www.facebook.com/',
      'https://www.linkedin.com/'
    ]
  };
}

/**
 * BreadcrumbList estruturado
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`
    }))
  };
}

/**
 * Schema de Serviço Técnico
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.serviceType,
    name: service.name,
    description: service.description,
    url: `${SITE_URL}${service.path}`,
    provider: {
      '@type': 'GeneralContractor',
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS_NAME
    },
    areaServed: [
      { '@type': 'City', name: 'Cajamar' },
      { '@type': 'City', name: 'Santana de Parnaíba' },
      { '@type': 'City', name: 'Barueri' },
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'AdministrativeArea', name: 'Estado de São Paulo' }
    ],
    category: 'Engenharia e Construção Civil'
  };
}

/**
 * Schema de Perguntas Frequentes (FAQPage)
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
