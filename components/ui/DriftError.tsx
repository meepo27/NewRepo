'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  message?: string;
  onRetry?: () => void;
  endpoint?: string;
  errorDetail?: string;
}

async function logError(endpoint: string | undefined, message: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('error_logs').insert({
      user_id: user?.id ?? null,
      endpoint,
      error_message: message,
    });
  } catch {}
}

export function DriftError({ message, onRetry, endpoint, errorDetail }: Props) {
  const displayMessage = message ?? "Drift hit a headwind. Let's try that again.";

  // Log to Supabase (fire-and-forget, never show errors from this)
  if (errorDetail) logError(endpoint, errorDetail).catch(() => {});

  return (
    <div className="flex flex-col items-center gap-4 py-10 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
        <AlertTriangle size={20} className="text-red-400" />
      </div>
      <div>
        <p className="text-white font-medium mb-1">{displayMessage}</p>
        <p className="text-white/40 text-sm">Check your connection and try again.</p>
      </div>
      {onRetry && (
        <button onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 text-white/70 text-sm hover:bg-white/15 transition-colors">
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
