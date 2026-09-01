import {
  Product,
  ProductCategory,
  Service,
  Project,
  VideoItem,
  CommentReview,
  CompanySettings,
  QuoteRequest,
  ContactMessage,
  MediaItem,
  UserAdmin,
  AppNotification
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_VIDEOS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_ADMINS,
  INITIAL_QUOTES,
  INITIAL_MESSAGES
} from '../data/initialData';

const KEYS = {
  PRODUCTS: 'ggw_products_v1',
  CATEGORIES: 'ggw_categories_v1',
  SERVICES: 'ggw_services_v1',
  PROJECTS: 'ggw_projects_v1',
  VIDEOS: 'ggw_videos_v1',
  REVIEWS: 'ggw_reviews_v1',
  SETTINGS: 'ggw_settings_v1',
  ADMINS: 'ggw_admins_v1',
  CURRENT_USER: 'ggw_current_user_v1',
  QUOTES: 'ggw_quotes_v1',
  MESSAGES: 'ggw_messages_v1',
  MEDIA: 'ggw_media_v1',
  NOTIFICATIONS: 'ggw_notifications_v1',
};

const EVENT_NAME = 'ggw_storage_updated';

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultVal;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Subscribe to changes
  subscribe(callback: (key?: string) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail?.key);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },

  // Company Settings
  getSettings(): CompanySettings {
    return getStored<CompanySettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  updateSettings(settings: Partial<CompanySettings>): CompanySettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setStored(KEYS.SETTINGS, updated);
    return updated;
  },

  // Categories
  getCategories(): ProductCategory[] {
    return getStored<ProductCategory[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategory(category: ProductCategory): ProductCategory[] {
    const list = this.getCategories();
    const index = list.findIndex(c => c.id === category.id);
    let updated: ProductCategory[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = category;
    } else {
      updated = [...list, { ...category, id: category.id || `cat-${Date.now()}` }];
    }
    setStored(KEYS.CATEGORIES, updated);
    return updated;
  },
  deleteCategory(id: string): ProductCategory[] {
    const list = this.getCategories().filter(c => c.id !== id);
    setStored(KEYS.CATEGORIES, list);
    return list;
  },

  // Products
  getProducts(): Product[] {
    return getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProduct(product: Product): Product[] {
    const list = this.getProducts();
    const index = list.findIndex(p => p.id === product.id);
    let updated: Product[];
    const now = new Date().toISOString();
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...product, updatedAt: now };
    } else {
      const newProd: Product = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      updated = [newProd, ...list];
    }
    setStored(KEYS.PRODUCTS, updated);
    return updated;
  },
  deleteProduct(id: string): Product[] {
    const list = this.getProducts().filter(p => p.id !== id);
    setStored(KEYS.PRODUCTS, list);
    return list;
  },

  // Services
  getServices(): Service[] {
    return getStored<Service[]>(KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveService(service: Service): Service[] {
    const list = this.getServices();
    const index = list.findIndex(s => s.id === service.id);
    let updated: Service[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = service;
    } else {
      updated = [...list, { ...service, id: service.id || `serv-${Date.now()}` }];
    }
    setStored(KEYS.SERVICES, updated);
    return updated;
  },
  deleteService(id: string): Service[] {
    const list = this.getServices().filter(s => s.id !== id);
    setStored(KEYS.SERVICES, list);
    return list;
  },

  // Projects / Réalisations
  getProjects(): Project[] {
    return getStored<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  },
  saveProject(project: Project): Project[] {
    const list = this.getProjects();
    const index = list.findIndex(p => p.id === project.id);
    let updated: Project[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = project;
    } else {
      updated = [{ ...project, id: project.id || `proj-${Date.now()}` }, ...list];
    }
    setStored(KEYS.PROJECTS, updated);
    return updated;
  },
  deleteProject(id: string): Project[] {
    const list = this.getProjects().filter(p => p.id !== id);
    setStored(KEYS.PROJECTS, list);
    return list;
  },

  // Videos
  getVideos(): VideoItem[] {
    return getStored<VideoItem[]>(KEYS.VIDEOS, INITIAL_VIDEOS);
  },
  saveVideo(video: VideoItem): VideoItem[] {
    const list = this.getVideos();
    const index = list.findIndex(v => v.id === video.id);
    let updated: VideoItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = video;
    } else {
      updated = [{ ...video, id: video.id || `vid-${Date.now()}` }, ...list];
    }
    setStored(KEYS.VIDEOS, updated);
    return updated;
  },
  deleteVideo(id: string): VideoItem[] {
    const list = this.getVideos().filter(v => v.id !== id);
    setStored(KEYS.VIDEOS, list);
    return list;
  },

  // Reviews / Comments
  getReviews(): CommentReview[] {
    return getStored<CommentReview[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  getApprovedReviews(): CommentReview[] {
    return this.getReviews().filter(r => r.status === 'approved');
  },
  addReview(review: Omit<CommentReview, 'id' | 'status' | 'date'>): CommentReview {
    const list = this.getReviews();
    const newRev: CommentReview = {
      ...review,
      id: `rev-${Date.now()}`,
      status: 'pending', // IMPORTANT: pending moderation by default
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newRev, ...list];
    setStored(KEYS.REVIEWS, updated);

    // Notify admin
    this.addNotification({
      title: 'Nouvel avis client en attente',
      message: `${review.firstName} ${review.lastName} a laissé une note de ${review.rating}/5.`,
      type: 'review',
      link: '/admin/reviews'
    });

    return newRev;
  },
  updateReviewStatus(id: string, status: 'approved' | 'rejected', isFeatured?: boolean): CommentReview[] {
    const list = this.getReviews();
    const updated = list.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(isFeatured !== undefined ? { isFeatured } : {})
        };
      }
      return r;
    });
    setStored(KEYS.REVIEWS, updated);
    return updated;
  },
  deleteReview(id: string): CommentReview[] {
    const list = this.getReviews().filter(r => r.id !== id);
    setStored(KEYS.REVIEWS, list);
    return list;
  },

  // Quote Requests
  getQuotes(): QuoteRequest[] {
    return getStored<QuoteRequest[]>(KEYS.QUOTES, INITIAL_QUOTES);
  },
  addQuoteRequest(quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>): QuoteRequest {
    const list = this.getQuotes();
    const newQuote: QuoteRequest = {
      ...quote,
      id: `quote-${Date.now().toString().slice(-4)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const updated = [newQuote, ...list];
    setStored(KEYS.QUOTES, updated);

    // Create Notification
    this.addNotification({
      title: 'Nouvelle demande de devis reçue',
      message: `${quote.fullName} (${quote.city}) pour ${quote.productOrService}.`,
      type: 'quote',
      link: '/admin/quotes'
    });

    return newQuote;
  },
  updateQuoteStatus(id: string, status: QuoteRequest['status'], notes?: string): QuoteRequest[] {
    const list = this.getQuotes();
    const updated = list.map(q => {
      if (q.id === id) {
        return {
          ...q,
          status,
          ...(notes !== undefined ? { notes } : {})
        };
      }
      return q;
    });
    setStored(KEYS.QUOTES, updated);
    return updated;
  },
  deleteQuote(id: string): QuoteRequest[] {
    const list = this.getQuotes().filter(q => q.id !== id);
    setStored(KEYS.QUOTES, list);
    return list;
  },

  // Contact Messages
  getMessages(): ContactMessage[] {
    return getStored<ContactMessage[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
  },
  addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): ContactMessage {
    const list = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const updated = [newMsg, ...list];
    setStored(KEYS.MESSAGES, updated);

    this.addNotification({
      title: 'Nouveau message de contact',
      message: `De ${msg.fullName} : "${msg.subject}"`,
      type: 'message',
      link: '/admin/messages'
    });

    return newMsg;
  },
  markMessageRead(id: string): ContactMessage[] {
    const list = this.getMessages();
    const updated = list.map(m => m.id === id ? { ...m, isRead: true } : m);
    setStored(KEYS.MESSAGES, updated);
    return updated;
  },
  deleteMessage(id: string): ContactMessage[] {
    const list = this.getMessages().filter(m => m.id !== id);
    setStored(KEYS.MESSAGES, list);
    return list;
  },

  // Media Library
  getMediaItems(): MediaItem[] {
    const defaultMedia: MediaItem[] = [
      {
        id: 'media-1',
        name: 'Logo-nouveau-officiel.jpeg',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        type: 'logo',
        sizeFormatted: '420 KB',
        sizeBytes: 430080,
        mimeType: 'image/jpeg',
        altText: 'Logo officiel GLOBAL GLASS AND WINDOWS',
        category: 'Branding',
        uploadedAt: '2026-01-01T00:00:00Z'
      },
      {
        id: 'media-2',
        name: 'Local-et-camion-Petit-Goave.jpeg',
        url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        sizeFormatted: '1.2 MB',
        sizeBytes: 1258291,
        mimeType: 'image/jpeg',
        altText: 'Local physique et camion de service GLOBAL GLASS AND WINDOWS',
        category: 'Installations',
        uploadedAt: '2026-01-01T00:00:00Z'
      }
    ];
    return getStored<MediaItem[]>(KEYS.MEDIA, defaultMedia);
  },
  addMediaItem(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const list = this.getMediaItems();
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    const updated = [newItem, ...list];
    setStored(KEYS.MEDIA, updated);
    return newItem;
  },
  deleteMediaItem(id: string): MediaItem[] {
    const list = this.getMediaItems().filter(m => m.id !== id);
    setStored(KEYS.MEDIA, list);
    return list;
  },

  // Notifications
  getNotifications(): AppNotification[] {
    return getStored<AppNotification[]>(KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'Système opérationnel',
        message: 'Bienvenue sur le portail d’administration officiel GLOBAL GLASS AND WINDOWS.',
        type: 'system',
        isRead: false,
        createdAt: '2026-03-01T08:00:00Z'
      }
    ]);
  },
  addNotification(notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>): void {
    const list = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setStored(KEYS.NOTIFICATIONS, [newNotif, ...list]);
  },
  markNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    setStored(KEYS.NOTIFICATIONS, updated);
  },

  // Auth / Admin Users
  getCurrentUser(): UserAdmin | null {
    return getStored<UserAdmin | null>(KEYS.CURRENT_USER, INITIAL_ADMINS[0]);
  },
  login(email: string, role: UserAdmin['role'] = 'super_admin'): UserAdmin {
    const admin = INITIAL_ADMINS.find(a => a.email.toLowerCase() === email.toLowerCase()) || {
      id: `admin-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: role,
      createdAt: new Date().toISOString()
    };
    setStored(KEYS.CURRENT_USER, admin);
    return admin;
  },
  logout(): void {
    setStored(KEYS.CURRENT_USER, null);
  },

  // Helper for file reading (converts File to base64 Data URL)
  async readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Reset to initial demo data if needed
  resetToDefaults(): void {
    localStorage.clear();
    setStored(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStored(KEYS.SERVICES, INITIAL_SERVICES);
    setStored(KEYS.PROJECTS, INITIAL_PROJECTS);
    setStored(KEYS.VIDEOS, INITIAL_VIDEOS);
    setStored(KEYS.REVIEWS, INITIAL_REVIEWS);
    setStored(KEYS.SETTINGS, INITIAL_SETTINGS);
    setStored(KEYS.ADMINS, INITIAL_ADMINS);
    setStored(KEYS.QUOTES, INITIAL_QUOTES);
    setStored(KEYS.MESSAGES, INITIAL_MESSAGES);
    setStored(KEYS.CURRENT_USER, INITIAL_ADMINS[0]);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: 'all' } }));
  }
};
