import React from 'react';
import { Sparkles, Facebook, Instagram, ShieldCheck, Globe, Link as LinkIcon } from 'lucide-react';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToPage: (page: string) => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection, onNavigateToPage, onOpenTrackOrder }) => {
  return (
    <footer className="bg-[#090d18] text-slate-400 text-xs pt-12 pb-6 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-1 space-y-4">
            <button
              onClick={() => onNavigateToPage('home')}
              className="flex items-center gap-2 cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e15b70] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight group-hover:text-[#e15b70] transition-colors">
                VishLink
              </span>
            </button>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Personalized Wishing Website Links for Birthdays, Love Stories & Celebrations.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#instagram" className="w-7 h-7 rounded-full bg-slate-800 hover:bg-[#e15b70] text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#facebook" className="w-7 h-7 rounded-full bg-slate-800 hover:bg-[#e15b70] text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Wish Web Templates */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Wish Templates</h3>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => { onNavigateToPage('home'); onNavigateToSection('templates'); }} className="hover:text-white transition-colors cursor-pointer">Birthday Cake Links</button></li>
              <li><button onClick={() => { onNavigateToPage('home'); onNavigateToSection('occasions'); }} className="hover:text-white transition-colors cursor-pointer">Couple Love Story Websites</button></li>
              <li><button onClick={() => { onNavigateToPage('home'); onNavigateToSection('templates'); }} className="hover:text-white transition-colors cursor-pointer">Runaway "No" Proposals</button></li>
              <li><button onClick={() => { onNavigateToPage('home'); onNavigateToSection('templates'); }} className="hover:text-white transition-colors cursor-pointer">BFF Meme & Roast Links</button></li>
              <li><button onClick={() => { onNavigateToPage('home'); onNavigateToSection('categories'); }} className="hover:text-white transition-colors cursor-pointer">Festive Greeting Webpages</button></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => { onNavigateToPage('home'); onNavigateToSection('how-it-works'); }} className="hover:text-white transition-colors cursor-pointer">How It Works</button></li>
              <li><button onClick={onOpenTrackOrder} className="hover:text-white transition-colors cursor-pointer">Find My Wishing Link</button></li>
              <li><button onClick={() => onNavigateToPage('faqs')} className="hover:text-white transition-colors cursor-pointer">WhatsApp Sharing Guide</button></li>
              <li><button onClick={() => onNavigateToPage('validity')} className="hover:text-white transition-colors cursor-pointer">Lifetime Link Validity</button></li>
            </ul>
          </div>

          {/* Column 4: Support Pages */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Support Pages</h3>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => onNavigateToPage('about')} className="hover:text-white transition-colors cursor-pointer">About VishLink</button></li>
              <li><button onClick={() => onNavigateToPage('contact')} className="hover:text-white transition-colors cursor-pointer">Customer Support</button></li>
              <li><button onClick={() => onNavigateToPage('terms')} className="hover:text-white transition-colors cursor-pointer">Terms & Privacy Policy</button></li>
              <li><button onClick={() => onNavigateToPage('faqs')} className="hover:text-white transition-colors cursor-pointer">FAQs & Help</button></li>
            </ul>
          </div>

          {/* Column 5: Payment Methods */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Instant Payments</h3>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-white text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded border border-slate-200">
                UPI / GPay
              </span>
              <span className="bg-white text-sky-600 font-extrabold text-[10px] px-2.5 py-1 rounded border border-slate-200">
                Paytm
              </span>
              <span className="bg-white text-blue-900 font-extrabold text-[10px] px-2.5 py-1 rounded border border-slate-200">
                Cards / Net Banking
              </span>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-slate-300 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Instant Digital Link Delivery</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="text-center pt-6 text-[11px] text-slate-500">
          © 2026 VishLink. All rights reserved. Personalized Wishing Webpages & Digital Links.
        </div>

      </div>
    </footer>
  );
};
