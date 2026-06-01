# Features

Every feature in the app — what it does, where it lives, how to use it.

---

## Core planning flow

### 1. Spark (landing page)
**Route:** `/`
**File:** `app/page.tsx`, `components/planning/SparkStage.tsx`

The entry point. Users type a free-text travel feeling or idea:
- "I want a beach trip in Southeast Asia for under $1000 in October"
- "City break in Europe, solo female travel, boutique hotels"
- "Family holiday with kids 7 and 10, budget ₹2L"

The input is sent to `/api/plan/discover` and Claude suggests 4 destinations.

---

### 2. Discovery
**File:** `components/planning/DiscoveryStage.tsx`

Four destination cards appear, each with:
- City and country name
- One-sentence tagline
- Budget tier (budget / mid / luxury) and estimated daily cost
- Vibe tags
- Unsplash hero photo

Users can ♡ to shortlist up to 3 destinations.

---

### 3. Shortlist & Compare
**Files:** `components/planning/ShortlistComparePage.tsx`, `components/planning/ComparisonStage.tsx`

When 2–3 destinations are shortlisted, a **Compare** button appears. This calls `/api/plan/compare` and generates:
- Scored bars (0–10) for value for money, weather, ease of travel, style match
- Visa info for the user's passport
- Flight cost estimate and travel time
- Hotel options (budget/mid/luxury) with booking links
- A winner recommendation with one-line reasons why the others lost

---

### 4. Trip configuration
**File:** `components/planning/TripBuilderStage.tsx`

After picking a destination, users configure:
- Travel dates (date picker)
- Number of adults and children
- Total budget and currency
- Travel style (adventurous, relaxed, cultural, foodie, romantic, family)

---

### 5. Itinerary generation
**File:** `components/planning/ItineraryStage.tsx`

The main event. Claude generates a full day-by-day plan:
- Each day has Morning / Afternoon / Evening sections
- Each activity has: name, description, duration, estimated cost, booking link
- Sidebar tabs: Flights, Hotels, Visa, Budget, Packing List, Local Tips
- Budget summary with per-category breakdown and grand total

This typically takes 10–20 seconds.

---

### 6. Refinement chat
**File:** `components/planning/ItineraryStage.tsx` (chat panel)

A floating chat panel lets users refine the itinerary conversationally:
- "Swap day 3 for something beach-focused"
- "We need a vegetarian restaurant on day 2 evening"
- "Move the temple visits to the morning"

Changes are applied as patches without regenerating the whole itinerary.

---

## Save & Share

### Save trip
Users with a Supabase account can save trips to their dashboard. Free plan allows 3 saved trips; Pro is unlimited.

### Share trip
A unique share token is generated. The link `/trip/[token]` shows a public read-only view with full itinerary. The shared page has proper OpenGraph tags so it previews on WhatsApp/Twitter with a destination photo.

### Dashboard
**Route:** `/dashboard`

Lists all saved trips with destination, dates, and budget. Quick links to view, share, or delete.

---

## AI intelligence features (Pro)

### Travel persona
**Route:** `/api/plan/persona`

After a few saved trips, Claude analyses the user's planning history and generates a Travel Persona:
- Persona name (e.g. "The Slow Wanderer")
- First-person tagline
- 4 personality traits
- Preferred pace, budget style, accommodation type, food preference
- Destinations to avoid
- Top 3 destination affinities

The persona is saved to `users.persona` and injected into future planning prompts to personalise suggestions.

### Budget optimizer
**Route:** `/api/plan/optimize`

Given a current itinerary and a target budget, Claude identifies the top 5 cost-reduction opportunities, ranked by savings. For each it shows the trade-off and whether it's "worth it." Also identifies one item that should not be cut.

### Multi-city builder
**Route:** `/api/plan/multicity`

Generates a connected itinerary across 2–4 cities in one journey. Claude:
- Orders cities to minimise backtracking
- Allocates days proportionally
- Adds inter-city travel days with transport options
- Gives a per-city budget breakdown

### Weather-aware replanning
**Route:** `/api/plan/replan`
**Component:** `components/tools/WeatherStrip.tsx`

The weather strip on the itinerary shows a 16-day forecast per day (fetched from Open-Meteo, free). If a day shows heavy rain, a **Replan** button appears. Claude replaces outdoor activities with indoor alternatives.

---

## Practical tools

### Currency converter
**Route:** `/api/tools/currency`
**Component:** `components/tools/CurrencyConverter.tsx`

Real-time exchange rates from open.er-api.com (free, no key needed). Shows 30 major currencies. Quick-pair buttons (USD↔EUR, USD↔GBP, etc.). Links to Wise and Niyo for transfers. Rates cached 1 hour.

### Weather widget
**Component:** `components/tools/WeatherStrip.tsx`

Horizontal-scrolling strip showing one card per itinerary day. Each card shows max/min temperature, precipitation, and a weather emoji. Red flags appear on rainy days. Integrated with the replanning feature.

