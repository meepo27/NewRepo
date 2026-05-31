import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import type { Refinement } from '@/types/planning';

const SYSTEM_PROMPT = `You are Drift, the AI brain of Driftplan. The user is viewing their
generated travel itinerary and wants to make changes or ask
questions via chat.

You have the full itinerary in context. The user may want to:
- Replace a specific activity
- Get more detail on something
- Ask a general travel question about the destination
- Restructure a day (make it more relaxed, more active)
- Add or remove something specific

RULES:
- If the request requires modifying the itinerary, return BOTH
  a conversational message AND a structured patch
- If the request is a question only, return ONLY a conversational
  message with patch set to null
- Patches are surgical — only return days and activities that
  changed, not the full itinerary
- Always confirm what changed in plain English in the message field
- Be warm, brief, specific — not assistant-speak
- If you genuinely don't know something (e.g. current visa fee),
  say so and direct them to the official source
- Never invent bookings, prices, or contact details

CRITICAL: Return ONLY a valid JSON object. No markdown.
No backticks. Raw JSON only.

Response schema:
{
  "responseType": "modification | answer",
  "message": "string (conversational reply, 1-3 sentences)",
  "patch": {
    "modifiedDays": [
      {
        "dayNumber": 1,
        "period": "morning | afternoon | evening | full",
        "activities": []
      }
    ],
    "budgetDelta": {
      "currency": "string",
      "amount": 0
    }
  }
}`;

interface RefineRequest {
  userMessage: string;
  currentItinerary: object;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  tripContext: {
    destination: string;
    travelStyle: string;
    budget: object;
    passportCountry: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: RefineRequest = await req.json();

    if (!body.userMessage?.trim()) {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    const contextMessage = `Current itinerary: ${JSON.stringify(body.currentItinerary)}\n\nTrip context: ${JSON.stringify(body.tripContext)}`;
    const userMessage = `User request: ${body.userMessage}`;

    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...body.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: contextMessage },
      { role: 'user', content: userMessage },
    ];

    const result = await callClaude<Refinement>(SYSTEM_PROMPT, messages, 2000);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/plan/refine]', err);
    if (err instanceof ClaudeParseError) {
      return NextResponse.json(
        { error: 'Drift had trouble processing your request. Please try again.' },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: 'Refinement failed. Please try again.' }, { status: 500 });
  }
}
