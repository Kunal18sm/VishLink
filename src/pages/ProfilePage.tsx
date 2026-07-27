import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  LogOut,
  User as UserIcon,
  ExternalLink,
  Search,
  Clock,
  Crown,
  Heart,
} from 'lucide-react';
import { PurchasedOrder } from '../types';

interface ProfilePageProps {
  purchasedOrders: PurchasedOrder[];
  onBack: () => void;
  onExploreTemplates: () => void;
  onFindLink: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  purchasedOrders: initialOrders,
  onBack,
  onExploreTemplates,
  onFindLink,
  onLogout,
  onOpenAdmin,
}) => {
  const [orders, setOrders] = useState<PurchasedOrder[]>(initialOrders);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [historySearch, setHistorySearch] = useState('');

  // Fetch real user & orders on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      // Get Me
      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      if (meRes.ok && meData.success) {
        setUserInfo(meData.user);
      }

      // Get My Orders
      const orderRes = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderData = await orderRes.json();
      if (orderRes.ok && orderData.success && orderData.orders) {
        setOrders(orderData.orders);
      }
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('vishlink_token');
    if (onLogout) onLogout();
    onBack();
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleWhatsAppShare = (order: PurchasedOrder) => {
    const text = `🎉 Hey ${order.receiverName}! I created a special wishing website just for you! 💖\n\nClick here to view your surprise: ${order.wishingUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      o.id?.toLowerCase().includes(q) ||
      o.receiverName?.toLowerCase().includes(q) ||
      o.senderName?.toLowerCase().includes(q) ||
      o.specialMessage?.toLowerCase().includes(q) ||
      o.wishingUrl?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-8 bg-slate-50 min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Back & Logout Action Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold px-4 py-2 rounded-xl border border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e1b2e] text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Frame */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-rose-500/40 bg-slate-800 shadow-xl shrink-0">
              <img
                src={
                  userInfo?.avatarUrl ||
                  `https://api.dicebear.com/7.x/notionists/svg?seed=${userInfo?.username || 'user'}`
                }
                alt="User Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Meta */}
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                  {userInfo?.username || 'Kunal Vishu'}
                </h1>
                <span className="bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full border border-rose-500/30">
                  VIP Wishing Creator
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">
                {userInfo?.email || 'kunal.81789vishu@gmail.com'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 pt-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-xs">Purchased Links</span>
                  <span className="font-bold text-white text-lg">{orders.length} Active</span>
                </div>
                <div className="border-l border-slate-700 pl-8">
                  <span className="text-slate-400 block text-xs">Account Status</span>
                  <span className="font-bold text-emerald-400 text-lg">
                    {userInfo?.role === 'admin' || userInfo?.isAdmin ? 'Admin Master' : 'Verified User'}
                  </span>
                </div>
              </div>

              {(userInfo?.role === 'admin' || userInfo?.isAdmin || ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'].includes(userInfo?.email)) && (
                <div className="pt-3">
                  <button
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer transition"
                  >
                    👑 Open Admin Control Panel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section: Purchased Links History */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Purchased Wish Links History
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete history of your generated wishing websites and permanent links.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search History */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search history..."
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-hidden focus:border-[#e15b70]"
                />
              </div>

              <button
                onClick={onFindLink}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#e15b70] hover:underline cursor-pointer"
              >
                <span>Find Link ➔</span>
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#e15b70] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No purchased wishing links found</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Pick your favorite birthday cake or love story template, add recipient names & photos, and generate your instant WhatsApp link!
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
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-rose-200 transition-all"
                >
                  {/* Top Bar: Order ID, Date, Plan Badge, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">ID: {order.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{order.purchaseDate}</span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.isTemporary === false
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {order.isTemporary === false ? '💎 Permanent (Lifetime)' : '⏳ Temporary (3 Months)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs">
                        {order.totalPrice === 0 ? 'FREE' : `₹${order.totalPrice}`}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center gap-3">
                      <img
                        src={order.uploadedImages?.[0] || order.template?.image || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300'}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {order.template?.title || order.templateName || 'Personalized Wishing Webpage'}
                        </h4>
                        <p className="text-xs text-[#e15b70] font-semibold mt-0.5">
                          For: {order.receiverName}
                        </p>
                        <p className="text-[11px] text-slate-500">From: {order.senderName}</p>
                      </div>
                    </div>

                    {/* Wish URL Box */}
                    <div className="md:col-span-5 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Live Wish Link URL
                        </span>
                        <a
                          href={order.wishingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <span>Open Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs font-mono font-bold text-[#e15b70] truncate">
                        {order.wishingUrl}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                        "{order.specialMessage}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-3 flex flex-wrap md:flex-col gap-2">
                      <button
                        onClick={() => handleCopyLink(order.wishingUrl, order.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer"
                      >
                        {copiedOrderId === order.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Link
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleWhatsAppShare(order)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" /> WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Images Gallery Strip if present */}
                  {order.uploadedImages && order.uploadedImages.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Uploaded Photos:</span>
                      <div className="flex gap-2 overflow-x-auto">
                        {order.uploadedImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
