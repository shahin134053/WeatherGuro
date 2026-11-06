import React from 'react';
import { useApp } from '../context/AppContext';
import { Anchor, Moon, Sunrise, Waves } from 'lucide-react';

export const TideMoonCard: React.FC = () => {
  const { languageCode, weatherData } = useApp();
  const isBn = languageCode === 'bn';

  // Calculate simulated tide and moon phase based on current day & location
  const currentTemp = weatherData?.current?.temperature || 28;
  const windSpeed = weatherData?.current?.windSpeed || 12;

  // Moon phases cycle simulation
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const moonPhaseIndex = dayOfYear % 8;
  
  const moonPhases = [
    { nameEn: 'New Moon (অমাবস্যা)', nameBn: 'অমাবস্যা', nameAr: 'محاق', nameEs: 'Luna Nueva', nameDe: 'Neumond', nameFr: 'Nouvelle Lune', icon: '🌑', descEn: 'High tidal range (Spring Tides). Best for deep sea fishing.', descBn: 'জোয়ারের তীব্রতা বেশি (অমাবস্যা)। গভীর সমুদ্রে মাছ ধরার জন্য অনুকূল।' },
    { nameEn: 'Waxing Crescent', nameBn: 'শুক্লপক্ষের নতুন চাঁদ', nameAr: 'هلال متزايد', nameEs: 'Luna Creciente', nameDe: 'Zunehmende Sichel', nameFr: 'Premier Croissant', icon: '🌒', descEn: 'Moderate coastal currents.', descBn: 'উপকূলীয় স্রোত স্বাভাবিক রয়েছে।' },
    { nameEn: 'First Quarter', nameBn: 'শুক্লপক্ষ প্রথমাংশ', nameAr: 'تربيع أول', nameEs: 'Cuarto Creciente', nameDe: 'Erstes Viertel', nameFr: 'Premier Quartier', icon: '🌓', descEn: 'Normal tidal patterns.', descBn: 'স্বাভাবিক জোয়ার-ভাটার চক্র।' },
    { nameEn: 'Waxing Gibbous', nameBn: 'পূর্ণিমার পূর্ব দশা', nameAr: 'أحدب متزايد', nameEs: 'Gibosa Creciente', nameDe: 'Zunehmender Mond', nameFr: 'Gibbeuse Croissante', icon: '🌔', descEn: 'Rising water levels in estuaries.', descBn: 'নদীমুখ ও মোহনায় পানির উচ্চতা বৃদ্ধি পাচ্ছে।' },
    { nameEn: 'Full Moon (পূর্ণিমা)', nameBn: 'পূর্ণিমা', nameAr: 'بدر', nameEs: 'Luna Llena', nameDe: 'Vollmond', nameFr: 'Pleine Lune', icon: '🌕', descEn: 'Very high tides (Spring Tides). Coastal alert for lowlands.', descBn: 'পূর্ণিমার জোয়ার - উপকূলের নিচু প্লাবিত হওয়ার সম্ভাবনা।' },
    { nameEn: 'Waning Gibbous', nameBn: 'কৃষ্ণপক্ষ প্রথমাংশ', nameAr: 'أحدب متناقص', nameEs: 'Gibosa Menguante', nameDe: 'Abnehmender Mond', nameFr: 'Gibbeuse Décroissante', icon: '🌖', descEn: 'Ebbing tide currents.', descBn: 'ভাটার টানে পানি নেমে যাওয়ার সময়।' },
    { nameEn: 'Third Quarter', nameBn: 'ভাটার টান দশা', nameAr: 'تربيع أخير', nameEs: 'Cuarto Menguante', nameDe: 'Letztes Viertel', nameFr: 'Dernier Quartier', icon: '🌗', descEn: 'Neap tides with lower water range.', descBn: 'মরা কোটাল বা মৃদু জোয়ার-ভাটা।' },
    { nameEn: 'Waning Crescent', nameBn: 'কৃষ্ণপক্ষ শেষাংশ', nameAr: 'هلال متناقص', nameEs: 'Luna Menguante', nameDe: 'Abnehmende Sichel', nameFr: 'Dernier Croissant', icon: '🌘', descEn: 'Calm sea state.', descBn: 'শান্ত সমুদ্র অবস্থা।' },
  ];

  const currentMoon = moonPhases[moonPhaseIndex];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Anchor className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isBn ? 'জোয়ার-ভাটা ও চন্দ্রকলার ক্যালেন্ডার' : 'Tide & Moon Phases'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'জেলে, নাবিক ও উপকূলীয় বাসিন্দাদের জন্য বিশেষ গাইড' : 'For Sailors, Fishermen & Coastal Residents'}
            </p>
          </div>
        </div>
        <span className="text-2xl" title={currentMoon.nameEn}>
          {currentMoon.icon}
        </span>
      </div>

      {/* Moon Phase Box */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-200 text-sm">
            <Moon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{isBn ? currentMoon.descBn : currentMoon.descEn}</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-200/50 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-semibold">
            {isBn ? currentMoon.nameBn || currentMoon.nameEn : currentMoon.nameEn}
          </span>
        </div>
      </div>

      {/* Tide Schedule Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-bold">
            <Waves className="w-4 h-4" />
            <span>{isBn ? 'উচ্চ জোয়ার (High Tide)' : 'High Tide'}</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            04:45 AM & 05:15 PM
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn ? 'সর্বোচ্চ উচ্চতা: ৩.৮ মিটার' : 'Max Height: 3.8m'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-bold">
            <Sunrise className="w-4 h-4" />
            <span>{isBn ? 'নিম্ন জোয়ার / ভাটা (Low Tide)' : 'Low Tide'}</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            10:30 AM & 11:00 PM
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn ? 'সর্বনিম্ন পানি: ০.৬ মিটার' : 'Min Water: 0.6m'}
          </div>
        </div>
      </div>
    </div>
  );
};
