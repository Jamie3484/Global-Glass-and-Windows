import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Maximize2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Project, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface ProjectsSectionProps {
  projects: Project[];
  lang: Language;
  onOpenLightbox: (imageUrl: string, title: string, caption?: string) => void;
  onOpenQuote: (projectTitle?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  lang,
  onOpenLightbox,
  onOpenQuote
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sliderPositions, setSliderPositions] = useState<{ [key: string]: number }>({});

  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).projects;

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'portes', label: 'Portes' },
    { id: 'fenetres', label: 'Fenêtres' },
    { id: 'douches', label: 'Douches' },
    { id: 'miroirs', label: 'Miroirs' },
    { id: 'aluminium', label: 'Aluminium' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'residentiel', label: 'Résidentiel' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleSliderChange = (projectId: string, value: number) => {
    setSliderPositions(prev => ({ ...prev, [projectId]: value }));
  };

  return (
    <section id="realisations" className="py-16 md:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#B6D232]/20 text-[#B6D232] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#B6D232]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galerie de Projets</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#B6D232] text-[#340648] shadow-lg font-black scale-105'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const sliderPos = sliderPositions[project.id] ?? 50;

            return (
              <div
                key={project.id}
                className="bg-[#340648]/80 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Before / After Interactive Slider or Standard Image */}
                  {project.hasBeforeAfter && project.beforeImage && project.afterImage ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden select-none group">
                      {/* After Image (Full background) */}
                      <img
                        src={project.afterImage}
                        alt={`${project.title} - Après`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-[#B6D232] text-[#340648] text-[10px] font-black px-3 py-1 rounded-full shadow">
                        APRÈS
                      </div>

                      {/* Before Image (Clipped by slider) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPos}%` }}
                      >
                        <img
                          src={project.beforeImage}
                          alt={`${project.title} - Avant`}
                          className="w-full h-full object-cover max-w-none"
                          style={{ width: '100%' }}
                        />
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow">
                          AVANT
                        </div>
                      </div>

                      {/* Slider Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center cursor-ew-resize"
                        style={{ left: `${sliderPos}%` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center shadow-lg border-2 border-white">
                          <SlidersHorizontal className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Range Input for drag interaction */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPos}
                        onChange={(e) => handleSliderChange(project.id, Number(e.target.value))}
                        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                        aria-label="Glisser pour comparer avant et après"
                      />

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-[10px] text-slate-300 pointer-events-none">
                        ↔ Glisser pour comparer Avant / Après
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => onOpenLightbox(project.images[0]?.url || '', project.title, project.description)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800 cursor-pointer group"
                    >
                      <img
                        src={project.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 text-[#340648] p-3 rounded-full shadow-lg">
                          <Maximize2 className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1 font-bold text-[#B6D232]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{project.date}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-white leading-snug mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {project.client && (
                      <div className="text-xs text-slate-300 font-semibold mb-4">
                        Client : <span className="text-[#B6D232]">{project.client}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Quote CTA */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <button
                      onClick={() => onOpenLightbox(
                        project.afterImage || project.images[0]?.url || '',
                        project.title,
                        project.description
                      )}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#B6D232]" />
                      <span>Agrandir la photo</span>
                    </button>

                    <button
                      onClick={() => onOpenQuote(`Projet similaire à ${project.title}`)}
                      className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Projet similaire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
