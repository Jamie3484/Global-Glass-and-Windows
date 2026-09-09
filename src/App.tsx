/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import {
  Product,
  ProductCategory,
  Project,
  VideoItem,
  QuoteRequest,
  CommentReview,
  ContactMessage,
  CompanySettings,
  Language
} from './types';

// Layout & Branding Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { StoreShowcase } from './components/brand/StoreShowcase';

// Sections
import { HeroSection } from './components/sections/HeroSection';
import { ProductCarousel } from './components/sections/ProductCarousel';
import { CategoriesSection } from './components/sections/CategoriesSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { VideosSection } from './components/sections/VideosSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { QuoteSection } from './components/sections/QuoteSection';
import { ContactSection } from './components/sections/ContactSection';

// Modals
import { ProductModal } from './components/modals/ProductModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GeminiAiSuite } from './components/ai/GeminiAiSuite';

export default function App() {
  // Global App Language State
  const [lang, setLang] = useState<Language>('fr');

  // Business Data States (synced with StorageService)
  const [settings, setSettings] = useState<CompanySettings>(StorageService.getSettings());
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts());
  const [categories, setCategories] = useState<ProductCategory[]>(StorageService.getCategories());
  const [projects, setProjects] = useState<Project[]>(StorageService.getProjects());
  const [services, setServices] = useState(StorageService.getServices());
  const [videos, setVideos] = useState<VideoItem[]>(StorageService.getVideos());
  const [quotes, setQuotes] = useState<QuoteRequest[]>(StorageService.getQuotes());
  const [reviews, setReviews] = useState<CommentReview[]>(StorageService.getReviews());
  const [messages, setMessages] = useState<ContactMessage[]>(StorageService.getMessages());

  // Modal / Interaction States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    caption?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: ''
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Quote form prefill state
  const [quotePrefillProduct, setQuotePrefillProduct] = useState<string>('');
  const [quotePrefillDimensions, setQuotePrefillDimensions] = useState<{
    lengthInches?: number;
    widthInches?: number;
    areaSqFt?: number;
    glassType?: string;
    quantity?: number;
  }>({});
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');

  // Subscribe to storage updates for real-time reactivity
  useEffect(() => {
    const refreshData = () => {
      setSettings(StorageService.getSettings());
      setProducts(StorageService.getProducts());
      setCategories(StorageService.getCategories());
      setProjects(StorageService.getProjects());
      setServices(StorageService.getServices());
      setVideos(StorageService.getVideos());
      setQuotes(StorageService.getQuotes());
      setReviews(StorageService.getReviews());
      setMessages(StorageService.getMessages());
    };

    const unsubscribe = StorageService.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  // Handlers for smooth user navigation
  const handleOpenQuote = (productOrService?: string) => {
    if (productOrService) {
      setQuotePrefillProduct(productOrService);
    }
    const el = document.querySelector('#devis');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToProjects = () => {
    const el = document.querySelector('#realisations');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToServices = () => {
    const el = document.querySelector('#services');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToContact = () => {
    const el = document.querySelector('#contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLightbox = (imageUrl: string, title: string, caption?: string) => {
    setLightboxData({
      isOpen: true,
      imageUrl,
      title,
      caption
    });
  };

  const handleCloseLightbox = () => {
    setLightboxData(prev => ({ ...prev, isOpen: false }));
  };

  const handleSubmitReview = (reviewData: Omit<CommentReview, 'id' | 'status' | 'date'>) => {
    StorageService.addReview(reviewData);
  };

  const unreadQuotesCount = quotes.filter(q => q.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#B6D232] selection:text-[#340648]">
      
      {/* Sticky Header with Navigation & Language Switcher */}
      <Header
        settings={settings}
        lang={lang}
        onLanguageChange={setLang}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        unreadQuotesCount={unreadQuotesCount}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection
          settings={settings}
          lang={lang}
          onOpenQuote={() => handleOpenQuote()}
          onNavigateToProjects={handleNavigateToProjects}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 2. Physical Shop & Transport Truck Showcase */}
        <StoreShowcase
          settings={settings}
          lang={lang}
          onNavigateToServices={handleNavigateToServices}
          onNavigateToContact={handleNavigateToContact}
          onOpenQuote={() => handleOpenQuote('Livraison ou projet sur chantier')}
          onOpenMaps={() => {
            const el = document.querySelector('#contact');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 3. Automatic Dynamic Product Carousel */}
        <ProductCarousel
          products={products}
          categories={categories}
          lang={lang}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenQuote={(name) => handleOpenQuote(name)}
        />

        {/* 4. Products & Categories Commercial Showcase */}
        <CategoriesSection
          categories={categories}
          products={products}
          lang={lang}
          selectedCategorySlug={selectedCategorySlug}
          onSelectCategorySlug={setSelectedCategorySlug}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenQuote={(name) => handleOpenQuote(name)}
        />

        {/* 5. 14 Services Grid */}
        <ServicesSection
          services={services}
          lang={lang}
          onOpenQuote={(serviceTitle) => handleOpenQuote(serviceTitle)}
        />

        {/* 6. Projects & Before/After Gallery */}
        <ProjectsSection
          projects={projects}
          lang={lang}
          onOpenLightbox={handleOpenLightbox}
          onOpenQuote={(title) => handleOpenQuote(title)}
          onProjectsUpdated={(updated) => setProjects(updated)}
        />

        {/* 7. Workshop & Installation Videos */}
        <VideosSection
          videos={videos}
          lang={lang}
          onVideosUpdated={(updated) => setVideos(updated)}
        />

        {/* 8. Verified Customer Reviews & Moderation */}
        <ReviewsSection
          reviews={reviews}
          lang={lang}
          onSubmitReview={handleSubmitReview}
        />

        {/* 9. Gemini AI Studio & Multi-Modal Suite */}
        <GeminiAiSuite />

        {/* 10. Quote Request Form */}
        <QuoteSection
          lang={lang}
          initialProductOrService={quotePrefillProduct}
          initialDimensions={quotePrefillDimensions}
        />

        {/* 11. Contact, Coordinates & Google Maps */}
        <ContactSection
          settings={settings}
          lang={lang}
        />
      </main>

      {/* Official Footer */}
      <Footer
        settings={settings}
        categories={categories}
        lang={lang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenQuote={() => handleOpenQuote()}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
        }}
      />

      {/* Persistent Floating WhatsApp Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        categories={categories}
        settings={settings}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={(name) => handleOpenQuote(name)}
      />

      {/* Image Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.imageUrl}
        title={lightboxData.title}
        caption={lightboxData.caption}
        onClose={handleCloseLightbox}
      />

      {/* Admin & Moderation Suite */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        projects={projects}
        quotes={quotes}
        reviews={reviews}
        messages={messages}
        settings={settings}
      />

    </div>
  );
}
