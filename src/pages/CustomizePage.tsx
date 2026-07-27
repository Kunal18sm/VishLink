import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, Upload, Image as ImageIcon, CreditCard, Link as LinkIcon, Music, ArrowLeft, Share2, CheckCircle2 } from 'lucide-react';
import { TemplateItem, CartItem, PurchasedOrder } from '../types';

interface CustomizePageProps {
  template: TemplateItem;
  onBack: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onBuyNow: (purchasedOrder: PurchasedOrder) => void;
}

export const CustomizePage: React.FC<CustomizePageProps> = ({
  template,
  onBack,
  onAddToCart,
  onBuyNow,
}) => {
  const [receiverName, setReceiverName] = useState('Priya');
  const [senderName, setSenderName] = useState('Vishu');
  const [specialMessage, setSpecialMessage] = useState('Wishing you a day filled with endless love, laughter, and golden memories!');
  const [themeColor, setThemeColor] = useState('Rose Pink');
  const [musicTrack, setMusicTrack] = useState('Happy Birthday LoFi Remix');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300'
  ]);

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
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold mb-6 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <span className="text-[#e15b70] text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Personalize & Generate Wishing Webpage
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Customize {template.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Fill in the details below to generate your custom interactive wishing website link.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Live Preview Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#fff7f8] via-[#fff1f3] to-[#ffebee] p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4 sticky top-24">
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-white text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                Live Webpage Preview
              </span>
              <span className="text-xs text-slate-500 font-medium">Auto-Updates</span>
            </div>

            {/* Generated Link Bar */}
            <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-rose-200 text-xs text-slate-700 flex items-center gap-2 shadow-2xs">
              <LinkIcon className="w-4 h-4 text-[#e15b70] shrink-0" />
              <span className="font-mono text-xs font-bold truncate text-slate-800">
                vishlink.app/wish/{generatedSlug}
              </span>
            </div>

            {/* Main Visual Image Frame */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white group">
              <img
                src={template.image}
                alt={template.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-white/95 shadow-md border border-rose-100 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Web Page For</p>
                <p className="font-serif text-lg font-bold truncate" style={{ color: themeColors.find(c => c.name === themeColor)?.color || '#e15b70' }}>
                  {receiverName || 'Receiver Name'}
                </p>
                {senderName && (
                  <p className="text-[11px] text-slate-500 mt-0.5">Created with love by {senderName}</p>
                )}
              </div>
            </div>

            {/* Custom Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-rose-100 space-y-2">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4 text-[#e15b70]" /> Gallery Photos ({uploadedImages.length}):
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                      <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-md hover:bg-rose-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Features List */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-rose-100 space-y-2">
              <p className="text-xs font-bold text-slate-900">Included In This Wishing Webpage:</p>
              <ul className="text-xs text-slate-600 space-y-1.5">
                {template.includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e15b70] shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Side: Customization Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-slate-900">Enter Personal Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">These details will be rendered directly on your customized web link.</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Sender Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Vishu"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Receiver's Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g., Priya"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
                  />
                </div>
              </div>

              {/* Special Message */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Special Wishing Message / Note
                </label>
                <textarea
                  rows={3}
                  value={specialMessage}
                  onChange={(e) => setSpecialMessage(e.target.value)}
                  placeholder="Write your heartfelt message that appears on the wishing webpage..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#e15b70] focus:ring-1 focus:ring-[#e15b70]"
                />
              </div>

              {/* Upload Gallery Photos */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Upload Gallery Photos
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-[#e15b70] border border-dashed border-rose-300 rounded-xl px-4 py-3 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-400">or pick sample:</span>

                  <div className="flex items-center gap-2">
                    {samplePhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUploadedImages(prev => [...prev, p])}
                        className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 hover:border-[#e15b70] transition-colors cursor-pointer"
                      >
                        <img src={p} alt="Sample" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Music Track */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-[#e15b70]" /> Background Song Track
                </label>
                <select
                  value={musicTrack}
                  onChange={(e) => setMusicTrack(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-[#e15b70]"
                >
                  {musicTracks.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Theme Color Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Select Theme Accent Color</label>
                <div className="flex items-center gap-3">
                  {themeColors.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setThemeColor(r.name)}
                      title={r.name}
                      type="button"
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                        themeColor === r.name ? 'border-[#0d1222] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: r.color }}
                    >
                      {themeColor === r.name && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                  <span className="text-xs text-slate-600 font-semibold ml-2">{themeColor}</span>
                </div>
              </div>

            </div>

            {/* Price & Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Link Price</span>
                <span className="font-serif text-3xl font-bold text-slate-900">₹{template.price}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddToCartSubmit}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-[#e15b70] font-bold text-xs px-5 py-3.5 rounded-xl border border-rose-200 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectBuyNow}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy & Generate Link</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
