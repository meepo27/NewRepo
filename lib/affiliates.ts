// TODO: Replace placeholder affiliate tags with real partner credentials

export function getSkyscannerFlightUrl(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string
): string {
  const from = origin.toUpperCase().replace(/\s/g, '');
  const to = destination.toUpperCase().replace(/\s/g, '');
  const dep = departureDate.replace(/-/g, '');
  const ret = returnDate ? returnDate.replace(/-/g, '') : '';

  const base = `https://www.skyscanner.com/transport/flights/${from}/${to}/${dep}/`;
  const params = new URLSearchParams();
  if (ret) params.set('returndate', ret);
  // TODO: params.set('associateid', 'YOUR_AFFILIATE_TAG');

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function getBookingHotelUrl(destination: string, checkin: string, checkout: string): string {
  const params = new URLSearchParams({
    ss: destination,
    checkin: checkin,
    checkout: checkout,
    // TODO: aid: 'YOUR_BOOKING_AFFILIATE_ID',
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

export function getMakeMyTripFlightUrl(origin: string, destination: string, date: string): string {
  // TODO: Add MakeMyTrip affiliate parameters
  const params = new URLSearchParams({
    itinerary: `${origin}-${destination}-${date}`,
    paxType: 'A-1_C-0_I-0',
    tripType: 'O',
    cabinClass: 'E',
    lang: 'eng',
  });
  return `https://www.makemytrip.com/flights/international-listing/search?${params.toString()}`;
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
