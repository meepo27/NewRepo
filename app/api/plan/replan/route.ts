import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import type { RefinementPatch } from '@/types/planning';

const SYSTEM_PROMPT = `You are Drift. The user's trip is underway or upcoming and
weather conditions have changed for a specific day. Regenerate
only the affected day's activities with weather-appropriate
alternatives.

RULES:
- Replace outdoor activities with genuinely good indoor alternatives
  in the same city — real places, not placeholders
- Keep the same morning/afternoon/evening structure
- Maintain similar budget level unless user requests otherwise
- Keep meal suggestions — only swap sightseeing and activities
- Add a weatherNote field explaining the logic

CRITICAL: Return ONLY valid JSON. No markdown. No backticks.

Same response schema as the patch object in /api/plan/refine
plus a weatherNote: string field.

{
  "modifiedDays": [
    {
      "dayNumber": number,
      "period": "morning" | "afternoon" | "evening" | "full",
      "activities": []
    }
  ],
  "budgetDelta": { "currency": "string", "amount": number } | null,
  "weatherNote": "string"
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/replan');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { dayNumber, weatherCondition, currentDay, destination, tripContext } = body;

    if (!dayNumber || !weatherCondition || !currentDay) {
      return NextResponse.json({ error: 'dayNumber, weatherCondition, currentDay required' }, { status: 400 });
    }

    const result = await callClaude<RefinementPatch & { weatherNote: string }>(
      SYSTEM_PROMPT,
      [{
        role: 'user',
        content: JSON.stringify({ dayNumber, weatherCondition, currentDay, destination, tripContext }),
      }],
      2000
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
