'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Plus, Check } from 'lucide-react';
import type { Destination } from '@/types';
import { cn } from '@/lib/utils';

const BUDGET_LABELS = { budget: '$ Budget', mid: '$$ Mid-range', luxury: '$$$ Luxury' };
const BUDGET_COLORS = {
  budget: 'bg-green-900/50 text-green-400 border-green-800',
  mid: 'bg-blue-900/50 text-blue-400 border-blue-800',
  luxury: 'bg-amber-900/50 text-amber-400 border-amber-800',
};

interface DestinationCardProps {
  destination: Destination;
  isShortlisted: boolean;
  onShortlist: () => void;
  onRefresh: () => void;
  index: number;
}

export function DestinationCard({
  destination,
  isShortlisted,
  onShortlist,
  onRefresh,
  index,
}: DestinationCardProps) {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if (!key) return;

    fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination.imageQuery)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.results?.[0]?.urls?.regular) setImgUrl(d.results[0].urls.regular);
      })
      .catch(() => {});
  }, [destination.imageQuery]);

  const gradients = [
    'linear-gradient(135deg, #1a2040 0%, #2d1b69 100%)',
    'linear-gradient(135deg, #1f3a5f 0%, #0f3460 100%)',
    'linear-gradient(135deg, #2d3a4a 0%, #1a4a3a 100%)',
    'linear-gradient(135deg, #3a1f4a 0%, #1f3a5f 100%)',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer card-hover',
        isShortlisted ? 'border-amber-500/60 shadow-lg shadow-amber-500/10' : 'border-white/8 hover:border-white/20'
      )}
      style={{
        background: gradients[index % gradients.length],
      }}
    >
      {/* Background image */}
      <div className="relative h-44 overflow-hidden">
        {imgUrl && !imgError ? (
          <img
            src={imgUrl}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: gradients[index % gradients.length] }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Budget badge */}
        <div className="absolute top-3 left-3">
          <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', BUDGET_COLORS[destination.budgetRange])}>
            {BUDGET_LABELS[destination.budgetRange]}
          </span>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRefresh(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          title="Get a different suggestion"
        >
          <RefreshCw size={14} />
        </button>

        {/* Destination name overlay */}
        <div className="absolute bottom-3 left-4">
          <h3 className="text-white font-semibold text-lg leading-tight">{destination.name}</h3>
          <p className="text-white/70 text-sm">{destination.country}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        <p className="text-white/75 text-sm leading-relaxed line-clamp-3">{destination.description}</p>

        <div className="flex items-center gap-1.5 text-white/45 text-xs">
          <span className="text-amber-400/70">Best time:</span>
          <span>{destination.bestTime}</span>
        </div>

        {/* Vibe tags */}
        <div className="flex flex-wrap gap-1.5">
          {destination.vibeTags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50 border border-white/8">
              {tag}
            </span>
          ))}
        </div>

        {/* Shortlist button */}
        <button
          type="button"
          onClick={onShortlist}
          className={cn(
            'w-full mt-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200',
            isShortlisted
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-white/8 text-white/70 border border-white/10 hover:bg-white/15 hover:text-white'
          )}
        >
          {isShortlisted ? (
            <><Check size={15} /> Added to shortlist</>
          ) : (
            <><Plus size={15} /> Add to shortlist</>
          )}
        </button>
      </div>
    </motion.div>
  );
}
