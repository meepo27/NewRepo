// ─── Country name → ISO 3166-1 alpha-2 ───────────────────────────────────────────

export const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  Afghanistan: 'AF', Albania: 'AL', Algeria: 'DZ', Argentina: 'AR',
  Armenia: 'AM', Australia: 'AU', Austria: 'AT', Azerbaijan: 'AZ',
  Bahrain: 'BH', Bangladesh: 'BD', Belgium: 'BE', Bolivia: 'BO',
  Brazil: 'BR', Bulgaria: 'BG', Cambodia: 'KH', Canada: 'CA',
  Chile: 'CL', China: 'CN', Colombia: 'CO', Croatia: 'HR',
  Cuba: 'CU', Cyprus: 'CY', 'Czech Republic': 'CZ', Czechia: 'CZ',
  Denmark: 'DK', Ecuador: 'EC', Egypt: 'EG', Estonia: 'EE',
  Ethiopia: 'ET', Finland: 'FI', France: 'FR', Georgia: 'GE',
  Germany: 'DE', Ghana: 'GH', Greece: 'GR', Guatemala: 'GT',
  'Hong Kong': 'HK', Hungary: 'HU', Iceland: 'IS', India: 'IN',
  Indonesia: 'ID', Iran: 'IR', Iraq: 'IQ', Ireland: 'IE',
  Israel: 'IL', Italy: 'IT', Jamaica: 'JM', Japan: 'JP',
  Jordan: 'JO', Kazakhstan: 'KZ', Kenya: 'KE', Kosovo: 'XK',
  Kuwait: 'KW', Kyrgyzstan: 'KG', Laos: 'LA', Latvia: 'LV',
  Lebanon: 'LB', Lithuania: 'LT', Luxembourg: 'LU', Malaysia: 'MY',
  Maldives: 'MV', Malta: 'MT', Mexico: 'MX', Mongolia: 'MN',
  Montenegro: 'ME', Morocco: 'MA', Mozambique: 'MZ', Myanmar: 'MM',
  Burma: 'MM', Nepal: 'NP', Netherlands: 'NL', 'New Zealand': 'NZ',
  Nigeria: 'NG', 'North Macedonia': 'MK', Norway: 'NO', Oman: 'OM',
  Pakistan: 'PK', Panama: 'PA', Peru: 'PE', Philippines: 'PH',
  Poland: 'PL', Portugal: 'PT', Qatar: 'QA', Romania: 'RO',
  Russia: 'RU', Rwanda: 'RW', 'Saudi Arabia': 'SA', Serbia: 'RS',
  Singapore: 'SG', Slovakia: 'SK', Slovenia: 'SI', 'South Africa': 'ZA',
  'South Korea': 'KR', Korea: 'KR', Spain: 'ES', 'Sri Lanka': 'LK',
  Sweden: 'SE', Switzerland: 'CH', Taiwan: 'TW', Tajikistan: 'TJ',
  Tanzania: 'TZ', Thailand: 'TH', Tunisia: 'TN', Turkey: 'TR',
  Turkiye: 'TR', Uganda: 'UG', Ukraine: 'UA', UAE: 'AE',
  'United Arab Emirates': 'AE', 'United Kingdom': 'GB', UK: 'GB',
  'United States': 'US', USA: 'US', 'United States of America': 'US',
  Uruguay: 'UY', Uzbekistan: 'UZ', Venezuela: 'VE', Vietnam: 'VN',
  Zambia: 'ZM', Zimbabwe: 'ZW',
};

