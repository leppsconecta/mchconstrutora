export type TipoContrato = 'CLT' | 'Estágio' | 'Menor Aprendiz' | 'Jurídico' | 'Freelance';
export type StatusFuncionario = 'Ativo' | 'Em Férias' | 'Afastado' | 'Desligado';
export type Genero = 'Masculino' | 'Feminino' | 'Outro';
export type TipoDocumento = 'RG' | 'CNH' | 'Passaporte';
export type TipoChavePix = 'CPF' | 'CNPJ' | 'E-mail' | 'Telefone' | 'Chave Aleatória';

export interface Endereco {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Funcionario {
  id: string;
  name: string;
  role: string;
  empresa_id: string;
  type: TipoContrato;
  admission_date: string;
  status: StatusFuncionario;
  phone: string;
  emergency_phone?: string;
  email?: string;
  gender: Genero;
  birth_date?: string;
  
  // Dados Bancários
  bank_account_name?: string;
  bank_name?: string;
  bank_key_type?: TipoChavePix;
  bank_key?: string;

  // Documentos
  document_type?: TipoDocumento;
  document?: string;
  document_front?: string;
  document_back?: string;

  // Endereço
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;

  // Observações adicionais
  observations?: string;
}

export interface CargoItem {
  id: string;
  nome: string;
}

export interface EmpresaItem {
  id: string;
  nome: string;
}
