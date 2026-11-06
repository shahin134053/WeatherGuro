import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Calendar, Sun, CloudRain, ShieldCheck } from 'lucide-react';

interface SeasonalCropInfo {
  seasonBn: string;
  bengaliMonths: string;
  cropsBn: string;
  adviceBn: string;
  weatherFocus: string;
}

const BENGALI_SEASONS: SeasonalCropInfo[] = [
  {
    seasonBn: 'গ্রীষ্মকাল (বৈশাখ - জ্যৈষ্ঠ)',
    bengaliMonths: 'এপ্রিল - মে',
    cropsBn: 'আউশ ধান, পাট, তিল, আম, জাম, লিচু',
    adviceBn: 'কালবৈশাখী ঝড় ও শিলাবৃষ্টির সম্ভাবনা থাকে। পেকে যাওয়া ধান দ্রুত কেটে মাড়াই করুন। গাছপালায় হালকা সেচ দিন।',
    weatherFocus: 'তীব্র তাপপ্রবাহ ও কালবৈশাখী',
  },
  {
    seasonBn: 'বর্ষাকাল (আষাঢ় - শ্রাবণ)',
    bengaliMonths: 'জুন - জুলাই',
    cropsBn: 'রোপা আমন ধান, পাটের জাগ দেওয়া, গ্রীষ্মকালীন সবজি',
    adviceBn: 'ভারী বৃষ্টির জমে থাকা অতিরিক্ত পানি নিষ্কাশনের পথ খোলা রাখুন। আমন ধানের চারা রোপণের উপযুক্ত সময়।',
    weatherFocus: 'ভারী বৃষ্টিপাত ও বন্যাকবলিত এলাকা',
  },
  {
    seasonBn: 'শরৎকাল (ভাদ্র - আশ্বিন)',
    bengaliMonths: 'আগস্ট - সেপ্টেম্বর',
    cropsBn: 'আমন ধান পরিচর্যা, আগাম শীতকালীন সবজি',
    adviceBn: 'আমন ক্ষেতে সুষম সার প্রয়োগ করুন। পোকা দমনে খেত নিয়মিত পর্যবেক্ষণ করুন।',
    weatherFocus: 'মাঝারি বৃষ্টি ও রোদ',
  },
  {
    seasonBn: 'হে মন্তকাল (কার্তিক - অগ্রহায়ণ)',
    bengaliMonths: 'অক্টোবর - নভেম্বর',
    cropsBn: 'আমন ধান কাটা, সরিষা, আলু, পেঁয়াজ, রসুন',
    adviceBn: 'আমন ধান কাটার কাজ শেষ করুন এবং শীতকালীন ফসল ও সরিষার বীজ বপন শুরু করুন।',
    weatherFocus: 'হালকা শুষ্ক আবহাওয়া ও শিশির',
  },
  {
    seasonBn: 'শীতকাল (পৌষ - মাঘ)',
    bengaliMonths: 'ডিসেম্বর - জানুয়ারি',
    cropsBn: 'বোরো ধানের বীজতলা, সরিষা, গম, আলু, টমেটো',
    adviceBn: 'কুয়াশা থেকে আলু ও টমেটোর নাবি ধসা রোগ বাঁচাতে সতর্ক থাকুন। বোরো ধান রোপণে সেচ নিশ্চিত করুন।',
    weatherFocus: 'ঘন কুয়াশা ও শৈত্যপ্রবাহ',
  },
  {
    seasonBn: 'বসন্তকাল (ফাল্গুন - চৈত্র)',
    bengaliMonths: 'ফেব্রুয়ারি - মার্চ',
    cropsBn: 'বোরো ধান পরিচর্যা, তরমুজ, বাঙ্গি, ভুট্টা',
    adviceBn: 'বোরো ক্ষেতে পর্যাপ্ত পানি ধরে রাখুন। আম ও লিচুর মুকুলে রোগ দমনে প্রয়োজনীয় ছত্রাকনাশক প্রয়োগ করুন।',
    weatherFocus: 'উষ্ণ ও রৌদ্রোজ্জ্বল আবহাওয়া',
  },
];

export const SeasonalAgriCalendarCard: React.FC = () => {
  const { formatNumber } = useApp();
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);

  const activeSeason = BENGALI_SEASONS[selectedSeasonIdx];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              ঋতুভিত্তিক কৃষি ও শস্য ক্যালেন্ডার (Seasonal Crop Calendar)
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              বাংলা ৬ ঋতু অনুযায়ী কৃষকের কাজের পূর্বাভাস
            </p>
          </div>
        </div>
      </div>

      {/* Season Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {BENGALI_SEASONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSeasonIdx(idx)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSeasonIdx === idx
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {s.seasonBn.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Season Details Card */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center justify-between font-extrabold text-emerald-900 dark:text-emerald-200">
          <span>{activeSeason.seasonBn}</span>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
            {activeSeason.bengaliMonths}
          </span>
        </div>

        <div className="space-y-1 text-slate-700 dark:text-slate-300">
          <p>
            <strong>প্রধান ফসল:</strong> {activeSeason.cropsBn}
          </p>
          <p className="text-[11px] leading-relaxed bg-white/50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-emerald-500/10">
            <strong>কৃষি পরামর্শ:</strong> {activeSeason.adviceBn}
          </p>
        </div>
      </div>
    </div>
  );
};
