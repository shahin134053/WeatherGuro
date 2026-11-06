import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  Calendar,
  Activity,
  Globe2,
  Waves,
  Ship,
  Train,
  Shirt,
  Volume2,
  VolumeX,
  Leaf,
  Sparkles,
} from 'lucide-react';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';

interface Props {
  onSelectAction: (actionKey: string) => void;
}

export const AgriAirNatureVipHub: React.FC<Props> = ({ onSelectAction }) => {
  const { weatherData, languageCode, getLocationName, selectedLocation } = useApp();
  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);
  const aqi = weatherData?.airQuality?.aqi || 45;
  const humidity = weatherData?.current?.humidity || 65;

  const [isSpeakingThis, setIsSpeakingThis] = useState(false);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      setIsSpeakingThis(speaking && activeId === 'agri_air_hub');
    });
    return unsub;
  }, []);

  const handleAudioBulletin = () => {
    if (isSpeakingThis) {
      stopSpeech();
      setIsSpeakingThis(false);
      return;
    }

    const aqiLevel = aqi <= 50 ? (isBn ? 'চমৎকার ও স্বাস্থ্যকর' : 'Good and Healthy') : aqi <= 100 ? (isBn ? 'সহনশীল' : 'Moderate') : (isBn ? 'অস্বাস্থ্যকর' : 'Unhealthy');
    const text = isBn
      ? `কৃষি, বাতাস ও প্রকৃতি বিষয়ক বিশেষ অডিও বুলেটিন। ${currentLocName}-এর বর্তমান বাতাসের মান সূচক বা একিউআই ${aqi}, যা ${aqiLevel} পর্যায়ে রয়েছে। কৃষকের জন্য মাটির আর্দ্রতা বর্তমানে ${humidity} শতাংশ। উপকূলীয় অঞ্চলে জোয়ার-ভাটা ও জলযান চলাচল স্ট্যাটাস দেখতে নিচের আইকনগুলোতে ক্লিক করুন।`
      : `Agriculture, Air, and Nature Special Audio Bulletin. In ${currentLocName}, the current Air Quality Index is ${aqi}, categorized as ${aqiLevel}. Estimated soil moisture is currently around ${humidity} percent. Tap any icon below for agricultural calendar, marine tides, and transit advisories.`;

    speakWeatherAlert(
      text,
      languageCode,
      () => {
        setIsSpeakingThis(false);
      },
      'agri_air_hub'
    );
  };

  const natureItems = [
    {
      id: 'agri_advisory',
      icon: Sprout,
      badge: '🌾',
      titleBn: 'কৃষি ও মাটির আর্দ্রতা',
      titleEn: 'Agri & Soil Moisture',
      descBn: 'সেচ ও সার স্প্রে পরামর্শ',
      descEn: 'Irrigation & spraying advice',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20',
    },
    {
      id: 'agri_calendar',
      icon: Calendar,
      badge: '🗓️',
      titleBn: 'ঋতুভিত্তিক শস্য ক্যালেন্ডার',
      titleEn: 'Seasonal Crop Calendar',
      descBn: 'বাংলা ৬ ঋতুর ফসলি গাইড',
      descEn: '6-Season Bengali agri guide',
      color: 'bg-lime-500/10 text-lime-700 dark:text-lime-300 border-lime-500/30 hover:bg-lime-500/20',
    },
    {
      id: 'local_aqi',
      icon: Activity,
      badge: '🍃',
      titleBn: 'লাইভ বাতাস ও বায়ুমান',
      titleEn: 'Live Air Quality (AQI)',
      descBn: `AQI: ${aqi} • PM2.5 ও দূষণ`,
      descEn: `AQI: ${aqi} • PM2.5 metrics`,
      color: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 hover:bg-teal-500/20',
    },
    {
      id: 'world_ranking',
      icon: Globe2,
      badge: '🌍',
      titleBn: 'বিশ্ব দূষণ ও পরিচ্ছন্ন র‍্যাংক',
      titleEn: 'World Eco Ranking',
      descBn: 'সবচেয়ে দূষিত ও পরিবেশবান্ধব শহর',
      descEn: 'Most polluted vs greenest cities',
      color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20',
    },
    {
      id: 'tide_moon',
      icon: Waves,
      badge: '🌊',
      titleBn: 'জোয়ার-ভাটা ও চন্দ্রকলা',
      titleEn: 'Tides & Moon Phases',
      descBn: 'উচ্চ জোয়ার, ভাটা ও চাঁদের চক্র',
      descEn: 'High/low tide & lunar cycle',
      color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 hover:bg-sky-500/20',
    },
    {
      id: 'port_marine',
      icon: Ship,
      badge: '🚢',
      titleBn: 'নদীবন্দর ও লঞ্চ সতর্কতা',
      titleEn: 'Port & Launch Safety',
      descBn: '১-১০ নম্বর সংকেত ও নিষেধাজ্ঞা',
      descEn: 'Signals 1-10 & restrictions',
      color: 'bg-cyan-600/10 text-cyan-700 dark:text-cyan-300 border-cyan-600/30 hover:bg-cyan-600/20',
    },
    {
      id: 'transit_delay',
      icon: Train,
      badge: '🚆',
      titleBn: 'ট্রেন ও ফ্লাইট ট্রানজিট',
      titleEn: 'Train & Flight Risk',
      descBn: 'কুয়াশা ও ঝড়জনিত বিলম্ব সম্ভাবনা',
      descEn: 'Delay risk from fog & storm',
      color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20',
    },
    {
      id: 'lifestyle_wear',
      icon: Shirt,
      badge: '👕',
      titleBn: 'পোশাক ও স্বাস্থ্য পরামর্শ',
      titleEn: 'What to Wear & Health',
      descBn: 'আজকের আবহাওয়ায় কী পরবেন',
      descEn: 'Apparel & outdoor activity advice',
      color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/25 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-emerald-500/15">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs">
            <Leaf className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isBn ? 'কৃষি, বাতাস ও প্রকৃতি হাব' : 'Agri, Air & Nature VIP Hub'}</span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                NATURE VIP
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isBn ? 'ফসল, বায়ুমান, সমুদ্র, জোয়ার-ভাটা ও পরিবেশবান্ধব সেবা' : 'Crops, air quality, tides, marine and eco-services'}
            </p>
          </div>
        </div>

        {/* Audio Button */}
        <button
          onClick={handleAudioBulletin}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 ${
            isSpeakingThis
              ? 'bg-red-600 text-white animate-pulse shadow-md'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-900 dark:text-emerald-200 border border-emerald-500/40'
          }`}
          title={isSpeakingThis ? (isBn ? 'অডিও থামান' : 'Stop Audio') : (isBn ? 'প্রকৃতি বুলেটিন শুনুন' : 'Listen Bulletin')}
        >
          {isSpeakingThis ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />}
          <span className="text-[11px] font-bold">
            {isSpeakingThis ? (isBn ? 'থামান' : 'Stop') : (isBn ? 'ভয়েসে শুনুন' : 'Listen')}
          </span>
        </button>
      </div>

      {/* VIP Icon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {natureItems.map((item) => (
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
