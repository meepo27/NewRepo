import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { checkLimit, proRequiredResponse } from '@/lib/subscription';

const SYSTEM_PROMPT = `You are Drift. Based on the user's planning history — their initial
prompts, chosen destinations, travel style, budget tier, and saved
trips — infer a Travel Persona for them.

Return a persona that will be used to personalize ALL future
planning sessions for this user.

RULES:
- Persona name must be evocative and fun, not clinical
  (e.g. "The Slow Wanderer", "The Chaos Chaser",
  "The Luxe Minimalist", "The Street Food Pilgrim")
- Traits must be specific and actionable — they will be injected
  into future system prompts
- preferredPace, budgetStyle, accommodation, and foodPreference
  must each be a single descriptive phrase
- Do not be generic — base everything on the actual input data

CRITICAL: Return ONLY valid JSON. No markdown. No backticks.

Response schema:
{
  "personaName": "string",
  "personaTagline": "string (one sentence, first person, e.g. I chase sunsets not schedules)",
  "traits": ["string", "string", "string", "string"],
  "preferredPace": "string",
  "budgetStyle": "string",
  "accommodation": "string",
  "foodPreference": "string",
  "avoids": ["string", "string"],
  "destinationAffinities": ["string", "string", "string"],
  "personaEmoji": "string (single emoji that fits)"
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/persona');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { userId, planningHistory, savedTrips, userProfile } = body;

    if (userId) {
      const limit = await checkLimit(userId, 'persona');
      if (!limit.allowed) return proRequiredResponse('persona_learning');
    }

    const result = await callClaude<{
      personaName: string;
      personaTagline: string;
      traits: string[];
      preferredPace: string;
      budgetStyle: string;
      accommodation: string;
      foodPreference: string;
      avoids: string[];
      destinationAffinities: string[];
      personaEmoji: string;
    }>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: JSON.stringify({ planningHistory, savedTrips, userProfile }) }],
      800
    );

    // Persist to Supabase if userId provided
    if (userId) {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await sb.from('users').update({
        persona: result,
        persona_generated_at: new Date().toISOString(),
      }).eq('id', userId);
    }

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
