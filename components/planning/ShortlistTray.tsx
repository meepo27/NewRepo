'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { Destination } from '@/types/planning';
import { usePlanningStore } from '@/store/planningStore';

interface ShortlistTrayProps {
  shortlist: Destination[];
  onCompare: () => void;
}

export function ShortlistTray({ shortlist, onCompare }: ShortlistTrayProps) {
  const { removeFromShortlist } = usePlanningStore();

  if (shortlist.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1E]/95 border-t border-white/10 backdrop-blur-xl px-4 py-3"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-white/40 text-xs whitespace-nowrap shrink-0">
            Shortlist ({shortlist.length}/3)
          </span>
          <AnimatePresence>
            {shortlist.map((dest) => (
              <motion.div
                key={dest.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 shrink-0"
              >
                <span className="text-white text-xs font-medium">{dest.name}</span>
                <button
                  onClick={() => removeFromShortlist(dest.id)}
                  className="text-white/40 hover:text-white transition-colors ml-1"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {shortlist.length >= 2 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onCompare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors shrink-0 shadow-lg shadow-amber-500/20"
          >
            Compare &amp; Choose
            <ArrowRight size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
