import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Tag,
  CheckCircle2,
  Phone,
  MessageCircle,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Video,
  Play
} from 'lucide-react';
import { Product, ProductCategory, CompanySettings, ProductImage, ProductVideo } from '../../types';

interface ProductModalProps {
  product: Product | null;
  categories: ProductCategory[];
  settings: CompanySettings;
  onClose: () => void;
  onOpenQuote: (productName: string) => void;
}

type MediaItem = 
  | { type: 'image'; id: string; url: string; alt: string; caption?: string }
  | { type: 'video'; id: string; url: string; title?: string };

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  settings,
  onClose,
  onOpenQuote
}) => {
  if (!product) return null;

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const category = categories.find(c => c.id === product.categoryId);

  const rawImages = product.images && product.images.length > 0
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: product.name, order: 0 }];

  const rawVideos: ProductVideo[] = [
    ...(product.videos || []),
    ...(product.videoUrl && !(product.videos || []).some(v => v.url === product.videoUrl)
      ? [{ id: 'vid-default', url: product.videoUrl, title: 'Vidéo de démonstration' }]
      : [])
  ];

  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.startsWith('data:video') ||
      lower.startsWith('blob:') ||
      /\.(mp4|webm|mov|m4v|ogg|3gp)/i.test(lower) ||
      lower.includes('youtube.com') ||
      lower.includes('youtu.be') ||
      lower.includes('vimeo.com')
    );
  };

  const mediaList: MediaItem[] = [
    ...rawImages.map((img, i) => ({
      type: isVideoUrl(img.url) ? ('video' as const) : ('image' as const),
      id: img.id || `img-${i}`,
      url: img.url,
      alt: img.alt || product.name,
      caption: img.caption
    })),
    ...rawVideos.map((vid, i) => ({
      type: 'video' as const,
      id: vid.id || `vid-${i}`,
      url: vid.url,
      title: vid.title || 'Vidéo produit'
    }))
  ];

  const currentMedia = mediaList[activeMediaIdx] || mediaList[0];

  const isEmbedVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return url;
  };

  const cleanWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Bonjour, je souhaite des informations sur le produit : ${product.name}`)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border-4 border-[#340648] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Media Gallery (6 cols) */}
          <div className="md:col-span-6 bg-slate-900 flex flex-col justify-between p-6">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {currentMedia.type === 'video' ? (
                isEmbedVideo(currentMedia.url) ? (
                  <iframe
                    src={getEmbedUrl(currentMedia.url)}
                    title={currentMedia.title || 'Vidéo produit'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    playsInline
                    src={currentMedia.url}
                    className="w-full h-full object-contain"
                  >
                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                  </video>
                )
              ) : (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.alt}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('unsplash')) {
                      target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Navigation Arrows if multiple media */}
              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIdx(prev => (prev === 0 ? mediaList.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                    aria-label="Précédent"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIdx(prev => (prev === mediaList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                    aria-label="Suivant"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {category && (
                  <div className="bg-[#340648]/90 text-[#B6D232] text-xs font-black px-3 py-1 rounded-full border border-white/20">
                    {category.name}
                  </div>
                )}
                {currentMedia.type === 'video' && (
                  <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Video className="w-3 h-3" />
                    Vidéo
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail list with image and video indicators */}
            {mediaList.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {mediaList.map((media, idx) => (
                  <button
                    key={media.id || idx}
                    onClick={() => setActiveMediaIdx(idx)}
                    className={`relative w-16 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-800 ${
                      activeMediaIdx === idx ? 'border-[#B6D232] scale-105 ring-2 ring-[#B6D232]/50' : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-purple-950 text-white">
                        <Play className="w-5 h-5 text-[#B6D232] fill-[#B6D232]" />
                        <span className="text-[9px] font-bold tracking-tighter text-[#B6D232]">VIDÉO</span>
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt=""
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('unsplash')) {
                            target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80';
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Specifications (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {product.isFeatured && (
                  <span className="bg-[#B6D232] text-[#340648] font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Produit Vedette
                  </span>
                )}
                {product.isAvailable && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Disponible en atelier
                  </span>
                )}
                {mediaList.length > 1 && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {mediaList.filter(m => m.type === 'image').length} photos • {mediaList.filter(m => m.type === 'video').length} vidéos
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-[#340648] mb-3 leading-snug">
                {product.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                {product.fullDescription || product.shortDescription}
              </p>

              {/* Custom Quote Notice (Price calculation option removed) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Tarification</span>
                  <span className="text-base sm:text-lg font-black text-[#340648]">
                    Sur Devis Personnalisé
                  </span>
                </div>
                <span className="text-xs font-bold text-[#340648] bg-[#B6D232]/40 px-3 py-1 rounded-full">
                  Fabrication sur mesure
                </span>
              </div>

              {/* Features bullets */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-black text-[#340648] uppercase tracking-wider mb-2">
                    Points forts & Caractéristiques
                  </h4>
                  <div className="space-y-2">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-black text-[#340648] uppercase tracking-wider mb-2">
                    Spécifications Techniques
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-slate-600">
                        <span className="font-bold text-slate-800">{k}:</span>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenQuote(product.name);
                }}
                className="flex-1 bg-[#340648] hover:bg-[#230331] text-white font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#B6D232]"
              >
                <FileText className="w-4 h-4 text-[#B6D232]" />
                <span>Demander un devis</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
