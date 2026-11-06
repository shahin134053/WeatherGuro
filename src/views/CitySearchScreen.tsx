import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchCities } from '../services/weatherApi';
import { BANGLADESH_DISTRICTS } from '../config/bangladeshDistricts';
import { LocationItem } from '../types';
import { Search, MapPin, Star, History, Sparkles, X, Loader2, Home, Check } from 'lucide-react';

export const CitySearchScreen: React.FC = () => {
  const {
    setSelectedLocation,
    setActiveScreen,
    isCitySaved,
    toggleSavedCity,
    defaultHomeLocation,
    setDefaultHomeLocation,
    isHomeLocation,
    languageCode,
    t,
  } = useApp();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeDivisionIndex, setActiveDivisionIndex] = useState<number>(0);

  // Recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState<LocationItem[]>(() => {
    try {
      const stored = localStorage.getItem('weatherglobe_recent_searches');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = await searchCities(val);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectLocation = (location: LocationItem) => {
    // Add to recent searches
    const updated = [location, ...recentSearches.filter((c) => c.id !== location.id)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('weatherglobe_recent_searches', JSON.stringify(updated));

    setSelectedLocation(location);
    setActiveScreen('dashboard');
  };

  const currentDivision = BANGLADESH_DISTRICTS[activeDivisionIndex];

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-4 rounded-3xl shadow-md">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-200" />
          <h1 className="font-extrabold text-base">{t('cityAndDistrictSearchTitle')}</h1>
        </div>
        <p className="text-xs text-teal-100/90 mt-1">
          {t('cityAndDistrictSearchSub')}
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          autoFocus
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Search Results */}
      {isSearching && (
        <div className="py-8 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
          <p className="text-xs">{t('splashLoading')}</p>
        </div>
      )}

      {query.trim().length >= 2 && !isSearching && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Search Results ({searchResults.length})
          </h2>
          {searchResults.length === 0 ? (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              {t('noCityFound')}
            </div>
          ) : (
            <div className="space-y-1.5">
              {searchResults.map((city) => {
                const isHome = isHomeLocation(city.id);
                return (
                  <div
                    key={city.id}
                    className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:border-teal-500 transition-all cursor-pointer"
                    onClick={() => handleSelectLocation(city)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white">{city.name}</h3>
                          {isHome && (
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-md">
                              {t('homeLabel')}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {city.admin1 ? `${city.admin1}, ` : ''}
                          {city.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDefaultHomeLocation(city)}
                        className={`p-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isHome
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-700'
                        }`}
                        title={t('setHomeDistrictTooltip')}
                      >
                        <Home className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleSavedCity(city)}
                        className="p-1.5 text-slate-400 hover:text-amber-400"
                        title={t('addToFavoritesTooltip')}
                      >
                        <Star className={`w-4 h-4 ${isCitySaved(city.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && !query && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            <History className="w-3.5 h-3.5 text-teal-500" />
            <span>{t('recentSearches')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelectLocation(city)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-teal-500 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{languageCode === 'bn' ? (city.localName || city.name) : city.name}</span>
                <span className="text-[10px] text-slate-400">({city.countryCode})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BANGLADESH 64 DISTRICTS BY DIVISION SELECTOR */}
      {!query && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                {t('bangladesh64DistrictsTitle')}
              </h2>
            </div>
            {defaultHomeLocation && (
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Home className="w-3 h-3" />
                <span>{t('homeLabel')}: {languageCode === 'bn' ? (defaultHomeLocation.localName || defaultHomeLocation.name) : defaultHomeLocation.name}</span>
              </span>
            )}
          </div>

          {/* Division Selector Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
            {BANGLADESH_DISTRICTS.map((div, index) => {
              const isActive = index === activeDivisionIndex;
              const divName = languageCode === 'bn' ? div.divisionNameBn : div.divisionNameEn;
              return (
                <button
                  key={div.divisionNameEn}
                  onClick={() => setActiveDivisionIndex(index)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {divName}
                </button>
              );
            })}
          </div>

          {/* Districts Grid under Active Division */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {currentDivision.districts.map((district) => {
              const isHome = isHomeLocation(district.id);
              const nameToShow = languageCode === 'bn' ? district.localName : district.name;
              const subNameToShow = languageCode === 'bn' ? district.name : district.localName;
              return (
                <div
                  key={district.id}
                  onClick={() => handleSelectLocation(district)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative group flex items-center justify-between ${
                    isHome
                      ? 'bg-amber-500/10 border-amber-500/50 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-teal-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {nameToShow}
                      </p>
                      {isHome && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{subNameToShow}</p>
                  </div>

                  {/* Set Home Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultHomeLocation(district);
                    }}
                    className={`p-1.5 rounded-xl transition-all ${
                      isHome
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-amber-400 hover:text-slate-950'
                    }`}
                    title={t('setHomeDistrictTooltip')}
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
