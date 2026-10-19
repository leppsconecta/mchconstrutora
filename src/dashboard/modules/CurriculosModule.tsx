import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const CurriculosModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="Currículos"
      moduleCode="RH-CV-05"
      category="Recursos Humanos & Vagas"
      description="Banco de talentos para engenheiros civis, mestres de obras, corretores e equipe administrativa."
      icon={GraduationCap}
    />
  );
};

export default CurriculosModule;
