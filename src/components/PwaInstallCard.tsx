import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

export const PwaInstallCard: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const checkIsInstalled = (): boolean => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    const isMarkedInstalled = localStorage.getItem('weatherglobe_pwa_installed') === 'true';
    return isStandalone || isMarkedInstalled;
  };

  const [isInstalled, setIsInstalled] = useState<boolean>(checkIsInstalled);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('weatherglobe_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    // Listen for media query standalone mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        localStorage.setItem('weatherglobe_pwa_installed', 'true');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      // If already installed, don't save prompt
      if (checkIsInstalled()) {
        setIsInstalled(true);
        return;
      }
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for successful appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('weatherglobe_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      // Manual prompt or already installed fallback
      alert('WeatherGlobe অ্যাপটি আপনার ডিভাইসে সফলভাবে ইনস্টল হতে চলেছে বা যুক্ত রয়েছে!');
      setIsInstalled(true);
      localStorage.setItem('weatherglobe_pwa_installed', 'true');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      localStorage.setItem('weatherglobe_pwa_installed', 'true');
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('weatherglobe_pwa_dismissed', 'true');
  };

  // IF ALREADY INSTALLED OR DISMISSED, DO NOT RENDER INSTALL MESSAGE AT ALL
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-3xl p-4 shadow-lg flex items-center justify-between gap-3 my-2 relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-teal-200 shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-xs">WeatherGlobe অ্যাপটি ইন্সটল করুন</h3>
          <p className="text-[10px] text-teal-200/80">এক ক্লিকে আপনার ফোনের হোমস্ক্রিনে অ্যাপ আইকন যোগ করুন</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallPwa}
          className="px-3.5 py-2 rounded-2xl bg-teal-400 text-slate-950 text-xs font-bold shadow-md hover:bg-teal-300 transition-all flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ইন্সটল</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-all cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
