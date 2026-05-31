'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plane, Hotel, FileText, Package, PieChart, Globe } from 'lucide-react';
import type { Itinerary } from '@/types';
import { getSkyscannerFlightUrl, getBookingHotelUrl, EMBASSY_URLS } from '@/lib/affiliates';
import { formatCurrency } from '@/lib/utils';

type Tab = 'flights' | 'hotels' | 'visa' | 'budget' | 'packing';

interface ItinerarySidebarProps {
  itinerary: Itinerary;
}

const TABS = [
  { id: 'flights' as Tab, label: 'Flights', icon: <Plane size={14} /> },
  { id: 'hotels' as Tab, label: 'Hotels', icon: <Hotel size={14} /> },
  { id: 'visa' as Tab, label: 'Visa', icon: <Globe size={14} /> },
  { id: 'budget' as Tab, label: 'Budget', icon: <PieChart size={14} /> },
  { id: 'packing' as Tab, label: 'Packing', icon: <Package size={14} /> },
];

export function ItinerarySidebar({ itinerary }: ItinerarySidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  const flightUrl = getSkyscannerFlightUrl(
    itinerary.flightInfo.origin,
    itinerary.flightInfo.destination,
    itinerary.flightInfo.departureDate,
    itinerary.flightInfo.returnDate
  );

  const hotelUrl = getBookingHotelUrl(
    itinerary.hotelInfo.destination,
    itinerary.hotelInfo.checkin,
    itinerary.hotelInfo.checkout
  );

  const embassyUrl = EMBASSY_URLS[itinerary.country] ?? itinerary.visaInfo.embassyUrl;

  const budgetRows = [
    { label: 'Flights', amount: itinerary.budgetBreakdown.flights },
    { label: 'Accommodation', amount: itinerary.budgetBreakdown.accommodation },
    { label: 'Food & dining', amount: itinerary.budgetBreakdown.food },
    { label: 'Activities', amount: itinerary.budgetBreakdown.activities },
    { label: 'Local transport', amount: itinerary.budgetBreakdown.transport },
    { label: 'Miscellaneous', amount: itinerary.budgetBreakdown.misc },
  ];

  return (
    <div className="bg-[#0d1426] rounded-2xl border border-white/8 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-white/8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-amber-400 border-b-2 border-amber-400 -mb-px'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'flights' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <p className="text-white/60 text-sm">
              Flying from <span className="text-white">{itinerary.flightInfo.origin}</span> to{' '}
              <span className="text-white">{itinerary.flightInfo.destination}</span>
            </p>
            <p className="text-white/40 text-xs">
              {itinerary.flightInfo.departureDate} → {itinerary.flightInfo.returnDate}
            </p>
            <a
              href={flightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-medium"
            >
              Find Flights on Skyscanner
              <ExternalLink size={14} />
            </a>
          </motion.div>
        )}

        {activeTab === 'hotels' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <p className="text-white/60 text-sm">
              Accommodation in <span className="text-white">{itinerary.hotelInfo.destination}</span>
            </p>
            <p className="text-white/40 text-xs">
              Check-in: {itinerary.hotelInfo.checkin} · Checkout: {itinerary.hotelInfo.checkout}
            </p>
            <a
              href={hotelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium"
            >
              Find Hotels on Booking.com
              <ExternalLink size={14} />
            </a>
          </motion.div>
        )}

        {activeTab === 'visa' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                !itinerary.visaInfo.required
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-amber-900/50 text-amber-400'
              }`}>
                {itinerary.visaInfo.required ? itinerary.visaInfo.type : 'Visa not required'}
              </span>
            </div>
            {itinerary.visaInfo.required && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Processing time</span>
                  <span className="text-white">{itinerary.visaInfo.processingTime}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Fee</span>
                  <span className="text-white">{itinerary.visaInfo.fee}</span>
                </div>
              </div>
            )}
            <p className="text-white/50 text-xs leading-relaxed">{itinerary.visaInfo.notes}</p>
            {embassyUrl && (
              <a
                href={embassyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-amber-400 text-xs hover:text-amber-300 transition-colors"
              >
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
                <span className="text-white">{formatCurrency(amount, itinerary.currency)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 mt-2 border-t border-white/10 font-semibold">
              <span className="text-white/80">Total</span>
              <span className="text-amber-400">{formatCurrency(itinerary.totalEstimatedCost, itinerary.currency)}</span>
            </div>
          </motion.div>
        )}

        {activeTab === 'packing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ul className="space-y-2">
              {itinerary.packingList.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
