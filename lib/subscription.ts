import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );
}

export type Plan = 'free' | 'pro';

export type LimitType =
  | 'saved_trips'
  | 'daily_discoveries'
  | 'multicity'
  | 'group_collaboration'
  | 'journal'
  | 'budget_optimizer'
  | 'pdf_export'
  | 'persona'
  | 'weather_replan';

const FREE_LIMITS: Record<LimitType, number | false> = {
  saved_trips: 3,
  daily_discoveries: 5,
  multicity: 0,         // 0 = blocked on free
  group_collaboration: 0,
  journal: 0,
  budget_optimizer: 0,
  pdf_export: 0,
  persona: 0,
  weather_replan: 0,
};

export async function getUserPlan(userId: string): Promise<Plan> {
  const sb = getSupabase();
  const { data } = await sb
    .from('subscriptions')
    .select('plan, status, expires_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!data) return 'free';
  if (data.expires_at && new Date(data.expires_at) < new Date()) return 'free';
  return data.plan as Plan;
}

export async function checkLimit(
  userId: string,
  limitType: LimitType
): Promise<{ allowed: boolean; reason?: string }> {
  const plan = await getUserPlan(userId);
  if (plan === 'pro') return { allowed: true };

  const limit = FREE_LIMITS[limitType];

  if (limit === 0) {
    return { allowed: false, reason: `${limitType} is a Pro feature` };
  }

  if (limit === false) return { allowed: true };

  // Count-based limits
  const sb = getSupabase();
  if (limitType === 'saved_trips') {
    const { count } = await sb
      .from('trips')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'saved');
    if ((count ?? 0) >= limit) {
      return { allowed: false, reason: `Free plan allows max ${limit} saved trips` };
    }
  }

  if (limitType === 'daily_discoveries') {
    const today = new Date().toISOString().split('T')[0];
    const { count } = await sb
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', userId)
      .eq('endpoint', '/api/plan/discover')
      .gte('created_at', `${today}T00:00:00Z`);
    if ((count ?? 0) >= limit) {
      return { allowed: false, reason: `Free plan allows ${limit} destination discoveries per day` };
    }
  }

  return { allowed: true };
}

export function proRequiredResponse(feature: string) {
  return new Response(
    JSON.stringify({ error: 'pro_required', feature }),
    { status: 403, headers: { 'Content-Type': 'application/json' } }
  );
}
