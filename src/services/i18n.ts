import { LANGUAGES_REGISTRY, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from '../config/languages';
import { bn } from '../locales/bn';
import { en } from '../locales/en';
import { ar } from '../locales/ar';
import { es } from '../locales/es';
import { de } from '../locales/de';
import { fr } from '../locales/fr';
import { LanguageMeta } from '../types';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  bn,
  en,
  ar,
  es,
  de,
  fr,
};

// Bengali Digits map
const BEN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function formatDigits(val: number | string, langCode: string): string {
  const str = String(val);
  if (langCode === 'bn') {
    return str.replace(/\d/g, (digit) => BEN_DIGITS[parseInt(digit, 10)]);
  }
  return str;
}

export function getLanguageMeta(code: string): LanguageMeta {
  const found = LANGUAGES_REGISTRY.find((l) => l.code === code);
  if (found) return found;
  return (
    LANGUAGES_REGISTRY.find((l) => l.code === DEFAULT_LANGUAGE) || {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇧🇩',
      dir: 'ltr',
      isLaunchSupported: true,
    }
  );
}

export function getTranslationKey(key: string, langCode: string): string {
  // 1. Try selected language
  if (TRANSLATIONS[langCode] && TRANSLATIONS[langCode][key]) {
    return TRANSLATIONS[langCode][key];
  }
  // 2. Fallback to English
  if (TRANSLATIONS[FALLBACK_LANGUAGE] && TRANSLATIONS[FALLBACK_LANGUAGE][key]) {
    return TRANSLATIONS[FALLBACK_LANGUAGE][key];
  }
  // 3. Fallback to key itself
  return key;
}

export function formatWeatherCondition(weatherCode: number, langCode: string): string {
  // WMO Weather interpretation codes
  let key = 'weatherClear';
  if (weatherCode === 0) key = 'weatherClear';
  else if (weatherCode === 1) key = 'weatherMainlyClear';
  else if (weatherCode === 2) key = 'weatherPartlyCloudy';
  else if (weatherCode === 3) key = 'weatherOvercast';
  else if (weatherCode >= 45 && weatherCode <= 48) key = 'weatherFog';
  else if (weatherCode >= 51 && weatherCode <= 55) key = 'weatherDrizzle';
  else if (weatherCode >= 61 && weatherCode <= 63) key = 'weatherRainLight';
  else if (weatherCode >= 64 && weatherCode <= 65) key = 'weatherRainModerate';
  else if (weatherCode >= 66 && weatherCode <= 67) key = 'weatherRainHeavy';
  else if (weatherCode >= 80 && weatherCode <= 82) key = 'weatherRainHeavy';
  else if (weatherCode >= 95 && weatherCode <= 99) key = 'weatherThunderstorm';
  else if (weatherCode >= 71 && weatherCode <= 77) key = 'weatherSnow';

  return getTranslationKey(key, langCode);
}

export function formatLocalizedDay(dateStr: string, langCode: string): string {
  try {
    const date = new Date(dateStr);
    const dayIndex = date.getDay();
    const dayKeys = ['sunDay', 'monDay', 'tueDay', 'wedDay', 'thuDay', 'friDay', 'satDay'];
    return getTranslationKey(dayKeys[dayIndex], langCode);
  } catch {
    return dateStr;
  }
}

export function formatLocalizedTime(timeStr: string, langCode: string, format24: boolean = true): string {
  try {
    const date = new Date(timeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (!format24) {
      const ampm = hours >= 12 ? (langCode === 'bn' ? 'অপরাহ্ন' : 'PM') : (langCode === 'bn' ? 'পূর্বাহ্ন' : 'AM');
      hours = hours % 12 || 12;
      return `${formatDigits(hours, langCode)}:${formatDigits(minutes, langCode)} ${ampm}`;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    return `${formatDigits(hoursStr, langCode)}:${formatDigits(minutes, langCode)}`;
  } catch {
    return timeStr;
  }
}
