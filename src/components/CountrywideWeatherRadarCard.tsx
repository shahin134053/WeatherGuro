import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES_CONFIG } from '../config/countries';
import { LocationItem } from '../types';
import { fetchWeatherData } from '../services/weatherApi';
import { CloudRain, Sun, Cloud, RefreshCw, MapPin, Sparkles } from 'lucide-react';

interface CityRadarStatus {
  city: LocationItem;
  temp: number;
  conditionCode: number;
  statusText: string;
  isRain: boolean;
  isSun: boolean;
}

export const CountrywideWeatherRadarCard: React.FC = () => {
  const { selectedCountry, selectedLocation, setSelectedLocation, languageCode, formatTemp } = useApp();
  const [cityStatuses, setCityStatuses] = useState<CityRadarStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isBn = languageCode === 'bn';

  const loadCountrywideRadar = async () => {
    setIsLoading(true);
    try {
      const cities = COUNTRIES_CONFIG[selectedCountry.code]?.popularCities || COUNTRIES_CONFIG['BD'].popularCities;
      const results: CityRadarStatus[] = [];

      for (const city of cities.slice(0, 8)) {
        try {
          const data = await fetchWeatherData(city);
          const code = data.current.weatherCode;
          const temp = data.current.temperature;

          let isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 99);
          let isSun = code === 0 || code === 1;

          let statusText = isBn ? 'পরিষ্কার ও রোদ' : 'Sunny & Clear';
          if (isRain) statusText = isBn ? 'বৃষ্টিপাত হচ্ছে' : 'Raining';
          else if (code === 2 || code === 3) statusText = isBn ? 'মেঘলা আকাশ' : 'Cloudy';

          results.push({
            city,
            temp,
            conditionCode: code,
            statusText,
            isRain,
            isSun,
          });
        } catch {
          // skip failed city
        }
      }

      setCityStatuses(results);
    } catch (err) {
      console.error('Countrywide radar error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCountrywideRadar();
  }, [selectedCountry.code]);

  const rainyCities = cityStatuses.filter((s) => s.isRain);
  const sunnyCities = cityStatuses.filter((s) => s.isSun);
  const otherCities = cityStatuses.filter((s) => !s.isRain && !s.isSun);

  const countryName = isBn ? (selectedCountry.localName || selectedCountry.name) : selectedCountry.name;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-3.5">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              {isBn ? `${countryName}-এ কোথায় বৃষ্টি ও কোথায় রোদ` : `Where It's Raining & Sunny in ${countryName}`}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {isBn ? 'দেশের বিভিন্ন অঞ্চলে বর্তমান বৃষ্টিপাত ও রোদের লাইভ স্ট্যাটাস' : 'Live regional breakdown of precipitation and sunshine across the country'}
            </p>
          </div>
        </div>

        <button
          onClick={loadCountrywideRadar}
          disabled={isLoading}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer shrink-0"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
          <p className="text-xs font-bold text-slate-500">
            {isBn ? 'দেশের আঞ্চলিক আবহাওয়া স্ক্যান করা হচ্ছে...' : 'Scanning countrywide regional weather...'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* RAIN REGIONS */}
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-sky-800 dark:text-sky-300">
              <CloudRain className="w-4 h-4 text-sky-500" />
              <span>{isBn ? `🌧️ বৃষ্টির অঞ্চল (${rainyCities.length}টি শহর)` : `🌧️ Rainy Regions (${rainyCities.length} cities)`}</span>
            </div>
            {rainyCities.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic pl-6">
                {isBn ? 'বর্তমানে এই অঞ্চলে কোনো ভারী বৃষ্টি সনাক্ত হয়নি (সব জায়গায় পরিষ্কার বা মেঘলা)।' : 'No active rain detected across monitored cities currently.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                {rainyCities.map((item) => (
                  <button
                    key={item.city.id}
                    onClick={() => setSelectedLocation(item.city)}
                    className="p-2 bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 rounded-xl text-left hover:border-teal-500 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {isBn ? (item.city.localName || item.city.name) : item.city.name}
                      </p>
                      <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">{item.statusText}</p>
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{formatTemp(item.temp)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SUNNY REGIONS */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{isBn ? `☀️ রৌদ্রোজ্জ্বল অঞ্চল (${sunnyCities.length}টি শহর)` : `☀️ Sunny Regions (${sunnyCities.length} cities)`}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              {sunnyCities.map((item) => (
                <button
                  key={item.city.id}
                  onClick={() => setSelectedLocation(item.city)}
                  className="p-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-left hover:border-teal-500 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {isBn ? (item.city.localName || item.city.name) : item.city.name}
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{item.statusText}</p>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">{formatTemp(item.temp)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
