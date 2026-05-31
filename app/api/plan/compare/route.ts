import { NextRequest, NextResponse } from 'next/server';
import { anthropic, DRIFT_SYSTEM_PROMPT, MODEL } from '@/lib/claude';
import type { Destination, PlanningMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { destinations, userPrompt, history } = await req.json() as {
      destinations: Destination[];
      userPrompt: string;
      history: PlanningMessage[];
    };

    const destList = destinations
      .map((d, i) => `${i + 1}. ${d.name}, ${d.country} (${d.budgetRange})`)
      .join('\n');

    const userMessage = `The user's original travel idea was: "${userPrompt}"

They've shortlisted these destinations:
${destList}

For each destination, write a short "Why this wins for you" summary (2-3 sentences, warm and specific to their travel idea), and score it on:
- costScore (1-10, 10 = cheapest)
- weatherScore (1-10, 10 = best weather year-round)
- uniquenessScore (1-10, 10 = most unique/offbeat)
- visaEase (Easy / Moderate / Complex for Indian passport)

Return as JSON:
{
  "comparisons": [
    {
      "destinationId": "id-from-input",
      "whyItWins": "specific reason this destination wins for their vibe",
      "costScore": 7,
      "weatherScore": 8,
      "uniquenessScore": 6,
      "visaEase": "Easy"
    }
  ]
}`;

    const messages = [
      ...(history as PlanningMessage[]).slice(-4).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system: DRIFT_SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('/api/plan/compare error:', err);
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 });
  }
}
