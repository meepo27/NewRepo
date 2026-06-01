import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { tripId, type, itemId, vote, dayNumber } = await request.json();
  if (!tripId || !type || !itemId || !vote) {
    return NextResponse.json({ error: 'tripId, type, itemId, vote required' }, { status: 400 });
  }

  if (type === 'destination') {
    await sb.from('destination_votes').upsert({
      trip_id: tripId,
      user_email: user.email!,
      destination_id: itemId,
      vote,
    }, { onConflict: 'trip_id,user_email,destination_id' });

    const { data: tally } = await sb.from('destination_votes')
      .select('vote')
      .eq('trip_id', tripId)
      .eq('destination_id', itemId);

    const counts = (tally ?? []).reduce((acc: Record<string, number>, row) => {
      acc[row.vote] = (acc[row.vote] ?? 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({ tally: counts });
  }

  if (type === 'activity') {
    await sb.from('activity_votes').upsert({
      trip_id: tripId,
      day_number: dayNumber,
      activity_id: itemId,
      user_email: user.email!,
      vote,
    }, { onConflict: 'trip_id,user_email,activity_id' });

    const { data: tally } = await sb.from('activity_votes')
      .select('vote')
      .eq('trip_id', tripId)
      .eq('activity_id', itemId);

    const counts = (tally ?? []).reduce((acc: Record<string, number>, row) => {
      acc[row.vote] = (acc[row.vote] ?? 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({ tally: counts });
  }

  return NextResponse.json({ error: 'invalid type' }, { status: 400 });
}
