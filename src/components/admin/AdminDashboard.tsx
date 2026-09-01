import React, { useState } from 'react';
import {
  Shield,
  X,
  Lock,
  LogOut,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  Package,
  FolderKanban,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Trash2,
  Edit,
  Save,
  Phone,
  MessageCircle,
  ExternalLink,
  DollarSign,
  Layers,
  Sparkles,
  Download,
  RotateCcw
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  Project,
  QuoteRequest,
  CommentReview,
  ContactMessage,
  CompanySettings
} from '../../types';
import { StorageService } from '../../services/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: ProductCategory[];
  projects: Project[];
  quotes: QuoteRequest[];
  reviews: CommentReview[];
  messages: ContactMessage[];
  settings: CompanySettings;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  projects,
  quotes,
  reviews,
  messages,
  settings
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'reviews' | 'messages' | 'products' | 'projects' | 'settings'
  >('overview');

  // Selected Item Modals / Viewers
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [editingSettings, setEditingSettings] = useState<CompanySettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // New Product Modal State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState(categories[0]?.id || '');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(0);
  const [newProdImg, setNewProdImg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'ggw2026admin' || passwordInput === 'admin' || passwordInput === 'global2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Mot de passe administrateur incorrect. (Astuce : ggw2026admin)');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(editingSettings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    StorageService.saveProduct({
      id: '',
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: newProdCat || categories[0]?.id,
      shortDescription: newProdDesc,
      fullDescription: newProdDesc,
      images: [
        {
          id: `img-${Date.now()}`,
          url: newProdImg || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          isPrimary: true,
          alt: newProdName,
          order: 0
        }
      ],
      features: ['Fabrication sur mesure', 'Aluminium de première qualité', 'Finition soignée'],
      price: newProdPrice > 0 ? newProdPrice : undefined,
      priceUnit: 'pièce',
      status: 'published',
      isFeatured: true,
      showOnHome: true,
      isAvailable: true,
      order: products.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice(0);
    setNewProdImg('');
  };

  const unreadQuotesCount = quotes.filter(q => q.status === 'new').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className="bg-slate-900 text-white rounded-3xl shadow-2xl border-4 border-[#340648] w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#340648] px-6 py-4 border-b border-[#B6D232]/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B6D232] text-[#340648] flex items-center justify-center font-black">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Portail Administration & Modération
              </h2>
              <p className="text-[11px] text-[#B6D232] font-semibold">
                GLOBAL GLASS AND WINDOWS — Petit-Goâve
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-slate-800 p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-[#340648] text-[#B6D232] flex items-center justify-center mx-auto mb-4 border border-[#B6D232]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                Accès Sécurisé
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">
                Veuillez saisir le mot de passe pour gérer les devis, modérer les avis clients et mettre à jour le catalogue.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Mot de passe admin (ggw2026admin)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:border-[#B6D232] focus:outline-none"
                  autoFocus
                />

                {authError && (
                  <p className="text-xs text-red-400 font-bold">{authError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black py-3 rounded-xl text-sm transition-all cursor-pointer shadow-lg"
                >
                  Ouvrir le Tableau de Bord
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-950 p-4 border-r border-slate-800 flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-y-auto flex-shrink-0 gap-2">
              <div className="space-y-1.5 w-full">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'overview' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Vue Générale</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'quotes' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Devis Reçus</span>
                  </div>
                  {unreadQuotesCount > 0 && (
                    <span className="bg-[#B6D232] text-[#340648] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadQuotesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'reviews' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Modération Avis</span>
                  </div>
                  {pendingReviewsCount > 0 && (
                    <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      {pendingReviewsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'messages' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                  {unreadMessagesCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'products' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Catalogue Produits</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{products.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'projects' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderKanban className="w-4 h-4" />
                    <span>Réalisations</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{projects.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'settings' ? 'bg-[#340648] text-[#B6D232]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4" />
                    <span>Paramètres & Tarifs</span>
                  </div>
                </button>
              </div>

              {/* Data Reset / Backup in sidebar */}
              <div className="pt-4 border-t border-slate-800 hidden md:block">
                <button
                  onClick={() => {
                    if (confirm('Voulez-vous réinitialiser toutes les données par défaut de GLOBAL GLASS AND WINDOWS ?')) {
                      StorageService.resetToDefaults();
                      alert('Données réinitialisées avec succès.');
                    }
                  }}
                  className="w-full text-left text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1.5 py-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser par défaut</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-900">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Tableau de Bord Exécutif</h3>
                    <p className="text-xs text-slate-400">Activité et flux en temps réel de votre entreprise à Petit-Goâve</p>
                  </div>

                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                        <span>Devis Reçus</span>
                        <FileText className="w-4 h-4 text-[#B6D232]" />
                      </div>
                      <div className="text-2xl font-black text-white">{quotes.length}</div>
                      <span className="text-[11px] text-emerald-400 font-semibold">{unreadQuotesCount} en attente</span>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                        <span>Avis Clients</span>
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{reviews.length}</div>
                      <span className="text-[11px] text-amber-400 font-semibold">{pendingReviewsCount} à modérer</span>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                        <span>Catalogue Produits</span>
                        <Package className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{products.length}</div>
                      <span className="text-[11px] text-slate-400 font-semibold">7 Catégories pro</span>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                        <span>Messages Contact</span>
                        <Mail className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{messages.length}</div>
                      <span className="text-[11px] text-blue-400 font-semibold">{unreadMessagesCount} non lus</span>
                    </div>
                  </div>

                  {/* Urgent Actions Required */}
                  {(pendingReviewsCount > 0 || unreadQuotesCount > 0) && (
                    <div className="bg-[#340648] p-5 rounded-2xl border-2 border-[#B6D232] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#B6D232] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>Actions Nécessitant Votre Attention</span>
                        </h4>
                        <p className="text-xs text-slate-200 mt-0.5">
                          {pendingReviewsCount > 0 ? `• ${pendingReviewsCount} avis client en attente de modération. ` : ''}
                          {unreadQuotesCount > 0 ? `• ${unreadQuotesCount} nouveau(x) devis à traiter.` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {pendingReviewsCount > 0 && (
                          <button
                            onClick={() => setActiveTab('reviews')}
                            className="bg-[#B6D232] text-[#340648] font-black text-xs px-3.5 py-2 rounded-xl"
                          >
                            Modérer les avis
                          </button>
                        )}
                        {unreadQuotesCount > 0 && (
                          <button
                            onClick={() => setActiveTab('quotes')}
                            className="bg-white text-[#340648] font-black text-xs px-3.5 py-2 rounded-xl"
                          >
                            Voir les devis
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Latest Quotes Table Snippet */}
                  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                    <h4 className="font-bold text-sm text-white mb-4">Dernières Demandes de Devis</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-700">
                            <th className="pb-2">Client</th>
                            <th className="pb-2">Téléphone</th>
                            <th className="pb-2">Produit / Service</th>
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {quotes.slice(0, 5).map((q) => (
                            <tr key={q.id} className="hover:bg-slate-700/50 cursor-pointer" onClick={() => { setSelectedQuote(q); setActiveTab('quotes'); }}>
                              <td className="py-2.5 font-bold text-white">{q.fullName}</td>
                              <td className="py-2.5 text-slate-300">{q.phone}</td>
                              <td className="py-2.5 text-[#B6D232]">{q.productOrService}</td>
                              <td className="py-2.5 text-slate-400">{q.date}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  q.status === 'new' ? 'bg-[#B6D232] text-[#340648]' : 'bg-slate-700 text-slate-300'
                                }`}>
                                  {q.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: QUOTES */}
              {activeTab === 'quotes' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">Gestion des Devis ({quotes.length})</h3>
                      <p className="text-xs text-slate-400">Consultez, mettez à jour le statut et répondez directement par WhatsApp aux clients</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* List (6 cols) */}
                    <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto">
                      {quotes.map((q) => (
                        <div
                          key={q.id}
                          onClick={() => setSelectedQuote(q)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            selectedQuote?.id === q.id
                              ? 'bg-[#340648] border-[#B6D232]'
                              : 'bg-slate-800 hover:bg-slate-750 border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-sm text-white">{q.fullName}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.status === 'new' ? 'bg-[#B6D232] text-[#340648]' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {q.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#B6D232] font-semibold">{q.productOrService}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                            <span>{q.city || 'Petit-Goâve'}</span>
                            <span>{q.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detailed Viewer (7 cols) */}
                    <div className="lg:col-span-7 bg-slate-800 rounded-3xl p-6 border border-slate-700">
                      {selectedQuote ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                            <div>
                              <h4 className="text-lg font-black text-white">{selectedQuote.fullName}</h4>
                              <p className="text-xs text-slate-400">{selectedQuote.address}, {selectedQuote.city}</p>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={`https://wa.me/${selectedQuote.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${selectedQuote.fullName}, suite à votre demande de devis pour "${selectedQuote.productOrService}" chez GLOBAL GLASS AND WINDOWS :`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp Client</span>
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900 p-3 rounded-xl">
                            <div>
                              <span className="text-slate-400 block">Téléphone :</span>
                              <a href={`tel:${selectedQuote.phone}`} className="font-bold text-white hover:underline">{selectedQuote.phone}</a>
                            </div>
                            <div>
                              <span className="text-slate-400 block">WhatsApp :</span>
                              <span className="font-bold text-emerald-400">{selectedQuote.whatsapp}</span>
                            </div>
                            {selectedQuote.email && (
                              <div>
                                <span className="text-slate-400 block">Email :</span>
                                <span className="font-bold text-white">{selectedQuote.email}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-400 block">Quantité :</span>
                              <span className="font-bold text-[#B6D232]">{selectedQuote.quantity}</span>
                            </div>
                          </div>

                          {/* Dimensions & Type */}
                          {selectedQuote.dimensions && (
                            <div className="bg-slate-900 p-3 rounded-xl text-xs space-y-1">
                              <span className="text-slate-400 font-bold block">Dimensions & Spécifications :</span>
                              <p className="text-white font-semibold">
                                {selectedQuote.dimensions.lengthInches ? `${selectedQuote.dimensions.lengthInches}" L ` : ''}
                                {selectedQuote.dimensions.widthInches ? `× ${selectedQuote.dimensions.widthInches}" l ` : ''}
                                {selectedQuote.dimensions.areaSqFt ? `(Surface : ${selectedQuote.dimensions.areaSqFt} pi²)` : ''}
                              </p>
                              {selectedQuote.glassType && (
                                <p className="text-[#B6D232]">Type : {selectedQuote.glassType}</p>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          <div>
                            <span className="text-xs font-bold text-slate-400 block mb-1">Description du besoin :</span>
                            <p className="text-xs sm:text-sm text-slate-200 bg-slate-900 p-3 rounded-xl leading-relaxed">
                              {selectedQuote.description}
                            </p>
                          </div>

                          {/* Attachments */}
                          {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
                            <div>
                              <span className="text-xs font-bold text-slate-400 block mb-1">Pièces Jointes / Photos :</span>
                              <div className="flex flex-wrap gap-2">
                                {selectedQuote.attachments.map((att) => (
                                  <a
                                    key={att.id}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-slate-900 px-3 py-2 rounded-xl text-xs text-[#B6D232] hover:underline flex items-center gap-1.5 border border-slate-700"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>{att.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status changer */}
                          <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">Modifier Statut :</span>
                              <select
                                value={selectedQuote.status}
                                onChange={(e) => {
                                  StorageService.updateQuoteStatus(selectedQuote.id, e.target.value as any);
                                  setSelectedQuote({ ...selectedQuote, status: e.target.value as any });
                                }}
                                className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 text-white"
                              >
                                <option value="new">Nouveau (new)</option>
                                <option value="in_review">En cours d'étude</option>
                                <option value="quoted">Devis envoyé</option>
                                <option value="accepted">Accepté</option>
                                <option value="rejected">Refusé</option>
                                <option value="completed">Terminé & Livré</option>
                              </select>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm('Supprimer ce devis ?')) {
                                  StorageService.deleteQuote(selectedQuote.id);
                                  setSelectedQuote(null);
                                }
                              }}
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16 text-slate-400 text-xs font-medium">
                          Sélectionnez un devis dans la liste de gauche pour afficher tous les détails.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MODERATION OF REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Modération des Avis Clients ({reviews.length})</h3>
                    <p className="text-xs text-slate-400">Validez ou rejetez les avis déposés par les visiteurs avant leur parution publique</p>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          rev.status === 'pending'
                            ? 'bg-amber-950/40 border-amber-500/50'
                            : rev.status === 'approved'
                            ? 'bg-slate-800 border-slate-700'
                            : 'bg-red-950/20 border-red-800/40 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#340648] text-[#B6D232] font-black flex items-center justify-center text-sm">
                              {rev.firstName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-white">
                                {rev.firstName} {rev.lastName}
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                {rev.projectType} • Note: {rev.rating}/5 étoiles • {rev.date}
                              </span>
                            </div>
                          </div>

                          {/* Status tag */}
                          <div>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              rev.status === 'pending' ? 'bg-amber-400 text-slate-900' :
                              rev.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
                            }`}>
                              Statut : {rev.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 italic mb-4 bg-slate-900/60 p-3 rounded-xl">
                          "{rev.comment}"
                        </p>

                        {/* Moderation actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-2">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => StorageService.updateReviewStatus(rev.id, 'approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approuver & Publier</span>
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => StorageService.updateReviewStatus(rev.id, 'rejected')}
                                className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rejeter</span>
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (confirm('Supprimer définitivement cet avis ?')) {
                                StorageService.deleteReview(rev.id);
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Messages de Contact ({messages.length})</h3>
                    <p className="text-xs text-slate-400">Questions générales et prises de contact via le formulaire du site</p>
                  </div>

                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div key={m.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-extrabold text-sm text-white">{m.fullName}</h4>
                          <span className="text-[11px] text-slate-400">{m.date}</span>
                        </div>
                        <div className="text-xs text-[#B6D232] font-semibold mb-2">Objet : {m.subject}</div>
                        <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl mb-3">{m.message}</p>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700">
                          <div className="flex gap-3">
                            <a href={`tel:${m.phone}`} className="text-slate-300 hover:text-white font-bold flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#B6D232]" />
                              <span>{m.phone}</span>
                            </a>
                            <a href={`mailto:${m.email}`} className="text-slate-300 hover:text-white flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{m.email}</span>
                            </a>
                          </div>
                          <button
                            onClick={() => StorageService.deleteMessage(m.id)}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PRODUCTS CATALOG */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">Catalogue Produits ({products.length})</h3>
                      <p className="text-xs text-slate-400">Ajoutez, modifiez ou activez les produits pour le carrousel d'accueil</p>
                    </div>
                    <button
                      onClick={() => setIsAddingProduct(true)}
                      className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un produit</span>
                    </button>
                  </div>

                  {/* Add Product Modal */}
                  {isAddingProduct && (
                    <form onSubmit={handleAddProductSubmit} className="bg-slate-800 p-6 rounded-2xl border-2 border-[#B6D232] space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                        <h4 className="font-black text-sm text-[#B6D232]">Nouveau Produit</h4>
                        <button type="button" onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-white text-xs">Annuler</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Nom du Produit *</label>
                          <input
                            type="text"
                            required
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            placeholder="Ex: Porte Vitrée Coulissante Heavy Duty"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Catégorie</label>
                          <select
                            value={newProdCat}
                            onChange={(e) => setNewProdCat(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Prix Estimatif ($ USD)</label>
                          <input
                            type="number"
                            value={newProdPrice || ''}
                            onChange={(e) => setNewProdPrice(Number(e.target.value))}
                            placeholder="Ex: 250"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">URL Photo Principale</label>
                          <input
                            type="url"
                            value={newProdImg}
                            onChange={(e) => setNewProdImg(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          placeholder="Description succincte du produit..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>

                      <button type="submit" className="bg-[#B6D232] text-[#340648] font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                        Enregistrer le Produit
                      </button>
                    </form>
                  )}

                  {/* Grid of current products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
                            <img src={p.images[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-extrabold text-sm text-white mb-1">{p.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{p.shortDescription}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#B6D232]">
                            {p.price ? `$${p.price} USD` : 'Sur mesure'}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer le produit "${p.name}" ?`)) {
                                StorageService.deleteProduct(p.id);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Galerie Réalisations ({projects.length})</h3>
                    <p className="text-xs text-slate-400">Gérez les projets présentés sur le site avec slider Avant / Après</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{proj.title}</h4>
                          <span className="text-xs text-[#B6D232] block mb-2">{proj.location} • {proj.category}</span>
                          <p className="text-xs text-slate-300 line-clamp-2">{proj.description}</p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                          <span className="text-slate-400">{proj.hasBeforeAfter ? 'Avec Avant/Après' : 'Photo standard'}</span>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer le projet "${proj.title}" ?`)) {
                                StorageService.deleteProject(proj.id);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SETTINGS & GLASS PRICES */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-xl font-black text-white">Paramètres Généraux & Grille Tarifaire</h3>
                    <p className="text-xs text-slate-400">Coordonnées, slogan officiel et tarifs du calculateur de verre</p>
                  </div>

                  {settingsSavedMsg && (
                    <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs font-bold">
                      Paramètres et tarifs enregistrés avec succès !
                    </div>
                  )}

                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="font-black text-sm text-[#B6D232]">Coordonnées & Slogans</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Nom Entreprise</label>
                        <input
                          type="text"
                          value={editingSettings.companyName}
                          onChange={(e) => setEditingSettings({ ...editingSettings, companyName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Slogan Officiel</label>
                        <input
                          type="text"
                          value={editingSettings.tagline}
                          onChange={(e) => setEditingSettings({ ...editingSettings, tagline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Téléphone 1 (WhatsApp)</label>
                        <input
                          type="text"
                          value={editingSettings.phone1}
                          onChange={(e) => setEditingSettings({ ...editingSettings, phone1: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Téléphone 2</label>
                        <input
                          type="text"
                          value={editingSettings.phone2}
                          onChange={(e) => setEditingSettings({ ...editingSettings, phone2: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Téléphone 3</label>
                        <input
                          type="text"
                          value={editingSettings.phone3}
                          onChange={(e) => setEditingSettings({ ...editingSettings, phone3: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Glass Prices Configuration */}
                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="font-black text-sm text-[#B6D232]">Tarifs Calculateur de Verre (USD / pied carré)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {Object.entries(editingSettings.glassPricePerSqFt).map(([k, v]) => (
                        <div key={k}>
                          <label className="block font-bold text-slate-300 mb-1 capitalize">{k}</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.5"
                              value={v}
                              onChange={(e) => setEditingSettings({
                                ...editingSettings,
                                glassPricePerSqFt: {
                                  ...editingSettings.glassPricePerSqFt,
                                  [k]: Number(e.target.value)
                                }
                              })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                            />
                            <span className="absolute right-3 top-2 text-slate-400 font-bold">$</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-black text-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer toutes les modifications</span>
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
