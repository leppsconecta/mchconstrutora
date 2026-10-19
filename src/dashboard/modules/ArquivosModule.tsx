import React from 'react';
import { Files } from 'lucide-react';
import { ModuleOfflinePlaceholder } from '../components/ModuleOfflinePlaceholder';

export const ArquivosModule: React.FC = () => {
  return (
    <ModuleOfflinePlaceholder
      moduleName="Arquivos"
      moduleCode="DOC-FILE-03"
      category="Documentação & Contratos"
      description="Armazenamento em nuvem corporativo de alvarás, memoriais descritivos, escrituras e contratos."
      icon={Files}
    />
  );
};

export default ArquivosModule;
