import React, { useState } from 'react';
import { Video, Play, Calendar, Tag, Sparkles } from 'lucide-react';
import { VideoItem, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface VideosSectionProps {
  videos: VideoItem[];
  lang: Language;
}

export const VideosSection: React.FC<VideosSectionProps> = ({ videos, lang }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).videos;

  const publishedVideos = videos.filter(v => v.status === 'published');

  return (
    <section id="videos" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <Video className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Médiathèque Vidéo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedVideos.map((video) => (
            <div
              key={video.id}
              className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Video Thumbnail with Play overlay */}
                <div
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#340648]/90 text-[#B6D232] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow border border-white/20">
                    {video.category}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{video.date}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedVideo(video)}
                    className="text-lg font-black text-[#340648] hover:text-[#51106e] leading-snug mb-2 cursor-pointer transition-colors"
                  >
                    {video.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="w-full bg-[#340648] hover:bg-[#230331] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#B6D232]"
                >
                  <Play className="w-3.5 h-3.5 text-[#B6D232]" />
                  <span>Regarder la vidéo</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Video Player Modal */}
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
                className="text-white hover:text-[#B6D232] font-black text-sm px-2 py-1 bg-white/10 rounded-lg"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {selectedVideo.videoUrl.includes('embed') || selectedVideo.videoUrl.includes('youtube') ? (
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>

            <div className="p-4 bg-slate-900 text-slate-300 text-xs sm:text-sm">
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
