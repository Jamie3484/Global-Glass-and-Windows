import React from 'react';
import { Clock, MapPin, Phone, MessageCircle } from 'lucide-react';

interface LogoBadgeProps {
  className?: string;
  onClick?: () => void;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[420px] aspect-square rounded-full bg-gradient-to-br from-[#c4dc3c] via-[#B6D232] to-[#9ebf24] p-5 shadow-2xl border-4 border-white flex flex-col items-center justify-between text-center overflow-hidden select-none ${className}`}
    >
      {/* Top Banner: GLOBAL GLASS AND WINDOWS */}
      <div className="pt-2 flex flex-col items-center">
        <div className="flex items-center gap-1.5 justify-center">
          <span className="text-[#340648] font-black text-2xl md:text-3xl tracking-wider drop-shadow-sm">
            GL
          </span>
          {/* Stylized Globe */}
          <div className="w-8 h-8 rounded-full bg-[#340648] border-2 border-[#B6D232] flex items-center justify-center text-[#B6D232]">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
              <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="7" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="7" />
            </svg>
          </div>
          <span className="text-[#340648] font-black text-2xl md:text-3xl tracking-wider drop-shadow-sm">
            BAL
          </span>
        </div>
        <div className="bg-[#340648] text-white text-xs md:text-sm font-black px-4 py-0.5 rounded-full tracking-[0.2em] shadow mt-0.5">
          GLASS AND WINDOWS
        </div>
      </div>

      {/* Middle Grid: Services Tag + Hours + Window Graphic */}
      <div className="w-full flex items-center justify-between px-3 my-auto">
        {/* Architectural Windows Blueprint Illustration */}
        <div className="w-24 h-24 bg-white/70 backdrop-blur rounded-xl p-2 border border-[#340648]/20 flex flex-col justify-between shadow-inner">
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="border-2 border-[#340648] rounded bg-cyan-100/50"></div>
            <div className="border-2 border-[#340648] rounded bg-cyan-100/50"></div>
            <div className="border-2 border-[#340648] rounded bg-cyan-100/50"></div>
            <div className="border-2 border-[#340648] rounded bg-cyan-100/50"></div>
          </div>
        </div>

        {/* Center info */}
        <div className="flex flex-col items-center flex-1 px-2">
          <div className="bg-[#340648] text-[#B6D232] font-black text-[10px] md:text-xs px-2.5 py-1 rounded shadow text-center uppercase tracking-wide">
            Vente et Fabrication
          </div>
          <div className="text-[#340648] font-bold text-[10px] md:text-[11px] leading-tight mt-1 text-center">
            Vitres • Miroirs • Fenêtres • Portes en Vitres
          </div>

          {/* Hours Clock Badge */}
          <div className="mt-2 flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="text-[#340648] text-[10px] font-extrabold whitespace-nowrap">
              Lun - Sam : 7h30 - 16h00
            </span>
          </div>
        </div>
      </div>

      {/* Address & Phones Footer within the Badge */}
      <div className="w-full bg-[#340648] text-white rounded-2xl py-2 px-3 flex flex-col items-center shadow-lg border border-[#B6D232]/40">
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-200">
          <MapPin className="w-3 h-3 text-[#B6D232]" />
          <span>Rte Nle #2, Borne Soldat, Petit-Goâve</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1 font-black text-[#B6D232] text-xs md:text-sm">
          <div className="flex items-center gap-0.5">
            <Phone className="w-3 h-3 text-white" />
            <span>(509) 4467-5506</span>
          </div>
          <span className="text-white/40">•</span>
          <span>3599-5664</span>
          <span className="text-white/40">•</span>
          <span>2910-1818</span>
        </div>
      </div>
    </div>
  );
};
