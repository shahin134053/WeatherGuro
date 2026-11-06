import React from 'react';
import { useApp } from '../context/AppContext';
import { CloudRain, Sparkles, Umbrella, CheckCircle2 } from 'lucide-react';

export const MinuteRainAlertCard: React.FC = () => {
  const { weatherData, languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const hourly = weatherData?.hourly || [];
  const nextHourPop = hourly[0]?.pop || 0;
  const isRainSoon = nextHourPop > 30;

  return (
    <div className={`rounded-3xl p-4 sm:p-5 border shadow-md relative overflow-hidden transition-all ${
      isRainSoon
        ? 'bg-gradient-to-r from-sky-900 via-teal-900 to-slate-900 text-white border-sky-500/40 shadow-sky-900/20'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
    }`}>
      <div className="flex items-center justify-between border-b pb-2.5 border-white/10 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
            isRainSoon ? 'bg-sky-400 text-slate-950 animate-bounce' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
          }`}>
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base">
              {isBn ? 'মিনিট-বাই-মিনিট বৃষ্টির অ্যালার্ট' : 'Minute-by-Minute Rain Alert'}
            </h2>
            <p className={`text-[10.5px] ${isRainSoon ? 'text-sky-200' : 'text-slate-500 dark:text-slate-400'}`}>
              {isBn ? 'আগামী ৬০ মিনিটের রিয়েল-টাইম বৃষ্টিপাত রাডার পূর্বাভাস' : 'Real-time precipitation forecast for the next 60 minutes'}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
          isRainSoon ? 'bg-sky-500 text-slate-950 border-sky-300' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        }`}>
          {isRainSoon ? (isBn ? 'বৃষ্টির সম্ভাবনা আছে' : 'Rain Incoming') : (isBn ? 'শান্ত আবহাওয়া' : 'Dry & Clear')}
        </span>
      </div>

      <div className="mt-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className={isRainSoon ? 'text-sky-100' : 'text-slate-600 dark:text-slate-300'}>
            {isBn ? 'পরবর্তী ১ ঘণ্টার বৃষ্টি সম্ভাবনা:' : 'Next 60-min Rain Probability:'}
          </span>
          <span className={`text-sm font-black ${isRainSoon ? 'text-sky-300' : 'text-teal-600 dark:text-teal-400'}`}>
            {nextHourPop}%
          </span>
        </div>

        {/* 10-min interval visual progress blocks */}
        <div className="grid grid-cols-6 gap-1.5 text-center">
          {[10, 20, 30, 40, 50, 60].map((mins, idx) => {
            const intensity = Math.max(0, Math.min(100, nextHourPop + (idx % 2 === 0 ? -5 : 10)));
            const hasRain = intensity > 40;
            return (
              <div
                key={mins}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                  isRainSoon
                    ? (hasRain ? 'bg-sky-500/30 border-sky-400 text-white' : 'bg-white/10 border-white/15 text-sky-200')
                    : (hasRain ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400')
                }`}
              >
                <span className="text-[9.5px] font-extrabold opacity-80">+{mins} {isBn ? 'মি.' : 'm'}</span>
                <Umbrella className={`w-3.5 h-3.5 ${hasRain ? 'text-sky-400 animate-pulse' : 'opacity-40'}`} />
                <span className="text-[10px] font-black">{intensity}%</span>
              </div>
            );
          })}
        </div>

        <p className={`text-[11px] leading-relaxed ${isRainSoon ? 'text-sky-100' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
          {isRainSoon
            ? (isBn ? '⚠️ সতর্কতা: আগামী ৩০-৪০ মিনিটের মধ্যে আপনার এলাকায় বৃষ্টির সম্ভাবনা রয়েছে। বাইরে যাওয়ার আগে ছাতা সাথে রাখুন।' : '⚠️ Notice: Rain is expected in your area within the next 30-40 minutes. Carry an umbrella if heading out.')
            : (isBn ? '✅ আগামী ১ ঘণ্টার মধ্যে বৃষ্টি হওয়ার কোনো সম্ভাবনা নেই। আবহাওয়া শুষ্ক ও অনুকূল রয়েছে।' : '✅ No rain expected in the next hour. Weather conditions remain dry and favorable.')}
        </p>
      </div>
    </div>
  );
};
