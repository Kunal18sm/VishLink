import React, { useEffect, useState } from 'react';
import { Search, User, Download, MessageSquare, LogIn, Home } from 'lucide-react';

interface NavbarProps {
  wishlistCount?: number;
  onOpenProfile?: () => void;
  onOpenAiChat?: () => void;
  onOpenAuth?: () => void;
  onSelectOccasion: (occasion: string) => void;
  onSearch: (query: string) => void;
  onNavigateToSection: (sectionId: string) => void;
  currentUser?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenAiChat,
  onOpenAuth,
  onSearch,
  onNavigateToSection,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [canInstall, setCanInstall] = useState(Boolean(window.deferredPwaPrompt));

  useEffect(() => {
    const updateInstallAvailability = () => setCanInstall(Boolean(window.deferredPwaPrompt));
    window.addEventListener('pwa-install-available', updateInstallAvailability);
    return () => window.removeEventListener('pwa-install-available', updateInstallAvailability);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => onNavigateToSection('hero')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <img
            src="/logo.png"
            alt="VishLink Logo"
            className="w-11 h-11 rounded-2xl shadow-sm group-hover:scale-105 transition-transform object-cover border border-rose-200"
          />
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#e15b70] transition-colors whitespace-nowrap">
              VishLink
            </span>
            <span className="hidden md:inline-flex items-center text-[10px] font-extrabold text-[#e15b70] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80 whitespace-nowrap">
              Personalized Wishing Links
            </span>
          </div>
        </button>

        {/* Navigation Items (Home, Chat, Search, Install App, Profile) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Home Link */}
          <button
            onClick={() => onNavigateToSection('hero')}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#e15b70] transition-colors whitespace-nowrap cursor-pointer px-2 py-1"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Home</span>
          </button>

          {/* Chat Support Link */}
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#e15b70] bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer px-3 py-1.5 rounded-full border border-rose-200/80 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#e15b70]" />
              <span>Chat Support</span>
            </button>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-44 md:w-56 lg:w-64">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-full pl-4 pr-9 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e15b70] focus:bg-white focus:ring-1 focus:ring-rose-200 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#e15b70] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Install App Button */}
          {canInstall && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
              title="Install VishLink App"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Profile / Auth Button */}
          {currentUser ? (
            onOpenProfile && (
              <button
                onClick={onOpenProfile}
                title="My Profile & Links"
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 sm:py-2 rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">{currentUser.username || 'Profile'}</span>
              </button>
            )
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 bg-[#e15b70] hover:bg-[#c94358] text-white text-xs font-extrabold px-3.5 py-1.5 sm:py-2 rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
