import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCached, TTL } from '@/lib/cache';

// WMO weather code → emoji + label
const WMO_CODES: Record<number, { emoji: string; label: string }> = {
  0: { emoji: '☀️', label: 'Clear' },
  1: { emoji: '🌤️', label: 'Mostly clear' },
  2: { emoji: '⛅', label: 'Partly cloudy' },
  3: { emoji: '☁️', label: 'Overcast' },
  45: { emoji: '🌫️', label: 'Fog' },
  48: { emoji: '🌫️', label: 'Icy fog' },
  51: { emoji: '🌦️', label: 'Light drizzle' },
  53: { emoji: '🌦️', label: 'Drizzle' },
  55: { emoji: '🌧️', label: 'Heavy drizzle' },
  61: { emoji: '🌧️', label: 'Light rain' },
  63: { emoji: '🌧️', label: 'Rain' },
  65: { emoji: '🌧️', label: 'Heavy rain' },
  71: { emoji: '❄️', label: 'Light snow' },
  73: { emoji: '❄️', label: 'Snow' },
  75: { emoji: '❄️', label: 'Heavy snow' },
  77: { emoji: '🌨️', label: 'Snow grains' },
  80: { emoji: '🌦️', label: 'Showers' },
  81: { emoji: '🌧️', label: 'Heavy showers' },
  82: { emoji: '⛈️', label: 'Violent showers' },
  85: { emoji: '🌨️', label: 'Snow showers' },
  86: { emoji: '🌨️', label: 'Heavy snow showers' },
  95: { emoji: '⛈️', label: 'Storm' },
  96: { emoji: '⛈️', label: 'Storm with hail' },
  99: { emoji: '⛈️', label: 'Heavy storm with hail' },
};

function decodeWmo(code: number) {
  return WMO_CODES[code] ?? { emoji: '🌡️', label: 'Unknown' };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const cacheKey = `weather:${parseFloat(lat).toFixed(2)}:${parseFloat(lng).toFixed(2)}`;
  const cached = getCached<unknown>(cacheKey);
  if (cached) return NextResponse.json({ data: cached, cached: true });

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=auto&forecast_days=16`;
    const res = await fetch(url);
    const raw = await res.json();

    if (!raw.daily) {
      return NextResponse.json({ error: 'weather_api_error' }, { status: 502 });
    }

    const days = raw.daily.time.map((date: string, i: number) => ({
      date,
      ...decodeWmo(raw.daily.weathercode[i]),
      tempMax: Math.round(raw.daily.temperature_2m_max[i]),
      tempMin: Math.round(raw.daily.temperature_2m_min[i]),
      rainProbability: raw.daily.precipitation_probability_mean[i] ?? 0,
    }));

    setCached(cacheKey, days, TTL.ONE_HOUR);
    return NextResponse.json({ data: days, cached: false });
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 });
  }
}
