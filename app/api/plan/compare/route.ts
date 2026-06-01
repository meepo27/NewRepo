import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import type { ComparisonResult } from '@/types/planning';

const SYSTEM_PROMPT = `You are Drift, the AI brain of Driftplan. The user has shortlisted
2-3 travel destinations and wants help choosing one final destination.

You have: their shortlisted destinations, travel dates, traveler
count, budget range, travel style, and passport country.

Your job is to produce a side-by-side comparison AND a clear
recommendation with reasoning.

RULES:
- Be decisive. Give a clear winner with a specific reason tied
  to THIS user's inputs — not generic advice
- Visa info must reflect passport country. For Indian passport
  be especially precise (visa-on-arrival vs e-visa vs visa required)
- Weather assessment must reflect the user's actual travel dates
- Do not say "it depends" — make a call
- The whyItWinsForYou field is the most important — it must
  reference the user's specific travel style, dates, or budget
- Score fields are integers 1-10

CRITICAL: Return ONLY a valid JSON object. No markdown.
No preamble. No backticks. Raw JSON only.

Response schema:
{
  "comparisons": [
    {
      "destinationId": "string",
      "name": "string",
      "scores": {
        "valueForMoney": 0,
        "weatherInTravelPeriod": 0,
        "easeOfTravel": 0,
        "matchToTravelStyle": 0
      },
      "visa": {
        "requirement": "visa-free | visa-on-arrival | e-visa | visa-required",
        "processingTime": "string (e.g. instant | 3-5 days)",
        "estimatedCost": "string (e.g. Free | $25 | $80)",
        "notes": "string (any critical caveats)"
      },
      "weatherSummary": "string (one sentence about weather during user travel dates)",
      "quickPros": ["string", "string", "string"],
      "quickCons": ["string", "string"]
    }
  ],
  "recommendation": {
    "winnerId": "string",
    "winnerName": "string",
    "whyItWinsForYou": "string (2-3 sentences highly specific to this user — reference their travel style, dates, budget explicitly)",
    "oneLineVerdictOnOthers": {
      "destinationId": "string (why it lost — one sentence)"
    }
  }
}`;

interface CompareRequest {
  shortlistedDestinations: {
    id: string;
    name: string;
    budgetTier: string;
    vibeTags: string[];
  }[];
  travelDates: { from: string; to: string };
  travelers: { adults: number; children: number };
  budgetRange: { currency: string; min: number; max: number };
  travelStyle: string;
  passportCountry: string;
  homeCity: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/compare');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body: CompareRequest = await req.json();

    if (!body.shortlistedDestinations?.length) {
      return NextResponse.json({ error: 'shortlistedDestinations is required' }, { status: 400 });
    }

    const userMessageContent = JSON.stringify(body);

    const result = await callClaude<ComparisonResult>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: userMessageContent }],
      1500
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/plan/compare]', err);
    if (err instanceof ClaudeParseError) {
      return NextResponse.json(
        { error: 'Drift had trouble comparing destinations. Please try again.' },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: 'Comparison failed. Please try again.' }, { status: 500 });
  }
}
