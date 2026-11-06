import React from 'react';
import { useApp } from '../context/AppContext';
import { Train, Ship, Anchor, Sprout, Compass, BellRing, Globe2, Zap } from 'lucide-react';

interface Props {
  onSelectFeature: (feature: 'transit' | 'marine' | 'tide' | 'agri' | 'travel' | 'alerts' | 'ranking') => void;
}

export const SpecialFeatureQuickDock: React.FC<Props> = ({ onSelectFeature }) => {
  const { languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const features = [
    {
      id: 'ranking' as const,
      icon: Globe2,
      labelBn: 'বিশ্ব র‍্যাংকিং',
      labelEn: 'World Ranking',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
      badge: '🌍',
    },
    {
      id: 'transit' as const,
      icon: Train,
      labelBn: 'ট্রেন ও ফ্লাইট',
      labelEn: 'Train & Flight',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
      badge: '🚆',
    },
    {
      id: 'marine' as const,
      icon: Ship,
      labelBn: 'নদীবন্দর ও লঞ্চ',
      labelEn: 'Port & Launch',
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20',
      badge: '🚢',
    },
    {
      id: 'tide' as const,
      icon: Anchor,
      labelBn: 'জোয়ার-ভাটা',
      labelEn: 'Tide & Moon',
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
      badge: '🌊',
    },
    {
      id: 'agri' as const,
      icon: Sprout,
      labelBn: 'কৃষি মোড',
      labelEn: 'Agri Mode',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
      badge: '🌾',
    },
    {
      id: 'travel' as const,
      icon: Compass,
      labelBn: 'ট্রাভেল গাইড',
      labelEn: 'Travel Guide',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
      badge: '✈️',
    },
    {
      id: 'alerts' as const,
      icon: BellRing,
      labelBn: 'লাইভ অ্যালার্ট',
      labelEn: 'Push Alerts',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
      badge: '🔔',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-indigo-500/10 border border-teal-500/20 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
            <Zap className="w-4 h-4 animate-bounce" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{isBn ? 'বিশেষ ফিচার ও ট্রানজিট হাব' : 'Special Features & Transit Quick Access'}</span>
              <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">VIP</span>
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {isBn ? 'এক ক্লিকে আপনার কাঙ্ক্ষিত জরুরি সেবা ও পূর্বাভাসে প্রবেশ করুন' : 'Instant 1-click access to critical alerts & travel safety'}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Buttons Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
        {features.map((feat) => {
          return (
            <button
              key={feat.id}
              onClick={() => onSelectFeature(feat.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center shadow-xs hover:scale-105 ${feat.color}`}
            >
              <div className="text-lg">{feat.badge}</div>
              <span className="text-[11px] font-extrabold truncate w-full">
                {isBn ? feat.labelBn : feat.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
