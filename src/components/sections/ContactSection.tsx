import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Navigation,
  Send,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { CompanySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { StorageService } from '../../services/storage';

interface ContactSectionProps {
  settings: CompanySettings;
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, lang }) => {
  const currentLang = (lang && TRANSLATIONS[lang]) ? lang : 'fr';
  const t = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr).contact;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone1 = settings.phone1.replace(/[^0-9+]/g, '');
  const cleanPhone2 = settings.phone2.replace(/[^0-9+]/g, '');
  const cleanPhone3 = settings.phone3.replace(/[^0-9+]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) return;

    StorageService.addMessage({
      fullName,
      email: email || 'contact@client.ht',
      phone,
      subject: subject || 'Demande d’information générale',
      message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#340648]/10 text-[#340648] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-[#340648]/20">
            <MapPin className="w-3.5 h-3.5 text-[#B6D232]" />
            <span>Nous Contacter & Localisation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#340648] tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Action Buttons Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {/* Call button */}
          <a
            href={`tel:${cleanPhone1}`}
            className="bg-[#340648] hover:bg-[#230331] text-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group border border-[#B6D232]"
          >
            <div className="w-10 h-10 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wide uppercase">{t.btnCall}</span>
            <span className="text-[11px] text-slate-300 font-medium mt-0.5">{settings.phone1}</span>
          </a>

          {/* WhatsApp button */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group border border-white/20"
          >
            <div className="w-10 h-10 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wide uppercase">{t.btnWhatsApp}</span>
            <span className="text-[11px] text-emerald-100 font-medium mt-0.5">Discussion directe</span>
          </a>

          {/* Email button */}
          <a
            href={`mailto:${settings.email}`}
            className="bg-[#340648] hover:bg-[#230331] text-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group border border-[#B6D232]"
          >
            <div className="w-10 h-10 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wide uppercase">{t.btnEmail}</span>
            <span className="text-[11px] text-slate-300 font-medium mt-0.5 truncate max-w-full">{settings.email}</span>
          </a>

          {/* GPS Directions button */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Route Nationale 2, Petit-Goâve, Haiti")}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] p-4 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group border border-[#340648]/20"
          >
            <div className="w-10 h-10 rounded-full bg-[#340648] text-[#B6D232] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wide uppercase">{t.btnDirections}</span>
            <span className="text-[11px] text-[#340648] font-bold mt-0.5">Borne Soldat</span>
          </a>
        </div>

        {/* 2-Column: Left Contact Details & Map | Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Coordinates + Google Maps Embed (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Info Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#340648] text-[#B6D232] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#340648] text-sm sm:text-base">
                    {t.addressTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
                    {settings.address}, {settings.addressDetails}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#340648] text-[#B6D232] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#340648] text-sm sm:text-base">
                    {t.phonesTitle}
                  </h4>
                  <div className="text-xs sm:text-sm font-black text-[#340648] mt-1 space-y-0.5">
                    <p>Ligne 1 : <span className="text-emerald-700">{settings.phone1}</span> (WhatsApp)</p>
                    <p>Ligne 2 : {settings.phone2}</p>
                    <p>Ligne 3 : {settings.phone3}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#340648] text-[#B6D232] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#340648] text-sm sm:text-base">
                    {t.hoursTitle}
                  </h4>
                  <p className="text-xs sm:text-sm font-black text-[#340648] mt-0.5">
                    {settings.openingHours.days} : {settings.openingHours.hours}
                  </p>
                  {settings.openingHours.note && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {settings.openingHours.note}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md">
              <div className="p-3 bg-[#340648] text-white flex items-center justify-between text-xs font-bold px-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B6D232]" />
                  <span>Emplacement : Petit-Goâve (Borne Soldat)</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Petit-Goâve, Haiti")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#B6D232] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Agrandir</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-64 sm:h-72 w-full bg-slate-200">
                <iframe
                  title="Google Maps Location - Petit-Goave"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?q=Petit-Goave%20Haiti&t=&z=14&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl">
            <h3 className="text-xl font-black text-[#340648] mb-2">
              Envoyez-nous un Message
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Une question sur un vitrage, une disponibilité de profilé alu ou un conseil technique ?
            </p>

            {submitted ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-[#340648] mb-2">
                  Message envoyé avec succès !
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {t.successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1">
                    {t.formName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#340648] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1">
                      {t.formPhone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(509) ...."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#340648] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1">
                      {t.formEmail}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemple.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#340648] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1">
                    {t.formSubject}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Devis pour vitres ou portes coulissantes"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#340648] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#340648] uppercase tracking-wider mb-1">
                    {t.formMessage} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#340648] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#340648] hover:bg-[#230331] text-white font-black py-3.5 rounded-xl text-xs sm:text-sm shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#B6D232]"
                >
                  <Send className="w-4 h-4 text-[#B6D232]" />
                  <span>{t.btnSend}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
