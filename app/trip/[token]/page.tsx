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
    if (!data) return { title: 'Shared Trip — Driftplan' };

    const itinerary = data.itinerary_data as { tripSummary?: { duration?: number; travelStyle?: string }; budgetSummary?: { currency?: string } } | null;
    const duration = itinerary?.tripSummary?.duration;
    const title = duration
      ? `${duration}-Day ${data.destination} Itinerary | Driftplan`
      : `${data.destination} Trip Itinerary | Driftplan`;

    const description = `A personalised ${duration ?? ''}-day itinerary for ${data.destination} — hotels, activities, budget breakdown and more. Planned with Driftplan AI.`.trim();

    const ogImageQuery = encodeURIComponent(data.destination);
    const ogImage = `https://source.unsplash.com/1200x630/?${ogImageQuery},travel`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: `${data.destination} trip` }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
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
