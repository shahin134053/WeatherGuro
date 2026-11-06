import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe2, ShieldAlert, Award, Sparkles, Volume2, VolumeX, Navigation } from 'lucide-react';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';

interface MonthlyCityRecord {
  monthNameEn: string;
  monthNameBn: string;
  pollutedCityEn: string;
  pollutedCityBn: string;
  pollutedCountryEn: string;
  pollutedCountryBn: string;
  pollutedAqi: number;
  greenCityEn: string;
  greenCityBn: string;
  greenCountryEn: string;
  greenCountryBn: string;
  greenAqi: number;
  funFactEn: string;
  funFactBn: string;
}

const MONTHLY_RECORDS: MonthlyCityRecord[] = [
  {
    monthNameEn: 'January',
    monthNameBn: 'জানুয়ারি',
    pollutedCityEn: 'New Delhi',
    pollutedCityBn: 'নয়াদিল্লি',
    pollutedCountryEn: 'India',
    pollutedCountryBn: 'ভারত',
    pollutedAqi: 385,
    greenCityEn: 'Helsinki',
    greenCityBn: 'হেলসিঙ্কি',
    greenCountryEn: 'Finland',
    greenCountryBn: 'ফিনল্যান্ড',
    greenAqi: 18,
    funFactEn: 'Winter heating and calm winds peak pollution in South Asia during January.',
    funFactBn: 'জানুয়ারিতে শীতকালীন উত্তাপ এবং কম বাতাসের গতির কারণে দক্ষিণ এশিয়ায় দূষণ সর্বোচ্চ থাকে।',
  },
  {
    monthNameEn: 'February',
    monthNameBn: 'ফেব্রুয়ারি',
    pollutedCityEn: 'Lahore',
    pollutedCityBn: 'লাহোর',
    pollutedCountryEn: 'Pakistan',
    pollutedCountryBn: 'পাকিস্তান',
    pollutedAqi: 350,
    greenCityEn: 'Zurich',
    greenCityBn: 'জুরিখ',
    greenCountryEn: 'Switzerland',
    greenCountryBn: 'সুইজারল্যান্ড',
    greenAqi: 21,
    funFactEn: 'High particulate matter accumulation occurs due to atmospheric inversion.',
    funFactBn: 'বায়ুমণ্ডলীয় বিপরীত অবস্থার কারণে কণা দূষণ বৃদ্ধি পায়।',
  },
  {
    monthNameEn: 'March',
    monthNameBn: 'মার্চ',
    pollutedCityEn: 'Dhaka',
    pollutedCityBn: 'ঢাকা',
    pollutedCountryEn: 'Bangladesh',
    pollutedCountryBn: 'বাংলাদেশ',
    pollutedAqi: 275,
    greenCityEn: 'Reykjavik',
    greenCityBn: 'রেইকিয়াভিক',
    greenCountryEn: 'Iceland',
    greenCountryBn: 'আইসল্যান্ড',
    greenAqi: 15,
    funFactEn: 'Dry spring weather and brick kiln operations elevate regional AQI levels.',
    funFactBn: 'শুষ্ক বসন্তকাল ও ইটভাটার কার্যক্রমের কারণে এই সময়ে এ অঞ্চলে বায়ুমান কিছুটা কমে।',
  },
  {
    monthNameEn: 'April',
    monthNameBn: 'এপ্রিল',
    pollutedCityEn: 'Ho Chi Minh City',
    pollutedCityBn: 'হো চি মিন সিটি',
    pollutedCountryEn: 'Vietnam',
    pollutedCountryBn: 'ভিয়েতনাম',
    pollutedAqi: 210,
    greenCityEn: 'Stockholm',
    greenCityBn: 'স্টকহোম',
    greenCountryEn: 'Sweden',
    greenCountryBn: 'সুইডেন',
    greenAqi: 19,
    funFactEn: 'Transboundary agricultural burning affects air quality during spring transition.',
    funFactBn: 'কৃষি বর্জ্য পোড়ানোর কারণে বসন্তের শুরুতে বায়ুদূষণ সামান্য বৃদ্ধি পায়।',
  },
  {
    monthNameEn: 'May',
    monthNameBn: 'মে',
    pollutedCityEn: 'Baghdad',
    pollutedCityBn: 'বাগদাদ',
    pollutedCountryEn: 'Iraq',
    pollutedCountryBn: 'ইরাক',
    pollutedAqi: 240,
    greenCityEn: 'Copenhagen',
    greenCityBn: 'কোপেনহেগেন',
    greenCountryEn: 'Denmark',
    greenCountryBn: 'ডেনমার্ক',
    greenAqi: 22,
    funFactEn: 'Dust storms and dry desert winds increase particulate concentrations.',
    funFactBn: 'ধূলিঝড় এবং শুষ্ক মরুভূমির বাতাসের কারণে কণার ঘনত্ব বৃদ্ধি পায়।',
  },
  {
    monthNameEn: 'June',
    monthNameBn: 'জুন',
    pollutedCityEn: 'Kuwait City',
    pollutedCityBn: 'কুয়েত সিটি',
    pollutedCountryEn: 'Kuwait',
    pollutedCountryBn: 'কুয়েত',
    pollutedAqi: 230,
    greenCityEn: 'Vienna',
    greenCityBn: 'ভিয়েনা',
    greenCountryEn: 'Austria',
    greenCountryBn: 'অস্ট্রিয়া',
    greenAqi: 24,
    funFactEn: 'Intense summer heat and urban dust storms characterize mid-year AQI.',
    funFactBn: 'তীব্র গ্রীষ্মের তাপ এবং শহুরে ধূলিঝড় এই সময়ের মূল বৈশিষ্ট্য।',
  },
  {
    monthNameEn: 'July',
    monthNameBn: 'জুলাই',
    pollutedCityEn: 'Jakarta',
    pollutedCityBn: 'জাকার্তা',
    pollutedCountryEn: 'Indonesia',
    pollutedCountryBn: 'ইন্দোনেশিয়া',
    pollutedAqi: 195,
    greenCityEn: 'Tallinn',
    greenCityBn: 'তালিন',
    greenCountryEn: 'Estonia',
    greenCountryBn: 'এস্তোনিয়া',
    greenAqi: 16,
    funFactEn: 'Traffic congestion and industrial emissions sustain particulate levels.',
    funFactBn: 'ট্রাফিক জ্যাম ও শিল্প কারখানার নির্গমন কণা দূষণ বজায় রাখে।',
  },
  {
    monthNameEn: 'August',
    monthNameBn: 'আগস্ট',
    pollutedCityEn: 'Cairo',
    pollutedCityBn: 'কায়রো',
    pollutedCountryEn: 'Egypt',
    pollutedCountryBn: 'মিশর',
    pollutedAqi: 215,
    greenCityEn: 'Zurich',
    greenCityBn: 'জুরিখ',
    greenCountryEn: 'Switzerland',
    greenCountryBn: 'সুইজারল্যান্ড',
    greenAqi: 20,
    funFactEn: 'Stagnant summer air traps vehicle exhaust over metropolitan centers.',
    funFactBn: 'স্থবির গ্রীষ্মের বাতাস শহুরে এলাকায় গাড়ির ধোঁয়া আটকে ফেলে।',
  },
  {
    monthNameEn: 'September',
    monthNameBn: 'সেপ্টেম্বর',
    pollutedCityEn: 'Dubai',
    pollutedCityBn: 'দুবাই',
    pollutedCountryEn: 'UAE',
    pollutedCountryBn: 'সংযুক্ত আরব আমিরাত',
    pollutedAqi: 180,
    greenCityEn: 'Helsinki',
    greenCityBn: 'হেলসিঙ্কি',
    greenCountryEn: 'Finland',
    greenCountryBn: 'ফিনল্যান্ড',
    greenAqi: 17,
    funFactEn: 'Humidity and coastal stagnation affect particulate dispersion.',
    funFactBn: 'আর্দ্রতা এবং উপকূলীয় স্থবিরতা কণার প্রসারণকে প্রভাবিত করে।',
  },
  {
    monthNameEn: 'October',
    monthNameBn: 'অক্টোবর',
    pollutedCityEn: 'Lahore',
    pollutedCityBn: 'লাহোর',
    pollutedCountryEn: 'Pakistan',
    pollutedCountryBn: 'পাকিস্তান',
    pollutedAqi: 290,
    greenCityEn: 'Reykjavik',
    greenCityBn: 'রেইকিয়াভিক',
    greenCountryEn: 'Iceland',
    greenCountryBn: 'আইসল্যান্ড',
    greenAqi: 14,
    funFactEn: 'Post-monsoon transition begins dropping temperatures and wind speeds.',
    funFactBn: 'মৌসুমি বায়ু বিদায়ের সাথে সাথে তাপমাত্রা ও বাতাসের গতি কমতে শুরু করে।',
  },
  {
    monthNameEn: 'November',
    monthNameBn: 'নভেম্বর',
    pollutedCityEn: 'New Delhi',
    pollutedCityBn: 'নয়াদিল্লি',
    pollutedCountryEn: 'India',
    pollutedCountryBn: 'ভারত',
    pollutedAqi: 410,
    greenCityEn: 'Stockholm',
    greenCityBn: 'স্টকহোম',
    greenCountryEn: 'Sweden',
    greenCountryBn: 'সুইডেন',
    greenAqi: 20,
    funFactEn: 'Stubble burning and temperature inversions spike regional air pollution.',
    funFactBn: 'ফসলের অবশিষ্টাংশ পোড়ানো এবং তাপমাত্রার বিপরীত অবস্থার কারণে দূষণ তুঙ্গে ওঠে।',
  },
  {
    monthNameEn: 'December',
    monthNameBn: 'ডিসেম্বর',
    pollutedCityEn: 'Dhaka',
    pollutedCityBn: 'ঢাকা',
    pollutedCountryEn: 'Bangladesh',
    pollutedCountryBn: 'বাংলাদেশ',
    pollutedAqi: 340,
    greenCityEn: 'Copenhagen',
    greenCityBn: 'কোপেনহেগেন',
    greenCountryEn: 'Denmark',
    greenCountryBn: 'ডেনমার্ক',
    greenAqi: 23,
    funFactEn: 'Dry winter winds and urban construction peak seasonal pollutant counts.',
    funFactBn: 'শুষ্ক শীতের বাতাস ও নির্মাণ কাজের কারণে ডিসেম্বরে দূষণের মাত্রা বৃদ্ধি পায়।',
  },
];

