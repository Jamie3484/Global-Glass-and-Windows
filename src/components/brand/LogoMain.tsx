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
      <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-[#340648] shadow-sm flex-shrink-0 bg-white">
          <img
            src="/assets/logo_global_glass.jpg"
            alt="Logo GLOBAL GLASS AND WINDOWS"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
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
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0 bg-white">
          <img
            src="/assets/logo_global_glass.jpg"
            alt="Logo GLOBAL GLASS AND WINDOWS"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
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

  // Full Header Logo with official circular logo
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center w-11 h-11 md:w-13 md:h-13 rounded-full overflow-hidden border-2 border-[#340648] shadow-md flex-shrink-0 transition-transform group-hover:scale-105 bg-white">
        <img
          src="/assets/logo_global_glass.jpg"
          alt="Logo Officiel GLOBAL GLASS AND WINDOWS"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center">
          <span className="text-[#340648] font-black text-xl md:text-2xl tracking-wider leading-none">
            GLOBAL
          </span>
        </div>
        <span className="text-[#340648] font-extrabold text-[11px] md:text-xs tracking-[0.18em] uppercase leading-tight mt-0.5">
          GLASS AND WINDOWS
        </span>
        {showTagline && (
          <span className="text-[#51106e] text-[10px] font-medium tracking-wide mt-0.5 hidden sm:inline-block">
            Borne Soldat, Petit-Goâve, Haïti • (509) 4467-5506
          </span>
        )}
      </div>
    </div>
  );
};

