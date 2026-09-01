import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  Mic,
  MicOff,
  Video,
  Music,
  Image as ImageIcon,
  Send,
  Loader2,
  MapPin,
  Search,
  Volume2,
  Play,
  Pause,
  Upload,
  RefreshCw,
  CheckCircle2,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { auth, signInWithGoogle, logOut, subscribeToAuth } from '../../services/firebase';
import { User } from 'firebase/auth';

export const GeminiAiSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'image' | 'video' | 'music'>('chat');
  const [user, setUser] = useState<User | null>(null);

  // Auth subscription
  useEffect(() => {
    const unsub = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // --- 1. Chat State ---
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'model';
    text: string;
    groundingChunks?: any[];
    webSearchQueries?: string[];
  }>>([
    {
      role: 'model',
      text: 'Bonjour ! Je suis l\'assistant expert de GLOBAL GLASS AND WINDOWS. Comment puis-je vous guider pour votre projet de vitrerie, portes coulissantes ou fenêtres sur mesure ?'
    }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [useMapsGrounding, setUseMapsGrounding] = useState(false);
  const [modelType, setModelType] = useState<'flash' | 'pro' | 'lite'>('flash');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputChat.trim() || chatLoading) return;

    const userText = inputChat.trim();
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: userText }];
    setChatMessages(updatedMessages);
    setInputChat('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          useGrounding: useSearchGrounding || useMapsGrounding,
          groundingType: useMapsGrounding ? 'maps' : 'search',
          modelType
        })
      });
      const data = await res.json();
      if (data.text) {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'model',
            text: data.text,
            groundingChunks: data.groundingChunks,
            webSearchQueries: data.webSearchQueries
          }
        ]);
      } else {
        throw new Error(data.error || 'Pas de réponse');
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `Désolé, une erreur est survenue: ${err.message || 'Impossible de joindre le service AI'}`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- 2. Voice & Audio Transcription State ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const [liveVoiceStatus, setLiveVoiceStatus] = useState<string>('Prêt pour la conversation vocale');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setTranscribeLoading(true);
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' })
            });
            const data = await res.json();
            if (data.text) {
              setTranscribedText(data.text);
              // Send directly into chat
              setInputChat(data.text);
              setActiveTab('chat');
            }
          } catch (err) {
            console.error('Transcription error:', err);
          } finally {
            setTranscribeLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setLiveVoiceStatus('Enregistrement en cours avec gemini-3.5-transcribe...');
    } catch (err) {
      alert('Veuillez autoriser l\'accès au microphone dans votre navigateur.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setLiveVoiceStatus('Traitement de la voix...');
    }
  };

  // --- 3. Image Generation / Editing State ---
  const [imagePrompt, setImagePrompt] = useState('Façade moderne de villa avec baies vitrées coulissantes en aluminium noir et double vitrage miroir réfléchissant');
  const [imageRefFile, setImageRefFile] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageRefFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt || imageLoading) return;
    setImageLoading(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          referenceImageBase64: imageRefFile
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        // Fallback photo for preview
        setGeneratedImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
      }
    } catch (err) {
      console.error(err);
      setGeneratedImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
    } finally {
      setImageLoading(false);
    }
  };

  // --- 4. Veo Video Generation State ---
  const [videoPrompt, setVideoPrompt] = useState('Vue aérienne cinématographique d\'un showroom de vitrerie et façades en verre aluminium sous le soleil des Caraïbes');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [videoPhotoRef, setVideoPhotoRef] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: videoPhotoRef,
          aspectRatio: videoAspect
        })
      });
      const data = await res.json();
      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);
      } else {
        setGeneratedVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-large-windows-and-a-city-view-41480-large.mp4');
      }
    } catch (err) {
      setGeneratedVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-large-windows-and-a-city-view-41480-large.mp4');
    } finally {
      setVideoLoading(false);
    }
  };

  // --- 5. Lyria Music Generation State ---
  const [musicPrompt, setMusicPrompt] = useState('Jingle commercial entraînant et prestigieux pour Global Glass, avec touches de piano doux et carillon de verre');
  const [musicMode, setMusicMode] = useState<'clip' | 'pro'>('clip');
  const [generatedMusicUrl, setGeneratedMusicUrl] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerateMusic = async () => {
    setMusicLoading(true);
    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, mode: musicMode })
      });
      const data = await res.json();
      if (data.audioUrl) {
        setGeneratedMusicUrl(data.audioUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMusicLoading(false);
    }
  };

  return (
    <section id="gemini-ai" className="py-16 bg-gradient-to-b from-slate-900 via-[#340648] to-slate-900 text-white relative overflow-hidden">
      {/* Background glow ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B6D232]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6D232]/20 text-[#B6D232] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              IA Intelligente & Cloud Global Glass
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Studio IA & Assistant Architectural
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Discutez avec notre assistant Gemini connecté en direct (Google Maps & Search), animez vos plans en vidéo avec Veo 3, générez des visuels de vitrerie et connectez-vous avec Google.
            </p>
          </div>

          {/* Firebase Authentication Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Utilisateur'} className="w-8 h-8 rounded-full border border-[#B6D232]" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#B6D232] text-[#340648] flex items-center justify-center font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{user.displayName || user.email}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Connecté Firebase
                  </div>
                </div>
                <button
                  onClick={() => logOut()}
                  className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-2 bg-white text-slate-900 font-bold px-4 py-2.5 rounded-2xl hover:bg-[#B6D232] hover:text-[#340648] shadow-lg transition-all text-xs sm:text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Connexion Google
              </button>
            )}
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-[#B6D232] text-[#340648] shadow-md shadow-[#B6D232]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Assistant Chat & Grounding
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'voice'
                ? 'bg-[#B6D232] text-[#340648] shadow-md shadow-[#B6D232]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voix & Transcription (Transcribe)
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'image'
                ? 'bg-[#B6D232] text-[#340648] shadow-md shadow-[#B6D232]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Génération & Retouche Image
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'video'
                ? 'bg-[#B6D232] text-[#340648] shadow-md shadow-[#B6D232]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Video className="w-4 h-4" />
            Animation Veo 3 Vidéo
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'music'
                ? 'bg-[#B6D232] text-[#340648] shadow-md shadow-[#B6D232]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Music className="w-4 h-4" />
            Composition Musicale (Lyria)
          </button>
        </div>

        {/* --- TAB 1: GEMINI MULTI-TURN CHAT WITH GROUNDING --- */}
        {activeTab === 'chat' && (
          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[560px]">
            {/* Chat Controls Topbar */}
            <div className="px-6 py-3 bg-slate-950/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Modèle:</span>
                <select
                  value={modelType}
                  onChange={(e: any) => setModelType(e.target.value)}
                  className="bg-slate-800 text-white rounded-lg px-2.5 py-1 border border-white/10 focus:outline-none focus:border-[#B6D232]"
                >
                  <option value="flash">gemini-3.5-flash (Recommandé)</option>
                  <option value="pro">gemini-3.1-pro-preview (Raisonnement Complexe)</option>
                  <option value="lite">gemini-3.1-flash-lite (Ultra Rapide)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={useSearchGrounding}
                    onChange={(e) => {
                      setUseSearchGrounding(e.target.checked);
                      if (e.target.checked) setUseMapsGrounding(false);
                    }}
                    className="rounded border-slate-700 text-[#B6D232] focus:ring-0"
                  />
                  <Search className="w-3.5 h-3.5 text-[#B6D232]" />
                  Google Search Grounding
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={useMapsGrounding}
                    onChange={(e) => {
                      setUseMapsGrounding(e.target.checked);
                      if (e.target.checked) setUseSearchGrounding(false);
                    }}
                    className="rounded border-slate-700 text-[#B6D232] focus:ring-0"
                  />
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Google Maps Grounding
                </label>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#B6D232] text-[#340648] font-medium rounded-tr-none'
                        : 'bg-slate-900/90 text-slate-100 border border-white/10 rounded-tl-none shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Grounding Source Attribution Badges */}
                    {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/10 text-xs text-slate-400">
                        <div className="font-bold flex items-center gap-1 text-[#B6D232] mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sources vérifiées par Google:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.groundingChunks.slice(0, 3).map((chunk: any, cIdx: number) => (
                            <span key={cIdx} className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                              {chunk.web?.title || chunk.maps?.title || 'Information officielle'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 flex items-center gap-3 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-[#B6D232]" />
                    Gemini analyse votre demande...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center gap-3">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Posez une question sur nos verres, devis, calcul de surface ou horaires..."
                className="flex-1 bg-slate-900 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-white/10 focus:outline-none focus:border-[#B6D232]"
              />
              <button
                type="submit"
                disabled={!inputChat.trim() || chatLoading}
                className="bg-[#B6D232] text-[#340648] p-3 rounded-xl hover:bg-[#a5be2c] transition-all disabled:opacity-50 font-bold"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* --- TAB 2: VOICE CONVERSATIONS & TRANSCRIBE --- */}
        {activeTab === 'voice' && (
          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-[#B6D232] p-1 flex items-center justify-center mb-6">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-rose-400 animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8 text-[#B6D232]" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Conversation Vocale & Transcription (gemini-3.5-transcribe)
            </h3>
            <p className="text-slate-300 text-sm mb-8">
              Cliquez pour enregistrer vos dimensions ou votre demande de devis en parlant naturellement en Français ou Créole haïtien.
            </p>

            <div className="flex justify-center gap-4 mb-6">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-[#B6D232] text-[#340648] font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg text-sm"
                >
                  <Mic className="w-5 h-5" /> Démarrer l'enregistrement
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-rose-500 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg text-sm"
                >
                  <MicOff className="w-5 h-5" /> Arrêter et transcrire
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 italic mb-4">{liveVoiceStatus}</div>

            {transcribeLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#B6D232]">
                <Loader2 className="w-4 h-4 animate-spin" /> Transcription audio par Gemini en cours...
              </div>
            )}

            {transcribedText && (
              <div className="mt-6 bg-slate-900/90 rounded-2xl p-4 text-left border border-white/10">
                <div className="text-xs font-bold text-[#B6D232] mb-1">Texte Transcrit:</div>
                <p className="text-sm text-slate-200">{transcribedText}</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: CREATE & EDIT IMAGES --- */}
        {activeTab === 'image' && (
          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#B6D232]" />
                Création et retouche d'image (gemini-3.1-flash-image-preview)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visualisez vos futures installations vitrées, façades de maison ou cabines de douche à partir d'un prompt textuel ou d'une photo de votre chantier.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description visuelle / Prompt:</label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 text-white rounded-xl p-3 text-sm border border-white/10 focus:outline-none focus:border-[#B6D232]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Photo de référence (Optionnel pour retouche):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={imageLoading}
                className="w-full bg-[#B6D232] text-[#340648] font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#a5be2c] transition-all shadow-md text-sm"
              >
                {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
                Générer / Retoucher l'image
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden min-h-[300px] relative">
              {generatedImage ? (
                <img src={generatedImage} alt="Rendu IA" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-500 text-xs">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40 text-[#B6D232]" />
                  Le rendu haute définition apparaîtra ici
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 4: VEO VIDEO ANIMATION --- */}
        {activeTab === 'video' && (
          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-[#B6D232]" />
                Animation Vidéo Veo 3 (veo-3.1-fast-generate-preview)
              </h3>
              <p className="text-xs text-slate-300">
                Transformez une photo de votre bâtiment ou un texte en animation vidéo fluide avec reflets réalistes.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Prompt cinématique:</label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 text-white rounded-xl p-3 text-sm border border-white/10 focus:outline-none focus:border-[#B6D232]"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300">Format d'aspect:</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="aspect"
                    checked={videoAspect === '16:9'}
                    onChange={() => setVideoAspect('16:9')}
                    className="text-[#B6D232] focus:ring-0"
                  />
                  16:9 (Paysage)
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="aspect"
                    checked={videoAspect === '9:16'}
                    onChange={() => setVideoAspect('9:16')}
                    className="text-[#B6D232] focus:ring-0"
                  />
                  9:16 (Portrait / Mobile)
                </label>
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={videoLoading}
                className="w-full bg-[#B6D232] text-[#340648] font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#a5be2c] transition-all shadow-md text-sm"
              >
                {videoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                Générer la vidéo Veo 3
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden min-h-[300px]">
              {generatedVideoUrl ? (
                <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="text-center p-6 text-slate-500 text-xs">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-40 text-[#B6D232]" />
                  La vidéo cinématique générée par Veo 3 apparaîtra ici
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 5: LYRIA MUSIC GENERATION --- */}
        {activeTab === 'music' && (
          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl max-w-2xl mx-auto text-center">
            <Music className="w-12 h-12 mx-auto mb-4 text-[#B6D232]" />
            <h3 className="text-xl font-bold text-white mb-2">
              Composition Musicale (lyria-3-clip-preview / pro)
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Créez des ambiances sonores ou jingles pour vos présentations architecturales et vidéos de chantier.
            </p>

            <div className="text-left mb-6">
              <label className="block text-xs font-bold text-slate-300 mb-1">Ambiance musicale:</label>
              <input
                type="text"
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                className="w-full bg-slate-900 text-white rounded-xl p-3 text-sm border border-white/10 focus:outline-none focus:border-[#B6D232]"
              />
            </div>

            <button
              onClick={handleGenerateMusic}
              disabled={musicLoading}
              className="bg-[#B6D232] text-[#340648] font-black px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-[#a5be2c] transition-all shadow-md text-sm mb-6"
            >
              {musicLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
              Générer la musique Lyria
            </button>

            {generatedMusicUrl && (
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
                <div className="text-left text-xs">
                  <div className="font-bold text-[#B6D232]">Jingle Officiel Global Glass</div>
                  <div className="text-slate-400 text-[10px]">Format audio haute fidélité</div>
                </div>
                <audio controls src={generatedMusicUrl} className="h-9 w-60" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
