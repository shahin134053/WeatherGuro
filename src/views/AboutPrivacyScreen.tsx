import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeveloperInfoCard } from '../components/DeveloperInfoCard';
import { AppLogo } from '../components/AppLogo';
import { Globe, ShieldCheck, Database, Smartphone, CheckCircle2, ChevronRight } from 'lucide-react';

export const AboutPrivacyScreen: React.FC = () => {
  const { t } = useApp();
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-2 shadow-xs">
        <AppLogo size="xl" className="mx-auto" />
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{t('appName')}</h1>
        <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">{t('appTagline')}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Version 3.5.0 Global Edition (Official Production Release)
        </p>
      </div>

      {/* DEVELOPER & ARCHITECTURE INFO CARD */}
      <DeveloperInfoCard />

      {/* Data Sources & Attribution */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <Database className="w-4 h-4 text-teal-500" />
          <h2>{t('dataSourcesTitle')}</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('dataSourcesDesc')}
        </p>
        <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-4">
          <li><strong>Open-Meteo Weather API:</strong> Non-commercial & commercial open forecast models (ECMWF, GFS).</li>
          <li><strong>Bangladesh Meteorological Department (BMD):</strong> Synoptic bulletin and storm alert gateway.</li>
          <li><strong>Natural Earth:</strong> Free vector and raster map dataset for country boundaries.</li>
        </ul>
      </div>

      {/* Privacy Policy */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h2>{t('privacyTitle')}</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('privacyDesc')}
        </p>
      </div>

      {/* Android Packaging & Deployment Guide Modal Trigger */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-teal-300" />
          <h2 className="font-bold text-sm">{t('androidPackagingTitle')}</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          WeatherGlobe is structured for seamless Capacitor / Android cross-platform builds.
        </p>
        <button
          onClick={() => setShowAndroidModal(true)}
          className="w-full py-2.5 px-4 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-400 transition-all cursor-pointer"
        >
          <span>{t('viewAndroidChecklistBtn')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Android Checklist Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-500" />
                <span>Android & Deployment Checklist</span>
              </h3>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                <p className="font-bold text-teal-800 dark:text-teal-300 mb-1">Capacitor Packaging Steps:</p>
                <code className="block bg-slate-900 text-teal-300 p-2 rounded-xl text-[10px] font-mono">
                  npm install @capacitor/core @capacitor/cli @capacitor/android<br/>
                  npx cap init WeatherGlobe com.weatherglobe.app<br/>
                  npm run build<br/>
                  npx cap add android<br/>
                  npx cap open android
                </code>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Deployment Checklist:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>API Licensing verified (Open-Meteo attribution included).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Map attribution provided (OpenStreetMap & Natural Earth).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>GPS Privacy policy strictly enforces local coordinate use.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>50-language i18n registry with full Bengali and English fallback.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Configuration-driven country system ready for global expansion.</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidModal(false)}
              className="w-full py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs cursor-pointer"
            >
              {t('closeChecklistBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
