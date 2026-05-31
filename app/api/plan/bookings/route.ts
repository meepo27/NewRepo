import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import type { BookingChecklistItem } from '@/types/planning';

const SYSTEM_PROMPT = `You are Drift, the AI brain of Driftplan. The user has a finalized
itinerary. Your job is to generate a smart booking checklist —
a prioritized, sequenced list of things the user needs to book,
in the correct order, with urgency signals.

You have: destination, travel dates, duration, travelers,
budget tier, starting city, passport country.

RULES:
- Booking order must be logical: flights first, then
  accommodation, then trains/transport, then activities
- Urgency must be realistic: flights and hotels 4+ weeks ahead
  are "book now", activities can be "book 1 week before"
- For visa, provide the exact application link for the
  user's passport country if you know it — never guess
- Flag if any item has limited availability risk
  (e.g. popular tours sell out, peak season hotels)
- Be specific about lead times based on the user's
  actual travel dates vs today's date

CRITICAL: Return ONLY a valid JSON object. No markdown.
No backticks. Raw JSON only.

Response schema:
{
  "bookingChecklist": [
    {
      "id": "string",
      "category": "flights | accommodation | trains | buses | activities | visa | insurance",
      "title": "string (e.g. Book outbound flight KOL → LHR)",
      "urgency": "book-now | book-soon | can-wait",
      "urgencyReason": "string (e.g. Peak season — fares rising daily)",
      "recommendedLeadTime": "string (e.g. Book 6 weeks ahead)",
      "estimatedCost": {
        "amount": number,
        "currency": "string",
        "per": "person | total | night"
      },
      "isRequired": boolean,
      "notes": "string | null"
    }
  ],
  "visaApplicationLink": "string | null",
  "travelInsuranceNote": "string (one sentence recommending appropriate insurance type for this trip)",
  "bookingOrderAdvice": "string (2-3 sentence summary of what to book first and why)"
}`;

interface BookingsRequest {
  destination: { name: string; country: string; countryCode: string };
  travelDates: { from: string; to: string; durationDays: number };
  travelers: { adults: number; children: number };
  budgetTier: string;
  startingCity: string;
  passportCountry: string;
  itinerarySummary: string;
}

interface BookingsResponse {
  bookingChecklist: BookingChecklistItem[];
  visaApplicationLink: string | null;
  travelInsuranceNote: string;
  bookingOrderAdvice: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingsRequest = await request.json();

    const {
      destination,
      travelDates,
      travelers,
      budgetTier,
      startingCity,
      passportCountry,
      itinerarySummary,
    } = body;

    if (!destination?.name || !travelDates?.from || !travelDates?.to) {
      return NextResponse.json(
        { error: 'destination, travelDates.from, and travelDates.to are required' },
        { status: 400 }
      );
    }

    const result = await callClaude<BookingsResponse>(
      SYSTEM_PROMPT,
      [
        {
          role: 'user',
          content: JSON.stringify({
            destination,
            travelDates,
            travelers,
            budgetTier,
            startingCity,
            passportCountry,
            itinerarySummary,
            todayDate: new Date().toISOString().split('T')[0],
          }),
        },
      ],
      1000
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json(
        { error: 'Failed to parse booking checklist', raw: err.rawContent },
        { status: 502 }
      );
    }
    console.error('[bookings] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
