import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { generateShareToken } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { destination, startDate, endDate, travelers, budget, currency, itinerary } = body;

    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        destination,
        dates: `${startDate}:${endDate}`,
        travelers,
        budget,
        status: 'saved',
        itinerary_data: itinerary,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ trip: data });
  } catch (err) {
    console.error('/api/trips POST error:', err);
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ trips: data });
  } catch (err) {
    console.error('/api/trips GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}
