import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  Headphones,
  CheckCheck,
  Clock,
} from 'lucide-react';

interface Message {
  id: string;
  senderRole: 'user' | 'bot' | 'admin';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface AiChatPageProps {
  onBack: () => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ onBack }) => {
  const [chatMode, setChatMode] = useState<'bot' | 'admin'>('bot');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderRole: 'bot',
      text: 'Namaste! I am your VishLink AI Assistant. Feel free to ask about templates, photo upload limits, link creation, or pricing!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'What is VishLink?',
    'How many photos can I upload?',
    'How to customize templates?',
    'Difference between permanent and temporary links?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async (isInitial = false) => {
    try {
      const token = localStorage.getItem('vishlink_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/chat/history', { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isInitial && data.chatMode) {
          setChatMode(data.chatMode);
        }
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const formatted: Message[] = data.messages.map((m: any, idx: number) => ({
            id: m._id || String(idx),
            senderRole: m.senderRole || 'bot',
            text: m.text || '',
            timestamp: m.createdAt
              ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: m.status || 'read',
          }));
          setMessages(formatted);
        }
      }
    } catch (e) {
      console.warn('Fetch chat history error:', e);
    }
  };

  // Initial fetch and background polling for Live Admin responses
  useEffect(() => {
    fetchChatHistory(true);

    const interval = setInterval(() => {
      fetchChatHistory(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderRole: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);
    setTimeout(scrollToBottom, 50);

    try {
      const history = messages.map((m) => ({
        senderRole: m.senderRole,
        text: m.text,
      }));

      const token = localStorage.getItem('vishlink_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: query,
          conversationHistory: history,
          chatMode,
        }),
      });

      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        const formatted: Message[] = data.messages.map((m: any, idx: number) => ({
          id: m._id || String(idx),
          senderRole: m.senderRole || 'bot',
          text: m.text || '',
          timestamp: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status || 'read',
        }));
        setMessages(formatted);
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      if (chatMode === 'bot') {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            senderRole: 'bot',
            text: 'Network issue or server busy. Please try again in a few seconds!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ]);
        setTimeout(scrollToBottom, 50);
      }
    } finally {
      setLoading(false);
    }
  };

  // Completely separate AI Bot Chat messages vs Live Admin Support Chat messages
  // Also automatically filter out AI Bot messages older than 24 hours
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  const visibleMessages = messages.filter((m) => {
    // 1. Auto-expire AI Bot messages older than 24h
    if (m.senderRole === 'bot' && m.id && Number(m.id) && Number(m.id) < twentyFourHoursAgo) {
      return false;
    }

    if (chatMode === 'admin') {
      // Admin Mode: ONLY Admin replies and User messages (AI Bot messages are completely hidden)
      return m.senderRole === 'admin' || m.senderRole === 'user';
    } else {
      // AI Bot Mode: ONLY AI Bot replies and User messages (Admin replies & admin messages are completely hidden)
      return m.senderRole === 'bot' || m.senderRole === 'user';
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0f19] text-slate-100 overflow-hidden h-[100dvh] w-full">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-3.5 sm:p-4 shadow-md shrink-0 space-y-3 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer shrink-0"
              title="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] text-white shadow-md shrink-0">
              {chatMode === 'admin' ? <Headphones className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide">
                {chatMode === 'admin' ? 'VishLink Live Admin Support' : 'VishLink AI Assistant'}
              </h1>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs (AI Bot vs Live Admin Support) */}
        <div className="flex items-center p-1 bg-white/10 rounded-2xl border border-white/10 max-w-md mx-auto sm:mx-0">
          <button
            type="button"
            onClick={() => setChatMode('bot')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              chatMode === 'bot'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-[#e15b70]" />
            <span>AI Support Bot</span>
          </button>

          <button
            type="button"
            onClick={() => setChatMode('admin')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              chatMode === 'admin'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Chat with Admin</span>
          </button>
        </div>
      </div>

      {/* Quick Suggestion Chips (Only in Bot mode) */}
      {chatMode === 'bot' && (
        <div className="bg-rose-950/40 border-b border-rose-900/30 p-2.5 sm:p-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1 shrink-0">
              <HelpCircle className="h-3.5 w-3.5 text-[#e15b70]" /> Quick Chips:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap rounded-xl border border-rose-500/30 bg-slate-900 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-[#e15b70] hover:text-white transition-all cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Admin Mode Notice Banner */}
      {chatMode === 'admin' && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-2 text-center text-xs font-medium text-amber-300 flex items-center justify-center gap-2 shrink-0">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            You are chatting with VishLink Admin Support. Messages notify our admin team live. Replies typically arrive within 5–10 minutes.
          </span>
        </div>
      )}

      {/* Scrollable Messages Log Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60 min-h-0">
        {chatMode === 'admin' && visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Headphones className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">VishLink Live Admin Support</h3>
            <p className="text-xs max-w-sm text-slate-400 leading-relaxed">
              Type your message below to send it directly to our admin team. Replies typically arrive within 5–10 minutes.
            </p>
          </div>
        )}

        {visibleMessages.map((msg) => {
          const isUser = msg.senderRole === 'user';
          const isAdmin = msg.senderRole === 'admin';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs ${
                  isUser
                    ? 'bg-slate-800 border border-slate-700'
                    : isAdmin
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-700'
                    : 'bg-gradient-to-tr from-[#e15b70] to-[#f48a9b]'
                }`}
              >
                {isUser ? (
                  <User className="h-4.5 w-4.5" />
                ) : isAdmin ? (
                  <Headphones className="h-4.5 w-4.5 text-amber-300" />
                ) : (
                  <Bot className="h-4.5 w-4.5" />
                )}
              </div>

              {/* Message Content & Outer Timestamp Wrapper */}
              <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Message Box */}
                <div
                  className={`rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-[#e15b70] to-[#d4485e] text-white rounded-tr-none'
                      : isAdmin
                      ? 'bg-slate-900 text-white rounded-tl-none border border-slate-800'
                      : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                  }`}
                >
                  {isAdmin && (
                    <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 inline" /> VishLink Admin Support
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>

                {/* Timestamp & Double Ticks Outside Message Box */}
                <div
                  className={`mt-1 text-[10px] font-medium flex items-center gap-1 text-slate-400 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isUser && (
                    <span className="inline-flex items-center" title={msg.status === 'read' ? 'Read by Admin' : 'Sent/Delivered'}>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-400 ml-0.5" />
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] text-white shadow-xs">
              {chatMode === 'admin' ? (
                <Headphones className="h-5 w-5 animate-pulse" />
              ) : (
                <Bot className="h-5 w-5 animate-spin" />
              )}
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#e15b70] animate-pulse" />
              <span>
                {chatMode === 'admin' ? 'Sending message to Admin Support...' : 'VishLink AI is typing...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Input Bar (Sits directly above virtual keyboard on mobile) */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 shrink-0 sticky bottom-0 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              chatMode === 'admin'
                ? 'Message VishLink Admin Support...'
                : 'Ask about templates, photo limits, or payment...'
            }
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-[#e15b70] focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e15b70]"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#e15b70] to-[#d4485e] text-white shadow-md hover:opacity-95 disabled:opacity-40 transition cursor-pointer shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
