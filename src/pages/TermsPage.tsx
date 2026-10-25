import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Lock, MessageSquare, Mail, ExternalLink } from 'lucide-react';

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
            Terms & Information
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Terms of Service & Privacy
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Operational guidelines regarding wishing link generation, user data, and customer assistance.
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#e15b70]" />
              1. Digital Service Terms
            </h2>
            <p>
              VishLink provides digital, interactive personalized wishing website links for personal celebrations such as birthdays, anniversaries, proposals, and festivals. Once created, a unique URL (e.g. <code>vishlink.app/wish/recipient-name</code>) is issued for sharing via messaging platforms like WhatsApp or direct URL link.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#e15b70]" />
              2. Link Validity & Hosting
            </h2>
            <p>
              We provide hosting for your custom generated links. Temporary links are hosted for 3 months, whereas Permanent links are hosted for long-term access. We make reasonable efforts to keep links running smoothly on cloud servers, but links are provided as-is without legal guarantees or warranties of uninterrupted uptime.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#e15b70]" />
              3. Privacy & Media Content
            </h2>
            <p>
              Photos, audio selections, and custom text messages uploaded by users are strictly used to render the requested wishing webpage. Users are solely responsible for the content they upload. Uploading offensive, abusive, or copyright-infringing content is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#e15b70]" />
              4. Digital Delivery & Support Assistance
            </h2>
            <p>
              Wishing links are digital products generated immediately after customization. There is no automated refund policy. If you experience any technical problem with your link, text typo, or need an update, simply contact our support team. We will directly help you update or fix your wishing link.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#e15b70]" />
              5. Contact Support
            </h2>
            <p>
              For any help, link corrections, or inquiries, reach out to us directly through our official channels:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Official Email</span>
                <a href="mailto:wishlink1806@gmail.com" className="font-bold text-slate-900 text-sm hover:text-[#e15b70] transition">
                  wishlink1806@gmail.com
                </a>
              </div>
              <a
                href="https://www.instagram.com/vish_link18/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl font-bold hover:opacity-95 transition"
              >
                <span>Instagram @vish_link18</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
