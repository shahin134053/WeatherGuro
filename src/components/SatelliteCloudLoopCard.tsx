import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Cloud, Play, Pause, RefreshCw, Compass, Sparkles, Layers } from 'lucide-react';

export const SatelliteCloudLoopCard: React.FC = () => {
  const { selectedLocation, languageCode } = useApp();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [layerType, setLayerType] = useState<'clouds' | 'radar' | 'wind'>('clouds');

  const isBn = languageCode === 'bn';

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % 5);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const timestamps = [
    isBn ? '১০ মিনিট পূর্বে' : '10m ago',
    isBn ? '৮ মিনিট পূর্বে' : '8m ago',
    isBn ? '৫ মিনিট পূর্বে' : '5m ago',
    isBn ? '২ মিনিট পূর্বে' : '2m ago',
    isBn ? 'এখন (লাইভ)' : 'Now (Live)',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              {isBn ? 'স্যাটেলাইট ক্লাউড লুপ ও রাডার অ্যানিমেশন' : 'Satellite Cloud Loop & Radar Animation'}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {isBn ? 'বঙ্গোপসাগর ও দেশের ওপর মেঘের গতিবিধি এবং সাইক্লোন মুভমেন্ট' : 'Live cloud movement and storm tracking over Bay of Bengal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-indigo-500 shadow-xs"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Layer selector */}
      <div className="flex gap-1.5 text-xs">
        <button
          onClick={() => setLayerType('clouds')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            layerType === 'clouds' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {isBn ? '☁️ মেঘের লুপ' : '☁️ Cloud Loop'}
        </button>
        <button
          onClick={() => setLayerType('radar')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            layerType === 'radar' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {isBn ? '🌧️ বৃষ্টি রাডার' : '🌧️ Rain Radar'}
        </button>
        <button
          onClick={() => setLayerType('wind')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            layerType === 'wind' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {isBn ? '💨 বায়ুপ্রবাহ' : '💨 Wind Stream'}
        </button>
      </div>

      {/* Simulated Live Satellite Map Viewer */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 h-56 flex items-center justify-center shadow-inner">
        {/* Background Grid & Map Outline simulation */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Animated Satellite Cloud / Radar Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-48 h-48 rounded-full blur-2xl transition-all duration-700 ${
            layerType === 'radar' ? 'bg-sky-500/30 scale-110' : layerType === 'wind' ? 'bg-emerald-500/30 translate-x-4' : 'bg-indigo-500/30 scale-125'
          }`} style={{ transform: `translate(${(currentFrame - 2) * 12}px, ${(currentFrame - 2) * 6}px)` }} />
          <div className="absolute w-32 h-32 rounded-full bg-teal-500/20 blur-xl animate-pulse" />
        </div>

        {/* Central Location Marker */}
        <div className="absolute z-20 text-center space-y-1">
          <div className="w-4 h-4 rounded-full bg-teal-400 border-2 border-white animate-ping mx-auto" />
          <span className="text-[10px] font-black bg-slate-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20">
            {selectedLocation.localName || selectedLocation.name}
          </span>
        </div>

        {/* Timestamp Badge */}
        <div className="absolute top-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-bold border border-white/15 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{timestamps[currentFrame]}</span>
        </div>

        {/* Frame Progress Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-1">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all ${
                idx === currentFrame ? 'bg-teal-400 shadow-md' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
