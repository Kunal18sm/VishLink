import React from 'react';
import { Instagram, ExternalLink, Sparkles } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/vish_link18/';

export const InstagramBanner: React.FC = () => {
  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Gradient border wrapper */}
        <div className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-[2px] rounded-3xl shadow-lg">
          <div className="bg-white rounded-[22px] px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-center gap-5">
            
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white shrink-0 shadow-md">
              <Instagram className="w-8 h-8" />
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Custom Wishing Websites</span>
              </div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight">
                Want Something Truly Personal?
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed max-w-lg">
                Get a fully customized wishing website — your design, your style. DM us on Instagram for custom templates, special designs &amp; exclusive requests.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  <Instagram className="w-3 h-3" /> @vish_link18
                </span>
                <span className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">✨ Custom Design Studio</span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span>DM on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};
