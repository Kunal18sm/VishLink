import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Clock, MapPin, Send, CheckCircle2, Instagram, ExternalLink } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

const INSTAGRAM_URL = 'https://www.instagram.com/vish_link18/';

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

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
            24/7 Support Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Contact VishLink Support
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Need help with your wishing link order, customization, or payment? Our dedicated customer care team is here to help!
          </p>
        </div>

        {/* Instagram DM Banner */}
        <div className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-[2px] rounded-3xl shadow-lg">
          <div className="bg-white rounded-[22px] p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white shrink-0 shadow-md">
              <Instagram className="w-7 h-7" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                Want a Custom Wishing Website?
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 leading-relaxed">
                For custom template requests, special designs, or personalized websites — DM us directly on Instagram! We respond fast.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  @vish_link18
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">⚡ Fast Reply</span>
              </div>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              <span>DM on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-4">

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Get In Touch
              </h3>

              <div className="space-y-4 text-xs">
                {/* Instagram DM */}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-[#e15b70] transition-colors">
                      Instagram DM
                    </span>
                    <span className="text-purple-600 font-semibold">@vish_link18</span>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">⚡ Fastest Response Channel</p>
                  </div>
                </a>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Email Us</span>
                    <span className="text-slate-500">support@vishlink.app</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Responses within 24 hours</p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Support Hours</span>
                    <span className="text-slate-500">Monday – Sunday: 9:00 AM – 10:00 PM IST</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#e15b70] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Headquarters</span>
                    <span className="text-slate-500">VishLink Digital Studios, India</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">

            {isSubmitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto">
                  Thank you for reaching out, {formData.name}! Our team will get back to you via Email or Instagram DM shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#0d1222] hover:bg-[#e15b70] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Send Us A Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kunal Sharma"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-[#e15b70]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. kunal@example.com"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-[#e15b70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-[#e15b70]"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Custom Website Request">Custom Website Request</option>
                    <option value="Link Order Assistance">Link Order Assistance</option>
                    <option value="Payment Inquiry">Payment Inquiry</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how we can help you..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#e15b70]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0d1222] hover:bg-[#e15b70] text-white font-bold text-xs py-3.5 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
