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
  RotateCcw,
  Upload,
  Video,
  Image as ImageIcon,
  Play,
  Check,
  AlertCircle,
  Film
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductVideo,
  Project,
  QuoteRequest,
  CommentReview,
  ContactMessage,
  CompanySettings
} from '../../types';
import { StorageService } from '../../services/storage';
import { processImportedFile } from '../../services/mediaService';

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
  const [newProdImages, setNewProdImages] = useState<ProductImage[]>([]);
  const [newProdVideos, setNewProdVideos] = useState<ProductVideo[]>([]);
  const [newVideoUrlInput, setNewVideoUrlInput] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  // Dedicated Media Manager for existing products
  const [managingProduct, setManagingProduct] = useState<Product | null>(null);
  const [editImages, setEditImages] = useState<ProductImage[]>([]);
  const [editVideos, setEditVideos] = useState<ProductVideo[]>([]);
  const [editVideoUrlInput, setEditVideoUrlInput] = useState('');
  const [isProcessingEditMedia, setIsProcessingEditMedia] = useState(false);
  const [mediaActionMsg, setMediaActionMsg] = useState('');

  // Delete confirmation states (in-app, no window.confirm)
  const [quoteToDeleteId, setQuoteToDeleteId] = useState<string | null>(null);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState(false);
  const [adminStorePhoto, setAdminStorePhoto] = useState<string>(() => {
    return localStorage.getItem('ggw_official_store_photo') || '/assets/ggw_storefront_truck.jpg';
  });
  const [storePhotoMsg, setStorePhotoMsg] = useState('');

  // Process batch of files (images and videos)
  const processBatchFiles = async (
    files: FileList | File[],
    target: 'new' | 'edit'
  ) => {
    if (!files || files.length === 0) return;
    if (target === 'new') setIsProcessingMedia(true);
    else setIsProcessingEditMedia(true);

    try {
      const addedImgs: ProductImage[] = [];
      const addedVids: ProductVideo[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await processImportedFile(file);
        const cleanName = processed.name || file.name.replace(/\.[^/.]+$/, '');

        if (processed.isVideo) {
          addedVids.push({
            id: `vid-${Date.now()}-${i}`,
            url: processed.url,
            title: cleanName,
            order: Date.now() + i
          });
        } else {
          const currentTotalImages = target === 'new' ? (newProdImages.length + addedImgs.length) : (editImages.length + addedImgs.length);
          addedImgs.push({
            id: `img-${Date.now()}-${i}`,
            url: processed.url,
            alt: cleanName,
            isPrimary: currentTotalImages === 0,
            order: Date.now() + i
          });
        }
      }

      if (target === 'new') {
        setNewProdImages(prev => [...prev, ...addedImgs]);
        setNewProdVideos(prev => [...prev, ...addedVids]);
      } else {
        setEditImages(prev => [...prev, ...addedImgs]);
        setEditVideos(prev => [...prev, ...addedVids]);
      }
    } catch (err) {
      console.error('Erreur importation médias:', err);
      setMediaActionMsg('Une erreur est survenue lors de la lecture des fichiers.');
      setTimeout(() => setMediaActionMsg(''), 4000);
    } finally {
      if (target === 'new') setIsProcessingMedia(false);
      else setIsProcessingEditMedia(false);
    }
  };

  const handleAddVideoUrl = (target: 'new' | 'edit') => {
    const url = target === 'new' ? newVideoUrlInput.trim() : editVideoUrlInput.trim();
    if (!url) return;

    const newVid: ProductVideo = {
      id: `vid-url-${Date.now()}`,
      url: url,
      title: url.includes('youtube') || url.includes('youtu.be') ? 'Vidéo YouTube' : 'Lien Vidéo',
      order: Date.now()
    };

    if (target === 'new') {
      setNewProdVideos(prev => [...prev, newVid]);
      setNewVideoUrlInput('');
    } else {
      setEditVideos(prev => [...prev, newVid]);
      setEditVideoUrlInput('');
    }
  };

  const setPrimaryImage = (target: 'new' | 'edit', id: string) => {
    if (target === 'new') {
      setNewProdImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
    } else {
      setEditImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
    }
  };

  const removeImage = (target: 'new' | 'edit', id: string) => {
    if (target === 'new') {
      setNewProdImages(prev => {
        const remaining = prev.filter(img => img.id !== id);
        if (remaining.length > 0 && !remaining.some(img => img.isPrimary)) {
          remaining[0].isPrimary = true;
        }
        return remaining;
      });
    } else {
      setEditImages(prev => {
        const remaining = prev.filter(img => img.id !== id);
        if (remaining.length > 0 && !remaining.some(img => img.isPrimary)) {
          remaining[0].isPrimary = true;
        }
        // Auto-save immediately to database/storage so deletion is permanent
        if (managingProduct) {
          const updatedProduct: Product = {
            ...managingProduct,
            images: remaining,
            videos: editVideos
          };
          StorageService.saveProduct(updatedProduct);
          setManagingProduct(updatedProduct);
        }
        return remaining;
      });
      setMediaActionMsg('Photo supprimée avec succès');
      setTimeout(() => setMediaActionMsg(''), 3000);
    }
  };

  const removeVideo = (target: 'new' | 'edit', id: string) => {
    if (target === 'new') {
      setNewProdVideos(prev => prev.filter(v => v.id !== id));
    } else {
      setEditVideos(prev => {
        const remaining = prev.filter(v => v.id !== id);
        if (managingProduct) {
          const updatedProduct: Product = {
            ...managingProduct,
            images: editImages,
            videos: remaining
          };
          StorageService.saveProduct(updatedProduct);
          setManagingProduct(updatedProduct);
        }
        return remaining;
      });
      setMediaActionMsg('Vidéo supprimée avec succès');
      setTimeout(() => setMediaActionMsg(''), 3000);
    }
  };

  const clearAllImages = (target: 'new' | 'edit') => {
    if (target === 'new') {
      setNewProdImages([]);
    } else {
      setEditImages([]);
      if (managingProduct) {
        const updatedProduct: Product = {
          ...managingProduct,
          images: [],
          videos: editVideos
        };
        StorageService.saveProduct(updatedProduct);
        setManagingProduct(updatedProduct);
      }
      setMediaActionMsg('Toutes les photos ont été supprimées');
      setTimeout(() => setMediaActionMsg(''), 3000);
    }
  };

  const clearAllVideos = (target: 'new' | 'edit') => {
    if (target === 'new') {
      setNewProdVideos([]);
    } else {
      setEditVideos([]);
      if (managingProduct) {
        const updatedProduct: Product = {
          ...managingProduct,
          images: editImages,
          videos: []
        };
        StorageService.saveProduct(updatedProduct);
        setManagingProduct(updatedProduct);
      }
      setMediaActionMsg('Toutes les vidéos ont été supprimées');
      setTimeout(() => setMediaActionMsg(''), 3000);
    }
  };

  const handleOpenMediaManager = (product: Product) => {
    setManagingProduct(product);
    setEditImages(product.images && product.images.length > 0 ? [...product.images] : []);
    setEditVideos(product.videos && product.videos.length > 0 ? [...product.videos] : (product.videoUrl ? [{ id: 'vid-default', url: product.videoUrl, title: 'Vidéo' }] : []));
    setEditVideoUrlInput('');
    setMediaActionMsg('');
  };

  const handleSaveProductMedia = () => {
    if (!managingProduct) return;
    const updatedProduct: Product = {
      ...managingProduct,
      images: editImages,
      videos: editVideos
    };

    StorageService.saveProduct(updatedProduct);
    setManagingProduct(null);
  };

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

    let finalImages = [...newProdImages];
    if (finalImages.length === 0) {
      finalImages = [
        {
          id: `img-${Date.now()}`,
          url: newProdImg || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          isPrimary: true,
          alt: newProdName,
          order: 0
        }
      ];
    } else if (!finalImages.some(img => img.isPrimary)) {
      finalImages[0].isPrimary = true;
    }

    StorageService.saveProduct({
      id: '',
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: newProdCat || categories[0]?.id,
      shortDescription: newProdDesc,
      fullDescription: newProdDesc,
      images: finalImages,
      videos: newProdVideos,
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
    setNewProdImages([]);
    setNewProdVideos([]);
    setNewVideoUrlInput('');
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
                {showResetConfirm ? (
                  <div className="p-2 bg-red-950/80 border border-red-800 rounded-xl space-y-1.5 text-center">
                    <p className="text-[10px] text-red-200 font-bold">Réinitialiser toutes les données ?</p>
                    <div className="flex justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          StorageService.resetToDefaults();
                          setShowResetConfirm(false);
                          setResetSuccessMsg(true);
                          setTimeout(() => setResetSuccessMsg(false), 3000);
                        }}
                        className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded"
                      >
                        Oui
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded"
                      >
                        Non
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full text-left text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1.5 py-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser par défaut</span>
                  </button>
                )}
                {resetSuccessMsg && (
                  <p className="text-[10px] text-emerald-400 font-bold mt-1">Données réinitialisées !</p>
                )}
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

                            {quoteToDeleteId === selectedQuote.id ? (
                              <div className="flex items-center gap-2 bg-red-950/80 border border-red-700 px-2.5 py-1 rounded-lg">
                                <span className="text-[11px] text-red-200 font-bold">Confirmer ?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    StorageService.deleteQuote(selectedQuote.id);
                                    setSelectedQuote(null);
                                    setQuoteToDeleteId(null);
                                  }}
                                  className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Oui
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQuoteToDeleteId(null)}
                                  className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Non
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setQuoteToDeleteId(selectedQuote.id)}
                                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            )}
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

                          {reviewToDeleteId === rev.id ? (
                            <div className="flex items-center gap-2 bg-red-950/80 border border-red-700 px-2.5 py-1 rounded-lg">
                              <span className="text-[11px] text-red-200 font-bold">Supprimer ?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  StorageService.deleteReview(rev.id);
                                  setReviewToDeleteId(null);
                                }}
                                className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
                              >
                                Oui
                              </button>
                              <button
                                type="button"
                                onClick={() => setReviewToDeleteId(null)}
                                className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded cursor-pointer"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReviewToDeleteId(rev.id)}
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer</span>
                            </button>
                          )}
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
                    <form onSubmit={handleAddProductSubmit} className="bg-slate-800 p-6 rounded-2xl border-2 border-[#B6D232] space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                        <div className="flex items-center gap-2">
                          <Plus className="w-5 h-5 text-[#B6D232]" />
                          <h4 className="font-black text-base text-[#B6D232]">Ajouter un Nouveau Produit</h4>
                        </div>
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
                          <label className="block text-xs font-bold text-slate-300 mb-1">Prix Estimatif ($ USD - optionnel)</label>
                          <input
                            type="number"
                            value={newProdPrice || ''}
                            onChange={(e) => setNewProdPrice(Number(e.target.value))}
                            placeholder="Ex: 250 (laisser vide pour Sur Devis)"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Description succincte</label>
                          <input
                            type="text"
                            value={newProdDesc}
                            onChange={(e) => setNewProdDesc(e.target.value)}
                            placeholder="Description succincte du produit..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* ZONE D'IMPORTATION MULTI-PHOTOS & VIDÉOS */}
                      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-white flex items-center gap-1.5">
                              <Upload className="w-4 h-4 text-[#B6D232]" />
                              Importer plusieurs photos et vidéos en même temps
                            </span>
                            <p className="text-[11px] text-slate-400">
                              Sélectionnez ou glissez-déposez plusieurs fichiers à la fois (JPG, PNG, WebP, MP4, WebM, MOV)
                            </p>
                          </div>
                          {(newProdImages.length > 0 || newProdVideos.length > 0) && (
                            <span className="text-xs font-bold text-[#B6D232] bg-[#B6D232]/10 px-2.5 py-1 rounded-full border border-[#B6D232]/30">
                              {newProdImages.length} photo(s) • {newProdVideos.length} vidéo(s)
                            </span>
                          )}
                        </div>

                        {/* Drag & Drop Multi-file Dropzone */}
                        <label
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files) {
                              processBatchFiles(e.dataTransfer.files, 'new');
                            }
                          }}
                          className="border-2 border-dashed border-slate-600 hover:border-[#B6D232] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/50 hover:bg-slate-800"
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={(e) => processBatchFiles(e.target.files || [], 'new')}
                            className="hidden"
                          />
                          <div className="p-3 bg-[#B6D232]/10 rounded-full text-[#B6D232] mb-2">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-black text-white text-center">
                            Glissez-déposez plusieurs images et vidéos ici
                          </span>
                          <span className="text-[11px] text-[#B6D232] underline font-semibold mt-1">
                            ou cliquez pour parcourir vos fichiers
                          </span>
                          {isProcessingMedia && (
                            <span className="text-xs text-amber-300 font-bold mt-2 animate-pulse">
                              Traitement des fichiers en cours...
                            </span>
                          )}
                        </label>

                        {/* Saisie d'un lien vidéo externe ou URL image optionnelle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={newVideoUrlInput}
                              onChange={(e) => setNewVideoUrlInput(e.target.value)}
                              placeholder="Lien vidéo (YouTube, Vimeo, MP4 direct...)"
                              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddVideoUrl('new')}
                              className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>+ Vidéo</span>
                            </button>
                          </div>

                          <div>
                            <input
                              type="url"
                              value={newProdImg}
                              onChange={(e) => setNewProdImg(e.target.value)}
                              placeholder="Ou URL directe d'image (ex: https://...)"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Visual Preview Strip of Uploaded Media */}
                        {(newProdImages.length > 0 || newProdVideos.length > 0) && (
                          <div className="pt-3 border-t border-slate-700 space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 block">
                              Médias prêts pour ce produit ({newProdImages.length} images, {newProdVideos.length} vidéos) :
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                              {/* Images */}
                              {newProdImages.map((img) => (
                                <div key={img.id} className={`relative rounded-xl overflow-hidden border-2 bg-slate-800 group ${img.isPrimary ? 'border-[#B6D232] ring-2 ring-[#B6D232]/50' : 'border-slate-700'}`}>
                                  <div className="aspect-square w-full">
                                    <img
                                      src={img.url}
                                      alt=""
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        if (!target.src.includes('unsplash')) {
                                          target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                                        }
                                      }}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute top-1 left-1 z-10">
                                    {img.isPrimary ? (
                                      <span className="bg-[#B6D232] text-[#340648] text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                        ★ Couv.
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setPrimaryImage('new', img.id)}
                                        className="bg-black/60 hover:bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow cursor-pointer"
                                        title="Définir comme photo principale"
                                      >
                                        Couv.
                                      </button>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeImage('new', img.id)}
                                    className="absolute top-1 right-1 z-10 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow cursor-pointer"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}

                              {/* Videos */}
                              {newProdVideos.map((vid) => (
                                <div key={vid.id} className="relative rounded-xl overflow-hidden border-2 border-purple-500 bg-purple-950 p-2 flex flex-col justify-between aspect-square group">
                                  {(vid.url?.startsWith('data:video') || vid.url?.startsWith('blob:') || /\.(mp4|webm|mov|m4v)/i.test(vid.url)) && (
                                    <video src={vid.url} preload="metadata" muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
                                  )}
                                  <div className="flex items-center justify-between relative z-10">
                                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <Film className="w-2.5 h-2.5" />
                                      VIDÉO
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeVideo('new', vid.id)}
                                      className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="flex flex-col items-center justify-center my-auto relative z-10">
                                    <Play className="w-6 h-6 text-[#B6D232] fill-[#B6D232]" />
                                    <span className="text-[10px] text-slate-200 font-bold truncate max-w-full mt-1">
                                      {vid.title || 'Vidéo'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingProduct(false)}
                          className="text-slate-400 hover:text-white text-xs px-4 py-2"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessingMedia}
                          className="bg-[#B6D232] text-[#340648] font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer hover:bg-[#a3be27] shadow flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Enregistrer le Produit avec Médias</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Grid of current products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 bg-slate-900 relative">
                            <img src={p.images[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                            {/* Media counter on card */}
                            <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-2 border border-white/20">
                              <span className="flex items-center gap-1 text-[#B6D232]">
                                <ImageIcon className="w-3 h-3" />
                                <span>{p.images?.length || 1}</span>
                              </span>
                              {(p.videos && p.videos.length > 0) && (
                                <span className="flex items-center gap-1 text-red-400">
                                  <Video className="w-3 h-3" />
                                  <span>{p.videos.length}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <h4 className="font-extrabold text-sm text-white mb-1">{p.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{p.shortDescription}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenMediaManager(p)}
                            className="bg-purple-900/60 hover:bg-purple-800 text-[#B6D232] font-black text-[11px] px-2.5 py-1.5 rounded-lg border border-purple-600/40 flex items-center gap-1.5 cursor-pointer transition-colors"
                            title="Importer plusieurs photos et vidéos pour ce produit"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Gérer Médias ({p.images?.length || 1}📷 / {p.videos?.length || 0}🎥)</span>
                          </button>

                          {productToDeleteId === p.id ? (
                            <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-700 px-2 py-0.5 rounded-lg">
                              <span className="text-[10px] text-red-200 font-bold">Supprimer ?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  StorageService.deleteProduct(p.id);
                                  setProductToDeleteId(null);
                                }}
                                className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                Oui
                              </button>
                              <button
                                type="button"
                                onClick={() => setProductToDeleteId(null)}
                                className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setProductToDeleteId(p.id)}
                              className="text-red-400 hover:text-red-300 text-xs p-1 cursor-pointer"
                              title="Supprimer le produit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DEDICATED MEDIA MANAGER MODAL FOR EXISTING PRODUCTS */}
                  {managingProduct && (
                    <div
                      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                      onClick={() => setManagingProduct(null)}
                    >
                      <div
                        className="bg-slate-900 border-4 border-[#B6D232] rounded-3xl p-6 max-w-3xl w-full text-white shadow-2xl space-y-5 my-8 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#B6D232] tracking-wider block">Gestionnaire Médias</span>
                            <h3 className="text-lg font-black text-white">{managingProduct.name}</h3>
                          </div>
                          <button
                            onClick={() => setManagingProduct(null)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Bulk file uploader */}
                        <label
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files) {
                              processBatchFiles(e.dataTransfer.files, 'edit');
                            }
                          }}
                          className="border-2 border-dashed border-slate-600 hover:border-[#B6D232] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/60 hover:bg-slate-800"
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={(e) => processBatchFiles(e.target.files || [], 'edit')}
                            className="hidden"
                          />
                          <div className="p-3 bg-[#B6D232]/15 rounded-full text-[#B6D232] mb-2">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-black text-white text-center">
                            Glissez-déposez de nouvelles photos et vidéos à ajouter
                          </span>
                          <span className="text-xs text-[#B6D232] underline font-bold mt-1">
                            ou cliquez pour sélectionner plusieurs fichiers
                          </span>
                          {isProcessingEditMedia && (
                            <span className="text-xs text-amber-300 font-bold mt-2 animate-pulse">
                              Importation des médias en cours...
                            </span>
                          )}
                        </label>

                        {/* Add Video URL field */}
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={editVideoUrlInput}
                            onChange={(e) => setEditVideoUrlInput(e.target.value)}
                            placeholder="Coller un lien vidéo (YouTube, Vimeo, MP4)..."
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddVideoUrl('edit')}
                            className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>+ Ajouter Vidéo</span>
                          </button>
                        </div>

                        {/* Feedback message */}
                        {mediaActionMsg && (
                          <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>{mediaActionMsg}</span>
                          </div>
                        )}

                        {/* Existing Images & Videos List */}
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-300">
                              Médias actuels ({editImages.length} photos, {editVideos.length} vidéos) :
                            </span>
                            <div className="flex items-center gap-2">
                              {editImages.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => clearAllImages('edit')}
                                  className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 cursor-pointer flex items-center gap-1 transition-colors"
                                  title="Supprimer toutes les photos de ce produit"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Supprimer toutes les photos</span>
                                </button>
                              )}
                              {editVideos.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => clearAllVideos('edit')}
                                  className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 cursor-pointer flex items-center gap-1 transition-colors"
                                  title="Supprimer toutes les vidéos de ce produit"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Supprimer toutes les vidéos</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {/* Images */}
                            {editImages.map((img) => (
                              <div
                                key={img.id}
                                className={`relative rounded-xl overflow-hidden border-2 bg-slate-800 group ${
                                  img.isPrimary ? 'border-[#B6D232] ring-2 ring-[#B6D232]/50' : 'border-slate-700'
                                }`}
                              >
                                <div className="aspect-square w-full">
                                  <img
                                    src={img.url}
                                    alt=""
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      if (!target.src.includes('unsplash')) {
                                        target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                                      }
                                    }}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute top-1 left-1 z-10">
                                  {img.isPrimary ? (
                                    <span className="bg-[#B6D232] text-[#340648] text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                      ★ Couv.
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setPrimaryImage('edit', img.id)}
                                      className="bg-black/70 hover:bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow cursor-pointer"
                                      title="Définir comme photo principale"
                                    >
                                      Couv.
                                    </button>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage('edit', img.id)}
                                  className="absolute top-1 right-1 z-10 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow cursor-pointer"
                                  title="Supprimer cette image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {/* Videos */}
                            {editVideos.map((vid) => (
                              <div key={vid.id} className="relative rounded-xl overflow-hidden border-2 border-purple-500 bg-purple-950 p-2 flex flex-col justify-between aspect-square group">
                                {(vid.url?.startsWith('data:video') || vid.url?.startsWith('blob:') || /\.(mp4|webm|mov|m4v)/i.test(vid.url)) && (
                                  <video src={vid.url} preload="metadata" muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
                                )}
                                <div className="flex items-center justify-between relative z-10">
                                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <Film className="w-2.5 h-2.5" />
                                    VIDÉO
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeVideo('edit', vid.id)}
                                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow cursor-pointer"
                                    title="Supprimer cette vidéo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex flex-col items-center justify-center my-auto relative z-10">
                                  <Play className="w-6 h-6 text-[#B6D232] fill-[#B6D232]" />
                                  <span className="text-[10px] text-slate-200 font-bold truncate max-w-full mt-1">
                                    {vid.title || 'Vidéo'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                          <button
                            type="button"
                            onClick={() => setManagingProduct(null)}
                            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveProductMedia}
                            className="bg-[#B6D232] text-[#340648] font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer hover:bg-[#a3be27] shadow flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Enregistrer les Médias du Produit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                          {projectToDeleteId === proj.id ? (
                            <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-700 px-2 py-0.5 rounded-lg">
                              <span className="text-[10px] text-red-200 font-bold">Supprimer ?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  StorageService.deleteProject(proj.id);
                                  setProjectToDeleteId(null);
                                }}
                                className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                Oui
                              </button>
                              <button
                                type="button"
                                onClick={() => setProjectToDeleteId(null)}
                                className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setProjectToDeleteId(proj.id)}
                              className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                            >
                              Supprimer
                            </button>
                          )}
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

                  {/* Official Storefront & Truck Photo (Zero Modification) */}
                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-sm text-[#B6D232] flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          <span>Photo Officielle du Local & Camion GGW</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Affichée sur la page d’accueil et dans la présentation de l'entreprise sans modification ni compression.
                        </p>
                      </div>
                    </div>

                    {storePhotoMsg && (
                      <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-300 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{storePhotoMsg}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-full sm:w-64 aspect-[16/9] rounded-xl overflow-hidden border-2 border-slate-600 bg-slate-950 flex-shrink-0">
                        <img
                          src={adminStorePhoto}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.endsWith('/assets/ggw_storefront_truck.jpg')) {
                              target.src = '/assets/ggw_storefront_truck.jpg';
                            }
                          }}
                          alt="Local & Camion"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-3 w-full">
                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex items-center gap-2 bg-[#B6D232] hover:bg-[#a3be27] text-[#340648] font-bold text-xs px-4 py-2 rounded-xl shadow cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Charger une photo (ex: Local et Camion de GGW.png)</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = async (evt) => {
                                  const base64 = evt.target?.result as string;
                                  if (base64) {
                                    setAdminStorePhoto(base64);
                                    localStorage.setItem('ggw_official_store_photo', base64);
                                    window.dispatchEvent(new Event('ggw_storage_updated'));
                                    try {
                                      await fetch('/api/upload-storefront-photo', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ imageBase64: base64, filename: file.name })
                                      });
                                    } catch (err) {
                                      console.error('Error saving store photo:', err);
                                    }
                                    setStorePhotoMsg('Photo officielle mise à jour sans aucune retouche !');
                                    setTimeout(() => setStorePhotoMsg(''), 4000);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              localStorage.removeItem('ggw_official_store_photo');
                              setAdminStorePhoto('/assets/ggw_storefront_truck.jpg?t=' + Date.now());
                              window.dispatchEvent(new Event('ggw_storage_updated'));
                              setStorePhotoMsg('Image restaurée à la version par défaut.');
                              setTimeout(() => setStorePhotoMsg(''), 3000);
                            }}
                            className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Réinitialiser</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Format recommandé : Ratio panoramique 16:9 pour capturer à la fois la façade complète et le camion de service.
                        </p>
                      </div>
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
