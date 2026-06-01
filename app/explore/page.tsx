'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Heart, Bookmark, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PublicTrip {
  id: string;
  destination: string;
  country: string;
  duration: number;
  travel_style: string;
  budget_tier: string;
  cover_photo_query: string;
  upvotes: number;
  saves_count: number;
  display_name: string;
  avatar_initial: string;
  published_at: string;
}

const STYLE_FILTERS = ['relaxed', 'active', 'cultural', 'foodie', 'adventure', 'romantic'];
const BUDGET_FILTERS = ['budget', 'mid', 'luxury'];

export default function ExplorePage() {
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState('');
  const [style, setStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [sort, setSort] = useState('newest');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchTrips = useCallback(async (reset = false) => {
    setLoading(true);
    const p = reset ? 1 : page;
    const params = new URLSearchParams({ sort, page: String(p) });
    if (destination) params.set('destination', destination);
    if (style) params.set('travel_style', style);
    if (budget) params.set('budget_tier', budget);

    try {
      const res = await fetch(`/api/community/feed?${params}`);
      const data = await res.json();
      if (reset) {
        setTrips(data.trips ?? []);
        setPage(1);
      } else {
        setTrips((prev) => [...prev, ...(data.trips ?? [])]);
      }
      setTotal(data.total ?? 0);
    } catch {}
    setLoading(false);
  }, [destination, style, budget, sort, page]);

  useEffect(() => { fetchTrips(true); }, [destination, style, budget, sort]);

  const handleSave = async (tripId: string) => {
    try {
      await fetch('/api/community/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicTripId: tripId }),
      });
      setSavedIds((prev) => new Set([...prev, tripId]));
    } catch {}
  };

  const handleUpvote = async (tripId: string) => {
    try {
      await fetch('/api/community/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicTripId: tripId }),
      });
      setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, upvotes: t.upvotes + 1 } : t));
    } catch {}
  };

  return (
    <div className="min-h-dvh bg-[#0A0F1E] px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl">Explore trips</h1>
          <p className="text-white/40 text-sm mt-1">Real itineraries planned by the Drift community</p>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-white/30" />
            <input value={destination} onChange={(e) => setDestination(e.target.value)}
              placeholder="Search destination..."
              className="w-full bg-[#141929] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/30" />
          </div>

          <div className="flex flex-wrap gap-2">
            {STYLE_FILTERS.map((s) => (
              <button key={s} onClick={() => setStyle(style === s ? '' : s)}
                className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all capitalize',
                  style === s ? 'bg-amber-500 text-black' : 'bg-white/8 text-white/50 hover:bg-white/15')}>
                {s}
              </button>
            ))}
            {BUDGET_FILTERS.map((b) => (
              <button key={b} onClick={() => setBudget(budget === b ? '' : b)}
                className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all capitalize',
                  budget === b ? 'bg-amber-500 text-black' : 'bg-white/8 text-white/50 hover:bg-white/15')}>
                {b}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {[['newest', <Clock key="c" size={11} />], ['trending', <TrendingUp key="t" size={11} />], ['most_saved', <Bookmark key="b" size={11} />]].map(([id, icon]) => (
              <button key={id as string} onClick={() => setSort(id as string)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  sort === id ? 'bg-amber-500 text-black' : 'bg-white/8 text-white/50 hover:bg-white/15')}>
                {icon} {(id as string).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {trips.map((trip, i) => (
            <motion.div key={trip.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="break-inside-avoid bg-[#141929] border border-white/8 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-[#1E293B] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, #1E2A4A, #0F172A)` }}>
                <p className="text-white/20 text-sm">{trip.cover_photo_query || trip.destination}</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-semibold text-sm">{trip.destination}</h3>
                  <p className="text-white/40 text-xs">{trip.country}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50">{trip.duration}d</span>
                  {trip.travel_style && <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50 capitalize">{trip.travel_style}</span>}
                  {trip.budget_tier && <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50 capitalize">{trip.budget_tier}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/40 text-xs">
                    <button onClick={() => handleUpvote(trip.id)} className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                      <Heart size={12} /> {trip.upvotes}
                    </button>
                    <span className="flex items-center gap-1"><Bookmark size={12} /> {trip.saves_count}</span>
                  </div>
                  <button onClick={() => handleSave(trip.id)} disabled={savedIds.has(trip.id)}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      savedIds.has(trip.id) ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25')}>
                    {savedIds.has(trip.id) ? 'Saved ✓' : 'Use this trip'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {!loading && trips.length < total && (
          <div className="flex justify-center mt-8">
            <button onClick={() => { setPage((p) => p + 1); fetchTrips(); }}
              className="px-6 py-2.5 rounded-xl bg-white/8 text-white/60 text-sm hover:bg-white/15 transition-colors">
              Load more
            </button>
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30">No trips found. Be the first to share one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
