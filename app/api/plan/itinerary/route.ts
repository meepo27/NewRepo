import { NextRequest, NextResponse } from 'next/server';
import { callClaude, ClaudeParseError } from '@/lib/anthropic';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import type { Itinerary } from '@/types/planning';

const SYSTEM_PROMPT = `You are Drift, the AI brain of Driftplan. The user has chosen their
destination and configured their trip. Generate a complete,
realistic, day-by-day travel itinerary.

RULES:
- Every activity must be real and specific — name actual places,
  real restaurants, real attractions. Never use placeholders.
- Timings must be realistic — account for travel time and
  meal durations
- Morning = 7am-12pm, Afternoon = 12pm-5pm, Evening = 5pm-11pm
- Day 1 starts after assumed afternoon arrival — no full-day
  activities on arrival day
- Last day ends by noon — account for checkout and airport travel
- Restaurant suggestions must be real places with a one-line
  description of the signature dish to order
- Each activity must have an estimated cost in the user's currency
- Hotel suggestions: give 3 tiers (budget/mid/luxury) with real
  hotel names and approximate nightly rates
- budgetSummary totals must add up correctly
- packingList must be specific to destination + season +
  travel style, not a generic list
- localTips must be genuine insider knowledge not Wikipedia facts
- emergencyContacts must be real numbers for that country
- For flights, generate correct Skyscanner deep links:
  https://www.skyscanner.com/transport/flights/{IATA_FROM}/{IATA_TO}/{YYYYMMDD}/
- For hotels on Booking.com deep links use:
  https://www.booking.com/searchresults.html?ss={destination}&checkin={YYYY-MM-DD}&checkout={YYYY-MM-DD}&group_adults={adults}&group_children={children}
- For Airbnb deep links use:
  https://www.airbnb.com/s/{destination}/homes?checkin={YYYY-MM-DD}&checkout={YYYY-MM-DD}&adults={adults}

CRITICAL: Return ONLY a valid JSON object. No markdown.
No preamble. No backticks. Raw JSON only.

Response schema:
{
  "tripSummary": {
    "destination": "string",
    "country": "string",
    "duration": 0,
    "travelStyle": "string",
    "totalTravelers": 0
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "string (e.g. Mon, 14 Jul)",
      "theme": "string (evocative day title)",
      "morning": {
        "activities": [
          {
            "id": "string",
            "name": "string",
            "type": "activity | meal | transport | experience",
            "description": "string (2-3 sentences specific)",
            "location": {
              "name": "string",
              "lat": 0.0,
              "lng": 0.0
            },
            "duration": "string (e.g. 2 hours)",
            "estimatedCost": {
              "amount": 0,
              "currency": "string",
              "per": "person | group"
            },
            "bookingLink": "string | null",
            "tips": "string | null"
          }
        ]
      },
      "afternoon": { "activities": [] },
      "evening": { "activities": [] }
    }
  ],
  "accommodation": {
    "budget": {
      "name": "string",
      "type": "string",
      "pricePerNight": 0,
      "currency": "string",
      "bookingComLink": "string",
      "airbnbLink": "string"
    },
    "mid": {
      "name": "string",
      "type": "string",
      "pricePerNight": 0,
      "currency": "string",
      "bookingComLink": "string",
      "airbnbLink": "string"
    },
    "luxury": {
      "name": "string",
      "type": "string",
      "pricePerNight": 0,
      "currency": "string",
      "bookingComLink": "string",
      "airbnbLink": "string"
    }
  },
  "flights": {
    "outbound": {
      "from": "string",
      "fromIATA": "string",
      "to": "string",
      "toIATA": "string",
      "date": "string",
      "skyscannerLink": "string",
      "makemytripLink": "string",
      "googleFlightsLink": "string"
    },
    "return": {
      "from": "string",
      "fromIATA": "string",
      "to": "string",
      "toIATA": "string",
      "date": "string",
      "skyscannerLink": "string",
      "makemytripLink": "string",
      "googleFlightsLink": "string"
    }
  },
  "budgetSummary": {
    "currency": "string",
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "localTransport": 0,
    "miscellaneous": 0,
    "subtotal": 0,
    "flightsEstimate": 0,
    "grandTotal": 0
  },
  "packingList": {
    "essentials": ["string"],
    "clothing": ["string"],
    "documents": ["string"],
    "health": ["string"]
  },
  "localTips": ["string"],
  "emergencyContacts": {
    "police": "string",
    "ambulance": "string",
    "indianEmbassy": "string | null",
    "touristHelpline": "string | null"
  },
  "visaReminder": "string (one sentence for user passport)"
}`;

interface ItineraryRequest {
  destination: {
    id: string;
    name: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  travelDates: { from: string; to: string; durationDays: number };
  travelers: { adults: number; children: number };
  budget: { currency: string; totalBudget: number; tier: 'budget' | 'mid' | 'luxury' };
  travelStyle: string;
  startingCity: string;
  startingCityIATA: string;
  passportCountry: string;
  preferences: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(ip, 'ip', '/api/plan/itinerary');
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter ?? 3600);

    const body: ItineraryRequest = await req.json();

    if (!body.destination?.name || !body.travelDates?.from) {
      return NextResponse.json(
        { error: 'destination and travelDates are required' },
        { status: 400 }
      );
    }

    const userMessageContent = JSON.stringify(body);

    const result = await callClaude<Itinerary>(
      SYSTEM_PROMPT,
      [{ role: 'user', content: userMessageContent }],
      4096
    );

    return NextResponse.json({ itinerary: result });
  } catch (err) {
    console.error('[/api/plan/itinerary]', err);
    if (err instanceof ClaudeParseError) {
      return NextResponse.json(
        { error: 'Drift had trouble building your itinerary. Please try again.' },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
