import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Download, RefreshCw, X, ArrowUpCircle, ShieldCheck } from 'lucide-react';
import {
  subscribeUpdateStatus,
  applyAppUpdate,
  dismissUpdate,
  AppUpdateInfo,
  CURRENT_APP_VERSION,
} from '../services/autoUpdateService';

export const AutoUpdateModal: React.FC = () => {
  const { languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const unsub = subscribeUpdateStatus((info) => {
      setUpdateInfo(info);
    });
    return unsub;
  }, []);

  if (!updateInfo || !updateInfo.hasUpdate) {
    return null;
  }

  const handleUpdate = () => {
    setIsApplying(true);
    setTimeout(() => {
      applyAppUpdate();
    }, 400);
  };

  return (
    <aside aria-label="App Update Notification" className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slideDown">
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-4 shadow-2xl border-2 border-amber-400/60 backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
            <ArrowUpCircle className="w-6 h-6 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {isBn ? 'নতুন আপডেট প্রস্তুত' : 'New Update Ready'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                v{CURRENT_APP_VERSION} ➔ {updateInfo.latestVersion}
              </span>
            </div>

            <h4 className="font-black text-sm text-white mt-1 leading-tight">
              {isBn ? 'WeatherGuru Gold অটো-আপডেট' : 'WeatherGuru Gold Auto-Update'}
            </h4>

            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {updateInfo.releaseNotes ||
                (isBn
                  ? 'অডিও ভয়েস ফিক্স, সুপারফাস্ট লোডিং ও উন্নত আবহাওয়া ফিচার চালু করতে এখনই আপডেট করুন।'
                  : 'Update now for live audio voice fixes, instant loading, and enhanced meteorological forecast features.')}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleUpdate}
                disabled={isApplying}
                className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isBn ? 'আপডেট হচ্ছে...' : 'Updating...'}</span>
                  </>
                ) : updateInfo.isPwaUpdate ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isBn ? 'রিলোড ও ইনস্টল করুন' : 'Reload & Apply'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এখনই অটো-আপডেট করুন' : 'Update Now (1-Tap)'}</span>
                  </>
                )}
              </button>

              <button
                onClick={dismissUpdate}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                {isBn ? 'পরে' : 'Later'}
              </button>
            </div>
          </div>

          {/* Close / Dismiss Cross */}
          <button
            onClick={dismissUpdate}
            className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isBn ? 'বন্ধ করুন' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
