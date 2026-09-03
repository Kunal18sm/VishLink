import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles, Filter, Eye, ExternalLink, Crown } from 'lucide-react';
import { TemplateItem } from '../types';

interface TemplateSliderProps {
  templates: TemplateItem[];
  selectedOccasion: string | null;
  onOpenCustomizeModal: (template: TemplateItem) => void;
  onViewAllTemplates: () => void;
}

export const TemplateSlider: React.FC<TemplateSliderProps> = ({
  templates,
  selectedOccasion,
  onOpenCustomizeModal,
  onViewAllTemplates,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Filter templates if an occasion is selected
  const filteredTemplates = selectedOccasion
    ? templates.filter((t) =>
        t.occasions.some(
          (occ) => occ.toLowerCase() === selectedOccasion.toLowerCase()
        )
      )
    : templates;

  const displayTemplates = filteredTemplates.length > 0 ? filteredTemplates : templates;

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(displayTemplates.length / ITEMS_PER_PAGE);
  const visibleTemplates = displayTemplates.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleOpenLivePreview = (template: TemplateItem) => {
    const url =
      template.previewUrl ||
      `https://all-sub-websites.onrender.com/wish/${template.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="templates" className="py-20 bg-gradient-to-b from-slate-50 via-rose-50/20 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-[#e15b70] text-xs font-bold px-3.5 py-1.5 rounded-full border border-rose-200 mb-3 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Premium Wishing Templates
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Pick a Template, We'll Do the Rest
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Select any template to customize your wish link, add recipient names, photos, special message, and view your live website.
          </p>

          {selectedOccasion && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white text-[#e15b70] text-xs font-bold px-4 py-1.5 rounded-full border border-rose-200 shadow-xs">
              <Filter className="w-3.5 h-3.5" />
              <span>Showing: {selectedOccasion}</span>
              <button
                onClick={onViewAllTemplates}
                className="ml-1 text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Carousel / Grid Container */}
        <div className="relative">
          {/* Slider Controls Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage + 1} of {totalPages} ({displayTemplates.length} templates available)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous page"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#e15b70] hover:border-[#e15b70] hover:shadow-md transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next page"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#e15b70] hover:border-[#e15b70] hover:shadow-md transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 3-Column Responsive Grid (3 per row) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTemplates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
                  onClick={() => onOpenCustomizeModal(template)}
                >
                  {/* Card Header & Thumbnail - Full-bleed crisp HD cover image */}
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

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      {/* Title */}
                      <h3
                        className="font-sans font-bold text-slate-900 text-lg sm:text-xl line-clamp-1 group-hover:text-[#e15b70] transition-colors"
                      >
                        {template.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          {template.price === 0 ? (
                            <span className="text-xl font-black text-emerald-600">FREE</span>
                          ) : (
                            <span className="text-xl font-black text-slate-900">₹{template.price}</span>
                          )}
                          {template.price > 0 && template.originalPrice && template.originalPrice > template.price && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                              ₹{template.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLivePreview(template);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#e15b70] hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
                          title="Open Live Preview Link"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCustomizeModal(template);
                          }}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-[#e15b70] to-[#d4485e] hover:from-[#c94358] hover:to-[#be3b50] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-rose-200 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Personalize</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentPage === idx
                      ? 'w-8 bg-[#e15b70]'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={onViewAllTemplates}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
          >
            <span>View All Wish Templates ({displayTemplates.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
