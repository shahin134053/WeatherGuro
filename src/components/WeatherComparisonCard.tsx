import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BANGLADESH_DISTRICTS } from '../config/bangladeshDistricts';
import { COUNTRIES_CONFIG } from '../config/countries';
import { LocationItem, FullWeatherData } from '../types';
import { fetchWeatherData, searchCities } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcon';
import {
  ArrowRightLeft,
  Thermometer,
  Droplets,
  Wind,
  Sparkles,
  Search,
  Loader2,
  Activity,
  Gauge,
  Sun,
  CloudRain,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const WeatherComparisonCard: React.FC = () => {
  const {
    selectedLocation,
    weatherData,
    formatTemp,
    formatWind,
    formatNumber,
    getConditionName,
    languageCode,
    t,
  } = useApp();

  // Flatten all 64 Bangladesh districts
  const allBdDistricts: LocationItem[] = BANGLADESH_DISTRICTS.flatMap((div) => div.districts);

  // Global popular cities list
  const globalCities: LocationItem[] = COUNTRIES_CONFIG['GLOBAL']?.popularCities || [
    { id: 'global-london', name: 'London', localName: 'লন্ডন', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, admin1: 'England' },
    { id: 'global-newyork', name: 'New York', localName: 'নিউ ইয়র্ক', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.006, admin1: 'New York' },
    { id: 'global-tokyo', name: 'Tokyo', localName: 'টোকিও', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503, admin1: 'Tokyo' },
    { id: 'global-dubai', name: 'Dubai', localName: 'দুবাই', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lng: 55.2708, admin1: 'Dubai' },
    { id: 'global-kolkata', name: 'Kolkata', localName: 'কলকাতা', country: 'India', countryCode: 'IN', lat: 22.5726, lng: 88.3639, admin1: 'West Bengal' },
    { id: 'global-riyadh', name: 'Riyadh', localName: 'রিয়াদ', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.7136, lng: 46.6753, admin1: 'Riyadh Province' },
  ];

  // Default City 1 = active app selected location
  const [cityOne, setCityOne] = useState<LocationItem>(selectedLocation);
  const [weatherOne, setWeatherOne] = useState<FullWeatherData | null>(weatherData);
  const [isLoadingOne, setIsLoadingOne] = useState<boolean>(false);

  // Default City 2 = Chattogram or another district
  const defaultCityTwo = allBdDistricts.find((d) => d.id === 'bd-chattogram') || allBdDistricts[1];
  const [cityTwo, setCityTwo] = useState<LocationItem>(defaultCityTwo);
  const [weatherTwo, setWeatherTwo] = useState<FullWeatherData | null>(null);
  const [isLoadingTwo, setIsLoadingTwo] = useState<boolean>(true);

  // Search feature for City 2
  const [showSearchBoxTwo, setShowSearchBoxTwo] = useState<boolean>(false);
  const [searchQueryTwo, setSearchQueryTwo] = useState<string>('');
  const [searchResultsTwo, setSearchResultsTwo] = useState<LocationItem[]>([]);
  const [isSearchingTwo, setIsSearchingTwo] = useState<boolean>(false);

  // Sync cityOne with selectedLocation when selectedLocation changes
  useEffect(() => {
    setCityOne(selectedLocation);
    setWeatherOne(weatherData);
  }, [selectedLocation, weatherData]);

  // Fetch weather data for City 1 if user picked a custom city 1
  useEffect(() => {
    if (cityOne.id === selectedLocation.id && weatherData) {
      setWeatherOne(weatherData);
      setIsLoadingOne(false);
      return;
    }

    let isMounted = true;
    setIsLoadingOne(true);
    fetchWeatherData(cityOne)
      .then((data) => {
        if (isMounted) {
          setWeatherOne(data);
          setIsLoadingOne(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching weather for City 1 comparison:', err);
        if (isMounted) setIsLoadingOne(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cityOne]);

  // Fetch weather data for City 2 whenever cityTwo changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingTwo(true);
    fetchWeatherData(cityTwo)
      .then((data) => {
        if (isMounted) {
          setWeatherTwo(data);
          setIsLoadingTwo(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching weather for City 2 comparison:', err);
        if (isMounted) setIsLoadingTwo(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cityTwo]);

  // Live city search handler for City 2
  const handleSearchCityTwo = async (q: string) => {
    setSearchQueryTwo(q);
    if (q.trim().length < 2) {
      setSearchResultsTwo([]);
      return;
    }
    setIsSearchingTwo(true);
    try {
      const results = await searchCities(q);
      setSearchResultsTwo(results);
    } catch (e) {
      console.error('Search error for comparison:', e);
    } finally {
      setIsSearchingTwo(false);
    }
  };

  const current1 = weatherOne?.current;
  const air1 = weatherOne?.airQuality;
  const current2 = weatherTwo?.current;
  const air2 = weatherTwo?.airQuality;

  // Comparison logic calculations
  const tempDiff = current1 && current2 ? current1.temperature - current2.temperature : 0;
  const humidityDiff = current1 && current2 ? current1.humidity - current2.humidity : 0;
  const aqiDiff = air1 && air2 ? air1.aqi - air2.aqi : 0;

  const cityOneLabel = languageCode === 'bn' ? (cityOne.localName || cityOne.name) : cityOne.name;
  const cityTwoLabel = languageCode === 'bn' ? (cityTwo.localName || cityTwo.name) : cityTwo.name;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {languageCode === 'bn' ? 'দুই শহরের আবহাওয়া তুলনা' : 'Two-City Weather Comparison'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {languageCode === 'bn'
                ? 'বাংলাদেশের ৬৪ জেলা বা বিশ্বের যে কোনো শহরের রিয়েল-টাইম আবহাওয়া তুলনা করুন'
                : 'Compare real-time temperature, humidity & air quality between any cities'}
            </p>
          </div>
        </div>
      </div>

      {/* Two Cities Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* ================= CITY 1 CARD ================= */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-teal-500/20 rounded-2xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-wider bg-teal-500/15 px-2 py-0.5 rounded-full">
              {languageCode === 'bn' ? 'শহর ১ (বর্তমান / নির্বাচিত)' : 'City 1 (Active)'}
            </span>
            {isLoadingOne && <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />}
          </div>

          {/* City 1 Dropdown Selector */}
          <select
            value={cityOne.id}
            onChange={(e) => {
              const val = e.target.value;
              const found = allBdDistricts.find((d) => d.id === val) || globalCities.find((g) => g.id === val);
              if (found) setCityOne(found);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <optgroup label={languageCode === 'bn' ? '📍 বর্তমান অ্যাপ লোকেশন' : '📍 Current App Location'}>
              <option value={selectedLocation.id}>
                {languageCode === 'bn' ? (selectedLocation.localName || selectedLocation.name) : selectedLocation.name} ({selectedLocation.admin1 || selectedLocation.country})
              </option>
            </optgroup>
            {BANGLADESH_DISTRICTS.map((div) => (
              <optgroup key={div.divisionNameEn} label={languageCode === 'bn' ? `🇧🇩 ${div.divisionNameBn}` : `🇧🇩 ${div.divisionNameEn}`}>
                {div.districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {languageCode === 'bn' ? d.localName || d.name : d.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <optgroup label={languageCode === 'bn' ? '🌐 আন্তর্জাতিক শহরসমূহ' : '🌐 Global Popular Cities'}>
              {globalCities.map((g) => (
                <option key={g.id} value={g.id}>
                  {languageCode === 'bn' ? g.localName || g.name : g.name} ({g.country})
                </option>
              ))}
            </optgroup>
          </select>

          {/* City 1 Live Weather Info */}
          {isLoadingOne ? (
            <div className="py-6 text-center text-slate-400 space-y-1">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-teal-500" />
              <p className="text-[11px]">{languageCode === 'bn' ? 'আবহাওয়া তথ্য লোড হচ্ছে...' : 'Fetching weather...'}</p>
            </div>
          ) : current1 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{cityOneLabel}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {getConditionName(current1.weatherCode)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <WeatherIcon code={current1.weatherCode} isDay={current1.isDay} className="w-8 h-8 shrink-0" />
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                    {formatTemp(current1.temperature)}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    {languageCode === 'bn' ? 'আর্দ্রতা' : 'Humidity'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatNumber(current1.humidity)}%
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-teal-500" />
                    {languageCode === 'bn' ? 'বাতাস' : 'Wind'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatWind(current1.windSpeed)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    {languageCode === 'bn' ? 'বায়ুর মান (AQI)' : 'Air Quality'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {air1 ? formatNumber(air1.aqi) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" />
                    {languageCode === 'bn' ? 'অনুভূতি' : 'Feels like'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatTemp(current1.feelsLike)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* ================= CITY 2 CARD ================= */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-indigo-500/20 rounded-2xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider bg-indigo-500/15 px-2 py-0.5 rounded-full">
              {languageCode === 'bn' ? 'শহর ২ (তুলনার জন্য)' : 'City 2 (Comparison)'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowSearchBoxTwo(!showSearchBoxTwo)}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 cursor-pointer"
              >
                <Search className="w-3 h-3" />
                <span>{showSearchBoxTwo ? (languageCode === 'bn' ? 'তালিকা' : 'List') : (languageCode === 'bn' ? 'সার্চ' : 'Search')}</span>
              </button>
              {isLoadingTwo && <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />}
            </div>
          </div>

          {/* City 2 Selection Input: Either Dropdown or Search Box */}
          {showSearchBoxTwo ? (
            <div className="space-y-1.5 relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQueryTwo}
                  onChange={(e) => handleSearchCityTwo(e.target.value)}
                  placeholder={languageCode === 'bn' ? 'যেকোনো শহর বা জেলা লিখুন...' : 'Type any city or district name...'}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {isSearchingTwo && <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin absolute right-2.5 top-2.5" />}
              </div>

              {/* Search Results Dropdown */}
              {searchResultsTwo.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResultsTwo.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCityTwo(item);
                        setShowSearchBoxTwo(false);
                        setSearchQueryTwo('');
                        setSearchResultsTwo([]);
                      }}
                      className="w-full text-left p-2 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.admin1 || item.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* City 2 Standard Select Dropdown */
            <select
              value={cityTwo.id}
              onChange={(e) => {
                const val = e.target.value;
                const found = allBdDistricts.find((d) => d.id === val) || globalCities.find((g) => g.id === val);
                if (found) setCityTwo(found);
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {BANGLADESH_DISTRICTS.map((div) => (
                <optgroup key={div.divisionNameEn} label={languageCode === 'bn' ? `🇧🇩 ${div.divisionNameBn}` : `🇧🇩 ${div.divisionNameEn}`}>
                  {div.districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {languageCode === 'bn' ? d.localName || d.name : d.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label={languageCode === 'bn' ? '🌐 আন্তর্জাতিক শহরসমূহ' : '🌐 Global Popular Cities'}>
                {globalCities.map((g) => (
                  <option key={g.id} value={g.id}>
                    {languageCode === 'bn' ? g.localName || g.name : g.name} ({g.country})
                  </option>
                ))}
              </optgroup>
            </select>
          )}

          {/* City 2 Live Weather Info */}
          {isLoadingTwo ? (
            <div className="py-6 text-center text-slate-400 space-y-1">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-indigo-500" />
              <p className="text-[11px]">{languageCode === 'bn' ? 'দ্বিতীয় শহরের তথ্য লোড হচ্ছে...' : 'Fetching second city weather...'}</p>
            </div>
          ) : current2 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{cityTwoLabel}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {getConditionName(current2.weatherCode)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <WeatherIcon code={current2.weatherCode} isDay={current2.isDay} className="w-8 h-8 shrink-0" />
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatTemp(current2.temperature)}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    {languageCode === 'bn' ? 'আর্দ্রতা' : 'Humidity'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatNumber(current2.humidity)}%
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-indigo-500" />
                    {languageCode === 'bn' ? 'বাতাস' : 'Wind'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatWind(current2.windSpeed)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    {languageCode === 'bn' ? 'বায়ুর মান (AQI)' : 'Air Quality'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {air2 ? formatNumber(air2.aqi) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" />
                    {languageCode === 'bn' ? 'অনুভূতি' : 'Feels like'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatTemp(current2.feelsLike)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Dynamic Summary comparison insights highlight */}
      {current1 && current2 && !isLoadingOne && !isLoadingTwo && (
        <div className="bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 border border-teal-500/20 dark:border-indigo-500/20 rounded-2xl p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{languageCode === 'bn' ? 'তুলাণামূলক বিশ্লেষণ (Comparison Summary):' : 'Comparison Summary:'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
            {/* Temperature diff insight */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                {languageCode === 'bn' ? 'তাপমাত্রা পার্থক্য' : 'Temp Difference'}
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {tempDiff === 0
                  ? languageCode === 'bn'
                    ? 'উভয় শহরে তাপমাত্রা সমান'
                    : 'Equal temperature'
                  : tempDiff > 0
                  ? languageCode === 'bn'
                    ? `${cityOneLabel}, ${cityTwoLabel} এর চেয়ে ${formatNumber(Math.abs(tempDiff))}°C বেশি গরম`
                    : `${cityOneLabel} is ${formatNumber(Math.abs(tempDiff))}°C warmer than ${cityTwoLabel}`
                  : languageCode === 'bn'
                  ? `${cityTwoLabel}, ${cityOneLabel} এর চেয়ে ${formatNumber(Math.abs(tempDiff))}°C বেশি গরম`
                  : `${cityTwoLabel} is ${formatNumber(Math.abs(tempDiff))}°C warmer than ${cityOneLabel}`}
              </p>
            </div>

            {/* Humidity diff insight */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                {languageCode === 'bn' ? 'আর্দ্রতা পরিস্থিতি' : 'Humidity Insight'}
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {humidityDiff === 0
                  ? languageCode === 'bn'
                    ? 'আর্দ্রতা হুবহু এক'
                    : 'Identical humidity'
                  : humidityDiff > 0
                  ? languageCode === 'bn'
                    ? `${cityOneLabel} এ আর্দ্রতা ${formatNumber(Math.abs(humidityDiff))}% বেশি`
                    : `${cityOneLabel} humidity is ${formatNumber(Math.abs(humidityDiff))}% higher`
                  : languageCode === 'bn'
                  ? `${cityTwoLabel} এ আর্দ্রতা ${formatNumber(Math.abs(humidityDiff))}% বেশি`
                  : `${cityTwoLabel} humidity is ${formatNumber(Math.abs(humidityDiff))}% higher`}
              </p>
            </div>

            {/* Air quality insight */}
            {air1 && air2 && (
              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  {languageCode === 'bn' ? 'বাতাসের মান (AQI)' : 'Air Quality Insight'}
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {aqiDiff === 0
                    ? languageCode === 'bn'
                      ? 'উভয় শহরের বাতাসের মান সমান'
                      : 'Equal AQI index'
                    : aqiDiff < 0
                    ? languageCode === 'bn'
                      ? `${cityOneLabel} এর বাতাসের মান ভালো (AQI ${formatNumber(air1.aqi)})`
                      : `${cityOneLabel} has cleaner air (AQI ${formatNumber(air1.aqi)})`
                    : languageCode === 'bn'
                    ? `${cityTwoLabel} এর বাতাসের মান ভালো (AQI ${formatNumber(air2.aqi)})`
                    : `${cityTwoLabel} has cleaner air (AQI ${formatNumber(air2.aqi)})`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
