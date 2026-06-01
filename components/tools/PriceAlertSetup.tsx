'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface PriceAlert {
  id: string;
  alert_type: 'flight' | 'hotel';
  destination: string;
  travel_date: string;
  origin?: string;
  target_price: number;
  currency: string;
  is_active: boolean;
}

interface Props {
  tripId?: string;
  destination?: string;
  travelDate?: string;
  origin?: string;
  currency?: string;
}

export function PriceAlertSetup({ tripId, destination = '', travelDate = '', origin = '', currency = 'USD' }: Props) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [type, setType] = useState<'flight' | 'hotel'>('flight');
  const [targetPrice, setTargetPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    supabase.from('price_alerts').select('*').eq('trip_id', tripId).eq('is_active', true)
      .then(({ data }) => setAlerts(data ?? []));
  }, [tripId]);

  const handleSave = async () => {
    if (!targetPrice) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { data } = await supabase.from('price_alerts').insert({
      user_id: user.id,
      trip_id: tripId,
      alert_type: type,
      destination,
      travel_date: travelDate || null,
      origin: origin || null,
      target_price: parseFloat(targetPrice),
      currency,
      is_active: true,
      // TODO_PRICE_MONITORING: cron job reads is_active alerts and checks prices via Skyscanner / Booking.com APIs
    }).select().single();

    if (data) {
      setAlerts((prev) => [...prev, data as PriceAlert]);
      setTargetPrice('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('price_alerts').update({ is_active: false }).eq('id', id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-[#141929] border border-white/8 rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Bell size={14} className="text-amber-400" />
        <h3 className="text-white font-medium text-sm">Price Alerts</h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {(['flight', 'hotel'] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                type === t ? 'bg-amber-500 text-black' : 'bg-white/8 text-white/60 hover:bg-white/15')}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-white/40 text-xs">Target price ({currency})</label>
            <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 250"
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
          </div>
          <button onClick={handleSave} disabled={saving || !targetPrice}
            className="mt-5 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <Plus size={14} /> Set Alert
          </button>
        </div>

        {saved && (
          <p className="text-green-400 text-xs">
            We'll notify you when prices drop below your target ✓
          </p>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/8">
          <p className="text-white/40 text-xs">Active alerts</p>
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-white/70 text-xs capitalize">{alert.alert_type} · {alert.destination}</p>
                <p className="text-amber-400 text-xs">Below {alert.currency} {alert.target_price}</p>
              </div>
              <button onClick={() => handleDelete(alert.id)}
                className="text-white/30 hover:text-white/60 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
