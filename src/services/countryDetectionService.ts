import { COUNTRIES_CONFIG, DEFAULT_COUNTRY_CODE } from '../config/countries';
import { CountryConfig, LocationItem } from '../types';

export interface DetectedCountryResult {
  countryConfig: CountryConfig;
  location: LocationItem;
  motherLanguage: string;
  source: 'gps' | 'ip';
}

/**
 * High-precision country-to-mother-language dictionary mapping ISO country codes
 */
export const COUNTRY_MOTHER_LANGUAGES: Record<string, string> = {
  BD: 'bn', // Bangladesh -> Bengali
  IN: 'hi', // India -> Hindi
  PK: 'ur', // Pakistan -> Urdu
  SA: 'ar', // Saudi Arabia -> Arabic
  AE: 'ar', // UAE -> Arabic
  EG: 'ar', // Egypt -> Arabic
  QA: 'ar', // Qatar -> Arabic
  KW: 'ar', // Kuwait -> Arabic
  OM: 'ar', // Oman -> Arabic
  BH: 'ar', // Bahrain -> Arabic
  IQ: 'ar', // Iraq -> Arabic
  JP: 'ja', // Japan -> Japanese
  CN: 'zh', // China -> Chinese
  TW: 'zh', // Taiwan -> Chinese
  HK: 'zh', // Hong Kong -> Chinese
  KR: 'ko', // South Korea -> Korean
  DE: 'de', // Germany -> German
  AT: 'de', // Austria -> German
  CH: 'de', // Switzerland -> German
  FR: 'fr', // France -> French
  BE: 'fr', // Belgium -> French
  ES: 'es', // Spain -> Spanish
  MX: 'es', // Mexico -> Spanish
  AR: 'es', // Argentina -> Spanish
  CO: 'es', // Colombia -> Spanish
  CL: 'es', // Chile -> Spanish
  IT: 'it', // Italy -> Italian
  RU: 'ru', // Russia -> Russian
  BY: 'ru', // Belarus -> Russian
  KZ: 'ru', // Kazakhstan -> Russian
  TR: 'tr', // Turkey -> Turkish
  PT: 'pt', // Portugal -> Portuguese
  BR: 'pt', // Brazil -> Portuguese
  ID: 'id', // Indonesia -> Indonesian
  MY: 'ms', // Malaysia -> Malay
  TH: 'th', // Thailand -> Thai
  VN: 'vi', // Vietnamese -> Vietnamese
  PH: 'fil',// Philippines -> Filipino
  NL: 'nl', // Netherlands -> Dutch
  GR: 'el', // Greece -> Greek
  IR: 'fa', // Iran -> Persian
  NP: 'ne', // Nepal -> Nepali
  LK: 'si', // Sri Lanka -> Sinhala
  US: 'en', // USA -> English
  GB: 'en', // UK -> English
  AU: 'en', // Australia -> English
  CA: 'en', // Canada -> English
  NZ: 'en', // New Zealand -> English
  ZA: 'en', // South Africa -> English
};

/**
 * Tries to get exact device GPS latitude & longitude coordinates
 */
async function getDeviceGpsPosition(): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('GPS location attempt info:', err.message);
        resolve(null);
      },
      { timeout: 4000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  });
}

/**
 * Detects user's exact location, country, and mother tongue via GPS or IP geolocation
 */
export async function autoDetectUserCountryAndCity(): Promise<DetectedCountryResult | null> {
  try {
    const gpsPos = await getDeviceGpsPosition();
    let url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
    if (gpsPos) {
      url += `?latitude=${gpsPos.lat}&longitude=${gpsPos.lng}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Auto country detection network error');

    const data = await res.json();
    const countryCode = data.countryCode ? data.countryCode.toUpperCase() : DEFAULT_COUNTRY_CODE;
    const cityName = data.locality || data.city || data.principalSubdivision || 'Dhaka';

    let matchedCountry = COUNTRIES_CONFIG[countryCode];
    const motherLanguage = matchedCountry?.defaultLanguage || COUNTRY_MOTHER_LANGUAGES[countryCode] || 'en';

    if (!matchedCountry) {
      // Dynamic fallback country representation for unlisted nations
      matchedCountry = {
        code: countryCode,
        name: data.countryName || countryCode,
        localName: data.countryName || countryCode,
        flag: getFlagEmoji(countryCode),
        defaultLanguage: motherLanguage,
        supportedLanguages: [motherLanguage, 'en'],
        mapCenter: [data.latitude || 23.685, data.longitude || 90.3563],
        zoomLevel: 6,
        bounds: [[(data.latitude || 20) - 5, (data.longitude || 90) - 5], [(data.latitude || 20) + 5, (data.longitude || 90) + 5]],
        weatherProviders: ['Open-Meteo Global Satellite'],
        coverageTier: 'standard_global',
        hasOfficialAlerts: false,
        alertSourceLabel: 'National Meteorological Service',
        timezone: 'UTC',
        defaultUnits: { temp: 'C', wind: 'kmh', pressure: 'hPa', precip: 'mm' },
        popularCities: [
          {
            id: `auto-${countryCode}-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
            name: cityName,
            localName: cityName,
            country: data.countryName || countryCode,
            countryCode: countryCode,
            lat: data.latitude || 23.81,
            lng: data.longitude || 90.41,
          },
        ],
      };
    }

    const detectedLoc: LocationItem = {
      id: `gps-${countryCode}-${data.latitude || gpsPos?.lat || matchedCountry.mapCenter[0]}-${data.longitude || gpsPos?.lng || matchedCountry.mapCenter[1]}`,
      name: cityName,
      localName: cityName,
      country: matchedCountry.name,
      countryCode: matchedCountry.code,
      lat: gpsPos?.lat || data.latitude || matchedCountry.mapCenter[0],
      lng: gpsPos?.lng || data.longitude || matchedCountry.mapCenter[1],
      admin1: data.principalSubdivision || matchedCountry.name,
      isCustom: true,
    };

    return {
      countryConfig: matchedCountry,
      location: detectedLoc,
      motherLanguage,
      source: gpsPos ? 'gps' : 'ip',
    };
  } catch (err) {
    console.warn('Auto country detection fallback:', err);
    return null;
  }
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
