import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );
}

export type NotificationType =
  | 'trip_reminder'
  | 'visa_reminder'
  | 'passport_expiry'
  | 'booking_reminder';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  actionUrl?: string
): Promise<void> {
  const sb = getSupabase();
  await sb.from('notifications').insert({ user_id: userId, type, title, body, action_url: actionUrl });
}

// Called after saving a trip — generates reminder notifications
export async function generateTripNotifications(
  userId: string,
  tripId: string,
  destination: string,
  departureDate: string,
  visaRequired: boolean,
  shareToken?: string
): Promise<void> {
  const now = new Date();
  const departure = new Date(departureDate);
  const daysUntil = Math.floor((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const actionUrl = shareToken ? `/trip/${shareToken}` : `/dashboard`;

  if (daysUntil <= 7 && daysUntil > 0) {
    await createNotification(
      userId, 'trip_reminder',
      `${destination} in ${daysUntil} day${daysUntil === 1 ? '' : 's'}! ✈️`,
      `Your trip to ${destination} is coming up. Check your bookings and packing list.`,
      actionUrl
    );
  }

  if (visaRequired && daysUntil <= 30 && daysUntil > 0) {
    await createNotification(
      userId, 'visa_reminder',
      `Visa reminder for ${destination}`,
      `Your trip is in ${daysUntil} days. Make sure your visa application is in order.`,
      actionUrl
    );
  }
}

// Called after adding a document — checks passport expiry against upcoming trips
export async function checkPassportExpiry(
  userId: string,
  passportExpiry: string
): Promise<void> {
  const sb = getSupabase();
  const expiry = new Date(passportExpiry);

  const { data: trips } = await sb
    .from('trips')
    .select('destination, dates, share_token')
    .eq('user_id', userId)
    .eq('status', 'saved');

  for (const trip of trips ?? []) {
    const departureDateStr = trip.dates?.split(' - ')[0];
    if (!departureDateStr) continue;
    const departure = new Date(departureDateStr);
    const monthsBeforeExpiry = (expiry.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsBeforeExpiry < 6) {
      await createNotification(
        userId, 'passport_expiry',
        `Passport expiring soon — ${trip.destination} trip at risk`,
        `Your passport expires within 6 months of your ${trip.destination} trip. Many countries require 6 months validity.`,
        trip.share_token ? `/trip/${trip.share_token}` : '/profile/documents'
      );
    }
  }
}
