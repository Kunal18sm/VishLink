import React, { useState } from 'react';
import { Search, Globe, CheckCircle2, ArrowRight, ArrowLeft, ExternalLink, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { PurchasedOrder } from '../types';

interface FindLinkPageProps {
  purchasedOrders: PurchasedOrder[];
  onBack: () => void;
  onExploreTemplates: () => void;
}

export const FindLinkPage: React.FC<FindLinkPageProps> = ({
  purchasedOrders,
  onBack,
  onExploreTemplates,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedResult, setSearchedResult] = useState<PurchasedOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchedResult(null);
      return;
    }

    const match = purchasedOrders.find(
      o => o.id.toLowerCase().includes(q) ||
           o.receiverName.toLowerCase().includes(q) ||
           o.senderName.toLowerCase().includes(q) ||
           (o.wishingSlug && o.wishingSlug.toLowerCase().includes(q))
    );

    setSearchedResult(match || null);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (order: PurchasedOrder) => {
    const text = `🎉 Hey ${order.receiverName}! I created a special wishing website just for you! 💖\n\nClick here to view your surprise: ${order.wishingUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[85vh]">
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
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-[#e15b70] text-xs font-bold px-3.5 py-1.5 rounded-full border border-rose-100">
            <Globe className="w-3.5 h-3.5" />
            Find & Retrieve Purchased Links
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Search Your Wishing Webpage Link
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Enter your Link Order ID (e.g., VL-892410) or recipient name below to access your custom web link.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Link ID (e.g. VL-892410) or Name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Link</span>
            </button>
          </form>

          {/* Quick Demo Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="font-semibold">Try Demo Link IDs:</span>
            {purchasedOrders.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.id);
                  setSearchedResult(o);
                  setHasSearched(true);
                }}
                className="bg-rose-50 text-[#e15b70] font-mono font-bold px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                {o.id} ({o.receiverName})
              </button>
            ))}
          </div>
        </div>

        {/* Result Area */}
        {hasSearched && (
          <div>
            {searchedResult ? (
              <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-2">
                
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Link Found & Active</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Order ID: {searchedResult.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Image */}
                  <div className="md:col-span-4 aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-rose-50 shadow-2xs">
                    <img
                      src={searchedResult.template.image}
                      alt={searchedResult.template.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-slate-900">
                        {searchedResult.template.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Personalized webpage generated for <strong>{searchedResult.receiverName}</strong> by <strong>{searchedResult.senderName}</strong>.
                      </p>
                    </div>

                    <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200 flex items-center justify-between gap-3 text-xs font-mono font-bold text-slate-800">
                      <span className="truncate">{searchedResult.wishingUrl}</span>
                      <button
                        onClick={() => handleCopyLink(searchedResult.wishingUrl, searchedResult.id)}
                        className="bg-white hover:bg-rose-100 text-[#e15b70] p-2 rounded-xl border border-rose-200 transition-colors cursor-pointer shrink-0"
                        title="Copy Link"
                      >
                        {copiedId === searchedResult.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleWhatsAppShare(searchedResult)}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share on WhatsApp</span>
                      </button>

                      <a
                        href={searchedResult.wishingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Webpage</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e15b70] flex items-center justify-center mx-auto text-xl">
                  🔍
                </div>
                <h3 className="font-bold text-slate-900 text-lg">No wishing link found for "{searchQuery}"</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Please verify your Order ID or phone number. If you haven't created a wishing link yet, you can create one in under 30 seconds!
                </p>
                <button
                  onClick={onExploreTemplates}
                  className="inline-flex items-center gap-2 bg-[#e15b70] hover:bg-[#c94358] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                >
                  <span>Explore Wish Templates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
