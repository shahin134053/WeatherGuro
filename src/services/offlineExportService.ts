import { FullWeatherData } from '../types';

/**
 * Downloads a complete offline weather bulletin as a formatted text file
 */
export function downloadOfflineWeatherBulletin(data: FullWeatherData, langCode: string = 'bn'): void {
  const loc = data.location;
  const current = data.current;
  const air = data.airQuality;
  const daily = data.daily || [];
  const alerts = data.alerts || [];

  let text = `==================================================\n`;
  text += ` WEATHERGLOBE (ওয়েদারগ্লোব) — অফলাইন আবহাওয়া বুলেটিন\n`;
  text += `==================================================\n`;
  text += `স্থান: ${loc.localName || loc.name}, ${loc.country}\n`;
  text += `জিপিএস স্থানাঙ্ক: ${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° E\n`;
  text += `তারিখ ও সময়: ${new Date(current.updatedAt).toLocaleString()}\n\n`;

  text += `--- [১. বর্তমান আবহাওয়া পরিস্থিতি] ---\n`;
  text += `তাপমাত্রা: ${current.temperature}°C (অনুভূত: ${current.feelsLike}°C)\n`;
  text += `অবস্থা: ${current.conditionText || 'নির্মল আকাশ'}\n`;
  text += `আর্দ্রতা: ${current.humidity}%\n`;
  text += `বাতাসের গতি: ${current.windSpeed} km/h (দিক: ${current.windDirectionText})\n`;
  text += `বায়ুমণ্ডলীয় চাপ: ${current.pressure} hPa\n`;
  text += `বৃষ্টিপাত: ${current.precipitationMm} mm\n\n`;

  if (air) {
    text += `--- [২. বায়ুর মান (AQI Report)] ---\n`;
    text += `AQI স্কোর: ${air.aqi} (${air.aqiStatus})\n`;
    text += `PM2.5: ${air.pm25} µg/m³  |  PM10: ${air.pm10} µg/m³\n\n`;
  }

  if (alerts.length > 0) {
    text += `--- [৩. বিশেষ সতর্কবার্তা ও আবহাওয়া সতর্কতা] ---\n`;
    alerts.forEach((a, i) => {
      text += `সতর্কতা #${i + 1}: ${a.titleBn || a.title}\n`;
      text += `উৎস: ${a.source}\n`;
      text += `বিবরণ: ${a.descriptionBn || a.description}\n`;
      if (a.instructionsBn || a.instructions) {
        text += `নির্দেশনা: ${a.instructionsBn || a.instructions}\n`;
      }
      text += `--------------------------------------------------\n`;
    });
    text += `\n`;
  }

  if (daily.length > 0) {
    text += `--- [৪. আগামী ৭ দিনের আবহাওয়া পূর্বাভাস] ---\n`;
    daily.forEach((d) => {
      text += `${d.date}: সর্বোচ্চ ${d.tempMax}°C / সর্বনিম্ন ${d.tempMin}°C (বৃষ্টির সম্ভাবনা: ${d.pop}%)\n`;
    });
    text += `\n`;
  }

  text += `==================================================\n`;
  text += `ডাউনলোড উৎস: WeatherGlobe Platform (100% Keyless & Offline Accessible)\n`;
  text += `==================================================\n`;

  // Trigger browser file download
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `WeatherGlobe-Bulletin-${loc.name.replace(/\s+/g, '_')}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports complete JSON backup file for offline archival
 */
export function downloadOfflineWeatherJson(data: FullWeatherData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `WeatherGlobe-Backup-${data.location.name.replace(/\s+/g, '_')}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
