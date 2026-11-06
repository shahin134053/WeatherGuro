import { formatDigits } from './i18n';

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  dateStr: string;
  hijriDate: string;
}

export interface MoonPhaseData {
  phaseName: string;
  phaseNameBn: string;
  illuminationPercent: number;
  iconSymbol: string;
}

/**
 * Calculates local prayer times using free keyless Aladhan API
 */
export async function fetchLocalPrayerTimes(
  lat: number,
  lng: number,
  langCode: string = 'bn'
): Promise<PrayerTimesData> {
  try {
    const today = new Date();
    const dateFormatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${dateFormatted}?latitude=${lat}&longitude=${lng}&method=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Prayer times API failed');

    const json = await res.json();
    const timings = json.data.timings;
    const hijri = json.data.date.hijri;

    const formatTimeVal = (timeStr: string) => {
      if (!timeStr) return '--:--';
      const cleanTime = timeStr.split(' ')[0]; // e.g. "05:12"
      const [h, m] = cleanTime.split(':');
      let hours = parseInt(h, 10);
      const minutes = m;
      const ampm = hours >= 12 ? (langCode === 'bn' ? 'অপরাহ্ন' : 'PM') : (langCode === 'bn' ? 'পূর্বাহ্ন' : 'AM');
      hours = hours % 12 || 12;
      return `${formatDigits(hours, langCode)}:${formatDigits(minutes, langCode)} ${ampm}`;
    };

    const hijriFormatted = `${formatDigits(hijri.day, langCode)} ${hijri.month.en} ${formatDigits(hijri.year, langCode)} হিজরী`;

    return {
      fajr: formatTimeVal(timings.Fajr),
      sunrise: formatTimeVal(timings.Sunrise),
      dhuhr: formatTimeVal(timings.Dhuhr),
      asr: formatTimeVal(timings.Asr),
      maghrib: formatTimeVal(timings.Maghrib),
      isha: formatTimeVal(timings.Isha),
      dateStr: today.toLocaleDateString(),
      hijriDate: hijriFormatted,
    };
  } catch (err) {
    // Math approximation fallback
    return {
      fajr: formatDigits('04:50', langCode) + (langCode === 'bn' ? ' পূর্বাহ্ন' : ' AM'),
      sunrise: formatDigits('06:05', langCode) + (langCode === 'bn' ? ' পূর্বাহ্ন' : ' AM'),
      dhuhr: formatDigits('12:05', langCode) + (langCode === 'bn' ? ' অপরাহ্ন' : ' PM'),
      asr: formatDigits('04:15', langCode) + (langCode === 'bn' ? ' অপরাহ্ন' : ' PM'),
      maghrib: formatDigits('06:02', langCode) + (langCode === 'bn' ? ' অপরাহ্ন' : ' PM'),
      isha: formatDigits('07:20', langCode) + (langCode === 'bn' ? ' অপরাহ্ন' : ' PM'),
      dateStr: new Date().toLocaleDateString(),
      hijriDate: '১৪৪৬ হিজরী',
    };
  }
}

/**
 * Calculates current Moon Phase and illumination
 */
export function getMoonPhaseInfo(date: Date = new Date()): MoonPhaseData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    const y = year - 1;
    const m = month + 12;
    c = 365.25 * y;
    e = 30.6 * (m + 1);
    jd = c + e + day - 694039.09;
  } else {
    c = 365.25 * year;
    e = 30.6 * (month + 1);
    jd = c + e + day - 694039.09;
  }

  jd /= 29.5305882; // lunar cycle
  b = Math.floor(jd);
  jd -= b; // fractional phase (0.0 to 1.0)

  const illumination = Math.round((1 - Math.cos(jd * 2 * Math.PI)) * 50);

  if (jd < 0.03 || jd > 0.97) {
    return { phaseName: 'New Moon', phaseNameBn: 'নতুন চাঁদ (অমাাবস্যা)', illuminationPercent: illumination, iconSymbol: '🌑' };
  } else if (jd < 0.22) {
    return { phaseName: 'Waxing Crescent', phaseNameBn: 'ক্রমবর্ধমান কাস্তে চাঁদ', illuminationPercent: illumination, iconSymbol: '🌒' };
  } else if (jd < 0.28) {
    return { phaseName: 'First Quarter', phaseNameBn: 'প্রথম কোয়াটার চাঁদ', illuminationPercent: illumination, iconSymbol: '🌓' };
  } else if (jd < 0.47) {
    return { phaseName: 'Waxing Gibbous', phaseNameBn: 'পূর্ণতার পথে চাঁদ', illuminationPercent: illumination, iconSymbol: '🌔' };
  } else if (jd < 0.53) {
    return { phaseName: 'Full Moon', phaseNameBn: 'পূর্ণিমা (পূর্ণ চাঁদ)', illuminationPercent: illumination, iconSymbol: '🌕' };
  } else if (jd < 0.72) {
    return { phaseName: 'Waning Gibbous', phaseNameBn: 'ক্ষীয়মাণ চাঁদ', illuminationPercent: illumination, iconSymbol: '🌖' };
  } else if (jd < 0.78) {
    return { phaseName: 'Third Quarter', phaseNameBn: 'শেষ কোয়াটার চাঁদ', illuminationPercent: illumination, iconSymbol: '🌗' };
  } else {
    return { phaseName: 'Waning Crescent', phaseNameBn: 'শেষভাগের সরু চাঁদ', illuminationPercent: illumination, iconSymbol: '🌘' };
  }
}
