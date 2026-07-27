import React from 'react';
import { ArrowLeft, Sparkles, Heart, Globe, ShieldCheck, Zap, Users, Gift } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onExploreTemplates: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onExploreTemplates }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden text-center sm:text-left">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3.5 py-1 rounded-full border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              About VishLink
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Reinventing How People Express Love & Birthday Wishes
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              VishLink is India's leading platform for creating interactive, 3D animated wishing website links. Instead of sending plain WhatsApp text messages, surprise your loved ones with interactive 3D cake cutting, custom songs, photo galleries, and secret love notes on their very own custom webpage!
            </p>
          </div>
        </div>

        {/* Value Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant 30-Sec Creation</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              No technical skills required. Just enter names, pick a song, upload photos, and your live shareable link is generated instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Lifetime Link Validity</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Every wishing website link you create stays active forever. Revisit your memories and birthday cakes whenever you want!
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Loved by 50,000+ Users</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              From birthdays and anniversaries to long-distance love stories, VishLink brings smiles to thousands of faces every day.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            In a digital world dominated by temporary status updates and quick chat messages, we wanted to build something meaningful. VishLink gives everyone the power to create a dedicated digital sanctuary for their relationships — complete with interactive elements, personal soundtracks, and curated photo memories that last a lifetime.
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#e15b70] fill-[#e15b70]" />
              <span className="text-xs font-bold text-slate-800">Crafted with love for your special moments.</span>
            </div>
            <button
              onClick={onExploreTemplates}
              className="bg-[#0d1222] hover:bg-[#e15b70] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Explore Templates
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
