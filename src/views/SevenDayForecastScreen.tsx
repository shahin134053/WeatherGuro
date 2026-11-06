import React from 'react';
import { useApp } from '../context/AppContext';
import { WeatherIcon } from '../components/WeatherIcon';
import { CalendarDays, Sunrise, Sunset, Umbrella, Wind, Sun } from 'lucide-react';

export const SevenDayForecastScreen: React.FC = () => {
  const {
    weatherData,
    selectedLocation,
    formatTemp,
    formatDayName,
    formatNumber,
    getConditionName,
    getLocationName,
    languageCode,
    t,
  } = useApp();

  const daily = weatherData?.daily || [];

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>{t('sevenDayForecastTitle')}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {getLocationName(selectedLocation)}
          </h1>
        </div>
        <span className="text-xs font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full font-bold">
          7 Days
        </span>
      </div>

      {/* Daily Cards List */}
      <div className="space-y-2.5">
        {daily.map((day, idx) => {
          const isToday = idx === 0;
          return (
            <div
              key={day.date}
              className={`p-4 rounded-3xl border transition-all shadow-xs ${
                isToday
                  ? 'bg-gradient-to-r from-teal-600/10 to-emerald-600/10 border-teal-500/40 dark:border-teal-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Day Name & Weather Condition */}
                <div className="flex items-center gap-3">
                  <WeatherIcon code={day.weatherCode} className="w-8 h-8" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {formatDayName(day.date)}
                      </h3>
                      {isToday && (
                        <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full">
                          {languageCode === 'bn' ? 'আজ' : 'Today'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {getConditionName(day.weatherCode)}
                    </p>
                  </div>
                </div>

                {/* Min / Max Temperature Bar */}
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className="text-slate-900 dark:text-white">{formatTemp(day.tempMax)}</span>
                    <span className="text-slate-400 font-normal">/</span>
                    <span className="text-slate-500 dark:text-slate-400">{formatTemp(day.tempMin)}</span>
                  </div>
                  {day.pop > 0 && (
                    <div className="flex items-center justify-end gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
                      <Umbrella className="w-3 h-3" />
                      <span>{formatNumber(day.pop)}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sun & Wind Details */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {t('sunrise')}: {day.sunrise ? day.sunrise.split('T')[1] : '--'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Sunset className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    {t('sunset')}: {day.sunset ? day.sunset.split('T')[1] : '--'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
