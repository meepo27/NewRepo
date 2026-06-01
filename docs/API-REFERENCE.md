# API Reference

All routes are under `/api/`. All POST routes accept and return `application/json`.

---

## Authentication

Most routes read auth from the Supabase session cookie automatically. Routes that require authentication will return `401` if no valid session exists. Routes marked **Pro** return `403 { error: 'pro_required', feature: '...' }` if the user is on the free plan.

---

## Planning routes (`/api/plan/`)

### POST /api/plan/discover

Turns a free-text travel feeling into 4 destination suggestions.

**Request body:**
```json
{
  "userInput": "I want a beach trip in Southeast Asia, budget $1000, late October",
  "homeCity": "London",
  "passportCountry": "United Kingdom",
  "currency": "USD",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "destinations": [
    {
      "id": "koh-lanta-thailand",
      "name": "Koh Lanta",
      "country": "Thailand",
      "tagline": "Unhurried island life before the world finds it",
      "description": "...",
      "bestMonths": "November–April",
      "budgetTier": "budget",
      "estimatedDailyBudget": { "currency": "USD", "min": 35, "max": 80 },
      "vibeTags": ["beach", "laid-back", "snorkelling"],
      "unsplashQuery": "Koh Lanta beach sunset"
    }
  ],
  "driftNote": "These four picks balance your beach brief with your late-October timing..."
}
```

**Rate limit:** 50/day per IP

---

### POST /api/plan/compare

Generates a detailed side-by-side comparison of up to 3 shortlisted destinations.

**Request body:**
```json
{
  "shortlistedDestinations": [
    { "id": "bali-indonesia", "name": "Bali", "budgetTier": "budget", "vibeTags": ["beach", "culture"] }
  ],
  "travelDates": { "from": "2025-10-15", "to": "2025-10-25" },
  "travelers": { "adults": 2, "children": 0 },
  "budget": 1200,
  "currency": "USD",
  "travelStyle": "adventurous",
  "passportCountry": "United Kingdom"
}
```

**Response:** `ComparisonResult` with scores (0–10) for value, weather, ease of travel, style match, plus visa info, flight info, hotel options, and a winner recommendation.

**Rate limit:** 50/day per IP

---

### POST /api/plan/itinerary

Generates a complete day-by-day itinerary for the chosen destination and dates.

**Request body:**
```json
{
  "destination": { "name": "Bali", "country": "Indonesia", ... },
  "travelDates": { "from": "2025-10-15", "to": "2025-10-25" },
  "travelers": { "adults": 2, "children": 0 },
  "budget": 1200,
  "currency": "USD",
  "travelStyle": "adventurous",
  "passportCountry": "United Kingdom",
  "userProfile": { "homeCity": "London", ... }
}
```

**Response:** Full `Itinerary` object including:
- `tripSummary` — title, duration, travelStyle, travellers
- `days[]` — morning/afternoon/evening activities per day
- `accommodation` — budget/mid/luxury hotel options with booking links
- `budgetSummary` — itemised breakdown by category
- `packingList`, `localTips`, `emergencyContacts`

**Rate limit:** 50/day per IP

---

### POST /api/plan/refine

Modifies the current itinerary based on a user chat message.

**Request body:**
```json
{
  "userMessage": "Make day 3 more relaxed, I'm tired of temples",
  "currentItinerary": { ... },
  "conversationHistory": [...]
}
```

**Response:** `RefinementPatch` with `modifiedDays[]` and optional `budgetDelta`.

**Rate limit:** 50/day per IP

---

### POST /api/plan/multicity  *(Pro)*

Generates a connected itinerary across 2–4 cities.

**Request body:**
```json
{
  "cities": ["Tokyo", "Kyoto", "Osaka"],
  "travelDates": { "from": "2025-11-01", "to": "2025-11-14" },
  "travelers": { "adults": 2, "children": 0 },
  "budget": 3000,
  "currency": "USD",
  "travelStyle": "cultural",
  "startingCity": "Tokyo",
  "passportCountry": "Australia",
  "userId": "uuid"
}
```

