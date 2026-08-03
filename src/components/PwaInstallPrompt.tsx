import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as standalone app
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(iosDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user dismissed previously in last 24h
      const lastDismissed = localStorage.getItem('vishlink_pwa_dismissed');
      if (!lastDismissed || Date.now() - Number(lastDismissed) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger event from Navbar or buttons
    const handleTriggerInstall = () => {
      setShowPrompt(true);
    };
    window.addEventListener('trigger-pwa-install', handleTriggerInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-pwa-install', handleTriggerInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert('To install VishLink on iOS: Tap the Share button in Safari navigation bar, then scroll down and tap "Add to Home Screen" 📲');
      } else {
        alert('To install VishLink App, open your browser menu (3 dots at top right) and select "Install App" or "Add to Home Screen".');
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        setShowPrompt(false);
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('vishlink_pwa_dismissed', String(Date.now()));
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-rose-500/30 relative overflow-hidden">
        {/* Glow background effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-rose-400 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-white">Install VishLink App</h4>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-wider">
                FREE APP
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Get 1-tap access to create 3D wishing links, offline speed & instant WhatsApp notifications!
            </p>

            {isIOS ? (
              <div className="mt-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                <Share className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Tap <strong className="text-white">Share</strong> &amp; select <strong className="text-white">&quot;Add to Home Screen&quot;</strong></span>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Install VishLink Now</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 px-3 rounded-xl transition-colors"
                >
                  Later
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fast &amp; Secure
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> No Store Download Required
          </span>
        </div>
      </div>
    </div>
  );
}
