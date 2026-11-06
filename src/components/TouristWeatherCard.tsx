import React from 'react';
import { useApp } from '../context/AppContext';
import { LocationItem } from '../types';
import { MapPin, Sun, Umbrella, Compass, Luggage } from 'lucide-react';

const TOURIST_SPOTS: LocationItem[] = [
  { id: 'spot-sajek', name: 'Sajek Valley', localName: 'সাজেক ভ্যালি, রাঙ্গামাটি', country: 'বাংলাদেশ', countryCode: 'BD', lat: 23.3820, lng: 92.2938, admin1: 'Rangamati Hill Tracts' },
  { id: 'spot-coxs', name: "Cox's Bazar", localName: 'কক্সবাজার সমুদ্র সৈকত', country: 'বাংলাদেশ', countryCode: 'BD', lat: 21.4272, lng: 92.0058, admin1: 'Chattogram' },
  { id: 'spot-sreemangal', name: 'Sreemangal', localName: 'শ্রীমঙ্গল চা বাগান, মৌলভীবাজার', country: 'বাংলাদেশ', countryCode: 'BD', lat: 24.3065, lng: 91.7296, admin1: 'Sylhet' },
  { id: 'spot-sundarbans', name: 'Sundarbans', localName: 'সুন্দরবন ম্যানগ্রোভ বন', country: 'বাংলাদেশ', countryCode: 'BD', lat: 21.9497, lng: 89.1833, admin1: 'Khulna' },
];

export const TouristWeatherCard: React.FC = () => {
  const { setSelectedLocation, formatTemp } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              পর্যটন স্পট আবহাওয়া ও ভ্রমণ গাইড (Tourist Guide)
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              সাজেক, কক্সবাজার, শ্রীমঙ্গল ও সুন্দরবন ভ্রমণ পূর্বাভাস
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
          ট্যুর গাইড
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {TOURIST_SPOTS.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setSelectedLocation(spot)}
            className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-teal-500 transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{spot.localName || spot.name}</span>
            </div>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
              ভ্রমণের জন্য চমৎকার পরিবেশ (৯৫% স্কোর)
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
