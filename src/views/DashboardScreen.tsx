import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WeatherIcon } from '../components/WeatherIcon';
import { AdBanner } from '../components/AdBanner';
import { CoffeeTopAdBanner } from '../components/CoffeeTopAdBanner';
import { AirQualityLeaderboardCard } from '../components/AirQualityLeaderboardCard';
import { CycloneStormTrackerCard } from '../components/CycloneStormTrackerCard';
import { TouristWeatherCard } from '../components/TouristWeatherCard';
import { TouristTravelGuideModal } from '../components/TouristTravelGuideModal';
import { WeatherComparisonCard } from '../components/WeatherComparisonCard';
import { AgriCropAdvisoryCard } from '../components/AgriCropAdvisoryCard';
import { SeasonalAgriCalendarCard } from '../components/SeasonalAgriCalendarCard';
import { SunMoonPrayerCard } from '../components/SunMoonPrayerCard';
import { MarineWeatherCard } from '../components/MarineWeatherCard';
import { WeatherHistoryCard } from '../components/WeatherHistoryCard';
import { NearbyRainSunshineRadarCard } from '../components/NearbyRainSunshineRadarCard';
import { CountrywideWeatherRadarCard } from '../components/CountrywideWeatherRadarCard';
import { SatelliteCloudLoopCard } from '../components/SatelliteCloudLoopCard';
import { PushNotificationManager } from '../components/PushNotificationManager';
import { MinuteRainAlertCard } from '../components/MinuteRainAlertCard';
import { LifestyleFeatureHub } from '../components/LifestyleFeatureHub';
import { TideMoonCard } from '../components/TideMoonCard';
import { FlightTrainDelayCard } from '../components/FlightTrainDelayCard';
import { TransitMarineAdvisoryAlertCard } from '../components/TransitMarineAdvisoryAlertCard';
import { SpecialFeatureQuickDock } from '../components/SpecialFeatureQuickDock';
import { WorldMonthlyPollutionEcoCard } from '../components/WorldMonthlyPollutionEcoCard';
import { AllFeaturesMasterHub } from '../components/AllFeaturesMasterHub';
import { DailyWeatherForecastVipHub } from '../components/DailyWeatherForecastVipHub';
import { AgriAirNatureVipHub } from '../components/AgriAirNatureVipHub';
import { BmdSignalGuideModal } from '../components/BmdSignalGuideModal';
import { WeatherCardGeneratorModal } from '../components/WeatherCardGeneratorModal';
import { downloadOfflineWeatherBulletin } from '../services/offlineExportService';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { COUNTRIES_CONFIG } from '../config/countries';
import { LocationItem } from '../types';
import { speakWeatherAlert, stopSpeech, subscribeSpeechStatus } from '../services/voiceAlertService';
import {
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  ShieldAlert,
  Star,
  Clock,
  Gauge,
  Sparkles,
  ChevronRight,
  Navigation,
  Activity,
  Share2,
  BookOpen,
  Sun,
  Compass,
  Sprout,
  Home,
  Download,
  X,
  Globe,
  Volume2,
  VolumeX,
  CalendarDays,
  Map as MapIcon,
  ArrowRightLeft,
  Coffee,
  CloudRain,
  Moon,
  Waves,
  Luggage,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    weatherData,
    isLoadingWeather,
    selectedLocation,
    setSelectedLocation,
    selectedCountry,
    setActiveScreen,
    refetchWeather,
    setDefaultHomeLocation,
    isHomeLocation,
    formatTemp,
    formatWind,
    formatNumber,
    getConditionName,
    getLocationName,
    isCitySaved,
    toggleSavedCity,
    languageCode,
    languageMeta,
    isDetectingLocation,
    detectionNotice,
    clearDetectionNotice,
    triggerGpsAutoDetect,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'air_quality' | 'coastal_cyclone' | 'agri_lifestyle'>('overview');

  const [isDetectingAqiGps, setIsDetectingAqiGps] = useState(false);
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTouristModal, setShowTouristModal] = useState(false);
  const [isSpeakingWeather, setIsSpeakingWeather] = useState(false);

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, _text, activeId) => {
      setIsSpeakingWeather(speaking && (activeId === 'dashboard_main' || activeId === 'header_nav' || activeId === 'default_audio'));
    });
    return unsub;
  }, []);

  const current = weatherData?.current;
  const air = weatherData?.airQuality;
  const hourly = weatherData?.hourly || [];
  const bdCities = COUNTRIES_CONFIG['BD']?.popularCities || [];

  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);
  const currentCountryDisplay = isBn && selectedLocation.countryCode === 'BD' ? 'বাংলাদেশ' : selectedLocation.country;

  const handlePlayWeatherBroadcast = () => {
    if (isSpeakingWeather) {
      stopSpeech();
      setIsSpeakingWeather(false);
      return;
    }

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
        setIsSpeakingWeather(false);
      },
      'dashboard_main'
    );
  };

  const handleDetectCurrentLocationAqi = () => {
    if (!navigator.geolocation) {
      alert(isBn ? 'আপনার ডিভাইসে জিপিএস লোকেশন পাওয়া যায়নি।' : 'GPS location is unavailable on your device.');
      return;
    }

    setIsDetectingAqiGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)}&count=1&language=en&format=json`
          );
          let cityName = isBn ? 'আমার অবস্থান' : 'My Location';
          let adminArea = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;

          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results[0]) {
              cityName = data.results[0].name;
              adminArea = `${data.results[0].admin1 || data.results[0].country} (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
            }
          }

          const gpsLocation: LocationItem = {
            id: `gps-aqi-${lat.toFixed(4)}-${lng.toFixed(4)}`,
            name: cityName,
            localName: cityName,
            country: selectedCountry.name,
            countryCode: selectedCountry.code,
            lat,
            lng,
            admin1: adminArea,
            isCustom: true,
          };

          setSelectedLocation(gpsLocation);
          setIsDetectingAqiGps(false);
        } catch {
          const gpsLocation: LocationItem = {
            id: `gps-aqi-${lat.toFixed(4)}-${lng.toFixed(4)}`,
            name: isBn ? 'আমার বর্তমান অবস্থান' : 'My Current Location',
            country: selectedCountry.name,
            countryCode: selectedCountry.code,
            lat,
            lng,
            admin1: `GPS: ${lat.toFixed(3)}°, ${lng.toFixed(3)}°`,
            isCustom: true,
          };
          setSelectedLocation(gpsLocation);
          setIsDetectingAqiGps(false);
        }
      },
      () => {
        setIsDetectingAqiGps(false);
        alert(isBn ? 'অনুগ্রহ করে জিপিএস পারমিশন দিন।' : 'Please grant GPS location permission.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleDownloadOfflineBulletin = () => {
    if (weatherData) {
      downloadOfflineWeatherBulletin(weatherData, languageCode);
    } else {
      alert(isBn ? 'আবহাওয়া তথ্য লোড হওয়ার পর বুলেটিন ডাউনলোড করুন।' : 'Please wait for weather data to load.');
    }
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (aqi <= 100) return { bg: 'bg-amber-500', text: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    if (aqi <= 150) return { bg: 'bg-orange-500', text: 'text-orange-500', badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' };
    if (aqi <= 200) return { bg: 'bg-red-500', text: 'text-red-500', badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' };
    return { bg: 'bg-purple-600', text: 'text-purple-600', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' };
  };

  const aqiStyle = getAqiColor(air?.aqi || 45);
  const isCurrentHome = isHomeLocation(selectedLocation.id);

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-3xl mx-auto space-y-4">
      {/* DISMISSIBLE GPS DETECTION NOTIFICATION */}
      {detectionNotice && (
        <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 text-white rounded-2xl p-3 shadow-md border border-teal-500/30 flex items-center justify-between gap-2 animate-fadeIn text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-300 shrink-0" />
            <p className="font-semibold text-slate-100 line-clamp-1">{detectionNotice}</p>
          </div>
          <button
            onClick={clearDetectionNotice}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* EMERGENCY WEATHER ADVISORY ALERT BANNER */}
      {weatherData?.alerts && weatherData.alerts.length > 0 && (
        <div
          onClick={() => setActiveScreen('weather_alerts')}
          className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl p-3.5 shadow-lg shadow-red-500/20 cursor-pointer animate-alert-pulse transition-all hover:scale-[1.01] flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 animate-bounce shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-black bg-white/20 px-2 py-0.5 rounded-full">
                {isBn ? 'জরুরি সতর্কতা' : 'EMERGENCY ADVISORY'}
              </span>
              <p className="font-extrabold text-xs sm:text-sm mt-0.5">
                {isBn ? (weatherData.alerts[0].titleBn || weatherData.alerts[0].title) : weatherData.alerts[0].title}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 shrink-0" />
        </div>
      )}

      {/* BUY ME A COFFEE TOP SPONSOR BANNER AD */}
      <CoffeeTopAdBanner />

      {/* =========================================================================
          HERO WEATHER CARD (CLEAN, REFRESHING, ATMOSPHERIC, HIGH-CONTRAST)
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 text-white p-5 sm:p-6 shadow-xl shadow-teal-900/25 border border-teal-500/30">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Location */}
        <div className="flex items-start justify-between relative z-10 mb-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold backdrop-blur-md flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-200" />
                <span>{currentCountryDisplay}</span>
              </span>
              {isCurrentHome && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Home className="w-3 h-3" />
                  <span>{t('homeDistrictBadge')}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1 text-white">
              {currentLocName}
            </h1>
            <p className="text-xs text-teal-100/90 font-medium">
              {selectedLocation.admin1 || currentCountryDisplay}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            {/* Set Home District */}
            <button
              onClick={() => {
                setDefaultHomeLocation(selectedLocation);
                alert(`${currentLocName} ${t('homeDistrictSetMsg')}`);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                isCurrentHome
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={t('setHomeDistrict')}
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Favorite Star */}
            <button
              onClick={() => toggleSavedCity(selectedLocation)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white cursor-pointer"
              title={t('addToFavorites')}
            >
              <Star
                className={`w-4 h-4 ${
                  isCitySaved(selectedLocation.id) ? 'fill-amber-400 text-amber-400' : 'text-white'
                }`}
              />
            </button>

            {/* Refresh */}
            <button
              onClick={refetchWeather}
              disabled={isLoadingWeather}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Temperature & Weather Condition */}
        {isLoadingWeather ? (
          <div className="py-8 text-center relative z-10">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-200 mb-2" />
            <p className="text-xs text-teal-100 font-bold">{t('splashLoading')}</p>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-center justify-between my-3">
              <div>
                <div className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-white">
                  {current ? formatTemp(current.temperature) : '--'}
                </div>
                <div className="text-xs text-teal-100 font-semibold mt-2 flex items-center gap-1.5">
                  <span>{t('feelsLike')}:</span>
                  <span className="font-extrabold text-amber-300">{current ? formatTemp(current.feelsLike) : '--'}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                {current && <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg" />}
                <span className="text-sm sm:text-base font-black text-teal-100 mt-1">
                  {current ? getConditionName(current.weatherCode) : '--'}
                </span>
              </div>
            </div>

            {/* BIG PROMINENT VOICE BROADCAST BUTTON (Easy for anyone to tap and listen) */}
            <button
              onClick={handlePlayWeatherBroadcast}
              className={`w-full py-3 px-4 rounded-2xl backdrop-blur-md font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isSpeakingWeather
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/40'
                  : 'bg-white/20 hover:bg-white/30 text-amber-300 border border-white/25 hover:scale-[1.01]'
              }`}
            >
              {isSpeakingWeather ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
              <span>{isSpeakingWeather ? (isBn ? 'কথা বলা বন্ধ করুন' : 'Stop Voice Broadcast') : (isBn ? '🎙️ আবহাওয়া শুনুন (ভয়েস বুলেটিন)' : '🎙️ Listen to Weather Voice')}</span>
            </button>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-xs">
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
                <div>
                  <p className="text-[10px] text-teal-200">{t('humidity')}</p>
                  <p className="font-black text-white">{current ? formatNumber(current.humidity) : '--'}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <Wind className="w-4 h-4 text-emerald-300 shrink-0" />
                <div>
                  <p className="text-[10px] text-teal-200">{t('windSpeed')}</p>
                  <p className="font-black text-white">{current ? formatWind(current.windSpeed) : '--'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <Gauge className="w-4 h-4 text-amber-300 shrink-0" />
                <div>
                  <p className="text-[10px] text-teal-200">{t('pressure')}</p>
                  <p className="font-black text-white">{current ? formatNumber(current.pressure) : '--'} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ORDERLY, CLASSIFIED FEATURE SERVICES (সারিবদ্ধ ও গোছানো ফিচারসমূহ)
          Clear categorized rows: highly intuitive for everyone from rural users to pros
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {t('quickFeaturesTitle')}
              </h2>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                {t('quickFeaturesSub')}
              </p>
            </div>
          </div>

          {/* Quick GPS Auto-Detect Button */}
          <button
            onClick={() => triggerGpsAutoDetect()}
            disabled={isDetectingLocation}
            className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>{isDetectingLocation ? t('trackingGps') : t('trackGpsBtn')}</span>
          </button>
        </div>

        {/* --- CATEGORY 1: DAILY WEATHER & FORECASTS (দৈনন্দিন পূর্বাভাস) --- */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{isBn ? 'দৈনন্দিন আবহাওয়া ও পূর্বাভাস' : 'Daily Weather & Forecasts'}</span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {/* 1. 24-Hour */}
            <button
              onClick={() => setActiveScreen('hourly_forecast')}
              className="p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 hover:border-sky-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featHourly')}
              </span>
            </button>

            {/* 2. 7-Day Forecast */}
            <button
              onClick={() => setActiveScreen('seven_day_forecast')}
              className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('feat7Days')}
              </span>
            </button>

            {/* 3. Live Map */}
            <button
              onClick={() => setActiveScreen('interactive_map')}
              className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/60 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featMap')}
              </span>
            </button>

            {/* 4. Compare Cities */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setTimeout(() => {
                  document.getElementById('weather-comparison-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="p-2.5 rounded-2xl bg-violet-50 dark:bg-slate-800/60 border border-violet-100 dark:border-slate-700/60 hover:border-violet-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featCompare')}
              </span>
            </button>
          </div>
        </div>

        {/* --- CATEGORY 2: AGRICULTURE & NATURE (কৃষি, বায়ুর মান ও প্রকৃতি) --- */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isBn ? 'কৃষি, বাতাস ও প্রকৃতি' : 'Agri, Air Quality & Nature'}</span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {/* 5. Agri Crop Advisory */}
            <button
              onClick={() => setActiveTab('agri_lifestyle')}
              className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/60 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featAgri')}
              </span>
            </button>

            {/* 6. Rain Radar */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setTimeout(() => {
                  document.getElementById('rain-radar-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700/60 hover:border-cyan-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featRadar')}
              </span>
            </button>

            {/* 7. Air Quality (AQI) */}
            <button
              onClick={() => setActiveTab('air_quality')}
              className="p-2.5 rounded-2xl bg-teal-50 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700/60 hover:border-teal-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featAqi')}
              </span>
            </button>

            {/* 8. Prayer Times & Sun */}
            <button
              onClick={() => setActiveTab('agri_lifestyle')}
              className="p-2.5 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700/60 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featPrayer')}
              </span>
            </button>
          </div>
        </div>

        {/* --- CATEGORY 3: EMERGENCY, COASTAL & ESSENTIALS (দুর্যোগ ও জরুরি সেবা) --- */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>{isBn ? 'সতর্কতা, সমুদ্র ও বিশেষ সেবা' : 'Alerts, Marine & Essentials'}</span>
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {/* 9. Cyclone Tracker */}
            <button
              onClick={() => setActiveTab('coastal_cyclone')}
              className="p-2.5 rounded-2xl bg-rose-50 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700/60 hover:border-rose-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featCyclone')}
              </span>
            </button>

            {/* 10. Marine & Beach */}
            <button
              onClick={() => setActiveTab('coastal_cyclone')}
              className="p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 hover:border-sky-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {isBn ? 'সমুদ্র সৈকত' : 'Beach Waves'}
              </span>
            </button>

            {/* 11. BMD Signals Guide */}
            <button
              onClick={() => setShowSignalModal(true)}
              className="p-2.5 rounded-2xl bg-red-50 dark:bg-slate-800/60 border border-red-100 dark:border-slate-700/60 hover:border-red-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featBmdSignals')}
              </span>
            </button>

            {/* 12. Tourist Weather Guide */}
            <button
              onClick={() => setShowTouristModal(true)}
              className="p-2.5 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700/60 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Luggage className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {isBn ? 'ট্যুর গাইড' : 'Tour Guide'}
              </span>
            </button>

            {/* 13. Offline Report */}
            <button
              onClick={handleDownloadOfflineBulletin}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-teal-400 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {t('featOfflineReport')}
              </span>
            </button>

            {/* 14. Language Selection */}
            <button
              onClick={() => setActiveScreen('language_settings')}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-teal-400 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform font-bold text-sm">
                {languageMeta.flag}
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                {languageMeta.nativeName}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CATEGORY TABS BAR (STREAMLINED & TACTILE)
          ========================================================================= */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>{t('tabOverview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('air_quality')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'air_quality'
              ? 'bg-teal-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t('tabAirQuality')}</span>
        </button>

        <button
          onClick={() => setActiveTab('coastal_cyclone')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'coastal_cyclone'
              ? 'bg-teal-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t('tabCoastalCyclone')}</span>
        </button>

        <button
          onClick={() => setActiveTab('agri_lifestyle')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'agri_lifestyle'
              ? 'bg-teal-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>{t('tabAgriLifestyle')}</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & FORECAST
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fadeIn">
          {/* 1. DAILY WEATHER & FORECAST VIP HUB */}
          <DailyWeatherForecastVipHub
            onSelectAction={(actionKey) => {
              if (actionKey === 'hourly') setActiveScreen('hourly_forecast');
              else if (actionKey === 'seven_day') setActiveScreen('seven_day_forecast');
              else if (actionKey === 'rain_radar') {
                const el = document.getElementById('rain-radar-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (actionKey === 'comparison') {
                const el = document.getElementById('weather-comparison-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (actionKey === 'satellite') {
                const el = document.getElementById('satellite-loop-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (actionKey === 'current_temp') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />

          {/* 2. AGRICULTURE, AIR & NATURE VIP HUB */}
          <AgriAirNatureVipHub
            onSelectAction={(actionKey) => {
              if (actionKey === 'agri_advisory' || actionKey === 'agri_calendar' || actionKey === 'lifestyle_wear') {
                setActiveTab('agri_lifestyle');
              } else if (actionKey === 'local_aqi' || actionKey === 'world_ranking') {
                setActiveTab('air_quality');
              } else if (actionKey === 'tide_moon' || actionKey === 'port_marine' || actionKey === 'transit_delay') {
                setActiveTab('coastal_cyclone');
              }
            }}
          />

          {/* 3. ALL FEATURES MASTER VIP HUB */}
          <AllFeaturesMasterHub
            onSelectFeatureId={(id) => {
              if (id === 'overview') setActiveTab('overview');
              else if (id === 'ranking') setActiveTab('air_quality');
              else if (id === 'transit' || id === 'marine' || id === 'tide') setActiveTab('coastal_cyclone');
              else if (id === 'agri' || id === 'travel') setActiveTab('agri_lifestyle');
              else if (id === 'alerts') setActiveScreen('weather_alerts');
              else if (id === 'download' || id === 'settings') setActiveScreen('settings');
              else if (id === 'coffee' || id === 'developer') setActiveScreen('developer_info');
              else if (id === 'radar' || id === 'history') setActiveTab('overview');
            }}
          />

          {/* 24-HOUR HOURLY SCROLLABLE SLIDER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{t('hourly24Title')}</span>
              </div>
              <button
                onClick={() => setActiveScreen('hourly_forecast')}
                className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{t('detailsBtn')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 text-center">
              {hourly.slice(0, 12).map((item, i) => (
                <div
                  key={i}
                  className="p-3 min-w-[72px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shrink-0 text-xs hover:border-teal-500 transition-all"
                >
                  <p className="text-[10px] text-slate-500 font-bold">
                    {formatNumber(new Date(item.time).getHours())}:00
                  </p>
                  <WeatherIcon code={item.weatherCode} isDay={item.isDay} className="w-6 h-6 mx-auto" />
                  <p className="font-black text-slate-900 dark:text-white">
                    {formatTemp(item.temperature)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TWO CITY WEATHER COMPARISON TOOL */}
          <div id="weather-comparison-section">
            <WeatherComparisonCard />
          </div>

          {/* NEARBY RAIN & SUNSHINE RADAR COMPONENT */}
          <div id="rain-radar-section">
            <NearbyRainSunshineRadarCard />
          </div>

          {/* COUNTRYWIDE RAIN & SUNSHINE TRACKER */}
          <CountrywideWeatherRadarCard />

          {/* SATELLITE CLOUD LOOP & RADAR ANIMATION */}
          <div id="satellite-loop-section">
            <SatelliteCloudLoopCard />
          </div>

          {/* MINUTE-BY-MINUTE RAIN ALERT */}
          <MinuteRainAlertCard />

          {/* PUSH NOTIFICATIONS & REAL-TIME WEATHER ALARMS */}
          <PushNotificationManager />

          {/* LIFESTYLE & PRO FEATURE HUB (WHAT TO WEAR, AGRI, TRAVEL, OUTDOOR, HEALTH, TRANSIT, MARINE) */}
          <LifestyleFeatureHub />

          {/* FLIGHT & TRAIN WEATHER DELAY RISK PREDICTOR */}
          <FlightTrainDelayCard />

          {/* Bangladesh Divisions Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                <span>🇧🇩</span>
                <span>{t('bdDivisionsTitle')}</span>
              </div>
              <button
                onClick={() => setActiveScreen('city_search')}
                className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{t('findBtn')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              {bdCities.slice(0, 6).map((city) => {
                const isSelected = selectedLocation.id === city.id;
                const cName = isBn ? (city.localName || city.name) : city.name;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedLocation(city)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer truncate font-bold ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                    }`}
                  >
                    {cName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AIR QUALITY & RANKINGS
          ========================================================================= */}
      {activeTab === 'air_quality' && (
        <div className="space-y-4 animate-fadeIn">
          {/* LIVE HYPER-LOCAL AIR QUALITY GAUGE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
                  <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {t('localAqiTitle')}
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('localAqiSub')}
                </p>
              </div>

              <button
                onClick={handleDetectCurrentLocationAqi}
                disabled={isDetectingAqiGps}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${isDetectingAqiGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingAqiGps ? t('trackingGps') : t('myAreaAqi')}</span>
              </button>
            </div>

            {/* AQI Score & Status Gauge */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${aqiStyle.bg} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
                  {air ? formatNumber(air.aqi) : '45'}
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${aqiStyle.badge}`}>
                    {air ? air.aqiStatus : 'Good'}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">
                    {t('locationLabel')}: <span className="text-teal-600 dark:text-teal-400">{currentLocName}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pollutant Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold">PM2.5</p>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {air ? formatNumber(air.pm25) : '14'} µg/m³
                </p>
              </div>

              <div className="p-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold">PM10</p>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {air ? formatNumber(air.pm10) : '28'} µg/m³
                </p>
              </div>

              <div className="p-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold">NO₂</p>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {air ? formatNumber(air.no2) : '10'} ppb
                </p>
              </div>

              <div className="p-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold">O₃</p>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {air ? formatNumber(air.o3) : '20'} ppb
                </p>
              </div>
            </div>
          </div>

          {/* BANGLADESH & DHAKA AIR QUALITY RANKING LEADERBOARD */}
          <AirQualityLeaderboardCard />

          {/* MONTHLY GLOBAL POLLUTED & ECO-FRIENDLY CITY RANKING */}
          <WorldMonthlyPollutionEcoCard />
        </div>
      )}

      {/* =========================================================================
          TAB 3: COASTAL & CYCLONE
          ========================================================================= */}
      {activeTab === 'coastal_cyclone' && (
        <div className="space-y-4 animate-fadeIn">
          {/* TROPICAL CYCLONE & STORM TRACKER */}
          <CycloneStormTrackerCard />

          {/* COASTAL BEACH & MARINE SEA WAVES */}
          <MarineWeatherCard />

          {/* TIDE & MOON PHASES CALENDAR */}
          <TideMoonCard />

          {/* TRANSIT, PORT & LAUNCH ADVISORY ALERTS */}
          <TransitMarineAdvisoryAlertCard />
        </div>
      )}

      {/* =========================================================================
          TAB 4: AGRI & LIFESTYLE
          ========================================================================= */}
      {activeTab === 'agri_lifestyle' && (
        <div className="space-y-4 animate-fadeIn">
          {/* AGRICULTURAL & CROP ADVISORY */}
          <AgriCropAdvisoryCard />

          {/* SUN, MOON & GPS LOCAL PRAYER TIMES */}
          <SunMoonPrayerCard />

          {/* TOURIST DESTINATION WEATHER GUIDE */}
          <TouristWeatherCard />

          {/* TWO CITY WEATHER COMPARISON TOOL */}
          <WeatherComparisonCard />

          {/* SEASONAL CROP CALENDAR */}
          <SeasonalAgriCalendarCard />

          {/* HISTORICAL CLIMATE EXTREMES */}
          <WeatherHistoryCard />
        </div>
      )}

      {/* Ad Placement Container */}
      <AdBanner />

      {/* BMD SIGNAL GUIDE MODAL */}
      <BmdSignalGuideModal isOpen={showSignalModal} onClose={() => setShowSignalModal(false)} />

      {/* TOURIST TRAVEL GUIDE MODAL */}
      <TouristTravelGuideModal isOpen={showTouristModal} onClose={() => setShowTouristModal(false)} />

      {/* SHARE WEATHER CARD MODAL */}
      <WeatherCardGeneratorModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
};
