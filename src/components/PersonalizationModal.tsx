import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Check, Heart, Upload, Image as ImageIcon, CreditCard, Music } from 'lucide-react';
import { TemplateItem, CartItem, PurchasedOrder } from '../types';

interface PersonalizationModalProps {
  template: TemplateItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onBuyNow: (purchasedOrder: PurchasedOrder) => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  template,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!template) return null;

  const [receiverName, setReceiverName] = useState('Priya');
  const [senderName, setSenderName] = useState('Vishu');
  const [specialMessage, setSpecialMessage] = useState('Wishing you a day filled with endless love, laughter, and golden memories!');
  const [themeColor, setThemeColor] = useState('Rose Pink');
  const [musicTrack, setMusicTrack] = useState('Happy Birthday LoFi Remix');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300'
  ]);
  const [quantity, setQuantity] = useState(1);

  const themeColors = [
    { name: 'Rose Pink', color: '#e15b70' },
    { name: 'Satin Gold', color: '#d4af37' },
    { name: 'Royal Navy', color: '#0d1222' },
    { name: 'Neon Purple', color: '#7c3aed' },
    { name: 'Emerald Green', color: '#065f46' }
  ];

  const musicTracks = [
    'Happy Birthday LoFi Remix',
    'Romantic Acoustic Guitar',
    'Celebration Party Beats',
    'Gentle Piano Melody',
    'Uplifting Acoustic Vibe'
  ];

  const samplePhotos = [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedImages(prev => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generatedSlug = `${(receiverName || 'wishes').toLowerCase().replace(/\s+/g, '-')}-${template.occasions[0] || 'wish'}-2026`;

  const handleAddToCartSubmit = () => {
    onAddToCart({
      template,
      quantity: 1,
      customization: {
        recipientName: receiverName,
        senderName,
        message: specialMessage,
        themeColor,
        uploadedImages,
        musicTrack,
      }
    });
    onClose();
  };

  const handleDirectBuyNow = () => {
    const newOrder: PurchasedOrder = {
      id: `VL-${Math.floor(100000 + Math.random() * 900000)}`,
      wishingSlug: generatedSlug,
      wishingUrl: `https://vishlink.app/wish/${generatedSlug}`,
      template,
      senderName: senderName || 'Vishu',
      receiverName: receiverName || 'Priya',
      specialMessage: specialMessage || 'Best wishes!',
      uploadedImages,
      themeColor,
      totalPrice: template.price,
      purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active & Ready',
      musicTrack
    };

    onBuyNow(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] border border-slate-100">
        
        {/* Left Column: Live Visual Webpage Preview */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#fff7f8] via-[#fff1f3] to-[#ffebee] p-4 sm:p-5 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-rose-100 shrink-0 overflow-y-auto">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-white text-[#e15b70] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                Live Webpage Preview
              </span>
            </div>

            {/* Web Image Frame */}
            <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white group">
              <img
                src={template.image}
                alt={template.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Dynamic Overlay Ribbon & Text */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 rounded-xl backdrop-blur-md bg-white/95 shadow-md border border-rose-100 text-center transition-all">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Custom Web Page For</p>
                <p className="font-serif text-sm sm:text-base font-bold truncate" style={{ color: themeColors.find(c => c.name === themeColor)?.color || '#e15b70' }}>
                  {receiverName || 'Receiver Name'}
                </p>
                {senderName && (
                  <p className="text-[10px] text-slate-500 mt-0.5">Created with love by {senderName}</p>
                )}
              </div>
            </div>

            {/* Custom Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-rose-100 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#e15b70]" /> Web Photo Gallery ({uploadedImages.length}):
                </p>
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-md hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Customization Details Form */}
        <div className="w-full md:w-7/12 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#e15b70] uppercase tracking-wider">Wishing Link Customization</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">{template.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 py-3">
              
              {/* 1. Sender Name & Receiver Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Sender Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Vishu"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Receiver's Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g., Priya"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
                  />
                </div>
              </div>

              {/* 2. Special Message */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Special Wishing Message / Love Note
                </label>
                <textarea
                  rows={2}
                  value={specialMessage}
                  onChange={(e) => setSpecialMessage(e.target.value)}
                  placeholder="Write your heartfelt message that appears on the wishing webpage..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
                />
              </div>

              {/* 3. Image Upload Section */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Upload Gallery Photos
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-[#e15b70] border border-dashed border-rose-300 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[10px] text-slate-400">or sample:</span>

                  <div className="flex items-center gap-1.5">
                    {samplePhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUploadedImages(prev => [...prev, p])}
                        className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:border-[#e15b70] transition-colors cursor-pointer"
                      >
                        <img src={p} alt="Sample" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Background Song Select */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-[#e15b70]" /> Background Song
                </label>
                <select
                  value={musicTrack}
                  onChange={(e) => setMusicTrack(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#e15b70]"
                >
                  {musicTracks.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* 5. Theme Color Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Webpage Color Theme</label>
                <div className="flex items-center gap-2">
                  {themeColors.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setThemeColor(r.name)}
                      title={r.name}
                      type="button"
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                        themeColor === r.name ? 'border-[#0d1222] scale-110 shadow-2xs' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: r.color }}
                    >
                      {themeColor === r.name && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-medium ml-2">{themeColor}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Purchase Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Link Price</span>
              <span className="font-serif text-2xl font-bold text-slate-900">₹{template.price}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddToCartSubmit}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-[#e15b70] font-semibold text-xs px-4 py-3 rounded-xl border border-rose-200 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleDirectBuyNow}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy & Generate Link</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
