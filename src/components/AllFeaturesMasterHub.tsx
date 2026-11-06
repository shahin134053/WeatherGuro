import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Globe2,
  Train,
  Ship,
  Anchor,
  Sprout,
  Compass,
  Radio,
  History,
  BellRing,
  Download,
  Coffee,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onSelectFeatureId: (featureId: string) => void;
}

export const AllFeaturesMasterHub: React.FC<Props> = ({ onSelectFeatureId }) => {
  const { languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const masterFeatures = [
    {
      id: 'overview',
      icon: Sun,
      badge: '🌤️',
      titleBn: 'লাইভ আবহাওয়া ও পূর্বাভাস',
      titleEn: 'Live Weather & Forecast',
      descBn: 'তাপমাত্রা, আর্দ্রতা, বাতাস ও ২৪ ঘণ্টার পূর্বাভাস',
      descEn: 'Temperature, humidity, wind & 24h forecast',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
    },
    {
      id: 'ranking',
      icon: Globe2,
      badge: '🌍',
      titleBn: 'বিশ্ব বায়ুমান ও র‍্যাংকিং',
      titleEn: 'World Air & Eco Ranking',
      descBn: 'সর্বশেষ দূষিত ও পরিবেশবান্ধব শহর এবং আপনার দেশের অবস্থান',
      descEn: 'Most polluted vs greenest cities & your GPS country rank',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
    },
    {
      id: 'transit',
      icon: Train,
      badge: '🚆',
      titleBn: 'ট্রেন ও ফ্লাইট বিলম্ব ঝুঁকি',
      titleEn: 'Train & Flight Delay Risk',
      descBn: 'কুয়াশা ও ঝড়বৃষ্টির কারণে সিডিউল বিপর্যয়ের পূর্বাভাস',
      descEn: 'Schedule disruption forecast due to fog and storm',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    },
    {
      id: 'marine',
      icon: Ship,
      badge: '🚢',
      titleBn: 'নদীবন্দর ও লঞ্চ সতর্কতা',
      titleEn: 'Port & Launch Safety',
      descBn: 'বন্দর সংকেত এবং জলযান চলাচল নিষেধাজ্ঞা স্ট্যাটাস',
      descEn: 'Port warning signals & watercraft movement restrictions',
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20',
    },
    {
      id: 'tide',
      icon: Anchor,
      badge: '🌊',
      titleBn: 'জোয়ার-ভাটা ও চন্দ্রকলা',
      titleEn: 'Tide & Moon Phases',
      descBn: 'জেলে ও নাবিকদের জন্য উচ্চ জোয়ার, ভাটা ও চাঁদের দশা',
      descEn: 'High/low tide times and moon cycle for sailors',
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
    },
    {
      id: 'agri',
      icon: Sprout,
      badge: '🌾',
      titleBn: 'প্রফেশনাল কৃষি মোড',
      titleEn: 'Professional Agri Mode',
      descBn: 'মাটির আর্দ্রতা, সেচ ও শস্য ক্যালেন্ডার পূর্বাভাস',
      descEn: 'Soil moisture, irrigation & seasonal crop calendar',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    },
    {
      id: 'travel',
      icon: Compass,
      badge: '✈️',
      titleBn: 'ভ্রমণ ও ট্যুরিস্ট গাইড',
      titleEn: 'Travel & Tourist Guide',
      descBn: 'দেশের জনপ্রিয় পর্যটন স্পটের আবহাওয়া ও প্যাক গাইড',
      descEn: 'Weather and packing advice for popular destinations',
      color: 'bg-amber-600/10 text-amber-700 dark:text-amber-300 border-amber-600/20 hover:bg-amber-600/20',
    },
    {
      id: 'radar',
      icon: Radio,
      badge: '🛰️',
      titleBn: 'স্যাটেলাইট ক্লাউড লুপ',
      titleEn: 'Satellite Cloud Loop',
      descBn: 'বঙ্গোপসাগর ও আশপাশের মেঘের গতিবিধি ও রাডার অ্যানিমেশন',
      descEn: 'Live cloud movement and cyclone radar animation',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
    },
    {
      id: 'history',
      icon: History,
      badge: '📜',
      titleBn: 'ঐতিহাসিক আবহাওয়া রেকর্ড',
      titleEn: 'Climate History Records',
      descBn: 'সর্বকালের সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা এবং চরম মান',
      descEn: 'All-time highest and lowest temperature records',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
    },
    {
      id: 'alerts',
      icon: BellRing,
      badge: '🔔',
      titleBn: 'পুশ নোটিফিকেশন ও অ্যালার্ম',
      titleEn: 'Push Alerts & Weather Alarm',
      descBn: 'কালবৈশাখী ঝড় ও বৃষ্টির ৫-১০ মিনিট আগের ভাইব্রেশন অ্যালার্ট',
      descEn: 'Instant vibration alert before storms and rain',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20',
    },
    {
      id: 'download',
      icon: Download,
      badge: '🖼️',
      titleBn: 'অ্যাপস আইকন ডাউনলোড',
      titleEn: 'Download App Icon',
      descBn: 'হোম স্ক্রিনের জন্য পিএনজি (PNG) ও এসভিজি (SVG) লোগো ডাউনলোড',
      descEn: 'Download app logo in PNG and SVG formats',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    },
    {
      id: 'coffee',
      icon: Coffee,
      badge: '☕',
      titleBn: 'বাই মি এ কফি (সাপোর্ট)',
      titleEn: 'Buy Me a Coffee (Support)',
      descBn: 'মোবাইল ব্যাংকিং ও ব্যাংক অ্যাকাউন্টের মাধ্যমে ডেভেলপারকে সহায়তা',
      descEn: 'Support development via mobile banking & bank transfers',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 hover:bg-amber-500/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isBn ? 'অ্যাপসের সকল ভিআইপি ফিচার ও পরিষেবা হাব' : 'All VIP Features & Services Master Hub'}</span>
              <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">ALL-IN-ONE</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'এক নজরে অ্যাপসের সমস্ত চমৎকার ফিচারে দ্রুত প্রবেশ করুন' : 'Quickly access all professional weather features and tools'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Master Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {masterFeatures.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectFeatureId(item.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left shadow-xs hover:scale-[1.02] ${item.color}`}
          >
            <span className="text-2xl shrink-0 pt-0.5">{item.badge}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {isBn ? item.titleBn : item.titleEn}
                </h4>
                <ChevronRight className="w-4 h-4 opacity-60 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {isBn ? item.descBn : item.descEn}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
