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

  // Get the source public trip + its itinerary
  const { data: publicTrip } = await sb.from('public_trips').select('*, trips(*)').eq('id', publicTripId).single();
  if (!publicTrip) return NextResponse.json({ error: 'trip not found' }, { status: 404 });

  // Create a copy for this user
  const { data: newTrip, error } = await sb.from('trips').insert({
    user_id: user.id,
    destination: publicTrip.destination,
    dates: publicTrip.trips?.dates ?? '',
    travelers: publicTrip.trips?.travelers ?? 1,
    budget: publicTrip.trips?.budget ?? 0,
    status: 'saved',
    itinerary_data: publicTrip.trips?.itinerary_data,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Increment saves_count
  await sb.from('public_trips').update({ saves_count: (publicTrip.saves_count ?? 0) + 1 }).eq('id', publicTripId);

  return NextResponse.json({ trip: newTrip });
}
