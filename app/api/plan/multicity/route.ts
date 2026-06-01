import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { checkLimit, proRequiredResponse } from '@/lib/subscription';

const SYSTEM_PROMPT = `You are Drift. The user wants a multi-city trip itinerary
visiting multiple destinations in one journey. Generate a
connected, logical itinerary across all cities.

RULES:
- Order cities logically to minimize backtracking
- Allocate days proportionally based on city size and things to do
- Include inter-city travel days (flights, trains, buses) as explicit itinerary items
- Each city gets its own section with morning/afternoon/evening structure
- Inter-city transport must include real booking link suggestions
- Budget summary must break down by city
- Use same activity schema as single-city itinerary

CRITICAL: Return ONLY valid JSON. No markdown. No backticks.

Response schema:
{
  "tripSummary": {
    "title": "string",
    "totalDays": number,
    "cities": ["string"],
    "travelStyle": "string",
    "totalTravelers": number
  },
  "cities": [
    {
      "cityName": "string",
      "countryName": "string",
      "daysAllocated": number,
      "days": [
        {
          "dayNumber": number,
          "date": "string",
          "theme": "string",
          "morning": { "activities": [] },
          "afternoon": { "activities": [] },
          "evening": { "activities": [] }
        }
      ],
      "accommodation": {
        "budget": { "name": "string", "type": "string", "pricePerNight": number, "currency": "string", "bookingComLink": "string", "airbnbLink": "string" },
        "mid": { "name": "string", "type": "string", "pricePerNight": number, "currency": "string", "bookingComLink": "string", "airbnbLink": "string" },
        "luxury": { "name": "string", "type": "string", "pricePerNight": number, "currency": "string", "bookingComLink": "string", "airbnbLink": "string" }
      },
      "cityBudget": { "currency": "string", "accommodation": number, "food": number, "activities": number, "localTransport": number, "subtotal": number },
      "interCityTransportToNext": {
        "type": "flight | train | bus | ferry | drive",
        "duration": "string",
        "estimatedCost": number,
        "currency": "string",
        "bookingLinks": [{ "name": "string", "url": "string" }]
      }
    }
  ],
  "budgetSummary": {
    "currency": "string",
    "byCity": {},
    "interCityTransport": number,
    "grandTotal": number
  },
  "packingList": { "essentials": [], "clothing": [], "documents": [], "health": [] },
  "visaReminder": "string",
  "localTips": []
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/multicity');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body = await request.json();
    const { cities, travelDates, travelers, budget, travelStyle, startingCity, passportCountry, userId } = body;

    if (userId) {
      const limit = await checkLimit(userId, 'multicity');
      if (!limit.allowed) return proRequiredResponse('multi_city');
    }

    if (!cities?.length || cities.length < 2) {
      return NextResponse.json({ error: 'At least 2 cities required' }, { status: 400 });
    }
    if (cities.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 cities supported' }, { status: 400 });
    }

    const result = await callClaude<unknown>(
      SYSTEM_PROMPT,
      [{
        role: 'user',
        content: JSON.stringify({ cities, travelDates, travelers, budget, travelStyle, startingCity, passportCountry }),
      }],
      4096
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ClaudeParseError) {
      return NextResponse.json({ error: 'parse_error', raw: err.rawContent }, { status: 502 });
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
