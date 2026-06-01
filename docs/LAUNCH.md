# Launch Guide

Everything you need to go from zero to a running Driftplan — locally and in production.

---

## Prerequisites

- Node.js 18 or later (`node -v` to check)
- A Supabase account — free at [supabase.com](https://supabase.com)
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
- Git

---

## Part 1 — Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Wait for the project to provision (about 1 minute).
3. Go to **Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)

### 3. Run database migrations

In the Supabase dashboard, go to **SQL Editor** and run each migration file in order.
The files are in `supabase/migrations/`:

```
001_api_usage.sql
002_persona.sql
003_subscriptions.sql
004_travel_documents.sql
005_collaboration.sql
006_community.sql
007_journal.sql
008_notifications.sql
009_price_alerts.sql
010_affiliate_clicks.sql
```

**How to run them:**
1. Open the SQL Editor in your Supabase dashboard
2. Copy the contents of `001_api_usage.sql`, paste, click Run
3. Repeat for each file in order

> You also need a `trips` and `users` table. If your project does not have one yet, run this first:
>
> ```sql
> create table if not exists users (
>   id uuid primary key references auth.users(id) on delete cascade,
>   email text,
>   display_name text,
>   avatar_url text,
>   persona jsonb,
>   persona_generated_at timestamptz,
>   created_at timestamptz default now()
> );
>
> create table if not exists trips (
>   id uuid primary key default gen_random_uuid(),
>   user_id uuid not null references auth.users(id) on delete cascade,
>   destination text not null,
>   dates text,
>   budget numeric,
>   status text default 'saved' check (status in ('saved','shared','archived')),
>   share_token text unique,
>   itinerary_data jsonb,
>   created_at timestamptz default now(),
>   updated_at timestamptz default now()
> );
>
> create index trips_user_idx on trips(user_id, status);
> ```

### 4. Enable Supabase Auth

In the Supabase dashboard:
1. Go to **Authentication → Providers**
2. Enable **Email** (already on by default)
3. Optionally enable **Google** or **GitHub** OAuth

For local development, go to **Authentication → URL Configuration** and set:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Create your `.env.local` file

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-api03-...

# Required for share links and email templates
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app is live. Type a travel feeling and go.

---

## Part 2 — Test the full flow

Once the server is running, here is the recommended test sequence:

1. **Sign up** at `/auth/signup` with your email
2. On the **landing page**, type: `"Beach trip in Southeast Asia, budget $800, late October"`
3. You should see **4 destination cards** appear (Claude is called)
4. Click the ♡ icon to shortlist 2–3 destinations
5. Click **Compare** — you'll see a side-by-side AI scoring
6. Select one destination → configure dates, travelers, budget
7. Click **Generate Itinerary** — this takes 10–20 seconds (Claude generates the full plan)
8. Browse the day-by-day plan, hotel options, budget breakdown
9. Try the **Refine** chat: type "make day 2 more adventurous"
10. Click **Save trip** to save it to your account
11. Click **Share** to generate a public share link
12. Visit `/profile/stats` to see your travel stats
13. Visit `/explore` to see the community feed
14. Visit `/pricing` to see the Free/Pro plans

---

## Part 3 — Add optional features

### Email (invite collaborators, price alerts)

Sign up at [resend.com](https://resend.com) and add to `.env.local`:

```env
RESEND_API_KEY=re_...
```

Without this, invite emails and price alert emails will not send. Everything else works fine.

### Stripe payments (Pro subscriptions)

See [MONETIZATION.md](./MONETIZATION.md) for the full Stripe setup guide.

### Unsplash photos

The app uses Unsplash's free source URL (`source.unsplash.com`) for hero images — no key needed. If you want guaranteed specific photos, sign up at [unsplash.com/developers](https://unsplash.com/developers) and add:

```env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-key
```

---

## Part 4 — Deploy to Vercel (production)

### 1. Push your code to GitHub

```bash
git add .
git commit -m "ready to deploy"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Select your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**

### 3. Add environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add all the same variables from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
NEXT_PUBLIC_APP_URL         ← set this to your Vercel URL e.g. https://driftplan.vercel.app
RESEND_API_KEY              ← if you have it
STRIPE_SECRET_KEY           ← if you have it
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

### 4. Update Supabase for production

In your Supabase dashboard → **Authentication → URL Configuration**:
- Site URL: `https://yourdomain.vercel.app`
- Redirect URLs: `https://yourdomain.vercel.app/auth/callback`

### 5. Redeploy

After adding env vars, click **Redeploy** in Vercel (or push a new commit).

---

## Part 5 — Custom domain

1. In Vercel → **Settings → Domains**, add your domain
2. Follow the DNS instructions Vercel gives you (usually a CNAME or A record)
3. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to your custom domain
4. Update Supabase Site URL and redirect URL to your custom domain

---

## Production checklist

Before going live, verify these:

- [ ] All env vars set in Vercel
- [ ] Supabase auth URLs updated to production domain
- [ ] All 10 migration SQL files run in Supabase
- [ ] Test sign up / log in on the live URL
- [ ] Test generating an itinerary end-to-end
- [ ] Test saving and sharing a trip
- [ ] Stripe webhook pointed at your live domain (if using Pro)
- [ ] Replace all `TODO_AFFILIATE_TAG` placeholders with your real partner IDs
- [ ] Replace `TODO_PAYMENT_LINK` in `/app/pricing/page.tsx` with real Stripe checkout URL

---

## Common issues

| Problem | Fix |
|---------|-----|
| Blank page after sign up | Check Supabase auth redirect URL matches your domain |
| "Drift hit a headwind" error | Check `ANTHROPIC_API_KEY` is set correctly in `.env.local` |
| Itinerary won't generate | Open browser DevTools → Network tab → check the `/api/plan/itinerary` response for errors |
| Database errors | Make sure all 10 migration SQL files were run in the correct order |
| CORS errors on API calls | These are always Supabase URL misconfiguration — double-check `NEXT_PUBLIC_SUPABASE_URL` |
| Build fails TypeScript | Run `npm run build` locally first to see exact errors |
</content>
</invoke>