// TODO_AFFILIATE_TAG — replace placeholder values with real partner credentials
// before going to production.

const SKYSCANNER_AFFILIATE = 'TODO_AFFILIATE_TAG';
const BOOKING_AFFILIATE_ID = 'TODO_AFFILIATE_TAG';
const MMT_AFFILIATE = 'TODO_AFFILIATE_TAG';
const AIRBNB_AFFILIATE = 'TODO_AFFILIATE_TAG';

// ─── Skyscanner ──────────────────────────────────────────────────────────────────

export function getSkyscannerLink(
  fromIATA: string,
  toIATA: string,
  date: string,
  passengers: number = 1
): string {
  const d = date.replace(/-/g, '');
  const params: Record<string, string> = { adultsv2: String(passengers), cabinclass: 'economy' };
  if (SKYSCANNER_AFFILIATE !== 'TODO_AFFILIATE_TAG') params.associateid = SKYSCANNER_AFFILIATE;
  return `https://www.skyscanner.com/transport/flights/${fromIATA.toUpperCase()}/${toIATA.toUpperCase()}/${d}/?${new URLSearchParams(params)}`;
}

// ─── Booking.com ─────────────────────────────────────────────────────────────────

export function getBookingComLink(
  destination: string,
  checkin: string,
  checkout: string,
  adults: number = 2,
  children: number = 0
): string {
  const p: Record<string, string> = {
    ss: destination, checkin, checkout,
    group_adults: String(adults), group_children: String(children), no_rooms: '1',
  };
  if (BOOKING_AFFILIATE_ID !== 'TODO_AFFILIATE_TAG') p.aid = BOOKING_AFFILIATE_ID;
  return `https://www.booking.com/searchresults.html?${new URLSearchParams(p)}`;
}

// ─── Airbnb ──────────────────────────────────────────────────────────────────────

export function getAirbnbLink(
  destination: string,
  checkin: string,
  checkout: string,
  adults: number = 2
): string {
  const p: Record<string, string> = { checkin, checkout, adults: String(adults) };
  if (AIRBNB_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.af_id = AIRBNB_AFFILIATE;
  return `https://www.airbnb.com/s/${encodeURIComponent(destination)}/homes?${new URLSearchParams(p)}`;
}

// ─── MakeMyTrip flights ──────────────────────────────────────────────────────────

export function getMakemytripFlightLink(
  fromIATA: string,
  toIATA: string,
  date: string,
  adults: number = 1,
  children: number = 0
): string {
  const p: Record<string, string> = {
    itinerary: `${fromIATA}-${toIATA}-${date.replace(/-/g, '')}`,
    paxType: `A-${adults}_C-${children}_I-0`,
    tripType: 'O', cabinClass: 'E', lang: 'eng',
  };
  if (MMT_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.utm_source = MMT_AFFILIATE;
  return `https://www.makemytrip.com/flights/international-listing/search?${new URLSearchParams(p)}`;
}

// ─── MakeMyTrip hotels ───────────────────────────────────────────────────────────

export function getMakemytripHotelLink(
  destination: string,
  checkin: string,
  checkout: string,
  rooms: number = 1
): string {
  const params = new URLSearchParams({
    city: destination,
    checkin: checkin.replace(/-/g, '').slice(2),
    checkout: checkout.replace(/-/g, '').slice(2),
    roomCount: String(rooms),
    lang: 'eng',
  });
  return `https://www.makemytrip.com/hotels/hotel-listing/?${params}`;
}

// ─── Platform registry ───────────────────────────────────────────────────────────

export const BOOKING_PLATFORMS = [
  {
    id: 'skyscanner',
    name: 'Skyscanner',
    logo: '✈️',
    baseUrl: 'https://www.skyscanner.com',
    type: 'flights',
  },
  {
    id: 'booking',
    name: 'Booking.com',
    logo: '🏨',
    baseUrl: 'https://www.booking.com',
    type: 'hotels',
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    logo: '🏠',
    baseUrl: 'https://www.airbnb.com',
    type: 'hotels',
  },
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    logo: '🧳',
    baseUrl: 'https://www.makemytrip.com',
    type: 'flights+hotels',
  },
] as const;

export type BookingPlatformId = (typeof BOOKING_PLATFORMS)[number]['id'];

// Legacy exports kept for backward compat with existing components
export { getSkyscannerLink as getSkyscannerFlightUrl };
export { getBookingComLink as getBookingHotelUrl };
export { getMakemytripFlightLink as getMakeMyTripFlightUrl };

export const EMBASSY_URLS: Record<string, string> = {
  Thailand: 'https://thaiembassy.in/',
  Japan: 'https://www.in.emb-japan.go.jp/itprtop_en/index.html',
  Indonesia: 'https://kemlu.go.id/newdelhi/en',
  Vietnam: 'https://vietnamembassy.in/',
  Singapore: 'https://www.mfa.gov.sg/newdelhi',
  France: 'https://in.ambafrance.org/',
  Italy: 'https://ambmewdelhi.esteri.it/en/',
  Spain: 'https://www.exteriores.gob.es/Embajadas/nuevadelhi/en/Embajada/Pages/inicio.aspx',
  Greece: 'https://www.mfa.gr/newdelhi/',
  Portugal: 'https://newdelhi.embaixadaportugal.mfa.pt/en/',
  UAE: 'https://www.uaeembassyindia.com/',
  Maldives: 'https://www.maldiveshighcommission.org/',
  'Sri Lanka': 'https://www.srilankahighcommission.in/',
  Nepal: 'https://in.nepalembassy.gov.np/',
  Bhutan: 'https://www.rcbnd.gov.bt/',
};
