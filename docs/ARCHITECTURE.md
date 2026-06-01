# Architecture

---

## Tech stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router, Turbopack) | Server components, static generation, API routes in one repo |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS v4 | Utility-first, mobile-first, dark theme |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) | Best-in-class travel reasoning |
| Database | Supabase (Postgres) | Hosted Postgres with RLS, Auth, and realtime |
| Auth | Supabase Auth | Email + OAuth, JWT sessions |
| State | Zustand + persist | Lightweight, persists session across page refreshes |
| Animation | Framer Motion | Page transitions, loading states |
| Charts | Recharts | Travel stats bar charts |
| Maps | react-simple-maps | World map on stats page |
| PDF | @react-pdf/renderer | Server-side PDF generation (Pro feature) |
| Email | Resend + @react-email | Transactional emails (invites, price alerts) |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## Folder structure

```
/
├── app/                        Next.js App Router pages and API routes
│   ├── page.tsx                Landing page (the main planning flow)
│   ├── layout.tsx              Root layout — fonts, metadata, PWA, SW
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts   Supabase OAuth callback handler
│   ├── dashboard/page.tsx      Saved trips list
│   ├── explore/page.tsx        Community trip feed
│   ├── pricing/page.tsx        Free vs Pro plans
│   ├── profile/
│   │   ├── documents/page.tsx  Document vault (passport, visa, etc.)
│   │   └── stats/page.tsx      Travel stats with world map
│   ├── trip/[token]/page.tsx   Shared/public trip view
│   ├── trips/[tripId]/
│   │   └── journal/page.tsx    Trip journal (Pro)
│   ├── destinations/
│   │   └── [country]/[city]/page.tsx  SEO pages for 80 cities
│   └── api/                    All backend API routes
│       ├── plan/               Core AI planning routes
│       │   ├── discover/       Destination discovery (Claude)
│       │   ├── compare/        Side-by-side comparison (Claude)
│       │   ├── itinerary/      Full itinerary generation (Claude)
│       │   ├── refine/         Chat-based refinement (Claude)
│       │   ├── persona/        AI travel persona (Pro, Claude)
│       │   ├── replan/         Weather-aware replanning (Claude)
│       │   ├── optimize/       Budget optimizer (Pro, Claude)
│       │   ├── multicity/      Multi-city itinerary (Pro, Claude)
│       │   ├── checklist/      Pre-departure checklist (Claude)
│       │   ├── groupdiscover/  Group trip destinations (Claude)
│       │   ├── journalsummary/ AI memoir from journal (Claude)
│       │   └── bookings/       Booking link generation
│       ├── tools/
│       │   ├── currency/       Exchange rates (open.er-api.com)
│       │   └── weather/        Forecast (Open-Meteo)
│       ├── community/
│       │   ├── feed/           Public trip feed
│       │   ├── save/           Save community trip to library
│       │   └── upvote/         Toggle upvote
│       ├── trips/
│       │   ├── invite/         Invite collaborators (email)
│       │   ├── vote/           Group destination/activity voting
│       │   ├── export/         PDF export (Pro)
│       │   └── share/          Generate share token
│       ├── notifications/      Get and mark-read notifications
│       └── auth/callback/      Supabase auth callback
│
├── components/
│   ├── planning/               The 6-stage planning flow UI
│   │   ├── SparkStage.tsx      Step 1: text input
│   │   ├── DiscoveryStage.tsx  Step 2: destination cards
│   │   ├── ShortlistComparePage.tsx  Step 3: shortlist
│   │   ├── ComparisonStage.tsx Step 4: side-by-side compare
│   │   ├── TripBuilderStage.tsx Step 5: dates/budget/config
│   │   └── ItineraryStage.tsx  Step 6: full itinerary
│   ├── itinerary/
│   │   ├── DayCard.tsx         Expandable day card
│   │   ├── ActivityBlock.tsx   Individual activity row
│   │   ├── ItinerarySidebar.tsx  Hotels, budget, visa, tips tabs
│   │   └── SharedItineraryView.tsx  Public view of shared trip
│   ├── ui/
│   │   ├── DriftThinking.tsx   Rotating loading messages
│   │   ├── DriftError.tsx      Error state with retry + logging
│   │   ├── NotificationBell.tsx  Bell icon with unread badge
│   │   ├── ProGate.tsx         Blur overlay for Pro features
│   │   └── PwaInstallPrompt.tsx  "Add to home screen" banner
│   ├── tools/
│   │   ├── CurrencyConverter.tsx  Real-time currency converter
│   │   ├── WeatherStrip.tsx       Per-day weather on itinerary
│   │   └── PriceAlertSetup.tsx    Set flight/hotel price alerts
│   └── monetization/
│       └── AffiliateSidebar.tsx   SIM, insurance, money, luggage links
│
├── store/
│   └── planningStore.ts        Zustand store — all planning state + actions
│
├── types/
│   └── planning.ts             Canonical TypeScript types for the whole app
│
├── lib/
│   ├── anthropic.ts            callClaude<T>() wrapper — singleton client
│   ├── supabase.ts             Client-side Supabase client
│   ├── supabase-server.ts      Server-side Supabase client (uses service role)
│   ├── cache.ts                Module-level TTL cache (no Redis needed)
│   ├── rateLimit.ts            Dual rate limiting (Supabase + in-memory)
│   ├── subscription.ts         getUserPlan(), checkLimit(), proRequiredResponse()
│   ├── countryUtils.ts         POPULAR_DESTINATIONS (80 cities), country helpers
│   ├── affiliates.ts           Booking link generators (hotels, trains, activities)
│   └── notificationService.ts  createNotification(), generateTripNotifications()
│
├── data/
│   └── destinations.ts         Rich content for 30+ cities (overview, activities, etc.)
│
├── supabase/
│   └── migrations/             10 SQL migration files — run in Supabase SQL Editor
│
├── public/
│   ├── sw.js                   Service worker (offline support, itinerary caching)
│   └── manifest.json           PWA manifest
│
└── docs/                       ← you are here
```

