import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Anchor, Bus, Ship, Train, AlertTriangle, ShieldAlert, CheckCircle2, Info, Flame } from 'lucide-react';

export const TransitMarineAdvisoryAlertCard: React.FC = () => {
  const { weatherData, languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const windSpeed = weatherData?.current?.windSpeed || 12;
  const rainMm = weatherData?.current?.precipitationMm || 0;
  const weatherCode = weatherData?.current?.weatherCode || 0;

  // Auto hazard evaluation or manual simulation override
  const autoStormy = windSpeed > 40 || weatherCode >= 95 || rainMm > 25;
  const autoModerate = windSpeed > 25 || rainMm > 10;

  const [simulatedLevel, setSimulatedLevel] = useState<'auto' | 'normal' | 'warning' | 'danger'>('auto');

  let currentLevel = 'normal';
  if (simulatedLevel === 'normal') currentLevel = 'normal';
  else if (simulatedLevel === 'warning') currentLevel = 'warning';
  else if (simulatedLevel === 'danger') currentLevel = 'danger';
  else {
    if (autoStormy) currentLevel = 'danger';
    else if (autoModerate) currentLevel = 'warning';
    else currentLevel = 'normal';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`p-2.5 rounded-2xl ${
            currentLevel === 'danger'
              ? 'bg-red-500/20 text-red-600 dark:text-red-400 animate-bounce'
              : currentLevel === 'warning'
              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isBn ? 'নদীবন্দর, লঞ্চ ও সড়ক যাতায়াত সতর্কতা' : 'Port, Launch & Highway Safety'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'আবহাওয়া সংকেত ও জলযান চলাচল নিষেধাজ্ঞা স্ট্যাটাস' : 'Weather signal & transit restriction status'}
            </p>
          </div>
        </div>

        {/* Signal Badge */}
        <div className="flex items-center gap-1.5">
          <span className={`text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1.5 shadow-xs ${
            currentLevel === 'danger'
              ? 'bg-red-600 text-white animate-pulse border border-red-700'
              : currentLevel === 'warning'
              ? 'bg-amber-500 text-slate-950 border border-amber-600'
              : 'bg-emerald-500 text-white border border-emerald-600'
          }`}>
            {currentLevel === 'danger' ? <AlertTriangle className="w-3.5 h-3.5" /> : currentLevel === 'warning' ? <Info className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>
              {currentLevel === 'danger'
                ? (isBn ? '🔴 লাল সংকেত (মহাবিপদ)' : '🔴 Red Danger Signal 7-10')
                : currentLevel === 'warning'
                ? (isBn ? '🟡 হলুদ সংকেত (সতর্কবার্তা)' : '🟡 Yellow Warning Signal 2-4')
                : (isBn ? '🟢 সবুজ সংকেত (স্বাভাবিক)' : '🟢 Green Normal Signal')}
            </span>
          </span>
        </div>
      </div>

      {/* Simulator Toggle for Demo */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
        <span>{isBn ? 'সৈকত ও বন্দর সংকেত টেস্ট সিমুলেটর:' : 'Signal Simulation Test:'}</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSimulatedLevel('auto')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${simulatedLevel === 'auto' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-700'}`}
          >
            {isBn ? 'অটো (লাইভ)' : 'Auto'}
          </button>
          <button
            onClick={() => setSimulatedLevel('normal')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${simulatedLevel === 'normal' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700'}`}
          >
            {isBn ? 'সবুজ (স্বাভাবিক)' : 'Green'}
          </button>
          <button
            onClick={() => setSimulatedLevel('warning')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${simulatedLevel === 'warning' ? 'bg-amber-500 text-slate-950' : 'bg-white dark:bg-slate-700'}`}
          >
            {isBn ? 'হলুদ (সতর্ক)' : 'Yellow'}
          </button>
          <button
            onClick={() => setSimulatedLevel('danger')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${simulatedLevel === 'danger' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-700'}`}
          >
            {isBn ? 'লাল (বিপদ)' : 'Red'}
          </button>
        </div>
      </div>

      {/* Advisory Alert Banner */}
      <div className={`p-4 rounded-2xl border space-y-2 ${
        currentLevel === 'danger'
          ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900 text-red-900 dark:text-red-200'
          : currentLevel === 'warning'
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200'
          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
      }`}>
        <div className="font-bold text-xs flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span>{isBn ? 'বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD) ও বন্দর নির্দেশিকা' : 'BMD Port Warning & Transit Directive'}</span>
        </div>
        <p className="text-xs leading-relaxed font-semibold">
          {currentLevel === 'danger'
            ? (isBn
                ? '🚨 সমুদ্রবন্দরসমূহের জন্য ৭ থেকে ১০ নম্বর মহাবিপদ সংকেত এবং নদী বন্দরগুলোতে ৪ নম্বর বিপদ সংকেত দেখানো হচ্ছে! উপকূলীয় এলাকায় প্রবল ঝড়ো হাওয়া ও ভারী বর্ষণ চলছে। সকল প্রকার যাত্রীবাহী লঞ্চ, ট্রলার ও নৌকা চলাচল পরবর্তী নির্দেশ না দেওয়া পর্যন্ত সম্পূর্ণ স্থগিত রাখা হয়েছে।'
                : '🚨 Maritime Danger Signals 7-10 and River Port Signal 4 are in effect! Severe gales and heavy rainfall. All passenger launches, boats, and ships are completely suspended until further notice.')
            : currentLevel === 'warning'
            ? (isBn
                ? '⚠️ নদী বন্দরসমূহকে ২ থেকে ৩ নম্বর স্থানীয় হুঁশিয়ারি সংকেত দেখাতে বলা হয়েছে। কালবৈশাখী ও দমকা হাওয়ার কারণে ছোট আকারের নৌযানসমূহকে সাবধানে চলাচল করতে এবং তীরে থাকতে বলা হচ্ছে।'
                : '⚠️ River ports are advised to hoist local warning signal No. 2-3. Small watercraft are advised to exercise caution due to gusty squalls.')
            : (isBn
                ? '✅ আবহাওয়া সম্পূর্ণ শান্ত ও অনুকূল রয়েছে। নদীবন্দর ও সমুদ্রবন্দরসমূহে কোনো সংকেত বা নিষেধাজ্ঞা নেই। সকল জলযান, ট্রেন ও বাস নির্ধারিত সিডিউলে চলাচল করছে।'
                : '✅ Weather conditions are calm and favorable. No port signals or transit restrictions. All watercraft, trains, and buses operating normally.')}
        </p>
      </div>

      {/* Transit Icons Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Launch / Ship */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-center">
          <Ship className="w-5 h-5 mx-auto text-teal-600 dark:text-teal-400" />
          <p className="text-xs font-bold text-slate-900 dark:text-white">{isBn ? 'লঞ্চ ও জাহাজ' : 'Launch / Ship'}</p>
          <p className={`text-[11px] font-bold ${
            currentLevel === 'danger' ? 'text-red-600' : currentLevel === 'warning' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {currentLevel === 'danger'
              ? (isBn ? 'সম্পূর্ণ স্থগিত 🚫' : 'Suspended 🚫')
              : currentLevel === 'warning'
              ? (isBn ? 'সতর্কতা ⚠️' : 'Caution ⚠️')
              : (isBn ? 'স্বাভাবিক ✅' : 'Normal ✅')}
          </p>
        </div>

        {/* Train */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-center">
          <Train className="w-5 h-5 mx-auto text-indigo-600 dark:text-indigo-400" />
          <p className="text-xs font-bold text-slate-900 dark:text-white">{isBn ? 'রেলওয়ে ট্রেন' : 'Railway Train'}</p>
          <p className={`text-[11px] font-bold ${currentLevel === 'danger' ? 'text-amber-600' : 'text-emerald-600'}`}>
            {currentLevel === 'danger' ? (isBn ? 'धीमी गति / বিলম্ব' : 'Slow / Delayed') : (isBn ? 'চলমান ✅' : 'Active ✅')}
          </p>
        </div>

        {/* Bus / Highway */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-center">
          <Bus className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400" />
          <p className="text-xs font-bold text-slate-900 dark:text-white">{isBn ? 'বাস ও মহাসড়ক' : 'Bus / Highway'}</p>
          <p className={`text-[11px] font-bold ${currentLevel === 'danger' ? 'text-amber-600' : 'text-emerald-600'}`}>
            {currentLevel === 'danger' ? (isBn ? 'সাবধানে চলাচল' : 'Caution Advised') : (isBn ? 'নিরাপদ ✅' : 'Safe ✅')}
          </p>
        </div>
      </div>
    </div>
  );
};
