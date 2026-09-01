import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Shield,
  ArrowUp,
  ExternalLink
} from 'lucide-react';
import { LogoMain } from '../brand/LogoMain';
import { CompanySettings, Language, ProductCategory } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface FooterProps {
  settings: CompanySettings;
  categories: ProductCategory[];
  lang: Language;
  onOpenAdmin: () => void;
  onOpenQuote: () => void;
  onSelectCategory?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  lang,
  onOpenAdmin,
  onOpenQuote,
  onSelectCategory
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#230331] text-slate-200 border-t-4 border-[#B6D232] relative overflow-hidden">
      {/* Background Subtle Logo Watermark */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-5 pointer-events-none text-white">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Slogan (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <LogoMain variant="white" className="h-12" showTagline={true} />
              
              <p className="mt-4 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {settings.taglineSecondary || "Vente, fabrication et solutions sur mesure en verre, miroirs, fenêtres, portes et aluminium."}
              </p>

              <div className="mt-4 p-3.5 bg-[#340648] rounded-2xl border border-[#B6D232]/30 text-xs">
                <span className="font-serif italic font-extrabold text-[#B6D232] block">
                  "{settings.tagline}"
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#340648] hover:bg-[#B6D232] hover:text-[#340648] text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.whatsapp && (
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#340648] hover:bg-[#B6D232] hover:text-[#340648] text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#340648] hover:bg-[#B6D232] hover:text-[#340648] text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#340648] hover:bg-[#B6D232] hover:text-[#340648] text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-black text-[#B6D232] uppercase tracking-wider mb-4">
              {t.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <a href="#accueil" className="hover:text-[#B6D232] transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#notre-entreprise" className="hover:text-[#B6D232] transition-colors">Notre Entreprise</a>
              </li>
              <li>
                <a href="#produits" className="hover:text-[#B6D232] transition-colors">Catalogue Produits</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#B6D232] transition-colors">Nos Services</a>
              </li>
              <li>
                <a href="#realisations" className="hover:text-[#B6D232] transition-colors">Nos Réalisations</a>
              </li>
              <li>
                <a href="#videos" className="hover:text-[#B6D232] transition-colors">Galerie Vidéos</a>
              </li>
              <li>
                <a href="#avis" className="hover:text-[#B6D232] transition-colors">Avis Clients</a>
              </li>
              <li>
                <a href="#calculateur" className="hover:text-[#B6D232] transition-colors">Calculateur de Verre</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-black text-[#B6D232] uppercase tracking-wider mb-4">
              {t.products}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      onSelectCategory?.(c.slug);
                      const el = document.querySelector('#produits');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#B6D232] text-left transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B6D232]" />
                    <span>{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Petit-Goâve Coordinates (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-black text-[#B6D232] uppercase tracking-wider mb-4">
              {t.contactInfo}
            </h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B6D232] flex-shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.addressDetails}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#B6D232] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 font-bold text-white">
                  <a href={`tel:${settings.phone1.replace(/[^0-9+]/g, '')}`} className="hover:text-[#B6D232]">
                    {settings.phone1} (WhatsApp)
                  </a>
                  <a href={`tel:${settings.phone2.replace(/[^0-9+]/g, '')}`} className="hover:text-[#B6D232]">
                    {settings.phone2}
                  </a>
                  <a href={`tel:${settings.phone3.replace(/[^0-9+]/g, '')}`} className="hover:text-[#B6D232]">
                    {settings.phone3}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B6D232] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">{settings.openingHours.days}</span>
                  <span className="block text-slate-300">{settings.openingHours.hours}</span>
                </div>
              </div>

              {settings.email && (
                <div className="flex items-center gap-2.5 pt-1">
                  <Mail className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-xs text-slate-300 hover:text-[#B6D232] truncate">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>

            {/* Quote Action button */}
            <div className="mt-5">
              <button
                onClick={onOpenQuote}
                className="w-full bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black py-2.5 px-4 rounded-xl text-xs shadow-md transition-all text-center cursor-pointer"
              >
                Demander un devis en ligne
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Bar with Copyright, Admin portal, and Scroll to top */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>© {new Date().getFullYear()} {settings.companyName} — Tous droits réservés.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Petit-Goâve, Haïti • Spécialiste Verre, Miroirs, Portes, Fenêtres & Aluminium
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-400 hover:text-[#B6D232] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Accès Administration</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#340648] text-[#B6D232] hover:bg-[#B6D232] hover:text-[#340648] transition-colors shadow border border-white/10"
              aria-label="Retour en haut"
              title="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
