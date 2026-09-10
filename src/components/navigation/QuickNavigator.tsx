import React, { useState, useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Compass,
  Home,
  Store,
  Layers,
  Wrench,
  Sparkles,
  Film,
  Star,
  FileText,
  MapPin,
  X
} from 'lucide-react';
import { scrollToSection, scrollToTop, scrollToBottom } from '../../utils/scroll';
import { Language } from '../../types';

interface QuickNavigatorProps {
  lang?: Language;
}

const SECTIONS = [
  { id: 'accueil', label: 'Accueil', icon: Home },
  { id: 'notre-entreprise', label: 'Entreprise & Local', icon: Store },
  { id: 'produits', label: 'Catalogue Produits', icon: Layers },
  { id: 'services', label: 'Nos 14 Services', icon: Wrench },
  { id: 'realisations', label: 'Réalisations', icon: Sparkles },
  { id: 'videos', label: 'Vidéos & Médias', icon: Film },
  { id: 'avis', label: 'Avis Clients', icon: Star },
  { id: 'gemini-ai', label: 'Studio IA', icon: Sparkles },
  { id: 'devis', label: 'Demande de Devis', icon: FileText },
  { id: 'contact', label: 'Contact & Atelier', icon: MapPin },
];

export const QuickNavigator: React.FC<QuickNavigatorProps> = ({ lang = 'fr' }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('accueil');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(100, Math.round((currentScrollY / totalHeight) * 100)) : 0;
      setScrollProgress(progress);

      // Determine active section based on position
      const scrollPos = currentScrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollUp = () => {
    // Find previous section or scroll to top
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      scrollToSection(SECTIONS[currentIndex - 1].id);
    } else {
      scrollToTop();
    }
  };

  const handleScrollDown = () => {
    // Find next section or scroll to bottom
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      scrollToSection(SECTIONS[currentIndex + 1].id);
    } else {
      scrollToBottom();
    }
  };

  const handleSectionClick = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  const isNearTop = scrollY < 150;
  const isNearBottom = scrollProgress >= 98;

  return (
    <>
      {/* Floating Quick Navigation Controller */}
      <nav
        aria-label="Navigation rapide"
        className="fixed right-4 bottom-28 sm:bottom-32 z-40 flex flex-col items-center gap-1.5 select-none"
      >
        {/* Quick Menu Popover / Section Jumper */}
        {menuOpen && (
          <div
            className="absolute right-0 bottom-full mb-3 w-64 bg-[#230331]/95 text-white rounded-2xl p-3 shadow-2xl border-2 border-[#B6D232] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/20">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#B6D232]">
                Saut Rapide de Section
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
                aria-label="Fermer le menu de saut rapide"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#B6D232] text-[#340648]'
                        : 'text-slate-200 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#340648]' : 'text-[#B6D232]'}`} />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bouton MONTER (Haut de page / Section précédente) */}
        <button
          id="btn-nav-scroll-up"
          type="button"
          onClick={handleScrollUp}
          disabled={isNearTop}
          title={isNearTop ? "Vous êtes en haut de page" : "Monter à la section précédente ou haut de page"}
          aria-label="Monter vers le haut de la page"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-[#B6D232] ${
            isNearTop
              ? 'bg-[#340648]/40 text-slate-400 opacity-40 cursor-not-allowed'
              : 'bg-[#340648] hover:bg-[#230331] text-[#B6D232] hover:text-white hover:scale-110 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronUp className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Bouton Menu / Indicateur de progression & Sections */}
        <button
          id="btn-nav-sections-menu"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Ouvrir le menu de saut rapide vers toutes les sections"
          aria-label="Menu de navigation rapide entre sections"
          className="w-11 h-11 rounded-full bg-[#230331] hover:bg-[#340648] text-white border-2 border-white/40 shadow-xl flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer relative group"
        >
          <Compass className="w-4 h-4 text-[#B6D232] group-hover:rotate-45 transition-transform" />
          <span className="text-[9px] font-black text-slate-200 leading-none mt-0.5">
            {scrollProgress}%
          </span>
        </button>

        {/* Bouton DESCENDRE (Bas de page / Section suivante) */}
        <button
          id="btn-nav-scroll-down"
          type="button"
          onClick={handleScrollDown}
          disabled={isNearBottom}
          title={isNearBottom ? "Vous êtes en bas de page" : "Descendre à la section suivante ou bas de page"}
          aria-label="Descendre vers le bas de la page"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-[#B6D232] ${
            isNearBottom
              ? 'bg-[#340648]/40 text-slate-400 opacity-40 cursor-not-allowed'
              : 'bg-[#340648] hover:bg-[#230331] text-[#B6D232] hover:text-white hover:scale-110 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronDown className="w-6 h-6 stroke-[2.5]" />
        </button>
      </nav>
    </>
  );
};
