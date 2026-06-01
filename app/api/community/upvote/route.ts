import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { publicTripId } = await request.json();
  if (!publicTripId) return NextResponse.json({ error: 'publicTripId required' }, { status: 400 });

  // Check existing upvote
  const { data: existing } = await sb.from('trip_upvotes')
    .select('id').eq('public_trip_id', publicTripId).eq('user_id', user.id).single();

  if (existing) {
    // Remove upvote
    await sb.from('trip_upvotes').delete().eq('id', existing.id);
    const { data: ptDec } = await sb.from('public_trips').select('upvotes').eq('id', publicTripId).single();
    await sb.from('public_trips').update({ upvotes: Math.max(0, (ptDec?.upvotes ?? 1) - 1) }).eq('id', publicTripId);
    return NextResponse.json({ upvoted: false });
  }

  // Add upvote
  await sb.from('trip_upvotes').insert({ public_trip_id: publicTripId, user_id: user.id });
  const { data: pt } = await sb.from('public_trips').select('upvotes').eq('id', publicTripId).single();
  await sb.from('public_trips').update({ upvotes: (pt?.upvotes ?? 0) + 1 }).eq('id', publicTripId);

  return NextResponse.json({ upvoted: true });
}
