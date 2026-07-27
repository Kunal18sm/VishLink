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
      q: "How does a VishLink wishing website work?",
      a: "When you select a template and enter recipient details (names, photos, song, love notes), VishLink generates a custom web link. When the receiver opens the link on WhatsApp or mobile browser, an interactive birthday cake appears with interactive candle cutting, music playback, confetti pop, and photo memory gallery!"
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
      a: "Yes! Most modern mobile browsers support audio playback on first user touch. When the recipient taps on the candle or screen, the chosen song melody plays smoothly."
    },
    {
      q: "Can I create links for anniversaries, Valentine's, or friends?",
      a: "Absolutely! We offer specialized templates for Birthdays, Love & Anniversaries, Proposals, Funny Roasts, Festivals (Diwali, New Year), and Apologies."
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition border border-slate-200 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="inline-flex items-center gap-1.5 bg-rose-100 text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full border border-rose-200 mb-1">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Got Questions? We Have Answers
            </h1>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base hover:text-[#e15b70] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#e15b70]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 mt-1">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-[#0d1222] to-[#1a233d] text-white p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">Ready to Create Your Wish Link?</h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Choose from our collection of interactive wishing templates.
              </p>
            </div>
            <button
              onClick={onExploreTemplates}
              className="inline-flex items-center gap-2 bg-[#e15b70] hover:bg-[#c94358] text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shrink-0 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore All Templates</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 1</span>
              <p className="font-semibold text-white">Fill Form & Add Photos</p>
              <p className="text-slate-300 text-[11px]">Enter names, message, song & images.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 2</span>
              <p className="font-semibold text-white">Tap Share on WhatsApp</p>
              <p className="text-slate-300 text-[11px]">Opens WhatsApp with a pre-filled invitation.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 3</span>
              <p className="font-semibold text-white">Surprise The Recipient</p>
              <p className="text-slate-300 text-[11px]">They tap and enjoy the candle & song!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
