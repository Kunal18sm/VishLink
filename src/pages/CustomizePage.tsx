import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Check,
  Upload,
  Image as ImageIcon,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Share2,
  Trash2,
  AlertCircle,
  QrCode,
  Gift,
  Play,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { TemplateItem, PurchasedOrder } from '../types';

interface CustomizePageProps {
  template: TemplateItem & { imageNeeded?: number };
  onBack: () => void;
  onBuyNow: (purchasedOrder: PurchasedOrder) => void;
  onExploreFreeTemplates?: () => void;
}

export const CustomizePage: React.FC<CustomizePageProps> = ({
  template,
  onBack,
  onBuyNow,
  onExploreFreeTemplates,
}) => {
  // Empty default names per user instruction (only specialMessage is pre-filled)
  const [receiverName, setReceiverName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [specialMessage, setSpecialMessage] = useState(
    'Wishing you a day filled with endless love, laughter, and golden memories!'
  );
  const [themeColor, setThemeColor] = useState('Rose Pink');
  const [musicTrack, setMusicTrack] = useState('Happy Birthday LoFi Remix');
  const [isTemporary, setIsTemporary] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Required photos count for this template from database
  const requiredPhotosCount =
    typeof template.imageNeeded === 'number' ? template.imageNeeded : 5;

  // Permanent price calculation
  const permanentPrice = template.originalPrice && template.originalPrice > template.price
    ? template.originalPrice
    : template.price + 200;

  // Effective price depending on temporary vs permanent plan selection
  const totalPrice = isTemporary ? template.price : permanentPrice;
  const isFreePlan = isTemporary && template.price === 0;

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).slice(0, requiredPhotosCount);
      setSelectedFiles((prev) => [...prev, ...filesArr].slice(0, requiredPhotosCount));

      filesArr.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setFilePreviews((prev) =>
              [...prev, ev.target!.result as string].slice(0, requiredPhotosCount)
            );
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenLivePreview = () => {
    const url =
      template.previewUrl ||
      `https://all-sub-websites.onrender.com/wish/${template.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict Validations
    if (!receiverName.trim()) {
      setErrorMsg("Kripya Recipient's Name (To) zaroor bharein.");
      return;
    }

    if (!senderName.trim()) {
      setErrorMsg("Kripya Your Name (From) zaroor bharein.");
      return;
    }

    if (!specialMessage.trim()) {
      setErrorMsg('Kripya Personalized Wish Message zaroor bharein.');
      return;
    }

    if (requiredPhotosCount > 0 && selectedFiles.length < requiredPhotosCount) {
      setErrorMsg(
        `Is template ke liye exactly ${requiredPhotosCount} photo(s) upload karna zaroori hai. (Aapne ${selectedFiles.length} photo upload ki hai)`
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('templateId', template.id);
      formData.append('webName', template.title);
      formData.append('senderName', senderName.trim());
      formData.append('receiverName', receiverName.trim());
      formData.append('specialMessage', specialMessage.trim());
      formData.append('musicTrack', musicTrack);
      formData.append('themeColor', themeColor);
      formData.append('isTemporary', isTemporary ? 'true' : 'false');
      formData.append('purchaseMode', 'upi');
      formData.append('totalPrice', String(totalPrice));

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (paymentProofFile && totalPrice > 0) {
        formData.append('paymentProof', paymentProofFile);
      }

      const token = localStorage.getItem('vishlink_token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Purchase order failed');
      }

      // Trigger parent callback
      const purchasedOrder: PurchasedOrder = {
        id: data.order.id,
        wishingSlug: data.order.wishingSlug,
        wishingUrl: data.order.wishingUrl,
        template,
        senderName: data.order.senderName,
        receiverName: data.order.receiverName,
        specialMessage: data.order.specialMessage,
        uploadedImages: data.order.uploadedImages,
        themeColor: data.order.themeColor,
        totalPrice: data.order.totalPrice,
        purchaseDate: data.order.purchaseDate,
        status: data.order.status,
        musicTrack: data.order.musicTrack,
      };

      onBuyNow(purchasedOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while generating wish link');
    } finally {
      setLoading(false);
    }
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
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Customize {template.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Fill in the required details below to generate your custom interactive wishing website link.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-0">
          {/* Left Side: Live Preview Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#fff7f8] via-[#fff1f3] to-[#ffebee] p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4 lg:sticky lg:top-24 z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-white text-[#e15b70] text-xs font-bold px-3 py-1 rounded-full shadow-2xs border border-rose-100">
                <Heart className="w-3.5 h-3.5 fill-[#e15b70]" />
                Selected Template Preview
              </span>
            </div>

            {/* Template Cover Image + Play Icon Live Demo Overlay */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-rose-100 p-1 bg-slate-900/5">
              <div
                onClick={handleOpenLivePreview}
                className="relative aspect-[16/11] flex items-center justify-center overflow-hidden rounded-xl cursor-pointer group"
                title="Click to view live template preview link"
              >
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25 group-hover:bg-slate-950/40 transition-colors">
                  <div className="flex items-center gap-2 bg-white/95 text-slate-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-lg border border-white group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-[#e15b70] text-[#e15b70]" />
                    <span>Live Demo Preview</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white p-4 rounded-2xl border border-rose-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-700">Link Validity & Plan:</p>
                <p className="text-slate-500 text-[11px]">
                  {isTemporary ? 'Temporary (3 Months)' : 'Permanent (Lifetime Access)'}
                </p>
              </div>
              <div className="text-right">
                {totalPrice === 0 ? (
                  <span className="text-xl font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 inline-block">
                    FREE
                  </span>
                ) : (
                  <span className="text-xl font-extrabold text-[#e15b70]">
                    ₹{totalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Form Inputs */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative z-0">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Section 1: Names */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e15b70]" />
                  1. Recipient & Sender Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recipient's Name (To) *
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Enter recipient's name"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#e15b70] focus:outline-hidden focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name (From) *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#e15b70] focus:outline-hidden focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Special Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personalized Wish Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={specialMessage}
                  onChange={(e) => setSpecialMessage(e.target.value)}
                  placeholder="Write your emotional message for the surprise site..."
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-sm focus:border-[#e15b70] focus:outline-hidden focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Section 3: Photos Upload - ONLY IF requiredPhotosCount > 0 */}
              {requiredPhotosCount > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#e15b70]" />
                    2. Upload Surprise Photos ({requiredPhotosCount} photo{requiredPhotosCount > 1 ? 's' : ''} required *)
                  </h3>
                  <div className="relative border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50/50 p-6 text-center hover:bg-rose-50 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleFiles}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="mx-auto h-8 w-8 text-[#e15b70] mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Click or drag & drop {requiredPhotosCount} photo{requiredPhotosCount > 1 ? 's' : ''}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WebP (Uploaded directly to Cloudinary)
                    </p>
                  </div>

                  {/* Uploaded Photos Thumbnails rendered directly below Upload button */}
                  {filePreviews.length > 0 && (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        Uploaded Photos ({filePreviews.length}/{requiredPhotosCount}):
                      </p>
                      <div className="flex gap-2.5 overflow-x-auto pb-1">
                        {filePreviews.map((img, i) => (
                          <div
                            key={i}
                            className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 border-rose-200 shadow-2xs group"
                          >
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(i)}
                              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-red-500 transition"
                              title="Remove photo"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 4: Validity & Payment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#e15b70]" />
                  {requiredPhotosCount > 0 ? '3' : '2'}. Select Plan & Validity
                </h3>

                {/* Validity Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTemporary(true)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      isTemporary
                        ? 'border-[#e15b70] bg-rose-50/60 ring-2 ring-rose-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">Temporary Link</p>
                    <p className="text-[11px] text-slate-500">
                      Valid for 3 Months ({template.price === 0 ? 'FREE' : `₹${template.price}`})
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTemporary(false)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      !isTemporary
                        ? 'border-[#e15b70] bg-rose-50/60 ring-2 ring-rose-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">Permanent Link</p>
                    <p className="text-[11px] text-slate-500">
                      Lifetime Access (₹{permanentPrice})
                    </p>
                  </button>
                </div>

                {/* Payment Section (Rendered ONLY if totalPrice > 0) */}
                {totalPrice > 0 ? (
                  <div className="rounded-2xl border border-rose-200 bg-slate-50/80 p-5 text-center space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-900">
                        Pay ₹{totalPrice} via UPI App or QR Code:
                      </p>
                      <a
                        href={`upi://pay?pa=yash.97184@ybl&pn=VishLink&am=${totalPrice}&cu=INR&tn=VishLink%20Purchase`}
                        className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md transition cursor-pointer"
                      >
                        <CreditCard className="w-4.5 h-4.5" />
                        <span>👉 Click to Pay ₹{totalPrice} via UPI (GPay / PhonePe / Paytm)</span>
                      </a>
                    </div>

                    <div className="pt-2">
                      <img
                        src="https://res.cloudinary.com/dcw90tnk1/image/upload/v1768291694/wishLink_dev/gedbuqpryaj7oqo8c3v1.png"
                        alt="UPI QR Code"
                        className="mx-auto h-36 w-36 rounded-xl border border-slate-200 shadow-2xs"
                      />
                    </div>

                    <div className="pt-2 text-left bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Upload Payment Screenshot
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPaymentProofFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-2 file:rounded-xl file:border-0 file:bg-rose-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#e15b70]"
                      />
                      {paymentProofFile && (
                        <p className="text-xs font-semibold text-emerald-600 mt-1.5">
                          ✓ Screenshot selected: {paymentProofFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* FREE TEMPLATE BANNER (NO PAYMENT DETAILS AT ALL!) */
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-center">
                    <p className="text-xs font-extrabold text-emerald-700 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      🎉 Free Template Selected! No Payment Required.
                    </p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">
                      Your 3-Month Temporary Wish Link will be generated 100% free of cost instantly.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e15b70] to-[#d4485e] py-4 text-sm font-extrabold text-white shadow-lg shadow-rose-200 hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <span>Processing & Generating Link...</span>
                ) : totalPrice === 0 ? (
                  <>
                    <Sparkles className="h-5 w-5" /> Click to Create Free Wish Link Now
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" /> Click to Pay & Create Wish Link Now
                  </>
                )}
              </button>

              {/* Try Free Templates Option */}
              {onExploreFreeTemplates && (
                <div className="pt-4 text-center border-t border-slate-100 space-y-2">
                  <p className="text-xs text-slate-500">Want to test VishLink first without paying?</p>
                  <button
                    type="button"
                    onClick={onExploreFreeTemplates}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#e15b70] hover:text-[#c94358] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Try Free Templates First</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
