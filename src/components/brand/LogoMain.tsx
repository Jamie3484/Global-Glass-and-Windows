import React from 'react';

interface LogoMainProps {
  variant?: 'full' | 'compact' | 'white' | 'banner';
  className?: string;
  showTagline?: boolean;
}

export const LogoMain: React.FC<LogoMainProps> = ({
  variant = 'full',
  className = 'h-12',
  showTagline = false
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 font-bold tracking-tight select-none ${className}`}>
        {/* Stylized Globe Icon */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#B6D232] border-2 border-[#340648] shadow-sm flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#340648]">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
            <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="5" />
            <line x1="12" y1="28" x2="88" y2="28" stroke="currentColor" strokeWidth="4" />
            <line x1="12" y1="72" x2="88" y2="72" stroke="currentColor" strokeWidth="4" />
            <rect x="36" y="36" width="28" height="28" fill="#B6D232" stroke="currentColor" strokeWidth="4" rx="2" />
            <line x1="50" y1="36" x2="50" y2="64" stroke="currentColor" strokeWidth="3" />
            <line x1="36" y1="50" x2="64" y2="50" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[#340648] font-black text-lg tracking-wider">GLOBAL</span>
          <span className="text-[#340648] font-bold text-[10px] tracking-widest uppercase -mt-0.5">GLASS & WINDOWS</span>
        </div>
      </div>
    );
  }

  if (variant === 'white') {
    return (
      <div className={`flex items-center gap-3 font-bold select-none ${className}`}>
        <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#B6D232] border-2 border-white shadow flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#340648]">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
            <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="5" />
            <rect x="35" y="35" width="30" height="30" fill="#B6D232" stroke="currentColor" strokeWidth="4" rx="3" />
            <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" strokeWidth="3" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-white font-black text-xl tracking-wider leading-none">GLOBAL</span>
          <span className="text-[#B6D232] font-extrabold text-xs tracking-widest uppercase mt-0.5">GLASS AND WINDOWS</span>
          {showTagline && (
            <span className="text-slate-300 text-[10px] tracking-wide mt-1 italic font-normal">
              Changer de vue et de vie en un clin d'œil !
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Header Logo reproducing the official Logo nouveau typography and globe
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Visual Logo mark */}
      <div className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#B6D232] to-[#9ebb24] border-2 border-[#340648] shadow-md p-1.5 flex-shrink-0 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#340648] filter drop-shadow">
          {/* Globe Outline */}
          <circle cx="50" cy="50" r="44" fill="#B6D232" stroke="#340648" strokeWidth="6" />
          {/* Meridians */}
          <ellipse cx="50" cy="50" rx="22" ry="44" fill="none" stroke="#340648" strokeWidth="5" />
          <line x1="6" y1="50" x2="94" y2="50" stroke="#340648" strokeWidth="5" />
          <line x1="14" y1="26" x2="86" y2="26" stroke="#340648" strokeWidth="4" />
          <line x1="14" y1="74" x2="86" y2="74" stroke="#340648" strokeWidth="4" />
          {/* Window in the center */}
          <rect x="32" y="32" width="36" height="36" fill="#FFFFFF" stroke="#340648" strokeWidth="5" rx="3" />
          <line x1="50" y1="32" x2="50" y2="68" stroke="#340648" strokeWidth="4" />
          <line x1="32" y1="50" x2="68" y2="50" stroke="#340648" strokeWidth="4" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center">
          <span className="text-[#340648] font-black text-xl md:text-2xl tracking-wider leading-none">
            GL<span className="text-[#9ebb24] inline-block font-serif font-black">O</span>BAL
          </span>
        </div>
        <span className="text-[#340648] font-extrabold text-[11px] md:text-xs tracking-[0.2em] uppercase leading-tight mt-0.5">
          GLASS AND WINDOWS
        </span>
        {showTagline && (
          <span className="text-[#51106e] text-[10px] font-medium tracking-wide mt-0.5 hidden sm:inline-block">
            Petit-Goâve, Haïti • (509) 4467-5506
          </span>
        )}
      </div>
    </div>
  );
};
