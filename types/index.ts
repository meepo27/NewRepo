export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  bestTime: string;
  budgetRange: 'budget' | 'mid' | 'luxury';
  vibeTags: string[];
  imageQuery: string;
  imageUrl?: string;
}

export interface ShortlistedDestination extends Destination {
  thumbnailUrl?: string;
}

export interface TripConfig {
  destination: Destination;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  budgetMin: number;
  budgetMax: number;
  currency: 'INR' | 'USD' | 'GBP' | 'EUR' | 'AUD' | 'SGD' | 'AED';
  tripStyle: TripStyle;
  startingCity: string;
  passportCountry: string;
}

export type TripStyle = 'relaxed' | 'active' | 'cultural' | 'foodie' | 'adventure' | 'romantic';

export interface Activity {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  location?: string;
  lat?: number;
  lng?: number;
  bookingUrl?: string;
  type: 'morning' | 'afternoon' | 'evening';
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
}

export interface Itinerary {
  tripId: string;
  destination: string;
  country: string;
  totalDays: number;
  totalEstimatedCost: number;
  currency: string;
  days: ItineraryDay[];
  flightInfo: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  };
  hotelInfo: {
    destination: string;
    checkin: string;
    checkout: string;
  };
  visaInfo: {
    required: boolean;
    type: string;
    processingTime: string;
    fee: string;
    notes: string;
    embassyUrl?: string;
  };
  packingList: string[];
  budgetBreakdown: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    misc: number;
  };
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  status: 'draft' | 'saved' | 'shared';
  shareToken?: string;
  itinerary?: Itinerary;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  homeCity?: string;
  passportCountry?: string;
  currency?: string;
  travelStyle?: TripStyle;
}

export interface PlanningMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ComparisonSummary {
  destinationId: string;
  whyItWins: string;
  costScore: number;
  weatherScore: number;
  uniquenessScore: number;
  visaEase: string;
}
