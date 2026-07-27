import React, { useState } from 'react';
import { X, ShoppingBag, Heart, CheckCircle2, Image as ImageIcon, Sparkles, Download, ArrowRight, Link as LinkIcon, Share2, Copy, Check, ExternalLink, Music } from 'lucide-react';
import { PurchasedOrder } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedOrders: PurchasedOrder[];
  onOpenTrackOrder: (orderId: string) => void;
  onExploreTemplates: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  purchasedOrders,
  onOpenTrackOrder,
  onExploreTemplates,
}) => {
  if (!isOpen) return null;

  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [selectedOrderForPreview, setSelectedOrderForPreview] = useState<PurchasedOrder | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleWhatsAppShare = (order: PurchasedOrder) => {
    const text = `🎉 Hey ${order.receiverName}! I made a special personalized 3D wishing website just for you! 💖\n\nClick here to view your surprise: ${order.wishingUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Profile Banner & Header */}
        <div className="bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-[#0d1222] flex items-center justify-center text-white font-serif text-2xl font-bold">
                  KV
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-[#0d1222] rounded-full flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-serif text-2xl font-bold">Kunal Vishu</h2>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  VIP Wishing Creator
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1">kunal.81789vishu@gmail.com • +91 98765 43210</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Purchased Links</span>
                  <span className="font-bold text-white text-base">{purchasedOrders.length} Links</span>
                </div>
                <div className="border-l border-slate-700 pl-6">
                  <span className="text-slate-400 block text-[10px]">Wish Club Rewards</span>
                  <span className="font-bold text-amber-400 text-base">450 Points</span>
                </div>
                <div className="border-l border-slate-700 pl-6">
                  <span className="text-slate-400 block text-[10px]">Member Since</span>
                  <span className="font-bold text-white text-base">2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              My Purchased Wishing Website Links
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {purchasedOrders.length} active links
            </span>
          </div>

          {purchasedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-[#e15b70] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No purchased wishing links yet</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Pick your favorite 3D birthday cake or love story template, add names & photos, and generate your instant WhatsApp link!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreTemplates();
                }}
                className="inline-flex items-center gap-2 bg-[#e15b70] hover:bg-[#c94358] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer mt-2"
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
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Link ID: {order.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">Purchased on {order.purchaseDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4">
                    
                    {/* Thumbnail */}
                    <div className="md:col-span-3 flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-rose-50 border border-slate-200 shrink-0">
                        <img
                          src={order.template.image}
                          alt={order.template.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{order.template.title}</h4>
                        <span className="text-[11px] text-[#e15b70] font-semibold block mt-0.5">
                          ₹{order.totalPrice}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Theme: {order.themeColor}
                        </span>
                      </div>
                    </div>

                    {/* Link Bar & Customization Info */}
                    <div className="md:col-span-5 space-y-2 bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs">
                      
                      {/* Generated URL Bar */}
                      <div className="bg-white p-2 rounded-lg border border-rose-200 flex items-center justify-between gap-2 font-mono text-[11px] font-bold text-slate-800">
                        <span className="truncate">{order.wishingUrl}</span>
                        <button
                          onClick={() => handleCopyLink(order.wishingUrl, order.id)}
                          className="text-[#e15b70] hover:text-[#c94358] p-1 rounded-md hover:bg-rose-50 shrink-0 transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <span><strong>From:</strong> {order.senderName}</span>
                        <span>➔</span>
                        <span><strong>To:</strong> {order.receiverName}</span>
                      </div>

                      {order.musicTrack && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Music className="w-3 h-3 text-[#e15b70]" /> Song: {order.musicTrack}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                      <button
                        onClick={() => handleWhatsAppShare(order)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setSelectedOrderForPreview(order)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0d1222] hover:bg-[#e15b70] text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Wishing Website</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Digital Wishing Website Live Modal */}
        {selectedOrderForPreview && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 relative border-2 border-rose-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedOrderForPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-rose-100 text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Live Customized Wishing Webpage
              </div>

              {/* Fake Browser Screen */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#fff7f8] via-[#fff1f3] to-[#ffebee] border border-rose-200 text-center space-y-4">
                
                <div className="bg-white/80 p-2 rounded-xl text-[11px] font-mono font-bold text-slate-700 border border-rose-200 truncate">
                  🔗 {selectedOrderForPreview.wishingUrl}
                </div>

                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-md border-2 border-white">
                  <img src={selectedOrderForPreview.template.image} alt="Template" className="w-full h-full object-cover" />
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-slate-900">Happy Birthday {selectedOrderForPreview.receiverName}! 🎉</h4>
                  <p className="text-xs text-slate-500 mt-1">With love from {selectedOrderForPreview.senderName}</p>
                </div>

                <div className="italic text-slate-700 text-xs bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                  "{selectedOrderForPreview.specialMessage}"
                </div>

                {selectedOrderForPreview.uploadedImages.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 mb-1">Attached Memories:</p>
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  onClick={() => setSelectedOrderForPreview(null)}
                  className="flex-1 bg-[#0d1222] hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
