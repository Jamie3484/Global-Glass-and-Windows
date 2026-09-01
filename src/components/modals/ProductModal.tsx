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
  ChevronRight
} from 'lucide-react';
import { Product, ProductCategory, CompanySettings } from '../../types';

interface ProductModalProps {
  product: Product | null;
  categories: ProductCategory[];
  settings: CompanySettings;
  onClose: () => void;
  onOpenQuote: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  settings,
  onClose,
  onOpenQuote
}) => {
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const category = categories.find(c => c.id === product.categoryId);

  const images = product.images.length > 0
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', isPrimary: true }];

  const currentImg = images[activeImageIdx] || images[0];

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
          
          {/* Left: Image Gallery (6 cols) */}
          <div className="md:col-span-6 bg-slate-900 flex flex-col justify-between p-6">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={currentImg.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {category && (
                <div className="absolute top-3 left-3 bg-[#340648]/90 text-[#B6D232] text-xs font-black px-3 py-1 rounded-full border border-white/20">
                  {category.name}
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIdx === idx ? 'border-[#B6D232] scale-105' : 'border-white/20 opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Specifications (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
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
              </div>

              <h3 className="text-2xl font-black text-[#340648] mb-3 leading-snug">
                {product.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                {product.fullDescription || product.shortDescription}
              </p>

              {/* Price block if present */}
              {product.price && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Prix Indicatif</span>
                    <span className="text-2xl font-black text-[#340648]">
                      ${product.price} <span className="text-xs text-slate-500 font-normal">USD {product.priceUnit ? `/ ${product.priceUnit}` : ''}</span>
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Fabrication sur mesure</span>
                </div>
              )}

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
