import React from 'react';
import { motion } from 'framer-motion';

interface ModuleOfflinePlaceholderProps {
  moduleName?: string;
  moduleCode?: string;
  category?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const ModuleOfflinePlaceholder: React.FC<ModuleOfflinePlaceholderProps> = () => {
  return (
    <div className="w-full flex-1 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex-1 min-h-[520px] rounded-2xl bg-gradient-to-b from-[#131C2D]/60 to-[#0D1420]/60 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/5 rounded-full blur-[130px] pointer-events-none" />
      </motion.div>
    </div>
  );
};
