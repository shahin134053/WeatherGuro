import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Clock,
  CalendarDays,
  CloudRain,
  ArrowRightLeft,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
} from 'lucide-react';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';

interface Props {
  onSelectAction: (actionKey: string) => void;
}

export const DailyWeatherForecastVipHub: React.FC<Props> = ({ onSelectAction }) => {
  const { weatherData, languageCode, getLocationName, selectedLocation, formatTemp, formatNumber, getConditionName } = useApp();
  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);
  const current = weatherData?.current;

  const [isSpeakingThis, setIsSpeakingThis] = useState(false);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      setIsSpeakingThis(speaking && activeId === 'daily_forecast_hub');
    });
    return unsub;
  }, []);

  const handleAudioBulletin = () => {
    if (isSpeakingThis) {
      stopSpeech();
      setIsSpeakingThis(false);
      return;
    }

    const cond = current ? getConditionName(current.weatherCode) : (isBn ? 'পরিষ্কার আকাশ' : 'Clear Sky');
    const tempStr = current ? formatNumber(Math.round(current.temperature)) : '২৮';
    const humStr = current ? formatNumber(current.humidity) : '৬৫';
    const windStr = current ? formatNumber(Math.round(current.windSpeed)) : '১২';

    const text = isBn
      ? `দৈনন্দিন আবহাওয়া ও পূর্বাভাস বুলেটিন। ${currentLocName}-এ বর্তমান তাপমাত্রা ${tempStr} ডিগ্রি সেলসিয়াস, আবহাওয়া ${cond}। বাতাসে আর্দ্রতা ${humStr} শতাংশ এবং বাতাসের গতিবেগ প্রতি ঘণ্টায় ${windStr} কিলোমিটার। আগামী ২৪ ঘণ্টা এবং ৭ দিনের পূর্বাভাস দেখতে নিচের আইকনগুলোতে ট্যাপ করুন।`
      : `Daily Weather and Forecast Bulletin. In ${currentLocName}, the current temperature is ${Math.round(current?.temperature || 28)} degrees Celsius with ${cond}. Humidity is ${current?.humidity || 65} percent and wind speed is ${Math.round(current?.windSpeed || 12)} kilometers per hour. Tap any icon below for detailed hourly and 7-day outlooks.`;

    speakWeatherAlert(
      text,
      languageCode,
      () => {
        setIsSpeakingThis(false);
      },
      'daily_forecast_hub'
    );
  };

  const weatherItems = [
    {
      id: 'current_temp',
      icon: Sun,
      badge: '☀️',
      titleBn: 'লাইভ আবহাওয়া',
      titleEn: 'Live Weather',
      descBn: current ? `${formatTemp(current.temperature)} • ${getConditionName(current.weatherCode)}` : '২৮°C • নির্মল',
      descEn: current ? `${Math.round(current.temperature)}°C • Current` : '28°C • Current',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20',
    },
    {
      id: 'hourly',
      icon: Clock,
      badge: '⏱️',
      titleBn: '২৪ ঘণ্টার পূর্বাভাস',
      titleEn: '24h Hourly',
      descBn: 'প্রতি ঘণ্টার তাপমাত্রা ও বৃষ্টির সম্ভাবনা',
      descEn: 'Hourly rain & temperature trend',
      color: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 hover:bg-teal-500/20',
    },
    {
      id: 'seven_day',
      icon: CalendarDays,
      badge: '📅',
      titleBn: '৭ দিনের পূর্বাভাস',
      titleEn: '7-Day Outlook',
      descBn: 'সাপ্তাহিক ঝড়, বৃষ্টি ও রোদের আবহ',
      descEn: 'Weekly weather progression',
      color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 hover:bg-sky-500/20',
    },
    {
      id: 'rain_radar',
      icon: CloudRain,
      badge: '🌧️',
      titleBn: 'মিনিট বৃষ্টির রাডার',
      titleEn: 'Minute Rain Radar',
      descBn: 'পরবর্তী ৬০ মিনিটের তাৎক্ষণিক বৃষ্টিপাত',
      descEn: 'Next 60 minutes rain forecast',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20',
    },
    {
      id: 'comparison',
      icon: ArrowRightLeft,
      badge: '🔄',
      titleBn: 'দুই শহরের তুলনা',
      titleEn: 'City Compare',
      descBn: 'অন্যান্য শহরের সাথে আবহাওয়ার তুলনা',
      descEn: 'Compare two cities side by side',
      color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20',
    },
    {
      id: 'satellite',
      icon: Radio,
      badge: '🛰️',
      titleBn: 'স্যাটেলাইট ক্লাউড',
      titleEn: 'Satellite Cloud',
      descBn: 'লাইভ অ্যানিমেটেড মেঘের মুভমেন্ট',
      descEn: 'Live satellite cloud animation',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-teal-500/10 border border-amber-500/25 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-amber-500/15">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-xs">
            <Sun className="w-5 h-5 animate-spin" />
          </span>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isBn ? 'দৈনন্দিন আবহাওয়া বা পূর্বাভাস হাব' : 'Daily Weather & Forecast VIP Hub'}</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                DAILY VIP
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isBn ? 'প্রতিটি প্রধান পূর্বাভাস আইকনে ট্যাপ করে বিস্তারিত দেখুন' : 'Tap any weather feature icon for instant detailed view'}
            </p>
          </div>
        </div>

        {/* Audio Button */}
        <button
          onClick={handleAudioBulletin}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 ${
            isSpeakingThis
              ? 'bg-red-600 text-white animate-pulse shadow-md'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40'
          }`}
          title={isSpeakingThis ? (isBn ? 'অডিও থামান' : 'Stop Audio') : (isBn ? 'পূর্বাভাস শুনুন' : 'Listen Bulletin')}
        >
          {isSpeakingThis ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-300" />}
          <span className="text-[11px] font-bold">
            {isSpeakingThis ? (isBn ? 'থামান' : 'Stop') : (isBn ? 'ভয়েসে শুনুন' : 'Listen')}
          </span>
        </button>
      </div>

      {/* VIP Icon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {weatherItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectAction(item.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 shadow-xs hover:scale-105 active:scale-95 ${item.color}`}
          >
            <span className="text-2xl pt-0.5">{item.badge}</span>
            <h4 className="font-black text-xs text-slate-900 dark:text-white truncate w-full">
              {isBn ? item.titleBn : item.titleEn}
            </h4>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 truncate w-full font-semibold">
              {isBn ? item.descBn : item.descEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
