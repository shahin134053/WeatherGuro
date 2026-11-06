import React from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, ArrowRight } from 'lucide-react';

interface AdBannerProps {
  placement?: 'top' | 'bottom' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement = 'inline' }) => {
  const { setActiveScreen, languageCode } = useApp();
  const isBn = languageCode === 'bn';

  return (
    <div className="w-full my-3 px-3">
      <div
        onClick={() => setActiveScreen('buy_me_a_coffee')}
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border border-amber-500/40 rounded-2xl p-3.5 text-white transition-all shadow-md cursor-pointer hover:border-amber-400 flex items-center justify-between gap-3 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold">
            <Coffee className="w-5 h-5 fill-slate-950/20" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-sm font-mono text-[9.5px] uppercase font-bold border border-amber-400/30">
                {isBn ? 'ডেভেলপার স্পন্সর ব্যানার' : 'DEVELOPER SPONSOR AD'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">
              {isBn ? '☕ বাই মি এ কফি — ডেভেলপার মোঃ শাহীনকে সমর্থন করুন' : '☕ Buy Me a Coffee — Support Creator Md. Shahin'}
            </p>
            <p className="text-[10.5px] text-slate-300 truncate font-medium">
              {isBn ? 'আপনার একটি কফি এই অ্যাপটি ১০০% ফ্রি রাখতে সাহায্য করবে' : 'Your contribution keeps this weather app 100% free for everyone'}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveScreen('buy_me_a_coffee');
          }}
          className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>{isBn ? 'সাপোর্ট' : 'Support'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
