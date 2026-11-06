import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

export const OfflineErrorScreen: React.FC = () => {
  const { weatherData, refetchWeather, isLoadingWeather, t } = useApp();
  const current = weatherData?.current;

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
        <WifiOff className="w-8 h-8 animate-bounce" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('offlineTitle')}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('offlineSub')}</p>
      </div>

      {current && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-left space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {t('lastUpdated')}: {new Date(current.updatedAt).toLocaleTimeString()}
              </span>
            </span>
            <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
              {t('cachedDataWarning')}
            </span>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {current.temperature}°C — {current.conditionText || 'Cached Forecast'}
          </div>
        </div>
      )}

      <button
        onClick={refetchWeather}
        disabled={isLoadingWeather}
        className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
        <span>{t('retryBtn')}</span>
      </button>
    </div>
  );
};
