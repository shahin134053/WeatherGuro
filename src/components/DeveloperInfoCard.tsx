import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import {
  Globe,
  Zap,
  Cpu,
  Layers,
  Heart,
  ExternalLink,
  Award,
  CheckCircle2,
  Mail,
  Copy,
  Check,
  MapPin,
  UserCheck,
} from 'lucide-react';

export const DeveloperInfoCard: React.FC = () => {
  const { t, languageCode } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const developerEmail = 'shahin.prpl@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 relative overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <AppLogo size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              WeatherGlobe — {t('developerTitle')}
            </h2>
            <span className="text-[10px] font-extrabold bg-teal-600 text-white px-2.5 py-0.5 rounded-full">
              v3.5.0 Global
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Official Developer & Software Engineering Information
          </p>
        </div>
      </div>

      {/* Main Developer Profile Badge */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-4 sm:p-5 shadow-md space-y-4 border border-teal-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* MS Avatar Badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center border border-teal-300/30">
                <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-white">
                  MS
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                  {t('developerName')}
                </h3>
                <span className="text-[10px] bg-teal-500/30 text-teal-200 border border-teal-400/30 font-bold px-2 py-0.5 rounded-full">
                  Full Stack
                </span>
              </div>
              <p className="text-xs text-teal-300 font-semibold mt-0.5">
                {t('developerRole')}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                <MapPin className="w-3 h-3 text-teal-400" />
                <span>{t('developerLocation')}</span>
              </div>
            </div>
          </div>

          <span className="self-start sm:self-auto text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('verifiedAuthor')}</span>
          </span>
        </div>

        {/* Direct Email Contact Box */}
        <div className="p-3 bg-slate-900/90 border border-teal-500/30 rounded-xl space-y-2">
          <div className="text-xs text-slate-300 font-medium flex items-center justify-between">
            <span className="text-teal-300 font-bold flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-teal-400" />
              {languageCode === 'bn' ? 'অফিশিয়াল ডেভেলপার ইমেইল:' : 'Official Developer Email:'}
            </span>
            {copiedEmail && (
              <span className="text-[11px] text-emerald-400 font-bold animate-pulse flex items-center gap-1">
                <Check className="w-3 h-3" /> {t('emailCopied')}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <a
              href={`mailto:${developerEmail}`}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-200 px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-colors truncate"
              title="Send email"
            >
              <Mail className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span className="truncate">{developerEmail}</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="flex-1 sm:flex-none px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('emailCopied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('copyEmail')}</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${developerEmail}`}
                className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{languageCode === 'bn' ? 'মেইল করুন' : 'Send Mail'}</span>
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          {languageCode === 'bn'
            ? '“ওয়েদারগ্লোব (WeatherGlobe) একটি বিশ্বমানের বাংলাদেশ-ফার্স্ট গ্লোবাল আবহাওয়া ট্র্যাকিং প্ল্যাটফর্ম। মুক্ত ও কি-লেস (100% Free & Keyless API) প্রযুক্তির সাহায্যে বিশ্বজুড়ে নির্ভুল আবহাওয়ার পূর্বাভাস পৌঁছে দিতে কাজ করে যাচ্ছি। যেকোনো মতামত বা প্রজেক্ট কোলাবোরেশনের জন্য সরাসরি মেইল করুন।”'
            : '“WeatherGlobe is a world-class Bangladesh-first global weather platform. Powered by 100% free and keyless API infrastructure, it delivers accurate weather forecasts worldwide. Feel free to contact directly for any feedback or project collaboration.”'}
        </p>
      </div>

      {/* Technical Architecture & Stack */}
      <div className="space-y-2">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>{languageCode === 'bn' ? 'সফটওয়্যার আর্কিটেকচার ও টেকনোলজি স্ট্যাক' : 'Software Architecture & Tech Stack'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>{languageCode === 'bn' ? 'ফ্রন্টএন্ড ফ্রেমওয়ার্ক' : 'Frontend Framework'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              React 18 + TypeScript + Vite + Tailwind CSS v4
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{languageCode === 'bn' ? 'আবহাওয়া ও জিও ইঞ্জিন' : 'Weather & Geo Engine'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Open-Meteo High-Resolution ECMWF & GFS Datasets
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{languageCode === 'bn' ? 'অটো জিপিএস ও মাতৃভাষা' : 'Auto GPS & i18n Engine'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              BigDataCloud Client Reverse Geocode & Auto Country Language i18n
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>{languageCode === 'bn' ? 'অফলাইন PWA & ডাটা ব্যাকআপ' : 'Offline PWA & Data Exporter'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Service Worker Offline Cache & Bulletin Text/JSON Exporter
            </p>
          </div>
        </div>
      </div>

      {/* Key Guarantees checklist */}
      <div className="p-3.5 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-900/50 text-xs space-y-2">
        <h4 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{languageCode === 'bn' ? 'ডেভেলপার গ্যারান্টিসমূহ' : 'Developer Guarantees'}</span>
        </h4>
        <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2">
            <span className="text-teal-600 font-bold">✓</span>
            <span>{languageCode === 'bn' ? '১০০% ফ্রি ও কি-লেস এপিআই — কোনো পেইড এপিআই কি প্রয়োজন নেই।' : '100% Free & Keyless API — No paid API keys required.'}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600 font-bold">✓</span>
            <span>{languageCode === 'bn' ? 'সম্পূর্ণ প্রাইভেসি বান্ধব — ইউজারের জিপিএস তথ্য কোনো সার্ভারে জমা রাখা হয় না।' : '100% Privacy Friendly — GPS coordinates are never saved on servers.'}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600 font-bold">✓</span>
            <span>{languageCode === 'bn' ? 'অ্যান্ড্রয়েড PWA ইনস্টল সাপোর্ট — হোমস্ক্রিনে অ্যাপ হিসেবে ব্যবহারযোগ্য।' : 'Android PWA Support — Install directly on home screen.'}</span>
          </li>
        </ul>
      </div>

      {/* Footer note */}
      <div className="text-center pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1">
        <span>Designed & Built with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
        <span>by <strong className="text-slate-800 dark:text-slate-200">{t('developerName')}</strong> — {developerEmail}</span>
      </div>
    </div>
  );
};
