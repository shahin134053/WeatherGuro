import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES_CONFIG } from '../config/countries';
import { CountryConfig } from '../types';
import { FlagBadge } from '../components/FlagBadge';
import { Globe, Search, Check, ShieldCheck, Sparkles } from 'lucide-react';

type ContinentFilter = 'all' | 'asia' | 'middle_east' | 'europe' | 'americas' | 'africa' | 'oceania';

const CONTINENT_MAP: Record<string, ContinentFilter> = {
  BD: 'asia',
  IN: 'asia',
  PK: 'asia',
  CN: 'asia',
  JP: 'asia',
  MY: 'asia',
  SA: 'middle_east',
  AE: 'middle_east',
  GB: 'europe',
  DE: 'europe',
  FR: 'europe',
  US: 'americas',
  CA: 'americas',
  BR: 'americas',
  EG: 'africa',
  ZA: 'africa',
  AU: 'oceania',
};

export const CountrySelectorScreen: React.FC = () => {
  const { selectedCountry, setSelectedCountry, setSelectedLocation, setActiveScreen, languageCode, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContinent, setActiveContinent] = useState<ContinentFilter>('all');

  const countriesList = Object.values(COUNTRIES_CONFIG);

  const filteredCountries = countriesList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesContinent =
      activeContinent === 'all' || CONTINENT_MAP[c.code] === activeContinent;

    return matchesSearch && matchesContinent;
  });

  const handleSelectCountry = (country: CountryConfig) => {
    setSelectedCountry(country);
    if (country.popularCities.length > 0) {
      setSelectedLocation(country.popularCities[0]);
    }
    setActiveScreen('dashboard');
  };

  const continentTabs = [
    { id: 'all', label: t('globalFilterAll') },
    { id: 'asia', label: t('asiaFilter') },
    { id: 'middle_east', label: t('middleEastFilter') },
    { id: 'europe', label: t('europeFilter') },
    { id: 'americas', label: t('americasFilter') },
    { id: 'africa', label: t('africaFilter') },
    { id: 'oceania', label: t('oceaniaFilter') },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 text-white rounded-3xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-teal-200 animate-spin-slow" />
          <h1 className="font-extrabold text-base">{t('countrySelectorTitle')}</h1>
        </div>
        <p className="text-xs text-teal-100/90">{t('countrySelectorSub')}</p>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter country (e.g. Bangladesh, USA, Germany, Japan, Saudi Arabia)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all shadow-xs"
        />
      </div>

      {/* CONTINENT TABS FILTER */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {continentTabs.map((tab) => {
          const isActive = activeContinent === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveContinent(tab.id as ContinentFilter)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-500'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Countries Registry Grid */}
      <div className="space-y-2">
        {filteredCountries.map((country) => {
          const isSelected = selectedCountry.code === country.code;
          const isFullCoverage = country.coverageTier === 'full';
          const countryDisplayName = languageCode === 'bn' ? country.localName : country.name;
          const countrySubName = languageCode === 'bn' ? country.name : country.localName;

          return (
            <div
              key={country.code}
              onClick={() => handleSelectCountry(country)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                isSelected
                  ? 'bg-gradient-to-r from-teal-600/10 to-emerald-600/10 border-teal-500 text-teal-900 dark:text-teal-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <FlagBadge countryCode={country.code} className="w-8 h-6 rounded-xs" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{countryDisplayName}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">({countrySubName})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                        isFullCoverage
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isFullCoverage ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <Globe className="w-3 h-3" />}
                      <span>{country.alertSourceLabel || t('globalCoverageNotice')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
