import React, { createContext, useContext, useEffect, useState } from 'react';
import { COUNTRIES_CONFIG, DEFAULT_COUNTRY_CODE } from '../config/countries';
import { DEFAULT_LANGUAGE, LANGUAGES_REGISTRY } from '../config/languages';
import {
  formatDigits,
  formatLocalizedDay,
  formatLocalizedTime,
  formatWeatherCondition,
  getLanguageMeta,
  getTranslationKey,
} from '../services/i18n';
import { fetchWeatherData, getInitialWeatherData } from '../services/weatherApi';
import { autoDetectUserCountryAndCity, DetectedCountryResult } from '../services/countryDetectionService';
import {
  AdSettings,
  AppScreen,
  CountryConfig,
  FullWeatherData,
  LanguageMeta,
  LocationItem,
  UnitSettings,
} from '../types';

interface AppContextType {
  activeScreen: AppScreen;
  setActiveScreen: (screen: AppScreen) => void;
  selectedCountry: CountryConfig;
  setSelectedCountry: (country: CountryConfig, autoConvertLanguage?: boolean) => void;
  languageCode: string;
  setLanguageCode: (code: string) => void;
  languageMeta: LanguageMeta;
  selectedLocation: LocationItem;
  setSelectedLocation: (location: LocationItem) => void;
  defaultHomeLocation: LocationItem | null;
  setDefaultHomeLocation: (location: LocationItem) => void;
  isHomeLocation: (locId: string) => boolean;
  weatherData: FullWeatherData | null;
  isLoadingWeather: boolean;
  weatherError: string | null;
  refetchWeather: () => Promise<void>;
  units: UnitSettings;
  setUnits: React.Dispatch<React.SetStateAction<UnitSettings>>;
  savedCities: LocationItem[];
  toggleSavedCity: (city: LocationItem) => void;
  isCitySaved: (cityId: string) => boolean;
  adSettings: AdSettings;
  setAdSettings: React.Dispatch<React.SetStateAction<AdSettings>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  themeColor: string;
  setThemeColor: (id: string) => void;

  // GPS Location & Mother Language Detection
  isDetectingLocation: boolean;
  detectionNotice: string | null;
  clearDetectionNotice: () => void;
  triggerGpsAutoDetect: () => Promise<DetectedCountryResult | null>;

  // Translation helpers
  t: (key: string) => string;
  formatNumber: (val: number | string) => string;
  formatTemp: (celsius: number) => string;
  formatWind: (kmh: number) => string;
  formatTime: (timeStr: string) => string;
  formatDayName: (dateStr: string) => string;
  getConditionName: (code: number) => string;
  getLocationName: (loc?: LocationItem | null) => string;
}

