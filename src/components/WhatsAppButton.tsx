import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, MessageCircle, Mail, MapPin } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (text: string, type: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div 
      ref={menuRef} 
      className="fixed bottom-6 right-6 z-50 group" 
    >
      
      {/* Pop-up Menu Wrapper - pb-4 cria uma "ponte" invisível para o mouse não perder o hover no gap */}
      <div 
        className={`absolute bottom-full right-0 pb-4 w-72 transition-all duration-300 origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
        }`}
      >
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden flex flex-col">
          <div className="bg-[#1B2639] px-5 py-4 text-white">
            <h4 className="text-sm font-extrabold tracking-wide uppercase">Canais de Contato</h4>
            <p className="text-xs text-slate-300 mt-0.5">Selecione para falar ou copie o dado</p>
          </div>
          
          <div className="p-2 space-y-1 bg-white">
            
            {/* WhatsApp (Clica e Abre / Copia) */}
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <a href="https://wa.me/5511966454023" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1 group/item">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1B2639]">WhatsApp</div>
                  <div className="text-[11px] text-slate-500">(11) 96645-4023</div>
                </div>
              </a>
              <button
                onClick={(e) => handleCopy('(11) 96645-4023', 'whatsapp', e)}
                className="p-2 text-slate-400 hover:text-[#1B2639] hover:bg-slate-200 rounded-md transition-colors ml-2"
                title="Copiar WhatsApp"
              >
                {copied === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* E-mail (Somente Copia, não abre href) */}
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div 
                onClick={(e) => handleCopy('contato@mchengenharia.com.br', 'email', e)}
                className="flex items-center gap-3 flex-1 group/item cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1B2639]">E-mail Corporativo</div>
                  <div className="text-[11px] text-slate-500 truncate w-[130px]" title="Clique para copiar">contato@mchengenharia.com.br</div>
                </div>
              </div>
              <button
                onClick={(e) => handleCopy('contato@mchengenharia.com.br', 'email', e)}
                className="p-2 text-slate-400 hover:text-[#1B2639] hover:bg-slate-200 rounded-md transition-colors ml-2"
                title="Copiar E-mail"
              >
                {copied === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Endereço (Clica e Abre Mapa / Copia) */}
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <a 
                href="https://maps.google.com/?q=Av.+dos+Ipês,+155+-+Portal+dos+Ipês,+Cajamar+-+SP,+07790-840" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 flex-1 group/item"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover/item:bg-slate-600 group-hover/item:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1B2639]">Sede Operacional</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 w-[130px]" title="Av. dos Ipês, 155 - Cajamar, SP">Cajamar - SP</div>
                </div>
              </a>
              <button
                onClick={(e) => handleCopy('Av. dos Ipês, 155 - 2º Andar - Portal dos Ipês, Cajamar - SP, 07790-840', 'endereco', e)}
                className="p-2 text-slate-400 hover:text-[#1B2639] hover:bg-slate-200 rounded-md transition-colors ml-2"
                title="Copiar Endereço Completo"
              >
                {copied === 'endereco' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Button (Toggles Menu on Click for Mobile, also works with Hover on Desktop) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-white text-[#1B2639] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-110 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 border border-slate-100 relative"
        aria-label="Atendimento"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </button>
    </div>
  );
};
