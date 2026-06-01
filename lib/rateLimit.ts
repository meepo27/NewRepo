import { createClient } from '@supabase/supabase-js';

// In-memory fallback for when Supabase isn't configured
const memoryUsage = new Map<string, { count: number; resetAt: number }>();

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number; // seconds
}

// Max 10 AI calls per user per hour, 50 per IP per day
const USER_HOURLY_LIMIT = 10;
const IP_DAILY_LIMIT = 50;

export async function checkRateLimit(
  identifier: string,
  identifierType: 'user' | 'ip',
  endpoint: string
): Promise<RateLimitResult> {
  const windowMs = identifierType === 'user' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const limit = identifierType === 'user' ? USER_HOURLY_LIMIT : IP_DAILY_LIMIT;
  const key = `rl:${identifierType}:${identifier}:${endpoint}`;
  const now = Date.now();

  // Try Supabase first
  const sb = getSupabase();
  if (sb) {
    try {
      const windowStart = new Date(now - windowMs).toISOString();
      const { count } = await sb
        .from('api_usage')
        .select('*', { count: 'exact', head: true })
        .eq('identifier', identifier)
        .eq('identifier_type', identifierType)
        .eq('endpoint', endpoint)
        .gte('created_at', windowStart);

      const used = count ?? 0;
      if (used >= limit) {
        return { allowed: false, remaining: 0, retryAfter: Math.ceil(windowMs / 1000) };
      }

      // Record this call
      await sb.from('api_usage').insert({
        identifier,
        identifier_type: identifierType,
        endpoint,
      });

      return { allowed: true, remaining: limit - used - 1 };
    } catch {
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const entry = memoryUsage.get(key);
  if (!entry || now > entry.resetAt) {
    memoryUsage.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export function rateLimitResponse(retryAfter: number) {
  return new Response(
    JSON.stringify({ error: 'rate_limit_exceeded', retryAfter }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}
