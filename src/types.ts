/**
 * WeatherGlobe Core Type Definitions
 */

export type AppScreen =
  | 'splash'
  | 'onboarding_lang'
  | 'dashboard'
  | 'current_location'
  | 'city_search'
  | 'hourly_forecast'
  | 'seven_day_forecast'
  | 'interactive_map'
  | 'country_selector'
  | 'weather_details'
  | 'weather_alerts'
  | 'saved_cities'
  | 'language_settings'
  | 'unit_settings'
  | 'settings'
  | 'about_privacy'
  | 'developer_info'
  | 'buy_me_a_coffee'
  | 'offline_error';

export interface LocationItem {
  id: string;
  name: string;
  localName?: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  admin1?: string; // Division/State (e.g., "Dhaka Division")
  timezone?: string;
  isCustom?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  conditionText: string;
  humidity: number;
  windSpeed: number;
  windDirectionDeg: number;
  windDirectionText: string;
  pressure: number;
  cloudCover: number;
  visibilityKm: number;
  precipitationMm: number;
  uvIndex: number;
  isDay: boolean;
  dewPoint: number;
  updatedAt: string; // ISO string
  isCached?: boolean;
}

export interface HourlyForecastItem {
  time: string; // ISO or formatted
  temperature: number;
  weatherCode: number;
  conditionText: string;
  pop: number; // Probability of precipitation %
  precipitationMm: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  conditionText: string;
  pop: number; // Precipitation probability %
  precipitationSumMm: number;
  maxWindSpeed: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQuality {
  aqi: number; // US AQI scale
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  titleBn?: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  affectedArea: string;
  affectedAreaBn?: string;
  issueTime: string;
  expiryTime: string;
  source: string; // e.g. "Bangladesh Meteorological Department (BMD)"
  description: string;
  descriptionBn?: string;
  instructions?: string;
  instructionsBn?: string;
  isOfficialBMD?: boolean;
}

export interface FullWeatherData {
  location: LocationItem;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQuality;
  alerts: WeatherAlert[];
  fetchedAt: string;
}

export interface CountryConfig {
  code: string; // ISO 3166-1 alpha-2, e.g. 'BD'
  name: string;
  localName: string;
  flag: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  mapCenter: [number, number]; // [lat, lng]
  zoomLevel: number;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  weatherProviders: string[];
  coverageTier: 'full' | 'standard_global';
  hasOfficialAlerts: boolean;
  alertSourceLabel: string;
  popularCities: LocationItem[];
  defaultUnits: {
    temp: 'C' | 'F';
    wind: 'kmh' | 'mph' | 'ms';
    pressure: 'hPa' | 'inHg';
    precip: 'mm' | 'in';
  };
  timezone: string;
}

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  isLaunchSupported?: boolean; // true for bn & en
}

export interface UnitSettings {
  temp: 'C' | 'F';
  wind: 'kmh' | 'mph' | 'ms';
  pressure: 'hPa' | 'inHg';
  precip: 'mm' | 'in';
  timeFormat: '12h' | '24h';
}

export interface AdSettings {
  enabled: boolean; // default false
  isPremiumNoAds: boolean;
  testMode: boolean;
}
