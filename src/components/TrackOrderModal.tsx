import React, { useState } from 'react';
import { X, Search, Globe, Link as LinkIcon, Share2, Check, Copy, Sparkles, ExternalLink } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialOrderId || '');
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const mockFoundLink = {
    id: query || 'VL-892410',
    title: '3D Royal Birthday Celebration Website',
    url: `https://vishlink.app/wish/${(query || 'priya-birthday').toLowerCase()}-2026`,
    receiver: 'Priya Sharma',
    sender: 'Kunal Vishu',
    status: 'Active & Live Forever',
    createdDate: '24 Oct 2025'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearched(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockFoundLink.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `🎉 Hey ${mockFoundLink.receiver}! View your special birthday wishing website here: ${mockFoundLink.url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">Find My Wishing Link</h2>
              <p className="text-xs text-slate-500">Search by Phone Number or Order ID</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Enter Order ID or Mobile Number
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. VL-892410 or 9876543210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#e15b70]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-[#0d1222] hover:bg-[#e15b70] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{mockFoundLink.title}</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {mockFoundLink.status}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-rose-200 flex items-center justify-between gap-2 text-xs font-mono font-bold text-slate-800">
              <span className="truncate">{mockFoundLink.url}</span>
              <button
                onClick={handleCopy}
                className="p-1 text-[#e15b70] hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-600">
              Created for <strong>{mockFoundLink.receiver}</strong> by {mockFoundLink.sender}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleWhatsAppShare}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={() => window.open(mockFoundLink.url, '_blank')}
                className="flex-1 bg-[#0d1222] hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
