import React from 'react';
import { ArrowRight } from 'lucide-react';
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
    <section id="occasions" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Bar */}
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-10 gap-4 text-center md:text-left">
          <div className="w-full text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Shop by <span className="border-b-2 border-[#e15b70] pb-1">Occasion</span>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="md:absolute md:right-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#e15b70] hover:text-[#c94358] border border-rose-200 hover:border-[#e15b70] px-4 py-2 rounded-full transition-all cursor-pointer bg-rose-50/50"
          >
            <span>View All Occasions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Occasions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {OCCASIONS.map((item) => {
            const isSelected = selectedOccasion === item.name;
            return (
              <button
                key={item.id}
                onClick={() => onSelectOccasion(item.name)}
                className={`group flex flex-col items-center p-3 rounded-2xl bg-[#fff8f7] border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-[#e15b70] ring-2 ring-[#e15b70]/20 shadow-md bg-rose-50'
                    : 'border-slate-100 hover:border-rose-200 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Image / Icon Frame */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white p-2 mb-3 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img
                    src={item.iconUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Name */}
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#e15b70] transition-colors text-center">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
