import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const CoffeeTopAdBanner: React.FC = () => {
  const { setActiveScreen, languageCode } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);

  const isBn = languageCode === 'bn';

  const messages = [
    {
      title: isBn ? '☕ ডেভেলপারকে কফি খাইয়ে সমর্থন করুন!' : '☕ Support the Developer with a Coffee!',
      sub: isBn ? 'বিজ্ঞাপন মুক্ত রাখতে এবং এই ফ্রি অ্যাপ টিকিয়ে রাখতে আপনার সহযোগিতা অত্যন্ত মূল্যবান।' : 'Keep this app 100% free and ad-free by supporting creator Md. Shahin.',
      cta: isBn ? 'কফি সাপোর্ট দিন' : 'Buy Me a Coffee',
    },
    {
      title: isBn ? '🇧🇩 বাংলাদেশ-প্রথম বিশ্বমানের আবহাওয়া অ্যাপ' : '🇧🇩 Bangladesh-First Global Weather Hub',
      sub: isBn ? '৫ কিমি নিখুঁত জিপিএস ফোরকাস্ট, লাইভ রাডার ও ৫০+ ভাষা।' : '5km high-precision GPS forecast, live radar & 50+ languages.',
      cta: isBn ? 'ফিচার দেখুন' : 'Explore Features',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const msg = messages[currentIdx];

  return (
    <div
      onClick={() => setActiveScreen('buy_me_a_coffee')}
      className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-2xl p-3.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between gap-3 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
          <Coffee className="w-5 h-5 fill-amber-400/20" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] uppercase font-black bg-slate-950/20 px-2 py-0.5 rounded-full tracking-wider text-slate-950">
              {isBn ? 'স্পন্সর ও ডেভেলপার সাপোর্ট' : 'SPONSOR / AD'}
            </span>
          </div>
          <h3 className="font-black text-xs sm:text-sm text-slate-950 truncate mt-0.5">
            {msg.title}
          </h3>
          <p className="text-[10.5px] text-slate-900/90 font-medium truncate">
            {msg.sub}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveScreen('buy_me_a_coffee');
        }}
        className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
      >
        <span>{msg.cta}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
