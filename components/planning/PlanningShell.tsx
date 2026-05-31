'use client';

import { usePlanningStore, PlanningStage } from '@/store/planningStore';
import { LandingStage } from './LandingStage';
import { DiscoverStage } from './DiscoverStage';
import { ShortlistComparePage } from './ShortlistComparePage';
import { TripBuilderStage } from './TripBuilderStage';
import { ItineraryStage } from './ItineraryStage';
import { DriftThinking } from '@/components/ui/DriftThinking';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function PlanningShell() {
  const { stage, isLoading, loadingMessage, error, setError } = usePlanningStore();

  return (
    <div className="relative min-h-dvh overflow-hidden" style={{ background: '#0A0F1E' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(245,166,35,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,175,139,0.05) 0%, transparent 60%)',
        }}
      />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1E]/80 backdrop-blur-sm">
          <DriftThinking message={loadingMessage} />
        </div>
      )}

      {error && !isLoading && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="bg-red-950/90 border border-red-800 rounded-xl p-4 backdrop-blur-sm">
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 min-h-dvh"
        >
          {stage === PlanningStage.SPARK && <LandingStage />}
          {stage === PlanningStage.DISCOVERY && <DiscoverStage />}
          {(stage === PlanningStage.SHORTLIST || stage === PlanningStage.COMPARISON) && (
            <ShortlistComparePage />
          )}
          {stage === PlanningStage.TRIP_CONFIG && <TripBuilderStage />}
          {(stage === PlanningStage.ITINERARY || stage === PlanningStage.REFINE) && (
            <ItineraryStage />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
