import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { tripId, inviteeEmails, role = 'viewer' } = await request.json();
  if (!tripId || !inviteeEmails?.length) {
    return NextResponse.json({ error: 'tripId and inviteeEmails required' }, { status: 400 });
  }

  // Verify trip ownership
  const { data: trip } = await sb.from('trips').select('id, destination, share_token').eq('id', tripId).eq('user_id', user.id).single();
  if (!trip) return NextResponse.json({ error: 'trip not found or unauthorized' }, { status: 404 });

  // Insert collaborator records
  const inserts = inviteeEmails.map((email: string) => ({
    trip_id: tripId,
    user_email: email,
    role,
    invite_status: 'pending',
  }));

  const { error } = await sb.from('trip_collaborators').upsert(inserts, { onConflict: 'trip_id,user_email' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send invite emails via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const { Resend } = await import('resend');
    const resend = new Resend(resendKey);
    const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/trip/${trip.share_token}/join`;

    await Promise.allSettled(
      inviteeEmails.map((email: string) =>
        resend.emails.send({
          from: 'Driftplan <noreply@driftplan.app>',
          to: email,
          subject: `You're invited to plan a trip to ${trip.destination}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0A0F1E;color:#fff;padding:32px;border-radius:12px">
              <h2 style="color:#F59E0B">You've been invited to a trip! ✈️</h2>
              <p style="color:#CBD5E1">Someone is planning a trip to <strong>${trip.destination}</strong> and wants you to collaborate.</p>
              <a href="${joinUrl}" style="display:inline-block;background:#F59E0B;color:#000;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Join Trip →</a>
              <p style="color:#64748B;font-size:12px;margin-top:24px">Powered by Driftplan</p>
            </div>
          `,
        })
      )
    );
  }

  return NextResponse.json({ invited: inviteeEmails.length });
}
