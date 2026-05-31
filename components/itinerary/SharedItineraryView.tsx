'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DayCard } from './DayCard';
import { ItinerarySidebar } from './ItinerarySidebar';
import type { Itinerary } from '@/types';

interface SharedItineraryViewProps {
  itinerary: Itinerary;
  destination: string;
}

export function SharedItineraryView({ itinerary, destination }: SharedItineraryViewProps) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      return next;
    });
  };

  return (
    <div className="min-h-dvh" style={{ background: '#0A0F1E' }}>
      <header className="sticky top-0 z-20 bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            drift<span className="gradient-text">plan</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">Shared itinerary</span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-medium hover:bg-amber-400 transition-colors"
            >
              Plan your trip →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-white font-semibold text-2xl">{destination}</h1>
          <p className="text-white/40 text-sm mt-1">
            {itinerary.tripSummary.duration} days · {itinerary.budgetSummary.currency} {itinerary.budgetSummary.grandTotal.toLocaleString()} estimated
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            {itinerary.days.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                currency={itinerary.budgetSummary.currency}
                isOpen={openDays.has(day.dayNumber)}
                onToggle={() => toggleDay(day.dayNumber)}
              />
            ))}
          </div>
          <div className="lg:w-72 xl:w-80 shrink-0">
            <ItinerarySidebar itinerary={itinerary} />
          </div>
        </div>
      </main>
    </div>
  );
}
