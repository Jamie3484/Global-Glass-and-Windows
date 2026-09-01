import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface CalculatorSectionProps {
  settings: CompanySettings;
  lang: Language;
  onTransferToQuote: (data: {
    lengthInches: number;
    widthInches: number;
    quantity: number;
    glassType: string;
    areaSqFt: number;
    estimatedCost: number;
  }) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  settings,
  lang,
  onTransferToQuote
}) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).calculator;

  const [lengthInches, setLengthInches] = useState<number>(48);
  const [widthInches, setWidthInches] = useState<number>(36);
  const [quantity, setQuantity] = useState<number>(1);
  const [glassTypeKey, setGlassTypeKey] = useState<keyof CompanySettings['glassPricePerSqFt']>('clear6mm');

  const glassOptions: { key: keyof CompanySettings['glassPricePerSqFt']; label: string; desc: string }[] = [
    { key: 'clear6mm', label: 'Verre Clair 6mm', desc: 'Fenêtres standards & impostes' },
    { key: 'clear8mm', label: 'Verre Clair 8mm', desc: 'Portes & cloisons' },
    { key: 'clear10mm', label: 'Verre Clair 10mm', desc: 'Grandes baies & vitrines' },
    { key: 'clear12mm', label: 'Verre Clair 12mm Extra-Épais', desc: 'Structures lourdes' },
    { key: 'tintedBronze', label: 'Verre Teinté Bronze 6mm', desc: 'Protection solaire élégante' },
    { key: 'tintedGrey', label: 'Verre Fumé Gris 6mm', desc: 'Style moderne & intimité' },
    { key: 'mirror4mm', label: 'Miroir Argenté 4mm', desc: 'Mural & placards' },
    { key: 'mirror6mm', label: 'Miroir HD Biseauté 6mm', desc: 'Salles de bain & prestige' },
    { key: 'laminated6mm', label: 'Verre Feuilleté Sécurité 6mm (33.2)', desc: 'Anti-effraction' },
    { key: 'tempered10mm', label: 'Verre Trempé Sécurit 10mm', desc: 'Douches & garde-corps' },
  ];

  // Price calculations
  const pricePerSqFt = settings.glassPricePerSqFt[glassTypeKey] || 5.0;
  const singleAreaSqFt = (lengthInches * widthInches) / 144;
  const totalAreaSqFt = singleAreaSqFt * quantity;
  const totalEstimatedCost = totalAreaSqFt * pricePerSqFt;

  const selectedOption = glassOptions.find(o => o.key === glassTypeKey);

  const handleTransfer = () => {
    onTransferToQuote({
      lengthInches,
      widthInches,
      quantity,
      glassType: selectedOption ? selectedOption.label : 'Verre sur mesure',
      areaSqFt: Number(totalAreaSqFt.toFixed(2)),
      estimatedCost: Math.round(totalEstimatedCost)
    });
  };

  return (
    <section id="calculateur" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <Calculator className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Outil d'Estimation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#340648] overflow-hidden max-w-5xl mx-auto">
          
          {/* Formula Banner */}
          <div className="bg-[#340648] text-white px-6 py-3.5 border-b-2 border-[#B6D232] flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B6D232]" />
              <span className="text-[#B6D232]">{t.formula}</span>
            </div>
            <span className="text-slate-300 text-xs hidden sm:inline">Petit-Goâve • Haïti</span>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dimensions: Length x Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                    {t.lengthLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={lengthInches}
                      onChange={(e) => setLengthInches(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#340648] focus:outline-none text-base font-black text-[#340648]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      pouces (in)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ≈ {(lengthInches * 2.54).toFixed(1)} cm
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                    {t.widthLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={widthInches}
                      onChange={(e) => setWidthInches(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#340648] focus:outline-none text-base font-black text-[#340648]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      pouces (in)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ≈ {(widthInches * 2.54).toFixed(1)} cm
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.quantityLabel}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-32 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#340648] focus:outline-none text-base font-black text-[#340648]"
                  />
                  <div className="flex gap-1.5">
                    {[1, 2, 4, 6, 10].map(qty => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setQuantity(qty)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          quantity === qty
                            ? 'bg-[#340648] text-[#B6D232]'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {qty}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glass Type Picker */}
              <div>
                <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1.5">
                  {t.glassTypeLabel}
                </label>
                <select
                  value={glassTypeKey}
                  onChange={(e) => setGlassTypeKey(e.target.value as any)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#340648] focus:outline-none text-sm font-bold text-[#340648] bg-white cursor-pointer"
                >
                  {glassOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} (${settings.glassPricePerSqFt[opt.key] || 5}/pi²) — {opt.desc}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Live Calculation Results Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#340648] to-[#230331] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#B6D232] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Résultat du Calcul
                  </span>
                  <span className="text-xs font-black bg-[#B6D232] text-[#340648] px-2.5 py-0.5 rounded-full">
                    Formule GGW
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{t.calculatedArea} :</span>
                    <span className="font-bold text-white text-sm">
                      {singleAreaSqFt.toFixed(2)} pi²
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{t.totalArea} ({quantity}x) :</span>
                    <span className="font-extrabold text-[#B6D232] text-base">
                      {totalAreaSqFt.toFixed(2)} pi²
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Tarif unitaire verre :</span>
                    <span className="font-bold text-white">
                      ${pricePerSqFt.toFixed(2)} USD / pi²
                    </span>
                  </div>
                </div>

                {/* Big Estimated Price */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center mb-6">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    {t.estimatedCost}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-[#B6D232] my-1">
                    ≈ ${Math.round(totalEstimatedCost)} <span className="text-base text-white font-normal">USD</span>
                  </div>
                  <span className="text-[10px] text-slate-300 italic">
                    (Hors découpe spéciale, pose ou accessoires)
                  </span>
                </div>
              </div>

              {/* Action: Transfer into Quote */}
              <div>
                <button
                  onClick={handleTransfer}
                  className="w-full bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
                >
                  <FileText className="w-4 h-4 text-[#340648]" />
                  <span>{t.transferToQuote}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Official Disclaimer Footer */}
          <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#340648] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.disclaimer}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
