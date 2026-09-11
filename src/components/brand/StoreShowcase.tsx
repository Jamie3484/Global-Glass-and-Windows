import React, { useState, useEffect, useRef } from 'react';
import { Truck, Store, Wrench, ShieldCheck, MapPin, Phone, ArrowRight, CheckCircle2, Maximize2, Upload, Image as ImageIcon } from 'lucide-react';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { getSavedStorePhoto, uploadStorePhotoFile } from '../../utils/imageStorage';

interface StoreShowcaseProps {
  settings: CompanySettings;
  lang?: Language;
  onNavigateToServices?: () => void;
  onNavigateToContact?: () => void;
  onOpenQuote?: () => void;
  onOpenMaps?: () => void;
  onOpenLightbox?: (url: string, title?: string, subtitle?: string) => void;
  storePhotoUrl?: string;
  onUpdateStorePhoto?: (url: string) => void;
}

export const StoreShowcase: React.FC<StoreShowcaseProps> = ({
  settings,
  lang = 'fr',
  onNavigateToServices,
  onNavigateToContact,
  onOpenQuote,
  onOpenMaps,
  onOpenLightbox,
  storePhotoUrl: propStorePhotoUrl,
  onUpdateStorePhoto
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).company;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [storePhotoUrl, setStorePhotoUrl] = useState<string>(() => {
    return propStorePhotoUrl || localStorage.getItem('ggw_official_store_photo_v2') || '/assets/ggw_storefront_truck.jpg';
  });

  // Keep local state in sync if prop changes
  useEffect(() => {
    if (propStorePhotoUrl) {
      setStorePhotoUrl(propStorePhotoUrl);
    }
  }, [propStorePhotoUrl]);

  // Keep in sync with storage updates or server sync
  useEffect(() => {
    let isMounted = true;
    getSavedStorePhoto().then(saved => {
      if (isMounted && saved) {
        setStorePhotoUrl(saved);
      }
    });

    const handleStorageUpdate = (e: any) => {
      const newUrl = e?.detail?.photoUrl || localStorage.getItem('ggw_official_store_photo_v2');
      if (newUrl) {
        setStorePhotoUrl(newUrl);
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('ggw_storage_updated', handleStorageUpdate as EventListener);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('ggw_storage_updated', handleStorageUpdate as EventListener);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setStorePhotoUrl(objectUrl);
    if (onUpdateStorePhoto) {
      onUpdateStorePhoto(objectUrl);
    }
    setIsUploading(true);

    try {
      const finalUrl = await uploadStorePhotoFile(file);
      setStorePhotoUrl(finalUrl);
      if (onUpdateStorePhoto) {
        onUpdateStorePhoto(finalUrl);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving image to server:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleOpenPhoto = () => {
    if (onOpenLightbox) {
      onOpenLightbox(
        storePhotoUrl,
        'Local Officiel et Camion de Service — GLOBAL GLASS AND WINDOWS',
        'Route Nationale #2, Borne Soldat, Petit-Goâve, Haïti • Tél: (509) 4467-5506 / 3599-8564 / 2910-1818'
      );
    }
  };

  return (
    <section id="notre-entreprise" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B6D232]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#340648]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Official Store & Truck Presentation (Pure Image Without Any Alteration) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#340648] bg-slate-900 group">
              {/* Photo representation of the physical shop and service truck in Petit-Goâve */}
              {/* Aspect ratio preserves the panoramic view of both storefront and truck without cropping */}
              <div 
                onClick={handleOpenPhoto}
                className="relative w-full overflow-hidden cursor-pointer bg-slate-950 flex items-center justify-center p-1 sm:p-2 min-h-[260px]"
                title="Cliquer pour afficher la photo en grand format"
              >
                <img
                  src={storePhotoUrl}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/assets/ggw_storefront_truck.jpg')) {
                      target.src = '/assets/ggw_storefront_truck.jpg';
                    }
                  }}
                  alt="Local officiel et camion de service GLOBAL GLASS AND WINDOWS à Petit-Goâve"
                  className="w-full h-auto max-h-[460px] object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Badge on the image */}
                <div className="absolute top-3 left-3 bg-[#B6D232] text-[#340648] text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white z-10">
                  <Store className="w-3.5 h-3.5" />
                  <span>Local Officiel • Petit-Goâve</span>
                </div>

                {/* Quick Expand Button */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPhoto();
                    }}
                    className="p-2 rounded-full bg-[#230331]/80 hover:bg-[#230331] text-white border border-white/20 shadow-md backdrop-blur-sm transition-all"
                    title="Agrandir en plein écran"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#B6D232]" />
                  </button>
                </div>

                {/* Subtle Hover Action hint */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-[#340648]/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-[#B6D232]">
                    <Maximize2 className="w-3.5 h-3.5 text-[#B6D232]" />
                    Afficher en plein écran
                  </span>
                </div>
              </div>

              {/* Bottom Bar: Action to Replace Image directly without modification */}
              <div className="bg-[#230331] p-3 px-4 flex items-center justify-between gap-2 text-white border-t border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <ImageIcon className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {uploadSuccess ? '✓ Photo officielle mise à jour !' : 'Photo officielle (Sans retouche)'}
                  </span>
                </div>
                
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 bg-[#B6D232] hover:bg-[#a5be2c] text-[#340648] text-xs font-black px-3 py-1.5 rounded-lg shadow transition-all cursor-pointer disabled:opacity-50"
                    title="Sélectionnez votre fichier (ex: Local et Camion de GGW.png) pour le charger directement sans aucune modification"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{isUploading ? 'Chargement...' : 'Remplacer l’image'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Service Truck Presentation Card (Neatly positioned below without covering the truck's wheels or signs) */}
            <div className="mt-4 bg-white rounded-2xl p-4 shadow-lg border border-[#B6D232]/50 text-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#340648] text-[#B6D232] flex items-center justify-center flex-shrink-0 shadow">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#340648] text-sm md:text-base leading-tight">
                      Camion de Service & Livraison GGW
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Intervention sur site à Petit-Goâve, Borne Soldat et livraison nationale
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B6D232]" />
                  <span>Livraison sécurisée de verre</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B6D232]" />
                  <span>Équipe de poseurs qualifiés</span>
                </div>
              </div>
            </div>

            {/* Quick Location Pill */}
            <div className="mt-3 flex items-center justify-between bg-slate-100 rounded-2xl px-5 py-3 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#340648]">
                <MapPin className="w-4 h-4 text-[#B6D232]" />
                <span>{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#340648]">
                <Phone className="w-4 h-4 text-[#B6D232]" />
                <span>{settings.phone1}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial & Company Strengths */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-extrabold px-3.5 py-1.5 rounded-full w-fit mb-4 border border-[#340648]/20">
              <span className="w-2 h-2 rounded-full bg-[#B6D232] animate-pulse" />
              <span>{t.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#340648] tracking-tight leading-tight mb-4">
              {t.title}
            </h2>

            <p className="text-base text-slate-700 font-medium leading-relaxed mb-4">
              {settings.aboutText || t.desc}
            </p>

            <div className="space-y-3 mb-8 text-sm text-slate-600 leading-relaxed">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
            </div>

            {/* 4 Brand Pillars grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#340648] text-xs sm:text-sm">
                  <Wrench className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                  <span>Fabrication sur mesure</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#340648] text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                  <span>Vente de matériaux</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#340648] text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                  <span>Conseils d'experts</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#340648] text-xs sm:text-sm">
                  <Store className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                  <span>Qualité & Durabilité</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToServices}
                className="bg-[#340648] hover:bg-[#230331] text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>{t.btnServices}</span>
                <ArrowRight className="w-4 h-4 text-[#B6D232]" />
              </button>

              <button
                onClick={onOpenQuote}
                className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm cursor-pointer border border-[#340648]/20"
              >
                Demander un devis
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
