'use client';

interface DriftThinkingProps {
  message?: string;
}

export function DriftThinking({ message = 'Drift is thinking...' }: DriftThinkingProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="wave-dot w-2 h-2 rounded-full bg-amber-400 inline-block"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-amber-400/80 text-sm font-medium tracking-wide">{message}</p>
    </div>
  );
}
