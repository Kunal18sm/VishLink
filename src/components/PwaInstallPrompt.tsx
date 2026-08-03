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
    // Check if already running in standalone PWA mode
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(iosDevice);

    // Capture beforeinstallprompt event globally
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      (window as any).deferredPwaPrompt = promptEvent;
      
      const lastDismissed = localStorage.getItem('vishlink_pwa_dismissed');
      if (!lastDismissed || Date.now() - Number(lastDismissed) > 12 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Custom trigger from Navbar or Install button
    const handleTriggerInstall = async () => {
      const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;
      if (activePrompt) {
        try {
          await activePrompt.prompt();
          const choice = await activePrompt.userChoice;
          if (choice.outcome === 'accepted') {
            setShowPrompt(false);
            (window as any).deferredPwaPrompt = null;
            setDeferredPrompt(null);
          }
        } catch (err) {
          console.error('Trigger install error:', err);
        }
      } else {
        setShowPrompt(true);
      }
    };

    window.addEventListener('trigger-pwa-install', handleTriggerInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-pwa-install', handleTriggerInstall);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;

    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choiceResult = await activePrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted PWA installation');
          setShowPrompt(false);
          (window as any).deferredPwaPrompt = null;
          setDeferredPrompt(null);
        } else {
          console.log('User dismissed install prompt');
        }
      } catch (err) {
        console.error('Install prompt trigger error:', err);
      }
      return;
    }

    if (isIOS) {
      alert('To install VishLink on iPhone/iPad: Tap the Share icon ⎋ at bottom of Safari, then tap "Add to Home Screen" 📲');
    } else {
      alert('To install VishLink App: Open your browser menu (3 dots at top right) and select "Install App" or "Add to Home Screen" 📲');
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
        {/* Ambient background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Dismiss prompt"
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
              Install VishLink on your home screen for instant wish creation, faster loading &amp; offline support!
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
                  className="flex-1 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App Now</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
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
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Installation
          </span>
        </div>
      </div>
    </div>
  );
}
