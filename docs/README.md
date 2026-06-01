# Driftplan — Documentation

Driftplan is an AI-first travel planning web app. Users type a feeling or idea ("I want a cheap beach trip in October") and the app turns it into a complete day-by-day itinerary with booking links, budget breakdown, weather, and more.

---

## Documents in this folder

| File | What it covers |
|------|----------------|
| [LAUNCH.md](./LAUNCH.md) | **Start here.** Local setup, Supabase, env vars, running the dev server, deploying to Vercel |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Codebase structure, tech stack, data flow, key design decisions |
| [API-REFERENCE.md](./API-REFERENCE.md) | Every API endpoint — method, inputs, outputs, auth requirements |
| [DATABASE.md](./DATABASE.md) | All Supabase tables, columns, indexes, RLS policies, migration guide |
| [FEATURES.md](./FEATURES.md) | Every feature explained — what it does, where it lives, how to use it |
| [MONETIZATION.md](./MONETIZATION.md) | Stripe setup, subscription model, affiliate link guide, price alerts |

---

## Quick facts

- **Framework:** Next.js 16 (App Router, Turbopack)
- **AI:** Anthropic Claude (`claude-sonnet-4-20250514`) — server-side only
- **Database + Auth:** Supabase (Postgres + Row Level Security)
- **Styling:** Tailwind CSS v4
- **State:** Zustand with persist middleware
- **Deployment target:** Vercel (zero-config)

## The user journey

```
Landing page
    ↓
Type a travel feeling  →  4 AI destination suggestions
    ↓
Shortlist up to 3      →  Side-by-side AI comparison
    ↓
Pick one               →  Configure dates, budget, travelers
    ↓
Full itinerary         →  Day-by-day plan, hotels, activities, budget
    ↓
Refine by chat         →  "Make day 3 more relaxed"
    ↓
Save / Share / Export  →  Public link, PDF (Pro), community feed
```

## Free vs Pro

| Feature | Free | Pro |
|---------|------|-----|
| Saved trips | 3 | Unlimited |
| Discoveries/day | 5 | Unlimited |
| Multi-city trips | — | Up to 4 cities |
| Budget optimizer | — | Yes |
| PDF export | — | Yes |
| Trip journal | — | Yes |
| Travel persona | — | Yes |
| Weather replanning | — | Yes |
| Group collaboration | — | Up to 6 people |
</content>
</invoke>