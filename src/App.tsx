import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopByOccasion } from './components/ShopByOccasion';
import { TemplateSlider } from './components/TemplateSlider';
import { HowItWorks } from './components/HowItWorks';
import { WhyVishLink } from './components/WhyVishLink';
import { TestimonialsSlider } from './components/TestimonialsSlider';
import { FeedbackSection } from './components/FeedbackSection';
import { InstagramBanner } from './components/InstagramBanner';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { CustomizePage } from './pages/CustomizePage';
import { ProfilePage } from './pages/ProfilePage';
import { FindLinkPage } from './pages/FindLinkPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { FaqsPage } from './pages/FaqsPage';
import { ValidityPage } from './pages/ValidityPage';
import { AiChatPage } from './pages/AiChatPage';
import { AllTemplatesPage } from './pages/AllTemplatesPage';
import { AdminPage } from './pages/AdminPage';

import { TEMPLATES } from './data/mockData';
import { TemplateItem, PurchasedOrder } from './types';

export type PageType =
  | 'home'
  | 'customize'
  | 'profile'
  | 'find-link'
  | 'about'
  | 'contact'
  | 'terms'
  | 'faqs'
  | 'validity'
  | 'ai-chat'
  | 'all-templates'
  | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedTemplateForCustomize, setSelectedTemplateForCustomize] = useState<TemplateItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [templates, setTemplates] = useState<TemplateItem[]>(TEMPLATES);

  const [purchasedOrders, setPurchasedOrders] = useState<PurchasedOrder[]>([
    {
      id: 'VL-892410',
      wishingSlug: 'priya-sharma-birthday-2026',
      wishingUrl: 'https://vishlink.app/wish/priya-sharma-birthday-2026',
      template: TEMPLATES[0],
      senderName: 'Kunal Vishu',
      receiverName: 'Priya Sharma',
      specialMessage: 'Wishing you a day filled with endless love, laughter, and golden memories!',
      uploadedImages: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=300',
      ],
      themeColor: 'Rose Pink',
      totalPrice: 199,
      purchaseDate: '24 Oct 2025',
      status: 'Active & Ready',
      musicTrack: 'Happy Birthday LoFi Remix',
    },
  ]);

  const [wishlistCount] = useState<number>(3);

  // Fetch Live Templates from Backend MongoDB API (/api/templates)
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.templates && data.templates.length > 0) {
          const mapped: TemplateItem[] = data.templates.map((t: any) => ({
            id: t._id || t.id,
            title: t.webName || 'Wishing Template',
            price: typeof t.priceForTemporary === 'number' ? t.priceForTemporary : 0,
            originalPrice: typeof t.priceForPermanent === 'number' ? t.priceForPermanent : 399,
            image: t.imageUrl?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800',
            description: t.description || 'Custom interactive wishing webpage',
            occasions: t.tags && t.tags.length > 0 ? t.tags : ['birthday', 'all'],
            rating: 4.9,
            reviewsCount: t.soldOut || 42,
            includes: ['Interactive Web Page', 'Custom Photos', 'Music Track', 'Custom Wish Message'],
            customizableFields: ['Recipient Name', 'Sender Name', 'Special Message', 'Uploaded Photos'],
            previewUrl: t.webUrl,
            imageNeeded: typeof t.imageNeeded === 'number' ? t.imageNeeded : 5,
            badge: t.priority > 5 ? 'Top Rated' : undefined,
          }));
          setTemplates(mapped);
        }
      })
      .catch((err) => {
        console.error('Could not load live templates from backend:', err);
      });
  }, []);

  // Load User from JWT token on mount
  useEffect(() => {
    const token = localStorage.getItem('vishlink_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Page Switcher Helper
  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section scroll handler for Home Page
  const handleNavigateToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectOccasion = (occasionName: string) => {
    setSelectedOccasion(occasionName);
    navigateToPage('all-templates');
  };

  const handleOpenCustomize = (template: TemplateItem) => {
    setSelectedTemplateForCustomize(template);
    navigateToPage('customize');
  };

  const handleBuyNow = (newOrder: PurchasedOrder) => {
    setPurchasedOrders((prev) => [newOrder, ...prev]);
    navigateToPage('profile');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-rose-100 selection:text-[#e15b70]">
      {/* 1. Top Bar */}
      <TopBar
        onOpenTrackOrder={() => navigateToPage('find-link')}
        onOpenHelp={() => navigateToPage('faqs')}
        onOpenProfile={() => navigateToPage('profile')}
        onOpenAiChat={() => navigateToPage('ai-chat')}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        wishlistCount={wishlistCount}
        onOpenProfile={() => navigateToPage('profile')}
        onOpenAiChat={() => navigateToPage('ai-chat')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSelectOccasion={handleSelectOccasion}
        onSearch={(query) => {
          setSelectedOccasion(query);
          navigateToPage('all-templates');
        }}
        onNavigateToSection={handleNavigateToSection}
        currentUser={currentUser}
      />

      {/* 3. Dynamic Page View */}
      <main>
        {currentPage === 'home' && (
          <>
            <Hero
              onExploreTemplates={() => navigateToPage('all-templates')}
              onHowItWorks={() => handleNavigateToSection('how-it-works')}
            />

            <ShopByOccasion
              selectedOccasion={selectedOccasion}
              onSelectOccasion={handleSelectOccasion}
              onViewAll={() => navigateToPage('all-templates')}
            />

            <TemplateSlider
              templates={templates}
              selectedOccasion={selectedOccasion}
              onOpenCustomizeModal={handleOpenCustomize}
              onViewAllTemplates={() => navigateToPage('all-templates')}
            />

            <HowItWorks />

            <WhyVishLink />

            <TestimonialsSlider />

            <InstagramBanner />

            <FeedbackSection />
          </>
        )}

        {currentPage === 'all-templates' && (
          <AllTemplatesPage
            templates={templates}
            initialCategory={selectedOccasion}
            onBack={() => navigateToPage('home')}
            onOpenCustomizeModal={handleOpenCustomize}
          />
        )}

        {currentPage === 'customize' && selectedTemplateForCustomize && (
          <CustomizePage
            template={selectedTemplateForCustomize}
            onBack={() => navigateToPage('home')}
            onBuyNow={handleBuyNow}
            onExploreFreeTemplates={() => handleSelectOccasion('free')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            purchasedOrders={purchasedOrders}
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => navigateToPage('all-templates')}
            onFindLink={() => navigateToPage('find-link')}
            onLogout={() => setCurrentUser(null)}
            onOpenAdmin={() => navigateToPage('admin')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage onBack={() => navigateToPage('home')} />
        )}

        {currentPage === 'find-link' && (
          <FindLinkPage
            purchasedOrders={purchasedOrders}
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => navigateToPage('all-templates')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => navigateToPage('all-templates')}
          />
        )}

        {currentPage === 'contact' && <ContactPage onBack={() => navigateToPage('home')} />}

        {currentPage === 'terms' && <TermsPage onBack={() => navigateToPage('home')} />}

        {currentPage === 'faqs' && (
          <FaqsPage
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => navigateToPage('all-templates')}
          />
        )}

        {currentPage === 'validity' && (
          <ValidityPage
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => navigateToPage('all-templates')}
          />
        )}

        {currentPage === 'ai-chat' && <AiChatPage onBack={() => navigateToPage('home')} />}
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigateToSection={handleNavigateToSection}
        onNavigateToPage={navigateToPage}
        onOpenTrackOrder={() => navigateToPage('find-link')}
      />

      {/* 5. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
