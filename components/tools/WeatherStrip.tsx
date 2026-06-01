'use client';

import { useState, useEffect } from 'react';
import { Cloud, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ItineraryDay } from '@/types/planning';
import { POPULAR_DESTINATIONS } from '@/lib/countryUtils';

interface WeatherDay {
  date: string;
  emoji: string;
  label: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
}

interface Props {
  days: ItineraryDay[];
  destination: string;
  onReplan?: (dayNumber: number, condition: string) => void;
}

export function WeatherStrip({ days, destination, onReplan }: Props) {
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dest = POPULAR_DESTINATIONS.find(
      (d) => d.city.toLowerCase() === destination.toLowerCase()
    );
    if (!dest) { setLoading(false); return; }

    fetch(`/api/tools/weather?lat=${dest.lat}&lng=${dest.lng}`)
      .then((r) => r.json())
      .then((d) => { setWeather(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [destination]);

  if (loading) {
    return (
      <div className="flex gap-1 overflow-x-auto py-2">
        {days.map((_, i) => (
          <div key={i} className="shrink-0 w-16 h-20 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!weather.length) return null;

  // Align weather days to itinerary days by date
  const alignedWeather = days.map((day) => {
    return weather.find((w) => w.date === day.date) ?? null;
  });

  const hasWeatherData = alignedWeather.some(Boolean);
  if (!hasWeatherData) return null;

  return (
    <div className="mb-4 space-y-2">
      <p className="text-white/40 text-xs flex items-center gap-1.5">
        <Cloud size={11} /> Weather forecast
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day, i) => {
          const w = alignedWeather[i];
          if (!w) return null;
          const isHighRain = w.rainProbability > 80;
          const isMedRain = w.rainProbability > 60;

          return (
            <div key={day.dayNumber}
              className={cn(
                'shrink-0 w-16 rounded-xl p-2 text-center space-y-1 border transition-colors',
                isHighRain
                  ? 'bg-red-500/10 border-red-500/30'
                  : isMedRain
                  ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-white/4 border-white/8'
              )}>
              <p className="text-white/40 text-[10px]">Day {day.dayNumber}</p>
              <p className="text-lg">{w.emoji}</p>
              <p className="text-white text-[10px] font-medium">{w.tempMax}°</p>
              <p className="text-white/40 text-[10px]">{w.tempMin}°</p>
              <p className={cn('text-[9px]', isHighRain ? 'text-red-400' : isMedRain ? 'text-amber-400' : 'text-white/30')}>
                {w.rainProbability}%
              </p>
              {isHighRain && onReplan && (
                <button
                  onClick={() => onReplan(day.dayNumber, 'rain')}
                  className="w-full flex items-center justify-center gap-0.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[8px] hover:bg-red-500/30 transition-colors"
                  title="Replan this day">
                  <RefreshCw size={7} /> Replan
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
