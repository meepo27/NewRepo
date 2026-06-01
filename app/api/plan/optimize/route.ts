import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { checkLimit, proRequiredResponse } from '@/lib/subscription';

const SYSTEM_PROMPT = `You are Drift. The user wants to reduce the cost of their trip
without ruining the experience. Analyze their itinerary and
suggest specific, actionable savings.

RULES:
- Identify the top 5 cost-reduction opportunities ranked by savings impact
- For each, give the original cost, new cost, and saving
- Suggest real cheaper alternatives — not just "eat local"
- Flag what NOT to cut (experiences worth the money)
- Calculate new total budget after all suggested cuts applied
- Never suggest cutting the single best experience of the trip

CRITICAL: Return ONLY valid JSON. No markdown. No backticks.

Response schema:
{
  "savingsOpportunities": [
    {
      "id": "string",
      "category": "accommodation | activity | meal | transport | flight",
      "currentItem": "string",
      "currentCost": number,
      "suggestedAlternative": "string",
      "newCost": number,
      "saving": number,
      "currency": "string",
      "tradeoff": "string",
      "worthIt": boolean
    }
  ],
  "doNotCut": { "item": "string", "reason": "string" },
  "originalTotal": number,
  "optimizedTotal": number,
  "totalSaving": number,
  "currency": "string",
  "optimizerNote": "string"
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/optimize');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { currentItinerary, targetBudget, currency, userId } = body;

    if (userId) {
      const limit = await checkLimit(userId, 'budget_optimizer');
      if (!limit.allowed) return proRequiredResponse('budget_optimizer');
    }

    if (!currentItinerary) {
      return NextResponse.json({ error: 'currentItinerary required' }, { status: 400 });
    }

    const result = await callClaude<{
      savingsOpportunities: unknown[];
      doNotCut: { item: string; reason: string };
      originalTotal: number;
      optimizedTotal: number;
      totalSaving: number;
      currency: string;
      optimizerNote: string;
    }>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: JSON.stringify({ currentItinerary, targetBudget, currency }) }],
      1500
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
