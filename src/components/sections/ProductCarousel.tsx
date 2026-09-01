import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  FileText,
  Sparkles,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductCategory, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface ProductCarouselProps {
  products: Product[];
  categories: ProductCategory[];
  lang: Language;
  onSelectProduct: (product: Product) => void;
  onOpenQuote: (productName?: string) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  categories,
  lang,
  onSelectProduct,
  onOpenQuote
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).carousel;

  // Filter products for carousel (featured or show on home)
  const carouselItems = products.filter(p => p.showOnHome && p.status === 'published');
  const items = carouselItems.length > 0 ? carouselItems : products.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const slideInterval = useRef<any>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPlaying && items.length > 1) {
      slideInterval.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [isPlaying, currentIndex, items.length]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (items.length === 0) return null;

  const current = items[currentIndex];
  const currentCategory = categories.find(c => c.id === current.categoryId);
  const mainImage = current.images.find(img => img.isPrimary)?.url || current.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="py-12 md:py-16 bg-slate-900 text-white relative overflow-hidden border-y-4 border-[#B6D232]">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#B6D232]/20 text-[#B6D232] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#B6D232]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carrousel Officiel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase">
              {t.title}
            </h2>
            <p className="text-sm text-slate-300 font-medium mt-1">
              {t.subtitle}
            </p>
          </div>

          {/* Controls: Play/Pause + Prev/Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              title={isPlaying ? "Mettre en pause" : "Lancer le défilement"}
              aria-label="Pause ou lecture"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#B6D232]" /> : <Play className="w-4 h-4 text-[#B6D232]" />}
            </button>

            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-bold transition-colors"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Showcase Card */}
        <div
          className="relative rounded-3xl bg-[#340648] border-2 border-white/20 shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            
            {/* Image Side (7 cols on desktop) */}
            <div className="lg:col-span-7 relative overflow-hidden group">
              <div className="h-64 sm:h-80 lg:h-full w-full relative">
                <img
                  key={current.id}
                  src={mainImage}
                  alt={current.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in zoom-in-95 duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#340648] via-transparent to-transparent opacity-90 lg:opacity-60" />
              </div>

              {/* Category pill on image */}
              {currentCategory && (
                <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur text-[#B6D232] font-black text-xs px-3 py-1.5 rounded-full border border-[#B6D232]/40 shadow flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{currentCategory.name}</span>
                </div>
              )}

              {/* Price badge if available */}
              {current.price && (
                <div className="absolute bottom-4 left-4 bg-[#B6D232] text-[#340648] font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg border border-white">
                  À partir de ${current.price} USD {current.priceUnit ? `/ ${current.priceUnit}` : ''}
                </div>
              )}
            </div>

            {/* Information Side (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-[#340648] to-[#230331]">
              <div>
                <div className="text-xs font-bold text-[#B6D232] uppercase tracking-widest mb-1">
                  Produit {currentIndex + 1} / {items.length}
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-3">
                  {current.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-6">
                  {current.shortDescription}
                </p>

                {/* Key features bullets */}
                {current.features && current.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {current.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#B6D232] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectProduct(current)}
                  className="bg-white hover:bg-slate-100 text-[#340648] font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.viewProduct}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenQuote(current.name)}
                  className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-1.5 cursor-pointer border border-[#340648]/30"
                >
                  <FileText className="w-4 h-4" />
                  <span>Demander un devis</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Dots Indicator Bar */}
          <div className="bg-black/40 py-2.5 px-4 flex items-center justify-center gap-2 border-t border-white/10">
            {items.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#B6D232]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
