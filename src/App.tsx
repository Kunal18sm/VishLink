/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopByOccasion } from './components/ShopByOccasion';
import { TemplateSlider } from './components/TemplateSlider';
import { HowItWorks } from './components/HowItWorks';
import { WhyVishLink } from './components/WhyVishLink';
import { PopularCategories } from './components/PopularCategories';
import { TestimonialsSlider } from './components/TestimonialsSlider';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { CustomizePage } from './pages/CustomizePage';
import { ProfilePage } from './pages/ProfilePage';
import { FindLinkPage } from './pages/FindLinkPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { FaqsPage } from './pages/FaqsPage';
import { ValidityPage } from './pages/ValidityPage';

import { TEMPLATES } from './data/mockData';
import { TemplateItem, CartItem, PurchasedOrder } from './types';

export type PageType = 'home' | 'customize' | 'profile' | 'find-link' | 'about' | 'contact' | 'terms' | 'faqs' | 'validity';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedTemplateForCustomize, setSelectedTemplateForCustomize] = useState<TemplateItem | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      template: TEMPLATES[0],
      quantity: 1,
      customization: {
        recipientName: 'Priya',
        senderName: 'Vishu',
        message: 'Wishing you a happy anniversary filled with love!',
        ribbonColor: 'Rose Pink',
        selectedAddons: ['Personalized Greeting Card']
      }
    }
  ]);

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
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=300'
      ],
      themeColor: 'Rose Pink',
      totalPrice: 199,
      purchaseDate: '24 Oct 2025',
      status: 'Active & Ready',
      musicTrack: 'Happy Birthday LoFi Remix'
    },
    {
      id: 'VL-714022',
      wishingSlug: 'rahul-verma-love-2026',
      wishingUrl: 'https://vishlink.app/wish/rahul-verma-love-2026',
      template: TEMPLATES[1],
      senderName: 'Kunal Vishu',
      receiverName: 'Rahul Verma',
      specialMessage: 'Happy Birthday Bro! Hope this personalized hamper brings a huge smile to your face.',
      uploadedImages: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300'
      ],
      themeColor: 'Satin Gold',
      totalPrice: 249,
      purchaseDate: '15 Sep 2025',
      status: 'Active & Ready',
      musicTrack: 'Romantic Acoustic Guitar'
    }
  ]);

  const [wishlistCount] = useState<number>(3);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

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
    handleNavigateToSection('templates');
  };

  const handleOpenCustomize = (template: TemplateItem) => {
    setSelectedTemplateForCustomize(template);
    navigateToPage('customize');
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleBuyNow = (newOrder: PurchasedOrder) => {
    setPurchasedOrders(prev => [newOrder, ...prev]);
    navigateToPage('profile');
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCartItems(prev => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-rose-100 selection:text-[#e15b70]">
      
      {/* 1. Top Bar */}
      <TopBar
        onOpenTrackOrder={() => navigateToPage('find-link')}
        onOpenHelp={() => navigateToPage('faqs')}
        onOpenProfile={() => navigateToPage('profile')}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => navigateToPage('profile')}
        onSelectOccasion={handleSelectOccasion}
        onSearch={(query) => {
          setSelectedOccasion(query);
          handleNavigateToSection('templates');
        }}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* 3. Dynamic Page View */}
      <main>
        {currentPage === 'home' && (
          <>
            <Hero
              onExploreTemplates={() => handleNavigateToSection('templates')}
              onHowItWorks={() => handleNavigateToSection('how-it-works')}
            />

            <ShopByOccasion
              selectedOccasion={selectedOccasion}
              onSelectOccasion={handleSelectOccasion}
              onViewAll={() => {
                setSelectedOccasion(null);
                handleNavigateToSection('templates');
              }}
            />

            <TemplateSlider
              templates={TEMPLATES}
              selectedOccasion={selectedOccasion}
              onOpenCustomizeModal={handleOpenCustomize}
              onViewAllTemplates={() => {
                setSelectedOccasion(null);
                handleNavigateToSection('templates');
              }}
            />

            <HowItWorks />

            <WhyVishLink />

            <PopularCategories
              onSelectCategory={(catName) => {
                setSelectedOccasion(catName);
                handleNavigateToSection('templates');
              }}
              onViewAllCategories={() => handleNavigateToSection('templates')}
            />

            <TestimonialsSlider />

            <Newsletter />
          </>
        )}

        {currentPage === 'customize' && selectedTemplateForCustomize && (
          <CustomizePage
            template={selectedTemplateForCustomize}
            onBack={() => navigateToPage('home')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            purchasedOrders={purchasedOrders}
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => handleNavigateToSection('templates')}
            onFindLink={() => navigateToPage('find-link')}
          />
        )}

        {currentPage === 'find-link' && (
          <FindLinkPage
            purchasedOrders={purchasedOrders}
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => handleNavigateToSection('templates')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => handleNavigateToSection('templates')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onBack={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'terms' && (
          <TermsPage
            onBack={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'faqs' && (
          <FaqsPage
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => handleNavigateToSection('templates')}
          />
        )}

        {currentPage === 'validity' && (
          <ValidityPage
            onBack={() => navigateToPage('home')}
            onExploreTemplates={() => handleNavigateToSection('templates')}
          />
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer
        onNavigateToSection={handleNavigateToSection}
        onNavigateToPage={navigateToPage}
        onOpenTrackOrder={() => navigateToPage('find-link')}
      />

      {/* 5. Cart Drawer (Slide-Over) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

    </div>
  );
}
