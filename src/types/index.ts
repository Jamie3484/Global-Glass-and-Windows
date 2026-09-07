export type Language = 'fr' | 'ht' | 'en';

export type UserRole = 'super_admin' | 'admin' | 'moderator';

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameHt?: string;
  nameEn?: string;
  slug: string;
  description?: string;
  order: number;
  iconName?: string;
  image?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVideo {
  id: string;
  url: string;
  title?: string;
  thumbnailUrl?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  nameHt?: string;
  nameEn?: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  price?: number;
  priceUnit?: string; // e.g. "pi²", "unité", "ensemble"
  isAvailable: boolean;
  isFeatured: boolean;
  showOnHome: boolean;
  order: number;
  status: 'published' | 'draft';
  images: ProductImage[];
  videos?: ProductVideo[];
  specifications?: Record<string, string>;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  titleHt?: string;
  titleEn?: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  image: string;
  features: string[];
  order: number;
  isFeatured: boolean;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  type: 'standard' | 'before' | 'after';
}

export interface Project {
  id: string;
  title: string;
  titleHt?: string;
  titleEn?: string;
  description: string;
  category: 'portes' | 'fenetres' | 'douches' | 'miroirs' | 'aluminium' | 'vitrage' | 'commercial' | 'residentiel' | 'autres';
  location: string; // e.g. "Petit-Goâve, Haïti", "Port-au-Prince", "Grand-Goâve"
  date: string;
  images: ProjectImage[];
  videoUrl?: string;
  hasBeforeAfter: boolean;
  beforeImage?: string;
  afterImage?: string;
  isFeatured: boolean;
  client?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  titleHt?: string;
  titleEn?: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // YouTube embed / MP4 / Cloud URL
  category: 'atelier' | 'installation' | 'fabrication' | 'presentation' | 'promo';
  date: string;
  status: 'published' | 'draft';
  order: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CommentReview {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  isFeatured: boolean;
  projectType?: string;
  date: string;
}

export interface QuoteAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  city: string;
  productOrService: string;
  dimensions?: {
    lengthInches?: number;
    widthInches?: number;
    heightInches?: number;
    areaSqFt?: number;
  };
  quantity: number;
  glassType?: string;
  description: string;
  budgetEstimate?: string;
  attachments: QuoteAttachment[];
  status: 'new' | 'in_review' | 'quoted' | 'accepted' | 'archived';
  notes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'logo' | 'document';
  sizeFormatted: string;
  sizeBytes: number;
  mimeType: string;
  altText: string;
  category: string;
  uploadedAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  taglineSecondary: string;
  aboutText: string;
  aboutMission: string;
  aboutVision: string;
  aboutValues: string[];
  address: string;
  addressDetails: string;
  city: string;
  country: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
    mapsUrl: string;
  };
  phone1: string;
  phone2: string;
  phone3: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  openingHours: {
    days: string;
    hours: string;
    note?: string;
  };
  glassPricePerSqFt: {
    clear6mm: number;
    clear8mm: number;
    clear10mm: number;
    clear12mm: number;
    tintedBronze: number;
    tintedGrey: number;
    mirror4mm: number;
    mirror6mm: number;
    laminated6mm: number;
    tempered10mm: number;
  };
  currency: string;
  socialLinks: {
    facebook: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
  homeSections: {
    hero: boolean;
    carousel: boolean;
    companySpotlight: boolean;
    products: boolean;
    services: boolean;
    projects: boolean;
    videos: boolean;
    calculator: boolean;
    reviews: boolean;
    quoteForm: boolean;
    contact: boolean;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'quote' | 'review' | 'message' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
