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
    'orders-all' | 'orders-pending' | 'orders-permanent' | 'orders-live' | 'users' | 'templates' | 'feedback'
  >('orders-all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    tempOrdersCount: 0,
    permOrdersCount: 0,
    templatesCount: 0,
    usersCount: 0,
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

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

  useEffect(() => {
    fetchAdminData();
    fetchTemplates();
    fetchUsers();
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback submission?')) return;
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchFeedbacks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('vishlink_token');
    if (!token) {
      setError('Please log in with an Admin account.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load admin data');
      }

      setStats(data.stats);
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || 'Access denied or server error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (res.ok && data.success) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleApprove = async (purchaseId: string) => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/orders/${purchaseId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (purchaseId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/orders/${purchaseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserAdmin = async (userId: string) => {
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Template Handler
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTemplateSubmitLoading(true);
    setAdminMsg('');
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          webName: newWebName,
          webUrl: newWebUrl,
          description: newDesc,
          priceForTemporary: Number(newTempPrice),
          priceForPermanent: Number(newPermPrice),
          imageNeeded: Number(newImageNeeded),
          priority: Number(newPriority),
          imageUrl: newImageUrl,
          tags: selectedNewCategories.length > 0 ? selectedNewCategories : ['birthday', 'all'],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create template');
      }

      setAdminMsg('✓ New template added successfully to live catalog!');
      setNewWebName('');
      setNewWebUrl('');
      setNewDesc('');
      setNewImageUrl('');
      fetchTemplates();
      fetchAdminData();
    } catch (err: any) {
      setAdminMsg(`Error: ${err.message}`);
    } finally {
      setTemplateSubmitLoading(false);
    }
  };

  // Open Edit Modal
  const handleStartEditTemplate = (t: any) => {
    setEditingTemplate(t);
    setEditWebName(t.title || t.webName || '');
    setEditWebUrl(t.previewUrl || t.webUrl || '');
    setEditDesc(t.description || '');
    setEditTempPrice(String(t.price !== undefined ? t.price : t.priceForTemporary || 0));
    setEditPermPrice(String(t.originalPrice || t.priceForPermanent || 399));
    setEditImageNeeded(String(t.imageNeeded !== undefined ? t.imageNeeded : 5));
    setEditPriority(String(t.priority || 10));
    setEditImageUrl(t.image || t.imageUrl?.url || '');
    setSelectedEditCategories(t.occasions || t.tags || ['birthday', 'all']);
  };

  // Save Edit Template Handler
  const handleSaveEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setTemplateSubmitLoading(true);
    const token = localStorage.getItem('vishlink_token');
    const targetId = editingTemplate.id || editingTemplate._id;

    try {
      let res = await fetch(`/api/admin/templates/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          webName: editWebName,
          webUrl: editWebUrl,
          description: editDesc,
          priceForTemporary: Number(editTempPrice),
          priceForPermanent: Number(editPermPrice),
          imageNeeded: Number(editImageNeeded),
          priority: Number(editPriority),
          imageUrl: editImageUrl,
          tags: selectedEditCategories,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        res = await fetch(`/api/admin/templates/${targetId}/edit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            webName: editWebName,
            webUrl: editWebUrl,
            description: editDesc,
            priceForTemporary: Number(editTempPrice),
            priceForPermanent: Number(editPermPrice),
            imageNeeded: Number(editImageNeeded),
            priority: Number(editPriority),
            imageUrl: editImageUrl,
            tags: selectedEditCategories,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update template');
      }

      setEditingTemplate(null);
      fetchTemplates();
      fetchAdminData();
    } catch (err: any) {
      alert(`Update Error: ${err.message}`);
    } finally {
      setTemplateSubmitLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Delete this template?')) return;
    const token = localStorage.getItem('vishlink_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTemplates();
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCategorySelection = (cat: string, isEdit: boolean) => {
    if (isEdit) {
      setSelectedEditCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
    } else {
      setSelectedNewCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
    }
  };

  // Filter Orders depending on active tab
  const getFilteredOrders = () => {
    let list = orders;
    if (activeTab === 'orders-pending') {
      list = list.filter((o) => !o.isLive);
    } else if (activeTab === 'orders-permanent') {
      list = list.filter((o) => !o.isTemporary || o.dbType?.includes('Permanent'));
    } else if (activeTab === 'orders-live') {
      list = list.filter((o) => o.isLive);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.purchaseId?.toLowerCase().includes(q) ||
          o.sender?.toLowerCase().includes(q) ||
          o.receiver?.toLowerCase().includes(q) ||
          o.webName?.toLowerCase().includes(q) ||
          o.webUrl?.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredOrdersList = getFilteredOrders();

  const filteredUsersList = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 bg-slate-900 min-h-[90vh] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  VishLink Admin Suite
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full management dashboard for orders, templates, category tags & registered users.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchAdminData();
                fetchTemplates();
                fetchUsers();
              }}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-900/30 border border-red-500/50 p-8 text-center max-w-lg mx-auto my-12">
            <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-xs text-red-200 mb-6">{error}</p>
            <button
              onClick={onBack}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
            >
              Back to Safety
            </button>
          </div>
        ) : (
          <>
            {/* Admin Stats Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70">
                <span className="text-slate-400 text-xs font-medium block">Total Orders</span>
                <span className="text-2xl font-black text-white">{stats.totalOrders}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70">
                <span className="text-slate-400 text-xs font-medium block">Temporary Links</span>
                <span className="text-2xl font-black text-indigo-400">{stats.tempOrdersCount}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70">
                <span className="text-slate-400 text-xs font-medium block">Permanent Links</span>
                <span className="text-2xl font-black text-amber-400">{stats.permOrdersCount}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70">
                <span className="text-slate-400 text-xs font-medium block">Live Templates</span>
                <span className="text-2xl font-black text-emerald-400">{stats.templatesCount}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70">
                <span className="text-slate-400 text-xs font-medium block">Registered Users</span>
                <span className="text-2xl font-black text-rose-400">{stats.usersCount || users.length}</span>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
              <div className="flex flex-wrap gap-2 text-xs font-bold overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('orders-all')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'orders-all'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  📥 All Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders-pending')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'orders-pending'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ⏳ Pending ({orders.filter((o) => !o.isLive).length})
                </button>
                <button
                  onClick={() => setActiveTab('orders-permanent')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'orders-permanent'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  💎 Permanent Queue ({orders.filter((o) => !o.isTemporary || o.dbType?.includes('Permanent')).length})
                </button>
                <button
                  onClick={() => setActiveTab('orders-live')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'orders-live'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🟢 Active Live ({orders.filter((o) => o.isLive).length})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'users'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👥 Users Directory ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'templates'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🎨 Templates Manager ({templates.length})
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                    activeTab === 'feedback'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  💬 User Feedbacks ({feedbacks.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders or users..."
                  className="w-full bg-slate-800 text-xs text-white placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 border border-slate-700 focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* TAB CONTENT 1: ORDERS TABLES */}
            {activeTab.startsWith('orders') && (
              <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Showing {filteredOrdersList.length} Order(s)</span>
                  <span className="text-slate-400 text-[11px]">
                    Temporary: Primary DB | Permanent: Sales DB
                  </span>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-slate-400">Loading orders...</div>
                ) : filteredOrdersList.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm">
                    No orders found matching the filter query.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                      <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="p-4">Order ID & Date</th>
                          <th className="p-4">Template & Price</th>
                          <th className="p-4">Sender ➔ Receiver</th>
                          <th className="p-4">Database & Type</th>
                          <th className="p-4">Status & Action</th>
                          <th className="p-4">Payment Proof</th>
                          <th className="p-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {filteredOrdersList.map((order) => (
                          <tr key={order._id || order.purchaseId} className="hover:bg-slate-700/30 transition">
                            <td className="p-4 font-mono">
                              <span className="font-bold text-amber-400 block">{order.purchaseId}</span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(order.date).toLocaleDateString()}
                              </span>
                            </td>

                            <td className="p-4">
                              <p className="font-bold text-white">{order.webName}</p>
                              <a
                                href={order.webUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-indigo-300 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <span>{order.webUrl?.slice(0, 35)}...</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>

                            <td className="p-4">
                              <p className="text-slate-200">
                                <span className="font-semibold">{order.sender}</span> ➔{' '}
                                <span className="font-semibold text-rose-300">{order.receiver}</span>
                              </p>
                              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                                "{order.specialMsg?.[0]}"
                              </p>
                            </td>

                            <td className="p-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  order.isTemporary
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {order.isTemporary ? 'Temporary (Primary DB)' : 'Permanent (Sales DB)'}
                              </span>
                              <p className="text-[11px] font-extrabold text-white mt-1">₹{order.price}</p>
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => handleToggleApprove(order.purchaseId)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition ${
                                  order.isLive
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                }`}
                              >
                                {order.isLive ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Live (Click to Pause)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Pending (Click to Approve)</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="p-4">
                              {order.paymentProofUrl?.url ? (
                                <button
                                  onClick={() => setSelectedProofUrl(order.paymentProofUrl.url)}
                                  className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 underline cursor-pointer bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-800/50"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Proof</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500">No proof attached</span>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteOrder(order.purchaseId)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: REGISTERED USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Registered Users ({filteredUsersList.length})</span>
                  <span className="text-slate-400 text-[11px]">User role management & accounts</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
                    <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role & Status</th>
                        <th className="p-4">Created Links</th>
                        <th className="p-4">Admin Toggle</th>
                        <th className="p-4 text-right">Delete Account</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredUsersList.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-700/30 transition">
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-black">
                              {u.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span>{u.username}</span>
                          </td>
                          <td className="p-4 text-slate-300">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                u.role === 'admin' || u.isAdmin
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {u.role === 'admin' || u.isAdmin ? '👑 Admin Master' : 'Verified User'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-emerald-400">{u.totalLinksCount || 0} Links</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleUserAdmin(u._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-700 hover:bg-slate-600 text-white cursor-pointer transition"
                            >
                              {u.role === 'admin' ? (
                                <>
                                  <UserX className="w-3.5 h-3.5 text-amber-400" /> Revoke Admin
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Make Admin
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: TEMPLATES MANAGER & CREATE/EDIT FORM */}
            {activeTab === 'templates' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Add New Template Form */}
                <div className="lg:col-span-5 bg-slate-800 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                    <Plus className="w-5 h-5 text-amber-400" />
                    <h2 className="font-bold text-white text-base">Add New Sample Template</h2>
                  </div>

                  {adminMsg && (
                    <div className="p-3 rounded-xl bg-slate-900 text-xs font-semibold text-amber-300 border border-slate-700">
                      {adminMsg}
                    </div>
                  )}

                  <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Web Name (Title) *</label>
                      <input
                        type="text"
                        required
                        value={newWebName}
                        onChange={(e) => setNewWebName(e.target.value)}
                        placeholder="e.g. Elegant Romantic Birthday Web"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Live Web Target URL *</label>
                      <input
                        type="url"
                        required
                        value={newWebUrl}
                        onChange={(e) => setNewWebUrl(e.target.value)}
                        placeholder="https://all-sub-websites.onrender.com/fest/womensday"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Cover Image Cloudinary URL</label>
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Temp Price (₹)</label>
                        <input
                          type="number"
                          value={newTempPrice}
                          onChange={(e) => setNewTempPrice(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Perm Price (₹)</label>
                        <input
                          type="number"
                          value={newPermPrice}
                          onChange={(e) => setNewPermPrice(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Photos Needed</label>
                        <input
                          type="number"
                          value={newImageNeeded}
                          onChange={(e) => setNewImageNeeded(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Priority Order</label>
                        <input
                          type="number"
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    {/* Multi Category Checkboxes */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">
                        Category Tags (Reference Project Categories):
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded-xl border border-slate-700">
                        {CATEGORY_OPTIONS.map((cat) => {
                          const isSel = selectedNewCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategorySelection(cat, false)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                isSel
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Template description..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={templateSubmitLoading}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-3 rounded-xl transition cursor-pointer"
                    >
                      {templateSubmitLoading ? 'Saving Template...' : '+ Add Template to Live Catalog'}
                    </button>
                  </form>
                </div>

                {/* Right Side: Existing Templates List with Edit & Delete Controls */}
                <div className="lg:col-span-7 bg-slate-800 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
                  <h2 className="font-bold text-white text-base border-b border-slate-700 pb-3">
                    Active Catalog Templates ({templates.length})
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templates.map((t) => (
                      <div
                        key={t.id || t._id}
                        className="bg-slate-900 p-3.5 rounded-2xl border border-slate-700/80 flex flex-col justify-between"
                      >
                        <div className="flex gap-3">
                          <img
                            src={t.image || t.imageUrl?.url}
                            alt=""
                            className="w-16 h-16 object-contain rounded-xl bg-slate-800 p-1 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <p className="font-bold text-white text-xs truncate">{t.title || t.webName}</p>
                            <p className="text-[11px] text-amber-400 font-bold mt-0.5">
                              {t.price === 0 ? 'FREE (Temp)' : `₹${t.price} (Temp)`} • ₹{t.originalPrice || 399} (Perm)
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Photos Needed: {t.imageNeeded || 5}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(t.occasions || t.tags || []).slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <a
                              href={t.previewUrl || t.webUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-300 hover:underline flex items-center gap-1"
                            >
                              <span>Preview</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => handleStartEditTemplate(t)}
                              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteTemplate(t.id || t._id)}
                            className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: USER FEEDBACKS & SUGGESTIONS */}
            {activeTab === 'feedback' && (
              <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 overflow-hidden shadow-xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                  <div>
                    <h2 className="font-bold text-white text-lg flex items-center gap-2">
                      <span>💬 User Feedbacks & Suggestions</span>
                      <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-0.5 rounded-full border border-rose-500/30">
                        {feedbacks.length} Submissions
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review feature requests, ratings, and feedback submitted by users.
                    </p>
                  </div>
                </div>

                {feedbacks.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm bg-slate-900/50 rounded-2xl border border-slate-700/50">
                    No feedback submissions received yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedbacks.map((item) => (
                      <div
                        key={item._id}
                        className="bg-slate-900 p-5 rounded-2xl border border-slate-700/80 space-y-3 relative group hover:border-amber-400/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              {item.name || 'Anonymous User'}
                            </h4>
                            {item.email && (
                              <p className="text-xs text-slate-400 mt-0.5">{item.email}</p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                              {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                          "{item.suggestion}"
                        </p>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleDeleteFeedback(item._id)}
                            className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Feedback</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative max-w-xl w-full bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingTemplate(null)}
              className="absolute right-4 top-4 bg-slate-800 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Edit Template: {editingTemplate.title || editingTemplate.webName}</h3>
            </div>

            <form onSubmit={handleSaveEditTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Web Name (Title) *</label>
                <input
                  type="text"
                  required
                  value={editWebName}
                  onChange={(e) => setEditWebName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live Web Target URL *</label>
                <input
                  type="url"
                  required
                  value={editWebUrl}
                  onChange={(e) => setEditWebUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Temp Price (₹)</label>
                  <input
                    type="number"
                    value={editTempPrice}
                    onChange={(e) => setEditTempPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Perm Price (₹)</label>
                  <input
                    type="number"
                    value={editPermPrice}
                    onChange={(e) => setEditPermPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Photos Needed</label>
                  <input
                    type="number"
                    value={editImageNeeded}
                    onChange={(e) => setEditImageNeeded(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority Order</label>
                  <input
                    type="number"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Category Tags:
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-800 rounded-xl border border-slate-700 max-h-32 overflow-y-auto">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSel = selectedEditCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategorySelection(cat, true)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isSel
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={templateSubmitLoading}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl cursor-pointer"
                >
                  {templateSubmitLoading ? 'Saving...' : 'Save Template Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Screenshot Proof Fullscreen Viewer Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative max-w-xl w-full bg-slate-900 p-4 rounded-3xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="absolute right-4 top-4 bg-slate-800 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-white mb-3">UPI Payment Screenshot Proof</h3>
            <div className="max-h-[75vh] overflow-y-auto rounded-2xl border border-slate-800">
              <img src={selectedProofUrl} alt="Payment Proof" className="w-full h-auto object-contain" />
            </div>
            <div className="mt-4 text-center">
              <a
                href={selectedProofUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl"
              >
                <span>Open Full Original Image</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
