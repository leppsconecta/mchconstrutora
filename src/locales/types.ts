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
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  teamTag: string;
  teamTitle: string;
  teamSubtitle: string;
  team1Title: string;
  team1Desc: string;
  team2Title: string;
  team2Desc: string;
  team3Title: string;
  team3Desc: string;
  team4Title: string;
  team4Desc: string;
  execTag: string;
  execTitle: string;
  execSubtitle: string;
  exec1Title: string;
  exec1Desc: string;
  exec2Title: string;
  exec2Desc: string;
  exec3Title: string;
  exec3Desc: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export interface ConstrutoraTranslations {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  section1Title: string;
  section1Desc: string;
  bullet1Title: string;
  bullet1Desc: string;
  bullet2Title: string;
  bullet2Desc: string;
  bullet3Title: string;
  bullet3Desc: string;
  section1Cta: string;
  processTag: string;
  processTitle: string;
  processSubtitle: string;
  stepWord: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export interface ReformasTranslations {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  service4Title: string;
  service4Desc: string;
  processTag: string;
  processTitle: string;
  processSubtitle: string;
  stepWord: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
}

export interface QuemSomosTranslations {
  mainTitle: string;
  introP1: string;
  introP2: string;
  areasTitle: string;
  areasTelecomTitle: string;
  areasTelecomDesc: string;
  areasConstrutoraTitle: string;
  areasConstrutoraDesc: string;
  areasImobiliariaTitle: string;
  areasImobiliariaDesc: string;
  val1Title: string;
  val1Desc: string;
  val2Title: string;
  val2Desc: string;
  val3Title: string;
  val3Desc: string;
  presenceTitle: string;
  presenceDesc: string;
  presenceCta: string;
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
