import React, { useState } from 'react';
import { MessageSquare, Star, CheckCircle2, Send, Heart } from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous User',
          email: email.trim(),
          rating,
          suggestion: suggestion.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSuggestion('');
        setTimeout(() => setSubmitted(false), 6000);
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#0d1222] text-white py-12 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Header & Graphic */}
          <div className="lg:col-span-5 space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3.5 py-1 rounded-full border border-rose-500/30">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              We Value Your Opinion
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Feedback & Suggestions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              Have an idea for a new wishing template or feature? Tell us how we can make VishLink even better for your celebrations!
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-1 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-115 cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-amber-300 font-bold ml-2">
                {rating}/5 Stars
              </span>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-white text-base">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs text-emerald-200">
                  Your suggestion has been submitted successfully. We review every response to improve VishLink.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#e15b70]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#e15b70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Feedback / Suggestion *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Share your experience, feature requests, or new template ideas..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#e15b70]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#e15b70] to-[#d4485e] hover:from-[#c94358] hover:to-[#be3b50] text-white font-extrabold py-3 px-6 rounded-xl shadow-md transition cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting Feedback...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Feedback & Suggestion</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
