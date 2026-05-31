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

    const { tripId } = await req.json();
    const token = generateShareToken();

    const { data, error } = await supabase
      .from('trips')
      .update({ status: 'shared', share_token: token })
      .eq('id', tripId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ shareToken: token, trip: data });
  } catch (err) {
    console.error('/api/trips/share error:', err);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}
