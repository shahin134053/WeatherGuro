import { LocationItem } from '../types';
import { COUNTRIES_CONFIG } from '../config/countries';
import { BANGLADESH_DISTRICTS } from '../config/bangladeshDistricts';

export interface NearbyLocationWeather {
  id: string;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  distanceKm: number;
  bearingText: string;
  temperature: number;
  weatherCode: number;
  precipitationMm: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  status: 'raining' | 'sunny' | 'cloudy';
}

export interface NearbyRainAndSunshineResult {
  userLocation: LocationItem;
  rainingSpots: NearbyLocationWeather[];
  sunnySpots: NearbyLocationWeather[];
  cloudySpots: NearbyLocationWeather[];
  nearestRainDistanceKm: number | null;
  nearestRainSpot: NearbyLocationWeather | null;
  summaryBn: string;
  summaryEn: string;
}

/**
 * Calculates Haversine distance in km between two coordinates
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates compass bearing from point 1 to point 2
 */
export function getCompassBearingText(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;

  const bearings = ['উত্তর (North)', 'উত্তর-পূর্ব (NE)', 'পূর্ব (East)', 'দক্ষিণ-পূর্ব (SE)', 'দক্ষিণ (South)', 'দক্ষিণ-পশ্চিম (SW)', 'পশ্চিম (West)', 'উত্তর-পশ্চিম (NW)'];
  const index = Math.round(brng / 45) % 8;
  return bearings[index];
}

/**
 * Generates directional target coordinates around user position (15km, 35km, 70km, 120km radius)
 */
function generateRadiusPoints(baseLat: number, baseLng: number): { name: string; lat: number; lng: number }[] {
  const points: { name: string; lat: number; lng: number }[] = [];
  const offsets = [
    { name: 'উত্তরে (15-20km)', dLat: 0.15, dLng: 0 },
    { name: 'দক্ষিণে (15-20km)', dLat: -0.15, dLng: 0 },
    { name: 'পূর্বে (15-20km)', dLat: 0, dLng: 0.15 },
    { name: 'পশ্চিমে (15-20km)', dLat: 0, dLng: -0.15 },
    { name: 'উত্তর-পূর্বে (35-40km)', dLat: 0.3, dLng: 0.3 },
    { name: 'দক্ষিণ-পূর্বে (35-40km)', dLat: -0.3, dLng: 0.3 },
    { name: 'দক্ষিণ-পশ্চিমে (35-40km)', dLat: -0.3, dLng: -0.3 },
    { name: 'উত্তর-পশ্চিমে (35-40km)', dLat: 0.3, dLng: -0.3 },
    { name: 'উত্তরে দূরবর্তী (70-80km)', dLat: 0.65, dLng: 0 },
    { name: 'দক্ষিণে দূরবর্তী (70-80km)', dLat: -0.65, dLng: 0 },
    { name: 'পূর্বে দূরবর্তী (70-80km)', dLat: 0, dLng: 0.65 },
    { name: 'পশ্চিমে দূরবর্তী (70-80km)', dLat: 0, dLng: -0.65 },
  ];

  offsets.forEach((o) => {
    points.push({
      name: o.name,
      lat: Number((baseLat + o.dLat).toFixed(4)),
      lng: Number((baseLng + o.dLng).toFixed(4)),
    });
  });

  return points;
}

/**
 * Fetches nearby weather conditions to find rain & sunshine locations relative to user
 */
