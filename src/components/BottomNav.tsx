import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  CalendarDays,
  MapPin,
  ArrowRightLeft,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { AppScreen } from '../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, weatherData, languageCode, t } = useApp();

  const hasAlerts = weatherData?.alerts && weatherData.alerts.length > 0;
  const isBn = languageCode === 'bn';

  const navItems: { screen: AppScreen; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    {
      screen: 'dashboard',
      label: isBn ? 'হোম' : 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      screen: 'seven_day_forecast',
      label: isBn ? '৭ দিনের পূর্বাভাস' : '7 Days',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      screen: 'interactive_map',
      label: isBn ? 'লাইভ ম্যাপ' : 'Weather Map',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      screen: 'city_search',
      label: isBn ? 'শহর সার্চ' : 'Search City',
      icon: <ArrowRightLeft className="w-5 h-5" />,
    },
    {
      screen: 'settings',
      label: isBn ? 'সেটিংস ও সেবা' : 'Settings',
      icon: <Settings className="w-5 h-5" />,
      badge: hasAlerts,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 transition-colors shadow-lg shadow-slate-900/5">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeScreen === item.screen || (item.screen === 'settings' && activeScreen === 'unit_settings');
          return (
            <button
              key={item.screen}
              onClick={() => setActiveScreen(item.screen)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-black scale-105 bg-teal-500/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-bold tracking-tight truncate max-w-[70px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
