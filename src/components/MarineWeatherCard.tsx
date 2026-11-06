import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchCoastalMarineWeather, MarineWeatherData } from '../services/marineWeatherApi';
import { Waves } from 'lucide-react';

export const MarineWeatherCard: React.FC = () => {
  const { selectedLocation, formatNumber, languageCode, t } = useApp();
  const [marine, setMarine] = useState<MarineWeatherData | null>(null);

  const isBn = languageCode === 'bn';

  useEffect(() => {
    fetchCoastalMarineWeather(
      selectedLocation.lat,
      selectedLocation.lng,
      selectedLocation.name,
      selectedLocation.localName || selectedLocation.name
    ).then((res) => {
      setMarine(res);
    });
  }, [selectedLocation]);

  if (!marine) return null;

  const locName = isBn ? (marine.locationNameBn || selectedLocation.localName || selectedLocation.name) : (marine.locationName || selectedLocation.name);
  const safetyStatus = isBn ? marine.swimmingSafetyBn : (marine.swimmingSafety || 'Safe');
  const seaStatus = isBn ? marine.seaStatusBn : (marine.seaStatus || 'Calm');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Waves className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t('marineTitle')}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {t('marineSub')}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-sky-500/10 text-sky-700 dark:text-sky-300 font-extrabold px-2 py-0.5 rounded-full border border-sky-500/20">
          {isBn ? 'সমুদ্র বুলেটিন' : 'Marine Report'}
        </span>
      </div>

      <div className="p-3.5 bg-gradient-to-r from-sky-500/10 to-teal-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10.5px] font-extrabold text-sky-700 dark:text-sky-300 uppercase tracking-wide">
            {safetyStatus}
          </span>
          <h3 className="font-black text-sm text-slate-900 dark:text-white mt-0.5">
            {locName}
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
            {isBn ? 'সমুদ্রের অবস্থা: ' : 'Sea Condition: '}
            <strong className="text-sky-600 dark:text-sky-400 font-bold">{seaStatus}</strong>
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-black text-sky-600 dark:text-sky-400">
            {formatNumber(marine.waveHeightMeters)} {isBn ? 'মি.' : 'm'}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {t('waveHeightLabel')}
          </p>
        </div>
      </div>
    </div>
  );
};