export async function fetchNearbyRainAndSunshine(
  userLocation: LocationItem
): Promise<NearbyRainAndSunshineResult> {
  const candidateLocations: { name: string; lat: number; lng: number; country: string }[] = [];

  // 1. Add Bangladesh Districts if in BD or nearby
  if (userLocation.countryCode === 'BD' || userLocation.country === 'Bangladesh') {
    BANGLADESH_DISTRICTS.forEach((div) => {
      div.districts.forEach((dist) => {
        const distKm = calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, dist.lat, dist.lng);
        if (distKm > 2 && distKm < 250) {
          candidateLocations.push({
            name: dist.localName || dist.name,
            lat: dist.lat,
            lng: dist.lng,
            country: 'বাংলাদেশ',
          });
        }
      });
    });
  }

  // 2. Add popular cities from country registry
  Object.values(COUNTRIES_CONFIG).forEach((country) => {
    country.popularCities.forEach((city) => {
      const distKm = calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, city.lat, city.lng);
      if (distKm > 2 && distKm < 300) {
        candidateLocations.push({
          name: city.localName || city.name,
          lat: city.lat,
          lng: city.lng,
          country: city.country,
        });
      }
    });
  });

  // 3. Add directional compass radius points
  const radiusPoints = generateRadiusPoints(userLocation.lat, userLocation.lng);
  radiusPoints.forEach((rp) => {
    candidateLocations.push({
      name: `${userLocation.name} ${rp.name}`,
      lat: rp.lat,
      lng: rp.lng,
      country: userLocation.country,
    });
  });

  // Pick top 15 candidates sorted by distance
  const sortedCandidates = candidateLocations
    .map((c) => ({
      ...c,
      distanceKm: calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, c.lat, c.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 16);

  if (sortedCandidates.length === 0) {
    return {
      userLocation,
      rainingSpots: [],
      sunnySpots: [],
      cloudySpots: [],
      nearestRainDistanceKm: null,
      nearestRainSpot: null,
      summaryBn: 'আপনার অবস্থানের আশেপাশে কোনো তথ্য সনাক্ত হয়নি।',
      summaryEn: 'No nearby weather points detected.',
    };
  }

  // Batch query Open-Meteo current API
  const latsStr = sortedCandidates.map((c) => c.lat).join(',');
  const lngsStr = sortedCandidates.map((c) => c.lng).join(',');

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latsStr}&longitude=${lngsStr}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,is_day,wind_speed_10m&timezone=auto`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Nearby weather batch fetch failed');

    const data = await res.json();
    const resultsArray: any[] = Array.isArray(data) ? data : [data];

    const rainingSpots: NearbyLocationWeather[] = [];
    const sunnySpots: NearbyLocationWeather[] = [];
    const cloudySpots: NearbyLocationWeather[] = [];

    resultsArray.forEach((item, index) => {
      const candidate = sortedCandidates[index];
      if (!candidate || !item.current) return;

      const current = item.current;
      const precip = current.precipitation || 0;
      const code = current.weather_code;
      const isDay = current.is_day === 1;

      // Weather status classification
      let status: 'raining' | 'sunny' | 'cloudy' = 'cloudy';

      // Rain codes: 51-67, 80-82, 95-99 or precipitation > 0.1mm
      const isRainCode = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99) || precip > 0.1;

      if (isRainCode) {
        status = 'raining';
      } else if ((code === 0 || code === 1) && isDay) {
        status = 'sunny';
      } else {
        status = 'cloudy';
      }

      const weatherItem: NearbyLocationWeather = {
        id: `nearby-${index}-${candidate.lat}-${candidate.lng}`,
        cityName: candidate.name,
        country: candidate.country,
        lat: candidate.lat,
        lng: candidate.lng,
        distanceKm: candidate.distanceKm,
        bearingText: getCompassBearingText(userLocation.lat, userLocation.lng, candidate.lat, candidate.lng),
        temperature: Math.round(current.temperature_2m),
        weatherCode: code,
        precipitationMm: precip,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        isDay,
        status,
      };

      if (status === 'raining') {
        rainingSpots.push(weatherItem);
      } else if (status === 'sunny') {
        sunnySpots.push(weatherItem);
      } else {
        cloudySpots.push(weatherItem);
      }
    });

    // Sort rain spots by closest distance
    rainingSpots.sort((a, b) => a.distanceKm - b.distanceKm);
    sunnySpots.sort((a, b) => a.distanceKm - b.distanceKm);

    const nearestRainSpot = rainingSpots.length > 0 ? rainingSpots[0] : null;
    const nearestRainDistanceKm = nearestRainSpot ? nearestRainSpot.distanceKm : null;

    let summaryBn = '';
    let summaryEn = '';

    if (nearestRainSpot) {
      summaryBn = `🌧️ আপনার অবস্থান (${userLocation.localName || userLocation.name}) থেকে সবচেয়ে কাছে ${nearestRainSpot.cityName}-এ (${nearestRainSpot.distanceKm} কিমি, ${nearestRainSpot.bearingText}) বৃষ্টি হচ্ছে!`;
      summaryEn = `🌧️ Nearest rain detected in ${nearestRainSpot.cityName} (${nearestRainSpot.distanceKm} km away, ${nearestRainSpot.bearingText}).`;
    } else {
      summaryBn = `☀️ আপনার অবস্থানের ২৫০ কিমি ব্যাসার্ধের মধ্যে বর্তমানে কোথাও ভারি বৃষ্টি নেই। রোদ ও পরিষ্কার আবহাওয়া বিদ্যমান।`;
      summaryEn = `☀️ Clear weather across nearby 250 km radius. No active rain squalls detected nearby.`;
    }

    return {
      userLocation,
      rainingSpots,
      sunnySpots,
      cloudySpots,
      nearestRainDistanceKm,
      nearestRainSpot,
      summaryBn,
      summaryEn,
    };
  } catch (err) {
    console.warn('Nearby rain radar fetch error:', err);
    return {
      userLocation,
      rainingSpots: [],
      sunnySpots: [],
      cloudySpots: [],
      nearestRainDistanceKm: null,
      nearestRainSpot: null,
      summaryBn: 'আশেপাশের আবহাওয়ার তথ্য লোড করা সম্ভব হয়নি।',
      summaryEn: 'Failed to retrieve nearby rain radar information.',
    };
  }
}
