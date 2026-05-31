import { NextRequest, NextResponse } from 'next/server';
import { anthropic, DRIFT_SYSTEM_PROMPT, MODEL } from '@/lib/claude';
import type { TripConfig, PlanningMessage } from '@/types';
import { getDayCount } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { config, history } = await req.json() as {
      config: TripConfig;
      history: PlanningMessage[];
    };

    const days = getDayCount(config.startDate, config.endDate);
    const budget = `${config.currency} ${config.budgetMin.toLocaleString()}–${config.budgetMax.toLocaleString()}`;

    const userMessage = `Generate a complete ${days}-day itinerary for:
- Destination: ${config.destination.name}, ${config.destination.country}
- Travel dates: ${config.startDate} to ${config.endDate}
- Travelers: ${config.adults} adult(s), ${config.children} child(ren)
- Total budget: ${budget}
- Trip style: ${config.tripStyle}
- Flying from: ${config.startingCity}
- Passport: ${config.passportCountry}

Return as JSON:
{
  "itinerary": {
    "tripId": "generated-id",
    "destination": "${config.destination.name}",
    "country": "${config.destination.country}",
    "totalDays": ${days},
    "totalEstimatedCost": 0,
    "currency": "${config.currency}",
    "days": [
      {
        "dayNumber": 1,
        "date": "${config.startDate}",
        "theme": "Arrival & First Impressions",
        "morning": [{ "id": "unique-id", "name": "Activity", "description": "What to do and why it's special", "estimatedCost": 0, "location": "Place name", "lat": 0.0, "lng": 0.0, "type": "morning" }],
        "afternoon": [],
        "evening": []
      }
    ],
    "flightInfo": {
      "origin": "${config.startingCity}",
      "destination": "${config.destination.name}",
      "departureDate": "${config.startDate}",
      "returnDate": "${config.endDate}"
    },
    "hotelInfo": {
      "destination": "${config.destination.name}",
      "checkin": "${config.startDate}",
      "checkout": "${config.endDate}"
    },
    "visaInfo": {
      "required": true,
      "type": "Tourist visa / Visa on arrival / e-Visa",
      "processingTime": "3-5 business days",
      "fee": "$25-50 USD",
      "notes": "Specific requirements for ${config.passportCountry} passport holders",
      "embassyUrl": "https://example.com"
    },
    "packingList": ["item1", "item2"],
    "budgetBreakdown": {
      "flights": 0,
      "accommodation": 0,
      "food": 0,
      "activities": 0,
      "transport": 0,
      "misc": 0
    }
  }
}

Make activities specific, local, and true to the ${config.tripStyle} style. Include real place names with approximate coordinates. Packing list should be tailored to destination and season. Budget breakdown should add up to totalEstimatedCost in ${config.currency}.`;

    const messages = [
      ...(history as PlanningMessage[]).slice(-4).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 6000,
      system: DRIFT_SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('/api/plan/itinerary error:', err);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
