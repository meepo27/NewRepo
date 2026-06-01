import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

const SYSTEM_PROMPT = `You are Drift. Based on the traveler's day-by-day journal entries from their trip, write a beautiful, personal travel memoir summary.

Write in first person, warm and reflective. Reference specific places, moments, and moods from the entries. Structure as 3 paragraphs: arrival and first impressions, the heart of the journey, and the feeling of leaving.

Return ONLY a JSON object:
{
  "memoir": "string (3 paragraphs separated by \\n\\n)",
  "tripTitle": "string (poetic title, e.g. Ten Days and a Thousand Temples)",
  "standoutMoment": "string (the single best moment from the entries, one sentence)"
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/journalsummary');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { journalEntries, destination, travelDates } = body;

    if (!journalEntries?.length) {
      return NextResponse.json({ error: 'journalEntries required' }, { status: 400 });
    }

    const result = await callClaude<{ memoir: string; tripTitle: string; standoutMoment: string }>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: JSON.stringify({ journalEntries, destination, travelDates }) }],
      1000
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
