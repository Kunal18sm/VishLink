import React from 'react';
import { ArrowRight, Play, Sparkles, Link as LinkIcon, Share2, Music, Cake, Heart } from 'lucide-react';

interface HeroProps {
  onExploreTemplates: () => void;
  onHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreTemplates, onHowItWorks }) => {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-[#fff7f8] via-[#fff1f3] to-[#ffebee] py-12 lg:py-16 overflow-hidden">
      {/* Soft Background Decorative Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#fcd5ce]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 bg-white text-[#e15b70] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs border border-rose-100">
            <Heart className="w-3.5 h-3.5 fill-[#e15b70]" />
            <span>Personalized Wishing Website Links</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
            Surprise Them With <br className="hidden sm:inline" />
            <span className="text-[#e15b70]">Personalized Wishing</span> <br className="hidden sm:inline" />
            Websites & Links
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            Create interactive cake cutting, song melodies, photo galleries, and secret love notes on a custom web link. Instant share on WhatsApp in seconds!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreTemplates}
              className="inline-flex items-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm"
            >
              <span>Browse Wish Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onHowItWorks}
              className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer text-sm"
            >
              <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-700">
                <Play className="w-3 h-3 fill-slate-700 ml-0.5" />
              </div>
              <span>How It Works</span>
            </button>
          </div>

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-rose-100/80 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-[#e15b70] flex items-center justify-center shrink-0">
                <Cake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">3D Cake & Candle Blow</p>
                <p className="text-[11px] text-slate-500">Interactive Cutting FX</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-[#e15b70] flex items-center justify-center shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Photos & Music Track</p>
                <p className="text-[11px] text-slate-500">Custom Song & Memories</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-[#e15b70] flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Instant Link Delivery</p>
                <p className="text-[11px] text-slate-500">1-Click WhatsApp Share</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
