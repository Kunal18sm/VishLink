import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, Share2, Sparkles, Send, Search, CheckCircle2 } from 'lucide-react';

interface FaqsPageProps {
  onBack: () => void;
  onExploreTemplates: () => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({ onBack, onExploreTemplates }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  const faqs = [
    {
      q: "How to make a birthday website for free in 30 seconds?",
      a: "Making a birthday website on VishLink is super easy and requires zero coding! Step 1: Pick a 3D Birthday Cake or Memory Gallery template. Step 2: Fill in the Birthday Person's Name, your name, special wish message, photo memories, and background song. Step 3: Click 'Generate Link'. Your custom birthday wishing webpage URL is generated instantly to send on WhatsApp!"
    },
    {
      q: "How to create a birthday wishing webpage link with photo gallery and song?",
      a: "On VishLink, click on any Birthday template to open the customization form. Upload your favourite photos (up to 5 photos) and choose a background song (e.g. Happy Birthday LoFi, Acoustic Piano, Party Beats). VishLink automatically combines your photos, song, and 3D candle pop animations into a single shareable web link!"
    },
    {
      q: "How to make an interactive birthday surprise website for partner or best friend?",
      a: "Select a specialized 'Couple Anniversary / Love Story' or 'BFF Meme Roast' birthday template. Enter secret love notes, funny quotes, and special memories. When your partner or friend opens the link, an interactive candle pop, music melody, and secret note card reveals your birthday surprise!"
    },
    {
      q: "How to send a 3D birthday cake wishing link on WhatsApp?",
      a: "Creating and sending a 3D birthday cake wishing link on WhatsApp takes under 30 seconds on VishLink! Simply select a Birthday Cake template, enter your recipient's name, add special wishes, upload photo memories, and select a background song. Click 'Generate Link' and tap 'Share on WhatsApp'. A pre-formatted invitation link will open in WhatsApp ready to send!"
    },
    {
      q: "Can I add custom photo memories and background music to the wishing webpage?",
      a: "Yes! VishLink allows you to upload custom photo gallery memories (JPG, PNG, WebP) and select background music tracks (e.g. Happy Birthday LoFi, Romantic Guitar, Party Beats, Acoustic Piano). When your recipient opens the web link, the song plays while showing interactive photo galleries and 3D candle pop animations!"
    },
    {
      q: "How to make a romantic couple love story website for Valentine's Day or Anniversary?",
      a: "Select our 'Couple Love Story' or 'Valentine's Day Special' template from the VishLink store. Enter partner names, relationship milestones, secret love notes, and romantic photos. VishLink generates a custom URL webpage with heartbeat animations, interactive digital gift box opening, and love songs!"
    },
    {
      q: "Is VishLink free to create digital wishing links?",
      a: "Yes! VishLink offers 100% Free wishing templates valid for 3 months. You can generate free interactive birthday cake links without any payment. We also offer Lifetime Permanent Access plans for unlimited future playback."
    },
    {
      q: "How long will my wishing website link stay active (Lifetime Validity)?",
      a: "Every permanent wishing website link created on VishLink comes with 100% Lifetime Link Validity. The recipient can open, re-play, and view their personalized birthday cake or romantic anniversary webpage anytime in the future without link expiration."
    },
    {
      q: "Where do I find or access my purchased wishing links?",
      a: "All your generated and purchased wishing links are automatically saved under your VishLink User Profile. Simply tap 'Profile' in the navigation bar or top bar to view your complete link history, copy URLs, and share on WhatsApp anytime."
    },
    {
      q: "Can I edit the recipient name, photos, or message after creating the link?",
      a: "Yes! You can view all created links in your user profile. If you need any updates to names, photos, or wish messages, you can request an instant edit through our AI Support Bot or customer helpdesk."
    },
    {
      q: "Will background music play automatically when the recipient opens the link?",
      a: "Yes! On modern iOS and Android mobile browsers, background audio plays automatically on the recipient's first touch on screen or when they tap the 3D candle to blow it out."
    },
    {
      q: "Can I create funny birthday roast or meme websites for my best friend?",
      a: "Absolutely! We offer specialized 'BFF Meme & Roast' templates designed specifically for best friends. Add funny pictures, inside jokes, and hilarious roast messages for an unforgettable birthday surprise."
    },
    {
      q: "Is payment safe on VishLink and how fast is digital link delivery?",
      a: "100% Safe & Instant! We accept direct UPI payments via GPay, PhonePe, Paytm, and Net Banking. Your wishing link is generated instantly in real-time as soon as you submit your details."
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearchQuery.trim() ||
      f.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  // Generate JSON-LD Structured Data for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      {/* Inject FAQPage Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 transition border border-slate-200 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="inline-flex items-center gap-1.5 bg-rose-100 text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full border border-rose-200 mb-1">
                <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions & Help
              </span>
              <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                VishLink Support & Search Guide
              </h1>
            </div>
          </div>

          {/* Search FAQ bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e15b70]"
            />
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              No matching questions found for "{faqSearchQuery}". Try exploring all templates or ask our AI Support Bot!
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-rose-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base hover:text-[#e15b70] transition-colors cursor-pointer"
                  >
                    <span className="flex items-start gap-2.5">
                      <span className="text-[#e15b70] shrink-0 font-extrabold">Q.</span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#e15b70]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 mt-1 pl-9">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-[#0d1222] to-[#1a233d] text-white p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h3 className="font-sans text-xl sm:text-2xl font-bold">Ready to Create Your Wish Link?</h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Choose from our collection of interactive 3D birthday cakes & love story wishing templates.
              </p>
            </div>
            <button
              onClick={onExploreTemplates}
              className="inline-flex items-center gap-2 bg-[#e15b70] hover:bg-[#c94358] text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shrink-0 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Wish Templates</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block text-xs">Step 1</span>
              <p className="font-semibold text-white text-xs sm:text-sm">Fill Form & Add Photos</p>
              <p className="text-slate-300 text-[11px]">Enter names, wish message, song & images.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block text-xs">Step 2</span>
              <p className="font-semibold text-white text-xs sm:text-sm">Tap Share on WhatsApp</p>
              <p className="text-slate-300 text-[11px]">Opens WhatsApp with pre-filled invitation URL.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block text-xs">Step 3</span>
              <p className="font-semibold text-white text-xs sm:text-sm">Surprise The Recipient</p>
              <p className="text-slate-300 text-[11px]">Recipient opens and enjoys candle pop & song!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
