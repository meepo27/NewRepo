'use client';

import { Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
}

export function VoiceButton({ onResult, className }: VoiceButtonProps) {
  const { isListening, isSupported, startListening, stopListening } = useVoiceInput({ onResult });

  if (isSupported === false) return null;

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
        isListening
          ? 'bg-amber-500 text-navy shadow-lg shadow-amber-500/30'
          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white',
        className
      )}
      title={isListening ? 'Tap to stop recording' : 'Tap to speak'}
    >
      {isListening ? (
        <>
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
          <MicOff size={18} />
        </>
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
}
