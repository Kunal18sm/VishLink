import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#e15b70] text-xs font-bold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[#e15b70] text-xs font-bold uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100">
            Legal & Trust Guidelines
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Last Updated: January 2026. Please read our operational policies regarding wishing web link creation, data protection, and lifetime validity.
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#e15b70]" />
              1. Web Link Service Terms
            </h2>
            <p>
              VishLink provides digital, interactive personalized wishing website links for personal non-commercial celebrations such as birthdays, anniversaries, proposals, and festivals. Once created, a unique URL (e.g. <code>vishlink.app/wish/recipient-name</code>) is issued for sharing via messaging platforms like WhatsApp, Email, or SMS.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#e15b70]" />
              2. Lifetime Link Validity Guarantee
            </h2>
            <p>
              All purchased digital wishing website links come with 100% Lifetime Link Validity. VishLink guarantees that your generated link will remain accessible on cloud servers without expiration, unless deleted by user request or flagged for policy violations.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#e15b70]" />
              3. Privacy & Media Content Rules
            </h2>
            <p>
              Photos, audio tracks, and custom notes uploaded to VishLink are strictly used to render your personalized wishing webpage. We do not sell, share, or index your personal photos on public search engines. You retain full ownership of your media.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#e15b70]" />
              4. Refunds & Instant Delivery Policy
            </h2>
            <p>
              Because digital wishing links are generated instantly upon purchase, refunds are generally processed in cases of duplicate transactions or link generation errors. If you experience any link issue, contact our 24/7 WhatsApp support at +91 98765 43210.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