const COUNTRY_GLOBAL_RANKS: Record<string, { rank: number; statusBn: string; statusEn: string }> = {
  BD: { rank: 2, statusBn: 'বিশ্বে ২য় সর্বোচ্চ দূষিত দেশ (তীব্র সতর্কতা)', statusEn: 'Rank #2 Globally (High Alert)' },
  IN: { rank: 1, statusBn: 'বিশ্বে ১ম সর্বোচ্চ দূষিত দেশ', statusEn: 'Rank #1 Globally (Very High)' },
  PK: { rank: 3, statusBn: 'বিশ্বে ৩য় সর্বোচ্চ দূষিত দেশ', statusEn: 'Rank #3 Globally' },
  SA: { rank: 14, statusBn: 'বিশ্বে ১৪তম (ধূলিঝড় ও মরুপ্রবণ)', statusEn: 'Rank #14 (Dust Prone)' },
  US: { rank: 85, statusBn: 'বিশ্বে ৮৫তম (সহনশীল বায়ুমান)', statusEn: 'Rank #85 (Moderate)' },
  GB: { rank: 92, statusBn: 'বিশ্বে ৯২তম (পরিচ্ছন্ন বায়ু)', statusEn: 'Rank #92 (Clean Air)' },
  DE: { rank: 88, statusBn: 'বিশ্বে ৮৮তম (পরিচ্ছন্ন বায়ু)', statusEn: 'Rank #88 (Clean Air)' },
  FR: { rank: 90, statusBn: 'বিশ্বে ৯০তম (পরিচ্ছন্ন বায়ু)', statusEn: 'Rank #90 (Clean Air)' },
  ES: { rank: 82, statusBn: 'বিশ্বে ৮২তম', statusEn: 'Rank #82' },
};

