'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Check, Globe } from 'lucide-react';
import { usePlanningStore } from '@/store/planningStore';
import type { ComparisonSummary, Destination } from '@/types';
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
  comparison?: ComparisonSummary;
  isChosen: boolean;
  onChoose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl border p-5 transition-all duration-300 flex flex-col gap-4',
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
            <ScoreBar score={comparison.costScore} label="Value for money" />
            <ScoreBar score={comparison.weatherScore} label="Weather" />
            <ScoreBar score={comparison.uniquenessScore} label="Uniqueness" />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe size={13} className="text-white/40" />
            <span className="text-white/50">Visa ease:</span>
            <span className={cn(
              'font-medium text-xs px-2 py-0.5 rounded-full',
              comparison.visaEase === 'Easy' ? 'bg-green-900/50 text-green-400' :
              comparison.visaEase === 'Moderate' ? 'bg-amber-900/50 text-amber-400' :
              'bg-red-900/50 text-red-400'
            )}>
              {comparison.visaEase}
            </span>
          </div>

          <p className="text-white/65 text-sm leading-relaxed border-t border-white/8 pt-4">
            &quot;{comparison.whyItWins}&quot;
          </p>
        </>
      ) : (
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-4/5 rounded" />
          <div className="skeleton h-3 w-3/5 rounded" />
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
        {isChosen ? <><Check size={15} /> Chosen</> : 'Choose this destination'}
      </button>
    </motion.div>
  );
}

export function ShortlistComparePage() {
  const store = usePlanningStore();
  const [comparisons, setComparisons] = useState<ComparisonSummary[]>([]);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const res = await fetch('/api/plan/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinations: store.shortlist,
            userPrompt: store.initialPrompt,
            history: store.conversationHistory,
          }),
        });
        const data = await res.json();
        if (data.comparisons) setComparisons(data.comparisons);
      } catch {}
      setLoading(false);
    };
    fetchComparisons();
  }, [store.shortlist, store.initialPrompt, store.conversationHistory]);

  const handleChoose = (destination: Destination) => {
    setChosenId(destination.id);
    store.setChosenDestination(destination);
  };

  const handleProceed = () => {
    if (!chosenId) return;
    store.setStage('builder');
  };

  return (
    <div className="min-h-dvh px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => store.setStage('discover')}
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
          <div className={cn(
            'grid gap-4',
            store.shortlist.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
          )}>
            {store.shortlist.map((dest) => (
              <CompareCard
                key={dest.id}
                destination={dest}
                comparison={comparisons.find((c) => c.destinationId === dest.id)}
                isChosen={chosenId === dest.id}
                onChoose={() => handleChoose(dest)}
              />
            ))}
          </div>
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
              Plan my trip to {store.shortlist.find((d) => d.id === chosenId)?.name} →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
