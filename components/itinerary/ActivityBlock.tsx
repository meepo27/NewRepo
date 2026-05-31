'use client';

import { motion } from 'framer-motion';
import { MapPin, DollarSign, ExternalLink } from 'lucide-react';
import type { Activity } from '@/types';
import { formatCurrency } from '@/lib/utils';

const TIME_LABELS = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', evening: '🌙 Evening' };

interface ActivityBlockProps {
  activity: Activity;
  currency: string;
  index: number;
}

export function ActivityBlock({ activity, currency, index }: ActivityBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-6 pb-4"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-500/60 ring-2 ring-amber-500/20" />
      {/* Timeline line */}
      <div className="absolute left-0.5 top-4 bottom-0 w-px bg-white/8" />

      <div className="bg-[#141929] rounded-xl p-4 border border-white/8 space-y-2">
        <h4 className="text-white font-medium text-sm">{activity.name}</h4>
        <p className="text-white/55 text-xs leading-relaxed">{activity.description}</p>

        <div className="flex items-center gap-3 pt-1">
          {activity.location && (
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <MapPin size={11} />
              {activity.location}
            </span>
          )}
          {activity.estimatedCost > 0 && (
            <span className="flex items-center gap-1 text-amber-400/70 text-xs">
              <DollarSign size={11} />
              {formatCurrency(activity.estimatedCost, currency)}
            </span>
          )}
          {activity.estimatedCost === 0 && (
            <span className="text-green-400/70 text-xs">Free</span>
          )}
          {activity.bookingUrl && (
            <a
              href={activity.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-400 text-xs hover:text-amber-300 transition-colors ml-auto"
            >
              Book <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export { TIME_LABELS };
