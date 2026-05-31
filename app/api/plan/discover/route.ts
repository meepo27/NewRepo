import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import type { Destination } from '@/types/planning';

const SYSTEM_PROMPT = `You are Drift, the AI brain of Driftplan — a travel planning app.
Your job at this stage is destination discovery.

The user has given you a vague travel feeling or idea. Your task is
to turn that into exactly 4 specific, well-matched destination
suggestions.

RULES:
- Never suggest the user's home city or country as a destination
- Never give generic suggestions (Paris for romantic trip is lazy
  — think deeper and more specific)
- Each destination must genuinely match the user's stated vibe,
  budget signal, and travel season
- If the user mentions a region, stay within it
- If no region is mentioned, suggest a diverse global mix
- If the user mentions a budget signal (cheap, budget, luxury,
  splurge), respect it strictly
- Descriptions must be evocative and specific — not brochure language
- Vibe tags must be lowercase, single words or short hyphenated
  phrases, max 3 per destination
- Budget tiers: budget = under $50/day, mid = $50-150/day,
  luxury = $150+/day
- If the user's input is nonsensical or off-topic, return an
  error field

CRITICAL: Return ONLY a valid JSON object. No markdown. No
explanation. No preamble. No backticks. Raw JSON only.

Response schema:
{
  "destinations": [
    {
      "id": "string (slug e.g. hoi-an-vietnam)",
      "name": "string (City, Country)",
      "tagline": "string (one evocative sentence max 12 words)",
      "description": "string (2 sentences specific and atmospheric)",
      "bestMonths": "string (e.g. November-February)",
      "budgetTier": "budget | mid | luxury",
      "estimatedDailyBudget": {
        "currency": "USD",
        "min": 0,
        "max": 0
      },
      "vibeTags": ["string", "string", "string"],
      "unsplashQuery": "string (2-3 word query for photo fetch)"
    }
  ],
  "driftNote": "string (one warm sentence acknowledging the user vibe and why these picks fit)"
}`;

interface DiscoverRequest {
  userInput: string;
  homeCity: string;
  passportCountry: string;
  currency: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
}

interface DiscoverResponse {
  destinations: Destination[];
  driftNote: string;
  error?: string;
}

function parseDestination(raw: Record<string, unknown>): Destination {
  const fullName = String(raw.name ?? '');
  const parts = fullName.split(',');
  const country = parts.length > 1 ? parts[parts.length - 1].trim() : '';
  const cityName = parts.length > 1 ? parts.slice(0, -1).join(',').trim() : fullName;

  return {
    id: String(raw.id ?? '').toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2),
    name: cityName,
    country,
    tagline: String(raw.tagline ?? ''),
    description: String(raw.description ?? ''),
    bestMonths: String(raw.bestMonths ?? ''),
    budgetTier: (['budget', 'mid', 'luxury'].includes(String(raw.budgetTier))
      ? raw.budgetTier
      : 'mid') as Destination['budgetTier'],
    estimatedDailyBudget: {
      currency: String((raw.estimatedDailyBudget as Record<string, unknown>)?.currency ?? 'USD'),
      min: Number((raw.estimatedDailyBudget as Record<string, unknown>)?.min ?? 0),
      max: Number((raw.estimatedDailyBudget as Record<string, unknown>)?.max ?? 0),
    },
    vibeTags: Array.isArray(raw.vibeTags) ? (raw.vibeTags as string[]) : [],
    unsplashQuery: String(raw.unsplashQuery ?? cityName),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: DiscoverRequest = await req.json();
    const { userInput, homeCity, passportCountry, currency, conversationHistory } = body;

    if (!userInput?.trim()) {
      return NextResponse.json({ error: 'userInput is required' }, { status: 400 });
    }

    const userMessageContent = JSON.stringify({ userInput, homeCity, passportCountry, currency });

    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessageContent },
    ];

    const result = await callClaude<{ destinations: unknown[]; driftNote?: string; error?: string }>(
      SYSTEM_PROMPT,
      messages,
      1500
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    const destinations = (result.destinations ?? []).map((d) =>
      parseDestination(d as Record<string, unknown>)
    );

    const response: DiscoverResponse = {
      destinations,
      driftNote: result.driftNote ?? '',
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('[/api/plan/discover]', err);
    if (err instanceof ClaudeParseError) {
      return NextResponse.json(
        { error: 'Drift had trouble understanding the response. Please try again.' },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
