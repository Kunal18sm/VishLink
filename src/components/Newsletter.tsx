import React, { useState } from 'react';
import { Gift, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <section className="bg-[#0d1222] text-white py-12 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Graphic & Text */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f88195] items-center justify-center text-white shrink-0 shadow-lg">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Stay Inspired. Get Gift Ideas.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Subscribe to get special offers, gifting ideas and more.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-auto">
            {isSubscribed ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-5 py-3 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Check your inbox for exclusive vouchers.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full md:w-[420px]">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-slate-900 placeholder-slate-400 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e15b70]"
                />
                <button
                  type="submit"
                  className="bg-[#e15b70] hover:bg-[#c94358] text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
