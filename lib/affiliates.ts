import type { BookingPlatform, TrainLinkResult, ActivityLinksResult } from '@/types/planning';

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

// TODO_AFFILIATE_TAG — additional partner credentials for hotels, activities, trains
const AGODA_AFFILIATE = 'TODO_AFFILIATE_TAG';
const HOSTELWORLD_AFFILIATE = 'TODO_AFFILIATE_TAG';
const HOTELSCOM_AFFILIATE = 'TODO_AFFILIATE_TAG';
// TODO_AFFILIATE_TAG — activity platform affiliate IDs
const GYG_AFFILIATE = 'TODO_AFFILIATE_TAG';
const KLOOK_AFFILIATE = 'TODO_AFFILIATE_TAG';
const VIATOR_AFFILIATE = 'TODO_AFFILIATE_TAG';

// ─── Additional hotel booking links ──────────────────────────────────────────────

// TODO_AFFILIATE_TAG: https://www.agoda.com/partners/partnersearch.aspx
export function getAgodaLink(
  destination: string,
  checkin: string,
  checkout: string,
  adults: number = 2
): string {
  const p: Record<string, string> = {
    city: destination,
    checkIn: checkin,
    checkOut: checkout,
    adults: String(adults),
    rooms: '1',
  };
  if (AGODA_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.cid = AGODA_AFFILIATE;
  return `https://www.agoda.com/search?${new URLSearchParams(p)}`;
}

// TODO_AFFILIATE_TAG: https://www.hostelworld.com/en-gb/affiliate-program
export function getHostelworldLink(
  destination: string,
  checkin: string,
  checkout: string,
  guests: number = 1
): string {
  const p: Record<string, string> = {
    search_keywords: destination,
    date_from: checkin,
    date_to: checkout,
    number_of_guests: String(guests),
  };
  if (HOSTELWORLD_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.affid = HOSTELWORLD_AFFILIATE;
  return `https://www.hostelworld.com/search?${new URLSearchParams(p)}`;
}

// TODO_AFFILIATE_TAG: https://www.hotels.com/affiliate-program
export function getHotelsComLink(
  destination: string,
  checkin: string,
  checkout: string,
  adults: number = 2
): string {
  const p: Record<string, string> = {
    'q-destination': destination,
    'q-check-in': checkin,
    'q-check-out': checkout,
    'q-rooms': '1',
    'q-room-0-adults': String(adults),
  };
  if (HOTELSCOM_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.affid = HOTELSCOM_AFFILIATE;
  return `https://www.hotels.com/search.do?${new URLSearchParams(p)}`;
}

// ─── Train booking links ──────────────────────────────────────────────────────────

const TRAIN_PROVIDER_MAP: Record<string, { countryName: string; providerName: string }> = {
  IN: { countryName: 'India', providerName: 'IRCTC' },
  GB: { countryName: 'United Kingdom', providerName: 'National Rail' },
  FR: { countryName: 'France', providerName: 'SNCF Connect' },
  DE: { countryName: 'Germany', providerName: 'Deutsche Bahn' },
  IT: { countryName: 'Italy', providerName: 'Trenitalia' },
  ES: { countryName: 'Spain', providerName: 'Renfe' },
  JP: { countryName: 'Japan', providerName: 'JR Pass' },
  TH: { countryName: 'Thailand', providerName: 'State Railway of Thailand' },
  MY: { countryName: 'Malaysia', providerName: 'KTM Berhad' },
  SG: { countryName: 'Singapore', providerName: 'N/A' },
  AU: { countryName: 'Australia', providerName: 'Journey Beyond Rail' },
  NZ: { countryName: 'New Zealand', providerName: 'KiwiRail' },
  US: { countryName: 'United States', providerName: 'Amtrak' },
  CA: { countryName: 'Canada', providerName: 'VIA Rail' },
};

export function getTrainLink(
  fromCity: string,
  toCity: string,
  date: string,
  countryCode: string,
  passengers: number = 1
): TrainLinkResult {
  const code = countryCode.toUpperCase();
  const from = encodeURIComponent(fromCity);
  const to = encodeURIComponent(toCity);

  switch (code) {
    case 'IN':
      return {
        // TODO_AFFILIATE_TAG: IRCTC does not have a public affiliate program
        primaryLink: 'https://www.irctc.co.in/nget/train-search',
        alternateLink: `https://www.confirmtkt.com/train-between-stations?from=${from}&to=${to}&date=${date}`,
        providerName: 'IRCTC',
        countryName: 'India',
      };
    case 'GB':
      return {
        // TODO_AFFILIATE_TAG: https://www.thetrainline.com/affiliate-programme
        primaryLink: 'https://www.nationalrail.co.uk/',
        alternateLink: `https://www.thetrainline.com/book/trains?origin=${from}&destination=${to}&outwardDate=${date}`,
        providerName: 'National Rail',
        countryName: 'United Kingdom',
      };
    case 'FR':
      return {
        // TODO_AFFILIATE_TAG: https://www.thetrainline.com/affiliate-programme
        primaryLink: 'https://www.sncf-connect.com/',
        alternateLink: `https://www.thetrainline.com/book/trains?origin=${from}&destination=${to}&outwardDate=${date}`,
        providerName: 'SNCF Connect',
        countryName: 'France',
      };
    case 'DE':
      return {
        // TODO_AFFILIATE_TAG: Deutsche Bahn partner program contact
        primaryLink: `https://www.bahn.de/buchung/fahrplan/suche`,
        alternateLink: null,
        providerName: 'Deutsche Bahn',
        countryName: 'Germany',
      };
    case 'IT':
      return {
        // TODO_AFFILIATE_TAG: Trenitalia / Italo partner programs
        primaryLink: 'https://www.trenitalia.com/en.html',
        alternateLink: 'https://www.italotreno.it/en',
        providerName: 'Trenitalia',
        countryName: 'Italy',
      };
    case 'ES':
      return {
        // TODO_AFFILIATE_TAG: Renfe does not have a public affiliate program
        primaryLink: 'https://www.renfe.com/es/en',
        alternateLink: null,
        providerName: 'Renfe',
        countryName: 'Spain',
      };
    case 'JP':
      return {
        // TODO_AFFILIATE_TAG: JR Pass reseller programs available
        primaryLink: 'https://www.japanrailpass.net/en/',
        alternateLink: 'https://www.hyperdia.com/',
        providerName: 'JR Pass',
        countryName: 'Japan',
      };
    case 'TH':
      return {
        // TODO_AFFILIATE_TAG: 12Go Asia affiliate program
        primaryLink: 'https://www.thairailwayticket.com/',
        alternateLink: 'https://12go.asia/en/train',
        providerName: 'State Railway of Thailand',
        countryName: 'Thailand',
      };
    case 'MY':
      return {
        // TODO_AFFILIATE_TAG: KTM Berhad / 12Go Asia
        primaryLink: 'https://www.ktmb.com.my/',
        alternateLink: 'https://12go.asia/en/train',
        providerName: 'KTM Berhad',
        countryName: 'Malaysia',
      };
    case 'SG':
      return {
        primaryLink: 'https://12go.asia/en/train',
        alternateLink: null,
        providerName: 'N/A — no intercity trains in Singapore',
        countryName: 'Singapore',
      };
    case 'AU':
      return {
        // TODO_AFFILIATE_TAG: Journey Beyond contact for trade partnerships
        primaryLink: 'https://www.journeybeyondrail.com.au/',
        alternateLink: 'https://12go.asia/en/train',
        providerName: 'Journey Beyond Rail',
        countryName: 'Australia',
      };
    case 'NZ':
      return {
        // TODO_AFFILIATE_TAG: KiwiRail trade partnerships
        primaryLink: 'https://www.kiwirail.co.nz/',
        alternateLink: null,
        providerName: 'KiwiRail',
        countryName: 'New Zealand',
      };
    case 'US':
      return {
        // TODO_AFFILIATE_TAG: Amtrak affiliate program
        primaryLink: 'https://www.amtrak.com/',
        alternateLink: null,
        providerName: 'Amtrak',
        countryName: 'United States',
      };
    case 'CA':
      return {
        // TODO_AFFILIATE_TAG: VIA Rail affiliate program
        primaryLink: 'https://www.viarail.ca/en',
        alternateLink: null,
        providerName: 'VIA Rail',
        countryName: 'Canada',
      };
    default: {
      // Default: Trainline for Europe, 12Go for Asia
      const asiaSet = new Set(['TH', 'MY', 'VN', 'KH', 'ID', 'PH', 'TW', 'KR', 'CN', 'HK', 'MO', 'MM', 'LA', 'BD', 'LK', 'NP']);
      const primary = asiaSet.has(code)
        ? 'https://12go.asia/en/train'
        : `https://www.thetrainline.com/book/trains?origin=${from}&destination=${to}&outwardDate=${date}`;
      const alternate = asiaSet.has(code) ? null : 'https://12go.asia/en/train';
      return {
        // TODO_AFFILIATE_TAG: Trainline affiliate / 12Go affiliate programs
        primaryLink: primary,
        alternateLink: alternate,
        providerName: asiaSet.has(code) ? '12Go Asia' : 'Trainline',
        countryName: code,
      };
    }
  }
}

export function getSupportedTrainCountries(): Array<{
  countryCode: string;
  countryName: string;
  providerName: string;
}> {
  return Object.entries(TRAIN_PROVIDER_MAP).map(([countryCode, info]) => ({
    countryCode,
    countryName: info.countryName,
    providerName: info.providerName,
  }));
}

// ─── Bus booking links ────────────────────────────────────────────────────────────

const EU_CODES = new Set([
  'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CZ', 'PL', 'PT',
  'GR', 'HU', 'HR', 'SE', 'NO', 'DK', 'FI', 'IE', 'SK', 'SI',
  'RO', 'BG', 'LT', 'LV', 'EE', 'LU', 'CY', 'MT', 'CH',
]);

// TODO_AFFILIATE_TAG: redBus, 12Go Asia, FlixBus, National Express, Greyhound affiliate programs
export function getBusLink(
  fromCity: string,
  toCity: string,
  _date: string,
  countryCode: string
): string {
  const code = countryCode.toUpperCase();

  if (code === 'IN') {
    return `https://www.redbus.in/bus-tickets/${encodeURIComponent(fromCity.toLowerCase())}-to-${encodeURIComponent(toCity.toLowerCase())}`;
  }
  if (['MY', 'TH', 'SG', 'VN', 'ID'].includes(code)) {
    return 'https://12go.asia/en/bus';
  }
  if (code === 'GB') {
    return 'https://www.nationalexpress.com/en';
  }
  if (code === 'US') {
    return 'https://www.greyhound.com/';
  }
  if (EU_CODES.has(code)) {
    return 'https://www.flixbus.com/';
  }
  return 'https://www.flixbus.com/';
}

// ─── Activity booking links ───────────────────────────────────────────────────────

const GYG_CATEGORY_MAP: Record<string, string> = {
  tours: 'tours',
  museums: 'museums',
  'day-trips': 'day-trips',
  outdoor: 'outdoor',
  'food-drink': 'food-drink',
  cruises: 'cruises',
  transfers: 'transfers',
  workshops: 'workshops',
};

// TODO_AFFILIATE_TAG: https://partner.getyourguide.com/
export function getGetYourGuideLink(destination: string, activityType?: string): string {
  const p: Record<string, string> = { q: destination };
  if (activityType && GYG_CATEGORY_MAP[activityType]) {
    p.categories = GYG_CATEGORY_MAP[activityType];
  }
  if (GYG_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.partner_id = GYG_AFFILIATE;
  return `https://www.getyourguide.com/s/?${new URLSearchParams(p)}`;
}

// TODO_AFFILIATE_TAG: https://www.viator.com/partner
export function getViatorLink(destination: string, activityType?: string): string {
  const p: Record<string, string> = {};
  if (activityType) p.categories = activityType;
  if (VIATOR_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.mcid = VIATOR_AFFILIATE;
  const qs = new URLSearchParams(p).toString();
  const slug = encodeURIComponent(destination.toLowerCase().replace(/\s+/g, '-'));
  return `https://www.viator.com/search/${slug}/${qs ? `?${qs}` : ''}`;
}

// TODO_AFFILIATE_TAG: https://affiliate.klook.com/
export function getKlookLink(destination: string, activityType?: string): string {
  const p: Record<string, string> = { query: destination };
  if (activityType) p.categoryId = activityType;
  if (KLOOK_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.aid = KLOOK_AFFILIATE;
  return `https://www.klook.com/en-IN/search/?${new URLSearchParams(p)}`;
}

// TODO_AFFILIATE_TAG: Airbnb affiliate program (same AIRBNB_AFFILIATE)
export function getAirbnbExperiencesLink(destination: string, checkin?: string): string {
  const p: Record<string, string> = {};
  if (checkin) p.checkin = checkin;
  if (AIRBNB_AFFILIATE !== 'TODO_AFFILIATE_TAG') p.af_id = AIRBNB_AFFILIATE;
  const qs = new URLSearchParams(p).toString();
  return `https://www.airbnb.com/s/${encodeURIComponent(destination)}/experiences${qs ? `?${qs}` : ''}`;
}

const ASIA_COUNTRY_CODES = new Set([
  'TH', 'JP', 'SG', 'MY', 'ID', 'VN', 'KR', 'HK', 'PH', 'TW',
  'MO', 'KH', 'LA', 'MM', 'BD', 'LK', 'NP', 'BT', 'MV',
]);

export function getMasterActivityLink(
  destination: string,
  countryCode: string,
  activityType?: string
): ActivityLinksResult {
  const code = countryCode.toUpperCase();

  const klook: BookingPlatform = {
    name: 'Klook',
    url: getKlookLink(destination, activityType),
    logo: '🎫',
    bestFor: 'Best for Asia day trips & experiences',
  };
  const gyg: BookingPlatform = {
    name: 'GetYourGuide',
    url: getGetYourGuideLink(destination, activityType),
    logo: '🎟️',
    bestFor: 'Best for guided tours & skip-the-line tickets',
  };
  const viator: BookingPlatform = {
    name: 'Viator',
    url: getViatorLink(destination, activityType),
    logo: '🗺️',
    bestFor: 'Best for day trips & group excursions',
  };
  const airbnbExp: BookingPlatform = {
    name: 'Airbnb Experiences',
    url: getAirbnbExperiencesLink(destination),
    logo: '🏡',
    bestFor: 'Best for unique local & hosted experiences',
  };

  if (code === 'IN') {
    return { platforms: [klook, gyg, viator, airbnbExp] };
  }
  if (ASIA_COUNTRY_CODES.has(code)) {
    return { platforms: [klook, gyg, viator, airbnbExp] };
  }
  // Europe, Americas, Africa, Middle East
  return { platforms: [gyg, viator, airbnbExp, klook] };
}

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
