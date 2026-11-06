import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES_CONFIG } from '../config/countries';
import { MapPin, Info, Thermometer, CloudRain, Cloud, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';

export const InteractiveMapScreen: React.FC = () => {
  const { selectedLocation, setSelectedLocation, selectedCountry, isDarkMode, t } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const weatherTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<'temp' | 'rain' | 'clouds'>('rain');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedLocation.lat, selectedLocation.lng],
        zoom: selectedCountry.zoomLevel,
        zoomControl: false,
        maxZoom: 19,
        minZoom: 3,
      });

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Dynamically update base map tile style according to dark mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const baseTileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a> | Natural Earth',
      subdomains: 'abcd',
      maxZoom: 19,
      maxNativeZoom: 18,
    });

    baseTileLayer.addTo(map);
    baseTileLayerRef.current = baseTileLayer;
  }, [isDarkMode]);

  // Update Tile Overlays with maxNativeZoom scaling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (weatherTileLayerRef.current) {
      map.removeLayer(weatherTileLayerRef.current);
      weatherTileLayerRef.current = null;
    }

    let tileUrl = '';
    if (activeLayer === 'rain') {
      tileUrl = 'https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/2/1_1.png';
    } else if (activeLayer === 'clouds') {
      tileUrl = 'https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/1/0_0.png';
    } else if (activeLayer === 'temp') {
      tileUrl = 'https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/3/1_0.png';
    }

    if (tileUrl) {
      const weatherLayer = L.tileLayer(tileUrl, {
        opacity: 0.65,
        maxZoom: 19,
        maxNativeZoom: 12,
      });

      weatherLayer.addTo(map);
      weatherTileLayerRef.current = weatherLayer;
    }
  }, [activeLayer]);

  // Update map view & markers when location or country changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    map.flyTo([selectedLocation.lat, selectedLocation.lng], 8, { duration: 1.2 });
    markersGroup.clearLayers();

    // Add markers for popular Bangladesh divisions and world cities
    const citiesToMark = COUNTRIES_CONFIG['BD'].popularCities;

    citiesToMark.forEach((city) => {
      const isSelected = city.id === selectedLocation.id;

      const customIcon = L.divIcon({
        className: 'custom-weather-marker',
        html: `
          <div style="
            background: ${isSelected ? '#0d9488' : isDarkMode ? '#0f172a' : '#1e293b'};
            color: #ffffff;
            border: 2px solid ${isSelected ? '#2dd4bf' : '#64748b'};
            border-radius: 9999px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${city.localName || city.name}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedLocation(city);
      });
      markersGroup.addLayer(marker);
    });
  }, [selectedLocation, selectedCountry, isDarkMode]);

  const handleFocusBangladesh = () => {
    const bd = COUNTRIES_CONFIG['BD'];
    setSelectedLocation(bd.popularCities[0]);
    mapInstanceRef.current?.flyTo(bd.mapCenter, bd.zoomLevel, { duration: 1 });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-4">
      {/* Header Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold">
            <MapPin className="w-4 h-4" />
            <span>{t('mapTitle')}</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>100% High-Zoom Supported</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {selectedLocation.localName || selectedLocation.name}, {selectedLocation.country}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveLayer('rain')}
              className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeLayer === 'rain'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{t('mapLayerRain')}</span>
            </button>
            <button
              onClick={() => setActiveLayer('clouds')}
              className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeLayer === 'clouds'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{t('mapLayerClouds')}</span>
            </button>
            <button
              onClick={() => setActiveLayer('temp')}
              className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeLayer === 'temp'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>{t('mapLayerTemp')}</span>
            </button>
          </div>

          <button
            onClick={handleFocusBangladesh}
            className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/20 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🇧🇩</span>
            <span className="hidden sm:inline">{t('mapCenterBD')}</span>
          </button>
        </div>
      </div>

      {/* Map Display Frame */}
      <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Controls */}
        <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-lg">
          <Info className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('mapSelectLocation')}</span>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-white/10 flex items-center justify-center shadow-lg hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-white/10 flex items-center justify-center shadow-lg hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
        {t('boundaryDataNotice')}
      </p>
    </div>
  );
};
