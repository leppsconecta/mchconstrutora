import React from 'react';
import { Users } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const FuncionariosModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="Funcionários"
      moduleCode="RH-STAFF-06"
      category="Gestão de Pessoas & Equipe"
      description="Quadro de colaboradores, folha de ponto, certificações de segurança NR-35/NR-18 e escalas."
      icon={Users}
    />
  );
};

export default FuncionariosModule;
