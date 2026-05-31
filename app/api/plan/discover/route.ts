import { NextRequest, NextResponse } from 'next/server';
import { anthropic, DRIFT_SYSTEM_PROMPT, MODEL } from '@/lib/claude';
import type { PlanningMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history, refreshExclude, refreshOne } = await req.json();

    const excludeClause =
      refreshExclude?.length
        ? `Do NOT suggest these destinations: ${refreshExclude.join(', ')}.`
        : '';

    const userMessage = refreshOne
      ? `Give me ${refreshExclude?.length ? 'one new' : '4'} destination suggestions for: "${prompt}". ${excludeClause} Return as JSON with this structure:
{
  "destinations": [
    {
      "id": "unique-slug",
      "name": "City/Region Name",
      "country": "Country",
      "description": "Two lines. Poetic, specific, evocative. Why this fits their vibe.",
      "bestTime": "e.g. October to March",
      "budgetRange": "budget|mid|luxury",
      "vibeTags": ["#tag1", "#tag2", "#tag3"],
      "imageQuery": "search query for Unsplash e.g. 'Bali beach sunset'"
    }
  ]
}`
      : `Based on this travel idea: "${prompt}", suggest exactly 4 destinations that genuinely fit the vibe. ${excludeClause}

Return as JSON:
{
  "destinations": [
    {
      "id": "unique-slug",
      "name": "City/Region Name",
      "country": "Country",
      "description": "Two sentences. Poetic, specific. Why this destination fits their exact vibe.",
      "bestTime": "e.g. October to March",
      "budgetRange": "budget|mid|luxury",
      "vibeTags": ["#tag1", "#tag2", "#tag3"],
      "imageQuery": "specific Unsplash search query e.g. 'Santorini white buildings sunset'"
    }
  ]
}

Be specific, not generic. If the user says beach, think about whether they want party beaches, quiet coves, snorkeling, sunsets. Match the energy.`;

    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...(history as PlanningMessage[])
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: DRIFT_SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    const destinations = parsed.destinations.map((d: { id?: string; name?: string; [key: string]: unknown }) => ({
      ...d,
      id: d.id || d.name?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2),
    }));

    return NextResponse.json({ destinations });
  } catch (err) {
    console.error('/api/plan/discover error:', err);
    return NextResponse.json(
      { error: 'Failed to discover destinations. Please try again.' },
      { status: 500 }
    );
  }
}
