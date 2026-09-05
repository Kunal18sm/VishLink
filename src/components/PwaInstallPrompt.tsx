import React, { useEffect, useState } from 'react';
import { CheckCircle2, Download, Smartphone, Sparkles, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    deferredPwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const install = async () => {
    const promptEvent = window.deferredPwaPrompt || deferredPrompt;
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
        window.deferredPwaPrompt = null;
      }
    } catch (error) {
      console.error('Could not open the PWA install dialog:', error);
    }
  };

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      window.deferredPwaPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      window.dispatchEvent(new Event('pwa-install-available'));
      const lastDismissed = localStorage.getItem('vishlink_pwa_dismissed');
      if (!lastDismissed || Date.now() - Number(lastDismissed) > 12 * 60 * 60 * 1000) setShowPrompt(true);
    };
    const triggerInstall = () => void install();
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('trigger-pwa-install', triggerInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('trigger-pwa-install', triggerInstall);
    };
  }, []);

  const dismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('vishlink_pwa_dismissed', String(Date.now()));
  };

  if (isStandalone || !showPrompt || !(deferredPrompt || window.deferredPwaPrompt)) return null;

  return <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-rose-500/30 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
      <button onClick={dismiss} className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" title="Dismiss prompt"><X className="w-4 h-4" /></button>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shrink-0 flex items-center justify-center"><div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center"><Smartphone className="w-7 h-7 text-rose-400 animate-pulse" /></div></div>
        <div className="flex-1 pr-4"><div className="flex items-center gap-2"><h4 className="font-bold text-base text-white">Install VishLink App</h4><span className="bg-rose-500/20 text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-wider">FREE APP</span></div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">Install VishLink on your home screen for instant wish creation, faster loading &amp; offline support!</p>
          <div className="mt-3 flex items-center gap-2"><button onClick={install} className="flex-1 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"><Download className="w-4 h-4" /><span>Install App Now</span></button><button onClick={dismiss} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 px-3 rounded-xl transition-colors cursor-pointer">Later</button></div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400"><span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fast &amp; Secure</span><span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Installation</span></div>
    </div>
  </div>;
}
