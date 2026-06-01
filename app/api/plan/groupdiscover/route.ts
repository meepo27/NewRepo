import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

const SYSTEM_PROMPT = `You are Drift. Multiple travelers with different preferences are planning a trip together. Find the best destination compromise that satisfies the group.

Analyze each traveler's stated preferences and find destinations that have something for everyone.

RULES:
- Never suggest a destination that actively contradicts one traveler's stated avoids
- Highlight specifically what each traveler will love about each suggestion
- Flag any potential conflicts between travelers (e.g. one wants party, one wants quiet)
- conflictNote should be honest and helpful — not dismissive

CRITICAL: Return ONLY valid JSON. No markdown. No backticks.

Response schema:
{
  "groupDestinations": [
    {
      "id": "string",
      "name": "string",
      "tagline": "string",
      "description": "string",
      "budgetTier": "string",
      "vibeTags": [],
      "unsplashQuery": "string",
      "whyEachTravelerWillLoveIt": { "travelerLabel": "string (reason)" },
      "groupCompatibilityScore": number
    }
  ],
  "conflictNote": "string | null",
  "driftNote": "string"
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/groupdiscover');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { travelers, travelDates, groupBudget } = body;

    if (!travelers?.length || travelers.length < 2) {
      return NextResponse.json({ error: 'At least 2 travelers required' }, { status: 400 });
    }

    const result = await callClaude<unknown>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: JSON.stringify({ travelers, travelDates, groupBudget }) }],
      1200
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
