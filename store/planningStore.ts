'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PlanningStage,
  type Destination,
  type ComparisonResult,
  type Itinerary,
  type ItineraryDay,
  type RefinementPatch,
  type TripConfig,
  type Message,
  type UserProfile,
  type BookingChecklistItem,
} from '@/types/planning';

export { PlanningStage };

// ─── State ───────────────────────────────────────────────────────────────────────

interface PlanningState {
  stage: PlanningStage;
  userInput: string;
  userProfile: UserProfile;
  conversationHistory: Message[];
  discoveredDestinations: Destination[];
  shortlistedDestinations: Destination[];
  selectedDestination: Destination | null;
  comparisonResult: ComparisonResult | null;
  tripConfig: TripConfig | null;
  itinerary: Itinerary | null;
  refineMessages: Message[];
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  sessionId: string;
  // Extra fields for save/share feature (not in base spec but needed by UI)
  savedTripId: string | null;
  shareToken: string | null;
  // ── Booking layer ───────────────────────────────────────────────────────────────
  bookingChecklist: BookingChecklistItem[] | null;
  activeBookingCategory: string | null;
  completedBookings: string[];
}

// ─── Actions ─────────────────────────────────────────────────────────────────────

interface PlanningActions {
  setStage: (stage: PlanningStage) => void;
  setUserInput: (input: string) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  addToConversation: (message: Message) => void;
  setDiscoveredDestinations: (destinations: Destination[]) => void;
  addToShortlist: (destination: Destination) => void;
  removeFromShortlist: (destinationId: string) => void;
  clearShortlist: () => void;
  setSelectedDestination: (destination: Destination) => void;
  setComparisonResult: (result: ComparisonResult) => void;
  setTripConfig: (config: TripConfig) => void;
  setItinerary: (itinerary: Itinerary) => void;
  addRefineMessage: (message: Message) => void;
  applyRefinementPatch: (patch: RefinementPatch) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  resetSession: () => void;
  goBack: () => void;
  setSavedTripId: (id: string) => void;
  setShareToken: (token: string) => void;
  // ── Booking layer actions ───────────────────────────────────────────────────────
  setBookingChecklist: (checklist: BookingChecklistItem[]) => void;
  setActiveBookingCategory: (category: string | null) => void;
  markBookingComplete: (itemId: string) => void;
  unmarkBookingComplete: (itemId: string) => void;
  // Helpers
  canAddToShortlist: () => boolean;
  isInShortlist: (destinationId: string) => boolean;
  getTotalBudget: () => number;
  getItineraryDay: (dayNumber: number) => ItineraryDay | undefined;
  getBookingProgress: () => { completed: number; total: number; percentage: number };
}

type PlanningStore = PlanningState & PlanningActions;

// ─── Stage order for goBack() ────────────────────────────────────────────────────

const STAGE_ORDER: PlanningStage[] = [
  PlanningStage.SPARK,
  PlanningStage.DISCOVERY,
  PlanningStage.SHORTLIST,
  PlanningStage.COMPARISON,
  PlanningStage.TRIP_CONFIG,
  PlanningStage.ITINERARY,
  PlanningStage.REFINE,
];

function generateSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Initial state ───────────────────────────────────────────────────────────────

const DEFAULT_USER_PROFILE: UserProfile = {
  homeCity: '',
  passportCountry: 'India',
  currency: 'USD',
  travelStyle: '',
};

const getInitialState = (): PlanningState => ({
  stage: PlanningStage.SPARK,
  userInput: '',
  userProfile: DEFAULT_USER_PROFILE,
  conversationHistory: [],
  discoveredDestinations: [],
  shortlistedDestinations: [],
  selectedDestination: null,
  comparisonResult: null,
  tripConfig: null,
  itinerary: null,
  refineMessages: [],
  isLoading: false,
  loadingMessage: 'Drift is thinking...',
  error: null,
  sessionId: generateSessionId(),
  savedTripId: null,
  shareToken: null,
  bookingChecklist: null,
  activeBookingCategory: null,
  completedBookings: [],
});

// ─── Store ───────────────────────────────────────────────────────────────────────