### Document vault
**Route:** `/profile/documents`

Store and track expiry dates for:
- Passport
- Visa
- Travel insurance
- Hotel booking confirmations
- Flight tickets
- Travel prepaid cards (Niyo, Wise)
- Vaccination certificates

Colour-coded expiry: green (>6 months), amber (1–6 months), red (<1 month or expired). Alert appears when a document expires within 90 days.

### Pre-departure checklist
**Route:** `/api/plan/checklist`

Claude generates a personalised checklist based on the destination, dates, and travel style. Grouped into buckets: Documents, Health & Vaccinations, Finance & Insurance, Packing, Digital. Each task has a recommended lead time ("6 weeks before departure"). Checked off state persists in the Zustand store.

---

## Collaboration (Pro)

### Group trip voting
**Routes:** `/api/trips/invite`, `/api/trips/vote`

Invite up to 6 people to collaborate on a trip:
1. Owner invites collaborators by email
2. Collaborators receive an email link (via Resend)
3. They can vote `love / like / dislike` on destination options
4. They can vote `keep / remove / maybe` on individual activities
5. Vote tallies are shown in real-time

---

## Community / Social

### Community feed
**Route:** `/explore`
**API:** `/api/community/feed`, `/api/community/upvote`, `/api/community/save`

Public trip feed showing trips that users have shared. Features:
- Filter by destination, travel style, budget tier
- Sort by recent, popular (upvotes), or most saved
- Upvote trips (toggle)
- Save trips to your own library in one click
- Masonry card grid layout

### Trip journal (Pro)
**Route:** `/trips/[tripId]/journal`

Day-by-day travel journal for a saved trip:
- Day selector
- Mood tracker (great / good / okay / rough)
- Free-text journal entry
- Photo URL attachments
- **AI memoir** button — sends all entries to Claude and gets back a polished 3–5 paragraph narrative memoir of the trip

---

## Monetization

### Pricing page
**Route:** `/pricing`

Two-column Free vs Pro comparison. The upgrade button currently links to `#` (placeholder). See [MONETIZATION.md](./MONETIZATION.md) to wire up Stripe.

### Pro gate
**Component:** `components/ui/ProGate.tsx`

Two variants:
- `ProGate` — wraps any content with a blur overlay + "Upgrade to Pro" CTA when `isLocked` is true
- `ProBanner` — contextual banner at the top of a feature page

### Affiliate sidebar
**Component:** `components/monetization/AffiliateSidebar.tsx`

Shown on the itinerary page. Four sections:
- **SIM / eSIM** — Airalo link (TODO_AFFILIATE_TAG)
- **Travel insurance** — WorldNomads / PolicyBazaar links
- **Money transfers** — Niyo / Wise links
- **Luggage** — Amazon search link

All clicks are tracked in the `affiliate_clicks` table.

### Price alerts
**Component:** `components/tools/PriceAlertSetup.tsx`

Users can set a target price for a flight or hotel. The alert is saved to `price_alerts`. Sending email notifications when the price drops requires a cron job (not yet built — see `TODO_PRICE_MONITORING` in the migration file).

---

## Notifications

### Notification bell
**Component:** `components/ui/NotificationBell.tsx`

Bell icon in the header with an unread count badge. Polls `/api/notifications` every 5 minutes. Clicking opens a dropdown list. Notifications are generated by `lib/notificationService.ts`:
- Trip departure reminders (7 days, 1 day before)
- Passport expiry warnings (90 days, 30 days)
- Price alert hits (when cron is wired up)

---

## Travel stats
**Route:** `/profile/stats`

Visualisations based on all saved trips:
- **World map** — highlights every country visited (react-simple-maps)
- **Stat cards** — countries visited, total days, trips saved, avg trip length, total spend, carbon estimate
- **Bar charts** — travel styles breakdown, regions explored (recharts)
- **Carbon footprint** — rough estimate based on flight distances, with a car-driving equivalence

---

## SEO destination pages
**Route:** `/destinations/[country]/[city]`

80 pre-built static pages for the most popular travel destinations. Each page includes:
- Hero photo from Unsplash
- Destination overview (2–3 paragraphs)
- Best time to visit
- Daily budget breakdown (budget/mid/luxury tiers)
- Top 5 things to do
- Book your trip links (Skyscanner, Booking.com, GetYourGuide)
- "Plan your {city} trip with AI →" CTA that pre-fills the home page

These are statically generated at build time so they load instantly and are indexed by Google.

---

## PWA

The app works as a Progressive Web App:
- **Install prompt** — after 3 seconds, shows a native "Add to home screen" prompt
- **Offline** — the service worker caches static assets and the last itinerary; if the user goes offline, they can still view the cached plan
- **App icon** — appears on the home screen like a native app
- **Standalone mode** — launches without browser chrome on mobile
</content>
</invoke>