**Response:** Multi-city itinerary with per-city day plans, inter-city transport details, and a combined budget summary.

---

### POST /api/plan/optimize  *(Pro)*

Analyses an existing itinerary and suggests the top 5 cost-saving swaps.

**Request body:**
```json
{
  "currentItinerary": { ... },
  "targetBudget": 800,
  "currency": "USD",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "savingsOpportunities": [
    {
      "category": "accommodation",
      "currentItem": "Four Seasons Bali",
      "currentCost": 350,
      "suggestedAlternative": "Bisma Eight boutique hotel",
      "newCost": 120,
      "saving": 230,
      "currency": "USD",
      "tradeoff": "Smaller pool, same Ubud jungle views",
      "worthIt": true
    }
  ],
  "doNotCut": { "item": "Sunrise Batur Trek", "reason": "The defining experience of the trip" },
  "originalTotal": 1850,
  "optimizedTotal": 1120,
  "totalSaving": 730,
  "currency": "USD"
}
```

---

### POST /api/plan/persona  *(Pro)*

Generates an AI travel persona from a user's planning history.

**Request body:**
```json
{
  "userId": "uuid",
  "planningHistory": ["Beach trip in Bali", "City break in Tokyo"],
  "savedTrips": [...],
  "userProfile": { ... }
}
```

**Response:** Persona object with `personaName`, `personaTagline`, `traits[]`, `preferredPace`, `budgetStyle`, `accommodation`, `foodPreference`, `avoids[]`, `destinationAffinities[]`, `personaEmoji`.

The persona is also saved to the `users.persona` column in Supabase.

---

### POST /api/plan/replan

Replans specific itinerary days based on the weather forecast.

**Request body:**
```json
{
  "currentItinerary": { ... },
  "weatherForecast": [...],
  "dayNumbers": [3, 4],
  "destination": "Bali"
}
```

**Response:** `RefinementPatch` with weather-friendly activity alternatives for the flagged days.

---

### POST /api/plan/checklist

Generates a pre-departure checklist tailored to the destination and trip.

**Request body:**
```json
{
  "destination": "Bali",
  "country": "Indonesia",
  "travelDates": { "from": "2025-10-15", "to": "2025-10-25" },
  "travelers": { "adults": 2, "children": 0 },
  "travelStyle": "adventurous",
  "passportCountry": "United Kingdom"
}
```

**Response:** `ChecklistBucket[]` — grouped tasks (Documents, Packing, Health, Finance, Digital) with priority levels and recommended lead times.

---

### POST /api/plan/groupdiscover

Finds destinations that work for a group with different preferences.

**Request body:**
```json
{
  "participants": [
    { "name": "Alex", "preferences": "beach, nightlife", "budget": "mid" },
    { "name": "Sam", "preferences": "hiking, culture", "budget": "budget" }
  ],
  "travelDates": { "from": "2025-12-01", "to": "2025-12-08" },
  "departingFrom": "London"
}
```

**Response:** 4 destination suggestions with a "group fit" score and notes on what each participant will enjoy.

---

### POST /api/plan/journalsummary

Generates an AI-written memoir from a trip's journal entries.

**Request body:**
```json
{
  "tripDestination": "Bali",
  "tripDates": "15–25 October 2025",
  "journalEntries": [
    { "dayNumber": 1, "content": "Landed late, rice terraces at sunset...", "mood": "great" }
  ]
}
```

**Response:** `{ memoir: string }` — a 3–5 paragraph narrative memoir in first person.

---

### POST /api/plan/bookings

Generates affiliate booking links for hotels, trains, buses, and activities.

**Request body:**
```json
{
  "destination": "Bali",
  "countryCode": "ID",
  "checkIn": "2025-10-15",
  "checkOut": "2025-10-25",
  "adults": 2
}
```

