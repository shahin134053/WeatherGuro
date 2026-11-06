import React from 'react';
import { useApp } from '../context/AppContext';
import { History, ThermometerSnowflake, Flame, Award } from 'lucide-react';

export const WeatherHistoryCard: React.FC = () => {
  const { selectedLocation, formatNumber, t } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              ঐতিহাসিক আবহাওয়া রেকর্ড ও চরম মান (Climate History)
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              বাংলাদেশের সর্বকালের সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা রেকর্ডসমূহ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-[10px] text-red-700 dark:text-red-300 font-bold">সর্বোচ্চ রেকর্ড তাপমাত্রা</p>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">৪৫.১° সেলসিয়াস</p>
            <p className="text-[9px] text-slate-400">রাজশাহী জেলা (১৯৭২)</p>
          </div>
        </div>

        <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center gap-2.5">
          <ThermometerSnowflake className="w-5 h-5 text-sky-500 shrink-0" />
          <div>
            <p className="text-[10px] text-sky-700 dark:text-sky-300 font-bold">সর্বনিম্ন রেকর্ড তাপমাত্রা</p>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">২.৬° সেলসিয়াস</p>
            <p className="text-[9px] text-slate-400">তেঁতুলিয়া, পঞ্চগড় (২০১৮)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
