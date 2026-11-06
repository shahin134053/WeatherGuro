import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchNearbyRainAndSunshine,
  NearbyRainAndSunshineResult,
  NearbyLocationWeather,
} from '../services/nearbyWeatherService';
import { WeatherIcon } from './WeatherIcon';
import { LocationItem } from '../types';
import {
  CloudRain,
  Sun,
  Compass,
  RefreshCw,
  ArrowUpRight,
  Navigation,
  Cloud,
} from 'lucide-react';

export const NearbyRainSunshineRadarCard: React.FC = () => {
  const { selectedLocation, setSelectedLocation, formatTemp, formatNumber, languageCode, getLocationName, t } = useApp();

  const [radarData, setRadarData] = useState<NearbyRainAndSunshineResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'rain' | 'sun' | 'cloud'>('rain');

  const loadRadarData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNearbyRainAndSunshine(selectedLocation);
      setRadarData(data);
      if (data.rainingSpots.length > 0) {
        setActiveFilter('rain');
      } else if (data.sunnySpots.length > 0) {
        setActiveFilter('sun');
      } else {
        setActiveFilter('cloud');
      }
    } catch (err) {
      console.error('Radar data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRadarData();
  }, [selectedLocation.id, selectedLocation.lat, selectedLocation.lng]);

  const handleSelectNearbyCity = (spot: NearbyLocationWeather) => {
    const loc: LocationItem = {
      id: `nearby-spot-${spot.lat}-${spot.lng}`,
      name: spot.cityName,
      localName: spot.cityName,
      country: spot.country,
      countryCode: selectedLocation.countryCode,
      lat: spot.lat,
      lng: spot.lng,
      admin1: spot.bearingText,
      isCustom: true,
    };
    setSelectedLocation(loc);
  };

  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
      {/* Header & Scanning Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                {t('radarTitle')}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-teal-600 dark:text-teal-400 font-bold">
                  {currentLocName}
                </span>{' '}
                {isBn
                  ? 'এর কাছাকাছি কোথায় বৃষ্টি বা রোদ আছে তার লাইভ ট্র্যাকিং'
                  : 'live radius scan for precipitation, sun & cloud cover'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadRadarData}
          disabled={isLoading}
          className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shrink-0"
          title={isBn ? 'স্ক্যান রিফ্রেশ করুন' : 'Refresh radar scan'}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 dark:text-teal-400" />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {t('radarScan')}
          </p>
        </div>
      ) : radarData ? (
        <div className="space-y-3.5">
          {/* NEAREST RAIN CALLOUT BANNER */}
          {radarData.nearestRainSpot ? (
            <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-sky-400/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-sky-300 animate-bounce" />
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-0.5 rounded-full tracking-wide">
                    {isBn ? 'নিকটতম বৃষ্টি সনাক্ত হয়েছে' : 'Nearest Rain Detected'}
                  </span>
                </div>
                <span className="text-xs font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  {isBn
                    ? `${formatNumber(radarData.nearestRainSpot.distanceKm)} কিমি দূরে`
                    : `${radarData.nearestRainSpot.distanceKm} km away`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    {radarData.nearestRainSpot.cityName}
                  </h3>
                  <p className="text-xs text-sky-100/90 font-medium flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-sky-300" />
                    <span>{isBn ? `দিক: ${radarData.nearestRainSpot.bearingText}` : `Bearing: ${radarData.nearestRainSpot.bearingText}`}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold">
                    {formatTemp(radarData.nearestRainSpot.temperature)}
                  </div>
                  <span className="text-[11px] font-bold text-sky-200">
                    {isBn
                      ? `বৃষ্টিপাত: ${formatNumber(radarData.nearestRainSpot.precipitationMm)} মিমি`
                      : `Rain: ${radarData.nearestRainSpot.precipitationMm} mm`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelectNearbyCity(radarData.nearestRainSpot!)}
                className="w-full py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
              >
                <span>{isBn ? `${radarData.nearestRainSpot.cityName}-এর পূর্ণাঙ্গ আবহাওয়া দেখুন` : `View weather for ${radarData.nearestRainSpot.cityName}`}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-3.5 shadow-md flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl text-amber-100 shrink-0">
                <Sun className="w-6 h-6 animate-spin-slow" />
              </div>
              <div className="text-xs font-semibold">
                <h4 className="font-extrabold text-sm">
                  {isBn ? 'আশেপাশে পরিষ্কার রোদ রয়েছে' : 'Clear & Dry Conditions Nearby'}
                </h4>
                <p className="text-amber-100 text-[11px] mt-0.5">
                  {isBn
                    ? 'আপনার নিকটবর্তী এলাকা জুড়ে কোনো ভারি বৃষ্টি নেই, নির্মল রোদ ও শুষ্ক আবহাওয়া বিদ্যমান।'
                    : 'No severe rain detected in the surrounding perimeter; mostly dry with clear sunshine.'}
                </p>
              </div>
            </div>
          )}

          {/* FILTER CATEGORY SWITCHER TABS */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveFilter('rain')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeFilter === 'rain'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{isBn ? `বৃষ্টি হচ্ছে (${formatNumber(radarData.rainingSpots.length)})` : `Rain (${radarData.rainingSpots.length})`}</span>
            </button>

            <button
              onClick={() => setActiveFilter('sun')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeFilter === 'sun'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{isBn ? `রোদ আছে (${formatNumber(radarData.sunnySpots.length)})` : `Sunny (${radarData.sunnySpots.length})`}</span>
            </button>

            <button
              onClick={() => setActiveFilter('cloud')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeFilter === 'cloud'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{isBn ? `মেঘলা (${formatNumber(radarData.cloudySpots.length)})` : `Cloudy (${radarData.cloudySpots.length})`}</span>
            </button>
          </div>

          {/* LIST OF LOCATIONS */}
          <div className="space-y-2">
            {activeFilter === 'rain' && (
              <>
                {radarData.rainingSpots.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {t('radarNoRain')}
                  </div>
                ) : (
                  radarData.rainingSpots.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => handleSelectNearbyCity(spot)}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-950/30 border border-slate-200 dark:border-slate-800 hover:border-sky-400 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          <WeatherIcon code={spot.weatherCode} isDay={spot.isDay} className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {spot.cityName}
                            </h4>
                            <span className="text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full border border-sky-300 dark:border-sky-800">
                              {isBn ? `${formatNumber(spot.distanceKm)} কিমি দূরে` : `${spot.distanceKm} km`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Navigation className="w-3 h-3 text-sky-500" />
                            <span>{spot.bearingText}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {formatTemp(spot.temperature)}
                        </div>
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                          {isBn ? `${formatNumber(spot.precipitationMm)} মিমি বৃষ্টি` : `${spot.precipitationMm} mm rain`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeFilter === 'sun' && (
              <>
                {radarData.sunnySpots.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {t('radarNoSun')}
                  </div>
                ) : (
                  radarData.sunnySpots.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => handleSelectNearbyCity(spot)}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-800 hover:border-amber-400 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                          <WeatherIcon code={spot.weatherCode} isDay={spot.isDay} className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {spot.cityName}
                            </h4>
                            <span className="text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                              {isBn ? `${formatNumber(spot.distanceKm)} কিমি দূরে` : `${spot.distanceKm} km`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Navigation className="w-3 h-3 text-amber-500" />
                            <span>{spot.bearingText}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                          {formatTemp(spot.temperature)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {isBn ? 'নির্মল রোদ' : 'Sunny'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeFilter === 'cloud' && (
              <>
                {radarData.cloudySpots.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => handleSelectNearbyCity(spot)}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <WeatherIcon code={spot.weatherCode} isDay={spot.isDay} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {spot.cityName}
                          </h4>
                          <span className="text-[10px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            {isBn ? `${formatNumber(spot.distanceKm)} কিমি দূরে` : `${spot.distanceKm} km`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Navigation className="w-3 h-3 text-slate-500" />
                          <span>{spot.bearingText}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {formatTemp(spot.temperature)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {isBn ? 'আংশিক মেঘলা' : 'Cloudy'}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
