import React from 'react';
import { ArrowLeft, Globe, Clock, Lock, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

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
            <Globe className="w-4 h-4 text-emerald-400" />
            Cloud Hosting & Link Validity
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            How Wishing Link Validity Works
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every interactive birthday cake, romantic celebration, and custom greeting created on VishLink is deployed to fast cloud servers so your recipient can open and enjoy it anytime.
          </p>
        </div>

        {/* Plan Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Temporary Plan</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">3 Months Active Hosting</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Ideal for one-time birthday greetings and seasonal celebrations. Your unique link stays online and accessible for 3 months from creation.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full interactive cake cutting & sound effects</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Shareable WhatsApp preview URL</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Photo gallery & custom music track</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-rose-200 shadow-2xs space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#e15b70] text-xs font-bold">
              <Globe className="w-4 h-4" />
              <span>Permanent Plan</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Long-Term Cloud Hosting</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Designed for anniversaries, proposals, and heartfelt memories. We maintain your webpage on our cloud servers for long-term access.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Long-term cloud storage for photos & music</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Permanent unique wishing URL</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Always accessible in your user profile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Realistic Support & Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fast Cloud Delivery</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Pages are served via modern cloud infrastructure for quick loading on mobile networks across India.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Private & Protected</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your photos, quotes, and songs are accessed only through your unique link URL and not indexed publicly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct Support</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Need changes to your link, names, or wish message? Email us at wishlink1806@gmail.com anytime.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Ready to create a special celebration webpage?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Choose a birthday cake or love story template and send an interactive surprise on WhatsApp in minutes.
          </p>
          <button
            onClick={onExploreTemplates}
            className="inline-flex items-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Explore Wishing Templates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
