'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { COUNTRY_TO_CURRENCY } from '@/lib/countryUtils';

const COMMON_PAIRS = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'SGD', 'AED', 'THB', 'MYR'];

interface Props {
  destinationCountryCode?: string;
  userCurrency?: string;
}

export function CurrencyConverter({ destinationCountryCode, userCurrency = 'USD' }: Props) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [base, setBase] = useState(userCurrency);
  const [target, setTarget] = useState('USD');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);

  // Auto-set target to destination currency
  useEffect(() => {
    if (destinationCountryCode) {
      const destCurrency = COUNTRY_TO_CURRENCY[destinationCountryCode];
      if (destCurrency) setTarget(destCurrency);
    }
  }, [destinationCountryCode]);

  const fetchRates = useCallback(async (currency: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tools/currency?base=${currency}`);
      const data = await res.json();
      setRates(data.rates ?? {});
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchRates(base); }, [base, fetchRates]);

  const converted = rates[target] ? (parseFloat(amount || '0') * rates[target]).toFixed(2) : '—';
  const topPairs = COMMON_PAIRS.filter((c) => c !== base).slice(0, 5);

  return (
    <div className="bg-[#141929] border border-white/8 rounded-2xl p-4 space-y-4">
      <h3 className="text-white font-medium text-sm">Currency Converter</h3>

      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-white/40 text-xs">From</label>
          <div className="flex gap-2">
            <select value={base} onChange={(e) => setBase(e.target.value)}
              className="bg-[#0A0F1E] border border-white/10 rounded-lg px-2 py-2 text-white text-xs focus:outline-none">
              {COMMON_PAIRS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-[#0A0F1E] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
          </div>
        </div>

        <button onClick={() => { const tmp = base; setBase(target); setTarget(tmp); }}
          className="mt-5 p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
          <ArrowLeftRight size={14} />
        </button>

        <div className="flex-1 space-y-1">
          <label className="text-white/40 text-xs">To</label>
          <div className="flex gap-2">
            <select value={target} onChange={(e) => setTarget(e.target.value)}
              className="bg-[#0A0F1E] border border-white/10 rounded-lg px-2 py-2 text-white text-xs focus:outline-none">
              {COMMON_PAIRS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="flex-1 bg-[#0A0F1E] border border-amber-500/30 rounded-lg px-3 py-2 text-amber-400 text-sm font-medium">
              {loading ? '...' : converted}
            </div>
          </div>
        </div>
      </div>

      {/* Quick pairs */}
      <div className="space-y-1.5">
        <p className="text-white/40 text-xs">Quick reference</p>
        <div className="grid grid-cols-2 gap-1">
          {topPairs.map((c) => (
            <div key={c} className="flex justify-between text-xs">
              <span className="text-white/50">1 {base} =</span>
              <span className="text-white">{rates[c] ? rates[c].toFixed(4) : '—'} {c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate links */}
      <div className="space-y-1.5 pt-2 border-t border-white/8">
        {/* TODO_AFFILIATE_TAG: https://wise.com/invite/TODO_AFFILIATE_TAG */}
        <a href="https://wise.com/invite/TODO_AFFILIATE_TAG" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <span>Get the best travel exchange rate →</span>
          <span className="text-white/30">Wise</span>
        </a>
        {/* Niyo for Indian users */}
        <a href="https://www.niyo.com/" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-green-400 hover:text-green-300 transition-colors">
          <span>Zero forex card for Indian travellers →</span>
          <span className="text-white/30">Niyo</span>
        </a>
      </div>
    </div>
  );
}
