import React from 'react';
import { useApp } from '../context/AppContext';
import { BellRing, ShieldAlert, Navigation, MapPin, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GpsHazardNotificationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { weatherData, selectedLocation, languageCode, getLocationName, selectedCountry } = useApp();
  if (!isOpen) return null;

  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);
  const windSpeed = weatherData?.current?.windSpeed || 12;
  const rainMm = weatherData?.current?.precipitationMm || 0;
  const weatherCode = weatherData?.current?.weatherCode || 0;

  const isHazardous = windSpeed > 40 || weatherCode >= 95 || rainMm > 25;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Top Gradient Bar */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${isHazardous ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-pulse' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`} />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isHazardous ? 'bg-red-600 text-white animate-bounce' : 'bg-teal-600 text-white'}`}>
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${isHazardous ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}`}>
                {isHazardous ? (isBn ? '⚠️ জিপিএস লাইভ বিপদ সংকেত অ্যালার্ট' : 'GPS Live Hazard Alert') : (isBn ? '✓ জিপিএস নিরাপদ ট্র্যাকিং' : 'GPS Safe Tracking')}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
                {isBn ? 'জিপিএস আবহাওয়া নোটিফিকেশন' : 'GPS Weather Notification'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location GPS info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-bold">
            <Navigation className="w-4 h-4" />
            <span>{isBn ? 'জিপিএস ট্র্যাকিং অবস্থান' : 'GPS Tracked Location'}</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{currentLocName}, {selectedCountry.name}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Lat: {selectedLocation.lat.toFixed(3)}°, Lng: {selectedLocation.lng.toFixed(3)}°
          </p>
        </div>

        {/* Hazard Details */}
        <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
          isHazardous
            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
        }`}>
          <div className="font-bold flex items-center gap-1.5">
            {isHazardous ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{isHazardous ? (isBn ? 'আবহাওয়া বিপদ সংকেত সক্রিয়!' : 'Weather Danger Signal Active!') : (isBn ? 'আবহাওয়া সম্পূর্ণ স্বাভাবিক' : 'Weather is Completely Normal')}</span>
          </div>
          <p className="leading-relaxed font-medium">
            {isHazardous
              ? (isBn
                  ? '⚠️ আপনার বর্তমান জিপিএস লোকেশনে তীব্র ঝড়ো হাওয়া ও ভারী বর্ষণ শনাক্ত হয়েছে। নদীবন্দরসমূহকে স্থানীয় সতর্ক সংকেত দেখাতে বলা হয়েছে।'
                  : '⚠️ Strong winds and heavy rainfall detected at your current GPS location. Port warning signals hoisted.')
              : (isBn
                  ? '✅ জিপিএস ট্র্যাকিং অনুযায়ী আপনার এলাকায় কোনো বিপদ সংকেত নেই। আবহাওয়া নিরাপদ রয়েছে।'
                  : '✅ According to GPS tracking, there are no danger signals in your area. Weather is safe.')}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
        >
          {isBn ? 'বুঝেছি / বন্ধ করুন' : 'Got it / Close'}
        </button>
      </div>
    </div>
  );
};
