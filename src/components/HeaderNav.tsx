import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FlagBadge } from './FlagBadge';
import { AppLogo } from './AppLogo';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';
import {
  Search,
  Navigation,
  Sun,
  Moon,
  ShieldAlert,
  Volume2,
  VolumeX,
  Globe,
  MapPin,
  BellRing,
  Download,
  QrCode,
} from 'lucide-react';
import { GpsHazardNotificationModal } from './GpsHazardNotificationModal';
import { openMobileDownloadModal } from './MobileAppDownloadHub';

export const HeaderNav: React.FC = () => {
  const {
    selectedCountry,
    selectedLocation,
    weatherData,
    activeScreen,
    setActiveScreen,
    isDarkMode,
    setIsDarkMode,
    isDetectingLocation,
    triggerGpsAutoDetect,
    languageMeta,
    getLocationName,
    languageCode,
    setLanguageCode,
    formatTemp,
    formatNumber,
    getConditionName,
    t,
  } = useApp();

  const [isSpeakingHeader, setIsSpeakingHeader] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking) => {
      setIsSpeakingHeader(speaking);
    });
    return unsub;
  }, []);

  const hasAlerts = weatherData?.alerts && weatherData.alerts.length > 0;
  const currentLocName = getLocationName(selectedLocation);
  const isBn = languageCode === 'bn';
  const currentCountryName = isBn && selectedLocation.countryCode === 'BD' ? 'বাংলাদেশ' : selectedLocation.country;

  const handleToggleVoiceBroadcast = () => {
    if (isSpeakingHeader) {
      stopSpeech();
      setIsSpeakingHeader(false);
      return;
    }

    const current = weatherData?.current;
    const condStr = current ? getConditionName(current.weatherCode) : (isBn ? 'নির্মল আকাশ' : 'Clear Sky');
    let speech = '';

    if (isBn) {
      speech = `${currentLocName}-এ আজকের তাপমাত্রা ${formatNumber(Math.round(current?.temperature || 0))} ডিগ্রি সেলসিয়াস। আবহাওয়া: ${condStr}। বাতাসে আর্দ্রতা ${formatNumber(current?.humidity || 0)} শতাংশ এবং বাতাসের গতি ${formatNumber(Math.round(current?.windSpeed || 0))} কিলোমিটার প্রতি ঘণ্টা।`;
    } else {
      speech = `Today's weather in ${currentLocName}: Temperature is ${Math.round(current?.temperature || 0)} degrees Celsius. Condition is ${condStr}. Humidity is ${current?.humidity || 0} percent and wind speed is ${Math.round(current?.windSpeed || 0)} kilometers per hour.`;
    }

    speakWeatherAlert(
      speech,
      languageCode,
      () => {
        setIsSpeakingHeader(false);
      },
      'header_nav'
    );
  };

  const toggleLanguageQuick = () => {
    if (languageCode === 'bn') {
      setLanguageCode('en');
    } else {
      setLanguageCode('bn');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo & City Pill */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => setActiveScreen('dashboard')}
          >
            <AppLogo size="md" />
            <div className="hidden sm:block">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                {t('appName')}
              </span>
            </div>
          </div>

          {/* Quick Location Badge (Tap to search/change) */}
          <button
            onClick={() => setActiveScreen('city_search')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer max-w-[140px] sm:max-w-[200px]"
            title={t('searchPlaceholder')}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
                {currentLocName}
              </p>
              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                {currentCountryName}
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Audio Voice Weather Broadcast Button */}
          <button
            onClick={handleToggleVoiceBroadcast}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              isSpeakingHeader
                ? 'bg-red-600 text-white animate-pulse shadow-md'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
            title={isSpeakingHeader ? t('stopVoice') : t('voiceBulletin')}
          >
            {isSpeakingHeader ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
            <span className="hidden sm:inline text-[11px]">
              {isSpeakingHeader ? t('stopVoice') : t('voiceBulletin')}
            </span>
          </button>

          {/* Quick Language Toggle Pill (Instant EN / BN switch + open full languages) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={toggleLanguageQuick}
              className="px-2 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all hover:bg-white dark:hover:bg-slate-700 cursor-pointer text-slate-800 dark:text-slate-200"
              title={isBn ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
            >
              <span>{isBn ? '🇧🇩 বাংলা' : '🇺🇸 English'}</span>
            </button>
            <button
              onClick={() => setActiveScreen('language_settings')}
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-pointer"
              title={t('langSettingsTitle')}
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Alert Button */}
          {hasAlerts && (
            <button
              onClick={() => setActiveScreen('weather_alerts')}
              className="relative p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer"
              title={t('navAlerts')}
            >
              <ShieldAlert className="w-4 h-4 text-red-600 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </button>
          )}

          {/* City Search Button */}
          <button
            onClick={() => setActiveScreen('city_search')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              activeScreen === 'city_search'
                ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={t('navSearch')}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title={t('themeToggle')}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Download for Mobile / QR Code Button */}
          <button
            onClick={openMobileDownloadModal}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            title={isBn ? 'মোবাইল অ্যাপ ডাউনলোড ও QR কোড' : 'Download for Mobile & QR Code'}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline text-[11px]">
              {isBn ? 'মোবাইল অ্যাপ' : 'Download App'}
            </span>
          </button>

          {/* GPS Hazard Notification Bell Button */}
          <button
            onClick={() => setShowGpsModal(true)}
            className="relative p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 hover:bg-teal-500/25 transition-all cursor-pointer"
            title={isBn ? 'জিপিএস বিপদ সংকেত নোটিফিকেশন' : 'GPS Hazard Notification'}
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
          </button>
        </div>
      </div>

      <GpsHazardNotificationModal isOpen={showGpsModal} onClose={() => setShowGpsModal(false)} />
    </header>
  );
};
