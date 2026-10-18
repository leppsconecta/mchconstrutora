export type Language = 'pt' | 'en' | 'es';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  shortName: string;
}

export interface NavTranslations {
  home: string;
  telecom: string;
  reformas: string;
  construtora: string;
  cases: string;
  quemSomos: string;
  contato: string;
  openMenu: string;
  closeMenu: string;
}

export interface FooterTranslations {
  brandBio: string;
  creaActive: string;
  nrStandards: string;
  navTitle: string;
  locationTitle: string;
  officeAddress: string;
  officeCity: string;
  phoneLabel: string;
  emailLabel: string;
  rightsReserved: string;
  locationFootnote: string;
}

export interface WhatsAppTranslations {
  channelsTitle: string;
  channelsSubtitle: string;
  talkOrCopy: string;
  openChat: string;
  copied: string;
  copyLabel: string;
}

export interface HomeTranslations {
  heroTitle: string;
  heroSubtitle: string;
  pillarsTag: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar1Link: string;
  pillar2Badge: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar2Link: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar3Link: string;
  historyTag: string;
  historyTitle: string;
  historyDesc: string;
  historyCard1Title: string;
  historyCard1Desc: string;
  historyCard2Title: string;
  historyCard2Desc: string;
  historyCard3Title: string;
  historyCard3Desc: string;
  marqueeTag: string;
  marqueeTitle: string;
}

export interface CasesTranslations {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  filterAll: string;
  filterTelecom: string;
  filterCivil: string;
  filterReformas: string;
  viewDetails: string;
  modalClose: string;
  highlightsTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  deliveredOnTime: string;
  projects: Array<{
    id: number;
    title: string;
    category: string;
    location: string;
    timeframe: string;
    image: string;
    description: string;
    highlights: string[];
  }>;
}

export interface TelecomTranslations {
  tag: string;
  title: string;
  subtitle: string;
  ctaButton: string;
  teamTag: string;
  teamTitle: string;
  teamDesc: string;
}

export interface ConstrutoraTranslations {
  tag: string;
  title: string;
  subtitle: string;
  ctaButton: string;
}

export interface ReformasTranslations {
  tag: string;
  title: string;
  subtitle: string;
  ctaButton: string;
}

export interface QuemSomosTranslations {
  tag: string;
  title: string;
  introP1: string;
  introP2: string;
  areasTitle: string;
  areasTelecomTitle: string;
  areasTelecomDesc: string;
  areasConstrutoraTitle: string;
  areasConstrutoraDesc: string;
}

export interface ContatoTranslations {
  tag: string;
  title: string;
  subtitle: string;
  headquarters: string;
  addressLine1: string;
  addressLine2: string;
  formTitle: string;
  formSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  subjectLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  submittingButton: string;
  successMessage: string;
  subjectOptions: string[];
}

export interface CommonTranslations {
  talkToEngineering: string;
  requestProposal: string;
  seeMore: string;
  backToHome: string;
  loading: string;
  languageSelect: string;
}

export interface Translations {
  common: CommonTranslations;
  nav: NavTranslations;
  footer: FooterTranslations;
  whatsapp: WhatsAppTranslations;
  home: HomeTranslations;
  cases: CasesTranslations;
  telecom: TelecomTranslations;
  construtora: ConstrutoraTranslations;
  reformas: ReformasTranslations;
  quemSomos: QuemSomosTranslations;
  contato: ContatoTranslations;
}
