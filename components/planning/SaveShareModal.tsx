'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookmarkPlus, Share2, Copy, Check, LogIn } from 'lucide-react';
import type { Itinerary } from '@/types';
import { usePlanningStore } from '@/store/planningStore';
import { supabase } from '@/lib/supabase';

interface SaveShareModalProps {
  itinerary: Itinerary;
  onClose: () => void;
}

export function SaveShareModal({ itinerary, onClose }: SaveShareModalProps) {
  const store = usePlanningStore();
  const [mode, setMode] = useState<'menu' | 'save' | 'share' | 'login'>('menu');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(store.savedTripId);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMode('login'); setLoading(false); return; }

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: itinerary.destination,
          startDate: itinerary.flightInfo.departureDate,
          endDate: itinerary.flightInfo.returnDate,
          travelers: (store.tripConfig.adults ?? 1) + (store.tripConfig.children ?? 0),
          budget: itinerary.totalEstimatedCost,
          currency: itinerary.currency,
          itinerary,
        }),
      });
      const data = await res.json();
      if (data.trip?.id) {
        setSavedId(data.trip.id);
        store.setSavedTripId(data.trip.id);
        setMode('save');
      }
    } catch {}
    setLoading(false);
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const tripId = savedId ?? store.savedTripId;
      if (!tripId) {
        await handleSave();
        return;
      }

      const res = await fetch('/api/trips/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      });
      const data = await res.json();
      if (data.shareToken) {
        const url = `${window.location.origin}/trip/${data.shareToken}`;
        setShareUrl(url);
        store.setShareToken(data.shareToken);
        setMode('share');
      }
    } catch {}
    setLoading(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative z-10 w-full max-w-sm bg-[#141929] border border-white/10 rounded-2xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {mode === 'menu' && (
          <div className="space-y-3">
            <h2 className="text-white font-semibold text-lg">Save or share your trip</h2>
            <p className="text-white/50 text-sm">
              {itinerary.destination}, {itinerary.country}
            </p>
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <BookmarkPlus size={18} />
              <div className="text-left">
                <p className="font-medium text-sm">Save to My Trips</p>
                <p className="text-amber-400/60 text-xs">Access from your dashboard</p>
              </div>
            </button>
            <button
              onClick={handleShare}
              disabled={loading}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors"
            >
              <Share2 size={18} />
              <div className="text-left">
                <p className="font-medium text-sm">Share trip link</p>
                <p className="text-white/40 text-xs">Anyone with the link can view</p>
              </div>
            </button>
          </div>
        )}

        {mode === 'save' && (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Check size={24} className="text-green-400" />
            </div>
            <h2 className="text-white font-semibold">Trip saved!</h2>
            <p className="text-white/50 text-sm">Find it in your dashboard under My Trips.</p>
            <button
              onClick={() => window.open('/dashboard', '_blank')}
              className="text-amber-400 text-sm hover:text-amber-300 transition-colors"
            >
              Go to dashboard →
            </button>
          </div>
        )}

        {mode === 'share' && (
          <div className="space-y-4">
            <h2 className="text-white font-semibold">Share your trip</h2>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2 text-white/80 text-xs focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-xl bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {mode === 'login' && (
          <div className="text-center space-y-4">
            <LogIn className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="text-white font-semibold">Sign in to save</h2>
            <p className="text-white/50 text-sm">Create a free account to save and share your trips.</p>
            <div className="flex gap-2">
              <a
                href="/auth/login"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-medium text-sm text-center hover:bg-amber-400 transition-colors"
              >
                Sign in
              </a>
              <a
                href="/auth/signup"
                className="flex-1 py-2.5 rounded-xl bg-white/8 text-white text-sm text-center hover:bg-white/15 transition-colors border border-white/10"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
