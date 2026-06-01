'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_MESSAGES = [
  'Drift is mapping your adventure...',
  'Checking flight windows and seasons...',
  'Finding hidden gems off the tourist trail...',
  'Building your day-by-day plan...',
  'Calculating the budget breakdown...',
  'Curating the best local experiences...',
];

interface DriftThinkingProps {
  message?: string;
  messages?: string[];
}

export function DriftThinking({ message, messages }: DriftThinkingProps) {
  const pool = messages ?? (message ? [message] : DEFAULT_MESSAGES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (pool.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % pool.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [pool.length]);

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="wave-dot w-2 h-2 rounded-full bg-amber-400 inline-block"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="text-amber-400/80 text-sm font-medium tracking-wide text-center"
        >
          {pool[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
