'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Destination,
  ShortlistedDestination,
  TripConfig,
  Itinerary,
  PlanningMessage,
} from '@/types';

export type PlanningStage = 'spark' | 'discover' | 'shortlist' | 'builder' | 'itinerary' | 'save';

interface PlanningStore {
  stage: PlanningStage;
  initialPrompt: string;
  conversationHistory: PlanningMessage[];
  destinations: Destination[];
  shortlist: ShortlistedDestination[];
  chosenDestination: Destination | null;
  tripConfig: Partial<TripConfig>;
  itinerary: Itinerary | null;
  savedTripId: string | null;
  shareToken: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;

  setStage: (stage: PlanningStage) => void;
  setInitialPrompt: (prompt: string) => void;
  addMessage: (message: PlanningMessage) => void;
  setDestinations: (destinations: Destination[]) => void;
  refreshDestination: (id: string, replacement: Destination) => void;
  addToShortlist: (destination: ShortlistedDestination) => void;
  removeFromShortlist: (id: string) => void;
  setChosenDestination: (destination: Destination) => void;
  updateTripConfig: (config: Partial<TripConfig>) => void;
  setItinerary: (itinerary: Itinerary) => void;
  setSavedTripId: (id: string) => void;
  setShareToken: (token: string) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  stage: 'spark' as PlanningStage,
  initialPrompt: '',
  conversationHistory: [],
  destinations: [],
  shortlist: [],
  chosenDestination: null,
  tripConfig: {},
  itinerary: null,
  savedTripId: null,
  shareToken: null,
  isLoading: false,
  loadingMessage: '',
  error: null,
};

export const usePlanningStore = create<PlanningStore>()(
  persist(
    (set) => ({
      ...initialState,

      setStage: (stage) => set({ stage }),
      setInitialPrompt: (initialPrompt) => set({ initialPrompt }),
      addMessage: (message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
        })),
      setDestinations: (destinations) => set({ destinations }),
      refreshDestination: (id, replacement) =>
        set((state) => ({
          destinations: state.destinations.map((d) => (d.id === id ? replacement : d)),
        })),
      addToShortlist: (destination) =>
        set((state) => {
          if (state.shortlist.length >= 3) return state;
          if (state.shortlist.find((d) => d.id === destination.id)) return state;
          return { shortlist: [...state.shortlist, destination] };
        }),
      removeFromShortlist: (id) =>
        set((state) => ({
          shortlist: state.shortlist.filter((d) => d.id !== id),
        })),
      setChosenDestination: (chosenDestination) => set({ chosenDestination }),
      updateTripConfig: (config) =>
        set((state) => ({
          tripConfig: { ...state.tripConfig, ...config },
        })),
      setItinerary: (itinerary) => set({ itinerary }),
      setSavedTripId: (savedTripId) => set({ savedTripId }),
      setShareToken: (shareToken) => set({ shareToken }),
      setLoading: (isLoading, loadingMessage = 'Drift is thinking...') =>
        set({ isLoading, loadingMessage }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'driftplan-session',
      partialize: (state) => ({
        stage: state.stage,
        initialPrompt: state.initialPrompt,
        conversationHistory: state.conversationHistory,
        destinations: state.destinations,
        shortlist: state.shortlist,
        chosenDestination: state.chosenDestination,
        tripConfig: state.tripConfig,
        itinerary: state.itinerary,
        savedTripId: state.savedTripId,
        shareToken: state.shareToken,
      }),
    }
  )
);
