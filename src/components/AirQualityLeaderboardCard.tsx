import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchBangladeshAirQualityRankings,
  AirQualityRankingSummary,
  AirQualityRankItem,
} from '../services/airQualityRankingService';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { LocationItem } from '../types';

export const AirQualityLeaderboardCard: React.FC = () => {
  const { setSelectedLocation, formatNumber, languageCode, t } = useApp();
  const [data, setData] = useState<AirQualityRankingSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDhakaDetails, setShowDhakaDetails] = useState<boolean>(false);

  const loadRankings = async () => {
    setIsLoading(true);
    try {
      const summary = await fetchBangladeshAirQualityRankings();
      setData(summary);
    } catch (e) {
      console.warn('Failed to load AQI rankings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRankings();
  }, []);

  const handleSelectRankedLocation = (item: AirQualityRankItem) => {
    const loc: LocationItem = {
      id: item.id,
      name: item.name,
      localName: item.nameBn,
      country: languageCode === 'bn' ? 'বাংলাদেশ' : 'Bangladesh',
      countryCode: 'BD',
      lat: item.lat,
      lng: item.lng,
      admin1: item.region,
      isCustom: true,
    };
    setSelectedLocation(loc);
  };

  const isBn = languageCode === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            🇧🇩
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {t('aqiRankTitle')}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('aqiRankSub')}
            </p>
          </div>
        </div>

        <button
          onClick={loadRankings}
          disabled={isLoading}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          title={isBn ? 'রিফ্রেশ করুন' : 'Refresh rankings'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
          <span>{isBn ? 'সারাদেশের বায়ুর মান স্ক্যান করা হচ্ছে...' : 'Scanning national air quality indices...'}</span>
        </div>
      ) : data ? (
        <div className="space-y-3">
          {/* 1. Healthiest / Cleanest Air in Bangladesh */}
          <div
            onClick={() => handleSelectRankedLocation(data.healthiestInBD)}
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between transition-all cursor-pointer hover:bg-emerald-500/15"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                {formatNumber(data.healthiestInBD.aqi)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('cleanestAirLabel')}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                  {isBn ? data.healthiestInBD.nameBn : data.healthiestInBD.name}
                </h3>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-400">
                  AQI: {formatNumber(data.healthiestInBD.aqi)} • PM2.5: {formatNumber(data.healthiestInBD.pm25)} µg/m³
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>

          {/* 2. Most Polluted Air in All of Bangladesh */}
          <div
            onClick={() => handleSelectRankedLocation(data.mostPollutedInBD)}
            className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between transition-all cursor-pointer hover:bg-rose-500/15"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                {formatNumber(data.mostPollutedInBD.aqi)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wide">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t('pollutedAirLabel')}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                  {isBn ? data.mostPollutedInBD.nameBn : data.mostPollutedInBD.name}
                </h3>
                <p className="text-[10px] text-rose-800 dark:text-rose-400">
                  AQI: {formatNumber(data.mostPollutedInBD.aqi)} • {data.mostPollutedInBD.aqiStatus}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          </div>

          {/* 3. Most Polluted Spot Inside Dhaka City */}
          <div
            onClick={() => handleSelectRankedLocation(data.dhakaMostPolluted)}
            className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between transition-all cursor-pointer hover:bg-amber-500/15"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                {formatNumber(data.dhakaMostPolluted.aqi)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? 'ঢাকার ভেতরে সবচেয়ে দূষিত এলাকা' : 'Highest Polluted Spot in Dhaka'}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                  {isBn ? data.dhakaMostPolluted.nameBn : data.dhakaMostPolluted.name}
                </h3>
                <p className="text-[10px] text-amber-800 dark:text-amber-400">
                  AQI: {formatNumber(data.dhakaMostPolluted.aqi)} • {data.dhakaMostPolluted.region}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          </div>

          {/* Toggle Dhaka Neighborhoods Breakdown Table */}
          <button
            onClick={() => setShowDhakaDetails(!showDhakaDetails)}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer mt-2"
          >
            <span>
              {isBn
                ? `ঢাকার অন্যান্য এলাকাভিত্তিক বায়ুমান সূচক (${formatNumber(data.dhakaNeighborhoods.length)} টি পয়েন্ট)`
                : `Other Dhaka Zonal AQI Points (${data.dhakaNeighborhoods.length} locations)`}
            </span>
            {showDhakaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDhakaDetails && (
            <div className="space-y-1.5 pt-2 max-h-60 overflow-y-auto pr-1">
              {data.dhakaNeighborhoods.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRankedLocation(item)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-teal-500 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-mono text-[11px] text-slate-400 font-bold">#{index + 1}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {isBn ? item.nameBn : item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 dark:text-slate-200">{formatNumber(item.aqi)} AQI</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                      {item.aqiStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
