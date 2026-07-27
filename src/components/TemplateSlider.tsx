import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles } from 'lucide-react';
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
  onViewAllTemplates
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter templates if an occasion is selected
  const filteredTemplates = selectedOccasion
    ? templates.filter(t => t.occasions.includes(selectedOccasion))
    : templates;

  const displayTemplates = filteredTemplates.length > 0 ? filteredTemplates : templates;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? Math.max(0, displayTemplates.length - 3) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= displayTemplates.length - 3 ? 0 : prev + 1));
  };

  return (
    <section id="templates" className="py-16 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Pick a Template, We'll Do the Rest
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Choose from our wide range of beautiful templates for every occasion.
          </p>
          {selectedOccasion && (
            <div className="mt-3 inline-flex items-center gap-2 bg-rose-100 text-[#e15b70] text-xs font-semibold px-3 py-1 rounded-full">
              <span>Filter: {selectedOccasion}</span>
              <button onClick={onViewAllTemplates} className="underline cursor-pointer">Clear</button>
            </div>
          )}
        </div>

        {/* Slider Container */}
        <div className="relative px-2 md:px-10">
          
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#e15b70] hover:border-[#e15b70] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#e15b70] hover:border-[#e15b70] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Track */}
          <div className="overflow-hidden py-4">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 transition-transform duration-500 ease-in-out"
            >
              {displayTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image */}
                  <div className="relative aspect-square overflow-hidden bg-rose-50/50">
                    <img
                      src={template.image}
                      alt={template.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {template.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#e15b70] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {template.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-[#e15b70] transition-colors">
                        {template.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {template.occasions.join(', ')}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900">₹{template.price}</span>
                        {template.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through ml-1">₹{template.originalPrice}</span>
                        )}
                      </div>

                      <button
                        onClick={() => onOpenCustomizeModal(template)}
                        className="inline-flex items-center gap-1 bg-rose-50 hover:bg-[#e15b70] text-[#e15b70] hover:text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Personalize</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={onViewAllTemplates}
            className="inline-flex items-center gap-2 bg-[#e15b70] hover:bg-[#c94358] text-white font-semibold text-sm px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
