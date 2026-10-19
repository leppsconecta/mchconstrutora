import { Funcionario, CargoItem, EmpresaItem } from './types';

export const STORAGE_KEY_FUNCIONARIOS = 'mch_funcionarios_list';
export const STORAGE_KEY_CARGOS = 'mch_funcionarios_cargos';
export const STORAGE_KEY_CONFIG = 'mch_funcionarios_config';

export const INITIAL_EMPRESAS: EmpresaItem[] = [
  { id: 'emp-1', nome: 'MCH Engenharia & Construção' },
  { id: 'emp-2', nome: 'MCH Imobiliária' },
  { id: 'emp-3', nome: 'Machado Incorporações' },
  { id: 'emp-4', nome: 'Administrativo / Matriz' }
];

export const INITIAL_CARGOS: CargoItem[] = [
  { id: 'role-1', nome: 'Engenheiro(a) Civil' },
  { id: 'role-2', nome: 'Mestre de Obras' },
  { id: 'role-3', nome: 'Arquiteto(a) Urbanista' },
  { id: 'role-4', nome: 'Corretor(a) de Imóveis' },
  { id: 'role-5', nome: 'Técnico(a) em Edificações' },
  { id: 'role-6', nome: 'Assistente Administrativo' },
  { id: 'role-7', nome: 'Encarregado de Obras' },
  { id: 'role-8', nome: 'Eletricista Predial' }
];

