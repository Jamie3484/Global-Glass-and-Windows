import React from 'react';

interface LogoBadgeProps {
  className?: string;
  onClick?: () => void;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[420px] aspect-square rounded-full bg-white p-1.5 shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden select-none cursor-pointer group ${className}`}
      title="GLOBAL GLASS AND WINDOWS - Logo Officiel"
    >
      <img
        src="/assets/logo_global_glass.jpg"
        alt="GLOBAL GLASS AND WINDOWS - Logo Officiel"
        className="w-full h-full object-contain rounded-full transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

