import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  caption?: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  caption,
  onClose
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#B6D232]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="bg-[#340648] text-white px-6 py-4 flex items-center justify-between border-b border-[#B6D232]/30">
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-white">
              {title}
            </h4>
            {caption && <p className="text-xs text-slate-300 mt-0.5">{caption}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full Image */}
        <div className="max-h-[75vh] flex items-center justify-center p-2 bg-black">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
          />
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 text-slate-400 text-xs flex items-center justify-between">
          <span className="font-bold text-[#B6D232]">GLOBAL GLASS AND WINDOWS — Petit-Goâve</span>
          <span>Cliquez à l'extérieur pour fermer</span>
        </div>
      </div>
    </div>
  );
};
