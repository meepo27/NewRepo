'use client';

import { useCallback } from 'react';
import { usePlanningStore } from '@/store/planningStore';
import type { Destination, TripConfig, Itinerary } from '@/types';

export function usePlanningSession() {
  const store = usePlanningStore();

  const discoverDestinations = useCallback(
    async (prompt: string, refinement?: string) => {
      store.setLoading(true, 'Drift is finding the perfect destinations for you...');
      store.setError(null);

      try {
        const messages = refinement
          ? [
              ...store.conversationHistory,
              { role: 'user' as const, content: refinement },
            ]
          : [{ role: 'user' as const, content: prompt }];

        const res = await fetch('/api/plan/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: refinement ?? prompt, history: messages }),
        });

        if (!res.ok) throw new Error('Failed to discover destinations');
        const data = await res.json();

        store.setDestinations(data.destinations);
        if (refinement) {
          store.addMessage({ role: 'user', content: refinement });
          store.addMessage({ role: 'assistant', content: JSON.stringify(data.destinations) });
        } else {
          store.setInitialPrompt(prompt);
          store.addMessage({ role: 'user', content: prompt });
          store.addMessage({ role: 'assistant', content: JSON.stringify(data.destinations) });
          store.setStage('discover');
        }
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const refreshDestination = useCallback(
    async (destinationId: string) => {
      store.setLoading(true, 'Finding a new option...');
      try {
        const res = await fetch('/api/plan/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: store.initialPrompt,
            history: store.conversationHistory,
            refreshExclude: store.destinations.map((d) => d.name),
            refreshOne: true,
          }),
        });
        if (!res.ok) throw new Error('Refresh failed');
        const data = await res.json();
        if (data.destinations?.[0]) {
          store.refreshDestination(destinationId, data.destinations[0]);
        }
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Refresh failed');
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const generateItinerary = useCallback(
    async (config: TripConfig): Promise<Itinerary | null> => {
      store.setLoading(true, 'Building your perfect itinerary...');
      store.setError(null);
      try {
        const res = await fetch('/api/plan/itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config, history: store.conversationHistory }),
        });
        if (!res.ok) throw new Error('Failed to generate itinerary');
        const data = await res.json();
        store.setItinerary(data.itinerary);
        store.setStage('itinerary');
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

  const refineItinerary = useCallback(
    async (message: string): Promise<Itinerary | null> => {
      store.setLoading(true, 'Updating your itinerary...');
      store.setError(null);
      try {
        const res = await fetch('/api/plan/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            currentItinerary: store.itinerary,
            history: store.conversationHistory,
          }),
        });
        if (!res.ok) throw new Error('Refinement failed');
        const data = await res.json();
        store.setItinerary(data.itinerary);
        store.addMessage({ role: 'user', content: message });
        store.addMessage({ role: 'assistant', content: 'Itinerary updated based on your request.' });
        return data.itinerary;
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
