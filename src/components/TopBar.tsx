import React from 'react';
import { Sparkles, HelpCircle, User, Globe, Bot } from 'lucide-react';

interface TopBarProps {
  onOpenTrackOrder: () => void;
  onOpenHelp: () => void;
  onOpenProfile?: () => void;
  onOpenAiChat?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenTrackOrder,
  onOpenHelp,
  onOpenProfile,
  onOpenAiChat,
}) => {
  return (
    <div className="hidden md:block bg-[#0d1222] text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-3 text-rose-300 font-medium">
          <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-rose-500/30">
            <Sparkles className="w-3 h-3 text-rose-400" />
            Instant Digital Wishing Links
          </span>
          <span className="text-slate-400 text-[11px]">⚡ Create & Share on WhatsApp in 30 Seconds</span>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-5 text-slate-300">
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1 text-amber-300 font-bold hover:text-white transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Support Bot</span>
            </button>
          )}

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 text-rose-300 font-bold hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Purchased Wishing Links</span>
            </button>
          )}

          <button
            onClick={onOpenTrackOrder}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Find My Link</span>
          </button>
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};
