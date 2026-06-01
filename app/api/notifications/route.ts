import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ notifications: [] });

  const markRead = request.nextUrl.searchParams.get('markRead') === 'true';

  const { data: notifications } = await sb.from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (markRead && notifications?.length) {
    await sb.from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
  }

  const unreadCount = (notifications ?? []).filter((n) => !n.is_read).length;
  return NextResponse.json({ notifications: notifications ?? [], unreadCount });
}
