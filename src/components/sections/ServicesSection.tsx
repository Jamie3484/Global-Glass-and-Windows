import React from 'react';
import {
  Wrench,
  Layers,
  Sparkles,
  Columns,
  DoorClosed,
  Grid,
  Hammer,
  ShieldCheck,
  Building2,
  Cpu,
  Ruler,
  FileText,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Service, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface ServicesSectionProps {
  services: Service[];
  lang: Language;
  onOpenQuote: (serviceTitle?: string) => void;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Layers': return <Layers className="w-6 h-6 text-[#B6D232]" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-[#B6D232]" />;
    case 'Columns': return <Columns className="w-6 h-6 text-[#B6D232]" />;
    case 'Wrench': return <Wrench className="w-6 h-6 text-[#B6D232]" />;
    case 'DoorClosed': return <DoorClosed className="w-6 h-6 text-[#B6D232]" />;
    case 'Grid': return <Grid className="w-6 h-6 text-[#B6D232]" />;
    case 'Hammer': return <Hammer className="w-6 h-6 text-[#B6D232]" />;
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#B6D232]" />;
    case 'Building2': return <Building2 className="w-6 h-6 text-[#B6D232]" />;
    case 'Cpu': return <Cpu className="w-6 h-6 text-[#B6D232]" />;
    case 'Ruler': return <Ruler className="w-6 h-6 text-[#B6D232]" />;
    case 'FileText': return <FileText className="w-6 h-6 text-[#B6D232]" />;
    case 'Lightbulb': return <Lightbulb className="w-6 h-6 text-[#B6D232]" />;
    default: return <Wrench className="w-6 h-6 text-[#B6D232]" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  lang,
  onOpenQuote
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).services;

  return (
    <section id="services" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <Wrench className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Expertise & Savoir-Faire</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* 14 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-[#340648] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Service Icon Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#340648] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-xs font-extrabold text-slate-400">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#340648] group-hover:text-[#51106e] leading-snug mb-3 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                  {service.shortDesc}
                </p>

                {/* Bullets */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B6D232] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => onOpenQuote(service.title)}
                  className="w-full bg-white hover:bg-[#340648] text-[#340648] hover:text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-300 group-hover:border-[#340648]"
                >
                  <span>{t.getQuoteForService}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B6D232]" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
