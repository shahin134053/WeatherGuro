import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FlagBadge } from '../components/FlagBadge';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';
import { ShieldAlert, CheckCircle2, MapPin, Building2, AlertTriangle, Info, Volume2, VolumeX } from 'lucide-react';

export const WeatherAlertsScreen: React.FC = () => {
  const { weatherData, selectedLocation, selectedCountry, getLocationName, languageCode, t } = useApp();
  const [playingAlertId, setPlayingAlertId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      if (!speaking) {
        setPlayingAlertId(null);
      } else if (activeId && activeId.startsWith('alert_')) {
        setPlayingAlertId(activeId.replace('alert_', ''));
      }
    });
    return unsub;
  }, []);

  const alerts = weatherData?.alerts || [];
  const isBn = languageCode === 'bn';

  const handleToggleAlertSpeech = (id: string, title: string, desc: string, instructions?: string) => {
    if (playingAlertId === id) {
      stopSpeech();
      setPlayingAlertId(null);
      return;
    }

    setPlayingAlertId(id);
    const speechText = isBn
      ? `সতর্কবার্তা: ${title}। ${desc}। ${instructions ? `নির্দেশনা: ${instructions}` : ''}`
      : `Weather Advisory: ${title}. ${desc}. ${instructions ? `Instructions: ${instructions}` : ''}`;
    speakWeatherAlert(
      speechText,
      languageCode,
      () => {
        setPlayingAlertId(null);
      },
      `alert_${id}`
    );
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>{t('alertsTitle')}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {getLocationName(selectedLocation)}
          </h1>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-emerald-500/20">
          <FlagBadge countryCode={selectedCountry.code} />
          <span>{isBn ? 'BMD অফিসিয়াল সতর্কতা' : 'BMD Official Feed'}</span>
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('noActiveAlerts')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('noActiveAlertsSub')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const isPlaying = playingAlertId === alert.id;
            const title = isBn ? (alert.titleBn || alert.title) : alert.title;
            const desc = isBn ? (alert.descriptionBn || alert.description) : alert.description;
            const instructions = isBn ? (alert.instructionsBn || alert.instructions) : (alert.instructions || '');
            const area = isBn ? (alert.affectedAreaBn || alert.affectedArea) : alert.affectedArea;

            return (
              <div
                key={alert.id}
                className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded-full">
                        {alert.severity} {isBn ? 'সতর্কবার্তা' : 'WARNING'}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleAlertSpeech(alert.id, title, desc, instructions)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isPlaying
                        ? 'bg-red-600 text-white animate-pulse shadow-md'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                    }`}
                    title={isPlaying ? t('stopAudio') : t('listenAudio')}
                  >
                    {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isPlaying ? t('stopAudio') : t('listenAudio')}</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {desc}
                </p>

                {/* Public Safety Instructions */}
                {instructions && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                      <Info className="w-4 h-4" />
                      <span>{t('alertInstructions')}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{instructions}</p>
                  </div>
                )}

                {/* Metadata Footer */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span className="truncate">{area}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Building2 className="w-3 h-3 text-teal-500" />
                    <span className="truncate">{alert.source}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
