import React from 'react';
import {
  FileText,
  Eye,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import { LogoBadge } from '../brand/LogoBadge';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface HeroSectionProps {
  settings: CompanySettings;
  lang: Language;
  onOpenQuote: () => void;
  onNavigateToProjects: () => void;
  onNavigateToCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  lang,
  onOpenQuote,
  onNavigateToProjects,
  onNavigateToCalculator
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).hero;

  return (
    <section id="accueil" className="relative min-h-[85vh] lg:min-h-[90vh] bg-gradient-to-br from-[#230331] via-[#340648] to-[#1a0225] text-white flex items-center overflow-hidden">
      {/* Background Architectural Patterns & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#B6D232_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#B6D232]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#B6D232]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines, Slogan & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Petit-Goâve Official Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#B6D232]/40 text-[#B6D232] text-xs md:text-sm font-extrabold shadow-sm mb-6">
              <MapPin className="w-4 h-4 text-[#B6D232]" />
              <span>{t.badgeLoc}</span>
            </div>

            {/* Main Brand Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.1] mb-4">
              GLOBAL GLASS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6D232] via-[#d4eb67] to-[#B6D232]">
                AND WINDOWS
              </span>
            </h1>

            {/* Official Slogan Banner with Eye Motif */}
            <div className="inline-flex items-center gap-3 bg-[#B6D232]/20 backdrop-blur-md border-l-4 border-[#B6D232] px-4 py-2.5 rounded-r-2xl mb-6">
              <Eye className="w-5 h-5 text-[#B6D232] flex-shrink-0" />
              <p className="font-serif italic font-extrabold text-base sm:text-xl text-[#B6D232] leading-snug">
                "{settings.tagline || t.tagline}"
              </p>
            </div>

            {/* Subtitle / Value Proposition */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl mb-8">
              {settings.taglineSecondary || t.subtitle}
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black text-sm sm:text-base px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-white/20"
              >
                <FileText className="w-5 h-5 text-[#340648]" />
                <span>{t.ctaQuote}</span>
              </button>

              <button
                onClick={onNavigateToProjects}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-extrabold text-sm sm:text-base px-6 py-4 rounded-2xl border border-white/30 hover:border-[#B6D232] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.ctaProjects}</span>
                <ArrowRight className="w-4 h-4 text-[#B6D232]" />
              </button>
            </div>

            {/* 3 Live Key Highlights Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-white/10 w-full">
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-2xl text-[#B6D232]">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5">
                  Sur Mesure
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-2xl text-[#B6D232]">7+</span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5">
                  Catégories Pro
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-2xl text-[#B6D232]">Livraison</span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5">
                  Par Camion Dédié
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Brand Badge & Interactive Elements */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Official Circular Brand Badge from Logo profil.png */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-[#B6D232] opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />
              <LogoBadge
                className="transform transition-transform duration-500 group-hover:scale-102 cursor-pointer"
                onClick={onOpenQuote}
              />
            </div>

            {/* Bottom Quick Call info pill */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/15 text-xs text-slate-200">
              <span className="text-slate-400 font-medium">Ligne directe :</span>
              <a
                href={`tel:${settings.phone1.replace(/[^0-9+]/g, '')}`}
                className="font-black text-[#B6D232] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.phone1}</span>
              </a>
              <span className="text-white/30">•</span>
              <button
                onClick={onNavigateToCalculator}
                className="text-white hover:text-[#B6D232] font-bold underline text-[11px] cursor-pointer"
              >
                Calculer le prix du verre
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
