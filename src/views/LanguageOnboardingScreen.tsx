import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES_REGISTRY } from '../config/languages';
import { Search, Check, Globe, ArrowRight, Sparkles } from 'lucide-react';

export const LanguageOnboardingScreen: React.FC = () => {
  const { languageCode, setLanguageCode, setActiveScreen, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = LANGUAGES_REGISTRY.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code: string) => {
    setLanguageCode(code);
  };

  const handleFinish = () => {
    setActiveScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 max-w-xl mx-auto">
      <div>
        {/* Header */}
        <div className="text-center pt-4 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{t('selectLanguageTitle')}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('selectLanguageSub')}</p>
        </div>

        {/* Launch Languages Highlight Card */}
        <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
            <Sparkles className="w-4 h-4" />
            <span>Launch Primary Languages (উদ্বোধনী প্রধান ভাষাসমূহ)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES_REGISTRY.filter((l) => l.isLaunchSupported).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  languageCode === lang.code
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="font-bold text-sm leading-none">{lang.nativeName}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{lang.name}</div>
                  </div>
                </div>
                {languageCode === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchLanguagePlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>

        {/* 50 Languages Scrollable Registry */}
        <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredLanguages.map((lang) => {
            const isSelected = languageCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div className="text-left">
                    <span className="font-semibold text-sm">{lang.nativeName}</span>
                    <span className="text-xs opacity-70 ml-2">({lang.name})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lang.dir === 'rtl' && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-mono">
                      RTL
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-4 sticky bottom-0 bg-slate-50 dark:bg-slate-950">
        <button
          onClick={handleFinish}
          className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