// ─── ISO code → currency code ─────────────────────────────────────────────────────

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  AE: 'AED', AF: 'AFN', AL: 'ALL', AM: 'AMD', AR: 'ARS',
  AT: 'EUR', AU: 'AUD', AZ: 'AZN', BD: 'BDT', BE: 'EUR',
  BG: 'BGN', BH: 'BHD', BO: 'BOB', BR: 'BRL', CA: 'CAD',
  CH: 'CHF', CL: 'CLP', CN: 'CNY', CO: 'COP', CY: 'EUR',
  CZ: 'CZK', DE: 'EUR', DK: 'DKK', EC: 'USD', EE: 'EUR',
  EG: 'EGP', ES: 'EUR', ET: 'ETB', FI: 'EUR', FR: 'EUR',
  GB: 'GBP', GE: 'GEL', GH: 'GHS', GR: 'EUR', GT: 'GTQ',
  HK: 'HKD', HR: 'EUR', HU: 'HUF', ID: 'IDR', IE: 'EUR',
  IL: 'ILS', IN: 'INR', IQ: 'IQD', IR: 'IRR', IS: 'ISK',
  IT: 'EUR', JM: 'JMD', JO: 'JOD', JP: 'JPY', KE: 'KES',
  KH: 'USD', KR: 'KRW', KW: 'KWD', KZ: 'KZT', LA: 'LAK',
  LB: 'LBP', LK: 'LKR', LT: 'EUR', LU: 'EUR', LV: 'EUR',
  MA: 'MAD', ME: 'EUR', MK: 'MKD', MM: 'MMK', MN: 'MNT',
  MT: 'EUR', MV: 'MVR', MX: 'MXN', MY: 'MYR', MZ: 'MZN',
  NG: 'NGN', NL: 'EUR', NO: 'NOK', NP: 'NPR', NZ: 'NZD',
  OM: 'OMR', PA: 'USD', PE: 'PEN', PH: 'PHP', PK: 'PKR',
  PL: 'PLN', PT: 'EUR', QA: 'QAR', RO: 'RON', RS: 'RSD',
  RU: 'RUB', RW: 'RWF', SA: 'SAR', SE: 'SEK', SG: 'SGD',
  SI: 'EUR', SK: 'EUR', TH: 'THB', TJ: 'TJS', TN: 'TND',
  TR: 'TRY', TW: 'TWD', TZ: 'TZS', UA: 'UAH', UG: 'UGX',
  US: 'USD', UY: 'UYU', UZ: 'UZS', VE: 'VES', VN: 'VND',
  XK: 'EUR', ZA: 'ZAR', ZM: 'ZMW', ZW: 'ZWL',
};

// ─── ISO code → major airport IATA codes ─────────────────────────────────────────

