import React from 'react';
import { ArrowRight } from 'lucide-react';
import { POPULAR_CATEGORIES } from '../data/mockData';

interface PopularCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onViewAllCategories: () => void;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({
  onSelectCategory,
  onViewAllCategories
}) => {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Popular Gift Categories
          </h2>

          <button
            onClick={onViewAllCategories}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e15b70] hover:text-[#c94358] border border-rose-200 hover:border-[#e15b70] px-4 py-2 rounded-full transition-all cursor-pointer bg-rose-50/50"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group flex flex-col items-center p-3 rounded-2xl bg-[#fbfbfb] border border-slate-100 hover:border-rose-200 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer text-center"
            >
              {/* Category Image Box */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 mb-3 shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#e15b70] transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
