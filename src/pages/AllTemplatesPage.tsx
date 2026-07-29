import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Search,
  ExternalLink,
  Star,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TemplateItem } from '../types';

interface AllTemplatesPageProps {
  templates: TemplateItem[];
  onBack: () => void;
  onOpenCustomizeModal: (template: TemplateItem) => void;
  initialCategory?: string | null;
}

export const AllTemplatesPage: React.FC<AllTemplatesPageProps> = ({
  templates,
  onBack,
  onOpenCustomizeModal,
  initialCategory = null,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'free', label: '🎁 Free' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'anniversary', label: 'Anniversary' },
    { id: "valentine's", label: "Valentine's" },
    { id: 'couple', label: 'Couple' },
    { id: 'best friend', label: 'Best Friend' },
    { id: 'sorry', label: 'Sorry & Love' },
    { id: 'girlfriend', label: 'Girlfriend' },
    { id: 'family', label: 'Family' },
    { id: 'funny', label: 'Funny' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'parents', label: 'Parents' },
    { id: 'males', label: 'Males' },
    { id: 'females', label: 'Females' },
    { id: 'festival', label: 'Festival' },
    { id: 'new year', label: 'New Year' },
    { id: 'diwali', label: 'Diwali' },
    { id: 'christmas', label: 'Christmas' },
  ];

  // Filter templates by category and search
  const filteredTemplates = templates.filter((template) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'free'
        ? template.price === 0
        : template.occasions.some((tag) => {
            const t = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
            const c = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
            return t.includes(c) || c.includes(t);
          });

    // Search match
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.occasions.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

    return matchesCategory && matchesSearch;
  });

  const handleOpenLivePreview = (template: TemplateItem) => {
    const url =
      template.previewUrl ||
      `https://all-sub-websites.onrender.com/wish/${template.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-[#e15b70] text-xs font-bold px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> Full VishLink Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            All Wishing Website Templates
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Select any template to customize your wish link, add recipient names, photos, special message, and view your live website.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by name, birthday, anniversary..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm focus:border-[#e15b70] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-100"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Categories Pill Bar with Left/Right Scroll Arrows */}
          <div className="relative flex items-center gap-2 max-w-full my-2">
            <button
              onClick={() => handleScrollCategories('left')}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-[#e15b70] border border-slate-200 shadow-xs shrink-0 transition cursor-pointer z-10"
              title="Scroll Left"
              aria-label="Scroll Categories Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto py-2 px-1 scroll-smooth w-full no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#e15b70] to-[#d4485e] text-white shadow-md shadow-rose-200 scale-102'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleScrollCategories('right')}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-[#e15b70] border border-slate-200 shadow-xs shrink-0 transition cursor-pointer z-10"
              title="Scroll Right"
              aria-label="Scroll Categories Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Results Count */}
          <div className="text-center text-xs font-semibold text-slate-400 pt-1">
            Showing {filteredTemplates.length} templates
          </div>
        </div>

        {/* 3 Columns Responsive Template Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Filter className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No templates found</h3>
            <p className="text-xs text-slate-500">
              Try clearing your search query or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
                  onClick={() => onOpenCustomizeModal(template)}
                >
                  {/* Image Container - Full-bleed crisp HD cover display */}
                  <div
                    className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-200/80"
                    title="Click to personalize & create wishing webpage"
                  >
                    <img
                      src={template.image}
                      alt={template.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-20 group-hover:opacity-40 transition-opacity rounded-2xl pointer-events-none" />

                    {/* Personalize Purchase Form Hint on Image Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 bg-[#e15b70] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Customize & Order Form</span>
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/10">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{template.rating || 4.9}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      {/* Title */}
                      <h3
                        className="font-sans font-bold text-slate-900 text-xl line-clamp-1 group-hover:text-[#e15b70] transition-colors"
                      >
                        {template.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          {template.price === 0 ? (
                            <span className="text-2xl font-black text-emerald-600">FREE</span>
                          ) : (
                            <span className="text-2xl font-black text-slate-900">₹{template.price}</span>
                          )}
                          {template.price > 0 && template.originalPrice && template.originalPrice > template.price && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                              ₹{template.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLivePreview(template);
                          }}
                          className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-[#e15b70] hover:bg-rose-50 hover:border-rose-200 transition-colors"
                          title="Open Live Preview Link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCustomizeModal(template);
                          }}
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#e15b70] to-[#d4485e] hover:from-[#c94358] hover:to-[#be3b50] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-rose-200 hover:shadow-lg transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Personalize</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
