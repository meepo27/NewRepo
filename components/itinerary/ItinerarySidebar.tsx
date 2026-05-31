'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plane, Hotel, FileText, Package, PieChart, Globe, Lightbulb } from 'lucide-react';
import type { Itinerary } from '@/types/planning';
import { EMBASSY_URLS } from '@/lib/affiliates';

type Tab = 'flights' | 'hotels' | 'visa' | 'budget' | 'packing' | 'tips';

const TABS = [
  { id: 'flights' as Tab, label: 'Flights', icon: <Plane size={14} /> },
  { id: 'hotels' as Tab, label: 'Hotels', icon: <Hotel size={14} /> },
  { id: 'visa' as Tab, label: 'Visa', icon: <Globe size={14} /> },
  { id: 'budget' as Tab, label: 'Budget', icon: <PieChart size={14} /> },
  { id: 'packing' as Tab, label: 'Packing', icon: <Package size={14} /> },
  { id: 'tips' as Tab, label: 'Tips', icon: <Lightbulb size={14} /> },
];

export function ItinerarySidebar({ itinerary }: { itinerary: Itinerary }) {
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  const { tripSummary, flights, accommodation, budgetSummary, packingList, visaReminder, localTips } = itinerary;
  const embassyUrl = EMBASSY_URLS[tripSummary.country] ?? null;

  const budgetRows = [
    { label: 'Accommodation', amount: budgetSummary.accommodation },
    { label: 'Food & dining', amount: budgetSummary.food },
    { label: 'Activities', amount: budgetSummary.activities },
    { label: 'Local transport', amount: budgetSummary.localTransport },
    { label: 'Miscellaneous', amount: budgetSummary.miscellaneous },
    { label: 'Flights estimate', amount: budgetSummary.flightsEstimate },
  ];

  return (
    <div className="bg-[#0d1426] rounded-2xl border border-white/8 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/8 overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-amber-400 border-b-2 border-amber-400 -mb-px'
                : 'text-white/40 hover:text-white/70'
            }`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'flights' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Outbound */}
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-wide">Outbound</p>
              <p className="text-white/70 text-sm">
                {flights.outbound.from} → {flights.outbound.to}
              </p>
              <p className="text-white/40 text-xs">{flights.outbound.date}</p>
              <div className="space-y-2">
                <a href={flights.outbound.skyscannerLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-xs font-medium">
                  Skyscanner <ExternalLink size={12} />
                </a>
                <a href={flights.outbound.makemytripLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-medium">
                  MakeMyTrip <ExternalLink size={12} />
                </a>
                <a href={flights.outbound.googleFlightsLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors text-xs font-medium">
                  Google Flights <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Return */}
            <div className="space-y-2 pt-3 border-t border-white/8">
              <p className="text-white/40 text-xs uppercase tracking-wide">Return</p>
              <p className="text-white/70 text-sm">
                {flights.return.from} → {flights.return.to}
              </p>
              <p className="text-white/40 text-xs">{flights.return.date}</p>
              <a href={flights.return.skyscannerLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-xs font-medium">
                Skyscanner <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        )}

        {activeTab === 'hotels' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {(['budget', 'mid', 'luxury'] as const).map((tier) => {
              const hotel = accommodation[tier];
              return (
                <div key={tier} className="space-y-2 pb-3 border-b border-white/8 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm capitalize">{tier}</p>
                    <span className="text-amber-400/70 text-xs">
                      {budgetSummary.currency} {hotel.pricePerNight}/night
                    </span>
                  </div>
                  <p className="text-white/60 text-xs">{hotel.name}</p>
                  <p className="text-white/40 text-xs">{hotel.type}</p>
                  <div className="flex gap-2">
                    <a href={hotel.bookingComLink} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                      Booking.com <ExternalLink size={10} />
                    </a>
                    <a href={hotel.airbnbLink} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs hover:bg-pink-500/20 transition-colors">
                      Airbnb <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'visa' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <p className="text-white/70 text-sm leading-relaxed">{visaReminder}</p>
            {embassyUrl && (
              <a href={embassyUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-amber-400 text-xs hover:text-amber-300 transition-colors">
                Embassy website <ExternalLink size={11} />
              </a>
            )}
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {budgetRows.map(({ label, amount }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-white/60">{label}</span>
                <span className="text-white">
                  {budgetSummary.currency} {amount.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 mt-2 border-t border-white/10 font-semibold">
              <span className="text-white/80">Total</span>
              <span className="text-amber-400">
                {budgetSummary.currency} {budgetSummary.grandTotal.toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}

        {activeTab === 'packing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {(['essentials', 'clothing', 'documents', 'health'] as const).map((cat) => {
              const items = packingList[cat];
              if (!items?.length) return null;
              return (
                <div key={cat}>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-2 capitalize">{cat}</p>
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'tips' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ul className="space-y-3">
              {localTips?.map((tip, i) => (
                <li key={i} className="text-white/65 text-sm leading-relaxed flex gap-2">
                  <span className="text-amber-400/70 shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
