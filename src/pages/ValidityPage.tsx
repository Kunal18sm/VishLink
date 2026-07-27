import React from 'react';
import { ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, Clock, Globe, Heart, Lock, ArrowRight } from 'lucide-react';

interface ValidityPageProps {
  onBack: () => void;
  onExploreTemplates: () => void;
}

export const ValidityPage: React.FC<ValidityPageProps> = ({ onBack, onExploreTemplates }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-8 sm:p-12 rounded-3xl shadow-lg text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3.5 py-1 rounded-full border border-rose-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Lifetime Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Your Wishing Links Stay Active Forever
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Unlike temporary status stories or expiring links, every interactive birthday cake and romantic wishing webpage created on VishLink is hosted permanently on cloud infrastructure.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No Expiration Date</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Open your link next year or 10 years from now — your photos, song track, and custom note will be exactly as you left them.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">High-Speed Global CDN</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Hosted on ultra-fast edge servers so your recipient experiences smooth candle animations on any mobile device anywhere in the world.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Secure Storage</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your memory photos and love notes are protected with encrypted cloud storage and are only accessible via your unique wishing link URL.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Ready to create a memory that lasts forever?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Choose a birthday cake or love story template and send an unforgettable surprise on WhatsApp in 30 seconds!
          </p>
          <button
            onClick={onExploreTemplates}
            className="inline-flex items-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Create Wishing Webpage Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
