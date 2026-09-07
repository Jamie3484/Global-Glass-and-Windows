import React from 'react';
import {
  FileText,
  Eye,
  Phone,
  ArrowRight,
  MapPin,
  Maximize2
} from 'lucide-react';
import { LogoBadge } from '../brand/LogoBadge';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface HeroSectionProps {
  settings: CompanySettings;
  lang: Language;
  onOpenQuote: () => void;
  onNavigateToProjects: () => void;
  onNavigateToCalculator?: () => void;
  onOpenLightbox?: (imageUrl: string, title: string, caption?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  lang,
  onOpenQuote,
  onNavigateToProjects,
  onOpenLightbox
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).hero;

  const handleOpenPhotoFullscreen = () => {
    if (onOpenLightbox) {
      onOpenLightbox(
        '/assets/ggw_storefront_truck.jpg',
        'Local Officiel et Camion de Service — GLOBAL GLASS AND WINDOWS',
        'Rte Nle #2, Borne Soldat, Petit-Goâve, Haïti • Tél: (509) 4467-5506 / 3599-8564 / 2910-1818'
      );
    }
  };

  return (
    <section id="accueil" className="relative min-h-[85vh] lg:min-h-[92vh] bg-slate-900 text-white flex items-center overflow-hidden">
      {/* 
        Image soumise comme fond (Background) de la page d'accueil sans modification aucune :
        Couleurs réelles d'origine, aucune retouche, aucun filtre, aucun effet de flou.
      */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/ggw_storefront_truck.jpg"
          alt="Local et Camion de service GLOBAL GLASS AND WINDOWS à Petit-Goâve"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Voile d'ambiance très léger et transparent uniquement pour garantir le contraste du texte sans altérer l'image */}
        <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" />
      </div>

      {/* Bouton d'accès rapide plein écran pour admirer la photo originale soumise */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20">
        <button
          onClick={handleOpenPhotoFullscreen}
          className="inline-flex items-center gap-2 bg-[#230331]/80 hover:bg-[#230331] text-white text-xs font-bold px-3.5 py-2 rounded-full backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          title="Agrandir la photo de l'établissement"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#B6D232]" />
          <span className="hidden sm:inline">Photo réelle de l'établissement</span>
          <span className="sm:hidden">Photo réelle</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Présentation très professionnelle avec carte flottante stylisée */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="bg-[#230331]/85 sm:bg-[#230331]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/25 shadow-2xl w-full">
              
              {/* Petit-Goâve Official Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-[#B6D232]/50 text-[#B6D232] text-xs font-extrabold shadow-sm mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#B6D232]" />
                <span>{t.badgeLoc}</span>
              </div>

              {/* Main Brand Title */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-[1.1] mb-4 text-white">
                GLOBAL GLASS <br />
                <span className="text-[#B6D232]">
                  AND WINDOWS
                </span>
              </h1>

              {/* Official Slogan Banner with Eye Motif */}
              <div className="inline-flex items-center gap-3 bg-[#B6D232]/20 border-l-4 border-[#B6D232] px-4 py-2.5 rounded-r-2xl mb-5">
                <Eye className="w-5 h-5 text-[#B6D232] flex-shrink-0" />
                <p className="font-serif italic font-extrabold text-base sm:text-lg text-[#B6D232] leading-snug">
                  "{settings.tagline || t.tagline}"
                </p>
              </div>

              {/* Subtitle / Value Proposition */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-100 font-medium leading-relaxed mb-6">
                {settings.taglineSecondary || t.subtitle}
              </p>

              {/* Main Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-6">
                <button
                  onClick={onOpenQuote}
                  className="w-full sm:w-auto bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border-2 border-white/20"
                >
                  <FileText className="w-4 h-4 text-[#340648]" />
                  <span>{t.ctaQuote}</span>
                </button>

                <button
                  onClick={onNavigateToProjects}
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm sm:text-base px-5 py-3.5 rounded-2xl border border-white/30 hover:border-[#B6D232] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.ctaProjects}</span>
                  <ArrowRight className="w-4 h-4 text-[#B6D232]" />
                </button>
              </div>

              {/* 3 Live Key Highlights Bar */}
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/15 w-full">
                <div className="flex flex-col">
                  <span className="font-black text-base sm:text-xl text-[#B6D232]">100%</span>
                  <span className="text-[10px] sm:text-xs text-slate-200 font-medium leading-tight mt-0.5">
                    Sur Mesure
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-base sm:text-xl text-[#B6D232]">7+</span>
                  <span className="text-[10px] sm:text-xs text-slate-200 font-medium leading-tight mt-0.5">
                    Catégories Pro
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-base sm:text-xl text-[#B6D232]">Livraison</span>
                  <span className="text-[10px] sm:text-xs text-slate-200 font-medium leading-tight mt-0.5">
                    Camion Dédié
                  </span>
                </div>
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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 bg-[#230331]/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-xs text-slate-100 shadow-xl">
              <span className="text-slate-300 font-medium">Ligne directe :</span>
              <a
                href={`tel:${settings.phone1.replace(/[^0-9+]/g, '')}`}
                className="font-black text-[#B6D232] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.phone1}</span>
              </a>
              <span className="text-white/30">•</span>
              <span className="text-slate-200 font-semibold text-[11px]">
                Borne Soldat, Petit-Goâve
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
