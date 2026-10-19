import React from 'react';
import { FolderKanban } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const ProjetosModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="Projetos"
      moduleCode="PRJ-MOD-01"
      category="Engenharia & Obras"
      description="Gerenciamento de cronogramas, plantas executivas, orçamentos e relatórios diários de obras."
      icon={FolderKanban}
    />
  );
};

export default ProjetosModule;
