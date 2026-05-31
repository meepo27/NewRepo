'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ItineraryDay } from '@/types/planning';
import { ActivityBlock } from './ActivityBlock';
import { cn } from '@/lib/utils';

const TIME_LABELS = {
  morning: '🌅 Morning',
  afternoon: '☀️ Afternoon',
  evening: '🌙 Evening',
} as const;

interface DayCardProps {
  day: ItineraryDay;
  currency: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function DayCard({ day, currency, isOpen, onToggle }: DayCardProps) {
  const allActivities = [
    ...day.morning.activities,
    ...day.afternoon.activities,
    ...day.evening.activities,
  ];
  const dayTotal = allActivities.reduce((sum, a) => sum + (a.estimatedCost?.amount ?? 0), 0);

  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[#141929] hover:bg-[#1a2035] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 text-sm font-semibold flex items-center justify-center shrink-0">
            {day.dayNumber}
          </span>
          <div>
            <p className="text-white font-medium text-sm">{day.theme}</p>
            <p className="text-white/40 text-xs">
              {day.date} · {allActivities.length} activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dayTotal > 0 && (
            <span className="text-amber-400/70 text-xs">
              ~{currency} {dayTotal.toLocaleString()}
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn('text-white/40 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#0A0F1E] space-y-5">
              {(['morning', 'afternoon', 'evening'] as const).map((period) => {
                const activities = day[period].activities;
                if (!activities.length) return null;
                return (
                  <div key={period}>
                    <h4 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                      {TIME_LABELS[period]}
                    </h4>
                    <div>
                      {activities.map((activity, i) => (
                        <ActivityBlock key={activity.id} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { TIME_LABELS };
