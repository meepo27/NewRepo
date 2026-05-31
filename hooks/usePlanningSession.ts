'use client';

import { useCallback } from 'react';
import { usePlanningStore, PlanningStage } from '@/store/planningStore';
import type { Destination, TripConfig, Itinerary, Refinement } from '@/types/planning';

export function usePlanningSession() {
  const store = usePlanningStore();

  // ── Discover ────────────────────────────────────────────────────────────────────

  const discoverDestinations = useCallback(
    async (userInput: string, refinement?: string) => {
      store.setLoading(true, 'Drift is finding the perfect destinations for you...');
      store.setError(null);

      const input = refinement ?? userInput;
      const timestamp = Date.now();

      try {
        const res = await fetch('/api/plan/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInput: input,
            homeCity: store.userProfile.homeCity,
            passportCountry: store.userProfile.passportCountry,
            currency: store.userProfile.currency,
            conversationHistory: store.conversationHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to discover destinations');
        }

        const data: { destinations: Destination[]; driftNote: string; error?: string } =
          await res.json();

        if (data.error) throw new Error(data.error);

        store.setDiscoveredDestinations(data.destinations);
        store.addToConversation({ role: 'user', content: input, timestamp });
        store.addToConversation({
          role: 'assistant',
          content: data.driftNote || `Here are ${data.destinations.length} destination ideas for you.`,
          timestamp: Date.now(),
        });

        if (!refinement) {
          store.setUserInput(userInput);
          store.setStage(PlanningStage.DISCOVERY);
        }
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // ── Refresh one destination ──────────────────────────────────────────────────────

  const refreshDestination = useCallback(
    async (destinationId: string) => {
      const current = store.discoveredDestinations;
      const exclude = current.map((d) => `${d.name}, ${d.country}`).join('; ');
      const refreshInput = `${store.userInput} (Exclude: ${exclude})`;

      store.setLoading(true, 'Finding a fresh option...');
      store.setError(null);

      try {
        const res = await fetch('/api/plan/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInput: refreshInput,
            homeCity: store.userProfile.homeCity,
            passportCountry: store.userProfile.passportCountry,
            currency: store.userProfile.currency,
            conversationHistory: [],
          }),
        });

        if (!res.ok) throw new Error('Refresh failed');
        const data: { destinations: Destination[] } = await res.json();

        if (data.destinations?.[0]) {
          // Replace the specific card
          const updated = current.map((d) =>
            d.id === destinationId ? data.destinations[0] : d
          );
          store.setDiscoveredDestinations(updated);
        }
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Refresh failed');
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // ── Generate itinerary ───────────────────────────────────────────────────────────

  const generateItinerary = useCallback(
    async (config: TripConfig): Promise<Itinerary | null> => {
      const dest = store.selectedDestination;
      if (!dest) {
        store.setError('No destination selected');
        return null;
      }

      store.setLoading(true, 'Building your perfect itinerary...');
      store.setError(null);

      try {
        store.setTripConfig(config);

        const res = await fetch('/api/plan/itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: { id: dest.id, name: dest.name, country: dest.country },
            travelDates: config.travelDates,
            travelers: config.travelers,
            budget: config.budget,
            travelStyle: config.travelStyle,
            startingCity: config.startingCity,
            startingCityIATA: config.startingCityIATA,
            passportCountry: store.userProfile.passportCountry,
            preferences: config.preferences,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to generate itinerary');
        }

        const data: { itinerary: Itinerary } = await res.json();
        store.setItinerary(data.itinerary);
        store.setStage(PlanningStage.ITINERARY);
        return data.itinerary;
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
        return null;
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // ── Refine itinerary ─────────────────────────────────────────────────────────────

  const refineItinerary = useCallback(
    async (userMessage: string): Promise<Refinement | null> => {
      if (!store.itinerary) return null;

      store.setLoading(true, 'Updating your itinerary...');
      store.setError(null);

      const timestamp = Date.now();

      try {
        store.addRefineMessage({ role: 'user', content: userMessage, timestamp });

        const res = await fetch('/api/plan/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage,
            currentItinerary: store.itinerary,
            conversationHistory: store.refineMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            tripContext: {
              destination: store.itinerary.tripSummary.destination,
              travelStyle: store.tripConfig?.travelStyle ?? '',
              budget: store.itinerary.budgetSummary,
              passportCountry: store.userProfile.passportCountry,
            },
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Refinement failed');
        }

        const data: Refinement = await res.json();

        store.addRefineMessage({
          role: 'assistant',
          content: data.message,
          timestamp: Date.now(),
        });

        if (data.patch) {
          store.applyRefinementPatch(data.patch);
        }

        return data;
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Refinement failed');
        return null;
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  return {
    discoverDestinations,
    refreshDestination,
    generateItinerary,
    refineItinerary,
  };
}
