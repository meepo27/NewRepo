// Re-export all new canonical types from planning.ts
export type {
  PlanningStage,
  Destination,
  ComparisonResult,
  DestinationComparison,
  VisaInfo,
  ActivityItem,
  ActivityLocation,
  ActivityCost,
  DayPeriod,
  ItineraryDay,
  Itinerary,
  AccommodationOption,
  FlightOption,
  BudgetSummary,
  PackingList,
  EmergencyContacts,
  RefinementPatch,
  Refinement,
  TripConfig,
  Message,
  UserProfile,
} from '@/types/planning';

export { PlanningStage as PlanningStageEnum } from '@/types/planning';

// ─── Legacy type aliases ─────────────────────────────────────────────────────────
// These are kept so that components still importing from '@/types' compile.
// They are wrappers around the new types where possible, or standalone where
// the old shape is genuinely different.

// Old Activity shape — used by legacy UI components
export interface LegacyActivity {
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

// 'Activity' as the old name — point to LegacyActivity
export type Activity = LegacyActivity;

// Old shortlist wrapper (just Destination)
export type ShortlistedDestination = import('@/types/planning').Destination;

// Old TripStyle
export type TripStyle =
  | 'relaxed'
  | 'active'
  | 'cultural'
  | 'foodie'
  | 'adventure'
  | 'romantic';

// Old PlanningMessage
export interface PlanningMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Old ComparisonSummary shape kept for any legacy components
export interface ComparisonSummary {
  destinationId: string;
  whyItWins: string;
  costScore: number;
  weatherScore: number;
  uniquenessScore: number;
  visaEase: string;
}

// Old Trip shape
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
  itinerary?: import('@/types/planning').Itinerary;
  createdAt: string;
}

// Old User
export interface User {
  id: string;
  email: string;
  homeCity?: string;
  passportCountry?: string;
  currency?: string;
  travelStyle?: TripStyle;
}
