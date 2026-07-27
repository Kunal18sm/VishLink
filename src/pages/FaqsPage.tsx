import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, Share2, Sparkles, Send } from 'lucide-react';

interface FaqsPageProps {
  onBack: () => void;
  onExploreTemplates: () => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({ onBack, onExploreTemplates }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does a VishLink 3D wishing website work?",
      a: "When you select a template and enter recipient details (names, photos, song, love notes), VishLink generates a custom web link. When the receiver opens the link on WhatsApp or mobile browser, an interactive 3D birthday cake appears with interactive candle cutting, music playback, confetti pop, and photo memory gallery!"
    },
    {
      q: "How do I share the created link on WhatsApp?",
      a: "Once your link is created, you will see a 'Share on WhatsApp' button. Clicking it automatically formats a beautiful WhatsApp message containing your recipient's name and direct webpage link!"
    },
    {
      q: "How long will my wishing website link stay active?",
      a: "Forever! Every wishing website link created on VishLink comes with 100% Lifetime Link Validity. The recipient can open and re-play their birthday cake or romantic memory link anytime in the future."
    },
    {
      q: "Can I edit the photos or message after purchasing?",
      a: "Yes! You can view all your created links inside your 'My Links' profile page. If you need to update any name or photo, simply open your profile or contact our support team."
    },
    {
      q: "Will the music play automatically when opened?",
      a: "Yes! Most modern mobile browsers support audio playback on first user touch. When the recipient taps on the 3D candle or screen, the chosen song melody plays smoothly."
    },
    {
      q: "Can I create links for anniversaries, Valentine's, or friends?",
      a: "Absolutely! We offer specialized templates for Birthdays, Love & Anniversaries, Proposals, Funny Roasts, Festivals (Diwali, New Year), and Apologies."
    }
  ];

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

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[#e15b70] text-xs font-bold uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            FAQs & WhatsApp Sharing Guide
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Everything you need to know about creating, customizing, and sharing 3D wishing links on WhatsApp.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-100 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-rose-50/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#e15b70] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 bg-slate-50/50 p-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Step Guide Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <Share2 className="w-4 h-4" />
            <span>How To Send On WhatsApp Guide</span>
          </div>

          <h3 className="font-serif text-2xl font-bold">1-Click WhatsApp Delivery</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 1</span>
              <p className="font-semibold text-white">Generate Your Link</p>
              <p className="text-slate-300 text-[11px]">Personalize names, songs, and photos.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 2</span>
              <p className="font-semibold text-white">Tap Share on WhatsApp</p>
              <p className="text-slate-300 text-[11px]">Opens WhatsApp with a pre-filled invitation.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 3</span>
              <p className="font-semibold text-white">Surprise The Recipient</p>
              <p className="text-slate-300 text-[11px]">They tap and enjoy the 3D candle & song!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
