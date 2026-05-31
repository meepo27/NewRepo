'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Calendar, LogOut, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDateRange } from '@/lib/utils';
import { DriftThinking } from '@/components/ui/DriftThinking';

interface TripRow {
  id: string;
  destination: string;
  dates: string;
  travelers: number;
  budget: number;
  status: string;
  share_token: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      setUserEmail(user.email ?? '');

      const res = await fetch('/api/trips');
      const data = await res.json();
      if (data.trips) setTrips(data.trips);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const parseDate = (dates: string) => {
    const [start, end] = dates.split(':');
    return { start, end };
  };

  return (
    <div className="min-h-dvh" style={{ background: '#0A0F1E' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(245,166,35,0.06) 0%, transparent 50%)' }} />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            drift<span className="gradient-text">plan</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm hidden sm:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-semibold text-2xl">My Trips</h1>
            <p className="text-white/40 text-sm mt-1">
              {trips.length} saved {trips.length === 1 ? 'trip' : 'trips'}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors"
          >
            <Plus size={15} />
            New trip
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <DriftThinking message="Loading your trips..." />
          </div>
        ) : trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4">🗺️</p>
            <h2 className="text-white font-medium text-lg mb-2">No trips yet</h2>
            <p className="text-white/40 text-sm mb-6">Start planning your first adventure</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
            >
              <Plus size={16} />
              Plan a trip
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trips.map((trip, i) => {
              const { start, end } = parseDate(trip.dates);
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-[#141929] border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-all card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{trip.destination}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        trip.status === 'shared' ? 'bg-green-900/40 text-green-400' : 'bg-white/8 text-white/40'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                    {trip.share_token && (
                      <a
                        href={`/trip/${trip.share_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors"
                      >
                        View shared →
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm text-white/50">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} />
                      {start && end ? formatDateRange(start, end) : trip.dates}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} />
                      {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
                    <span className="text-amber-400/70 text-sm font-medium">
                      {trip.budget.toLocaleString()}
                    </span>
                    <span className="text-white/30 text-xs">
                      {new Date(trip.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
