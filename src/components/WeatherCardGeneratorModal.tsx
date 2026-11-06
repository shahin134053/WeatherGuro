import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Download, X, Globe, Sparkles } from 'lucide-react';

export const WeatherCardGeneratorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { selectedLocation, weatherData, formatTemp, formatNumber } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const current = weatherData?.current;
  const air = weatherData?.airQuality;

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw card canvas
    canvas.width = 600;
    canvas.height = 400;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#0f766e'); // Teal
    gradient.addColorStop(0.5, '#115e59');
    gradient.addColorStop(1, '#0f172a'); // Slate
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('WeatherGlobe | ওয়েদারগ্লোব', 40, 50);

    ctx.fillStyle = '#2dd4bf';
    ctx.font = '18px sans-serif';
    ctx.fillText(`${selectedLocation.localName || selectedLocation.name}, ${selectedLocation.country}`, 40, 85);

    // Temperature Big Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText(`${current ? formatTemp(current.temperature) : '28°C'}`, 40, 180);

    // Weather condition
    ctx.fillStyle = '#99f6e4';
    ctx.font = '22px sans-serif';
    ctx.fillText(`আবহাওয়া: ${current?.conditionText || 'নির্মল আকাশ'}`, 40, 220);

    // Metrics Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(40, 260, 520, 100, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.fillText(`বায়ুর মান (AQI): ${air ? air.aqi : 45} (${air ? air.aqiStatus : 'Good'})`, 60, 295);
    ctx.fillText(`বাতাসের গতি: ${current ? current.windSpeed : 12} km/h  |  আর্দ্রতা: ${current ? current.humidity : 75}%`, 60, 330);

    // Download Image File
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `WeatherGlobe-${selectedLocation.name}.png`;
    link.href = imageURI;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              আবহাওয়া কার্ড তৈরি ও শেয়ার (Social Share Card)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Preview Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 text-white text-left space-y-2 shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-teal-300 font-bold">
            <Globe className="w-4 h-4" />
            <span>WeatherGlobe Snapshot</span>
          </div>
          <h2 className="text-xl font-extrabold">{selectedLocation.localName || selectedLocation.name}</h2>
          <div className="text-4xl font-black text-white">{current ? formatTemp(current.temperature) : '28°C'}</div>
          <p className="text-xs text-teal-200">
            AQI: {air ? air.aqi : 45} ({air ? air.aqiStatus : 'Good'})
          </p>
        </div>

        <button
          onClick={handleDownloadCard}
          className="w-full py-3 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>আবহাওয়া স্ন্যাপশট কার্ড ডাউনলোড করুন</span>
        </button>
      </div>
    </div>
  );
};
