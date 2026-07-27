import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, ArrowLeft, RefreshCw, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

interface Message {
  id: string;
  senderRole: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface AiChatPageProps {
  onBack: () => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderRole: 'bot',
      text: 'Namaste! Main VishLink AI Assistant hoon. VishLink templates, photo limits, link creation ya pricing ke bare me kuch bhi poochhein! 😊',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'VishLink kya hai?',
    'Maximum kitni images upload ho sakti hain?',
    'Kaise customize karein?',
    'Permanent vs Temporary link me kya farak hai?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderRole: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        senderRole: m.senderRole,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: history,
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderRole: 'bot',
        text: data.reply || 'Mujhe samajh nahi aaya. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          senderRole: 'bot',
          text: 'Network issue ya server busy hai. Please try again after a few seconds!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 py-6 sm:py-10 px-3 sm:px-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col min-h-[80vh]">
        {/* Header - Spacious, clean responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer shrink-0"
              title="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] text-white shadow-md shrink-0">
              <Bot className="h-6 w-6" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                  VishLink AI Assistant
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live AI
                </span>
              </div>
              <p className="text-xs text-slate-300">Fast 24/7 instant support for wishing websites</p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: Date.now().toString(),
                  senderRole: 'bot',
                  text: 'Chat history cleared. How can I help you today?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="self-end sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Clear Chat
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-rose-50/60 border-b border-rose-100 p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <HelpCircle className="h-3.5 w-3.5 text-[#e15b70]" /> Quick Chips:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap rounded-xl border border-rose-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#e15b70] shadow-2xs hover:bg-[#e15b70] hover:text-white transition-all cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Log Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 min-h-[380px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.senderRole === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs ${
                  msg.senderRole === 'user'
                    ? 'bg-slate-900'
                    : 'bg-gradient-to-tr from-[#e15b70] to-[#f48a9b]'
                }`}
              >
                {msg.senderRole === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
                  msg.senderRole === 'user'
                    ? 'bg-gradient-to-r from-[#e15b70] to-[#d4485e] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                <div
                  className={`mt-2 text-[10px] font-medium ${
                    msg.senderRole === 'user' ? 'text-rose-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] text-white shadow-xs">
                <Bot className="h-5 w-5 animate-spin" />
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#e15b70] animate-pulse" /> VishLink AI is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about templates, photo upload limits, or payment..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm focus:border-[#e15b70] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-100"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#e15b70] to-[#d4485e] text-white shadow-md hover:opacity-95 disabled:opacity-40 transition cursor-pointer shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <div className="mt-2.5 flex items-center justify-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure AI Chat
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Powered by Gemini AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
