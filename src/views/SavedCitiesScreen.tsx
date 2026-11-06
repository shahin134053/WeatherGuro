import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Trash2, Plus, ArrowRight } from 'lucide-react';

export const SavedCitiesScreen: React.FC = () => {
  const { savedCities, toggleSavedCity, setSelectedLocation, setActiveScreen, getLocationName, t } = useApp();

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{t('navSaved')}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Saved Locations ({savedCities.length})
          </h1>
        </div>
        <button
          onClick={() => setActiveScreen('city_search')}
          className="p-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add City</span>
        </button>
      </div>

      {savedCities.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <Star className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No saved cities yet</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Search for locations and click the star icon to bookmark them for fast access.
          </p>
          <button
            onClick={() => setActiveScreen('city_search')}
            className="px-5 py-2.5 rounded-2xl bg-teal-600 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Find Cities
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {savedCities.map((city) => (
            <div
              key={city.id}
              onClick={() => {
                setSelectedLocation(city);
                setActiveScreen('dashboard');
              }}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:border-teal-500 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {getLocationName(city)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {city.admin1 ? `${city.admin1}, ` : ''}
                    {city.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavedCity(city);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
