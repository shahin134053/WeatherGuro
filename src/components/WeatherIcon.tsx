import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-8 h-8 text-amber-500',
}) => {
  // Clear sky
  if (code === 0) {
    return isDay ? (
      <Sun className={`text-amber-500 animate-pulse ${className}`} />
    ) : (
      <Sun className={`text-sky-300 ${className}`} />
    );
  }

  // Mainly clear / partly cloudy
  if (code === 1 || code === 2) {
    return <CloudSun className={`text-amber-400 dark:text-amber-300 ${className}`} />;
  }

  // Overcast
  if (code === 3) {
    return <Cloud className={`text-slate-400 dark:text-slate-300 ${className}`} />;
  }

  // Fog / haze
  if (code >= 45 && code <= 48) {
    return <CloudFog className={`text-teal-400 dark:text-teal-300 ${className}`} />;
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return <CloudDrizzle className={`text-sky-400 dark:text-sky-300 ${className}`} />;
  }

  // Rain
  if (code >= 61 && code <= 67) {
    return <CloudRain className={`text-blue-500 dark:text-blue-400 ${className}`} />;
  }

  // Heavy rain
  if (code >= 80 && code <= 82) {
    return <CloudRain className={`text-indigo-600 dark:text-indigo-400 ${className}`} />;
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return <CloudLightning className={`text-amber-500 dark:text-amber-400 animate-bounce ${className}`} />;
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return <Snowflake className={`text-cyan-300 ${className}`} />;
  }

  return <Wind className={`text-slate-400 ${className}`} />;
};
