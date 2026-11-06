import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './views/SplashScreen';
import { LanguageOnboardingScreen } from './views/LanguageOnboardingScreen';
import { DashboardScreen } from './views/DashboardScreen';
import { CurrentLocationScreen } from './views/CurrentLocationScreen';
import { CitySearchScreen } from './views/CitySearchScreen';
import { HourlyForecastScreen } from './views/HourlyForecastScreen';
import { SevenDayForecastScreen } from './views/SevenDayForecastScreen';
import { InteractiveMapScreen } from './views/InteractiveMapScreen';
import { CountrySelectorScreen } from './views/CountrySelectorScreen';
import { WeatherDetailsScreen } from './views/WeatherDetailsScreen';
import { WeatherAlertsScreen } from './views/WeatherAlertsScreen';
import { SavedCitiesScreen } from './views/SavedCitiesScreen';
import { LanguageSettingsScreen } from './views/LanguageSettingsScreen';
import { UnitSettingsScreen } from './views/UnitSettingsScreen';
import { AboutPrivacyScreen } from './views/AboutPrivacyScreen';
import { DeveloperScreen } from './views/DeveloperScreen';
import { BuyMeACoffeeScreen } from './views/BuyMeACoffeeScreen';
import { OfflineErrorScreen } from './views/OfflineErrorScreen';
import { AudioBroadcastPlayerBar } from './components/AudioBroadcastPlayerBar';
import { AutoUpdateModal } from './components/AutoUpdateModal';
import { MobileAppDownloadHub } from './components/MobileAppDownloadHub';
import { registerAutoUpdateServiceWorker, checkForRemoteAppUpdates } from './services/autoUpdateService';

import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { activeScreen } = useApp();

  React.useEffect(() => {
    registerAutoUpdateServiceWorker();
    checkForRemoteAppUpdates();
  }, []);

  const isFullNavVisible = activeScreen !== 'splash' && activeScreen !== 'onboarding_lang';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white flex flex-col">
      <AutoUpdateModal />
      {isFullNavVisible && <HeaderNav />}

      <main className="flex-1">
        <ErrorBoundary>
          {activeScreen === 'splash' && <SplashScreen />}
          {activeScreen === 'onboarding_lang' && <LanguageOnboardingScreen />}
          {activeScreen === 'dashboard' && <DashboardScreen />}
          {activeScreen === 'current_location' && <CurrentLocationScreen />}
          {activeScreen === 'city_search' && <CitySearchScreen />}
          {activeScreen === 'hourly_forecast' && <HourlyForecastScreen />}
          {activeScreen === 'seven_day_forecast' && <SevenDayForecastScreen />}
          {activeScreen === 'interactive_map' && <InteractiveMapScreen />}
          {activeScreen === 'country_selector' && <CountrySelectorScreen />}
          {activeScreen === 'weather_details' && <WeatherDetailsScreen />}
          {activeScreen === 'weather_alerts' && <WeatherAlertsScreen />}
          {activeScreen === 'saved_cities' && <SavedCitiesScreen />}
          {activeScreen === 'language_settings' && <LanguageSettingsScreen />}
          {(activeScreen === 'unit_settings' || activeScreen === 'settings') && <UnitSettingsScreen />}
          {activeScreen === 'about_privacy' && <AboutPrivacyScreen />}
          {activeScreen === 'developer_info' && <DeveloperScreen />}
          {activeScreen === 'buy_me_a_coffee' && <BuyMeACoffeeScreen />}
          {activeScreen === 'offline_error' && <OfflineErrorScreen />}
        </ErrorBoundary>
      </main>

      {isFullNavVisible && <MobileAppDownloadHub />}
      {isFullNavVisible && <BottomNav />}
      <AudioBroadcastPlayerBar />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
