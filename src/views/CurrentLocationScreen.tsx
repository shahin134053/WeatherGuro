import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigation, MapPin, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { LocationItem } from '../types';

export const CurrentLocationScreen: React.FC = () => {
  const { setSelectedLocation, setActiveScreen, t } = useApp();
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Reverse geocode via Open-Meteo
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)}&count=1&language=en&format=json`
          );
          let cityName = 'Current Location';
          let countryName = 'Bangladesh';
          let countryCode = 'BD';

          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results[0]) {
              cityName = data.results[0].name;
              countryName = data.results[0].country || countryName;
              countryCode = data.results[0].country_code ? data.results[0].country_code.toUpperCase() : countryCode;
            }
          }

          const gpsLocation: LocationItem = {
            id: `gps-${lat.toFixed(4)}-${lng.toFixed(4)}`,
            name: cityName,
            localName: cityName,
            country: countryName,
            countryCode: countryCode,
            lat,
            lng,
            admin1: 'GPS Location',
            isCustom: true,
          };

          setSelectedLocation(gpsLocation);
          setIsLocating(false);
          setActiveScreen('dashboard');
        } catch (e) {
          // Fallback location object
          const gpsLocation: LocationItem = {
            id: `gps-${lat.toFixed(4)}-${lng.toFixed(4)}`,
            name: 'My GPS Location',
            country: 'Detected Location',
            countryCode: 'BD',
            lat,
            lng,
            admin1: 'Coordinates',
            isCustom: true,
          };
          setSelectedLocation(gpsLocation);
          setIsLocating(false);
          setActiveScreen('dashboard');
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg(t('gpsPermissionDenied'));
        } else {
          setErrorMsg('Failed to detect precise GPS coordinates. Please check location settings or search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
          <Navigation className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('currentLocationWeather')}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {t('gpsPermissionDesc')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleRequestGps}
          disabled={isLocating}
          className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLocating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('detectingGps')}</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>{t('useGpsBtn')}</span>
            </>
          )}
        </button>

        <button
          onClick={() => setActiveScreen('city_search')}
          className="w-full py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          {t('manualSearchBtn')}
        </button>
      </div>
    </div>
  );
};
