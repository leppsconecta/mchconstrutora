import React from 'react';
import { Wallet } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const FinanceiroModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="Financeiro"
      moduleCode="FIN-ACC-04"
      category="Contabilidade & Fluxo de Caixa"
      description="Controle de contas a pagar, recebimentos de parcelas imobiliárias, conciliação bancária e DRE."
      icon={Wallet}
    />
  );
};

export default FinanceiroModule;
