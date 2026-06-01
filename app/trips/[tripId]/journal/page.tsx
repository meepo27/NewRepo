'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DriftThinking } from '@/components/ui/DriftThinking';

const MOODS = [
  { id: 'great', emoji: '😄', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'rough', emoji: '😓', label: 'Rough' },
] as const;

type Mood = (typeof MOODS)[number]['id'];

interface JournalEntry {
  id: string;
  day_number: number;
  content: string;
  mood: Mood | null;
  photo_urls: string[];
}

interface Props {
  params: Promise<{ tripId: string }>;
}

export default function JournalPage({ params }: Props) {
  const { tripId } = use(params);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [dayCount, setDayCount] = useState(7);
  const [saving, setSaving] = useState(false);
  const [memoir, setMemoir] = useState<{ memoir: string; tripTitle: string; standoutMoment: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    supabase.from('journal_entries').select('*').eq('trip_id', tripId)
      .then(({ data }) => setEntries(data ?? []));
    supabase.from('trips').select('itinerary_data').eq('id', tripId).single()
      .then(({ data }) => {
        const dur = (data?.itinerary_data as { tripSummary?: { duration?: number } })?.tripSummary?.duration;
        if (dur) setDayCount(dur);
      });
  }, [tripId]);

  const loadDay = (day: number) => {
    setActiveDay(day);
    const existing = entries.find((e) => e.day_number === day);
    setContent(existing?.content ?? '');
    setMood(existing?.mood ?? null);
  };

  const handleSave = async () => {
    if (activeDay === null) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { data } = await supabase.from('journal_entries').upsert({
      trip_id: tripId,
      user_id: user.id,
      day_number: activeDay,
      content,
      mood,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'trip_id,day_number' }).select().single();

    if (data) {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.day_number === activeDay);
        if (idx >= 0) { const next = [...prev]; next[idx] = data as JournalEntry; return next; }
        return [...prev, data as JournalEntry];
      });
    }
    setSaving(false);
  };

  const handleGenerateMemoir = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/plan/journalsummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journalEntries: entries, tripId }),
      });
      const data = await res.json();
      setMemoir(data);
    } catch {}
    setGenerating(false);
  };

  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className="min-h-dvh bg-[#0A0F1E] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen size={20} className="text-amber-400" />
          <div>
            <h1 className="text-white font-semibold text-xl">Trip Journal</h1>
            <p className="text-white/40 text-sm">Capture your memories day by day</p>
          </div>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {days.map((d) => {
            const entry = entries.find((e) => e.day_number === d);
            return (
              <button key={d} onClick={() => loadDay(d)}
                className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all ${
                  activeDay === d ? 'bg-amber-500 text-black' :
                  entry ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                  'bg-white/8 text-white/50 hover:bg-white/15'
                }`}>
                <span className="text-[10px]">Day</span>
                <span>{d}</span>
                {entry?.mood && <span className="text-[10px]">{MOODS.find((m) => m.id === entry.mood)?.emoji}</span>}
              </button>
            );
          })}
        </div>

        {activeDay !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#141929] border border-white/8 rounded-2xl p-5 space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium">Day {activeDay}</h2>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button key={m.id} onClick={() => setMood(m.id)}
                    title={m.label}
                    className={`text-xl p-1 rounded-lg transition-all ${mood === m.id ? 'bg-amber-500/20 scale-110' : 'opacity-40 hover:opacity-70'}`}>
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Write about your day... What did you see? Who did you meet? What surprised you?"
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/20 resize-none" />

            {/* Photo placeholder */}
            <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center">
              <Plus size={16} className="text-white/20 mx-auto mb-1" />
              <p className="text-white/30 text-xs">Add photos (up to 5)</p>
              <p className="text-white/20 text-xs">Photo upload requires Supabase Storage configuration</p>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save entry'}
            </button>
          </motion.div>
        )}

        {/* AI Memoir */}
        {entries.length >= 3 && (
          <div className="bg-[#141929] border border-white/8 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <h2 className="text-white font-medium">AI Travel Memoir</h2>
            </div>

            {!memoir && !generating && (
              <div>
                <p className="text-white/50 text-sm mb-4">Turn your journal entries into a beautiful travel story.</p>
                <button onClick={handleGenerateMemoir}
                  className="w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium text-sm hover:bg-amber-500/25 transition-colors">
                  Generate my memoir
                </button>
              </div>
            )}

            {generating && <DriftThinking message="Writing your travel story..." />}

            {memoir && (
              <div className="space-y-4">
                <h3 className="text-amber-400 font-semibold text-lg italic">"{memoir.tripTitle}"</h3>
                {memoir.memoir.split('\n\n').map((para, i) => (
                  <p key={i} className="text-white/70 text-sm leading-relaxed">{para}</p>
                ))}
                <div className="border-t border-white/8 pt-3">
                  <p className="text-white/40 text-xs italic">✨ Standout moment: {memoir.standoutMoment}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
