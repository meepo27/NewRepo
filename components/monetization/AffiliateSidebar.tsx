'use client';

import { ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  destination: string;
  country: string;
  travelStyle: string;
  grandTotal: number;
  currency: string;
  passportCountry?: string;
}

async function trackClick(platform: string, destination: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('affiliate_clicks').insert({
      user_id: user?.id ?? null,
      platform,
      destination,
    });
  } catch {}
}

function AffiliateCard({
  emoji, headline, benefit, ctaLabel, href, platform, destination,
}: {
  emoji: string; headline: string; benefit: string; ctaLabel: string;
  href: string; platform: string; destination: string;
}) {
  return (
    <div className="bg-[#141929] border border-white/8 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="text-white font-medium text-sm">{headline}</p>
          <p className="text-white/50 text-xs mt-0.5">{benefit}</p>
        </div>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(platform, destination)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-xs font-medium">
        {ctaLabel} <ExternalLink size={11} />
      </a>
    </div>
  );
}

export function AffiliateSidebar({ destination, country, travelStyle, grandTotal, currency, passportCountry }: Props) {
  const isIndian = passportCountry === 'India' || passportCountry === 'IN';

  return (
    <div className="space-y-3">
      <p className="text-white/30 text-xs uppercase tracking-wide">Travel essentials</p>

      {/* SIM / eSIM */}
      {/* TODO_AFFILIATE_TAG: https://www.airalo.com/affiliate */}
      <AffiliateCard
        emoji="📱"
        headline={`Stay connected in ${destination}`}
        benefit="eSIM — works in 190+ countries, instant activation"
        ctaLabel="Get Airalo eSIM"
        href={`https://www.airalo.com/?selected_country=${encodeURIComponent(country)}`}
        platform="airalo"
        destination={destination}
      />

      {/* Travel Insurance */}
      {/* TODO_AFFILIATE_TAG: PolicyBazaar / World Nomads affiliate programs */}
      <AffiliateCard
        emoji="🛡️"
        headline={`Protect your ${currency} ${grandTotal.toLocaleString()} trip`}
        benefit={isIndian ? 'Compare travel insurance plans instantly' : 'Cover for adventure, medical & cancellation'}
        ctaLabel={isIndian ? 'PolicyBazaar →' : 'World Nomads →'}
        href={isIndian
          ? 'https://www.policybazaar.com/travel-insurance/'
          : 'https://www.worldnomads.com/'}
        platform={isIndian ? 'policybazaar' : 'worldnomads'}
        destination={destination}
      />

      {/* Travel Money */}
      {/* TODO_AFFILIATE_TAG: Niyo / Wise / Scapia affiliate programs */}
      <AffiliateCard
        emoji="💳"
        headline={`Zero forex fees in ${destination}`}
        benefit={isIndian ? 'Niyo Global — no forex markup, accepted worldwide' : 'Wise — mid-market rate, no hidden fees'}
        ctaLabel={isIndian ? 'Get Niyo Card →' : 'Get Wise Card →'}
        href={isIndian ? 'https://www.niyo.com/' : 'https://wise.com/'}
        platform={isIndian ? 'niyo' : 'wise'}
        destination={destination}
      />

      {/* Luggage */}
      {/* TODO_AFFILIATE_TAG: Amazon Associates program */}
      <AffiliateCard
        emoji="🎒"
        headline={`Pack smart for ${destination}`}
        benefit={`${travelStyle} travel gear curated for your style`}
        ctaLabel="Shop on Amazon →"
        href={`https://www.amazon.in/s?k=travel+backpack+${encodeURIComponent(travelStyle)}`}
        platform="amazon"
        destination={destination}
      />
    </div>
  );
}
