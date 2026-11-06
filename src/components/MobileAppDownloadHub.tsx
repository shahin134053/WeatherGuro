import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  X,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Share2,
  ExternalLink,
  ChevronRight,
  Minimize2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DIRECT_APK_DOWNLOAD_URL =
  'https://github.com/shahin134053/WeatherGuro/releases/latest/download/WeatherGuru-Gold-Android.apk';
export const DIRECT_IOS_ZIP_URL =
  'https://github.com/shahin134053/WeatherGuro/releases/latest/download/WeatherGuru-Gold-iOS.zip';
export const LIVE_WEBSITE_URL = 'https://bangla.pixelretouchpro.com/';

// Global modal open listeners so HeaderNav or any button can open the modal
type ModalListener = (open: boolean) => void;
const modalListeners: Set<ModalListener> = new Set();

export function openMobileDownloadModal(): void {
  modalListeners.forEach((fn) => fn(true));
}

export const MobileAppDownloadHub: React.FC = () => {
  const { languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [qrMode, setQrMode] = useState<'apk' | 'web'>('apk');
  const [qrFallback, setQrFallback] = useState(false);
  const [copiedType, setCopiedType] = useState<'apk' | 'web' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  // Check if running inside native Capacitor APK
  const isNativeApk =
    typeof window !== 'undefined' &&
    Boolean(
      (window as any).Capacitor?.isNativePlatform?.() ||
        window.location.protocol.startsWith('capacitor') ||
        window.location.protocol.startsWith('file')
    );

  useEffect(() => {
    const listener: ModalListener = (open) => setIsOpen(open);
    modalListeners.add(listener);
    return () => {
      modalListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsPwaInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const currentQrTargetUrl = qrMode === 'apk' ? DIRECT_APK_DOWNLOAD_URL : LIVE_WEBSITE_URL;

  const getQrImageUrl = (targetUrl: string, size: number = 240) => {
    if (qrFallback) {
      return `https://quickchart.io/qr?size=${size}&margin=2&text=${encodeURIComponent(targetUrl)}`;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(
      targetUrl
    )}`;
  };

  const handleCopyLink = (url: string, type: 'apk' | 'web') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  const handleTriggerPwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
        setDeferredPrompt(null);
      }
      return;
    }
    setShowIosGuide(true);
  };

  return (
    <>
      {/* FLOATING CORNER "DOWNLOAD FOR MOBILE & QR" WIDGET (Hidden only inside installed native APK unless modal opened) */}
      {!isNativeApk && (
        <div className="fixed bottom-20 right-3 sm:right-5 z-40 flex flex-col items-end">
          {isMinimized ? (
            <button
              onClick={() => {
                setIsMinimized(false);
                setIsOpen(true);
              }}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-xl shadow-teal-900/40 border border-teal-300/40 hover:scale-105 transition-all cursor-pointer"
              title={isBn ? 'মোবাইল অ্যাপ ডাউনলোড ও QR কোড' : 'Download for Mobile & QR Code'}
            >
              <QrCode className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="text-xs font-black">
                {isBn ? 'মোবাইল অ্যাপ' : 'Mobile App'}
              </span>
            </button>
          ) : (
            <div className="relative bg-gradient-to-br from-slate-900/95 via-teal-950/95 to-emerald-950/95 backdrop-blur-xl text-white rounded-3xl p-2.5 sm:p-3 shadow-2xl shadow-teal-950/50 border border-teal-400/35 flex items-center gap-2.5 sm:gap-3 max-w-[290px] sm:max-w-xs transition-all hover:border-amber-400/60">
              {/* Minimize corner button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 flex items-center justify-center shadow-md cursor-pointer"
                title={isBn ? 'ছোট করুন' : 'Minimize'}
              >
                <Minimize2 className="w-3 h-3" />
              </button>

              {/* Mini Scannable QR Preview on Corner Badge */}
              <div
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1 shrink-0 cursor-pointer shadow-inner flex items-center justify-center overflow-hidden group"
                title={isBn ? 'বড় কিউআর কোড দেখতে ক্লিক করুন' : 'Click to enlarge QR Code'}
              >
                <img
                  src={getQrImageUrl(DIRECT_APK_DOWNLOAD_URL, 120)}
                  alt="Mobile App QR"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                  onError={() => setQrFallback(true)}
                />
              </div>

              {/* Text & Direct Action */}
              <div
                onClick={() => setIsOpen(true)}
                className="min-w-0 flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[9px] font-black uppercase tracking-wider border border-amber-400/30">
                    <Smartphone className="w-2.5 h-2.5" />
                    {isBn ? 'মোবাইল ভার্সন' : 'FOR MOBILE'}
                  </span>
                </div>
                <p className="font-black text-xs sm:text-sm text-white leading-tight mt-1 truncate">
                  {isBn ? 'ডাউনলোড ফর মোবাইল' : 'Download for Mobile'}
                </p>
                <p className="text-[10px] text-teal-200/90 leading-tight mt-0.5 flex items-center gap-1">
                  <span>{isBn ? 'QR স্ক্যান বা APK ইনস্টল' : 'Scan QR or Get APK'}</span>
                  <ChevronRight className="w-3 h-3 text-amber-300 shrink-0" />
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL MOBILE APP DOWNLOAD & QR CODE MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title={isBn ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pr-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  WeatherGuru Gold Mobile
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                  {isBn ? 'ফোনে অ্যাপটি ইনস্টল করুন' : 'Download for Mobile Phone'}
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
              {isBn
                ? 'আপনার ফোনের ক্যামেরা দিয়ে নিচের কিউআর (QR) কোডটি স্ক্যান করুন অথবা সরাসরি নিচের বাটন থেকে ফোনে ডাউনলোড ও ইনস্টল করুন।'
                : 'Scan the QR code below with your phone camera, or tap the download buttons below to install WeatherGuru Gold directly on your phone.'}
            </p>

            {/* QR CODE MODE SWITCHER */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mt-4 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setQrMode('apk')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  qrMode === 'apk'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBn ? 'অ্যান্ড্রয়েড APK QR' : 'Android APK QR'}</span>
              </button>
              <button
                onClick={() => setQrMode('web')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  qrMode === 'web'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{isBn ? 'মোবাইল ওয়েব / iOS QR' : 'Mobile Web / iOS QR'}</span>
              </button>
            </div>

            {/* HIGH-CONTRAST SCANNABLE QR CARD */}
            <div className="mt-3 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/70 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-4 flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200/80 relative">
                <img
                  src={getQrImageUrl(currentQrTargetUrl, 220)}
                  alt="WeatherGuru Gold Mobile QR Code"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => setQrFallback(true)}
                />
              </div>

              <span className="mt-2.5 text-xs font-extrabold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                {qrMode === 'apk'
                  ? isBn
                    ? 'ফোনের ক্যামেরা দিয়ে স্ক্যান করলে সরাসরি APK ডাউনলোড হবে'
                    : 'Scan with phone camera to directly download Android APK'
                  : isBn
                  ? 'স্ক্যান করে যেকোনো ফোনে লাইভ অ্যাপ ওপেন করুন'
                  : 'Scan to open Live Mobile Web App on iPhone or Android'}
              </span>

              {/* Copy Link Pill */}
              <button
                onClick={() => handleCopyLink(currentQrTargetUrl, qrMode)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300/80 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                {copiedType === qrMode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {isBn ? 'লিংক কপি হয়েছে!' : 'Link Copied!'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ডাউনলোড লিংক কপি করুন' : 'Copy Download Link'}</span>
                  </>
                )}
              </button>
            </div>

            {/* DIRECT 1-CLICK DOWNLOAD & INSTALL BUTTONS */}
            <div className="mt-4 space-y-2.5">
              {/* 1. Direct Android APK Download */}
              <a
                href={DIRECT_APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm leading-tight">
                      {isBn ? '🤖 অ্যান্ড্রয়েড অ্যাপ ডাউনলোড (.APK)' : '🤖 Download Android App (.APK)'}
                    </p>
                    <p className="text-[10px] text-teal-100 font-medium mt-0.5">
                      {isBn
                        ? 'WeatherGuru-Gold-Android.apk • ৪.৪ মেগাবাইট (সরাসরি ইনস্টল)'
                        : 'WeatherGuru-Gold-Android.apk • 4.4 MB (Direct Install)'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-teal-100 shrink-0" />
              </a>

              {/* 2. Instant 1-Click Browser PWA App Install */}
              {!isPwaInstalled && (
                <button
                  onClick={handleTriggerPwaInstall}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-black text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xs sm:text-sm leading-tight">
                        {isBn
                          ? '⚡ ১-ক্লিকে হোমস্ক্রিনে অ্যাপ ইনস্টল (Web App)'
                          : '⚡ 1-Click Install to Home Screen (Web App)'}
                      </p>
                      <p className="text-[10px] opacity-80 font-medium mt-0.5">
                        {isBn
                          ? 'APK ছাড়াই সরাসরি ফোনে বা কম্পিউটারে অ্যাপ হিসেবে যোগ করুন'
                          : 'Install directly from browser on Android, iPhone, or PC'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              {/* iOS / Browser Install Guide Box (when clicked if beforeinstallprompt isn't supported) */}
              {showIosGuide && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-fadeIn">
                  <p className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    {isBn
                      ? 'ব্রাউজার থেকে সরাসরি হোমস্ক্রিনে যুক্ত করার নিয়ম:'
                      : 'How to Add to Home Screen:'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isBn
                      ? '১. আপনার ফোনের Chrome বা Safari ব্রাউজারের মেনু (⋮) অথবা Share আইকনে ট্যাপ করুন।\n২. তালিকা থেকে "Install App" বা "Add to Home Screen"-এ চাপুন!'
                      : '1. Tap your browser menu (⋮) on Android or Share button on iPhone Safari.\n2. Select "Install App" or "Add to Home Screen"!'}
                  </p>
                  <div className="pt-1">
                    <a
                      href={DIRECT_IOS_ZIP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 underline"
                    >
                      <Download className="w-3 h-3" />
                      <span>
                        {isBn
                          ? 'অথবা iPhone iOS প্রজেক্ট ফাইল ডাউনলোড করুন (.ZIP)'
                          : 'Or download iPhone iOS project bundle (.ZIP)'}
                      </span>
                    </a>
                  </div>
                </div>
              )}

              {isPwaInstalled && (
                <div className="py-2.5 px-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isBn
                      ? 'এই ডিভাইসে ওয়েব অ্যাপটি ইতিমধ্যে ইনস্টল করা আছে'
                      : 'Web App is already installed on this device'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
