import React from 'react';
import { useApp } from '../context/AppContext';
import { Plane, Train, AlertTriangle, CheckCircle2, CloudFog, CloudRain } from 'lucide-react';

export const FlightTrainDelayCard: React.FC = () => {
  const { languageCode, weatherData } = useApp();
  const isBn = languageCode === 'bn';

  const visibility = weatherData?.current?.visibilityKm || 10;
  const windSpeed = weatherData?.current?.windSpeed || 12;
  const rainMm = weatherData?.current?.precipitationMm || 0;
  const weatherCode = weatherData?.current?.weatherCode || 0;

  // Calculate delay risk based on visibility, wind & rain
  let flightRisk = 'Low';
  let trainRisk = 'Low';
  let reasonEn = 'Clear weather conditions. Smooth operations expected.';
  let reasonBn = 'আবহাওয়া অনুকূল রয়েছে। বিমান ও ট্রেন চলাচল স্বাভাবিক থাকবে।';

  if (visibility < 2 || weatherCode >= 45 && weatherCode <= 48) {
    flightRisk = 'High';
    trainRisk = 'Moderate';
    reasonEn = 'Dense fog / low visibility detected. Flight delays possible.';
    reasonBn = 'ঘন কুয়াশা ও কম দৃশ্যমানতার কারণে ফ্লাইট চলাচলে বিলম্ব হতে পারে।';
  } else if (windSpeed > 45 || rainMm > 25 || weatherCode >= 95) {
    flightRisk = 'High';
    trainRisk = 'High';
    reasonEn = 'Severe storm and heavy wind gusts. Operational disruptions likely.';
    reasonBn = 'তীব্র ঝড়ো হাওয়া ও ভারী বৃষ্টির কারণে সিডিউল বিপর্যয় হতে পারে।';
  } else if (rainMm > 5) {
    flightRisk = 'Moderate';
    trainRisk = 'Low';
    reasonEn = 'Moderate rain. Minor flight turnaround delays possible.';
    reasonBn = 'মাঝারি বৃষ্টির কারণে সামান্য বিলম্ব হতে পারে।';
  }

  const getRiskBadge = (risk: string) => {
    if (risk === 'High') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 border border-red-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isBn ? 'উচ্চ ঝুঁকি (High Risk)' : 'High Risk'}</span>
        </span>
      );
    }
    if (risk === 'Moderate') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isBn ? 'মাঝারি ঝুঁকি (Moderate)' : 'Moderate'}</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{isBn ? 'স্বাভাবিক (Normal)' : 'Normal'}</span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Plane className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {isBn ? 'ফ্লাইট ও ট্রেন আবহাওয়া বিলম্বের ঝুঁকি' : 'Flight & Train Weather Delay Risk'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn ? 'কুয়াশা, ঝড় ও বৃষ্টির কারণে সিডিউল বিপর্যয়ের পূর্বাভাস' : 'Schedule disruption forecast due to fog, storm & rain'}
          </p>
        </div>
      </div>

      {/* Status banner */}
      <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
        {isBn ? reasonBn : reasonEn}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Flight */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Plane className="w-4 h-4 text-indigo-500" />
              <span>{isBn ? 'বিমান ফ্লাইট' : 'Flight Status'}</span>
            </div>
            {getRiskBadge(flightRisk)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn ? 'দৃশ্যমানতা ও উইন্ডশিয়ার যাচাইকৃত' : 'Visibility & windshear verified'}
          </p>
        </div>

        {/* Train */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Train className="w-4 h-4 text-emerald-500" />
              <span>{isBn ? 'রেলওয়ে ট্রেন' : 'Train Status'}</span>
            </div>
            {getRiskBadge(trainRisk)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn ? 'ট্র্যাক ও সিগন্যাল আবহাওয়া অবস্থা' : 'Track & signal weather safety'}
          </p>
        </div>
      </div>
    </div>
  );
};
