'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

interface Props {
  feature: string;
  children: React.ReactNode;
  isPro: boolean;
}

export function ProGate({ feature, children, isPro }: Props) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-30 blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0F1E]/80 rounded-2xl backdrop-blur-sm">
        <Zap size={20} className="text-amber-400 mb-2" />
        <p className="text-white font-medium text-sm mb-1">Pro feature</p>
        <p className="text-white/50 text-xs mb-4 text-center px-4">
          Upgrade to unlock {feature}
        </p>
        <Link href="/pricing"
          className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors">
          Upgrade to Pro →
        </Link>
      </div>
    </div>
  );
}

export function ProBanner({ feature }: { feature: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-4">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-amber-400 shrink-0" />
        <p className="text-amber-400/90 text-sm">
          You've found a Pro feature. Upgrade to unlock {feature} →
        </p>
      </div>
      <Link href="/pricing"
        className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors">
        Upgrade
      </Link>
    </div>
  );
}
