import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';
import { Sprout, Droplets, Volume2, VolumeX } from 'lucide-react';

export const AgriCropAdvisoryCard: React.FC = () => {
  const { weatherData, formatNumber, languageCode, t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      setIsPlaying(speaking && activeId === 'crop_advisory');
    });
    return unsub;
  }, []);

  const current = weatherData?.current;
  const daily = weatherData?.daily || [];

  const rainSumNext3Days = daily.slice(0, 3).reduce((acc, d) => acc + (d.precipitationSumMm || 0), 0);
  const isHighRain = rainSumNext3Days > 20;

  const advisoryText = isHighRain ? t('agriHighRainWarning') : t('agriDryAdvice');

  const handleToggleVoice = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      speakWeatherAlert(
        advisoryText,
        languageCode,
        () => {
          setIsPlaying(false);
        },
        'crop_advisory'
      );
    }
  };

  const isBn = languageCode === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('agriTitle')}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t('agriSub')}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleVoice}
          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer border ${
            isPlaying
              ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-md'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
          }`}
          title={isPlaying ? t('stopAudio') : t('listenAudio')}
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlaying ? t('stopAudio') : t('listenAudio')}</span>
        </button>
      </div>

      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'আগামী ৩ দিনের মোট বৃষ্টিপাত:' : 'Rainfall next 3 days:'}</span>
          </span>
          <span className="font-black text-emerald-700 dark:text-emerald-300">
            {formatNumber(Math.round(rainSumNext3Days))} mm
          </span>
        </div>

        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          {advisoryText}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {isBn ? 'ধান ও গম চাষ:' : 'Paddy & Wheat Crops:'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
            {isBn
              ? `আর্দ্রতা ${current ? formatNumber(current.humidity) : '--'}%। সেচ দেওয়ার উপযোগী সময়।`
              : `Humidity ${current ? formatNumber(current.humidity) : '--'}%. Optimal for planned irrigation.`}
          </p>
        </div>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {isBn ? 'শাকসবজি ও চা বাগান:' : 'Vegetables & Plantations:'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
            {isBn ? 'মাটির আর্দ্রতা অনুকূলে রয়েছে।' : 'Soil moisture levels are favorable.'}
          </p>
        </div>
      </div>
    </div>
  );
};
