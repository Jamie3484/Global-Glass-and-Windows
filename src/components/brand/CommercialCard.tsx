import React from 'react';
import { Eye, Shield, Award, Wrench, Sparkles } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CommercialCardProps {
  categories: ProductCategory[];
  onSelectCategory?: (slug: string) => void;
}

export const CommercialCard: React.FC<CommercialCardProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl border-4 border-[#340648] overflow-hidden">
      {/* Header Banner - White & Lime Gradient with 3D Headline */}
      <div className="bg-gradient-to-r from-slate-900 via-[#340648] to-slate-900 p-6 md:p-8 text-center relative overflow-hidden border-b-4 border-[#B6D232]">
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Mark + Title */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-white font-black text-3xl sm:text-4xl md:text-5xl tracking-wider drop-shadow-md">
              GL<span className="text-[#B6D232]">O</span>BAL
            </span>
          </div>
          <span className="text-[#B6D232] font-black text-sm sm:text-lg md:text-xl tracking-[0.25em] uppercase drop-shadow mt-1">
            GLASS AND WINDOWS
          </span>
        </div>
      </div>

      {/* 7 Products Horizontal Grid imitating the official flyer */}
      <div className="p-6 md:p-8 bg-slate-50">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              onClick={() => onSelectCategory?.(cat.slug)}
              className="bg-white p-3 rounded-2xl border-2 border-slate-200 hover:border-[#340648] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group hover:-translate-y-1"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 overflow-hidden mb-2 border border-slate-200 flex items-center justify-center p-1 group-hover:border-[#B6D232]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-[#340648] font-extrabold text-[11px] sm:text-xs leading-tight tracking-tight uppercase group-hover:text-[#51106e]">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* Slogan Pill with Eye Icon */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#230331] via-[#340648] to-[#230331] text-white px-6 sm:px-8 py-3 rounded-full shadow-xl border-2 border-[#B6D232]">
            <span className="font-serif italic font-extrabold text-sm sm:text-lg md:text-xl tracking-wide text-center">
              Changer de <span className="text-[#B6D232]">vue</span> et de <span className="text-[#B6D232]">vie</span> en un clin d'œil !
            </span>
            <div className="w-8 h-8 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center flex-shrink-0 shadow">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Purple Ribbon with 4 Core Commitments */}
      <div className="bg-[#340648] text-white py-3 px-4 text-center border-t-2 border-[#B6D232]">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase">
          <span className="flex items-center gap-1.5 text-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6D232]" />
            Fabrication sur mesure
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6D232]" />
            Vente de matériaux
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6D232]" />
            Conseils d'experts
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-[#B6D232]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6D232]" />
            Qualité & Durabilité
          </span>
        </div>
      </div>
    </div>
  );
};
