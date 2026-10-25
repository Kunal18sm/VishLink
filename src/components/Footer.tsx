import React from 'react';
import { Sparkles, Instagram, ShieldCheck, Mail, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection, onNavigateToPage }) => {
  return (
    <footer className="bg-[#090d18] text-slate-400 text-xs pt-12 pb-6 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800/90">
          
          {/* Brand & Contact Col */}
          <div className="lg:col-span-1 space-y-4">
            <button
              onClick={() => onNavigateToPage('home')}
              className="flex items-center gap-2 cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-[#e15b70] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight group-hover:text-[#e15b70] transition-colors">
                VishLink
              </span>
            </button>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Personalized wishing website links with 3D cake animations, custom songs & photo memories.
            </p>

            {/* Support Email Pill */}
            <div className="pt-1">
              <a
                href="mailto:wishlink1806@gmail.com"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 transition group"
                title="Send email to support"
              >
                <Mail className="w-3.5 h-3.5 text-[#e15b70] group-hover:scale-110 transition-transform" />
                <span className="font-mono">wishlink1806@gmail.com</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/vish_link18/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#e15b70] text-slate-300 hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@vish_link18</span>
              </a>
            </div>
          </div>

          {/* Column 2: Wish Templates */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Wish Templates</h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => { onNavigateToPage('home'); onNavigateToSection('templates'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  3D Birthday Cake Links
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigateToPage('home'); onNavigateToSection('occasions'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Couple Love Story Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigateToPage('home'); onNavigateToSection('templates'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Runaway Proposal Pages
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigateToPage('home'); onNavigateToSection('templates'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  BFF Meme & Roast Links
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigateToPage('home'); onNavigateToSection('categories'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Festive Celebrations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => { onNavigateToPage('home'); onNavigateToSection('how-it-works'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToPage('profile')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Purchased Links
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToPage('validity')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Link Validity Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToPage('faqs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  WhatsApp Sharing Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Help & Support</h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigateToPage('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About VishLink
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToPage('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Customer Support Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToPage('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms & Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToPage('faqs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FAQs & Search Topics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Payment Methods & Trust */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Secure Payments</h3>
            
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="bg-slate-800 text-sky-300 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/60">
                Razorpay
              </span>
              <span className="bg-slate-800 text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/60">
                UPI / GPay / Paytm
              </span>
              <span className="bg-slate-800 text-slate-300 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/60">
                Cards & NetBanking
              </span>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-slate-300 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Digital Delivery & 100% Encrypted</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Contact */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 VishLink. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Support:</span>
            <a
              href="mailto:wishlink1806@gmail.com"
              className="text-slate-400 hover:text-white font-mono transition"
            >
              wishlink1806@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
