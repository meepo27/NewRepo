'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { usePlanningSession } from '@/hooks/usePlanningSession';

export function RefineChatBar() {
  const [message, setMessage] = useState('');
  const { refineItinerary } = usePlanningSession();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;
    const msg = message.trim();
    setMessage('');
    await refineItinerary(msg);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-1 flex items-center rounded-xl bg-[#141929] border border-white/10 focus-within:border-amber-500/40 transition-colors">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Edit your itinerary: &quot;add a beach day&quot;, &quot;more budget food spots&quot;..."
          className="flex-1 bg-transparent px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none"
        />
        <VoiceButton onResult={(t) => setMessage(t)} className="mr-1" />
      </div>
      <button
        type="submit"
        disabled={!message.trim()}
        className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 disabled:opacity-40 transition-all"
      >
        <Send size={15} />
      </button>
    </form>
  );
}