**Response:** Hotel links (Agoda, Booking.com, Hostelworld), train links, bus links, activity links (GetYourGuide, Viator, Klook).

---

## Tools routes (`/api/tools/`)

### GET /api/tools/currency?base=USD

Returns exchange rates for 30 major currencies. Cached for 1 hour.

**Query params:** `base` — base currency code (default: `USD`)

**Response:**
```json
{
  "base": "USD",
  "rates": { "EUR": 0.92, "GBP": 0.79, "JPY": 149.5, ... },
  "updatedAt": "2025-06-01T10:00:00Z"
}
```

---

### GET /api/tools/weather?lat=51.5&lng=-0.1&destination=London

Returns a 16-day weather forecast. Cached 1 hour per coordinate pair.

**Query params:** `lat`, `lng`, `destination` (for display)

**Response:**
```json
{
  "destination": "London",
  "forecast": [
    {
      "date": "2025-06-01",
      "tempMax": 22,
      "tempMin": 14,
      "precipitation": 3.2,
      "weatherCode": 61,
      "weatherLabel": "🌧️ Rain",
      "isRainyDay": true
    }
  ]
}
```

---

## Community routes (`/api/community/`)

### GET /api/community/feed

Returns paginated public trips.

**Query params:**
- `page` — page number (default: 1, 12 per page)
- `destination` — filter by destination text
- `style` — filter by travel style
- `budget` — filter by budget tier (`budget` | `mid` | `luxury`)
- `sort` — `recent` | `popular` | `saves` (default: `recent`)

**Auth:** Optional (affects upvote state)

---

### POST /api/community/save

Copies a community trip into the authenticated user's saved trips.

**Request body:** `{ "publicTripId": "uuid" }`

**Auth:** Required

---

### POST /api/community/upvote

Toggles an upvote on a public trip.

**Request body:** `{ "publicTripId": "uuid" }`

**Auth:** Required

**Response:** `{ "upvoted": true | false }`

---

## Trip routes (`/api/trips/`)

### POST /api/trips/invite

Invites collaborators to a trip by email. Sends a Resend email with a link.

**Request body:**
```json
{
  "tripId": "uuid",
  "emails": ["friend@example.com"],
  "role": "editor"
}
```

**Auth:** Required

---

### POST /api/trips/vote

Casts a vote on a destination or activity within a group trip.

**Request body:**
```json
{
  "tripId": "uuid",
  "type": "destination",
  "itemId": "bali-indonesia",
  "vote": "love"
}
```

**Response:** Vote tally for that item `{ love: 2, like: 1, dislike: 0 }`

**Auth:** Required

---

### POST /api/trips/export  *(Pro)*

Generates a PDF of the itinerary.

**Request body:** `{ "itinerary": { ... } }`

**Response:** `{ "pdf": "<base64>", "filename": "driftplan-bali.pdf" }`

**Auth:** Required + Pro subscription

---

## Notifications route

### GET /api/notifications?markRead=true

Returns the authenticated user's notifications. Pass `markRead=true` to mark all as read.

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "trip_reminder",
      "title": "Your Bali trip is in 7 days",
      "body": "Time to check your packing list",
      "isRead": false,
      "actionUrl": "/dashboard",
      "createdAt": "2025-06-01T09:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

**Auth:** Required

---

## Error responses

All routes use consistent error shapes:

| Status | Body | Meaning |
|--------|------|---------|
| 400 | `{ error: "field is required" }` | Missing or invalid input |
| 401 | `{ error: "unauthorized" }` | No valid session |
| 403 | `{ error: "pro_required", feature: "multi_city" }` | Feature requires Pro plan |
| 429 | `{ error: "rate_limited", retryAfter: 3600 }` | Too many requests |
| 502 | `{ error: "parse_error", raw: "..." }` | Claude returned invalid JSON |
| 500 | `{ error: "internal_error" }` | Unexpected server error |
</content>
</invoke>