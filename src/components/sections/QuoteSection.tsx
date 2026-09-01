import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  X,
  File,
  Sparkles,
  Phone,
  ShieldCheck,
  Send
} from 'lucide-react';
import { QuoteRequest, QuoteAttachment, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { StorageService } from '../../services/storage';

interface QuoteSectionProps {
  lang: Language;
  initialProductOrService?: string;
  initialDimensions?: {
    lengthInches?: number;
    widthInches?: number;
    areaSqFt?: number;
    glassType?: string;
    quantity?: number;
  };
  onSubmitSuccess?: () => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  lang,
  initialProductOrService = '',
  initialDimensions,
  onSubmitSuccess
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).quote;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Petit-Goâve');
  const [productOrService, setProductOrService] = useState(initialProductOrService || 'Portes & Fenêtres en Verre');
  const [lengthInches, setLengthInches] = useState<number | undefined>(initialDimensions?.lengthInches);
  const [widthInches, setWidthInches] = useState<number | undefined>(initialDimensions?.widthInches);
  const [quantity, setQuantity] = useState<number>(initialDimensions?.quantity || 1);
  const [glassType, setGlassType] = useState<string>(initialDimensions?.glassType || '');
  const [description, setDescription] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [attachments, setAttachments] = useState<QuoteAttachment[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle Drag and Drop / File upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const dataUrl = await StorageService.readFileAsDataURL(file);
        const newAttachment: QuoteAttachment = {
          id: `att-${Date.now()}-${i}`,
          name: file.name,
          url: dataUrl,
          size: file.size,
          type: file.type
        };
        setAttachments(prev => [...prev, newAttachment]);
      } catch (err) {
        console.error('File read error:', err);
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !description) return;

    setIsSubmitting(true);

    const calculatedArea = lengthInches && widthInches ? (lengthInches * widthInches) / 144 : undefined;

    StorageService.addQuoteRequest({
      fullName,
      phone,
      whatsapp: whatsapp || phone,
      email: email || undefined,
      address,
      city,
      productOrService,
      dimensions: {
        lengthInches,
        widthInches,
        areaSqFt: calculatedArea ? Number(calculatedArea.toFixed(2)) : undefined
      },
      quantity,
      glassType: glassType || undefined,
      description,
      budgetEstimate: budgetEstimate || undefined,
      attachments
    });

    setIsSubmitting(false);
    setSubmitted(true);
    onSubmitSuccess?.();
  };

  return (
    <section id="devis" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <FileText className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Devis Gratuit & Sans Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Form or Success Card */}
        {submitted ? (
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 text-center border-4 border-[#B6D232] shadow-xl">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#340648] mb-3">
              Demande transmise avec succès !
            </h3>
            <p className="text-sm sm:text-base text-slate-700 max-w-lg mx-auto leading-relaxed mb-8">
              {t.successMsg}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDescription('');
                  setAttachments([]);
                }}
                className="bg-[#340648] hover:bg-[#230331] text-white font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm cursor-pointer"
              >
                Nouvelle demande de devis
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-xl space-y-6"
          >
            {/* Row 1: Full Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Jean-Marc Célestin"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.city} *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Petit-Goâve, Grand-Goâve, Port-au-Prince"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            {/* Row 2: Phone & WhatsApp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(509) 4467-5506"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.whatsapp}
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(509) 3599-5664"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@exemple.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            {/* Row 3: Product/Service + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.productOrService} *
                </label>
                <select
                  value={productOrService}
                  onChange={(e) => setProductOrService(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white cursor-pointer"
                >
                  <option value="Portes & Fenêtres en Verre">Portes & Fenêtres en Verre</option>
                  <option value="Miroirs sur mesure">Miroirs sur mesure</option>
                  <option value="Vitres à la découpe">Vitres à la découpe</option>
                  <option value="Profilés & Barres Aluminium">Profilés & Barres Aluminium</option>
                  <option value="Doors Closeur / Ferme-Portes">Doors Closeur / Ferme-Portes</option>
                  <option value="Paroi & Cabine de Douche">Paroi & Cabine de Douche</option>
                  <option value="Accessoires & Vis">Accessoires & Vis</option>
                  <option value="Prise de mesures & Pose sur chantier">Prise de mesures & Pose sur chantier</option>
                  <option value="Autre projet spécifique">Autre projet spécifique</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.address}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Route Nationale #2, Borne Soldat"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            {/* Row 4: Dimensions & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Longueur (pouces)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 80"
                  value={lengthInches || ''}
                  onChange={(e) => setLengthInches(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Largeur (pouces)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 48"
                  value={widthInches || ''}
                  onChange={(e) => setWidthInches(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                {t.description} *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre besoin : type de finition, couleur d'aluminium souhaitée (blanc, bronze, noir), contraintes de pose, calendrier..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#340648] focus:outline-none text-xs sm:text-sm font-medium bg-white leading-relaxed"
              />
            </div>

            {/* Drag and drop file upload */}
            <div>
              <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                {t.files}
              </label>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#340648] rounded-2xl p-6 text-center bg-white cursor-pointer transition-colors group"
              >
                <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#340648] mx-auto mb-2 transition-colors" />
                <p className="text-xs sm:text-sm font-bold text-[#340648]">
                  Glissez-déposez vos photos/plans ici, ou cliquez pour parcourir
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Formats acceptés : JPG, PNG, PDF (Plusieurs fichiers autorisés)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Uploaded attachments preview */}
              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs text-slate-700"
                    >
                      <File className="w-3.5 h-3.5 text-[#340648]" />
                      <span className="font-medium truncate max-w-[150px]">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#340648] hover:bg-[#230331] text-white font-black py-4 px-6 rounded-2xl text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer border-2 border-[#B6D232]"
            >
              <Send className="w-5 h-5 text-[#B6D232]" />
              <span>{isSubmitting ? 'Transmission...' : t.submit}</span>
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
