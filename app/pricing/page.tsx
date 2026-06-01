import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

const FREE_FEATURES = [
  '3 saved trips',
  '5 destination discoveries/day',
  'Full itinerary generation',
  'Compare destinations',
  'View-only itinerary',
  'Share trip link',
  'Booking links',
];

const PRO_FEATURES = [
  'Unlimited saved trips',
  'Unlimited discoveries',
  'Multi-city trips (up to 4 cities)',
  'Group collaboration (up to 6)',
  'Trip journal with photo uploads',
  'Budget optimizer',
  'PDF export',
  'Travel persona',
  'Weather-aware replanning',
  'Priority AI (more detailed plans)',
  'Everything in Free',
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-[#0A0F1E] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white font-bold text-3xl mb-3">Simple pricing</h1>
          <p className="text-white/50">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-[#141929] border border-white/8 rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <p className="text-white/40 text-sm mb-2">Free</p>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-4xl font-bold">₹0</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                  <Check size={14} className="text-green-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/"
              className="mt-6 w-full py-3 rounded-xl bg-white/8 text-white text-sm font-medium text-center hover:bg-white/15 transition-colors block">
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black text-xs font-semibold">
              Most popular
            </div>
            <div className="mb-6">
              <p className="text-amber-400 text-sm mb-2">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-4xl font-bold">₹499</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-white/40 text-xs mt-1">or ₹3,999/year (save 33%)</p>
            </div>
            <ul className="space-y-3 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Check size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {/* TODO_PAYMENT_LINK: replace with actual Razorpay / Stripe payment link */}
            <a href="TODO_PAYMENT_LINK" target="_blank" rel="noopener noreferrer"
              className="mt-6 w-full py-3 rounded-xl bg-amber-500 text-black text-sm font-semibold text-center hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
              <Zap size={15} /> Get Pro
            </a>
          </div>
        </div>

        <p className="text-white/30 text-xs text-center mt-8">
          All prices in INR · Cancel anytime · No questions asked
        </p>
      </div>
    </div>
  );
}
