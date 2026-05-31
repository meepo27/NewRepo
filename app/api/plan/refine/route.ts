import { NextRequest, NextResponse } from 'next/server';
import { anthropic, DRIFT_SYSTEM_PROMPT, MODEL } from '@/lib/claude';
import type { Itinerary, PlanningMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { message, currentItinerary, history } = await req.json() as {
      message: string;
      currentItinerary: Itinerary;
      history: PlanningMessage[];
    };

    const userMessage = `The user wants to modify their itinerary for ${currentItinerary.destination}, ${currentItinerary.country}.

Their request: "${message}"

Current itinerary summary: ${currentItinerary.totalDays} days, ${currentItinerary.currency} ${currentItinerary.totalEstimatedCost} total.

Please update the itinerary based on the request. Return the complete updated itinerary in the same JSON format as before:
{
  "itinerary": { ...complete updated itinerary object... }
}

Only change what the user asked to change. Keep everything else the same. Maintain the same JSON structure.`;

    const messages = [
      ...(history as PlanningMessage[]).slice(-6).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      {
        role: 'user' as const,
        content: `Current itinerary data: ${JSON.stringify(currentItinerary)}`,
      },
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
    console.error('/api/plan/refine error:', err);
    return NextResponse.json({ error: 'Refinement failed' }, { status: 500 });
  }
}
