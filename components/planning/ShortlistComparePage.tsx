'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Globe } from 'lucide-react';
import { usePlanningStore, PlanningStage } from '@/store/planningStore';
import type { ComparisonResult, Destination, DestinationComparison } from '@/types/planning';
import { cn } from '@/lib/utils';
import { DriftThinking } from '@/components/ui/DriftThinking';

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/50">
        <span>{label}</span>
        <span>{score}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-amber-500"
        />
      </div>
    </div>
  );
}

function CompareCard({
  destination,
  comparison,
  isChosen,
  onChoose,
}: {
  destination: Destination;
  comparison?: DestinationComparison;
  isChosen: boolean;
  onChoose: () => void;
}) {
  const visaColor =
    comparison?.visa.requirement === 'visa-free'
      ? 'bg-green-900/50 text-green-400'
      : comparison?.visa.requirement === 'visa-on-arrival'
      ? 'bg-amber-900/50 text-amber-400'
      : 'bg-red-900/50 text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300',
        isChosen
          ? 'border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10'
          : 'border-white/10 bg-[#141929]'
      )}
    >
      {isChosen && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black text-xs font-semibold">
          Your pick
        </div>
      )}

      <div>
        <h3 className="text-white font-semibold text-lg">{destination.name}</h3>
        <p className="text-white/50 text-sm">{destination.country}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {destination.vibeTags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50">
            {tag}
          </span>
        ))}
      </div>

      {comparison ? (
        <>
          <div className="space-y-2.5">
            <ScoreBar score={comparison.scores.valueForMoney} label="Value for money" />
            <ScoreBar score={comparison.scores.weatherInTravelPeriod} label="Weather" />
            <ScoreBar score={comparison.scores.easeOfTravel} label="Ease of travel" />
            <ScoreBar score={comparison.scores.matchToTravelStyle} label="Style match" />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe size={13} className="text-white/40" />
            <span className="text-white/50">Visa:</span>
            <span className={cn('font-medium text-xs px-2 py-0.5 rounded-full', visaColor)}>
              {comparison.visa.requirement.replace(/-/g, ' ')}
            </span>
          </div>

          {comparison.weatherSummary && (
            <p className="text-white/45 text-xs">{comparison.weatherSummary}</p>
          )}

          <ul className="space-y-1">
            {comparison.quickPros.map((p) => (
              <li key={p} className="text-green-400/70 text-xs flex gap-1.5">
                <span>+</span>
                {p}
              </li>
            ))}
            {comparison.quickCons.map((c) => (
              <li key={c} className="text-red-400/60 text-xs flex gap-1.5">
                <span>−</span>
                {c}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-3 rounded" />
          ))}
        </div>
      )}

      <button
        onClick={onChoose}
        className={cn(
          'w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-auto',
          isChosen
            ? 'bg-amber-500 text-black hover:bg-amber-400'
            : 'bg-white/8 text-white hover:bg-white/15 border border-white/10'
        )}
      >
        {isChosen ? (
          <>
            <Check size={15} /> Chosen
          </>
        ) : (
          'Choose this destination'
        )}
      </button>
    </motion.div>
  );
}

export function ShortlistComparePage() {
  const store = usePlanningStore();
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const res = await fetch('/api/plan/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shortlistedDestinations: store.shortlistedDestinations.map((d) => ({
              id: d.id,
              name: `${d.name}, ${d.country}`,
              budgetTier: d.budgetTier,
              vibeTags: d.vibeTags,
            })),
            travelDates: { from: '', to: '' },
            travelers: { adults: 2, children: 0 },
            budgetRange: { currency: store.userProfile.currency, min: 0, max: 5000 },
            travelStyle: store.userProfile.travelStyle,
            passportCountry: store.userProfile.passportCountry,
            homeCity: store.userProfile.homeCity,
          }),
        });
        const data: ComparisonResult = await res.json();
        setComparisonResult(data);
      } catch {}
      setLoading(false);
    };
    if (store.shortlistedDestinations.length >= 2) fetchComparisons();
    else setLoading(false);
  }, [store.shortlistedDestinations, store.userProfile]);

  const handleChoose = (destination: Destination) => {
    setChosenId(destination.id);
    store.setSelectedDestination(destination);
  };

  const handleProceed = () => {
    if (!chosenId) return;
    store.setStage(PlanningStage.TRIP_CONFIG);
  };

  return (
    <div className="min-h-dvh px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => store.setStage(PlanningStage.DISCOVERY)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-semibold text-xl">Compare destinations</h1>
            <p className="text-white/40 text-sm">Pick the one that feels right</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <DriftThinking message="Comparing your destinations..." />
          </div>
        ) : (
          <>
            {comparisonResult?.recommendation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20"
              >
                <p className="text-amber-400 text-sm font-medium mb-1">
                  Drift recommends: {comparisonResult.recommendation.winnerName}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  {comparisonResult.recommendation.whyItWinsForYou}
                </p>
              </motion.div>
            )}

            <div
              className={cn(
                'grid gap-4',
                store.shortlistedDestinations.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
              )}
            >
              {store.shortlistedDestinations.map((dest) => (
                <CompareCard
                  key={dest.id}
                  destination={dest}
                  comparison={comparisonResult?.comparisons.find((c) => c.destinationId === dest.id)}
                  isChosen={chosenId === dest.id}
                  onChoose={() => handleChoose(dest)}
                />
              ))}
            </div>
          </>
        )}

        {chosenId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={handleProceed}
              className="px-8 py-3.5 rounded-xl bg-amber-500 text-black font-semibold text-base hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              Plan my trip to{' '}
              {store.shortlistedDestinations.find((d) => d.id === chosenId)?.name} →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
