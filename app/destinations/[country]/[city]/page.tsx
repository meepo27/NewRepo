import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Calendar, DollarSign, ArrowRight, Plane, Hotel, Activity } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '@/lib/countryUtils';
import { getDestinationData } from '@/data/destinations';

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function fromSlug(s: string) {
  return s.replace(/-/g, ' ');
}

export async function generateStaticParams() {
  return POPULAR_DESTINATIONS.map((d) => ({
    country: toSlug(d.country),
    city: toSlug(d.city),
  }));
}

interface Props {
  params: Promise<{ country: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city } = await params;
  const cityName = fromSlug(city).replace(/\b\w/g, (c) => c.toUpperCase());
  const countryName = fromSlug(country).replace(/\b\w/g, (c) => c.toUpperCase());

  const dest = POPULAR_DESTINATIONS.find(
    (d) => toSlug(d.city) === city && toSlug(d.country) === country
  );
  const data = dest ? getDestinationData(dest.city, dest.countryCode) : null;

  const title = data
    ? `${cityName} Travel Guide — Best Time, Budget & Things To Do | Driftplan`
    : `${cityName}, ${countryName} Travel Guide | Driftplan`;

  const description = data
    ? data.overview.slice(0, 160)
    : `Plan your trip to ${cityName}, ${countryName} with AI. Get a personalised itinerary, budget breakdown, and local tips in seconds.`;

  const ogImage = dest
    ? `https://source.unsplash.com/1200x630/?${encodeURIComponent(data?.heroUnsplashQuery ?? cityName)}`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: cityName }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: `/destinations/${country}/${city}`,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { country, city } = await params;

  const dest = POPULAR_DESTINATIONS.find(
    (d) => toSlug(d.city) === city && toSlug(d.country) === country
  );

  if (!dest) notFound();

  const data = getDestinationData(dest.city, dest.countryCode);
  const cityDisplay = dest.city;
  const countryDisplay = dest.country;

  const heroQuery = data?.heroUnsplashQuery ?? cityDisplay;
  const heroUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(heroQuery)}`;

  const planCTA = `/?start=${encodeURIComponent(`I want to visit ${cityDisplay}`)}`;

  // Affiliate links — TODO_AFFILIATE_TAG: replace with tracked partner links
  const skyscannerUrl = `https://www.skyscanner.net/transport/flights/anywhere/${dest.iata}/?adults=1`;
  const bookingUrl = `https://www.booking.com/city/${dest.countryCode.toLowerCase()}/${toSlug(cityDisplay)}.html?aid=TODO_AFFILIATE_TAG`;
  const gygUrl = `https://www.getyourguide.com/${toSlug(cityDisplay)}-l${dest.iata}/?partner_id=TODO_AFFILIATE_TAG`;

  const budgetLow = data?.budgetRange.low ?? 50;
  const budgetHigh = data?.budgetRange.high ?? 150;
  const currency = data?.budgetRange.currency ?? 'USD';

  const activities = data?.topActivities ?? [
    `Explore ${cityDisplay} city centre`,
    `Visit local museums and cultural sites`,
    `Try authentic local cuisine`,
    `Day trip to nearby attractions`,
    `Shop at local markets`,
  ];

  const bestTime = data?.bestTime ?? 'Check local weather guides for the best travel window';
  const overview = data?.overview ?? `${cityDisplay} is a vibrant destination in ${countryDisplay} with a rich blend of culture, history, and local experiences. Visitors enjoy its unique atmosphere, world-class dining, and a wide range of activities suited to every type of traveller.`;

  return (
    <main className="min-h-dvh bg-[#0A0F1E] text-white">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroUrl}
          alt={`${cityDisplay} travel guide`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#0A0F1E]" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 text-amber-400/80 text-sm mb-2">
            <MapPin size={12} />
            <span>{countryDisplay}</span>
          </div>
          <h1 className="text-white font-bold text-3xl sm:text-4xl">{cityDisplay}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* CTA */}
        <Link
          href={planCTA}
          className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-amber-400 text-black font-bold text-base hover:bg-amber-300 transition-colors"
        >
          <span>Plan your {cityDisplay} trip with AI →</span>
          <ArrowRight size={18} />
        </Link>

        {/* Overview */}
        <section>
          <h2 className="text-white font-semibold text-lg mb-3">About {cityDisplay}</h2>
          <p className="text-white/70 leading-relaxed text-sm">{overview}</p>
        </section>

        {/* Quick facts */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-[#141929] border border-white/8 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-amber-400" />
              <span className="text-white/40 text-xs">Best time to visit</span>
            </div>
            <p className="text-white text-sm font-medium">{bestTime}</p>
          </div>
          <div className="bg-[#141929] border border-white/8 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-amber-400" />
              <span className="text-white/40 text-xs">Daily budget</span>
            </div>
            <p className="text-white text-sm font-medium">{currency} {budgetLow}–{budgetHigh}</p>
            <p className="text-white/40 text-xs">per person per day</p>
          </div>
        </section>

        {/* Top 5 things to do */}
        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Top 5 things to do</h2>
          <ol className="space-y-3">
            {activities.slice(0, 5).map((activity, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-400/15 text-amber-400 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-white/80 text-sm leading-relaxed">{activity}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Budget breakdown */}
        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Average daily budget</h2>
          <div className="bg-[#141929] border border-white/8 rounded-xl overflow-hidden">
            {[
              { label: 'Budget traveller', low: Math.round(budgetLow * 0.6), high: budgetLow, icon: '🎒' },
              { label: 'Mid-range', low: budgetLow, high: budgetHigh, icon: '✈️' },
              { label: 'Comfortable / luxury', low: budgetHigh, high: Math.round(budgetHigh * 2), icon: '🏨' },
            ].map(({ label, low, high, icon }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-white/70 text-sm">{label}</span>
                </div>
                <span className="text-white font-medium text-sm">{currency} {low}–{high}/day</span>
              </div>
            ))}
          </div>
        </section>

        {/* Useful links */}
        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Book your trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={skyscannerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#141929] border border-white/8 hover:border-amber-400/30 hover:bg-[#1c2438] transition-colors"
            >
              <Plane size={16} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Flights</p>
                <p className="text-white/40 text-xs">Search on Skyscanner</p>
              </div>
            </a>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#141929] border border-white/8 hover:border-amber-400/30 hover:bg-[#1c2438] transition-colors"
            >
              <Hotel size={16} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Hotels</p>
                <p className="text-white/40 text-xs">Browse on Booking.com</p>
              </div>
            </a>
            <a
              href={gygUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#141929] border border-white/8 hover:border-amber-400/30 hover:bg-[#1c2438] transition-colors"
            >
              <Activity size={16} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Activities</p>
                <p className="text-white/40 text-xs">Find on GetYourGuide</p>
              </div>
            </a>
          </div>
        </section>

        {/* Repeat CTA at bottom */}
        <Link
          href={planCTA}
          className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-amber-400 text-black font-bold text-base hover:bg-amber-300 transition-colors"
        >
          Plan your {cityDisplay} trip with AI →
        </Link>

        <p className="text-center text-white/20 text-xs pb-4">
          Powered by Driftplan · AI-generated itineraries in seconds
        </p>
      </div>
    </main>
  );
}
