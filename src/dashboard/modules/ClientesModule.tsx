import React from 'react';
import { UserCheck } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const ClientesModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="Clientes"
      moduleCode="CLI-MOD-01"
      category="Gestão & Contratos"
      description="Cadastro de clientes, contratos ativos, histórico de compras e documentações."
      icon={UserCheck}
    />
  );
};

export default ClientesModule;
