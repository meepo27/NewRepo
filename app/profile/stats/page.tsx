'use client';

import { useState, useEffect } from 'react';
import { Globe, TrendingUp, Calendar, DollarSign, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCountryFromDestination, POPULAR_DESTINATIONS } from '@/lib/countryUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO alpha-2 to numeric (subset for world map)
const ALPHA2_TO_NUMERIC: Record<string, string> = {
  FR: '250', GB: '826', DE: '276', IT: '380', ES: '724',
  TH: '764', JP: '392', IN: '356', SG: '702', AU: '036',
  US: '840', AE: '784', MV: '462', VN: '704', ID: '360',
  MY: '458', KR: '410', GR: '300', NL: '528', PT: '620',
  AT: '040', CH: '756', CZ: '203', HU: '348', HR: '191',
  TR: '792', EG: '818', MA: '504', ZA: '710', KE: '404',
  CA: '124', MX: '484', BR: '076', AR: '032', PE: '604',
  NZ: '554', IS: '352', IE: '372', BE: '056', PL: '616',
  SE: '752', NO: '578', DK: '208', FI: '246', NP: '524',
  LK: '144', QA: '634', TW: '158', PH: '608', HK: '344',
};

interface TripRow {
  destination: string;
  dates: string;
  budget: number;
  itinerary_data: { tripSummary?: { duration?: number; travelStyle?: string }; budgetSummary?: { currency?: string } } | null;
}

