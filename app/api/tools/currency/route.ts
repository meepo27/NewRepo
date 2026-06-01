import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCached, TTL } from '@/lib/cache';

const TOP_CURRENCIES = ['USD','EUR','GBP','INR','JPY','AUD','CAD','SGD','AED','THB','MYR','IDR','VND','KRW','HKD','CHF','NOK','SEK','DKK','PLN','CZK','HUF','TRY','MXN','BRL','ZAR','EGP','NZD','PHP','TWD'];

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get('base') ?? 'USD';
  const cacheKey = `currency:${base}`;

  const cached = getCached<Record<string, number>>(cacheKey);
  if (cached) {
    return NextResponse.json({ base, rates: cached, cached: true });
  }

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    if (data.result !== 'success') {
      return NextResponse.json({ error: 'exchange_api_error' }, { status: 502 });
    }

    // Filter to top 30 currencies
    const rates: Record<string, number> = {};
    for (const code of TOP_CURRENCIES) {
      if (data.rates[code]) rates[code] = data.rates[code];
    }

    setCached(cacheKey, rates, TTL.ONE_HOUR);
    return NextResponse.json({ base, rates, cached: false });
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 });
  }
}
