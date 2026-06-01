import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

const SYSTEM_PROMPT = `You are Drift. Generate a pre-departure checklist for the user's specific trip.

RULES:
- Tasks must be time-bucketed: 4 weeks before / 2 weeks before / 1 week before / day before / day of departure
- Include tasks specific to this destination (e.g. Japan: get IC card, India: carry cash for autos)
- Include visa and document tasks based on passport country
- Include health tasks (vaccinations, medications) specific to the destination
- Never include generic useless tasks like "be excited"

CRITICAL: Return ONLY valid JSON. No markdown. No backticks.

Response schema:
{
  "checklistBuckets": [
    {
      "bucket": "4 weeks before | 2 weeks before | 1 week before | day before | day of",
      "tasks": [
        {
          "id": "string",
          "task": "string",
          "category": "documents | health | booking | packing | money | tech | misc",
          "isRequired": boolean,
          "link": "string | null"
        }
      ]
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/checklist');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { destination, travelDates, travelers, passportCountry, travelStyle, budgetTier } = body;

    if (!destination) {
      return NextResponse.json({ error: 'destination required' }, { status: 400 });
    }

    const result = await callClaude<{ checklistBuckets: unknown[] }>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: JSON.stringify({ destination, travelDates, travelers, passportCountry, travelStyle, budgetTier }) }],
      800
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
