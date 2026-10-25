import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { launchRazorpayCheckout } from '../utils/razorpay';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.template.price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (subtotal <= 0) return;
    setIsProcessingPayment(true);
    setCheckoutError(null);

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const amountInPaise = Math.round(subtotal * 100);

      await launchRazorpayCheckout({
        amountInPaise,
        currency: 'INR',
        name: 'VishLink Wishing Cart',
        description: `Payment for ${cartItems.length} Wishing Link(s)`,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          itemCount: String(cartItems.length),
        },
      });

      setIsOrderPlaced(true);
      setTimeout(() => {
        setIsOrderPlaced(false);
        onClearCart();
        onClose();
      }, 4000);
    } catch (err: any) {
      console.error('Cart checkout error:', err);
      if (err.message && !err.message.includes('closed by the user')) {
        setCheckoutError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e15b70]" />
            <h2 className="font-serif text-lg font-bold text-slate-900">Your Wishing Links Cart</h2>
            <span className="bg-rose-100 text-[#e15b70] text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        {isOrderPlaced ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Wishing Link Generated!</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Your custom 3D wishing website link is now live and ready to share! You can copy it or send directly on WhatsApp.
            </p>
            <div className="p-3 bg-rose-50 text-[#e15b70] text-xs font-bold rounded-xl border border-rose-100 font-mono">
              🔗 vishlink.app/wish/surprise-link
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#e15b70] flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="font-serif text-lg font-bold text-slate-800">Your cart is empty</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Explore our interactive 3D birthday & love story templates to create your custom web link.
            </p>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 relative group">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-100">
                  <img
                    src={item.template.image}
                    alt={item.template.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">{item.template.title}</h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.customization && (
                      <p className="text-[10px] text-[#e15b70] font-semibold mt-0.5">
                        For: {item.customization.recipientName} ({item.customization.themeColor} Theme)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Instant Digital Link
                    </span>

                    <span className="font-bold text-slate-900 text-xs">
                      ₹{item.template.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer */}
        {!isOrderPlaced && cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            {checkoutError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Digital Web Link Delivery</span>
              <span className="text-emerald-600 font-bold">FREE (Instant)</span>
            </div>

            <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-[#e15b70] font-serif text-xl">₹{subtotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessingPayment}
              className="w-full bg-[#0d1222] hover:bg-[#e15b70] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opening Razorpay Checkout...</span>
                </>
              ) : (
                <>
                  <span>Pay & Generate Wishing Links</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
