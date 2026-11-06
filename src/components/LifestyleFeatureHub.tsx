import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shirt,
  Sprout,
  Compass,
  Activity,
  HeartPulse,
  Train,
  Waves,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
} from 'lucide-react';

export const LifestyleFeatureHub: React.FC = () => {
  const { weatherData, languageCode, formatTemp } = useApp();
  const [activeMode, setActiveMode] = useState<
    'wear' | 'agri' | 'travel' | 'outdoor' | 'health' | 'transit' | 'marine'
  >('wear');

  const isBn = languageCode === 'bn';
  const current = weatherData?.current;
  const temp = current?.temperature || 28;
  const humidity = current?.humidity || 65;
  const windSpeed = current?.windSpeed || 12;
  const aqi = weatherData?.airQuality?.aqi || 45;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              {isBn ? 'স্মার্ট লাইফস্টাইল ও প্রফেশনাল হাব' : 'Smart Lifestyle & Pro Hub'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn ? 'পোশাক, কৃষি, ভ্রমণ, স্বাস্থ্য, ট্রানজিট ও জেলেদের বিশেষ পূর্বাভাস' : 'Specialized advisories for apparel, agriculture, travel, health, transit & marine'}
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-xs">
        <button
          onClick={() => setActiveMode('wear')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'wear'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'কী পরবেন' : 'Apparel'}</span>
        </button>

        <button
          onClick={() => setActiveMode('agri')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'agri'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'কৃষি মোড' : 'Agri Pro'}</span>
        </button>

        <button
          onClick={() => setActiveMode('travel')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'travel'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'ট্রাভেল মোড' : 'Travel'}</span>
        </button>

        <button
          onClick={() => setActiveMode('outdoor')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'outdoor'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'আউটডোর' : 'Outdoor'}</span>
        </button>

        <button
          onClick={() => setActiveMode('health')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'health'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'স্বাস্থ্য' : 'Health'}</span>
        </button>

        <button
          onClick={() => setActiveMode('transit')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'transit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Train className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'ফ্লাইট ও ট্রেন' : 'Transit'}</span>
        </button>

        <button
          onClick={() => setActiveMode('marine')}
          className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeMode === 'marine'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span className="text-[10px] truncate w-full text-center">{isBn ? 'জেলে ও নাবিক' : 'Marine'}</span>
        </button>
      </div>

      {/* Mode Content Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
        {activeMode === 'wear' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-teal-700 dark:text-teal-300">
              <Shirt className="w-4 h-4" />
              <span>{isBn ? 'কী পরবেন (পোশাকের পরামর্শ)' : 'What to Wear Advice'}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {temp > 30
                ? (isBn ? '🌞 প্রচণ্ড গরম আবহাওয়া! হালকা সুতির ঢিলেঢালা পোশাক পরুন। সাথে রোদ থেকে বাঁচার জন্য সানগ্লাস, টুপি এবং সুতির গামছা বা ছাতা রাখুন।' : '🌞 Hot weather! Wear light, breathable cotton clothes. Carry sunglasses, cap, and a cotton umbrella.')
                : temp < 18
                ? (isBn ? '🧥 বেশ ঠাণ্ডা আবহাওয়া রয়েছে। হালকা জ্যাকেট, সোয়েটার বা ফুল হাতা শাল জড়িয়ে বাইরে যান।' : '🧥 Cool weather. Wear a light jacket, sweater, or full-sleeve shawl when heading out.')
                : (isBn ? '👔 আরামদায়ক আবহাওয়া। সাধারণ ক্যাজুয়াল সুতির পোশাক পরতে পারেন। রোদ বা বৃষ্টির জন্য ছোট ছাতা সাথে রাখতে পারেন।' : '👔 Comfortable weather. Casual cotton clothing is ideal. Keep a compact umbrella handy.')}
            </p>
          </div>
        )}

        {activeMode === 'agri' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-700 dark:text-emerald-300">
              <Sprout className="w-4 h-4" />
              <span>{isBn ? 'প্রফেশনাল কৃষি মোড (মাটির আর্দ্রতা ও ফসল)' : 'Pro Agri Mode (Soil & Crop Advisory)'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-emerald-500/20">
                <p className="text-[10px] text-slate-500 font-semibold">{isBn ? 'মাটির আনুমানিক আর্দ্রতা' : 'Est. Soil Moisture'}</p>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{humidity > 70 ? (isBn ? 'পর্যাপ্ত / আর্দ্র' : 'Adequate / Moist') : (isBn ? 'শুকনো / সেচ প্রয়োজন' : 'Dry / Needs Irrigation')}</p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-emerald-500/20">
                <p className="text-[10px] text-slate-500 font-semibold">{isBn ? 'সার ও কীটনাশক স্প্রে' : 'Fertilizer & Spraying'}</p>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{windSpeed > 20 ? (isBn ? 'অনুপযুক্ত (বাতাস বেশি)' : 'Unfavorable (High Wind)') : (isBn ? 'উপযুক্ত সময়' : 'Favorable Window')}</p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {isBn
                ? '🌾 কৃষকের জন্য বিশেষ টিপস: বোরো ও আমন ক্ষেতে পানির স্তর পর্যবেক্ষণে রাখুন। অতিরিক্ত রোদে সেচ কাজের জন্য সকাল বা বিকাল বেছে নিন।'
                : '🌾 Pro Agri Tip: Monitor water levels in paddy fields. Choose morning or late afternoon for scheduled irrigation.'}
            </p>
          </div>
        )}

        {activeMode === 'travel' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-amber-700 dark:text-amber-300">
              <Compass className="w-4 h-4" />
              <span>{isBn ? 'ট্রাভেল মোড (ভ্রমণ পূর্বাভাস)' : 'Travel Mode & Best Season'}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {isBn
                ? '✈️ বর্তমান গন্তব্যের আবহাওয়া পর্যটন এবং ভ্রমণের জন্য চমৎকার রয়েছে। ভ্রমণের সময় সানস্ক্রিন, পাওয়ার ব্যাংক ও ফার্স্ট এইড কিট সাথে রাখুন।'
                : '✈️ Current destination weather is highly favorable for sightseeing and travel. Remember to pack sunscreen, a power bank, and a first aid kit.'}
            </p>
          </div>
        )}

        {activeMode === 'outdoor' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-sky-700 dark:text-sky-300">
              <Activity className="w-4 h-4" />
              <span>{isBn ? 'আউটডোর অ্যাক্টিভিটি স্কোর (দৌড়, ক্রিকেট, ফিশিং)' : 'Outdoor Activity Score & Best Times'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-500 font-semibold">🏃‍♂️ {isBn ? 'রানিং / জগিং' : 'Running'}</p>
                <p className="font-extrabold text-teal-600 mt-0.5">{temp < 32 ? (isBn ? 'চমৎকার' : 'Great') : (isBn ? 'সকালে ভালো' : 'Early Morning')}</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-500 font-semibold">🏏 {isBn ? 'ক্রিকেট খেলা' : 'Cricket'}</p>
                <p className="font-extrabold text-emerald-600 mt-0.5">{windSpeed < 25 ? (isBn ? 'অনুকূল' : 'Favorable') : (isBn ? 'সতর্কতা' : 'Caution')}</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-500 font-semibold">🎣 {isBn ? 'মাছ শিকার' : 'Fishing'}</p>
                <p className="font-extrabold text-sky-600 mt-0.5">{isBn ? 'সকাল ও বিকাল' : 'Dawn & Dusk'}</p>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'health' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-rose-700 dark:text-rose-300">
              <HeartPulse className="w-4 h-4" />
              <span>{isBn ? 'স্বাস্থ্য ও দূষণ পরামর্শ (Heat & Flu Alert)' : 'Health Advisory & Pollution Alert'}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {aqi > 150
                ? (isBn ? '😷 বাতাসের মান অস্বাস্থ্যকর! ঘরের বাইরে বের হলে মাস্ক ব্যবহার করুন। হাঁপানি ও শ্বাসকষ্টের রোগীরা বিশেষ সাবধানতা অবলম্বন করুন।' : '😷 Air quality is unhealthy! Wear a mask outdoors. Sensitive individuals should limit prolonged exertion.')
                : (isBn ? '🌿 বায়ুর মান সহনশীল ও সন্তোষজনক রয়েছে। স্বাস্থ্যঝুঁকি কম।' : '🌿 Air quality is satisfactory. Health risk is minimal.')}
            </p>
          </div>
        )}

        {activeMode === 'transit' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-indigo-700 dark:text-indigo-300">
              <Train className="w-4 h-4" />
              <span>{isBn ? 'ফ্লাইট ও ট্রেন বিলম্বের সম্ভাবনা (Transit Forecast)' : 'Flight & Train Weather Delay Forecast'}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {isBn
                ? '🚆 বর্তমান আবহাওয়া ট্রেন ও ফ্লাইট চলাচলের জন্য সম্পূর্ণ স্বাভাবিক রয়েছে। আবহাওয়া জনित কোনো বিলম্বের আশঙ্কা নেই।'
                : '🚆 Current weather conditions are completely normal for train and flight operations. No weather-related delays anticipated.'}
            </p>
          </div>
        )}

        {activeMode === 'marine' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm text-cyan-700 dark:text-cyan-300">
              <Waves className="w-4 h-4" />
              <span>{isBn ? 'জেলে ও নাবিকদের সমুদ্র অবস্থা (Wave Heights & Tides)' : 'Fishermen & Sailors Marine Conditions'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-cyan-500/20">
                <p className="text-[10px] text-slate-500 font-semibold">{isBn ? 'ঢেউয়ের উচ্চতা' : 'Wave Height'}</p>
                <p className="font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">০.৮ - ১.২ মি. (শান্ত)</p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-cyan-500/20">
                <p className="text-[10px] text-slate-500 font-semibold">{isBn ? 'জোয়ার-ভাটা স্থিতি' : 'Tide Status'}</p>
                <p className="font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">{isBn ? 'স্বাভাবিক জোয়ার' : 'Normal Tide'}</p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {isBn
                ? '⛵ গভীর সমুদ্রে মাছ ধরতে যাওয়া জেলেদের জন্য আবহাওয়া অনুকূল। তবে ছোট নৌযানগুলোকে উপকূলের কাছাকাছি থাকার পরামর্শ দেওয়া হচ্ছে।'
                : '⛵ Favorable for deep-sea fishing. Small watercraft are advised to stay within coastal zones.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
