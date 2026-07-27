import React from 'react';
import { Globe, Music, Sparkles, Share2, ShieldCheck, Zap } from 'lucide-react';

export const WhyVishLink: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Instant Link Delivery',
      sub: 'Zero waiting time'
    },
    {
      icon: Music,
      title: 'Music & Cake FX',
      sub: 'Interactive FX'
    },
    {
      icon: Sparkles,
      title: 'Custom Photos',
      sub: 'Personalized'
    },
    {
      icon: Share2,
      title: '1-Click Share',
      sub: 'WhatsApp & Insta'
    },
    {
      icon: ShieldCheck,
      title: 'Lifetime Validity',
      sub: 'Forever Access'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Banner Box */}
        <div className="bg-[#fff8f5] border border-orange-100/60 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          
          {/* Left Feature Pillars */}
          <div className="flex-1 w-full">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center lg:text-left">
              Why Choose VishLink Digital Wishing Websites?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center text-center">
              {benefits.map((b, idx) => {
                const IconComponent = b.icon;
                return (
                  <div key={idx} className="flex flex-col items-center relative px-2">
                    
                    {/* Vertical dashed separator line */}
                    {idx < benefits.length - 1 && (
                      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-12 border-r border-dashed border-rose-200" />
                    )}

                    <div className="w-12 h-12 rounded-xl bg-white text-[#e15b70] border border-rose-100 flex items-center justify-center mb-3 shadow-xs">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {b.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {b.sub}
                    </p>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#0d1222] to-[#1a233d] text-white space-y-3 shadow-md border border-slate-700 text-center">
              <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                <Globe className="w-3 h-3" /> Digital Wishing Platform
              </span>
              <p className="font-serif text-lg font-bold">10,000+ Happy Wishes Created</p>
              <p className="text-[11px] text-slate-300">
                No physical courier delays or broken items. Send heartwarming digital memories across the globe instantly.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