---

## How the AI planning works

Every Claude call follows the same pattern:

```
Client (browser)
    │
    │  POST /api/plan/[stage]
    │  { userInput, context... }
    ↓
API Route (server)
    │
    ├── 1. Check rate limit (checkRateLimit)
    ├── 2. Check subscription if Pro feature (checkLimit)
    ├── 3. Build system prompt + message array
    ├── 4. callClaude<T>(systemPrompt, messages, maxTokens)
    │       │
    │       └── Anthropic SDK → claude-sonnet-4-20250514
    │           Returns raw JSON string
    │
    ├── 5. Parse JSON (stripMarkdownFences → JSON.parse)
    └── 6. Return NextResponse.json(result)
    │
Client receives typed response
    │
Zustand store updated
    │
UI re-renders
```

The `callClaude<T>()` function in `lib/anthropic.ts` is the single entry point for all Claude calls. It:
- Uses a module-level singleton Anthropic client
- Always uses `claude-sonnet-4-20250514`
- Strips markdown fences from responses before parsing
- Throws `ClaudeParseError` if JSON is invalid (caught by API routes)

**The ANTHROPIC_API_KEY is never sent to the browser.** All Claude calls go through server-side API routes only.

---

## State management

The Zustand store (`store/planningStore.ts`) holds the entire planning session:

```
PlanningState {
  stage            — which of the 6 steps the user is on
  userInput        — the original travel feeling text
  discoveredDestinations
  shortlistedDestinations
  comparisonResult
  tripConfig       — dates, budget, travelers, style
  itinerary        — the full generated itinerary
  refineMessages   — chat history for refinement
  bookingChecklist
  checklist        — pre-departure checklist
  savedTripId
  shareToken
}
```

The store is persisted to `localStorage` via Zustand's `persist` middleware. This means the session survives page refreshes. Only key fields are persisted (not loading states, errors, or transient UI state).

---

## Rate limiting strategy

Two layers work together:

1. **Supabase `api_usage` table** — persists across server restarts, survives deploys. Used for accurate per-user daily limits.
2. **In-memory Map** — fallback when Supabase isn't configured or is unreachable. Resets on server restart.

Limits:
- IP-based: 50 requests/day per endpoint
- User-based: 10 requests/hour per endpoint

---

## Subscription model

```
lib/subscription.ts

getUserPlan(userId) → 'free' | 'pro'
  └── reads subscriptions table
  └── checks expires_at
  └── returns 'free' if no active subscription

checkLimit(userId, limitType) → { allowed, reason }
  └── Pro users always pass
  └── Free users checked against FREE_LIMITS dict

proRequiredResponse(feature) → Response(403)
  └── { error: 'pro_required', feature: 'multi_city' }
```

Front-end uses `ProGate` component to blur locked features and show an upgrade CTA.

---

## Caching strategy

The `lib/cache.ts` module provides simple TTL caching for external API calls:

- **Currency rates** — cached 1 hour (exchange rates don't change minute-by-minute)
- **Weather forecasts** — cached 1 hour per destination+date pair
- No caching on Claude responses (each planning session is unique)

---

## SEO static pages

80 destination pages are pre-generated at build time via `generateStaticParams` in `app/destinations/[country]/[city]/page.tsx`. Each page:

- Has a unique `<title>` and `<meta description>`
- Has OpenGraph + Twitter Card tags with an Unsplash hero image
- Has a canonical URL
- Links to Skyscanner, Booking.com, GetYourGuide with affiliate placeholders
- Has a "Plan your {city} trip with AI →" CTA that pre-fills the home page

---

## PWA

The app is a Progressive Web App:
- `public/manifest.json` — app name, icons, theme colour, shortcuts
- `public/sw.js` — service worker: caches static assets, navigation-first strategy, offline fallback, message handler to cache last itinerary
- `components/ui/PwaInstallPrompt.tsx` — "Add to home screen" prompt using `beforeinstallprompt` event (shown 3 seconds after first visit, dismissible)
- `components/ui/ServiceWorkerRegistrar.tsx` — registers the SW on mount
</content>
</invoke>