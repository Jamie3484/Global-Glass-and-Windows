import React, { useState } from 'react';
import { Video, Film, Play, Eye, Sparkles } from 'lucide-react';
import { VideoItem, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface VideosSectionProps {
  videos: VideoItem[];
  lang: Language;
  onVideosUpdated?: (updatedVideos: VideoItem[]) => void;
}

export const VideosSection: React.FC<VideosSectionProps> = ({ videos, lang }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

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

  return (
    <section id="videos" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>

        {/* Media Grid or Empty State */}
        {videos.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#340648]/10 text-[#340648] flex items-center justify-center mx-auto mb-4 border border-[#340648]/20">
              <Film className="w-8 h-8 text-[#340648]" />
            </div>
            <h3 className="text-lg font-black text-[#340648] mb-2">Nos vidéos et photos de réalisations</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Découvrez prochainement de nouvelles vidéos d'installation et de fabrication sur mesure dans nos ateliers.
            </p>
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
