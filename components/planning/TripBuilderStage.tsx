'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Minus, Plus, Sunset, Zap, Landmark, Utensils,
  Mountain, Heart, Calendar,
} from 'lucide-react';
import { usePlanningStore, PlanningStage } from '@/store/planningStore';
import { usePlanningSession } from '@/hooks/usePlanningSession';
import type { TripConfig } from '@/types/planning';
import { cn } from '@/lib/utils';

const CURRENCIES = ['USD', 'INR', 'GBP', 'EUR', 'AUD', 'SGD', 'AED'] as const;
type Currency = (typeof CURRENCIES)[number];

const BUDGET_TIERS = [
  { id: 'budget' as const, label: 'Budget', desc: 'Under $50/day' },
  { id: 'mid' as const, label: 'Mid-range', desc: '$50–150/day' },
  { id: 'luxury' as const, label: 'Luxury', desc: '$150+/day' },
];

const TRIP_STYLES: { id: string; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'relaxed', label: 'Relaxed', icon: <Sunset size={20} />, desc: 'Slow travel, good coffee' },
  { id: 'active', label: 'Active', icon: <Zap size={20} />, desc: 'Hike, swim, explore' },
  { id: 'cultural', label: 'Cultural', icon: <Landmark size={20} />, desc: 'Museums, history, art' },
  { id: 'foodie', label: 'Foodie', icon: <Utensils size={20} />, desc: 'Markets, local eats' },
  { id: 'adventure', label: 'Adventure', icon: <Mountain size={20} />, desc: 'Off the beaten path' },
  { id: 'romantic', label: 'Romantic', icon: <Heart size={20} />, desc: 'Sunsets and candlelight' },
];

const PASSPORT_COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Australia', 'Singapore',
  'UAE', 'Canada', 'Germany', 'France', 'Japan', 'Other',
];

function CounterInput({ label, value, onChange, min = 0, max = 20 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70 text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <Minus size={14} />
        </button>
        <span className="text-white w-4 text-center font-medium">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export function TripBuilderStage() {
  const store = usePlanningStore();
  const { generateItinerary } = usePlanningSession();
  const destination = store.selectedDestination;

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(nextWeek);
  const [endDate, setEndDate] = useState(twoWeeks);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [totalBudget, setTotalBudget] = useState(3000);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [travelStyle, setTravelStyle] = useState('relaxed');
  const [startingCity, setStartingCity] = useState('');
  const [startingCityIATA, setStartingCityIATA] = useState('');
  const [preferences, setPreferences] = useState('');
  const [passportCountry, setPassportCountry] = useState(
    store.userProfile.passportCountry || 'India'
  );

  if (!destination) {
    store.setStage(PlanningStage.DISCOVERY);
    return null;
  }

  const getDurationDays = () => {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    store.setUserProfile({ passportCountry });

    const config: TripConfig = {
      travelDates: { from: startDate, to: endDate, durationDays: getDurationDays() },
      travelers: { adults, children },
      budget: { currency, totalBudget, tier: budgetTier },
      travelStyle,
      startingCity: startingCity || 'home city',
      startingCityIATA: startingCityIATA.toUpperCase() || 'XXX',
      preferences,
    };

    await generateItinerary(config);
  };

  return (
    <div className="min-h-dvh px-4 py-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => store.setStage(PlanningStage.SHORTLIST)}
            className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-semibold text-xl">Plan your trip</h1>
            <p className="text-amber-400 text-sm">{destination.name}, {destination.country}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dates */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#141929] rounded-2xl p-5 border border-white/8 space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" /> Travel dates
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs">Departure</label>
                <input type="date" value={startDate} min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs">Return</label>
                <input type="date" value={endDate} min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>
          </motion.div>

          {/* Travelers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-[#141929] rounded-2xl p-5 border border-white/8 space-y-4">
            <h2 className="text-white font-medium">Travelers</h2>
            <CounterInput label="Adults" value={adults} onChange={setAdults} min={1} />
            <CounterInput label="Children" value={children} onChange={setChildren} />
          </motion.div>

          {/* Budget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#141929] rounded-2xl p-5 border border-white/8 space-y-4">
            <h2 className="text-white font-medium">Budget</h2>
            <div className="flex gap-2 flex-wrap">
              {CURRENCIES.map((c) => (
                <button key={c} type="button" onClick={() => setCurrency(c)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    currency === c ? 'bg-amber-500 text-black' : 'bg-white/8 text-white/60 hover:bg-white/15')}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_TIERS.map((t) => (
                <button key={t.id} type="button" onClick={() => setBudgetTier(t.id)}
                  className={cn('p-3 rounded-xl border text-left transition-all',
                    budgetTier === t.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/8 hover:border-white/20')}>
                  <span className={cn('text-sm font-medium block', budgetTier === t.id ? 'text-amber-400' : 'text-white')}>
                    {t.label}
                  </span>
                  <span className="text-white/40 text-xs">{t.desc}</span>
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Total trip budget ({currency})</label>
              <input type="number" value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="3000" />
            </div>
          </motion.div>

          {/* Trip style */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-[#141929] rounded-2xl p-5 border border-white/8 space-y-4">
            <h2 className="text-white font-medium">Trip style</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRIP_STYLES.map(({ id, label, icon, desc }) => (
                <button key={id} type="button" onClick={() => setTravelStyle(id)}
                  className={cn('p-3 rounded-xl border text-left transition-all duration-200',
                    travelStyle === id ? 'border-amber-500 bg-amber-500/10' : 'border-white/8 bg-white/4 hover:border-white/20')}>
                  <span className={cn('block mb-1', travelStyle === id ? 'text-amber-400' : 'text-white/60')}>{icon}</span>
                  <span className="text-white text-sm font-medium">{label}</span>
                  <span className="text-white/40 text-xs block">{desc}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-[#141929] rounded-2xl p-5 border border-white/8 space-y-4">
            <h2 className="text-white font-medium">Your details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs">Flying from (city)</label>
                <input type="text" value={startingCity} onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs">Airport code (IATA)</label>
                <input type="text" value={startingCityIATA}
                  onChange={(e) => setStartingCityIATA(e.target.value.toUpperCase())}
                  placeholder="e.g. BOM"
                  maxLength={3}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/30" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Passport country</label>
              <select value={passportCountry} onChange={(e) => setPassportCountry(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
                {PASSPORT_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Any preferences? (optional)</label>
              <input type="text" value={preferences} onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. vegetarian food, no early mornings, beach access"
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/30" />
            </div>
          </motion.div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            type="submit"
            className="w-full py-4 rounded-2xl bg-amber-500 text-black font-semibold text-base hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
            Build My Trip <ArrowRight size={18} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
