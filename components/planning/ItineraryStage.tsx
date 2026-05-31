'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, BookmarkPlus, FileDown } from 'lucide-react';
import { usePlanningStore } from '@/store/planningStore';
import { DayCard } from '@/components/itinerary/DayCard';
import { ItinerarySidebar } from '@/components/itinerary/ItinerarySidebar';
import { RefineChatBar } from '@/components/itinerary/RefineChatBar';
import { formatDateRange } from '@/lib/utils';
import { SaveShareModal } from './SaveShareModal';

export function ItineraryStage() {
  const store = usePlanningStore();
  const itinerary = store.itinerary;
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!itinerary) {
    store.setStage('builder');
    return null;
  }

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      return next;
    });
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.setFontSize(22);
    doc.setTextColor(245, 166, 35);
    doc.text('Driftplan', 15, 20);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${itinerary.destination}, ${itinerary.country}`, 15, 32);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const config = store.tripConfig;
    if (config.startDate && config.endDate) {
      doc.text(formatDateRange(config.startDate, config.endDate), 15, 40);
    }

    let y = 50;
    for (const day of itinerary.days) {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Day ${day.dayNumber}: ${day.theme}`, 15, y);
      y += 6;

      const allActivities = [...day.morning, ...day.afternoon, ...day.evening];
      for (const act of allActivities) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text(`• ${act.name}`, 20, y);
        y += 5;
      }
      y += 4;
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Total estimated cost: ${itinerary.currency} ${itinerary.totalEstimatedCost.toLocaleString()}`, 15, y + 5);

    doc.save(`driftplan-${itinerary.destination.toLowerCase().replace(/\s/g, '-')}.pdf`);
  };

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => store.setStage('builder')}
              className="text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-white font-semibold text-base leading-tight">
                {itinerary.destination}
              </h1>
              <p className="text-white/40 text-xs">
                {itinerary.totalDays} days · {itinerary.currency} {itinerary.totalEstimatedCost.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="w-9 h-9 rounded-xl bg-white/8 text-white/60 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all"
              title="Export PDF"
            >
              <FileDown size={16} />
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 text-amber-400 text-sm hover:bg-amber-500/25 transition-all border border-amber-500/30"
            >
              <BookmarkPlus size={14} />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-9 h-9 rounded-xl bg-white/8 text-white/60 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all"
              title="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div ref={printRef} className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Day-by-day itinerary */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Your itinerary</h2>
              <button
                onClick={() => {
                  if (openDays.size === itinerary.days.length) {
                    setOpenDays(new Set());
                  } else {
                    setOpenDays(new Set(itinerary.days.map((d) => d.dayNumber)));
                  }
                }}
                className="text-white/40 text-xs hover:text-white transition-colors"
              >
                {openDays.size === itinerary.days.length ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            {itinerary.days.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                currency={itinerary.currency}
                isOpen={openDays.has(day.dayNumber)}
                onToggle={() => toggleDay(day.dayNumber)}
              />
            ))}

            {/* Refine chat */}
            <div className="pt-4">
              <p className="text-white/30 text-xs mb-2">Want to make changes?</p>
              <RefineChatBar />
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:w-72 xl:w-80 shrink-0">
            <ItinerarySidebar itinerary={itinerary} />
          </div>
        </div>
      </div>

      {showSaveModal && (
        <SaveShareModal itinerary={itinerary} onClose={() => setShowSaveModal(false)} />
      )}
    </div>
  );
}