export const WorldMonthlyPollutionEcoCard: React.FC = () => {
  const { languageCode, selectedCountry, selectedLocation } = useApp();
  const isBn = languageCode === 'bn';

  const currentMonthIdx = new Date().getMonth();
  const record = MONTHLY_RECORDS[currentMonthIdx];

  const countryCode = selectedLocation.countryCode || selectedCountry.code || 'BD';
  const countryName = isBn && countryCode === 'BD' ? 'বাংলাদেশ' : (selectedLocation.country || selectedCountry.name);
  const countryRankInfo = COUNTRY_GLOBAL_RANKS[countryCode] || {
    rank: 45,
    statusBn: 'বিশ্ব র‍্যাংকিংয়ে মধ্যম অবস্থানে রয়েছে',
    statusEn: 'Rank #45 Globally (Moderate)',
  };

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      setIsPlaying(speaking && activeId === 'world_eco_ranking');
    });
    return unsub;
  }, []);

  const handleAudioBroadcast = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    const text = isBn
      ? `চলতি ${record.monthNameBn} মাসের বিশ্ব বায়ুমান ও পরিবেশ র‍্যাংকিং। সবচেয়ে দূষিত শহর ${record.pollutedCityBn}, ${record.pollutedCountryBn} (AQI: ${record.pollutedAqi})। সবচেয়ে পরিবেশবান্ধব শহর ${record.greenCityBn}, ${record.greenCountryBn} (AQI: ${record.greenAqi})। আপনার বর্তমান জিপিএস লোকেশন অনুযায়ী ${countryName} বিশ্ব দূষণ র‍্যাংকিংয়ে ${countryRankInfo.rank} নম্বর অবস্থানে রয়েছে। বিশেষ তথ্য: ${record.funFactBn}`
      : `World air quality ranking for ${record.monthNameEn}. Most polluted city: ${record.pollutedCityEn}, ${record.pollutedCountryEn} (AQI: ${record.pollutedAqi}). Greenest eco city: ${record.greenCityEn}, ${record.greenCountryEn} (AQI: ${record.greenAqi}). According to your GPS tracking, ${countryName} is ranked number ${countryRankInfo.rank} globally in air pollution. Fun fact: ${record.funFactEn}`;

    speakWeatherAlert(
      text,
      languageCode,
      () => {
        setIsPlaying(false);
      },
      'world_eco_ranking'
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Globe2 className="w-5 h-5 animate-spin" />
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{isBn ? 'মাসিক বিশ্ব বায়ুমান ও পরিবেশ র‍্যাংকিং' : 'Monthly Global Air & Eco Ranking'}</span>
              <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                {isBn ? record.monthNameBn : record.monthNameEn}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'বিশ্বের দূষিত, পরিচ্ছন্ন ও আপনার দেশের বিশ্ব অবস্থান' : 'World ranking & your GPS country global pollution position'}
            </p>
          </div>
        </div>

        <button
          onClick={handleAudioBroadcast}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            isPlaying
              ? 'bg-red-600 text-white animate-pulse shadow-md'
              : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 hover:bg-teal-500/20'
          }`}
          title={isPlaying ? (isBn ? 'বন্ধ করুন' : 'Stop') : (isBn ? 'অডিও শুনুন' : 'Listen Audio')}
        >
          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlaying ? (isBn ? 'থামান' : 'Stop') : (isBn ? 'অডিও শুনুন' : 'Listen')}</span>
        </button>
      </div>

      {/* Grid: Polluted vs Greenest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Most Polluted */}
        <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>{isBn ? 'সবচেয়ে দূষিত শহর' : 'Most Polluted City'}</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold">
              AQI {record.pollutedAqi}
            </span>
          </div>
          <div className="pt-1">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {isBn ? record.pollutedCityBn : record.pollutedCityEn}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {isBn ? record.pollutedCountryBn : record.pollutedCountryEn}
            </p>
          </div>
        </div>

        {/* Cleanest / Greenest */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{isBn ? 'সবচেয়ে পরিবেশবান্ধব শহর' : 'Greenest Eco City'}</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold">
              AQI {record.greenAqi}
            </span>
          </div>
          <div className="pt-1">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {isBn ? record.greenCityBn : record.greenCityEn}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {isBn ? record.greenCountryBn : record.greenCountryEn}
            </p>
          </div>
        </div>
      </div>

      {/* User's GPS Tracked Country Global Rank Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-indigo-500/10 border border-teal-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-teal-800 dark:text-teal-200">
            <Navigation className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>{isBn ? `আপনার জিপিএস দেশ (${countryName}) এর বিশ্ব অবস্থান` : `Your GPS Country (${countryName}) Global Rank`}</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-600 text-white font-black text-xs shadow-xs">
            {isBn ? `র‍্যাংক #${countryRankInfo.rank}` : `Rank #${countryRankInfo.rank}`}
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          {isBn ? countryRankInfo.statusBn : countryRankInfo.statusEn}
        </p>
      </div>

      {/* Monthly Fun Fact */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <span className="font-bold">{isBn ? 'মাসিক পরিবেশ বিশ্লেষণ: ' : 'Monthly Eco Insight: '}</span>
          {isBn ? record.funFactBn : record.funFactEn}
        </p>
      </div>
    </div>
  );
};
