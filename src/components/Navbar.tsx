import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, ChevronDown, Sparkles, Bot, LogIn } from 'lucide-react';

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
  wishlistCount,
  onOpenProfile,
  onOpenAiChat,
  onOpenAuth,
  onSelectOccasion,
  onSearch,
  onNavigateToSection,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigateToSection('hero')}
          className="flex items-center gap-2 cursor-pointer group text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e15b70] via-[#eb6b7f] to-[#f48a9b] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 group-hover:text-[#e15b70] transition-colors">
              VishLink
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-[#e15b70] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              Personalized Wishing Links
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
          <button
            onClick={() => onNavigateToSection('hero')}
            className="hover:text-[#e15b70] transition-colors cursor-pointer"
          >
            Home
          </button>

          {/* Occasions Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown('occasions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => onNavigateToSection('occasions')}
              className="flex items-center gap-1 hover:text-[#e15b70] transition-colors py-1 cursor-pointer"
            >
              <span>Wish Categories</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#e15b70]" />
            </button>
            {activeDropdown === 'occasions' && (
              <div className="absolute top-full left-0 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                {[
                  'Birthday 3D Cake',
                  'Anniversary Love Story',
                  'Valentine Proposal',
                  'Best Friends Roast',
                  'Festive Greetings',
                  'Sorry & Reconnect',
                ].map((occ) => (
                  <button
                    key={occ}
                    onClick={() => {
                      onSelectOccasion(occ);
                      onNavigateToSection('templates');
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-[#e15b70] transition-colors cursor-pointer"
                  >
                    {occ}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateToSection('templates')}
            className="hover:text-[#e15b70] transition-colors cursor-pointer"
          >
            Explore Wish Templates
          </button>

          {/* AI Support Bot Link */}
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200"
            >
              <Bot className="w-3.5 h-3.5 text-[#e15b70]" />
              <span>AI Bot</span>
            </button>
          )}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-44 md:w-56">
            <input
              type="text"
              placeholder="Search cake, song wish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-9 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70] transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#e15b70] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Install PWA App Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
              title="Install VishLink App"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>

            {/* AI Bot Mobile Button */}
            {onOpenAiChat && (
              <button
                onClick={onOpenAiChat}
                title="AI Support Bot"
                className="lg:hidden p-2 rounded-full text-[#e15b70] bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <Bot className="w-4 h-4" />
              </button>
            )}

            {/* Auth / Profile Button */}
            {currentUser ? (
              onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  title="My Profile & Links"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">{currentUser.username || 'Profile'}</span>
                </button>
              )
            ) : (
              onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 bg-[#e15b70] hover:bg-[#c94358] text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
