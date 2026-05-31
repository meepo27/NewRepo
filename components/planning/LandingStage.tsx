'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { usePlanningSession } from '@/hooks/usePlanningSession';
import { usePlanningStore } from '@/store/planningStore';

const SUGGESTION_CHIPS = [
  'Something beachy and quiet',
  'A cold mountain escape',
  'Street food and chaos',
  'History and architecture',
  'Just surprise me',
];

export function LandingStage() {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { discoverDestinations } = usePlanningSession();
  const { isLoading } = usePlanningStore();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;
    await discoverDestinations(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChip = (chip: string) => {
    setPrompt(chip);
    inputRef.current?.focus();
  };

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 sm:left-8"
      >
        <span className="text-xl font-semibold tracking-tight text-white">
          drift<span className="gradient-text">plan</span>
        </span>
      </motion.div>

      {/* Main content */}
      <div className="w-full max-w-2xl text-center">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight text-white mb-4">
            Start from a
            <span className="gradient-text"> feeling.</span>
          </h1>
          <p className="text-white/50 text-lg">
            Tell us what kind of trip you&apos;re dreaming of — we&apos;ll do the rest.
          </p>
        </motion.div>

        {/* Input field */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative mb-6"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#141929] shadow-xl shadow-black/30 focus-within:border-amber-500/50 transition-colors duration-300">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me what kind of trip you're dreaming of..."
              rows={3}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-14 text-white placeholder-white/30 text-lg focus:outline-none leading-relaxed"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <VoiceButton onResult={(text) => setPrompt((prev) => prev ? `${prev} ${text}` : text)} />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/20"
              >
                Start Planning
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.form>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {SUGGESTION_CHIPS.map((chip, i) => (
            <motion.button
              key={chip}
              type="button"
              onClick={() => handleChip(chip)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm hover:border-amber-500/40 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {chip}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 text-white/20 text-xs tracking-widest uppercase"
      >
        AI-powered travel planning
      </motion.p>
    </div>
  );
}
