import React, { useRef, useState } from 'react';
import { Video, Upload, Image, Film, Plus, Trash2, CheckCircle2, Play, Eye, Sparkles } from 'lucide-react';
import { VideoItem, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { StorageService } from '../../services/storage';
import { processImportedFile } from '../../services/mediaService';

interface VideosSectionProps {
  videos: VideoItem[];
  lang: Language;
  onVideosUpdated?: (updatedVideos: VideoItem[]) => void;
}

export const VideosSection: React.FC<VideosSectionProps> = ({ videos, lang, onVideosUpdated }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).videos;

  const isMediaVideo = (item: VideoItem) => {
    const url = (item.videoUrl || '').toLowerCase();
    return (
      url.startsWith('data:video') ||
      url.startsWith('blob:') ||
      /\.(mp4|webm|mov|m4v|ogg|3gp)/i.test(url) ||
      url.includes('youtube') ||
      url.includes('youtu.be') ||
      url.includes('vimeo') ||
      (item.category as string) === 'atelier' ||
      (item.category as string) === 'installation'
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const newItems: VideoItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await processImportedFile(file);

        const newItem: VideoItem = {
          id: `media-${Date.now()}-${i}`,
          title: processed.name || (processed.isVideo ? 'Vidéo Importée' : 'Photo Importée'),
          description: `Média importé directement depuis votre appareil (${(file.size / (1024 * 1024)).toFixed(2)} Mo).`,
          thumbnailUrl: processed.thumbnailUrl || (processed.isVideo ? '' : processed.url),
          videoUrl: processed.url,
          category: processed.isVideo ? 'fabrication' : 'presentation',
          date: new Date().toISOString().split('T')[0],
          status: 'published',
          order: videos.length + i + 1
        };

        StorageService.saveVideo(newItem);
        newItems.push(newItem);
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);

      if (onVideosUpdated) {
        onVideosUpdated(StorageService.getVideos());
      }
    } catch (err) {
      console.error('Erreur lors du chargement des fichiers:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const confirmDeleteMedia = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = StorageService.deleteVideo(id);
    if (onVideosUpdated) {
      onVideosUpdated(updated);
    }
    setDeletingId(null);
  };

  const handleClearAllMedia = () => {
    videos.forEach(v => StorageService.deleteVideo(v.id));
    if (onVideosUpdated) {
      onVideosUpdated([]);
    }
    setShowClearAllConfirm(false);
  };

  return (
    <section id="videos" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hidden Native File Input targeting device camera / gallery / file picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <Film className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Médiathèque & Captures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>

          {/* Device Import Action Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-[#340648] hover:bg-[#230331] text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-[#B6D232]"
            >
              <Upload className="w-5 h-5 text-[#B6D232]" />
              <span className="text-sm">
                {isUploading ? 'Chargement depuis votre appareil...' : 'Importer des vidéos et Photos'}
              </span>
            </button>

            {videos.length > 0 && (
              showClearAllConfirm ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-300 px-4 py-2.5 rounded-2xl shadow-lg animate-fade-in">
                  <span className="text-xs text-red-800 font-bold">Supprimer tous les {videos.length} médias ?</span>
                  <button
                    type="button"
                    onClick={handleClearAllMedia}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer shadow"
                  >
                    Oui, tout supprimer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearAllConfirm(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearAllConfirm(true)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  title="Supprimer toutes les vidéos et photos"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer tous les médias ({videos.length})</span>
                </button>
              )
            )}
          </div>

          {uploadSuccess && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-2 rounded-xl border border-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Vos fichiers ont été importés avec succès depuis votre appareil !</span>
            </div>
          )}
        </div>

        {/* Media Grid or Empty State */}
        {videos.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#340648]/10 text-[#340648] flex items-center justify-center mx-auto mb-4 border border-[#340648]/20">
              <Film className="w-8 h-8 text-[#340648]" />
            </div>
            <h3 className="text-lg font-black text-[#340648] mb-2">Aucun média affiché pour le moment</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">
              Cliquez sur le bouton ci-dessous pour charger des vidéos ou des photos directement depuis votre téléphone ou ordinateur.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((item) => {
              const isVideo = isMediaVideo(item);
              
              return (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Media Thumbnail */}
                    <div
                      onClick={() => setSelectedVideo(item)}
                      className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent && isVideo) {
                              e.currentTarget.style.display = 'none';
                            }
                          }}
                        />
                      ) : isVideo ? (
                        <video
                          src={item.videoUrl}
                          preload="metadata"
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <img
                          src={item.videoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                      )}
                      
                      {/* Overlay action */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white">
                          {isVideo ? <Play className="w-5 h-5 fill-current translate-x-0.5" /> : <Eye className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 bg-[#340648]/90 text-[#B6D232] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow border border-white/20">
                        {isVideo ? 'Vidéo' : 'Photo'}
                      </div>

                      {/* Delete button & in-app confirmation */}
                      {deletingId === item.id ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-3 right-3 z-30 bg-slate-950/95 border border-red-500/80 p-2.5 rounded-xl shadow-2xl flex flex-col gap-2 animate-fade-in"
                        >
                          <span className="text-[10px] font-bold text-white text-center">Supprimer ce média ?</span>
                          <div className="flex items-center gap-1.5 justify-center">
                            <button
                              type="button"
                              onClick={(e) => confirmDeleteMedia(item.id, e)}
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
                            setDeletingId(item.id);
                          }}
                          className="absolute top-3 right-3 z-30 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer border border-white/30"
                          title="Supprimer ce média"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Media Info */}
                    <div className="p-6">
                      <h3
                        onClick={() => setSelectedVideo(item)}
                        className="text-base sm:text-lg font-black text-[#340648] hover:text-[#51106e] leading-snug mb-2 cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="flex-1 bg-[#340648] hover:bg-[#230331] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#B6D232]"
                    >
                      {isVideo ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-[#B6D232]" />
                          <span>Visionner la vidéo</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#B6D232]" />
                          <span>Afficher la photo</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Media Player / Viewer Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-black rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full border-2 border-[#B6D232]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#340648] text-white flex items-center justify-between">
              <h4 className="font-extrabold text-sm sm:text-base truncate pr-4 text-[#B6D232]">
                {selectedVideo.title}
              </h4>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-white hover:text-[#B6D232] font-black text-sm px-3 py-1 bg-white/10 rounded-lg cursor-pointer"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {selectedVideo.videoUrl?.includes('embed') ||
              selectedVideo.videoUrl?.includes('youtube') ||
              selectedVideo.videoUrl?.includes('youtu.be') ||
              selectedVideo.videoUrl?.includes('vimeo') ? (
                <iframe
                  src={
                    selectedVideo.videoUrl.includes('watch?v=')
                      ? selectedVideo.videoUrl.replace('watch?v=', 'embed/')
                      : selectedVideo.videoUrl.includes('youtu.be/')
                      ? selectedVideo.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                      : selectedVideo.videoUrl
                  }
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isMediaVideo(selectedVideo) ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-full"
                >
                  Votre navigateur ne supporte pas la lecture directe de cette vidéo.
                </video>
              ) : (
                <img
                  src={selectedVideo.videoUrl || selectedVideo.thumbnailUrl}
                  alt={selectedVideo.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            <div className="p-4 bg-slate-900 text-slate-300 text-xs sm:text-sm flex items-center justify-between">
              <p>{selectedVideo.description}</p>
              <button
                onClick={() => setSelectedVideo(null)}
                className="bg-[#B6D232] text-[#340648] font-black text-xs px-4 py-2 rounded-xl cursor-pointer hover:bg-[#a3be27]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
