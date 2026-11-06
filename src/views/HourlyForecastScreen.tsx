import React from 'react';
import { useApp } from '../context/AppContext';
import { WeatherIcon } from '../components/WeatherIcon';
import { Clock, Droplets, Wind, SunMedium, Umbrella } from 'lucide-react';

export const HourlyForecastScreen: React.FC = () => {
  const { weatherData, selectedLocation, formatTemp, formatWind, formatTime, formatNumber, getConditionName, getLocationName, t } =
    useApp();

  const hourly = weatherData?.hourly || [];

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">
            <Clock className="w-4 h-4" />
            <span>{t('hourlyForecastTitle')}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {getLocationName(selectedLocation)}
          </h1>
        </div>
        <span className="text-xs font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full font-bold">
          24 Hours
        </span>
      </div>

      {/* Hourly Scrollable Visual Chart Cards */}
      <div className="space-y-2">
        {hourly.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:border-teal-500 transition-all shadow-2xs"
          >
            {/* Time & Weather Condition */}
            <div className="flex items-center gap-3">
              <div className="w-14 text-xs font-bold text-slate-700 dark:text-slate-300">
                {formatTime(item.time)}
              </div>
              <WeatherIcon code={item.weatherCode} isDay={item.isDay} className="w-7 h-7" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {formatTemp(item.temperature)}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {getConditionName(item.weatherCode)}
                </p>
              </div>
            </div>

            {/* Precipitation & Wind details */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                <Umbrella className="w-3.5 h-3.5" />
                <span>{formatNumber(item.pop)}%</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Wind className="w-3.5 h-3.5" />
                <span>{formatWind(item.windSpeed)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
