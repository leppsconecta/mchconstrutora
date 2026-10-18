import { Translations } from './types';

export const en: Translations = {
  common: {
    talkToEngineering: 'Talk to Engineering',
    requestProposal: 'Request a Proposal',
    seeMore: 'See More',
    backToHome: 'Back to Home',
    loading: 'Loading...',
    languageSelect: 'Select language'
  },
  nav: {
    home: 'Home',
    telecom: 'Telecommunications',
    reformas: 'Renovations',
    construtora: 'Construction',
    cases: 'Cases',
    quemSomos: 'About Us',
    contato: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  },
  footer: {
    brandBio: 'We deliver solid foundations and cutting-edge infrastructure. Technical excellence in civil engineering, telecommunications tower foundations, and corporate B2B renovations.',
    creaActive: 'Active CREA-SP Technical Registration',
    nrStandards: 'Compliance with NR-18 and NR-35 Safety Standards',
    navTitle: 'Navigation',
    locationTitle: 'Location & Contact',
    officeAddress: 'Av. dos Ipês, 155 - 2nd Floor',
    officeCity: 'Portal dos Ipês, Cajamar - SP, 07790-840 - Brazil',
    phoneLabel: '+55 (11) 96645-4023',
    emailLabel: 'contato@mchengenharia.com.br',
    rightsReserved: 'All rights reserved.',
    locationFootnote: 'Cajamar · São Paulo · Brazil'
  },
  whatsapp: {
    channelsTitle: 'Contact Channels',
    channelsSubtitle: 'Select to connect or copy details',
    talkOrCopy: 'Chat on WhatsApp',
    openChat: 'Start conversation on WhatsApp',
    copied: 'Copied to clipboard!',
    copyLabel: 'Copy'
  },
  home: {
    heroTitle: 'Building value, transforming spaces, and delivering solid results.',
    heroSubtitle: 'Development and construction of proprietary residential properties, corporate renovations, critical telecommunications infrastructure, specialized waterproofing, and solutions that combine engineering precision, efficiency, and lasting impact.',
    pillarsTag: 'Areas of Expertise',
    pillarsTitle: 'The Three Pillars of Machado',
    pillarsSubtitle: 'Specialized solutions for complex civil demands, critical telecom infrastructure, and corporate facilities.',
    pillar1Title: 'Civil Construction & Development',
    pillar1Desc: 'We execute high-standard residential and commercial projects, from land acquisition to final handover. Our full in-house team (masons, carpenters, electricians) manages the entire civil construction lifecycle.',
    pillar1Link: 'Discover Construction',
    pillar2Badge: 'Specialist Pillar',
    pillar2Title: 'Telecommunications Infrastructure',
    pillar2Desc: 'Benchmark in civil infrastructure and reinforced foundations supporting telecom towers. We perform site deployments, structural reinforcement, electrical networks, fencing, and high-performance waterproofing.',
    pillar2Link: 'View Telecommunications',
    pillar3Title: 'Building Renovations (B2B)',
    pillar3Desc: 'Exclusive corporate solutions. We perform comprehensive structural adaptations for offices and industrial logistics warehouses, covering civil, electrical, plumbing, mechanical, and automation systems.',
    pillar3Link: 'Discover Renovations',
    historyTag: 'History & Solidity',
    historyTitle: '+ 10 Years of Experience',
    historyDesc: 'We have consolidated our operations by combining the strategic vision of real estate development with high-standard technical execution and corporate renovations. A decade of proven results.',
    historyCard1Title: 'Construction',
    historyCard1Desc: 'Management and execution of civil works, premium residences, and complex infrastructure from structural engineering to turnkey finishings.',
    historyCard2Title: 'Telecommunications',
    historyCard2Desc: 'Telecom site deployments, structural reinforcements, decommissioning, specialized waterproofing, and preventative maintenance.',
    historyCard3Title: 'Renovations',
    historyCard3Desc: 'Commercial building retrofits and comprehensive B2B adaptations, covering civil, hydraulic, electrical, and specialized finishes.',
    marqueeTag: 'Strategic Partners',
    marqueeTitle: 'Companies that trust our engineering'
  },
  cases: {
    heroTag: 'Engineering Portfolio',
    heroTitle: 'High-Complexity Works and Proven Results',
    heroSubtitle: 'Discover our leading cases in telecom infrastructure, high-end civil construction, and corporate retrofits.',
    filterAll: 'All Projects',
    filterTelecom: 'Telecommunications',
    filterCivil: 'Civil Construction',
    filterReformas: 'Building Renovations',
    viewDetails: 'View Project Details',
    modalClose: 'Close',
    highlightsTitle: 'Technical Highlights & Compliance',
    ctaTitle: 'Do you have a project with critical deadlines or technical challenges?',
    ctaSubtitle: 'Our engineers are ready to analyze your project and deliver the most secure, efficient, and cost-effective engineering solution.',
    ctaButton: 'Request Technical Study',
    deliveredOnTime: '100% on schedule',
    projects: [
      {
        id: 1,
        title: 'Civil Foundation Deployment for 5G/6G Telecom Tower',
        category: 'Telecommunications',
        location: 'São Paulo Metropolitan Region',
        timeframe: 'Delivered in 35 days (100% on schedule)',
        image: '/hero-bg.jpg',
        description: 'Execution of a heavy-duty continuous foundation designed to support a 42-meter self-supporting steel tower, absorbing dynamic wind loads up to 180 km/h with zero structural settlement.',
        highlights: [
          'Foundation block with 48m³ of ready-mix concrete FCK 35MPa',
          'Deep grounding network (SPDA) with resistance below 4 Ohms',
          'Full technical certification (ART) complying with Telebrás and ABNT standards'
        ]
      },
      {
        id: 2,
        title: 'High-End Turnkey Residential Construction - Caliandras 2',
        category: 'Civil Construction',
        location: 'Portal dos Ipês, Cajamar - SP',
        timeframe: 'Turnkey Handover',
        image: '/casa-alto-padrao.jpg',
        description: 'Luxury turnkey residence built from soil testing to final key handover, featuring noble finishes, black thermal-acoustic aluminum frames, and curated interior spaces.',
        highlights: [
          'Reinforced concrete structure with clear spans and double-height ceiling',
          'Premium thermal-acoustic frames and large-format porcelain tiles',
          'Full legal occupancy certificate and registered title deeds'
        ]
      },
      {
        id: 3,
        title: 'Structural Adaptation and Logistics Warehouse Retrofit (4,200 m²)',
        category: 'Building Renovations',
        location: 'Cajamar Logistics Hub - SP',
        timeframe: 'Delivered in 60 days without operational stoppage',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        description: 'Comprehensive technical renovation in a corporate logistics facility, including heavy-traffic epoxy flooring restoration, medium-voltage electrical overhaul, and industrial loading dock upgrades.',
        highlights: [
          'Flooring with dynamic load capacity of 6 metric tons per m²',
          'Full compliance with NR-10 (electrical) and NR-18 (construction) safety norms',
          'Rapid inspection and fire department AVCB certification'
        ]
      },
      {
        id: 4,
        title: 'Structural Reinforcement & Rooftop Telecom Tower Installation',
        category: 'Telecommunications',
        location: 'Paulista Avenue, São Paulo - SP',
        timeframe: '20 days under technical window schedule',
        image: '/imagem_torre.png',
        description: 'Installation of mast and antennas on a high-rise rooftop slab featuring distributed steel beam reinforcement, tested chemical anchors, and multi-layer waterproofing with 72h water tightness testing.',
        highlights: [
          'Crane hoisting with certified rigging plan approved by municipal transit authority',
          'Asphalt membrane waterproofing with rigorous 72h water testing',
          'Zero disruption to corporate condominium daily operations'
        ]
      },
      {
        id: 5,
        title: 'Corporate Building & Comprehensive Engineering',
        category: 'Civil Construction',
        location: 'Greater São Paulo Hub',
        timeframe: 'Completed with full normative rigor',
        image: '/quem-somos-projetos.jpg',
        description: 'Full-cycle civil management from structural calculation to final commercial finishes using dedicated in-house personnel and state-of-the-art engineering methods.',
        highlights: [
          'Geological soil survey and detailed structural calculations',
          'Top-tier materials certified under PBQP-H quality standards',
          'Specialized internal team equipped with life insurance and strict PPE protocol'
        ]
      }
    ]
  },
  telecom: {
    tag: 'Infrastructure & Telecommunications',
    title: 'Telecom Infrastructure',
    subtitle: 'The construction power that executes deep foundations, heavy slabs, and structural adaptations that support communications towers with maximum safety across Brazil.',
    ctaButton: 'Talk to Engineering',
    teamTag: 'Who makes it happen in the field',
    teamTitle: 'In-House Specialized Workforce',
    teamDesc: 'Your entire network foundation built by seasoned professionals. We deploy dedicated civil teams directly on the frontline to ensure flawless foundations and lasting structural integrity for your towers.'
  },
  construtora: {
    tag: 'Civil Construction & Turnkey',
    title: 'Constructive Excellence from Foundation to Keys',
    subtitle: 'End-to-end management and turnkey execution for high-standard residential and corporate projects.',
    ctaButton: 'Start My Project'
  },
  reformas: {
    tag: 'B2B Building & Corporate Renovations',
    title: 'Transforming Environments with Precision Engineering',
    subtitle: 'Full architectural and technical retrofits for enterprises, condominiums, and industrial warehouses with rigorous schedules.',
    ctaButton: 'Schedule Technical Visit'
  },
  quemSomos: {
    tag: 'Our History & Constructive DNA',
    title: 'Serious engineering is not just done in offices; it is built on site.',
    introP1: 'MCH was founded on the conviction that the civil construction and critical infrastructure market was hindered by unregulated outsourcing and a lack of authentic on-site technical supervision.',
    introP2: 'We structured our operations with certified, in-house crews (masons, carpenters, electricians, and operators) directly supervised by engineers with active CREA-SP accreditation. This eliminates communication gaps and ensures structural calculations are executed flawlessly on the ground.',
    areasTitle: 'Our Main Areas of Operation',
    areasTelecomTitle: 'Telecom Infrastructure (Towers)',
    areasTelecomDesc: 'Civil foundations, structural adaptations, and civil construction for 3G/4G/5G mobile antenna sites.',
    areasConstrutoraTitle: 'Civil Construction',
    areasConstrutoraDesc: 'Heavy civil works, B2B corporate retrofits, and complete structural development from foundation to completion.'
  },
  contato: {
    tag: 'Official Channels',
    title: 'We are ready to handle your technical requirements.',
    subtitle: 'Our engineers are experienced in meeting critical deadlines and stringent compliance demands from major telecom operators, corporations, and investors.',
    headquarters: 'Operational Headquarters',
    addressLine1: 'Av. dos Ipês, 155 - 2nd Floor',
    addressLine2: 'Portal dos Ipês, Cajamar - SP, 07790-840 - Brazil',
    formTitle: 'Technical Proposal Request',
    formSubtitle: 'Fill in the fields below and our engineering team will respond within 24 business hours.',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your name or contact person',
    companyLabel: 'Company',
    companyPlaceholder: 'Your company name',
    emailLabel: 'Corporate Email',
    emailPlaceholder: 'your.name@company.com',
    phoneLabel: 'Phone / WhatsApp',
    phonePlaceholder: '+55 (11) 99999-9999',
    subjectLabel: 'Area of Interest',
    messageLabel: 'Project Details',
    messagePlaceholder: 'Briefly describe scope, site location, and estimated timeline...',
    submitButton: 'Send Message to Engineering',
    submittingButton: 'Sending proposal...',
    successMessage: 'Message sent successfully! Our engineering team will be in touch shortly.',
    subjectOptions: [
      'Civil Construction & Development',
      'Telecommunications Infrastructure',
      'Corporate Building Renovations (B2B)',
      'Other Inquiries'
    ]
  }
};
