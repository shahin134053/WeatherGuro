import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES_REGISTRY } from '../config/languages';
import { Globe, Search, Check, ArrowLeft, Home, CheckCircle2 } from 'lucide-react';

export const LanguageSettingsScreen: React.FC = () => {
  const { languageCode, setLanguageCode, setActiveScreen, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const isBn = languageCode === 'bn';

  const filtered = LANGUAGES_REGISTRY.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code: string) => {
    setLanguageCode(code);
    const chosen = LANGUAGES_REGISTRY.find((l) => l.code === code);
    setJustSelected(chosen ? `${chosen.flag} ${chosen.nativeName}` : code);
    setTimeout(() => {
      setJustSelected(null);
    }, 3000);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
      {/* Header with Return Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <Globe className="w-4 h-4" />
              <h1 className="font-black text-base text-slate-900 dark:text-white">{t('langSettingsTitle')}</h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn ? '৫০টি বৈশ্বিক ভাষা ও মাতৃভাষা রূপান্তর সমর্থন' : '50 global languages with automatic mother-tongue conversion'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('dashboard')}
          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{isBn ? 'হোমে ফিরুন' : 'Home'}</span>
        </button>
      </div>

      {/* Confirmation Toast */}
      {justSelected && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg flex items-center justify-between animate-fadeIn text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>
              {isBn ? `ভাষা সফলভাবে পরিবর্তিত হয়েছে: ${justSelected}` : `Language successfully updated: ${justSelected}`}
            </span>
          </div>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-2.5 py-1 bg-white text-emerald-900 rounded-lg text-[11px] font-black cursor-pointer hover:bg-emerald-100"
          >
            {isBn ? 'হোমে যান' : 'Go to Home'}
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchLanguagePlaceholder')}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all font-medium"
        />
      </div>

      {/* Languages List */}
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map((lang) => {
          const isSelected = languageCode === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`w-full px-4 py-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <div className="text-left">
                  <span className="font-bold text-sm">{lang.nativeName}</span>
                  <span className="text-xs opacity-75 ml-2">({lang.name})</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {lang.dir === 'rtl' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-mono">
                    RTL
                  </span>
                )}
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
