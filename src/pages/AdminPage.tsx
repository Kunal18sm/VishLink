import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Eye,
  Layers,
  Sparkles,
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Lock,
  Edit3,
  X,
  Check,
  LayoutDashboard,
  MessageSquare,
  Crown,
  Settings,
  Clock,
  ChevronRight,
  ChevronDown,
  DollarSign,
  AlertCircle,
  Star,
  Image as ImageIcon,
  Bell,
  Send,
  Headphones,
  Smartphone,
  Volume2,
  VolumeX,
  ShoppingCart,
  UserPlus,
} from 'lucide-react';


interface AdminPageProps {
  onBack: () => void;
}

const CATEGORY_OPTIONS = [
  'birthday',
  'anniversary',
  "valentine's",
  'couple',
  'free',
  'best friend',
  'festival',
  'sorry',
  'girlfriend',
  'family',
  'funny',
  'wedding',
  'parents',
  'males',
  'females',
  'all',
];

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'notifications'
    | 'orders-all'
    | 'orders-pending'
    | 'orders-permanent'
    | 'orders-live'
    | 'users'
    | 'templates'
    | 'add-template'
    | 'chats'
    | 'feedback'
    | 'settings'
  >('dashboard');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);
  const [pushStatusMsg, setPushStatusMsg] = useState<string>('');
  const [pushLoading, setPushLoading] = useState<boolean>(false);

  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    tempOrdersCount: 0,
    permOrdersCount: 0,
    templatesCount: 0,
    usersCount: 0,
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // Customer Live Support Chats State
  const [customerChats, setCustomerChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [adminReplyInput, setAdminReplyInput] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Users State with 20-per-batch Pagination
  const [users, setUsers] = useState<any[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // Selected Payment Proof Modal
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  const getProofImageUrl = (proof: any): string => {
    if (!proof) return '';
    if (typeof proof === 'string') return proof.trim();
    if (typeof proof === 'object') {
      if (proof.url && typeof proof.url === 'string') return proof.url.trim();
      if (proof.secure_url && typeof proof.secure_url === 'string') return proof.secure_url.trim();
    }
    return '';
  };

  const isOrderPending = (o: any): boolean => {
    if (!o) return false;
    if (o.adminInteracted === false || o.adminInterected === false) return true;
    if (o.isLive === false || o.isLive === 'false') return true;
    if (o.status && (o.status.includes('Pending') || o.status.includes('Processing'))) return true;
    if (o.paymentProofUrl && o.isLive !== true && o.isLive !== 'true') return true;
    if ((o.price > 0 || o.totalPrice > 0) && o.isLive !== true && o.isLive !== 'true') return true;
    return false;
  };

  // New Template Form State
  const [newWebName, setNewWebName] = useState('');
  const [newWebUrl, setNewWebUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTempPrice, setNewTempPrice] = useState('0');
  const [newPermPrice, setNewPermPrice] = useState('399');
  const [newImageNeeded, setNewImageNeeded] = useState('5');
  const [newPriority, setNewPriority] = useState('10');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedNewCategories, setSelectedNewCategories] = useState<string[]>(['birthday', 'all']);

  // Edit Template State
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [editWebName, setEditWebName] = useState('');
  const [editWebUrl, setEditWebUrl] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTempPrice, setEditTempPrice] = useState('0');
  const [editPermPrice, setEditPermPrice] = useState('399');
  const [editImageNeeded, setEditImageNeeded] = useState('5');
  const [editPriority, setEditPriority] = useState('10');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [selectedEditCategories, setSelectedEditCategories] = useState<string[]>(['birthday', 'all']);

  const [templateSubmitLoading, setTemplateSubmitLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState('');

  // Settings State
  const [showCoinPrice, setShowCoinPrice] = useState(true);

  useEffect(() => {
    fetchAdminData();
    fetchTemplates();
    fetchInitialUsers();
    fetchFeedbacks();
    fetchAdminNotifications();
    fetchCustomerChats();

    // Poll for new Admin notifications & Live customer chats every 6 seconds
    const notifInterval = setInterval(() => {
      fetchAdminNotifications(true);
      fetchCustomerChats();
    }, 6000);

    return () => clearInterval(notifInterval);
  }, []);

  const fetchAdminNotifications = async (silent = false) => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Play notification chime if new unread notification arrives
        if (silent && data.unreadCount > unreadNotifCount && audioAlertEnabled) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch (audioErr) {
            console.log('Audio playback notice:', audioErr);
          }
        }
        setAdminNotifications(data.notifications || []);
        setUnreadNotifCount(data.unreadCount || 0);
      }
    } catch (err) {
      if (!silent) console.error('Fetch admin notifications error:', err);
    }
  };

  const markNotificationsAsRead = async (notificationId?: string) => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;
    try {
      const res = await fetch('/api/admin/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAdminNotifications();
      }
    } catch (err) {
      console.error('Mark notifications read error:', err);
    }
  };

  // Convert VAPID base64 key to Uint8Array for PushManager
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSubscribeWebPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Web Push is not supported in this browser. Please use Chrome, Edge, Brave or Firefox.');
      return;
    }

    setPushLoading(true);
    setPushStatusMsg('');

    try {
      // 1. Request Browser Notification Permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission was denied. Please allow notifications in browser site settings.');
        setPushStatusMsg('Permission denied.');
        setPushLoading(false);
        return;
      }

      // 2. Fetch VAPID Public Key from Server
      const keyRes = await fetch('/api/admin/vapid-public-key');
      const keyData = await keyRes.json();
      if (!keyRes.ok || !keyData.publicKey) {
        throw new Error('Failed to retrieve VAPID public key from server.');
      }

      // 3. Subscribe via Service Worker PushManager
      const reg = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(keyData.publicKey);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // 4. Send Subscription object to Backend MongoDB
      const token = localStorage.getItem('vishlink_token');
      const saveRes = await fetch('/api/admin/subscribe-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sub),
      });

      const saveResult = await saveRes.json();
      if (saveRes.ok && saveResult.success) {
        setPushStatusMsg('✅ Browser Web Push Notifications Subscribed & Saved!');
      } else {
        alert(saveResult.message || 'Failed to save push subscription.');
      }
    } catch (err: any) {
      console.error('Web push subscribe error:', err);
      alert(`Push notice: ${err.message}`);
    } finally {
      setPushLoading(false);
    }
  };

  const handleTestPush = async () => {
    setPushLoading(true);
    setPushStatusMsg('');
    const token = localStorage.getItem('vishlink_token');

    // Ensure Notification Permission is requested first
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await handleSubscribeWebPush();
      }
    }

    try {
      const res = await fetch('/api/admin/notifications/test-push', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok && data.message && data.message.includes('No browser subscriptions found')) {
        // Auto subscribe browser first
        setPushStatusMsg('Subscribing browser first...');
        await handleSubscribeWebPush();

        // Retry test push
        const retryRes = await fetch('/api/admin/notifications/test-push', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const retryData = await retryRes.json();
        setPushStatusMsg(retryData.message || 'Web Push sent!');
      } else {
        setPushStatusMsg(data.message || (data.success ? 'Web Push sent!' : 'Push error'));
      }

      // Also trigger a local desktop notification chime for immediate visual feedback
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('🧪 VishLink Web Push Test Alert!', {
            body: 'Web Push notification is active on this browser!',
            icon: '/icons/icon-192.png',
          });
        } catch (nErr) {
          console.warn('Local Notification notice:', nErr);
        }
      }
    } catch (err: any) {
      setPushStatusMsg(err.message || 'Network error');
    } finally {
      setPushLoading(false);
    }
  };




  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats || {});
        setOrders(data.orders || []);
      } else {
        setError(data.message || 'Failed to load admin stats');
      }
    } catch (err: any) {
      setError(err.message || 'Network error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (res.ok && data.success) {
        setTemplates(data.templates || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Users with 20 per batch Pagination
  const fetchInitialUsers = async (searchQuery = '') => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      setUserPage(1);
      const url = `/api/admin/users?page=1&limit=20&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
        setHasMoreUsers(data.hasMore || false);
        setTotalUsersCount(data.totalUsers || data.users.length);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleLoadMoreUsers = async () => {
    if (!hasMoreUsers || loadingMoreUsers) return;
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    setLoadingMoreUsers(true);
    const nextPage = userPage + 1;

    try {
      const url = `/api/admin/users?page=${nextPage}&limit=20&search=${encodeURIComponent(userSearch)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u._id || u.id));
          const newUnique = (data.users || []).filter((u: any) => !existingIds.has(u._id || u.id));
          return [...prev, ...newUnique];
        });
        setUserPage(nextPage);
        setHasMoreUsers(data.hasMore || false);
      }
    } catch (err) {
      console.error('Load more users error:', err);
    } finally {
      setLoadingMoreUsers(false);
    }
  };

  const handleUserSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInitialUsers(userSearch);
  };

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomerChats = async () => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/chats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomerChats(data.chats || []);
        if (selectedChat) {
          const updated = (data.chats || []).find((c: any) => c._id === selectedChat._id);
          if (updated) setSelectedChat(updated);
        }
      }
    } catch (err) {
      console.error('Fetch customer chats error:', err);
    }
  };

  const handleSendAdminReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChat || !adminReplyInput.trim()) return;

    setReplyLoading(true);
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/chats/${selectedChat._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyText: adminReplyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminReplyInput('');
        fetchCustomerChats();
      } else {
        alert(data.message || 'Failed to send reply.');
      }
    } catch (err: any) {
      alert(err.message || 'Network error sending reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm('Delete this customer chat thread?')) return;
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/chats/${chatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (selectedChat && selectedChat._id === chatId) {
          setSelectedChat(null);
        }
        fetchCustomerChats();
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting chat thread.');
    }
  };

  const handleToggleLiveOrder = async (orderId: string) => {
    const token = localStorage.getItem('vishlink_token');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg(`Order status updated successfully!`);
        fetchAdminData();
        setTimeout(() => setAdminMsg(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order ID ${orderId}?`)) return;
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg('Order deleted successfully');
        fetchAdminData();
        setTimeout(() => setAdminMsg(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete order');
    }
  };

  const handleDeleteFakePayment = async (orderId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to REJECT & DELETE this order for FAKE PAYMENT PROOF?\nThis will remove the active request and log a Fake Payment rejection notice in user history.`
      )
    )
      return;
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}?reason=fake-payment`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg('Order rejected & marked as Fake Payment Proof!');
        fetchAdminData();
        setTimeout(() => setAdminMsg(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reject order');
    }
  };

  const handleToggleUserRole = async (userId: string) => {
    const token = localStorage.getItem('vishlink_token');
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg(`User role updated: ${data.user.role}`);
        fetchInitialUsers(userSearch);
        setTimeout(() => setAdminMsg(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle user role');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${username}?`)) return;
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg('User deleted successfully');
        fetchInitialUsers(userSearch);
        setTimeout(() => setAdminMsg(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebName.trim() || !newWebUrl.trim()) return;

    setTemplateSubmitLoading(true);
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          webName: newWebName.trim(),
          webUrl: newWebUrl.trim(),
          description: newDesc.trim(),
          priceForTemporary: Number(newTempPrice) || 0,
          priceForPermanent: Number(newPermPrice) || 399,
          imageNeeded: Number(newImageNeeded) || 5,
          priority: Number(newPriority) || 10,
          tags: selectedNewCategories,
          imageUrl: newImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg('🎉 New Wish Template added successfully!');
        setNewWebName('');
        setNewWebUrl('');
        setNewDesc('');
        setNewImageUrl('');
        fetchTemplates();
        setActiveTab('templates');
        setTimeout(() => setAdminMsg(''), 3000);
      } else {
        alert(data.message || 'Failed to add template');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create template');
    } finally {
      setTemplateSubmitLoading(false);
    }
  };

  const handleOpenEditModal = (t: any) => {
    setEditingTemplate(t);
    setEditWebName(t.webName || t.title || '');
    setEditWebUrl(t.webUrl || t.previewUrl || '');
    setEditDesc(t.description || '');
    setEditTempPrice(String(t.priceForTemporary ?? t.price ?? 0));
    setEditPermPrice(String(t.priceForPermanent ?? t.originalPrice ?? 399));
    setEditImageNeeded(String(t.imageNeeded ?? 5));
    setEditPriority(String(t.priority ?? 10));
    setEditImageUrl(t.imageUrl?.url || t.image || '');
    setSelectedEditCategories(t.tags || t.occasions || ['birthday', 'all']);
  };

  const handleSaveEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setTemplateSubmitLoading(true);
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/templates/${editingTemplate._id || editingTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          webName: editWebName.trim(),
          webUrl: editWebUrl.trim(),
          description: editDesc.trim(),
          priceForTemporary: Number(editTempPrice) || 0,
          priceForPermanent: Number(editPermPrice) || 399,
          imageNeeded: Number(editImageNeeded) || 5,
          priority: Number(editPriority) || 10,
          tags: selectedEditCategories,
          imageUrl: editImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg('Template updated successfully!');
        setEditingTemplate(null);
        fetchTemplates();
        setTimeout(() => setAdminMsg(''), 3000);
      } else {
        alert(data.message || 'Failed to update template');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating template');
    } finally {
      setTemplateSubmitLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete template "${name}"?`)) return;
    const token = localStorage.getItem('vishlink_token');

    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMsg('Template deleted successfully');
        fetchTemplates();
        setTimeout(() => setAdminMsg(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete template');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    const token = localStorage.getItem('vishlink_token');
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Orders logic
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'orders-pending') {
      return isOrderPending(o);
    }
    if (activeTab === 'orders-permanent') {
      return o.isTemporary === false || o.dbType === 'Permanent DB';
    }
    if (activeTab === 'orders-live') {
      return o.isLive === true || o.isLive === 'true';
    }
    return true;
  });

  return (
    <div className="min-h-[90vh] bg-[#090d16] text-slate-100 font-sans py-6">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Top Admin Control Header Bar */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 transition-colors cursor-pointer border border-slate-700"
              title="Return to VishLink Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Admin Control Panel
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                VishLink Master Control
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                fetchAdminData();
                fetchTemplates();
                fetchInitialUsers();
                fetchFeedbacks();
              }}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={() => setActiveTab('add-template')}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#e15b70] to-[#c94358] hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Template</span>
            </button>
          </div>
        </div>

        {adminMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {adminMsg}
            </span>
            <button onClick={() => setAdminMsg('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-bold text-slate-400">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              markNotificationsAsRead();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 relative ${
              activeTab === 'notifications'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Bell className="w-4 h-4 text-rose-400" />
            <span>Admin Alerts</span>
            {unreadNotifCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>


          <button
            onClick={() => setActiveTab('orders-pending')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'orders-pending'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Link Requests ({orders.filter(isOrderPending).length})</span>
            {orders.filter(isOrderPending).length > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {orders.filter(isOrderPending).length} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users ({stats.usersCount || users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'templates'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Wish Templates ({templates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders-all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab.startsWith('orders-')
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Purchased Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 relative ${
              activeTab === 'chats'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Headphones className="w-4 h-4 text-amber-300" />
            <span>Customer Support Chats ({customerChats.length})</span>
            {customerChats.some((c) => c.unreadByAdmin) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'feedback'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedbacks ({feedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'settings'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>
        </div>

        {/* ---------------- 0. ADMIN FREE NOTIFICATIONS CENTER VIEW ---------------- */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Control & Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Browser Web Push Subscription & Test Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        VAPID Web Push
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">Browser Push Notifications</h3>
                    </div>
                  </div>
                  <button
                    onClick={handleTestPush}
                    disabled={pushLoading}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{pushLoading ? 'Sending...' : 'Test Web Push Alert'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Subscribe this browser to receive instant Web Push notifications whenever a new user registers or a template is sold!
                </p>

                {pushStatusMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                    {pushStatusMsg}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleSubscribeWebPush}
                    disabled={pushLoading}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Enable Browser Web Push</span>
                  </button>
                </div>
              </div>

              {/* Audio Alerts & Notification Controls Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        In-App Sound &amp; Feed
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">Audio Chime &amp; Logs</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      audioAlertEnabled
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title={audioAlertEnabled ? 'Disable Audio Chime' : 'Enable Audio Chime'}
                  >
                    {audioAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Real-time notification chime plays when a new signup or sale arrives. Auto-refreshes every 10 seconds.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => markNotificationsAsRead()}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    Mark All Notifications as Read
                  </button>
                </div>
              </div>

            </div>

            {/* Notification Activity Feed Header */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-400" />
                  <span>Admin Activity Notifications Log</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Live feed of user signups, template sales &amp; order activity. Auto-refreshes every 10 seconds.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Total Logs: {adminNotifications.length}
              </span>
            </div>

            {/* Notifications Feed Items */}
            {adminNotifications.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <Bell className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
                <h4 className="text-base font-bold text-slate-300">No Admin Notifications Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When a new user registers or a template is sold, notifications will appear here instantly and trigger Telegram alerts!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {adminNotifications.map((notif) => {
                  const isUserSignup = notif.type === 'NEW_USER_SIGNUP';
                  const isSale = notif.type === 'TEMPLATE_SALE';
                  return (
                    <div
                      key={notif._id || notif.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        notif.read
                          ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                          : 'bg-slate-900 border-rose-500/40 text-white shadow-lg shadow-rose-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isUserSignup
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : isSale
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {isUserSignup ? (
                              <UserPlus className="w-5 h-5" />
                            ) : isSale ? (
                              <ShoppingCart className="w-5 h-5" />
                            ) : (
                              <Bell className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                              {!notif.read && (
                                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>

                            {/* Details Chips */}
                            {notif.details && (
                              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                                {notif.details.username && (
                                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                                    👤 {notif.details.username}
                                  </span>
                                )}
                                {notif.details.email && (
                                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                                    📧 {notif.details.email}
                                  </span>
                                )}
                                {notif.details.orderId && (
                                  <span className="bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded-lg border border-slate-700 font-mono">
                                    🆔 {notif.details.orderId}
                                  </span>
                                )}
                                {notif.details.price !== undefined && (
                                  <span className="bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 font-bold">
                                    💵 ₹{notif.details.price}
                                  </span>
                                )}
                                {notif.details.provider && (
                                  <span className="bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-lg border border-slate-700">
                                    🔐 {notif.details.provider}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] text-slate-500 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] text-slate-600 block mt-0.5">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---------------- 1. DASHBOARD HOME OVERVIEW VIEW ---------------- */}
        {activeTab === 'dashboard' && (

          <div className="space-y-8 animate-in fade-in">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-md">
                <span className="text-slate-400 text-xs font-semibold block">Total Registered Users</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                  {stats.usersCount || users.length}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">Active Creators</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-md">
                <span className="text-slate-400 text-xs font-semibold block">Total Purchased Orders</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1 block">
                  {orders.length}
                </span>
                <span className="text-[10px] text-rose-300 font-bold mt-1 inline-block">
                  {stats.tempOrdersCount || 0} Temp | {stats.permOrdersCount || 0} Perm
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-md">
                <span className="text-slate-400 text-xs font-semibold block">Live Wish Templates</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">
                  {templates.length}
                </span>
                <span className="text-[10px] text-amber-300 font-bold mt-1 inline-block">Available in Store</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-md">
                <span className="text-slate-400 text-xs font-semibold block">User Feedbacks</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1 block">
                  {feedbacks.length}
                </span>
                <span className="text-[10px] text-sky-300 font-bold mt-1 inline-block">Suggestions & Ratings</span>
              </div>
            </div>

            {/* Dashboard Option Cards Grid (Matching Old WishLink Layout) */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white">Admin Management Hub</h2>
                <p className="text-xs text-slate-400">Click any feature option to manage in full dedicated page view.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 0: Admin Notification Service */}
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    markNotificationsAsRead();
                  }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 hover:border-rose-500/60 border border-rose-500/30 text-left transition-all duration-200 shadow-xl cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      🔔
                    </div>
                    {unreadNotifCount > 0 ? (
                      <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-bounce shadow-md">
                        {unreadNotifCount} NEW
                      </span>
                    ) : (
                      <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                        Telegram Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-rose-300 transition-colors">
                    Admin Notifications
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant Telegram &amp; browser push alerts for user signups &amp; template sales.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
                    <span>View Alerts Log</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Card 0: New Link Requests */}
                <button
                  onClick={() => setActiveTab('orders-pending')}
                  className="group p-6 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-left transition-all duration-200 shadow-xl cursor-pointer relative overflow-hidden"
                >

                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      ⏳
                    </div>
                    {orders.filter(isOrderPending).length > 0 && (
                      <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full animate-pulse shadow-md">
                        {orders.filter(isOrderPending).length} PENDING
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                    New Link Requests
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Review new wishing links created by users that need admin approval.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                    View Requests ({orders.filter(isOrderPending).length}) ➔
                  </span>
                </button>

                {/* Card 1: Add Template */}
                <button
                  onClick={() => setActiveTab('add-template')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-rose-500/30 hover:border-rose-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    ✨
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-rose-400 transition-colors">
                    Add Wish Template
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload & publish new interactive wishing templates to the store.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                    Open Action ➔
                  </span>
                </button>

                {/* Card 2: All Users */}
                <button
                  onClick={() => setActiveTab('users')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                    All Registered Users
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage registered users with 20 users per batch & Load More pagination.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-400">
                    View Users ({stats.usersCount || users.length}) ➔
                  </span>
                </button>

                {/* Card 3: Purchased Orders */}
                <button
                  onClick={() => setActiveTab('orders-all')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    📥
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                    Purchased Orders
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    View generated wishing links, payment proofs, and live site links.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                    Manage Orders ({orders.length}) ➔
                  </span>
                </button>

                {/* Card 4: Permanent Requests */}
                <button
                  onClick={() => setActiveTab('orders-permanent')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    💎
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                    Permanent Lifetime Links
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage premium lifetime valid wishing websites stored in Permanent DB.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                    View Permanent ({stats.permOrdersCount || 0}) ➔
                  </span>
                </button>

                {/* Card 5: Templates Manager */}
                <button
                  onClick={() => setActiveTab('templates')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    🎨
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors">
                    Templates Store Manager
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit pricing, image limits, tags, priority, and delete old templates.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-400">
                    Manage Templates ({templates.length}) ➔
                  </span>
                </button>

                {/* Card: Live Customer Support Chats */}
                <button
                  onClick={() => setActiveTab('chats')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 text-left transition-all duration-200 shadow-lg cursor-pointer relative"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    <Headphones className="w-6 h-6 text-amber-300" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>Live Support Chats</span>
                    {customerChats.some((c) => c.unreadByAdmin) && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">New</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct human customer support helpdesk with live messaging & notifications.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                    Open Helpdesk ({customerChats.length} Threads) →
                  </span>
                </button>

                {/* Card 6: Feedbacks */}
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
                    Feedbacks & Reviews
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Read customer ratings, feature requests, and user feedback messages.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-400">
                    View Feedbacks ({feedbacks.length}) ➔
                  </span>
                </button>

                {/* Card 7: Pending Approval */}
                <button
                  onClick={() => setActiveTab('orders-pending')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    ⏳
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                    Pending Proof Approvals
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Review payment screenshots uploaded by users for manual UPI verification.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-400">
                    Check Pending ➔
                  </span>
                </button>

                {/* Card 8: System Settings */}
                <button
                  onClick={() => setActiveTab('settings')}
                  className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-left transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    ⚙️
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-slate-300 transition-colors">
                    System & Site Config
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure website coin visibility, default link validity, and API settings.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-300">
                    Open Settings ➔
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 2. DEDICATED ALL USERS PAGE (20 PER BATCH + LOAD MORE) ---------------- */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  All Registered Users ({totalUsersCount})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing 20 users per batch. Use the Load More button at the bottom to load the next 20 users.
                </p>
              </div>

              {/* User Search Form */}
              <form onSubmit={handleUserSearchSubmit} className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4">Total Links Created</th>
                      <th className="py-3.5 px-4">Role Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                u.avatarUrl ||
                                `https://api.dicebear.com/7.x/notionists/svg?seed=${u.username || 'user'}`
                              }
                              alt=""
                              className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-white block">{u.username || 'User'}</span>
                              <span className="text-[10px] text-slate-500 font-mono">ID: {u._id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {u.email || 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Earlier'}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-rose-400">
                          {u.totalLinksCount || 0} Links
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              u.role === 'admin' || u.isAdmin
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {u.role === 'admin' || u.isAdmin ? '👑 Admin Master' : 'Verified User'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserRole(u._id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold transition cursor-pointer"
                          >
                            {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u._id, u.username || u.email)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition cursor-pointer inline-flex items-center justify-center"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Load More Button (20 Per Page) */}
              {hasMoreUsers && (
                <div className="p-4 text-center border-t border-slate-800 bg-slate-950/60">
                  <button
                    onClick={handleLoadMoreUsers}
                    disabled={loadingMoreUsers}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50 transition cursor-pointer"
                  >
                    {loadingMoreUsers ? (
                      <span>Loading Next 20 Users...</span>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Load More Users (20 More)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- 3. DEDICATED WISH TEMPLATES STORE PAGE ---------------- */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Wish Templates Collection ({templates.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage live interactive wishing templates displayed on the website.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('add-template')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Template</span>
              </button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t) => (
                <div
                  key={t._id || t.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 bg-slate-950 overflow-hidden group">
                      <img
                        src={
                          (typeof t.imageUrl === 'string' ? t.imageUrl : t.imageUrl?.url || t.imageUrl?.secure_url || t.image) ||
                          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={t.webName || t.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className="bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                          Priority: {t.priority || 10}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-white text-base">
                        {t.webName || t.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {t.description || 'Custom interactive wishing webpage'}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {(t.tags || t.occasions || []).map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-slate-800 text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Temp Price:</span>
                          <span className="font-bold text-emerald-400">
                            {t.priceForTemporary === 0 ? 'FREE' : `₹${t.priceForTemporary ?? t.price}`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[10px]">Perm Price:</span>
                          <span className="font-bold text-amber-400">
                            ₹{t.priceForPermanent ?? t.originalPrice ?? 399}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
                    <a
                      href={t.webUrl || t.previewUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(t)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteTemplate(t._id || t.id, t.webName || t.title)}
                        className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 4. DEDICATED ADD NEW TEMPLATE PAGE ---------------- */}
        {activeTab === 'add-template' && (
          <div className="max-w-3xl mx-auto bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-400" />
                Add New Wish Template
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fill in the template parameters below to publish a new wishing website to the store.
              </p>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Web Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={newWebName}
                    onChange={(e) => setNewWebName(e.target.value)}
                    placeholder="e.g. 3D Royal Birthday Cake"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Web URL / Live Link *</label>
                  <input
                    type="text"
                    required
                    value={newWebUrl}
                    onChange={(e) => setNewWebUrl(e.target.value)}
                    placeholder="https://all-sub-websites.onrender.com/wish/3d-royal-bday"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Interactive 3D cake cutting with music, secret love notes, and photo memories..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Temp Price (₹)</label>
                  <input
                    type="number"
                    value={newTempPrice}
                    onChange={(e) => setNewTempPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Perm Price (₹)</label>
                  <input
                    type="number"
                    value={newPermPrice}
                    onChange={(e) => setNewPermPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Image Needed</label>
                  <input
                    type="number"
                    value={newImageNeeded}
                    onChange={(e) => setNewImageNeeded(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority Order</label>
                  <input
                    type="number"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Thumbnail Cover Image URL</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Category Tags</label>
                <div className="flex flex-wrap gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedNewCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedNewCategories((prev) =>
                            isSelected ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={templateSubmitLoading}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition cursor-pointer"
                >
                  {templateSubmitLoading ? 'Saving...' : 'Publish Template to Store'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('templates')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------- 5. DEDICATED PURCHASED ORDERS PAGE ---------------- */}
        {activeTab.startsWith('orders-') && (
          <div className="space-y-6 animate-in fade-in">
            {/* Filter Tabs for Orders */}
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders-all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeTab === 'orders-all' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  All Orders ({orders.length})
                </button>

                <button
                  onClick={() => setActiveTab('orders-pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeTab === 'orders-pending' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Pending Proofs ({orders.filter(isOrderPending).length})
                </button>

                <button
                  onClick={() => setActiveTab('orders-permanent')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeTab === 'orders-permanent' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Permanent Links ({stats.permOrdersCount || 0})
                </button>

                <button
                  onClick={() => setActiveTab('orders-live')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeTab === 'orders-live' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Active Live Links ({orders.filter((o) => o.isLive).length})
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Recipient & Sender</th>
                      <th className="py-3.5 px-4">Live Wish URL</th>
                      <th className="py-3.5 px-4">Plan & Price</th>
                      <th className="py-3.5 px-4">Payment Proof</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.map((o) => (
                      <tr key={o.purchaseId || o._id} className="hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-white block">
                            {o.purchaseId || o.id}
                          </span>
                          <span className="text-[10px] text-slate-500">{o.date || o.purchaseDate}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-rose-300 block">To: {o.receiver || o.receiverName}</span>
                          <span className="text-slate-400 text-[11px]">From: {o.sender || o.senderName}</span>
                        </td>

                        <td className="py-3.5 px-4 max-w-[200px] truncate">
                          <a
                            href={o.wishingUrl || o.webUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-emerald-400 hover:underline text-[11px] truncate block"
                          >
                            {o.wishingUrl || o.webUrl}
                          </a>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-white block">
                            {o.price === 0 || o.totalPrice === 0 ? 'FREE' : `₹${o.price || o.totalPrice}`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {o.isTemporary === false ? '💎 Permanent' : '⏳ Temporary'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {getProofImageUrl(o.paymentProofUrl) ? (
                            <button
                              onClick={() => setSelectedProofUrl(getProofImageUrl(o.paymentProofUrl))}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-[11px] hover:bg-indigo-500/30 transition cursor-pointer flex items-center gap-1"
                            >
                              <ImageIcon className="w-3.5 h-3.5" /> View Proof
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">None / Free</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              o.isLive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {o.isLive ? '🟢 Live Active' : '⏳ Pending'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleLiveOrder(o.purchaseId || o._id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                          >
                            {o.isLive ? 'Disable' : '✓ Accept & Live'}
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(o.purchaseId || o._id)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] transition cursor-pointer"
                            title="Delete Normal"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => handleDeleteFakePayment(o.purchaseId || o._id)}
                            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-[11px] border border-red-500/30 transition cursor-pointer"
                            title="Reject & Mark as Fake Payment Proof"
                          >
                            Fake Proof Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 6. DEDICATED LIVE CUSTOMER SUPPORT CHATS PAGE ---------------- */}
        {activeTab === 'chats' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-amber-400" />
                  Live Customer Support Helpdesk ({(Array.isArray(customerChats) ? customerChats.length : 0)})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  View customer conversations and reply live to users requesting support.
                </p>
              </div>

              <button
                onClick={fetchCustomerChats}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Chats</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
              {/* Left Column: Thread List */}
              <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 max-h-[650px] overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center justify-between">
                  <span>Active Threads</span>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    {customerChats.filter((c) => c.unreadByAdmin).length} Unread
                  </span>
                </h3>

                {(!Array.isArray(customerChats) || customerChats.length === 0) ? (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <Headphones className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-bold text-slate-400">No active customer chats</p>
                    <p className="text-[11px]">When users send messages in Live Admin mode, they will appear here.</p>
                  </div>
                ) : (
                  customerChats.map((c) => {
                    const isSelected = selectedChat?._id === c._id;
                    const uName = c.user?.username || c.user?.email || 'Guest Visitor';
                    const hasUnread = c.unreadByAdmin;

                    return (
                      <div
                        key={c._id}
                        onClick={() => {
                          setSelectedChat(c);
                          c.unreadByAdmin = false;
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 relative ${
                          isSelected
                            ? 'bg-rose-500/10 border-rose-500/50 text-white shadow-md'
                            : hasUnread
                            ? 'bg-amber-500/10 border-amber-500/40 text-slate-200'
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-rose-400 shrink-0">
                              {uName.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-xs truncate text-white">{uName}</p>
                              <p className="text-[10px] text-slate-400 truncate">{c.user?.email || 'Guest User'}</p>
                            </div>
                          </div>

                          {hasUnread && (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" title="New Message" />
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1 italic bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                          {c.lastMessage || 'No messages yet'}
                        </p>

                        <div className="text-[10px] text-slate-500 flex justify-between items-center pt-1">
                          <span>{c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(c._id);
                            }}
                            className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                            title="Delete Chat Thread"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Chat Box Window */}
              <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col max-h-[650px] overflow-hidden">
                {selectedChat ? (
                  <>
                    {/* Active Thread Header */}
                    <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-md">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-sm text-white">
                            {(selectedChat.user?.username || 'G').charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">
                            {selectedChat.user?.username || selectedChat.user?.email || 'Guest Visitor'}
                          </h3>
                          <p className="text-xs text-slate-400">{selectedChat.user?.email || 'Live Customer Chat'}</p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Session
                      </span>
                    </div>

                    {/* Message Log */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                      {selectedChat.messages?.map((m: any, idx: number) => {
                        const isUser = m.senderRole === 'user';
                        const isAdmin = m.senderRole === 'admin';

                        return (
                          <div
                            key={m._id || idx}
                            className={`flex items-start gap-2.5 ${isUser ? '' : 'flex-row-reverse'}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                                isUser
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : isAdmin
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {isUser ? 'U' : isAdmin ? '👑' : '🤖'}
                            </div>

                            <div
                              className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 shadow-md ${
                                isUser
                                  ? 'bg-slate-800 text-white border border-slate-700 rounded-tl-none'
                                  : isAdmin
                                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                  : 'bg-slate-900 text-slate-300 rounded-tr-none border border-slate-800'
                              }`}
                            >
                              <div className="font-semibold text-[11px] opacity-75">
                                {isUser ? 'Customer' : isAdmin ? 'Admin Reply (You)' : 'AI Bot Response'}
                              </div>
                              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                              <div className="text-[10px] opacity-60 text-right pt-0.5">
                                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Admin Input Bar */}
                    <form onSubmit={handleSendAdminReply} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                      <input
                        type="text"
                        value={adminReplyInput}
                        onChange={(e) => setAdminReplyInput(e.target.value)}
                        placeholder="Type your official reply to this customer..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        type="submit"
                        disabled={replyLoading || !adminReplyInput.trim()}
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{replyLoading ? 'Sending...' : 'Send Reply'}</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <Headphones className="w-12 h-12 text-slate-700 mx-auto" />
                    <h3 className="font-bold text-white text-base">Select a Customer Thread</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Click any customer chat thread from the left column to read messages and send live support replies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 7. DEDICATED FEEDBACKS PAGE ---------------- */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Customer Feedbacks & Ratings ({(Array.isArray(feedbacks) ? feedbacks.length : 0)})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reviews submitted by users on the VishLink website.
                </p>
              </div>

              <button
                onClick={fetchFeedbacks}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Feedbacks</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(!Array.isArray(feedbacks) || feedbacks.length === 0) ? (
                <div className="col-span-2 p-8 bg-slate-900/90 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs space-y-2">
                  <MessageSquare className="w-8 h-8 text-purple-400/60 mx-auto mb-2" />
                  <p className="font-bold text-slate-200">No user feedbacks found.</p>
                  <p className="text-[11px] text-slate-400">Click "Refresh Feedbacks" to sync latest reviews from the server.</p>
                </div>
              ) : (
                feedbacks.map((f, idx) => {
                  if (!f) return null;
                  const feedbackText = f.feedbackmsg || f.suggestion || f.comment || f.message || f.text || f.content || 'User submitted feedback';
                  const displayName = (f.userName && f.userName !== 'Anonymous User')
                    ? f.userName
                    : (f.name && f.name !== 'Anonymous User') 
                    ? f.name 
                    : (f.email ? f.email.split('@')[0] : 'Verified Customer');

                  return (
                    <div
                      key={f._id || `fb-${idx}`}
                      className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 relative hover:border-purple-500/40 transition shadow-lg"
                    >
                      <button
                        onClick={() => handleDeleteFeedback(f._id)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{displayName}</span>
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{f.rating || 5}/5</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        "{feedbackText}"
                      </p>

                      <div className="text-[10px] text-slate-400 border-t border-slate-800/60 pt-2 flex justify-between">
                        <span>{f.email || 'No email provided'}</span>
                        <span>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ---------------- 7. DEDICATED SYSTEM SETTINGS PAGE ---------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-300" />
                System & Site Configuration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Global settings for VishLink server and frontend defaults.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Template Coin Price Visibility</span>
                  <span className="text-slate-400 text-[11px]">Show coin conversion badges next to prices.</span>
                </div>
                <button
                  onClick={() => setShowCoinPrice(!showCoinPrice)}
                  className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                    showCoinPrice ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {showCoinPrice ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Database Connection Status</span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Primary MongoDB (Active)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Permanent MongoDB (Active)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Template Modal */}
        {editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Edit Template ({editingTemplate.title || editingTemplate.webName})</h3>
                <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditTemplate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Web Name</label>
                    <input
                      type="text"
                      value={editWebName}
                      onChange={(e) => setEditWebName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Web URL</label>
                    <input
                      type="text"
                      value={editWebUrl}
                      onChange={(e) => setEditWebUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Temp Price</label>
                    <input
                      type="number"
                      value={editTempPrice}
                      onChange={(e) => setEditTempPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Perm Price</label>
                    <input
                      type="number"
                      value={editPermPrice}
                      onChange={(e) => setEditPermPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Image Needed</label>
                    <input
                      type="number"
                      value={editImageNeeded}
                      onChange={(e) => setEditImageNeeded(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Priority</label>
                    <input
                      type="number"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={templateSubmitLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    {templateSubmitLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Proof Modal Preview */}
        {selectedProofUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-5 space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Payment Proof Screenshot</span>
                <button onClick={() => setSelectedProofUrl(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={getProofImageUrl(selectedProofUrl)}
                alt="Payment Proof Screenshot"
                className="max-h-[70vh] mx-auto rounded-xl border border-slate-700 object-contain shadow-2xl bg-black/40"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