export const COUNTRY_TO_AIRPORTS: Record<string, string[]> = {
  AE: ['DXB', 'AUH', 'SHJ'],
  AU: ['SYD', 'MEL', 'BNE', 'PER', 'ADL', 'OOL'],
  AT: ['VIE', 'SZG', 'GRZ'],
  BE: ['BRU', 'CRL', 'LGG'],
  BR: ['GRU', 'GIG', 'BSB', 'SSA', 'FOR', 'CNF'],
  CA: ['YYZ', 'YVR', 'YUL', 'YYC', 'YEG', 'YOW'],
  CH: ['ZRH', 'GVA', 'BSL'],
  CN: ['PEK', 'PVG', 'CAN', 'CTU', 'XIY', 'KMG'],
  CZ: ['PRG', 'BRQ'],
  DE: ['FRA', 'MUC', 'BER', 'DUS', 'HAM', 'STR'],
  DK: ['CPH', 'BLL', 'AAL'],
  EG: ['CAI', 'HRG', 'SSH', 'LXR'],
  ES: ['MAD', 'BCN', 'SVQ', 'VLC', 'AGP', 'IBZ', 'PMI'],
  FI: ['HEL', 'TMP', 'TKU', 'OUL'],
  FR: ['CDG', 'ORY', 'NCE', 'LYS', 'MRS', 'TLS', 'BOD'],
  GB: ['LHR', 'LGW', 'MAN', 'EDI', 'STN', 'LTN', 'BRS', 'GLA'],
  GR: ['ATH', 'SKG', 'HER', 'JTR', 'JMK', 'RHO'],
  HK: ['HKG'],
  HR: ['ZAG', 'DBV', 'SPU', 'ZAD'],
  HU: ['BUD'],
  ID: ['CGK', 'DPS', 'SUB', 'JOG', 'UPG', 'BPN'],
  IE: ['DUB', 'ORK', 'SNN'],
  IN: ['DEL', 'BOM', 'BLR', 'MAA', 'HYD', 'CCU', 'GOI', 'JAI', 'AMD', 'COK', 'PNQ'],
  IS: ['KEF'],
  IT: ['FCO', 'MXP', 'VCE', 'FLR', 'NAP', 'CAG', 'PMO'],
  JP: ['NRT', 'HND', 'KIX', 'ITM', 'CTS', 'FUK', 'NGO'],
  KE: ['NBO', 'MBA'],
  KH: ['PNH', 'SAI', 'KOS'],
  KR: ['ICN', 'GMP', 'PUS', 'CJU'],
  LA: ['VTE', 'LPQ'],
  LK: ['CMB'],
  MA: ['CMN', 'RAK', 'FEZ', 'TNG', 'AGA'],
  MV: ['MLE', 'GAN'],
  MX: ['MEX', 'CUN', 'GDL', 'MTY', 'TLC', 'SJD'],
  MY: ['KUL', 'LGK', 'BKI', 'PEN', 'KCH'],
  NL: ['AMS', 'RTM', 'EIN'],
  NO: ['OSL', 'BGO', 'TRD', 'SVG'],
  NP: ['KTM', 'PKR'],
  NZ: ['AKL', 'CHC', 'WLG', 'ZQN'],
  PE: ['LIM', 'CUZ', 'AQP'],
  PH: ['MNL', 'CEB', 'DVO', 'ILO', 'KLO'],
  PL: ['WAW', 'KRK', 'GDN', 'WRO', 'KTW'],
  PT: ['LIS', 'OPO', 'FAO', 'FNC'],
  QA: ['DOH'],
  RO: ['OTP', 'CLJ', 'TSR'],
  SA: ['RUH', 'JED', 'DMM'],
  SE: ['ARN', 'GOT', 'MMX', 'BMA'],
  SG: ['SIN'],
  TH: ['BKK', 'DMK', 'HKT', 'CNX', 'USM', 'KBV'],
  TR: ['IST', 'SAW', 'AYT', 'ESB', 'ADB'],
  TW: ['TPE', 'KHH', 'RMQ'],
  TZ: ['JRO', 'DAR', 'ZNZ'],
  US: ['JFK', 'LAX', 'ORD', 'SFO', 'MIA', 'ATL', 'DFW', 'SEA', 'BOS', 'LAS'],
  VN: ['SGN', 'HAN', 'DAD', 'PQC', 'VCA'],
  ZA: ['JNB', 'CPT', 'DUR', 'PLZ'],
};

// ─── Popular destinations ─────────────────────────────────────────────────────────

