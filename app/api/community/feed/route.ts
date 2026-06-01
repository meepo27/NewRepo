import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const destination = searchParams.get('destination');
  const travel_style = searchParams.get('travel_style');
  const budget_tier = searchParams.get('budget_tier');
  const sort = searchParams.get('sort') ?? 'newest';
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  const sb = getSupabase();
  let query = sb.from('public_trips').select('*', { count: 'exact' });

  if (destination) query = query.ilike('destination', `%${destination}%`);
  if (travel_style) query = query.eq('travel_style', travel_style);
  if (budget_tier) query = query.eq('budget_tier', budget_tier);

  if (sort === 'most_saved') {
    query = query.order('saves_count', { ascending: false });
  } else if (sort === 'trending') {
    // Trending = (upvotes + saves_count * 2) / hours — approximate with a recent bias
    query = query.order('upvotes', { ascending: false }).order('saves_count', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    trips: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
