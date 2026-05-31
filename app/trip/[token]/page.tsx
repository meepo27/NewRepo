import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SharedItineraryView } from '@/components/itinerary/SharedItineraryView';
import type { Itinerary } from '@/types';

export const dynamic = 'force-dynamic';

async function getSharedTrip(token: string) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return supabase
    .from('trips')
    .select('*')
    .eq('share_token', token)
    .eq('status', 'shared')
    .single();
}

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  try {
    const { data } = await getSharedTrip(token);
    return {
      title: data ? `${data.destination} Trip — Driftplan` : 'Shared Trip — Driftplan',
    };
  } catch {
    return { title: 'Shared Trip — Driftplan' };
  }
}

export default async function SharedTripPage({ params }: Props) {
  const { token } = await params;
  const { data, error } = await getSharedTrip(token);

  if (error || !data) notFound();

  const itinerary = data.itinerary_data as Itinerary;
  return <SharedItineraryView itinerary={itinerary} destination={data.destination} />;
}
