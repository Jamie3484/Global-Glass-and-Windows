import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { CompanySettings } from '../../types';

interface FloatingWhatsAppProps {
  settings: CompanySettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2">
      {/* Floating Tooltip */}
      {showTooltip && (
        <div className="bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-200 text-xs font-semibold max-w-[220px] flex items-center justify-between gap-2 animate-bounce">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Besoin d'un devis rapide ? Discutez sur WhatsApp !</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pulsing Action Button */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white"
        aria-label="Contacter sur WhatsApp"
        title="Discuter sur WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-70 animate-ping" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
};
