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
  AlertCircle,
  Edit3,
  Save,
  X,
  MessageSquare,
  Star,
  Send,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { PurchasedOrder } from '../types';
import { InstagramBanner } from '../components/InstagramBanner';

interface ProfilePageProps {
  purchasedOrders: PurchasedOrder[];
  onBack: () => void;
  onExploreTemplates: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
}

// Helper to ensure order list has zero duplicates by ID, Mongo _id, URL or Slug
const dedupeOrders = (list: PurchasedOrder[]): PurchasedOrder[] => {
  if (!Array.isArray(list)) return [];
  const seenKeys = new Set<string>();
  const result: PurchasedOrder[] = [];

  for (const item of list) {
    if (!item) continue;
    const idKey = String(item.id || '').trim();
    const mongoIdKey = String((item as any)._id || '').trim();
    const urlKey = String(item.wishingUrl || '').trim();
    const slugKey = String(item.wishingSlug || '').trim();

    let isDuplicate = false;
    if (idKey && seenKeys.has(`id:${idKey}`)) isDuplicate = true;
    if (mongoIdKey && seenKeys.has(`id:${mongoIdKey}`)) isDuplicate = true;
    if (urlKey && urlKey !== '' && seenKeys.has(`url:${urlKey}`)) isDuplicate = true;
    if (slugKey && slugKey !== '' && seenKeys.has(`slug:${slugKey}`)) isDuplicate = true;

    if (!isDuplicate) {
      if (idKey) seenKeys.add(`id:${idKey}`);
      if (mongoIdKey) seenKeys.add(`id:${mongoIdKey}`);
      if (urlKey && urlKey !== '') seenKeys.add(`url:${urlKey}`);
      if (slugKey && slugKey !== '') seenKeys.add(`slug:${slugKey}`);
      result.push(item);
    }
  }

  return result;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  purchasedOrders: initialOrders,
  onBack,
  onExploreTemplates,
  onLogout,
  onOpenAdmin,
}) => {
  const [activeOrders, setActiveOrders] = useState<PurchasedOrder[]>(() => dedupeOrders(initialOrders));
  const [historyOrders, setHistoryOrders] = useState<PurchasedOrder[]>(() => dedupeOrders(initialOrders));
  const [profileTab, setProfileTab] = useState<'active' | 'history'>('active');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Edit Wish Link State
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [viewingDetailsOrder, setViewingDetailsOrder] = useState<any | null>(null);
  const [editReceiverName, setEditReceiverName] = useState('');
  const [editSenderName, setEditSenderName] = useState('');
  const [editSpecialMessage, setEditSpecialMessage] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fbRating, setFbRating] = useState(5);
  const [fbSuggestion, setFbSuggestion] = useState('');
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbSuggestion.trim()) return;

    setFbSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userInfo?.username || 'User',
          email: userInfo?.email || '',
          rating: fbRating,
          suggestion: fbSuggestion.trim(),
          feedbackmsg: fbSuggestion.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFbSuccess(true);
        setFbSuggestion('');
        setTimeout(() => {
          setFbSuccess(false);
          setShowFeedbackModal(false);
        }, 2200);
      } else {
        alert(data.message || 'Failed to submit feedback');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting feedback');
    } finally {
      setFbSubmitting(false);
    }
  };

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
      if (orderRes.ok && orderData.success) {
        const rawActive = orderData.activeLinks || orderData.orders || [];
        const rawHistory = orderData.historyLinks || orderData.orders || [];
        setActiveOrders(dedupeOrders(rawActive));
        setHistoryOrders(dedupeOrders(rawHistory));
      }
    } catch (err) {
      console.log('Profile data fetch error:', err);
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

  const handleOpenEditModal = (order: any) => {
    setEditingOrder(order);
    setEditReceiverName(order.receiverName || order.receiver || '');
    setEditSenderName(order.senderName || order.sender || '');
    setEditSpecialMessage(order.specialMessage || order.specialMsg || '');
  };

  const handleSaveEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setEditLoading(true);
    const token = localStorage.getItem('vishlink_token');

    try {
      const orderId = editingOrder.id || editingOrder.wishingSlug || editingOrder._id;
      const res = await fetch(`/api/orders/${orderId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverName: editReceiverName.trim(),
          senderName: editSenderName.trim(),
          specialMessage: editSpecialMessage.trim(),
        }),
      });


      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMsg('🎉 Wish Link details updated successfully in Database!');
        setEditingOrder(null);
        fetchProfileData();
        setTimeout(() => setProfileMsg(''), 4000);
      } else {
        alert(data.message || 'Failed to update wish link details');
      }
    } catch (err: any) {
      alert(err.message || 'Network error updating wish link');
    } finally {
      setEditLoading(false);
    }
  };

  return (

    <div className="py-8 bg-slate-50 min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Back, Feedback & Logout Action Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-[#e15b70] hover:from-rose-600 hover:to-[#c94358] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Give Feedback</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Simplified Profile Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e1b2e] text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Frame */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-rose-500/30 bg-slate-800 shadow-xl shrink-0">
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
            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {userInfo?.username || userInfo?.name || 'VishLink User'}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  {userInfo?.email || 'Logged in via VishLink'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 inline-flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-medium">Purchased Links:</span>
                  <span className="font-bold text-white text-sm">{activeOrders.length} Active</span>
                </div>

                {onOpenAdmin && (userInfo?.isAdmin || userInfo?.role === 'admin') && (
                  <button
                    onClick={onOpenAdmin}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Master Panel</span>
                  </button>
                )}

                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold px-4 py-2 rounded-xl border border-rose-500/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Give Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: Purchased Links History */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                My Wish Links
              </h2>
            </div>

            {/* 2-Tab Switcher: Active Links & Order History */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setProfileTab('active')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  profileTab === 'active'
                    ? 'bg-white text-[#e15b70] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Wish Links ({activeOrders.length})
              </button>

              <button
                onClick={() => setProfileTab('history')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  profileTab === 'history'
                    ? 'bg-white text-[#e15b70] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Orders History ({historyOrders.length})
              </button>
            </div>
          </div>

          {(() => {
            const rawOrders = profileTab === 'active' ? activeOrders : historyOrders;
            const filteredOrders = dedupeOrders(rawOrders).sort((a: any, b: any) => {
              const tA = Number(a.rawDate || new Date(a.purchaseDate || 0).getTime() || 0);
              const tB = Number(b.rawDate || new Date(b.purchaseDate || 0).getTime() || 0);
              return tB - tA;
            });
            return filteredOrders.length === 0 ? (
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
            <div className="space-y-3">
              {filteredOrders.map((order, idx) => (
                <div
                  key={`${profileTab}-${order.id || order.wishingUrl || idx}-${idx}`}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-rose-200 transition-all space-y-3"
                >
                  {/* Top Row: Title + Date / Price */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                      {(order as any).templateName || (order as any).webName || order.template?.title || 'Wishing Website'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                      <span className="text-slate-800 font-bold">
                        {order.totalPrice === 0 ? 'FREE' : `₹${order.totalPrice}`}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 font-medium">
                        {order.purchaseDate}
                      </span>
                    </div>
                  </div>

                  {/* Compact Link Row with small Copy & Open icons right beside it */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
                    <a
                      href={order.wishingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-medium text-slate-700 hover:text-[#e15b70] hover:underline truncate flex-1 block"
                      title="Click to open website"
                    >
                      {order.wishingUrl}
                    </a>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(order.wishingUrl, order.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition cursor-pointer"
                        title="Copy Link"
                      >
                        {copiedOrderId === order.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <a
                        href={order.wishingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg text-[#e15b70] hover:bg-rose-50 transition"
                        title="Open Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(order)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-xl shadow-2xs transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewingDetailsOrder(order)}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-xl transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Full Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
        </div>

        {/* Toast Alert Message */}
        {profileMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {profileMsg}
            </span>
            <button onClick={() => setProfileMsg('')} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Instagram Social Banner */}
        <div className="mt-8">
          <InstagramBanner />
        </div>
      </div>

      {/* Edit Wish Link Modal Popup */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#e15b70] uppercase tracking-wider">
                  Update Wish Link Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Edit {(editingOrder as any).templateName || (editingOrder as any).webName || 'Wish Link'}
                </h3>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Recipient&apos;s Name (To) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editReceiverName}
                    onChange={(e) => setEditReceiverName(e.target.value)}
                    placeholder="Recipient's Name"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-[#e15b70] focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Your Name (From) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editSenderName}
                    onChange={(e) => setEditSenderName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-[#e15b70] focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Personalized Wish Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editSpecialMessage}
                  onChange={(e) => setEditSpecialMessage(e.target.value)}
                  placeholder="Wish message..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold focus:border-[#e15b70] focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">


                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#e15b70] to-[#c94358] hover:opacity-95 shadow-md transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{editLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Details Modal Popup */}
      {viewingDetailsOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#e15b70] uppercase tracking-wider">
                  Wishing Website Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {(viewingDetailsOrder as any).templateName || (viewingDetailsOrder as any).webName || 'Wishing Website'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingDetailsOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Link URL Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Wish Link URL
              </span>
              <a
                href={viewingDetailsOrder.wishingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-[#e15b70] hover:underline break-all bg-white p-2.5 rounded-xl border border-slate-200 block transition"
                title="Click to open website"
              >
                {viewingDetailsOrder.wishingUrl}
              </a>
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={viewingDetailsOrder.wishingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#e15b70] hover:bg-[#c94358] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Website</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyLink(viewingDetailsOrder.wishingUrl, viewingDetailsOrder.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer"
                >
                  {copiedOrderId === viewingDetailsOrder.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formatted Information Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px]">Recipient (To)</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{viewingDetailsOrder.receiverName || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px]">Sender (From)</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{viewingDetailsOrder.senderName || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px]">Plan Type</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {(viewingDetailsOrder as any).isTemporary === false ? '💎 Lifetime (Permanent)' : '⏳ 3 Months (Temporary)'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px]">Status & Amount</span>
                <span className="font-bold text-emerald-600 mt-0.5 block">
                  {viewingDetailsOrder.status || 'Active & Ready'} • {viewingDetailsOrder.totalPrice === 0 ? 'FREE' : `₹${viewingDetailsOrder.totalPrice}`}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                <span className="text-slate-400 font-semibold block text-[10px]">Order Date & Time</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {viewingDetailsOrder.purchaseDate || 'Recently generated'}
                </span>
              </div>
            </div>

            {/* Special Wish Message */}
            {viewingDetailsOrder.specialMessage && (
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-[10px] font-bold text-[#e15b70] uppercase tracking-wider block">
                  Personalized Wish Message:
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{viewingDetailsOrder.specialMessage}&rdquo;
                </p>
              </div>
            )}

            {/* Uploaded Photos Gallery */}
            {viewingDetailsOrder.uploadedImages && viewingDetailsOrder.uploadedImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Uploaded Photos ({viewingDetailsOrder.uploadedImages.length})
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {viewingDetailsOrder.uploadedImages.map((img: string, i: number) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:scale-105 transition group"
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2">
              {profileTab === 'active' && (
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingDetailsOrder;
                    setViewingDetailsOrder(null);
                    handleOpenEditModal(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#e15b70] bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleWhatsAppShare(viewingDetailsOrder)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingDetailsOrder(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Give Feedback Modal Popup */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Give Your Feedback</h3>
                  <p className="text-xs text-slate-400">Share your thoughts to help us improve VishLink</p>
                </div>
              </div>

              {fbSuccess ? (
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-2 py-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Feedback Sent Successfully!</h4>
                  <p className="text-xs text-emerald-200">Thank you so much for your feedback and support.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFbRating(star)}
                          className="p-1 transition transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= fbRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-amber-300 font-bold ml-2">{fbRating}/5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Feedback & Suggestions *</label>
                    <textarea
                      rows={4}
                      required
                      value={fbSuggestion}
                      onChange={(e) => setFbSuggestion(e.target.value)}
                      placeholder="Share your experience, suggest template ideas, or report any issues..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#e15b70]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={fbSubmitting}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#e15b70] to-[#d4485e] hover:from-[#c94358] hover:to-[#be3b50] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition disabled:opacity-50"
                    >
                      {fbSubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

