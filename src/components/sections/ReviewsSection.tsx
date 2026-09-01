import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Send,
  Sparkles,
  X,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { CommentReview, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface ReviewsSectionProps {
  reviews: CommentReview[];
  lang: Language;
  onSubmitReview: (review: Omit<CommentReview, 'id' | 'status' | 'date'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  lang,
  onSubmitReview
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [projectType, setProjectType] = useState('Portes & Fenêtres');

  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).reviews;

  // Only display approved reviews
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !comment) return;

    onSubmitReview({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      rating,
      comment,
      isFeatured: false,
      projectType
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRating(5);
      setComment('');
    }, 2500);
  };

  return (
    <section id="avis" className="py-16 md:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
              <Star className="w-3.5 h-3.5 fill-[#B6D232] text-[#B6D232]" />
              <span>Retours d'Expérience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
              {t.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              {t.subtitle}
            </p>
          </div>

          {/* Rating Summary + CTA */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-center pr-4 border-r border-slate-200">
              <span className="text-3xl font-black text-[#340648]">{averageRating}</span>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-[#B6D232] text-[#B6D232]" />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                {approvedReviews.length} avis vérifiés
              </span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#340648] hover:bg-[#230331] text-white font-extrabold px-5 py-3 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-[#B6D232]"
            >
              <MessageSquare className="w-4 h-4 text-[#B6D232]" />
              <span>{t.leaveReview}</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col justify-between"
            >
              <div>
                {/* Header with stars & date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'fill-[#B6D232] text-[#B6D232]'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#340648] text-[#B6D232] font-black text-sm flex items-center justify-center">
                    {rev.firstName.charAt(0)}{rev.lastName ? rev.lastName.charAt(0) : ''}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#340648] text-xs sm:text-sm leading-tight">
                      {rev.firstName} {rev.lastName}
                    </h4>
                    {rev.projectType && (
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        {rev.projectType}
                      </span>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Vérifié</span>
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Leave Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border-4 border-[#340648] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-[#340648] mb-2">
                  Merci pour votre avis !
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {t.reviewPendingNotice}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#340648]">
                    {t.leaveReview}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Partagez votre expérience avec GLOBAL GLASS AND WINDOWS
                  </p>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Votre Note Globale
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-[#B6D232] text-[#B6D232]'
                              : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-[#340648] ml-2">
                      {rating} / 5 étoiles
                    </span>
                  </div>
                </div>

                {/* Name Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Jean"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#340648]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Baptiste"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#340648]"
                    />
                  </div>
                </div>

                {/* Contact info (optional) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone (Optionnel)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(509) ...."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#340648]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Type de Projet
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#340648] bg-white"
                    >
                      <option value="Portes & Fenêtres">Portes & Fenêtres</option>
                      <option value="Miroirs">Miroirs</option>
                      <option value="Cabine de Douche">Cabine de Douche</option>
                      <option value="Vitrage & Façade">Vitrage & Façade</option>
                      <option value="Aluminium & Accessoires">Aluminium & Accessoires</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Comment Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Votre Commentaire *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Décrivez votre expérience, la qualité des finitions, le respect des délais..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-[#340648]"
                  />
                </div>

                {/* Moderation note */}
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800 font-medium">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Chaque avis est vérifié par nos modérateurs avant publication pour garantir des avis authentiques.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#340648] hover:bg-[#230331] text-white font-black py-3.5 rounded-xl text-xs sm:text-sm shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#B6D232]"
                >
                  <Send className="w-4 h-4 text-[#B6D232]" />
                  <span>{t.submitReview}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
