import React, { useState, useEffect } from 'react';
import {
  FileText,
  Phone,
  MapPin,
  Maximize2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { getSavedStorePhoto } from '../../utils/imageStorage';

interface HeroSectionProps {
  settings: CompanySettings;
  lang: Language;
  onOpenQuote: () => void;
  onNavigateToProjects: () => void;
  onNavigateToContact?: () => void;
  onNavigateToCalculator?: () => void;
  onOpenLightbox?: (imageUrl: string, title: string, caption?: string) => void;
  coverPhotoUrl?: string;
  onUpdateCoverPhoto?: (url: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  lang,
  onOpenQuote,
  onNavigateToProjects,
  onNavigateToContact,
  onOpenLightbox,
  coverPhotoUrl: propCoverPhotoUrl,
  onUpdateCoverPhoto
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).hero;

  const [heroPhotoUrl, setHeroPhotoUrl] = useState<string>(() => {
    return propCoverPhotoUrl || localStorage.getItem('ggw_official_store_photo_v2') || '/assets/ggw_storefront_truck.jpg';
  });

  // Keep local state in sync if prop changes
  useEffect(() => {
    if (propCoverPhotoUrl) {
      setHeroPhotoUrl(propCoverPhotoUrl);
    }
  }, [propCoverPhotoUrl]);

  // Load from IndexedDB / Server on initial mount
  useEffect(() => {
    let isMounted = true;
    getSavedStorePhoto().then(saved => {
      if (isMounted && saved) {
        setHeroPhotoUrl(saved);
      }
    });

    const handleUpdate = (e: any) => {
      const newUrl = e?.detail?.photoUrl || localStorage.getItem('ggw_official_store_photo_v2');
      if (newUrl) {
        setHeroPhotoUrl(newUrl);
      }
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ggw_storage_updated', handleUpdate as EventListener);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ggw_storage_updated', handleUpdate as EventListener);
    };
  }, []);

  const handleOpenPhotoFullscreen = () => {
    if (onOpenLightbox) {
      onOpenLightbox(
        heroPhotoUrl,
        'Photo Officielle — GLOBAL GLASS AND WINDOWS',
        'Local commercial & Véhicule de service • Route Nationale #2, Borne Soldat, Petit-Goâve, Haïti • Tél: (509) 4467-5506 / 3599-8564 / 2910-1818'
      );
    }
  };

  const handleContactClick = () => {
    if (onNavigateToContact) {
      onNavigateToContact();
    } else {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="accueil" className="relative bg-gradient-to-b from-[#190325] via-[#230331] to-[#160220] text-white pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Subtle atmospheric brand background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#B6D232]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#340648]/40 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* En-tête officiel & Identité de l'entreprise */}
        <div className="text-center max-w-4xl mx-auto mb-8 lg:mb-12">
          
          {/* Badge de localisation et certification */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#B6D232]/40 px-4 py-1.5 rounded-full text-xs font-bold text-[#B6D232] shadow-sm mb-4 backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Local Officiel & Siège Social • Route Nationale #2, Borne Soldat, Petit-Goâve</span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-white leading-tight mb-3">
            GLOBAL GLASS <span className="text-[#B6D232]">AND WINDOWS</span>
          </h1>

          {/* Sous-titre officiel demandé */}
          <p className="text-lg sm:text-2xl font-extrabold text-slate-100 mb-4 tracking-wide">
            Vente, fabrication & pose sur mesure
          </p>

          {/* Liste des prestations officielles */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base font-semibold text-[#B6D232] mb-6">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-100">Vitres</span>
            <span className="text-white/40">•</span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-100">Miroirs</span>
            <span className="text-white/40">•</span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-100">Fenêtres</span>
            <span className="text-white/40">•</span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-100">Portes en verre</span>
            <span className="text-white/40">•</span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-100">Solutions aluminium</span>
          </div>

          {/* Boutons d'action officiels demandés */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Bouton Principal: DEMANDER UN DEVIS */}
            <button
              id="hero-quote-btn"
              type="button"
              onClick={onOpenQuote}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B6D232] hover:bg-[#a6c22a] text-[#340648] font-black text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border-2 border-white/20"
            >
              <FileText className="w-5 h-5 text-[#340648]" />
              <span>DEMANDER UN DEVIS</span>
            </button>

            {/* Bouton Secondaire: NOUS CONTACTER */}
            <button
              id="hero-contact-btn"
              type="button"
              onClick={handleContactClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl border border-white/30 hover:border-[#B6D232] transition-all backdrop-blur-md cursor-pointer"
            >
              <Phone className="w-5 h-5 text-[#B6D232]" />
              <span>NOUS CONTACTER</span>
            </button>
          </div>
        </div>

        {/* 
          CONTENEUR OFFICIEL DE LA PHOTO DU LOCAL ET DU CAMION
          Règles strictes respectées :
          - Les pixels de l'image ne sont JAMAIS modifiés ni retouchés par IA.
          - object-fit: contain et ratio naturel : l'image originale reste intégrale,
            aucune partie (enseigne, camion, téléphones, générateur, bâtiment) n'est recadrée.
          - Le conteneur HTML/CSS offre une mise en valeur moderne et responsive.
        */}
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#B6D232]/60 bg-slate-950 shadow-2xl overflow-hidden group">
            
            {/* Barre de titre supérieure de l'image */}
            <div className="bg-[#230331] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 text-[#B6D232] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#B6D232]" />
                <span className="uppercase tracking-wider">Photo Officielle du Local & du Véhicule de Service</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-[11px] hidden sm:inline">
                  Rte Nle #2, Borne Soldat, Petit-Goâve
                </span>
                <button
                  type="button"
                  onClick={handleOpenPhotoFullscreen}
                  className="inline-flex items-center gap-1.5 bg-[#B6D232] hover:bg-[#a6c22a] text-[#340648] text-[11px] font-black px-3 py-1 rounded-full cursor-pointer transition shadow-sm"
                  title="Agrandir en plein écran"
                >
                  <Maximize2 className="w-3 h-3 text-[#340648]" />
                  <span>Agrandir</span>
                </button>
              </div>
            </div>

            {/* Cadre d'affichage de l'image originale sans modification */}
            <div 
              onClick={handleOpenPhotoFullscreen}
              className="relative w-full bg-slate-950 flex items-center justify-center p-1 sm:p-2 cursor-pointer"
              title="Cliquer pour voir la photo officielle en plein écran haute résolution"
            >
              <img
                key={heroPhotoUrl}
                src={heroPhotoUrl}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/assets/ggw_storefront_truck.jpg')) {
                    target.src = '/assets/ggw_storefront_truck.jpg';
                  }
                }}
                alt="Local officiel et camion de service GLOBAL GLASS AND WINDOWS à Petit-Goâve"
                className="w-full h-auto max-h-[75vh] object-contain mx-auto block transition-transform duration-300 group-hover:scale-[1.005]"
                referrerPolicy="no-referrer"
              />

              {/* Bouton flottant de zoom au survol */}
              <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-md opacity-90 group-hover:opacity-100 transition flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5 text-[#B6D232]" />
                <span className="hidden sm:inline">Plein écran haute résolution</span>
              </div>
            </div>

            {/* Pied de photo avec coordonnées visibles et vérifiables */}
            <div className="bg-[#190325] px-4 py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                <span className="font-semibold">
                  Route Nationale #2, Borne Soldat, Petit-Goâve, Haïti
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-slate-400">Lignes directes :</span>
                <a
                  href={`tel:${settings.phone1.replace(/[^0-9+]/g, '')}`}
                  className="font-bold text-[#B6D232] hover:underline"
                >
                  {settings.phone1}
                </a>
                <span className="text-white/20">•</span>
                <a
                  href={`tel:${settings.phone2.replace(/[^0-9+]/g, '')}`}
                  className="font-bold text-[#B6D232] hover:underline"
                >
                  {settings.phone2}
                </a>
                <span className="text-white/20">•</span>
                <a
                  href={`tel:${settings.phone3.replace(/[^0-9+]/g, '')}`}
                  className="font-bold text-[#B6D232] hover:underline"
                >
                  {settings.phone3}
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
