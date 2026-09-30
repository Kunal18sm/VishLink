import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Zap,
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

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('vishlink_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/chat/history', { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.chatMode) setChatMode(data.chatMode);
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

  // Initial fetch and polling for Live Admin responses
  useEffect(() => {
    fetchChatHistory();

    const interval = setInterval(() => {
      fetchChatHistory();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
      status: 'delivered',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 py-6 sm:py-10 px-3 sm:px-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col min-h-[82vh]">
        
        {/* Top Navigation Header */}
        <div className="bg-gradient-to-r from-[#0d1222] via-[#1a233d] to-[#2b172a] text-white p-4 sm:p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={onBack}
                className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f48a9b] text-white shadow-md shrink-0">
                {chatMode === 'admin' ? <Headphones className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
              </div>

              <div>
                <h1 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                  {chatMode === 'admin' ? 'VishLink Live Admin Support' : 'VishLink AI Assistant'}
                </h1>
              </div>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: Date.now().toString(),
                    senderRole: chatMode === 'admin' ? 'admin' : 'bot',
                    text:
                      chatMode === 'admin'
                        ? 'Chat history cleared. Send your message below and VishLink Admin Support will reply within 5–10 minutes.'
                        : 'Chat history cleared. How can I help you today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'read',
                  },
                ])
              }
              className="self-end sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear Chat
            </button>
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
        )}

        {/* Live Admin Mode Notice Banner */}
        {chatMode === 'admin' && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 text-center text-xs font-medium text-amber-900 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You are chatting with VishLink Admin Support. Messages notify our admin team live. Replies typically arrive within 5–10 minutes, so feel free to check back or revisit.
            </span>
          </div>
        )}

        {/* Chat Messages Log Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 min-h-[380px]">
          {messages.map((msg) => {
            const isUser = msg.senderRole === 'user';
            const isAdmin = msg.senderRole === 'admin';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs ${
                    isUser
                      ? 'bg-slate-900'
                      : isAdmin
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-700'
                      : 'bg-gradient-to-tr from-[#e15b70] to-[#f48a9b]'
                  }`}
                >
                  {isUser ? (
                    <User className="h-5 w-5" />
                  ) : isAdmin ? (
                    <Headphones className="h-5 w-5 text-amber-300" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>

                {/* Message Box */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-[#e15b70] to-[#d4485e] text-white rounded-tr-none'
                      : isAdmin
                      ? 'bg-slate-900 text-white rounded-tl-none border border-slate-800'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80'
                  }`}
                >
                  {isAdmin && (
                    <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 inline" /> VishLink Admin Support
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                  {/* Timestamp & WhatsApp Double Blue Ticks for User */}
                  <div
                    className={`mt-2 text-[10px] font-medium flex items-center gap-1 ${
                      isUser ? 'text-rose-100 justify-end' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && (
                      <span className="inline-flex items-center" title="Delivered & Read">
                        <CheckCheck className="w-3.5 h-3.5 text-sky-300 ml-0.5" />
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
              <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#e15b70] animate-pulse" />
                <span>
                  {chatMode === 'admin' ? 'Sending message to Admin Support...' : 'VishLink AI is typing...'}
                </span>
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
              placeholder={
                chatMode === 'admin'
                  ? 'Type a message to VishLink Admin Support...'
                  : 'Ask about templates, photo upload limits, or payment...'
              }
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
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Encrypted Support Chat
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              {chatMode === 'admin' ? 'Live Admin Helpdesk' : 'Gemini AI Powered'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