export default function StatsPage() {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitedCodes, setVisitedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from('trips').select('destination, dates, budget, itinerary_data')
        .eq('user_id', user.id).eq('status', 'saved')
        .then(({ data }) => {
          setTrips((data ?? []) as TripRow[]);
          const codes = new Set<string>();
          for (const t of data ?? []) {
            const info = getCountryFromDestination(t.destination);
            if (info) codes.add(info.countryCode);
          }
          setVisitedCodes(codes);
          setLoading(false);
        });
    });
  }, []);

  if (loading) return <div className="min-h-dvh bg-[#0A0F1E] flex items-center justify-center"><div className="text-white/40">Loading stats...</div></div>;

  const totalCountries = visitedCodes.size;
  const totalDays = trips.reduce((sum, t) => sum + (t.itinerary_data?.tripSummary?.duration ?? 0), 0);
  const totalSpend = trips.reduce((sum, t) => sum + (t.budget ?? 0), 0);
  const avgDuration = trips.length > 0 ? Math.round(totalDays / trips.length) : 0;

  // Style breakdown
  const styleMap: Record<string, number> = {};
  for (const t of trips) {
    const s = t.itinerary_data?.tripSummary?.travelStyle ?? 'unknown';
    styleMap[s] = (styleMap[s] ?? 0) + 1;
  }
  const styleData = Object.entries(styleMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // Region breakdown
  const regionMap: Record<string, number> = {};
  for (const t of trips) {
    const info = getCountryFromDestination(t.destination);
    if (!info) continue;
    const region = getRegion(info.countryCode);
    regionMap[region] = (regionMap[region] ?? 0) + 1;
  }
  const regionData = Object.entries(regionMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // Carbon estimate (very rough: assume average 5000 km per trip, 0.255 kg/km)
  const carbonKg = Math.round(trips.length * 5000 * 0.255);

  const visitedNumericCodes = new Set(
    [...visitedCodes].map((c) => ALPHA2_TO_NUMERIC[c]).filter(Boolean)
  );

  const statCards = [
    { icon: <Globe size={16} className="text-amber-400" />, label: 'Countries visited', value: String(totalCountries) },
    { icon: <Calendar size={16} className="text-amber-400" />, label: 'Total days traveled', value: String(totalDays) },
    { icon: <TrendingUp size={16} className="text-amber-400" />, label: 'Trips saved', value: String(trips.length) },
    { icon: <DollarSign size={16} className="text-amber-400" />, label: 'Avg trip duration', value: `${avgDuration}d` },
    { icon: <DollarSign size={16} className="text-amber-400" />, label: 'Total estimated spend', value: `$${totalSpend.toLocaleString()}` },
    { icon: <Leaf size={16} className="text-amber-400" />, label: 'Carbon footprint est.', value: `${carbonKg.toLocaleString()} kg CO₂` },
  ];

  return (
    <div className="min-h-dvh bg-[#0A0F1E] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl">Your Travel Stats</h1>
          <p className="text-white/40 text-sm mt-1">Based on {trips.length} saved trip{trips.length !== 1 ? 's' : ''}</p>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <Globe size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Save your first trip to see stats</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {statCards.map((s) => (
                <div key={s.label} className="bg-[#141929] border border-white/8 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-white/40 text-xs">{s.label}</span></div>
                  <p className="text-white font-bold text-xl">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Carbon context */}
            <div className="bg-[#141929] border border-white/8 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1"><Leaf size={14} className="text-green-400" /><span className="text-white/60 text-sm">Carbon footprint</span></div>
              <p className="text-white font-bold text-2xl mb-1">{carbonKg.toLocaleString()} kg CO₂</p>
              <p className="text-white/40 text-xs">Estimated from flight distances (≈ {Math.round(carbonKg / 52)} weeks of average car driving)</p>
              <div className="mt-2 h-2 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(100, (carbonKg / 10000) * 100)}%`,
                  background: carbonKg > 5000 ? '#EF4444' : carbonKg > 2000 ? '#F59E0B' : '#22C55E',
                }} />
              </div>
            </div>

            {/* World map */}
            <div className="bg-[#141929] border border-white/8 rounded-xl p-4">
              <h2 className="text-white font-medium text-sm mb-4">Countries visited ({totalCountries})</h2>
              <div className="h-48">
                <ComposableMap projectionConfig={{ scale: 120 }} style={{ width: '100%', height: '100%' }}>
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isVisited = visitedNumericCodes.has(geo.id);
                        return (
                          <Geography key={geo.rsmKey} geography={geo}
                            fill={isVisited ? '#F59E0B' : '#1E293B'}
                            stroke="#0A0F1E"
                            strokeWidth={0.3}
                            style={{ default: { outline: 'none' }, hover: { fill: isVisited ? '#FCD34D' : '#334155', outline: 'none' } }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>
            </div>

            {/* Charts */}
            {styleData.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#141929] border border-white/8 rounded-xl p-4">
                  <h2 className="text-white font-medium text-sm mb-4">Travel styles</h2>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={styleData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} width={70} />
                      <Tooltip contentStyle={{ background: '#141929', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {styleData.map((_, i) => <Cell key={i} fill="#F59E0B" fillOpacity={1 - i * 0.15} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {regionData.length > 0 && (
                  <div className="bg-[#141929] border border-white/8 rounded-xl p-4">
                    <h2 className="text-white font-medium text-sm mb-4">Regions explored</h2>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={regionData} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} width={70} />
                        <Tooltip contentStyle={{ background: '#141929', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {regionData.map((_, i) => <Cell key={i} fill="#60A5FA" fillOpacity={1 - i * 0.15} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getRegion(code: string): string {
  const asia = ['TH','JP','SG','MY','ID','VN','KR','HK','PH','TW','IN','BD','LK','NP','MV','KH','LA','MM','MO'];
  const europe = ['FR','GB','DE','IT','ES','NL','PT','GR','AT','CH','CZ','HU','HR','BE','PL','SE','NO','DK','FI','IE','IS','TR'];
  const middleEast = ['AE','QA','SA','BH','OM','KW','JO','IL'];
  const africa = ['MA','EG','ZA','KE','TZ','GH','NG','ET','ZW','ZM','MZ','RW','TN'];
  const americas = ['US','CA','MX','BR','AR','PE','CO','CL','CU','JM','PA','UY'];
  const oceania = ['AU','NZ'];
  if (asia.includes(code)) return 'Asia';
  if (europe.includes(code)) return 'Europe';
  if (middleEast.includes(code)) return 'Middle East';
  if (africa.includes(code)) return 'Africa';
  if (americas.includes(code)) return 'Americas';
  if (oceania.includes(code)) return 'Oceania';
  return 'Other';
}
