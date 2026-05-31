'use client';

import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Clock } from 'lucide-react';
import type { ActivityItem } from '@/types/planning';

const TYPE_ICONS: Record<ActivityItem['type'], string> = {
  activity: '🎯',
  meal: '🍽️',
  transport: '🚌',
  experience: '✨',
};

interface ActivityBlockProps {
  activity: ActivityItem;
  index: number;
}

export function ActivityBlock({ activity, index }: ActivityBlockProps) {
  const cost = activity.estimatedCost;
  const costDisplay =
    cost.amount === 0
      ? 'Free'
      : `${cost.currency} ${cost.amount.toLocaleString()} / ${cost.per}`;

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
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5 shrink-0">{TYPE_ICONS[activity.type]}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm leading-tight">{activity.name}</h4>
          </div>
        </div>

        <p className="text-white/55 text-xs leading-relaxed">{activity.description}</p>

        {activity.tips && (
          <p className="text-amber-400/60 text-xs italic border-l-2 border-amber-500/30 pl-2">
            {activity.tips}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {activity.location?.name && (
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <MapPin size={11} />
              {activity.location.name}
            </span>
          )}
          {activity.duration && (
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <Clock size={11} />
              {activity.duration}
            </span>
          )}
          <span
            className={
              cost.amount === 0 ? 'text-green-400/70 text-xs' : 'text-amber-400/70 text-xs'
            }
          >
            {costDisplay}
          </span>
          {activity.bookingLink && (
            <a
              href={activity.bookingLink}
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
