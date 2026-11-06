import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchLocalPrayerTimes, PrayerTimesData, getMoonPhaseInfo, MoonPhaseData } from '../services/prayerTimesService';
import { Moon } from 'lucide-react';

export const SunMoonPrayerCard: React.FC = () => {
  const { selectedLocation, languageCode, getLocationName, formatNumber, t } = useApp();
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [moonData, setMoonData] = useState<MoonPhaseData>(() => getMoonPhaseInfo());

  useEffect(() => {
    fetchLocalPrayerTimes(selectedLocation.lat, selectedLocation.lng, languageCode).then((res) => {
      setPrayerData(res);
    });
    setMoonData(getMoonPhaseInfo());
  }, [selectedLocation, languageCode]);

  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {t('prayerTitle')}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isBn ? `${currentLocName} জিপিএস স্থানাঙ্ক ভিত্তিক` : `Calculated for ${currentLocName} coordinates`}
            </p>
          </div>
        </div>
        {prayerData && (
          <span className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
            {prayerData.hijriDate}
          </span>
        )}
      </div>

      {/* Moon Phase & Illumination Banner */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{moonData.iconSymbol}</span>
          <div>
            <p className="font-extrabold text-xs text-indigo-200">
              {isBn ? moonData.phaseNameBn : moonData.phaseName}
            </p>
            <p className="text-[10px] text-slate-400">
              {isBn ? `চাঁদের আলো: ${formatNumber(moonData.illuminationPercent)}%` : `Illumination: ${moonData.illuminationPercent}%`}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-indigo-200 font-mono">
          {moonData.phaseName}
        </span>
      </div>

      {/* Prayer Times Grid */}
      {prayerData && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-center text-xs">
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold">{t('fajrLabel')}</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5">{prayerData.fajr}</p>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold">{t('dhuhrLabel')}</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5">{prayerData.dhuhr}</p>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold">{t('asrLabel')}</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5">{prayerData.asr}</p>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold">{t('maghribLabel')}</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5">{prayerData.maghrib}</p>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold">{t('ishaLabel')}</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5">{prayerData.isha}</p>
          </div>
        </div>
      )}
    </div>
  );
};
