import React from 'react';
import { Truck, Store, Wrench, ShieldCheck, MapPin, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface StoreShowcaseProps {
  settings: CompanySettings;
  lang?: Language;
  onNavigateToServices?: () => void;
  onNavigateToContact?: () => void;
  onOpenQuote?: () => void;
  onOpenMaps?: () => void;
}

export const StoreShowcase: React.FC<StoreShowcaseProps> = ({
  settings,
  lang = 'fr',
  onNavigateToServices,
  onNavigateToContact,
  onOpenQuote,
  onOpenMaps
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).company;

  return (
    <section id="notre-entreprise" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B6D232]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#340648]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Official Store & Truck Presentation */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#340648] bg-slate-900 group">
              {/* Photo representation of the physical shop and service truck in Petit-Goâve */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                  alt="Local physique et camion de service GLOBAL GLASS AND WINDOWS"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#340648]/90 via-[#340648]/30 to-transparent" />
              </div>

              {/* Floating Badge on the image */}
              <div className="absolute top-4 left-4 bg-[#B6D232] text-[#340648] text-xs md:text-sm font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white">
                <Store className="w-4 h-4" />
                <span>Local Officiel • Petit-Goâve</span>
              </div>

              {/* Bottom Card Overlay with Service Truck details */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#B6D232]/50 text-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#340648] text-[#B6D232] flex items-center justify-center flex-shrink-0 shadow">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#340648] text-sm md:text-base leading-tight">
                        Camion de Service & Livraison
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Intervention et installation sur site à Petit-Goâve et dans tout le pays
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
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
            </div>

            {/* Quick Location Pill */}
            <div className="mt-4 flex items-center justify-between bg-slate-100 rounded-2xl px-5 py-3 border border-slate-200">
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
