'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'driftplan-pwa-dismissed';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or if running as installed PWA
    if (
      localStorage.getItem(DISMISSED_KEY) ||
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone
    ) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay so it doesn't pop up immediately on first load
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !deferredPrompt) return null;

  const handleInstall = async () => {
    setVisible(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'dismissed') localStorage.setItem(DISMISSED_KEY, '1');
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-[#141929] border border-white/12 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0">
          <Download size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Add Driftplan to home screen</p>
          <p className="text-white/50 text-xs mt-0.5">Plan trips offline, faster access</p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 py-2 rounded-xl bg-amber-400 text-black text-sm font-bold hover:bg-amber-300 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="py-2 px-3 rounded-xl bg-white/8 text-white/60 text-sm hover:bg-white/15 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-white/30 hover:text-white/60 shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
