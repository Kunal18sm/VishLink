import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, Sparkles, ArrowRight, Share2, Copy, Check, ExternalLink, Music, ArrowLeft, Heart } from 'lucide-react';
import { PurchasedOrder } from '../types';

interface ProfilePageProps {
  purchasedOrders: PurchasedOrder[];
  onBack: () => void;
  onExploreTemplates: () => void;
  onFindLink: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  purchasedOrders,
  onBack,
  onExploreTemplates,
  onFindLink,
}) => {
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [selectedOrderForPreview, setSelectedOrderForPreview] = useState<PurchasedOrder | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleWhatsAppShare = (order: PurchasedOrder) => {
    const text = `🎉 Hey ${order.receiverName}! I created a special 3D wishing website just for you! 💖\n\nClick here to view your surprise: ${order.wishingUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
            
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-[#0d1222] flex items-center justify-center text-white font-serif text-3xl font-bold">
                  KV
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-2 border-[#0d1222] rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">Kunal Vishu</h1>
                <span className="bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full border border-rose-500/30">
                  VIP Wishing Creator
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">kunal.81789vishu@gmail.com • +91 98765 43210</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-xs">Purchased Links</span>
                  <span className="font-bold text-white text-lg">{purchasedOrders.length} Active</span>
                </div>
                <div className="border-l border-slate-700 pl-8">
                  <span className="text-slate-400 block text-xs">Wish Rewards</span>
                  <span className="font-bold text-amber-400 text-lg">450 Points</span>
                </div>
                <div className="border-l border-slate-700 pl-8">
                  <span className="text-slate-400 block text-xs">Member Since</span>
                  <span className="font-bold text-white text-lg">2026</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                My Purchased Wishing Website Links
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, copy, or share your generated 3D wishing websites anytime.
              </p>
            </div>

            <button
              onClick={onFindLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e15b70] hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Looking for an older link? Search here ➔</span>
            </button>
          </div>

          {purchasedOrders.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#e15b70] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No purchased wishing links yet</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Pick your favorite 3D birthday cake or love story template, add recipient names & photos, and generate your instant WhatsApp link!
              </p>
              <button
                onClick={onExploreTemplates}
                className="inline-flex items-center gap-2 bg-[#e15b70] hover:bg-[#c94358] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                <span>Explore Wish Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchasedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-rose-200 transition-all"
                >
                  {/* Top Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Link ID: {order.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">Purchased on {order.purchaseDate}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {order.status}
                    </span>
                  </div>

                  {/* Main Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Thumbnail */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-rose-50 border border-slate-200 shrink-0">
                        <img
                          src={order.template.image}
                          alt={order.template.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{order.template.title}</h3>
                        <span className="text-xs text-[#e15b70] font-bold block mt-0.5">
                          ₹{order.totalPrice}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Theme: {order.themeColor}
                        </span>
                      </div>
                    </div>

                    {/* URL & Sender/Receiver Bar */}
                    <div className="md:col-span-5 space-y-2 bg-white p-3 rounded-xl border border-rose-100 text-xs">
                      
                      <div className="bg-rose-50/60 p-2 rounded-lg border border-rose-200 flex items-center justify-between gap-2 font-mono text-xs font-bold text-slate-800">
                        <span className="truncate">{order.wishingUrl}</span>
                        <button
                          onClick={() => handleCopyLink(order.wishingUrl, order.id)}
                          className="text-[#e15b70] hover:text-[#c94358] p-1 rounded-md hover:bg-rose-100 shrink-0 transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-700 pt-0.5">
                        <span><strong>From:</strong> {order.senderName}</span>
                        <span>➔</span>
                        <span><strong>To:</strong> {order.receiverName}</span>
                      </div>

                      {order.musicTrack && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-[#e15b70]" /> Song: {order.musicTrack}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <button
                        onClick={() => handleWhatsAppShare(order)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setSelectedOrderForPreview(order)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Wishing Page</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Live Preview Dialog Overlay */}
        {selectedOrderForPreview && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 relative border-2 border-rose-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
              <button
                onClick={() => setSelectedOrderForPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-1.5 bg-rose-100 text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Live Customized Wishing Webpage
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#fff7f8] via-[#fff1f3] to-[#ffebee] border border-rose-200 text-center space-y-4">
                
                <div className="bg-white/80 p-2 rounded-xl text-xs font-mono font-bold text-slate-700 border border-rose-200 truncate">
                  🔗 {selectedOrderForPreview.wishingUrl}
                </div>

                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-md border-2 border-white">
                  <img src={selectedOrderForPreview.template.image} alt="Template" className="w-full h-full object-cover" />
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-slate-900">Happy Birthday {selectedOrderForPreview.receiverName}! 🎉</h4>
                  <p className="text-xs text-slate-500 mt-1">With love from {selectedOrderForPreview.senderName}</p>
                </div>

                <div className="italic text-slate-700 text-xs bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
                  "{selectedOrderForPreview.specialMessage}"
                </div>

                {selectedOrderForPreview.uploadedImages.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 mb-1">Attached Memories:</p>
                    <div className="flex justify-center gap-2">
                      {selectedOrderForPreview.uploadedImages.map((img, i) => (
                        <img key={i} src={img} alt="Memory" className="w-12 h-12 rounded-lg object-cover border border-rose-300 shadow-2xs" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleWhatsAppShare(selectedOrderForPreview)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  onClick={() => setSelectedOrderForPreview(null)}
                  className="flex-1 bg-[#0d1222] hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
