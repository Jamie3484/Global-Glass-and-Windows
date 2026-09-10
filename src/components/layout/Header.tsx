import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Search,
  Shield,
  FileText,
  Clock,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { LogoMain } from '../brand/LogoMain';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { scrollToSection } from '../../utils/scroll';

interface HeaderProps {
  settings: CompanySettings;
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
  onSelectLang?: (lang: Language) => void;
  onOpenSearch?: () => void;
  onOpenQuote: () => void;
  onOpenCalculator?: () => void;
  onOpenAdmin: () => void;
  activeSection?: string;
  unreadQuotesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  lang,
  onLanguageChange,
  onSelectLang,
  onOpenSearch,
  onOpenQuote,
  onOpenAdmin,
  activeSection,
  unreadQuotesCount = 0
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLanguageSwitch = (newLang: Language) => {
    if (onLanguageChange) onLanguageChange(newLang);
    if (onSelectLang) onSelectLang(newLang);
    setLangDropdownOpen(false);
  };

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      scrollToSection('produits');
    }
  };

  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.home, href: '#accueil' },
    { label: t.about, href: '#notre-entreprise' },
    { label: t.products, href: '#produits' },
    { label: t.services, href: '#services' },
    { label: t.projects, href: '#realisations' },
    { label: t.videos, href: '#videos' },
    { label: t.reviews, href: '#avis' },
    { label: '✨ Studio IA', href: '#gemini-ai' },
    { label: t.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Bar with real contact coordinates and opening hours */}
      <div className="bg-[#230331] text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#B6D232]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Address & Hours */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#B6D232] flex-shrink-0" />
              <span className="truncate">{settings.address}, {settings.city}</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#B6D232] flex-shrink-0" />
              <span>{settings.openingHours.days} : {settings.openingHours.hours}</span>
            </div>
          </div>

          {/* Quick Phones & Language & Admin */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Phone link */}
            <a
              href={`tel:${settings.phone1.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 font-bold text-[#B6D232] hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">{settings.phone1}</span>
            </a>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 bg-[#340648] px-2 py-0.5 rounded text-white text-[11px] font-bold border border-white/20 hover:border-[#B6D232]"
              >
                <span>
                  {lang === 'fr' ? '🇫🇷 FR' : lang === 'ht' ? '🇭🇹 HT' : '🇺🇸 EN'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white text-slate-900 rounded-lg shadow-xl py-1 z-50 border border-slate-200 text-xs">
                  <button
                    onClick={() => handleLanguageSwitch('fr')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2 ${lang === 'fr' ? 'font-bold text-[#340648] bg-slate-50' : ''}`}
                  >
                    <span>🇫🇷</span> Français
                  </button>
                  <button
                    onClick={() => handleLanguageSwitch('ht')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2 ${lang === 'ht' ? 'font-bold text-[#340648] bg-slate-50' : ''}`}
                  >
                    <span>🇭🇹</span> Kreyòl
                  </button>
                  <button
                    onClick={() => handleLanguageSwitch('en')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2 ${lang === 'en' ? 'font-bold text-[#340648] bg-slate-50' : ''}`}
                  >
                    <span>🇺🇸</span> English
                  </button>
                </div>
              )}
            </div>

            {/* Admin link button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
            >
              <Shield className="w-3 h-3 text-[#B6D232]" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200'
          : 'bg-white py-3 shadow-sm border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Official Brand Logo */}
          <a
            href="#accueil"
            onClick={(e) => { e.preventDefault(); handleNavClick('#accueil'); }}
            className="flex-shrink-0"
          >
            <LogoMain className="h-10 md:h-12" showTagline={false} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-[#340648] bg-[#B6D232]/30 font-black'
                    : 'text-slate-700 hover:text-[#340648] hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="p-2 rounded-xl text-slate-700 hover:text-[#340648] hover:bg-slate-100 transition-colors"
              title="Rechercher sur le site"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Highlighted CTA: DEMANDER UN DEVIS */}
            <button
              onClick={onOpenQuote}
              className="bg-[#340648] hover:bg-[#230331] text-white text-xs md:text-sm font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#B6D232]"
            >
              <FileText className="w-4 h-4 text-[#B6D232]" />
              <span className="whitespace-nowrap">{t.quote}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-[#340648] hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[105px] z-40 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-h-[calc(100vh-105px)] overflow-y-auto shadow-2xl border-b border-slate-200 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#B6D232]/20 hover:text-[#340648] border border-slate-100 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}
                className="w-full bg-[#340648] text-white font-extrabold py-3.5 rounded-xl text-center shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4 text-[#B6D232]" />
                <span>{t.quote}</span>
              </button>

              {/* Direct call buttons in mobile menu */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${settings.phone1.replace(/[^0-9+]/g, '')}`}
                  className="bg-slate-100 text-[#340648] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#340648]" />
                  <span>Appeler</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