const defaultLocation: LocationItem = COUNTRIES_CONFIG[DEFAULT_COUNTRY_CODE].popularCities[0]; // Dhaka

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasOnboarded = localStorage.getItem('weatherglobe_onboarded') === 'true';

  const [activeScreen, setActiveScreen] = useState<AppScreen>(hasOnboarded ? 'dashboard' : 'splash');

  const [selectedCountry, setSelectedCountryState] = useState<CountryConfig>(
    COUNTRIES_CONFIG[DEFAULT_COUNTRY_CODE]
  );

  const [languageCode, setLanguageCodeState] = useState<string>(() => {
    const saved = localStorage.getItem('weatherglobe_lang');
    if (saved) return saved;

    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      const exists = LANGUAGES_REGISTRY.some((l) => l.code === browserLang);
      if (exists) return browserLang;
    }
    return DEFAULT_LANGUAGE;
  });

  const languageMeta = getLanguageMeta(languageCode);

  // Default Home Location stored in localStorage
  const [defaultHomeLocation, setDefaultHomeLocationState] = useState<LocationItem | null>(() => {
    try {
      const storedHome = localStorage.getItem('weatherglobe_home_location');
      if (storedHome) return JSON.parse(storedHome);
    } catch {}
    return null;
  });

  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(() => {
    return defaultHomeLocation || defaultLocation;
  });

  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(() => {
    return getInitialWeatherData(defaultHomeLocation || defaultLocation);
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [detectionNotice, setDetectionNotice] = useState<string | null>(null);

  const [units, setUnits] = useState<UnitSettings>({
    temp: 'C',
    wind: 'kmh',
    pressure: 'hPa',
    precip: 'mm',
    timeFormat: '24h',
  });

  const [savedCities, setSavedCities] = useState<LocationItem[]>(() => {
    try {
      const stored = localStorage.getItem('weatherglobe_saved_cities');
      if (stored) return JSON.parse(stored);
    } catch {}
    return COUNTRIES_CONFIG[DEFAULT_COUNTRY_CODE].popularCities.slice(0, 4);
  });

  const [adSettings, setAdSettings] = useState<AdSettings>({
    enabled: true,
    isPremiumNoAds: false,
    testMode: false,
  });

  const [themeColor, setThemeColorState] = useState<string>(() => {
    return localStorage.getItem('weatherglobe_theme_color') || 'teal';
  });

  const setThemeColor = (id: string) => {
    setThemeColorState(id);
    localStorage.setItem('weatherglobe_theme_color', id);
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('weatherglobe_theme') === 'dark';
  });

  // Save language selection (Manual developer/user override)
  const setLanguageCode = (code: string) => {
    setLanguageCodeState(code);
    localStorage.setItem('weatherglobe_lang', code);
    localStorage.setItem('weatherglobe_user_manual_lang', 'true');
    localStorage.setItem('weatherglobe_onboarded', 'true');
  };

  // Set country state and optionally auto-convert to mother tongue
  const setSelectedCountry = (country: CountryConfig, autoConvertLanguage = true) => {
    setSelectedCountryState(country);
    const isUserManual = localStorage.getItem('weatherglobe_user_manual_lang') === 'true';
    if (!isUserManual && autoConvertLanguage && country.defaultLanguage) {
      setLanguageCode(country.defaultLanguage);
    }
  };

  // Save permanent default home location
  const setDefaultHomeLocation = (location: LocationItem) => {
    setDefaultHomeLocationState(location);
    localStorage.setItem('weatherglobe_home_location', JSON.stringify(location));
    setSelectedLocation(location);
  };

  const isHomeLocation = (locId: string) => {
    return defaultHomeLocation?.id === locId;
  };

  const clearDetectionNotice = () => setDetectionNotice(null);

  /**
   * Triggers GPS location tracking, detects country & mother tongue, and converts app automatically
   */
  const triggerGpsAutoDetect = async (): Promise<DetectedCountryResult | null> => {
    setIsDetectingLocation(true);
    setDetectionNotice(null);
    try {
      const res = await autoDetectUserCountryAndCity();
      if (res) {
        setSelectedCountryState(res.countryConfig);
        if (!defaultHomeLocation) {
          setSelectedLocation(res.location);
        } else {
          setSelectedLocation(res.location);
        }

        // AUTOMATIC MOTHER LANGUAGE CONVERSION
        const isUserManual = localStorage.getItem('weatherglobe_user_manual_lang') === 'true';
        let activeLang = res.motherLanguage;

        if (!isUserManual) {
          setLanguageCodeState(res.motherLanguage);
          localStorage.setItem('weatherglobe_lang', res.motherLanguage);
          localStorage.setItem('weatherglobe_onboarded', 'true');
        } else {
          activeLang = localStorage.getItem('weatherglobe_lang') || res.motherLanguage;
        }

        const langMeta = getLanguageMeta(activeLang);
        const sourceText = res.source === 'gps' ? 'GPS Device Location' : 'Network IP Location';
        const noticeMsg = `📍 ${res.location.name}, ${res.countryConfig.name} (${sourceText})\n🌐 Active Language: ${langMeta.nativeName} (${langMeta.name})`;
        setDetectionNotice(noticeMsg);
        return res;
      } else {
        setDetectionNotice('⚠️ Could not automatically detect location. Using current city.');
        return null;
      }
    } catch (err) {
      console.error('GPS Auto Detect failed:', err);
      setDetectionNotice('⚠️ GPS location tracking unavailable.');
      return null;
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Auto-Detect User Country & Mother Tongue on initial load / onboarding
  useEffect(() => {
    if (!hasOnboarded) {
      triggerGpsAutoDetect();
    }
  }, [hasOnboarded]);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('weatherglobe_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('weatherglobe_theme', 'light');
    }
  }, [isDarkMode]);

  // Apply theme color attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
  }, [themeColor]);

  // Set RTL text direction on root html
  useEffect(() => {
    document.documentElement.setAttribute('dir', languageMeta.dir);
    document.documentElement.setAttribute('lang', languageCode);
  }, [languageMeta.dir, languageCode]);

  // Fetch weather when location changes
  const loadWeather = async (locToFetch: LocationItem) => {
    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      const data = await fetchWeatherData(locToFetch);
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setWeatherError('Failed to retrieve weather update.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const refetchWeather = async () => {
    await loadWeather(selectedLocation);
  };

  // Favorite cities toggler
  const toggleSavedCity = (city: LocationItem) => {
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.id === city.id || (c.lat === city.lat && c.lng === city.lng));
      let updated: LocationItem[];
      if (exists) {
        updated = prev.filter((c) => !(c.id === city.id || (c.lat === city.lat && c.lng === city.lng)));
      } else {
        updated = [...prev, city];
      }
      localStorage.setItem('weatherglobe_saved_cities', JSON.stringify(updated));
      return updated;
    });
  };

  const isCitySaved = (cityId: string) => {
    return savedCities.some((c) => c.id === cityId);
  };

  // Translation helpers
  const t = (key: string) => getTranslationKey(key, languageCode);

  const formatNumber = (val: number | string) => formatDigits(val, languageCode);

  const formatTemp = (celsius: number) => {
    if (units.temp === 'F') {
      const fahrenheit = Math.round((celsius * 9) / 5 + 32);
      return `${formatDigits(fahrenheit, languageCode)}°F`;
    }
    return `${formatDigits(Math.round(celsius), languageCode)}°C`;
  };

  const formatWind = (kmh: number) => {
    if (units.wind === 'mph') {
      const mph = Math.round(kmh * 0.621371);
      return `${formatDigits(mph, languageCode)} mph`;
    }
    if (units.wind === 'ms') {
      const ms = (kmh / 3.6).toFixed(1);
      return `${formatDigits(ms, languageCode)} m/s`;
    }
    return `${formatDigits(Math.round(kmh), languageCode)} km/h`;
  };

  const formatTime = (timeStr: string) => {
    return formatLocalizedTime(timeStr, languageCode, units.timeFormat === '24h');
  };

  const formatDayName = (dateStr: string) => {
    return formatLocalizedDay(dateStr, languageCode);
  };

  const getConditionName = (code: number) => {
    return formatWeatherCondition(code, languageCode);
  };

  const getLocationName = (loc?: LocationItem | null) => {
    if (!loc) return '';
    if (languageCode === 'bn') {
      return loc.localName || loc.name;
    }
    return loc.name;
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        selectedCountry,
        setSelectedCountry,
        languageCode,
        setLanguageCode,
        languageMeta,
        selectedLocation,
        setSelectedLocation,
        defaultHomeLocation,
        setDefaultHomeLocation,
        isHomeLocation,
        weatherData,
        isLoadingWeather,
        weatherError,
        refetchWeather,
        units,
        setUnits,
        savedCities,
        toggleSavedCity,
        isCitySaved,
        adSettings,
        setAdSettings,
        isDarkMode,
        setIsDarkMode,
        themeColor,
        setThemeColor,
        isDetectingLocation,
        detectionNotice,
        clearDetectionNotice,
        triggerGpsAutoDetect,
        t,
        formatNumber,
        formatTemp,
        formatWind,
        formatTime,
        formatDayName,
        getConditionName,
        getLocationName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
