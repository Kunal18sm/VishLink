import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Processing your request...',
  subMessage = 'Please wait a moment while we set up your wishing webpage...',
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-5 animate-in zoom-in-95">
        
        {/* Animated Loading Spinner & Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-rose-100 border-t-[#e15b70] animate-spin" />
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#e15b70]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-sans font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
            {message}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {subMessage}
          </p>
        </div>

        {/* Animated Progress Bar Line */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
          <div className="bg-gradient-to-r from-[#e15b70] via-[#f48a9b] to-[#e15b70] h-full w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
