import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { downloadOfflineWeatherBulletin, downloadOfflineWeatherJson } from '../services/offlineExportService';
import { Sliders, Thermometer, Wind, Clock, Moon, Sun, ShieldCheck, Home, Download, Smartphone, CheckCircle2, Code, Globe, Palette, Check, RefreshCw, ArrowUpCircle } from 'lucide-react';
import { CURRENT_APP_VERSION, checkForRemoteAppUpdates } from '../services/autoUpdateService';

const THEME_OPTIONS = [
  { id: 'teal', nameBn: 'টিয়াল এমারেল্ড (ডিফল্ট)', nameEn: 'Teal Emerald (Default)', bg: 'bg-teal-600', ring: 'ring-teal-500' },
  { id: 'blue', nameBn: 'ওশান স্কাই ব্লু', nameEn: 'Ocean Sky Blue', bg: 'bg-sky-600', ring: 'ring-sky-500' },
  { id: 'indigo', nameBn: 'মিডনাইট ইন্ডিগো', nameEn: 'Midnight Indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-500' },
  { id: 'purple', nameBn: 'রয়্যাল পার্পল', nameEn: 'Royal Purple', bg: 'bg-purple-600', ring: 'ring-purple-500' },
  { id: 'rose', nameBn: 'ক্রিমসন রোজ', nameEn: 'Crimson Rose', bg: 'bg-rose-600', ring: 'ring-rose-500' },
  { id: 'orange', nameBn: 'সানসেট অরেঞ্জ', nameEn: 'Sunset Orange', bg: 'bg-orange-600', ring: 'ring-orange-500' },
  { id: 'amber', nameBn: 'গোল্ডেন সান', nameEn: 'Golden Sun', bg: 'bg-amber-500', ring: 'ring-amber-400' },
  { id: 'emerald', nameBn: 'ফরেস্ট গ্রিন', nameEn: 'Forest Green', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
  { id: 'cyan', nameBn: 'গ্লেসিয়ার সায়ান', nameEn: 'Glacier Cyan', bg: 'bg-cyan-600', ring: 'ring-cyan-500' },
  { id: 'slate', nameBn: 'মডার্ন স্লেট', nameEn: 'Modern Slate', bg: 'bg-slate-700', ring: 'ring-slate-500' },
];

export const UnitSettingsScreen: React.FC = () => {
  const {
    units,
    setUnits,
    adSettings,
    setAdSettings,
    isDarkMode,
    setIsDarkMode,
    themeColor,
    setThemeColor,
    defaultHomeLocation,
    setDefaultHomeLocation,
    selectedLocation,
    weatherData,
    setActiveScreen,
    languageCode,
    t,
  } = useApp();

  const isStandalonePwa =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      localStorage.getItem('weatherglobe_pwa_installed') === 'true');

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateFeedback(null);
    try {
      const update = await checkForRemoteAppUpdates();
      if (!update || !update.hasUpdate) {
        setUpdateFeedback(languageCode === 'bn' ? '✓ আপনার অ্যাপটি সর্বশেষ আপডেটেড ভার্সনে রয়েছে!' : '✓ Your app is completely up to date!');
      }
    } catch {
      setUpdateFeedback(languageCode === 'bn' ? 'আপডেট চেক সম্পন্ন হয়েছে।' : 'Update check finished.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleExportText = () => {
    if (weatherData) {
      downloadOfflineWeatherBulletin(weatherData, languageCode);
    } else {
      alert(languageCode === 'bn' ? 'আবহাওয়া ডেটা লোড হওয়ার পর এক্সপোর্ট করুন।' : 'Please wait for weather data to load before exporting.');
    }
  };

  const handleExportJson = () => {
    if (weatherData) {
      downloadOfflineWeatherJson(weatherData);
    } else {
      alert(languageCode === 'bn' ? 'আবহাওয়া ডেটা লোড হওয়ার পর এক্সপোর্ট করুন।' : 'Please wait for weather data to load before exporting.');
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-3xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-teal-200" />
          <h1 className="font-extrabold text-base">{t('settingsTitle')}</h1>
        </div>
        <p className="text-xs text-teal-100/90">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* LANGUAGE SELECTION CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{t('langSettingsTitle')}</span>
          </div>
          <button
            onClick={() => setActiveScreen('language_settings')}
            className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
          >
            {t('changeLanguageBtn')}
          </button>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Active Language: <strong className="text-teal-600 dark:text-teal-400">{languageCode.toUpperCase()}</strong>
        </p>
      </div>

      {/* DARK / LIGHT MODE CONTROL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{t('themeToggle')}</span>
          </span>
          <span className="text-teal-600 dark:text-teal-400">{isDarkMode ? t('darkModeLabel') : t('lightModeLabel')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setIsDarkMode(false)}
            className={`py-2.5 rounded-xl border font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isDarkMode
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{t('lightModeLabel')}</span>
          </button>
          <button
            onClick={() => setIsDarkMode(true)}
            className={`py-2.5 rounded-xl border font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isDarkMode
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-300" />
            <span>{t('darkModeLabel')}</span>
          </button>
        </div>
      </div>

      {/* 10 THEME COLORS CUSTOMIZER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-teal-500" />
            <span>{languageCode === 'bn' ? '১০টি থিম কালার কাস্টমাইজেশন' : '10 Theme Colors Palette'}</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-extrabold uppercase">
            {THEME_OPTIONS.find((th) => th.id === themeColor)?.[languageCode === 'bn' ? 'nameBn' : 'nameEn'] || 'Teal'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {languageCode === 'bn'
            ? 'আপনার পছন্দের যেকোনো রঙে পুরো অ্যাপসের থিম এক ক্লিকে পরিবর্তন করুন:'
            : 'Personalize the entire application color scheme in 1-click:'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
          {THEME_OPTIONS.map((th) => {
            const isSelected = themeColor === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setThemeColor(th.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${th.bg} shrink-0 flex items-center justify-center text-white text-[9px]`}>
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </span>
                <span className="text-[11px] truncate">{languageCode === 'bn' ? th.nameBn : th.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PERMANENT DEFAULT HOME DISTRICT SETTINGS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{t('defaultHomeDistrictTitle')}</span>
          </div>
          <button
            onClick={() => setActiveScreen('city_search')}
            className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
          >
            {t('changeBtn')}
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">
              {defaultHomeLocation ? (defaultHomeLocation.localName || defaultHomeLocation.name) : (languageCode === 'bn' ? 'ঢাকা (ডিফল্ট)' : 'Dhaka (Default)')}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {defaultHomeLocation ? defaultHomeLocation.country : (languageCode === 'bn' ? 'বাংলাদেশ' : 'Bangladesh')} — {t('defaultCityNote')}
            </p>
          </div>
          <button
            onClick={() => {
              setDefaultHomeLocation(selectedLocation);
              alert(
                languageCode === 'bn'
                  ? `${selectedLocation.localName || selectedLocation.name}-কে স্থায়ী হোম জেলা নির্ধারণ করা হয়েছে!`
                  : `Set ${selectedLocation.localName || selectedLocation.name} as permanent home location!`
              );
            }}
            className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-bold shadow-xs cursor-pointer hover:bg-amber-300"
          >
            {t('setAsCurrentDistrict')}
          </button>
        </div>
      </div>

      {/* OFFLINE BACKUP DOWNLOAD EXPORT */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Download className="w-4 h-4 text-indigo-500" />
          <span>{t('offlineBackupTitle')}</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {t('offlineBackupDesc')}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <button
            onClick={handleExportText}
            className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('textBulletinBtn')}</span>
          </button>
          <button
            onClick={handleExportJson}
            className="py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('jsonDataFileBtn')}</span>
          </button>
        </div>
      </div>

      {/* APP ICON DOWNLOAD CARD (PNG & SVG FORMATS) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Download className="w-4 h-4 text-teal-500" />
          <span>{t('downloadAppIconTitle')}</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {t('downloadAppIconDesc')}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <button
            onClick={async () => {
              try {
                const res = await fetch('/logo.svg');
                const svgText = await res.text();
                const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 512;
                  canvas.height = 512;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.fillStyle = '#0f766e';
                    ctx.fillRect(0, 0, 512, 512);
                    ctx.drawImage(img, 0, 0, 512, 512);
                    const pngUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = 'weatherglobe-icon-512x512.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                };
                img.src = url;
              } catch (e) {
                console.error('PNG download error:', e);
              }
            }}
            className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('downloadPngBtn')}</span>
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/logo.svg';
              link.download = 'weatherglobe-icon-vector.svg';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('downloadSvgBtn')}</span>
          </button>
        </div>
      </div>

      {/* PWA INSTALL STATUS BADGE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{t('phoneInstallStatus')}</span>
          </div>
          <span
            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              isStandalonePwa
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>{isStandalonePwa ? t('installedMode') : t('webBrowserMode')}</span>
          </span>
        </div>
      </div>

      {/* AUTO-UPDATE STATUS & TRIGGER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                {languageCode === 'bn' ? 'অটো-আপডেট সিস্টেম' : 'Auto-Update System'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {languageCode === 'bn' ? `বর্তমান রিলিজ: v${CURRENT_APP_VERSION}` : `Current Release: v${CURRENT_APP_VERSION}`}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
            {languageCode === 'bn' ? 'অটো-সিঙ্ক সক্রিয়' : 'Live OTA Active'}
          </span>
        </div>

        <button
          onClick={handleManualCheckUpdate}
          disabled={isCheckingUpdate}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-teal-600 dark:text-teal-400 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
          <span>
            {isCheckingUpdate
              ? (languageCode === 'bn' ? 'আপডেট খোঁজা হচ্ছে...' : 'Checking updates...')
              : (languageCode === 'bn' ? 'নতুন আপডেট পরীক্ষা করুন' : 'Check for Updates Now')}
          </span>
        </button>

        {updateFeedback && (
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 text-center animate-fadeIn">
            {updateFeedback}
          </p>
        )}
      </div>

      {/* Temperature Unit */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-500" />
            <span>{t('tempUnit')}</span>
          </span>
          <span className="text-teal-600 dark:text-teal-400">{units.temp === 'C' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setUnits((prev) => ({ ...prev, temp: 'C' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.temp === 'C'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Celsius (°C)
          </button>
          <button
            onClick={() => setUnits((prev) => ({ ...prev, temp: 'F' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.temp === 'F'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      {/* Wind Speed Unit */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-500" />
            <span>{t('windUnit')}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => setUnits((prev) => ({ ...prev, wind: 'kmh' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.wind === 'kmh'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            km/h
          </button>
          <button
            onClick={() => setUnits((prev) => ({ ...prev, wind: 'mph' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.wind === 'mph'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            mph
          </button>
          <button
            onClick={() => setUnits((prev) => ({ ...prev, wind: 'ms' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.wind === 'ms'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            m/s
          </button>
        </div>
      </div>

      {/* Time Format */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{t('timeFormat')}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setUnits((prev) => ({ ...prev, timeFormat: '24h' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.timeFormat === '24h'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t('timeFormat24')}
          </button>
          <button
            onClick={() => setUnits((prev) => ({ ...prev, timeFormat: '12h' }))}
            className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
              units.timeFormat === '12h'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t('timeFormat12')}
          </button>
        </div>
      </div>

      {/* Developer & Architecture Quick Link */}
      <button
        onClick={() => setActiveScreen('about_privacy')}
        className="w-full p-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl flex items-center justify-between text-xs font-bold hover:opacity-95 transition-all cursor-pointer shadow-md"
      >
        <span className="flex items-center gap-2">
          <Code className="w-4 h-4 text-teal-300" />
          <span>{t('developerAndArchTitle')}</span>
        </span>
        <span className="text-teal-300 text-[11px]">MD Shahin & Engineering →</span>
      </button>
    </div>
  );
};
