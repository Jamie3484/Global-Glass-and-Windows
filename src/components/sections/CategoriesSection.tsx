import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  FileText,
  CheckCircle2,
  Filter,
  Tag,
  Camera,
  Video
} from 'lucide-react';
import { Product, ProductCategory, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { CommercialCard } from '../brand/CommercialCard';
import { scrollToSection } from '../../utils/scroll';

interface CategoriesSectionProps {
  categories: ProductCategory[];
  products: Product[];
  lang: Language;
  selectedCategorySlug?: string;
  onSelectCategorySlug?: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenQuote: (productName?: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  products,
  lang,
  selectedCategorySlug = 'all',
  onSelectCategorySlug,
  onSelectProduct,
  onOpenQuote
}) => {
  const [activeSlug, setActiveSlug] = useState<string>(selectedCategorySlug);
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).categories;

  useEffect(() => {
    if (selectedCategorySlug) {
      setActiveSlug(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  const handleTabChange = (slug: string, scrollDown: boolean = false) => {
    setActiveSlug(slug);
    onSelectCategorySlug?.(slug);
    if (scrollDown) {
      scrollToSection('category-filter-pills', 100);
    }
  };

  const filteredProducts = activeSlug === 'all'
    ? products.filter(p => p.status === 'published')
    : products.filter(p => {
        const cat = categories.find(c => c.slug === activeSlug);
        return p.status === 'published' && (cat ? p.categoryId === cat.id : true);
      });

  return (
    <section id="produits" className="py-16 md:py-24 bg-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <Layers className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Catalogue Officiel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Commercial Flyer Presentation Card */}
        <div className="mb-14">
          <CommercialCard
            categories={categories}
            onSelectCategory={(slug) => handleTabChange(slug, true)}
          />
        </div>

        {/* Category Filter Pills */}
        <div id="category-filter-pills" className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-mt-24">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
              activeSlug === 'all'
                ? 'bg-[#340648] text-white shadow-md border-2 border-[#B6D232]'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {t.all} ({products.filter(p => p.status === 'published').length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(p => p.categoryId === cat.id && p.status === 'published').length;
            const isActive = activeSlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#340648] text-white shadow-md border-2 border-[#B6D232]'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#B6D232] text-[#340648]' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => {
            const cat = categories.find(c => c.id === product.categoryId);
            const mainImg = product.images.find(i => i.isPrimary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Product Image */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    {mainImg.startsWith('data:video') || mainImg.startsWith('blob:') || /\.(mp4|webm|mov|m4v)/i.test(mainImg) ? (
                      <video
                        src={mainImg}
                        muted
                        preload="metadata"
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={mainImg}
                        alt={product.name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('unsplash')) {
                            target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                          }
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Category tag */}
                    {cat && (
                      <div className="absolute top-3 left-3 bg-[#340648]/90 backdrop-blur text-[#B6D232] font-black text-[11px] px-3 py-1 rounded-full shadow border border-white/20">
                        {cat.name}
                      </div>
                    )}

                    {product.isFeatured && (
                      <div className="absolute top-3 right-3 bg-[#B6D232] text-[#340648] font-black text-[10px] px-2.5 py-1 rounded-full shadow flex items-center gap-1 border border-white">
                        <Sparkles className="w-3 h-3" />
                        <span>Vedette</span>
                      </div>
                    )}

                    {/* Media indicator badge (photos & videos) */}
                    {((product.images && product.images.length > 1) || (product.videos && product.videos.length > 0) || product.videoUrl) && (
                      <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-2 border border-white/20 shadow">
                        {product.images && product.images.length > 1 && (
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#B6D232]" />
                            <span>{product.images.length}</span>
                          </span>
                        )}
                        {((product.videos && product.videos.length > 0) || product.videoUrl) && (
                          <span className="flex items-center gap-1 text-red-400">
                            <Video className="w-3 h-3 text-red-400" />
                            <span>{product.videos?.length || 1}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-lg font-black text-[#340648] hover:text-[#51106e] leading-snug cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {product.shortDescription}
                    </p>

                    {/* Features list */}
                    {product.features && product.features.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                        {product.features.slice(0, 2).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B6D232] flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Actions */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#340648] bg-[#B6D232]/30 px-2.5 py-1 rounded-lg">
                        Sur Mesure
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#340648] transition-colors"
                        title="Voir la fiche complète"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenQuote(product.name)}
                        className="bg-[#340648] hover:bg-[#230331] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer border border-[#B6D232]"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#B6D232]" />
                        <span>Devis</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-base font-bold text-slate-600">Aucun produit dans cette catégorie pour le moment.</p>
            <button
              onClick={() => handleTabChange('all')}
              className="mt-4 bg-[#340648] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs"
            >
              Afficher tous les produits
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
