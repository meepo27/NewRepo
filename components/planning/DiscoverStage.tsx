'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { usePlanningStore } from '@/store/planningStore';
import { usePlanningSession } from '@/hooks/usePlanningSession';
import { DestinationCard } from './DestinationCard';
import { ShortlistTray } from './ShortlistTray';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { VoiceButton } from '@/components/ui/VoiceButton';

export function DiscoverStage() {
  const [refinement, setRefinement] = useState('');
  const store = usePlanningStore();
  const { discoverDestinations, refreshDestination } = usePlanningSession();

  const handleRefine = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!refinement.trim()) return;
    await discoverDestinations(store.initialPrompt, refinement);
    setRefinement('');
  };

  const handleCompare = () => {
    store.setStage('shortlist');
  };

  const handleShortlist = (dest: typeof store.destinations[0]) => {
    if (store.shortlist.find((d) => d.id === dest.id)) {
      store.removeFromShortlist(dest.id);
    } else {
      store.addToShortlist(dest);
    }
  };

  return (
    <div className="min-h-dvh pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => store.setStage('spark')}
              className="text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-white/60 text-sm truncate flex-1">
              &quot;{store.initialPrompt}&quot;
            </span>
          </div>

          {/* Refinement input */}
          <form onSubmit={handleRefine} className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center rounded-xl bg-[#141929] border border-white/10 focus-within:border-amber-500/40 transition-colors">
              <input
                value={refinement}
                onChange={(e) => setRefinement(e.target.value)}
                placeholder="Refine: &quot;make it cheaper&quot;, &quot;Southeast Asia only&quot;..."
                className="flex-1 bg-transparent px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none"
              />
              <VoiceButton onResult={(t) => setRefinement(t)} className="mr-2" />
            </div>
            <button
              type="submit"
              disabled={!refinement.trim()}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/15 disabled:opacity-40 transition-colors"
            >
              Refine
            </button>
          </form>
        </div>
      </div>

      {/* Destinations grid */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/50 text-sm mb-5"
        >
          {store.destinations.length > 0 ? 'Here are 4 destinations that match your vibe' : 'Finding destinations...'}
        </motion.h2>

        {store.destinations.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.destinations.map((dest, i) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                index={i}
                isShortlisted={!!store.shortlist.find((d) => d.id === dest.id)}
                onShortlist={() => handleShortlist(dest)}
                onRefresh={() => refreshDestination(dest.id)}
              />
            ))}
          </div>
        )}

        {store.shortlist.length === 0 && store.destinations.length > 0 && (
          <p className="text-center text-white/30 text-sm mt-8">
            Add 2–3 destinations to your shortlist to compare them
          </p>
        )}
      </div>

      {/* Shortlist tray */}
      <ShortlistTray shortlist={store.shortlist} onCompare={handleCompare} />
    </div>
  );
}
