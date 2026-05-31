// ─── Stage enum ────────────────────────────────────────────────────────────────

export const PlanningStage = {
  SPARK: 'SPARK',
  DISCOVERY: 'DISCOVERY',
  SHORTLIST: 'SHORTLIST',
  COMPARISON: 'COMPARISON',
  TRIP_CONFIG: 'TRIP_CONFIG',
  ITINERARY: 'ITINERARY',
  REFINE: 'REFINE',
} as const;

export type PlanningStage = (typeof PlanningStage)[keyof typeof PlanningStage];

// ─── Destination ────────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  bestMonths: string;
  budgetTier: 'budget' | 'mid' | 'luxury';
  estimatedDailyBudget: {
    currency: string;
    min: number;
    max: number;
  };
  vibeTags: string[];
  unsplashQuery: string;
}

// ─── Comparison ─────────────────────────────────────────────────────────────────

export interface VisaInfo {
  requirement: 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required';
  processingTime: string;
  estimatedCost: string;
  notes: string;
}

export interface DestinationComparison {
  destinationId: string;
  name: string;
  scores: {
    valueForMoney: number;
    weatherInTravelPeriod: number;
    easeOfTravel: number;
    matchToTravelStyle: number;
  };
  visa: VisaInfo;
  weatherSummary: string;
  quickPros: string[];
  quickCons: string[];
}

export interface ComparisonResult {
  comparisons: DestinationComparison[];
  recommendation: {
    winnerId: string;
    winnerName: string;
    whyItWinsForYou: string;
    oneLineVerdictOnOthers: Record<string, string>;
  };
}

// ─── Activity ────────────────────────────────────────────────────────────────────

export interface ActivityLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface ActivityCost {
  amount: number;
  currency: string;
  per: 'person' | 'group';
}

export interface ActivityItem {
  id: string;
  name: string;
  type: 'activity' | 'meal' | 'transport' | 'experience';
  description: string;
  location: ActivityLocation;
  duration: string;
  estimatedCost: ActivityCost;
  bookingLink: string | null;
  tips: string | null;
}

// ─── Itinerary ───────────────────────────────────────────────────────────────────

export interface DayPeriod {
  activities: ActivityItem[];
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  morning: DayPeriod;
  afternoon: DayPeriod;
  evening: DayPeriod;
}

export interface AccommodationOption {
  name: string;
  type: string;
  pricePerNight: number;
  currency: string;
  bookingComLink: string;
  airbnbLink: string;
}

export interface FlightOption {
  from: string;
  fromIATA: string;
  to: string;
  toIATA: string;
  date: string;
  skyscannerLink: string;
  makemytripLink: string;
  googleFlightsLink: string;
}

export interface BudgetSummary {
  currency: string;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  miscellaneous: number;
  subtotal: number;
  flightsEstimate: number;
  grandTotal: number;
}

export interface PackingList {
  essentials: string[];
  clothing: string[];
  documents: string[];
  health: string[];
}

export interface EmergencyContacts {
  police: string;
  ambulance: string;
  indianEmbassy: string | null;
  touristHelpline: string | null;
}

export interface Itinerary {
  tripSummary: {
    destination: string;
    country: string;
    duration: number;
    travelStyle: string;
    totalTravelers: number;
  };
  days: ItineraryDay[];
  accommodation: {
    budget: AccommodationOption;
    mid: AccommodationOption;
    luxury: AccommodationOption;
  };
  flights: {
    outbound: FlightOption;
    return: FlightOption;
  };
  budgetSummary: BudgetSummary;
  packingList: PackingList;
  localTips: string[];
  emergencyContacts: EmergencyContacts;
  visaReminder: string;
}

// ─── Refinement ──────────────────────────────────────────────────────────────────

export interface RefinementPatch {
  modifiedDays: Array<{
    dayNumber: number;
    period: 'morning' | 'afternoon' | 'evening' | 'full';
    activities: ActivityItem[];
  }>;
  budgetDelta: {
    currency: string;
    amount: number;
  } | null;
}

export interface Refinement {
  responseType: 'modification' | 'answer';
  message: string;
  patch: RefinementPatch | null;
}

// ─── Trip config ─────────────────────────────────────────────────────────────────

export interface TripConfig {
  travelDates: {
    from: string;
    to: string;
    durationDays: number;
  };
  travelers: {
    adults: number;
    children: number;
  };
  budget: {
    currency: string;
    totalBudget: number;
    tier: 'budget' | 'mid' | 'luxury';
  };
  travelStyle: string;
  startingCity: string;
  startingCityIATA: string;
  preferences: string;
}

// ─── Session ─────────────────────────────────────────────────────────────────────

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UserProfile {
  homeCity: string;
  passportCountry: string;
  currency: string;
  travelStyle: string;
}

// ─── Booking layer ────────────────────────────────────────────────────────────────

export interface BookingChecklistItem {
  id: string;
  category: 'flights' | 'accommodation' | 'trains' | 'buses' | 'activities' | 'visa' | 'insurance';
  title: string;
  urgency: 'book-now' | 'book-soon' | 'can-wait';
  urgencyReason: string;
  recommendedLeadTime: string;
  estimatedCost: {
    amount: number;
    currency: string;
    per: 'person' | 'total' | 'night';
  };
  isRequired: boolean;
  notes: string | null;
}

export interface BookingPlatform {
  name: string;
  url: string;
  logo: string;
  bestFor: string;
}

export interface TrainLinkResult {
  primaryLink: string;
  alternateLink: string | null;
  providerName: string;
  countryName: string;
}

export interface ActivityLinksResult {
  platforms: BookingPlatform[];
}