export const INITIAL_FUNCIONARIOS: Funcionario[] = [
  {
    id: 'func-1',
    name: 'Roberto Camargo Neves',
    role: 'Engenheiro(a) Civil',
    empresa_id: 'emp-1',
    type: 'CLT',
    admission_date: '2023-04-10',
    status: 'Ativo',
    phone: '31998761234',
    emergency_phone: '31988776655',
    email: 'roberto.engenharia@mch.com.br',
    gender: 'Masculino',
    birth_date: '1988-06-15',
    bank_account_name: 'Roberto Camargo Neves',
    bank_name: 'Banco Itaú',
    bank_key_type: 'CPF',
    bank_key: '087.654.321-99',
    document_type: 'RG',
    document: 'MG-14.890.123',
    cep: '35500-001',
    street: 'Rua Minas Gerais',
    number: '550',
    neighborhood: 'Centro',
    city: 'Divinópolis',
    state: 'MG',
    observations: 'Responsável técnico pelas obras residenciais do condomínio Solar.',
    formacoesCursos: [
      {
        id: 'fc-1',
        tipo: 'Graduação / Bacharelado',
        nomeCurso: 'Engenharia Civil',
        instituicao: 'Universidade Federal de Minas Gerais (UFMG)',
        anoConclusao: '2012',
        status: 'Concluído'
      },
      {
        id: 'fc-2',
        tipo: 'Pós-graduação / MBA',
        nomeCurso: 'Gestão de Projetos e Obras',
        instituicao: 'Fundação Getulio Vargas (FGV)',
        anoConclusao: '2016',
        status: 'Concluído'
      }
    ],
    conhecimentosVida: [
      'Cálculo e dimensionamento estrutural',
      'Leitura e compatibilização de projetos BIM',
      'Negociação com fornecedores de agregados e concreto'
    ]
  },
  {
    id: 'func-2',
    name: 'Patrícia Soares Silveira',
    role: 'Arquiteto(a) Urbanista',
    empresa_id: 'emp-3',
    type: 'Jurídico',
    admission_date: '2024-01-15',
    status: 'Ativo',
    phone: '31987659876',
    emergency_phone: '31977665544',
    email: 'patricia.arquitetura@mch.com.br',
    gender: 'Feminino',
    birth_date: '1993-11-20',
    bank_account_name: 'Patrícia Soares Arquitetura LTDA',
    bank_name: 'Nubank',
    bank_key_type: 'CNPJ',
    bank_key: '44.987.654/0001-22',
    document_type: 'CNH',
    document: '98765432100',
    cep: '35500-120',
    street: 'Av. Antônio Olímpio de Morais',
    number: '910',
    complement: 'Sala 304',
    neighborhood: 'Santa Clara',
    city: 'Divinópolis',
    state: 'MG',
    observations: 'Coordena o setor de projetos conceituais e maquetes 3D.',
    formacoesCursos: [
      {
        id: 'fc-3',
        tipo: 'Graduação / Bacharelado',
        nomeCurso: 'Arquitetura e Urbanismo',
        instituicao: 'PUC Minas',
        anoConclusao: '2017',
        status: 'Concluído'
      }
    ],
    conhecimentosVida: [
      'Modelagem e renderização fotorrealista (Revit + Lumion)',
      'Design biofílico e iluminação natural em residências',
      'Experiência em interiores e escolha de materiais de acabamento'
    ]
  },
  {
    id: 'func-3',
    name: 'José Geraldo Rezende',
    role: 'Mestre de Obras',
    empresa_id: 'emp-1',
    type: 'CLT',
    admission_date: '2022-08-01',
    status: 'Ativo',
    phone: '31991238877',
    email: 'jose.obras@mch.com.br',
    gender: 'Masculino',
    birth_date: '1979-03-25',
    bank_account_name: 'José Geraldo Rezende',
    bank_name: 'Bradesco',
    bank_key_type: 'Telefone',
    bank_key: '31991238877',
    document_type: 'RG',
    document: 'MG-11.234.567',
    cep: '35501-050',
    street: 'Rua Paraíba',
    number: '230',
    neighborhood: 'Sidil',
    city: 'Divinópolis',
    state: 'MG',
    observations: 'Mais de 15 anos de liderança em canteiro de obras e fundações.',
    formacoesCursos: [
      {
        id: 'fc-4',
        tipo: 'Curso Técnico',
        nomeCurso: 'Técnico em Edificações',
        instituicao: 'SENAI',
        anoConclusao: '2005',
        status: 'Concluído'
      },
      {
        id: 'fc-5',
        tipo: 'Certificação / NR',
        nomeCurso: 'NR-35 (Trabalho em Altura) e NR-18 (Construção Civil)',
        anoConclusao: '2023',
        status: 'Concluído'
      }
    ],
    conhecimentosVida: [
      'Mais de 25 anos de vivência prática em canteiro de obras',
      'Noção apurada de nivelamento de terreno e armação de ferragens',
      'Leitura de plantas no canteiro e liderança de equipes de pedreiros'
    ]
  },
  {
    id: 'func-4',
    name: 'Larissa Andrade Bastos',
    role: 'Corretor(a) de Imóveis',
    empresa_id: 'emp-2',
    type: 'Freelance',
    admission_date: '2024-05-10',
    status: 'Ativo',
    phone: '31993457711',
    email: 'larissa.imoveis@mch.com.br',
    gender: 'Feminino',
    birth_date: '1996-08-14',
    bank_account_name: 'Larissa A Bastos',
    bank_name: 'Banco Inter',
    bank_key_type: 'E-mail',
    bank_key: 'larissa.imoveis@mch.com.br',
    document_type: 'RG',
    document: 'MG-18.345.901',
    cep: '35500-230',
    street: 'Rua São Paulo',
    number: '412',
    neighborhood: 'Centro',
    city: 'Divinópolis',
    state: 'MG',
    observations: 'CRECI ativo. Especialista em imóveis corporativos e loteamentos.',
    formacoesCursos: [
      {
        id: 'fc-6',
        tipo: 'Tecnólogo',
        nomeCurso: 'Gestão de Negócios Imobiliários',
        instituicao: 'Estácio',
        anoConclusao: '2020',
        status: 'Concluído'
      }
    ],
    conhecimentosVida: [
      'Atendimento de alto padrão e negociação com investidores',
      'Noções práticas de avaliação mercadológica e zoneamento urbano'
    ]
  }
];
