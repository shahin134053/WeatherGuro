import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';
import { ShieldAlert, Volume2, VolumeX, Info, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const BmdSignalGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { languageCode } = useApp();
  const [playingNum, setPlayingNum] = useState<number | null>(null);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      if (!speaking) {
        setPlayingNum(null);
      } else if (activeId && activeId.startsWith('signal_')) {
        const num = parseInt(activeId.replace('signal_', ''), 10);
        setPlayingNum(isNaN(num) ? null : num);
      }
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const signals = [
    { num: 1, title: '১ নম্বর দূরবর্তী সতর্ক সংকেত', desc: 'জাহাজ ছেড়ে যাওয়ার পর দূর সাগরে একটি ঝোড়ো হাওয়া সৃষ্টি হয়েছে।' },
    { num: 2, title: '২ নম্বর দূরবর্তী হুশিয়ারী সংকেত', desc: 'দূরে গভীর সাগরে একটি ঘূর্ণিঝড় সৃষ্টি হয়েছে, সমুদ্রবন্দরে ঝড় বয়ে যেতে পারে।' },
    { num: 3, title: '৩ নম্বর স্থানীয় সতর্ক সংকেত', desc: 'বন্দরে একটি ঝোড়ো হাওয়া বয়ে যেতে পারে, ছোট ছোট নৌযান সাবধানে চলাচল করুক।' },
    { num: 4, title: '৪ নম্বর স্থানীয় হুশিয়ারী সংকেত', desc: 'বন্দর ঘূর্নিঝড় কবলিত, সমস্ত ছোট নৌযান অবিলম্বে নিরাপদ আশ্রয়ে চলো।' },
    { num: 5, title: '৫ নম্বর বিপদ সংকেত', desc: 'বন্দরটি একটি মাঝারি ধরনের ঘূর্ণিঝড়ের কবলে পতিত হয়েছে, উপকূলে জলোচ্ছ্বাসের আশঙ্কা।' },
    { num: 6, title: '৬ নম্বর বিপদ সংকেত', desc: 'বন্দরটির ওপর দিয়ে ঘূর্ণিঝড়টি ডান দিক থেকে যাওয়ার সম্ভাবনা।' },
    { num: 7, title: '৭ নম্বর বিপদ সংকেত', desc: 'বন্দরটির ওপর দিয়ে বা কাছ দিয়ে প্রচণ্ড তীব্রতার ঘূর্ণিঝড় অতিক্রম করবে।' },
    { num: 8, title: '৮ নম্বর মহাবিপদ সংকেত', desc: 'প্রচণ্ড তীব্রতার সাইক্লোন সরাসরি বন্দর অতিক্রম করবে, ৮-১২ ফুট উঁচু জলোচ্ছ্বাস হতে পারে।' },
    { num: 9, title: '৯ নম্বর মহাবিপদ সংকেত', desc: 'ঘূর্ণিঝড়ের তীব্রতা অত্যধিক, সমস্ত উপকূলবাসী অবিলম্বে সাইক্লোন শেল্টারে যান।' },
    { num: 10, title: '১০ নম্বর মহাবিপদ সংকেত', desc: 'সর্বোচ্চ মাত্রার সাইক্লোনিক বিপর্যয়, বন্দরের ওপর দিয়ে সরাসরি সাইক্লোনের কেন্দ্র যাবে।' },
  ];

  const handleSpeakSignal = (num: number, title: string, desc: string) => {
    if (playingNum === num) {
      stopSpeech();
      setPlayingNum(null);
      return;
    }

    setPlayingNum(num);
    speakWeatherAlert(
      `${title}। ${desc}`,
      languageCode,
      () => {
        setPlayingNum(null);
      },
      `signal_${num}`
    );
  };

  const handleClose = () => {
    stopSpeech();
    setPlayingNum(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                BMD সমুদ্রবন্দর সতর্কসংকেত গাইড (১-১০ নম্বর সংকেত)
              </h3>
              <p className="text-[10px] text-slate-500">বাংলাদেশ আবহাওয়া অধিদপ্তর নির্দেশিকা</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {signals.map((sig) => {
            const isThisPlaying = playingNum === sig.num;
            return (
              <div
                key={sig.num}
                className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                  sig.num >= 8
                    ? 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
                    : sig.num >= 5
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{sig.title}</span>
                  <button
                    onClick={() => handleSpeakSignal(sig.num, sig.title, sig.desc)}
                    className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer ${
                      isThisPlaying
                        ? 'bg-red-600 text-white animate-pulse shadow-md'
                        : 'bg-teal-600 text-white hover:bg-teal-500'
                    }`}
                    title={isThisPlaying ? 'অডিও থামান' : 'ভয়েস অডিও শুনুন'}
                  >
                    {isThisPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isThisPlaying ? 'থামান' : 'শুনুন'}</span>
                  </button>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">{sig.desc}</p>
              </div>
            );
          })}
        </div>

        <button onClick={handleClose} className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer">
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
};
