import React, { useRef, useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Maximize2,
  SlidersHorizontal,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Project, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { StorageService } from '../../services/storage';
import { processImportedFile } from '../../services/mediaService';

interface ProjectsSectionProps {
  projects: Project[];
  lang: Language;
  onOpenLightbox: (imageUrl: string, title: string, caption?: string) => void;
  onOpenQuote: (projectTitle?: string) => void;
  onProjectsUpdated?: (updatedProjects: Project[]) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  lang,
  onOpenLightbox,
  onOpenQuote,
  onProjectsUpdated
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sliderPositions, setSliderPositions] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.startsWith('data:video') ||
      lower.startsWith('blob:') ||
      /\.(mp4|webm|mov|m4v|ogg|3gp)/i.test(lower)
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await processImportedFile(file);
        const titleWithoutExt = processed.name || file.name.replace(/\.[^/.]+$/, "");

        const newProj: Project = {
          id: `proj-${Date.now()}-${i}`,
          title: titleWithoutExt || `Réalisation ${projects.length + i + 1}`,
          description: `Réalisation importée directement depuis votre appareil (${(file.size / (1024 * 1024)).toFixed(2)} Mo). Travaux de vitrerie et menuiserie aluminium sur mesure.`,
          category: 'portes',
          location: 'Borne Soldat, Petit-Goâve, Haïti',
          date: new Date().toISOString().split('T')[0],
          images: [
            {
              id: `img-${Date.now()}-${i}`,
              url: processed.isVideo ? (processed.thumbnailUrl || processed.url) : processed.url,
              caption: titleWithoutExt,
              type: 'standard'
            }
          ],
          hasBeforeAfter: false,
          isFeatured: true,
          client: 'Client Particulier'
        };

        StorageService.saveProject(newProj);
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);

      if (onProjectsUpdated) {
        onProjectsUpdated(StorageService.getProjects());
      }
    } catch (err) {
      console.error('Erreur lors du chargement des photos:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const confirmDeleteProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = StorageService.deleteProject(id);
    if (onProjectsUpdated) {
      onProjectsUpdated(updated);
    }
    setDeletingId(null);
  };

  const handleClearAllProjects = () => {
    projects.forEach(p => StorageService.deleteProject(p.id));
    if (onProjectsUpdated) {
      onProjectsUpdated([]);
    }
    setShowClearAllConfirm(false);
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleSliderChange = (projectId: string, value: number) => {
    setSliderPositions(prev => ({ ...prev, [projectId]: value }));
  };

  return (
    <section id="realisations" className="py-16 md:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hidden Native File Input targeting device camera / gallery / file picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#B6D232]/20 text-[#B6D232] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#B6D232]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galerie de Projets & Chantiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
            {t.subtitle}
          </p>

          {/* Device Import Action Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-white"
            >
              <Upload className="w-5 h-5 text-[#340648]" />
              <span className="text-sm">
                {isUploading ? 'Chargement depuis votre appareil...' : 'Importer des vidéos et Photos'}
              </span>
            </button>

            {projects.length > 0 && (
              showClearAllConfirm ? (
                <div className="flex items-center gap-2 bg-red-950/90 border border-red-500 px-4 py-2.5 rounded-2xl shadow-xl animate-fade-in">
                  <span className="text-xs text-red-200 font-bold">Supprimer toutes les {projects.length} réalisations ?</span>
                  <button
                    type="button"
                    onClick={handleClearAllProjects}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer shadow"
                  >
                    Oui, tout supprimer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearAllConfirm(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearAllConfirm(true)}
                  className="bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 font-bold px-4 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  title="Supprimer toutes les photos et réalisations"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer toutes les photos ({projects.length})</span>
                </button>
              )
            )}
          </div>

          {uploadSuccess && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-900/80 text-emerald-300 text-xs font-black px-4 py-2 rounded-xl border border-emerald-500 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vos photos et réalisations ont été importées avec succès depuis votre appareil !</span>
            </div>
          )}
        </div>

        {/* Category Filters */}
        {projects.length > 0 && (
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
        )}

        {/* Projects Grid or Empty State */}
        {projects.length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#B6D232]/20 text-[#B6D232] flex items-center justify-center mx-auto mb-4 border border-[#B6D232]/30">
              <ImageIcon className="w-8 h-8 text-[#B6D232]" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Aucune réalisation affichée pour le moment</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mb-6">
              Cliquez sur le bouton ci-dessous pour importer vos photos et vidéos de chantiers directement depuis votre appareil.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black px-6 py-3 rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Importer des vidéos et Photos</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => {
              const sliderPos = sliderPositions[project.id] ?? 50;

              return (
                <div
                  key={project.id}
                  className="bg-[#340648]/80 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl flex flex-col justify-between group relative"
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
                        {isVideoUrl(project.images[0]?.url) ? (
                          <video
                            src={project.images[0]?.url}
                            preload="metadata"
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={project.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'}
                            alt={project.title}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('unsplash')) {
                                target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 text-[#340648] p-3 rounded-full shadow-lg">
                            <Maximize2 className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delete button & in-app confirmation */}
                    {deletingId === project.id ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 z-30 bg-slate-950/95 border border-red-500/80 p-2.5 rounded-xl shadow-2xl flex flex-col gap-2 animate-fade-in"
                      >
                        <span className="text-[11px] font-bold text-white text-center">Supprimer cette photo ?</span>
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={(e) => confirmDeleteProject(project.id, e)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-lg cursor-pointer shadow"
                          >
                            Supprimer
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingId(null);
                            }}
                            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(project.id);
                        }}
                        className="absolute top-3 right-3 z-30 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer border border-white/30"
                        title="Supprimer cette réalisation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        )}

      </div>
    </section>
  );
};