export interface PopularDestination {
  city: string;
  country: string;
  countryCode: string;
  iata: string;
  lat: number;
  lng: number;
}

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  { city: 'Bangkok', country: 'Thailand', countryCode: 'TH', iata: 'BKK', lat: 13.7563, lng: 100.5018 },
  { city: 'Paris', country: 'France', countryCode: 'FR', iata: 'CDG', lat: 48.8566, lng: 2.3522 },
  { city: 'London', country: 'United Kingdom', countryCode: 'GB', iata: 'LHR', lat: 51.5074, lng: -0.1278 },
  { city: 'Dubai', country: 'UAE', countryCode: 'AE', iata: 'DXB', lat: 25.2048, lng: 55.2708 },
  { city: 'Singapore', country: 'Singapore', countryCode: 'SG', iata: 'SIN', lat: 1.3521, lng: 103.8198 },
  { city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', iata: 'KUL', lat: 3.1390, lng: 101.6869 },
  { city: 'New York', country: 'United States', countryCode: 'US', iata: 'JFK', lat: 40.7128, lng: -74.0060 },
  { city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', iata: 'HKG', lat: 22.3193, lng: 114.1694 },
  { city: 'Barcelona', country: 'Spain', countryCode: 'ES', iata: 'BCN', lat: 41.3851, lng: 2.1734 },
  { city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', iata: 'AMS', lat: 52.3676, lng: 4.9041 },
  { city: 'Tokyo', country: 'Japan', countryCode: 'JP', iata: 'NRT', lat: 35.6762, lng: 139.6503 },
  { city: 'Rome', country: 'Italy', countryCode: 'IT', iata: 'FCO', lat: 41.9028, lng: 12.4964 },
  { city: 'Istanbul', country: 'Turkey', countryCode: 'TR', iata: 'IST', lat: 41.0082, lng: 28.9784 },
  { city: 'Prague', country: 'Czech Republic', countryCode: 'CZ', iata: 'PRG', lat: 50.0755, lng: 14.4378 },
  { city: 'Vienna', country: 'Austria', countryCode: 'AT', iata: 'VIE', lat: 48.2082, lng: 16.3738 },
  { city: 'Mumbai', country: 'India', countryCode: 'IN', iata: 'BOM', lat: 19.0760, lng: 72.8777 },
  { city: 'New Delhi', country: 'India', countryCode: 'IN', iata: 'DEL', lat: 28.6139, lng: 77.2090 },
  { city: 'Sydney', country: 'Australia', countryCode: 'AU', iata: 'SYD', lat: -33.8688, lng: 151.2093 },
  { city: 'Melbourne', country: 'Australia', countryCode: 'AU', iata: 'MEL', lat: -37.8136, lng: 144.9631 },
  { city: 'Toronto', country: 'Canada', countryCode: 'CA', iata: 'YYZ', lat: 43.6532, lng: -79.3832 },
  { city: 'Los Angeles', country: 'United States', countryCode: 'US', iata: 'LAX', lat: 34.0522, lng: -118.2437 },
  { city: 'San Francisco', country: 'United States', countryCode: 'US', iata: 'SFO', lat: 37.7749, lng: -122.4194 },
  { city: 'Miami', country: 'United States', countryCode: 'US', iata: 'MIA', lat: 25.7617, lng: -80.1918 },
  { city: 'Bali', country: 'Indonesia', countryCode: 'ID', iata: 'DPS', lat: -8.4095, lng: 115.1889 },
  { city: 'Phuket', country: 'Thailand', countryCode: 'TH', iata: 'HKT', lat: 7.8804, lng: 98.3923 },
  { city: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', iata: 'CNX', lat: 18.7883, lng: 98.9853 },
  { city: 'Hanoi', country: 'Vietnam', countryCode: 'VN', iata: 'HAN', lat: 21.0278, lng: 105.8342 },
  { city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', iata: 'SGN', lat: 10.8231, lng: 106.6297 },
  { city: 'Seoul', country: 'South Korea', countryCode: 'KR', iata: 'ICN', lat: 37.5665, lng: 126.9780 },
  { city: 'Osaka', country: 'Japan', countryCode: 'JP', iata: 'KIX', lat: 34.6937, lng: 135.5023 },
  { city: 'Cairo', country: 'Egypt', countryCode: 'EG', iata: 'CAI', lat: 30.0444, lng: 31.2357 },
  { city: 'Cape Town', country: 'South Africa', countryCode: 'ZA', iata: 'CPT', lat: -33.9249, lng: 18.4241 },
  { city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', iata: 'JNB', lat: -26.2041, lng: 28.0473 },
  { city: 'Marrakech', country: 'Morocco', countryCode: 'MA', iata: 'RAK', lat: 31.6295, lng: -7.9811 },
  { city: 'Lisbon', country: 'Portugal', countryCode: 'PT', iata: 'LIS', lat: 38.7223, lng: -9.1393 },
  { city: 'Athens', country: 'Greece', countryCode: 'GR', iata: 'ATH', lat: 37.9838, lng: 23.7275 },
  { city: 'Budapest', country: 'Hungary', countryCode: 'HU', iata: 'BUD', lat: 47.4979, lng: 19.0402 },
  { city: 'Dubrovnik', country: 'Croatia', countryCode: 'HR', iata: 'DBV', lat: 42.6507, lng: 18.0944 },
  { city: 'Santorini', country: 'Greece', countryCode: 'GR', iata: 'JTR', lat: 36.3932, lng: 25.4615 },
  { city: 'Berlin', country: 'Germany', countryCode: 'DE', iata: 'BER', lat: 52.5200, lng: 13.4050 },
  { city: 'Munich', country: 'Germany', countryCode: 'DE', iata: 'MUC', lat: 48.1351, lng: 11.5820 },
  { city: 'Zurich', country: 'Switzerland', countryCode: 'CH', iata: 'ZRH', lat: 47.3769, lng: 8.5417 },
  { city: 'Oslo', country: 'Norway', countryCode: 'NO', iata: 'OSL', lat: 59.9139, lng: 10.7522 },
  { city: 'Stockholm', country: 'Sweden', countryCode: 'SE', iata: 'ARN', lat: 59.3293, lng: 18.0686 },
  { city: 'Copenhagen', country: 'Denmark', countryCode: 'DK', iata: 'CPH', lat: 55.6761, lng: 12.5683 },
  { city: 'Warsaw', country: 'Poland', countryCode: 'PL', iata: 'WAW', lat: 52.2297, lng: 21.0122 },
  { city: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', iata: 'EDI', lat: 55.9533, lng: -3.1883 },
  { city: 'Dublin', country: 'Ireland', countryCode: 'IE', iata: 'DUB', lat: 53.3498, lng: -6.2603 },
  { city: 'Brussels', country: 'Belgium', countryCode: 'BE', iata: 'BRU', lat: 50.8503, lng: 4.3517 },
  { city: 'Seville', country: 'Spain', countryCode: 'ES', iata: 'SVQ', lat: 37.3891, lng: -5.9845 },
  { city: 'Florence', country: 'Italy', countryCode: 'IT', iata: 'FLR', lat: 43.7696, lng: 11.2558 },
  { city: 'Venice', country: 'Italy', countryCode: 'IT', iata: 'VCE', lat: 45.4408, lng: 12.3155 },
  { city: 'Milan', country: 'Italy', countryCode: 'IT', iata: 'MXP', lat: 45.4654, lng: 9.1859 },
  { city: 'Nice', country: 'France', countryCode: 'FR', iata: 'NCE', lat: 43.7102, lng: 7.2620 },
  { city: 'Maldives', country: 'Maldives', countryCode: 'MV', iata: 'MLE', lat: 4.1755, lng: 73.5093 },
  { city: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', iata: 'CMB', lat: 6.9271, lng: 79.8612 },
  { city: 'Kathmandu', country: 'Nepal', countryCode: 'NP', iata: 'KTM', lat: 27.7172, lng: 85.3240 },
  { city: 'Goa', country: 'India', countryCode: 'IN', iata: 'GOI', lat: 15.4909, lng: 73.8278 },
  { city: 'Jaipur', country: 'India', countryCode: 'IN', iata: 'JAI', lat: 26.9124, lng: 75.7873 },
  { city: 'Kolkata', country: 'India', countryCode: 'IN', iata: 'CCU', lat: 22.5726, lng: 88.3639 },
  { city: 'Bengaluru', country: 'India', countryCode: 'IN', iata: 'BLR', lat: 12.9716, lng: 77.5946 },
  { city: 'Mexico City', country: 'Mexico', countryCode: 'MX', iata: 'MEX', lat: 19.4326, lng: -99.1332 },
  { city: 'Cancun', country: 'Mexico', countryCode: 'MX', iata: 'CUN', lat: 21.1619, lng: -86.8515 },
  { city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', iata: 'EZE', lat: -34.6037, lng: -58.3816 },
  { city: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', iata: 'GIG', lat: -22.9068, lng: -43.1729 },
  { city: 'Nairobi', country: 'Kenya', countryCode: 'KE', iata: 'NBO', lat: -1.2921, lng: 36.8219 },
  { city: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', iata: 'AUH', lat: 24.4539, lng: 54.3773 },
  { city: 'Doha', country: 'Qatar', countryCode: 'QA', iata: 'DOH', lat: 25.2854, lng: 51.5310 },
  { city: 'Taipei', country: 'Taiwan', countryCode: 'TW', iata: 'TPE', lat: 25.0330, lng: 121.5654 },
  { city: 'Manila', country: 'Philippines', countryCode: 'PH', iata: 'MNL', lat: 14.5995, lng: 120.9842 },
  { city: 'Reykjavik', country: 'Iceland', countryCode: 'IS', iata: 'KEF', lat: 64.1466, lng: -21.9426 },
  { city: 'Porto', country: 'Portugal', countryCode: 'PT', iata: 'OPO', lat: 41.1579, lng: -8.6291 },
  { city: 'Krakow', country: 'Poland', countryCode: 'PL', iata: 'KRK', lat: 50.0647, lng: 19.9450 },
  { city: 'Helsinki', country: 'Finland', countryCode: 'FI', iata: 'HEL', lat: 60.1699, lng: 24.9384 },
  { city: 'Lima', country: 'Peru', countryCode: 'PE', iata: 'LIM', lat: -12.0464, lng: -77.0428 },
  { city: 'Vancouver', country: 'Canada', countryCode: 'CA', iata: 'YVR', lat: 49.2827, lng: -123.1207 },
  { city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', iata: 'AKL', lat: -36.8485, lng: 174.7633 },
  { city: 'Hyderabad', country: 'India', countryCode: 'IN', iata: 'HYD', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', country: 'India', countryCode: 'IN', iata: 'MAA', lat: 13.0827, lng: 80.2707 },
  { city: 'Lyon', country: 'France', countryCode: 'FR', iata: 'LYS', lat: 45.7640, lng: 4.8357 },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────────

export interface CountryInfo {
  countryName: string;
  countryCode: string;
  currency: string;
  majorAirports: string[];
}

export function getCountryFromDestination(destinationName: string): CountryInfo | null {
  const normalized = destinationName.trim().toLowerCase();

  // 1. Match by city name in POPULAR_DESTINATIONS
  const byCity = POPULAR_DESTINATIONS.find(
    (d) => d.city.toLowerCase() === normalized
  );
  if (byCity) {
    return {
      countryName: byCity.country,
      countryCode: byCity.countryCode,
      currency: COUNTRY_TO_CURRENCY[byCity.countryCode] ?? 'USD',
      majorAirports: COUNTRY_TO_AIRPORTS[byCity.countryCode] ?? [byCity.iata],
    };
  }

  // 2. Match by country name in COUNTRY_NAME_TO_CODE
  const countryNameKey = Object.keys(COUNTRY_NAME_TO_CODE).find(
    (k) => k.toLowerCase() === normalized
  );
  if (countryNameKey) {
    const code = COUNTRY_NAME_TO_CODE[countryNameKey];
    const canonical = POPULAR_DESTINATIONS.find((d) => d.countryCode === code);
    return {
      countryName: countryNameKey,
      countryCode: code,
      currency: COUNTRY_TO_CURRENCY[code] ?? 'USD',
      majorAirports: COUNTRY_TO_AIRPORTS[code] ?? [],
    };
  }

  // 3. Partial match by city (destination string may be "City, Country")
  const parts = destinationName.split(',').map((p) => p.trim().toLowerCase());
  for (const part of parts) {
    const partialCity = POPULAR_DESTINATIONS.find(
      (d) => d.city.toLowerCase() === part
    );
    if (partialCity) {
      return {
        countryName: partialCity.country,
        countryCode: partialCity.countryCode,
        currency: COUNTRY_TO_CURRENCY[partialCity.countryCode] ?? 'USD',
        majorAirports: COUNTRY_TO_AIRPORTS[partialCity.countryCode] ?? [partialCity.iata],
      };
    }
    const partialCountry = Object.keys(COUNTRY_NAME_TO_CODE).find(
      (k) => k.toLowerCase() === part
    );
    if (partialCountry) {
      const code = COUNTRY_NAME_TO_CODE[partialCountry];
      return {
        countryName: partialCountry,
        countryCode: code,
        currency: COUNTRY_TO_CURRENCY[code] ?? 'USD',
        majorAirports: COUNTRY_TO_AIRPORTS[code] ?? [],
      };
    }
  }

  return null;
}