export const usePlanningStore = create<PlanningStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setStage: (stage) => set({ stage }),

      setUserInput: (userInput) => set({ userInput }),

      setUserProfile: (profile) =>
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

      addToConversation: (message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
        })),

      setDiscoveredDestinations: (discoveredDestinations) =>
        set({ discoveredDestinations }),

      addToShortlist: (destination) =>
        set((state) => {
          if (state.shortlistedDestinations.length >= 3) return state;
          if (state.shortlistedDestinations.some((d) => d.id === destination.id)) return state;
          return {
            shortlistedDestinations: [...state.shortlistedDestinations, destination],
          };
        }),

      removeFromShortlist: (destinationId) =>
        set((state) => ({
          shortlistedDestinations: state.shortlistedDestinations.filter(
            (d) => d.id !== destinationId
          ),
        })),

      clearShortlist: () => set({ shortlistedDestinations: [] }),

      setSelectedDestination: (selectedDestination) => set({ selectedDestination }),

      setComparisonResult: (comparisonResult) => set({ comparisonResult }),

      setTripConfig: (tripConfig) => set({ tripConfig }),

      setItinerary: (itinerary) => set({ itinerary }),

      addRefineMessage: (message) =>
        set((state) => ({
          refineMessages: [...state.refineMessages, message],
        })),

      applyRefinementPatch: (patch) =>
        set((state) => {
          if (!state.itinerary) return state;

          const updatedDays = state.itinerary.days.map((day) => {
            const mod = patch.modifiedDays.find((m) => m.dayNumber === day.dayNumber);
            if (!mod) return day;

            if (mod.period === 'full') {
              return {
                ...day,
                morning: { activities: mod.activities },
                afternoon: { activities: [] },
                evening: { activities: [] },
              };
            }

            return {
              ...day,
              [mod.period]: { activities: mod.activities },
            };
          });

          const budgetDelta = patch.budgetDelta?.amount ?? 0;
          return {
            itinerary: {
              ...state.itinerary,
              days: updatedDays,
              budgetSummary: {
                ...state.itinerary.budgetSummary,
                grandTotal: state.itinerary.budgetSummary.grandTotal + budgetDelta,
              },
            },
          };
        }),

      setLoading: (isLoading, loadingMessage = 'Drift is thinking...') =>
        set({ isLoading, loadingMessage }),

      setError: (error) => set({ error }),

      resetSession: () =>
        set({
          ...getInitialState(),
          sessionId: generateSessionId(),
        }),

      goBack: () =>
        set((state) => {
          const currentIndex = STAGE_ORDER.indexOf(state.stage);
          if (currentIndex <= 0) return state;
          return { stage: STAGE_ORDER[currentIndex - 1] };
        }),

      setSavedTripId: (savedTripId) => set({ savedTripId }),

      setShareToken: (shareToken) => set({ shareToken }),

      // ── Booking layer ──────────────────────────────────────────────────────────

      setBookingChecklist: (bookingChecklist) => set({ bookingChecklist }),

      setActiveBookingCategory: (activeBookingCategory) => set({ activeBookingCategory }),

      markBookingComplete: (itemId) =>
        set((state) => {
          if (state.completedBookings.includes(itemId)) return state;
          return { completedBookings: [...state.completedBookings, itemId] };
        }),

      unmarkBookingComplete: (itemId) =>
        set((state) => ({
          completedBookings: state.completedBookings.filter((id) => id !== itemId),
        })),

      // ── Helpers ────────────────────────────────────────────────────────────────

      canAddToShortlist: () => {
        const { shortlistedDestinations } = get();
        return shortlistedDestinations.length < 3;
      },

      isInShortlist: (destinationId) => {
        return get().shortlistedDestinations.some((d) => d.id === destinationId);
      },

      getTotalBudget: () => {
        return get().itinerary?.budgetSummary.grandTotal ?? 0;
      },

      getItineraryDay: (dayNumber) => {
        return get().itinerary?.days.find((d) => d.dayNumber === dayNumber);
      },

      getBookingProgress: () => {
        const { bookingChecklist, completedBookings } = get();
        const total = bookingChecklist?.length ?? 0;
        const completed = completedBookings.length;
        return {
          completed,
          total,
          percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
      },
    }),
    {
      name: 'driftplan-session',
      partialize: (state) => ({
        stage: state.stage,
        userProfile: state.userProfile,
        itinerary: state.itinerary,
        tripConfig: state.tripConfig,
        sessionId: state.sessionId,
        // Extra persisted for UX continuity
        userInput: state.userInput,
        discoveredDestinations: state.discoveredDestinations,
        shortlistedDestinations: state.shortlistedDestinations,
        selectedDestination: state.selectedDestination,
        savedTripId: state.savedTripId,
        shareToken: state.shareToken,
        bookingChecklist: state.bookingChecklist,
        completedBookings: state.completedBookings,
        // activeBookingCategory intentionally NOT persisted (transient UI state)
      }),
    }
  )
);
