import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchLiveCycloneTracker, CycloneStormItem } from '../services/cycloneTrackerService';
import { Compass } from 'lucide-react';

export const CycloneStormTrackerCard: React.FC = () => {
  const { formatNumber, languageCode, t } = useApp();
  const [storms, setStorms] = useState<CycloneStormItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLiveCycloneTracker().then((data) => {
      setStorms(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || storms.length === 0) return null;

  const primaryStorm = storms[0];
  const isActiveWarning = primaryStorm.status === 'Active Warning';
  const isBn = languageCode === 'bn';

  return (
    <div
      className={`rounded-3xl p-5 border transition-all shadow-md space-y-3 ${
        isActiveWarning
          ? 'bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 border-red-500/50 text-white animate-alert-pulse'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
              isActiveWarning ? 'bg-red-500 text-white animate-bounce' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
            }`}
          >
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'আন্তর্জাতিক সাইক্লোন ও ঝড় ট্র্যাকার' : 'Cyclone & Tropical Storm Tracker'}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isBn ? 'বঙ্গোপসাগর ও ভারত মহাসাগরীয় লাইভ সাইক্লোন আপডেট' : 'Bay of Bengal & Indian Ocean live tracking'}
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isActiveWarning
              ? 'bg-red-500 text-white border-red-400'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
          }`}
        >
          {isActiveWarning
            ? (isBn ? 'সতর্কবার্তা জারি' : 'Active Warning')
            : (isBn ? 'স্বাভাবিক ট্র্যাকিং' : 'Normal Monitoring')}
        </span>
      </div>

      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
            {isBn ? primaryStorm.nameBn : primaryStorm.name}
          </h3>
          <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-2 py-0.5 rounded-md">
            {primaryStorm.oceanBasin}
          </span>
        </div>

        <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">
          {isBn ? `শ্রেণী: ${primaryStorm.categoryBn}` : `Category: ${primaryStorm.category}`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-400">{isBn ? 'সর্বোচ্চ বাতাসের গতি:' : 'Max Wind Speed:'}</span>
            <p className="font-bold text-slate-900 dark:text-white">
              {formatNumber(primaryStorm.maxWindKmh)} km/h
            </p>
          </div>
          <div>
            <span className="text-slate-400">{isBn ? 'কেন্দ্রীয় চাপ:' : 'Central Pressure:'}</span>
            <p className="font-bold text-slate-900 dark:text-white">
              {formatNumber(primaryStorm.centralPressureHpa)} hPa
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400">{isBn ? 'নিকটবর্তী নদীবন্দর:' : 'Closest Seaport:'}</span>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {isBn ? primaryStorm.closestPortBn : primaryStorm.closestPort}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
