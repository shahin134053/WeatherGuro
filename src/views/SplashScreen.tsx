import React from 'react';
import { useApp } from '../context/AppContext';
import { FlagBadge } from '../components/FlagBadge';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setActiveScreen, selectedCountry, t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Launch Badge */}
      <div className="flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <FlagBadge countryCode={selectedCountry.code} />
          <span className="text-xs font-semibold tracking-wide text-teal-200">{t('launchCountryLabel')}</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">v2.1.0</span>
      </div>

      {/* Main Branding Hero */}
      <div className="my-auto text-center flex flex-col items-center z-10 py-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-teal-300 flex items-center justify-center text-slate-950 shadow-2xl shadow-teal-500/40">
            <Globe className="w-14 h-14 animate-spin-slow" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
          {t('appName')}
        </h1>
        <p className="text-slate-300 text-sm max-w-sm mb-6 leading-relaxed">
          {t('splashSubtext')}
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 text-xs font-medium text-slate-300">
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg flex items-center gap-1.5">
            <FlagBadge countryCode="BD" />
            <span>{t('bmdOfficialBadge')}</span>
          </span>
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg">🌐 50+ Languages</span>
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg">📡 Open-Meteo & GPS</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 z-10 pb-6 max-w-md mx-auto w-full">
        <button
          onClick={() => setActiveScreen('onboarding_lang')}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t('selectLanguageTitle')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveScreen('dashboard')}
          className="w-full py-3 px-6 rounded-2xl bg-white/10 border border-white/15 text-white font-medium text-xs hover:bg-white/15 transition-all cursor-pointer"
        >
          {t('continueBtn')}
        </button>
      </div>
    </div>
  );
};
