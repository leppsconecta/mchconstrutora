import React from 'react';
import { Users2 } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const CrmLeadsModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="CRM | Leads"
      moduleCode="CRM-LEADS-02"
      category="Comercial & Imobiliária"
      description="Funil de vendas de imóveis, captação de clientes, contatos de WhatsApp e histórico de negociações."
      icon={Users2}
    />
  );
};

export default CrmLeadsModule;
