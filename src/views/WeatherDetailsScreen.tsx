import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Eye,
  Wind,
  Droplets,
  Gauge,
  Cloud,
  Thermometer,
  Compass,
  Sparkles,
  Sunrise,
  Sunset,
} from 'lucide-react';

export const WeatherDetailsScreen: React.FC = () => {
  const { weatherData, selectedLocation, formatTemp, formatWind, formatNumber, t } = useApp();
  const current = weatherData?.current;
  const air = weatherData?.airQuality;

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {selectedLocation.localName || selectedLocation.name} — Weather Metrics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Detailed environmental measurements</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* UV Index */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('uvIndex')}</span>
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {current ? formatNumber(current.uvIndex) : '--'}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            {current && current.uvIndex > 7 ? 'Very High — Protection Required' : 'Moderate Sun Risk'}
          </p>
        </div>

        {/* Air Quality AQI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('airQuality')}</span>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {air ? formatNumber(air.aqi) : '45'} AQI
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {air ? air.aqiStatus : 'Good'}
          </p>
        </div>

        {/* Visibility */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('visibility')}</span>
            <Eye className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {current ? formatNumber(current.visibilityKm) : '--'} km
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Clear Atmospheric Horizon</p>
        </div>

        {/* Dew Point */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('dewPoint')}</span>
            <Thermometer className="w-5 h-5 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {current ? formatTemp(current.dewPoint) : '--'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Comfort Level Indicator</p>
        </div>

        {/* Wind Vector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('windDirection')}</span>
            <Compass className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {current ? current.windDirectionText : '--'} ({current ? formatNumber(current.windDirectionDeg) : '0'}°)
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Compass Bearing</p>
        </div>

        {/* Cloud Cover */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('cloudCover')}</span>
            <Cloud className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {current ? formatNumber(current.cloudCover) : '--'}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Satellite Sky Coverage</p>
        </div>
      </div>
    </div>
  );
};
