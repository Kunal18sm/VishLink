import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { OCCASIONS } from '../data/mockData';

interface ShopByOccasionProps {
  selectedOccasion: string | null;
  onSelectOccasion: (occasionName: string) => void;
  onViewAll: () => void;
}

export const ShopByOccasion: React.FC<ShopByOccasionProps> = ({
  selectedOccasion,
  onSelectOccasion,
  onViewAll,
}) => {
  return (
    <section id="occasions" className="py-16 bg-gradient-to-b from-white via-rose-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Bar */}
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-10 gap-4 text-center md:text-left">
          <div className="w-full text-center">
            <span className="inline-flex items-center gap-1.5 bg-rose-100 text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full border border-rose-200 mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#e15b70]" /> Celebrate Every Moment
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Shop by <span className="border-b-2 border-[#e15b70] pb-1">Occasion</span>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="md:absolute md:right-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#e15b70] hover:text-[#c94358] border border-rose-200 hover:border-[#e15b70] px-4 py-2 rounded-full transition-all cursor-pointer bg-rose-50/50 shadow-2xs"
          >
            <span>View All Occasions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Occasions Grid - 6 Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {OCCASIONS.map((item) => {
            const isSelected = selectedOccasion === item.id || selectedOccasion === item.name;
            return (
              <button
                key={item.id}
                onClick={() => onSelectOccasion(item.id)}
                className={`group relative flex flex-col items-center overflow-hidden rounded-2xl p-2.5 border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-[#e15b70] ring-2 ring-[#e15b70]/20 shadow-lg bg-rose-50'
                    : 'border-slate-200/80 bg-white hover:border-rose-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Pure Image Frame - No Emoji Overlays */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                </div>

                {/* Name & Short Tagline */}
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-[#e15b70] transition-colors text-center line-clamp-1">
                  {item.name}
                </span>
                {item.tagline && (
                  <span className="text-[9px] text-slate-500 text-center line-clamp-1 mt-0.5">
                    {item.tagline.split('&')[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
