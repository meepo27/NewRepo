# Database

Driftplan uses **Supabase** (hosted Postgres). All tables are in the `public` schema.

---

## Running migrations

All migration files are in `supabase/migrations/`. Run them in the Supabase SQL Editor **in order**:

1. `001_api_usage.sql`
2. `002_persona.sql`
3. `003_subscriptions.sql`
4. `004_travel_documents.sql`
5. `005_collaboration.sql`
6. `006_community.sql`
7. `007_journal.sql`
8. `008_notifications.sql`
9. `009_price_alerts.sql`
10. `010_affiliate_clicks.sql`

You also need to create the base `users` and `trips` tables first if they don't exist. See [LAUNCH.md](./LAUNCH.md#3-run-database-migrations).

---

## Tables

### `users`
Extends Supabase's `auth.users`. Created on sign-up via trigger or manually.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | FK → auth.users(id) |
| `email` | text | |
| `display_name` | text | |
| `avatar_url` | text | |
| `persona` | jsonb | AI-generated travel persona (Pro) |
| `persona_generated_at` | timestamptz | When persona was last generated |
| `created_at` | timestamptz | |

---

### `trips`
Core trip record. One row per saved trip.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → auth.users |
| `destination` | text | e.g. "Bali, Indonesia" |
| `dates` | text | e.g. "15–25 Oct 2025" |
| `budget` | numeric | Total estimated budget |
| `status` | text | `saved` | `shared` | `archived` |
| `share_token` | text | Unique token for public link |
| `itinerary_data` | jsonb | Full itinerary JSON from Claude |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Index:** `trips_user_idx` on `(user_id, status)`

---

### `api_usage`
Tracks Claude API calls for rate limiting.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `identifier` | text | User ID or IP address |
| `identifier_type` | text | `user` or `ip` |
| `endpoint` | text | e.g. `/api/plan/discover` |
| `created_at` | timestamptz | Used for time-window queries |

**Index:** `api_usage_identifier_idx` on `(identifier, identifier_type, endpoint, created_at)`

---

### `subscriptions`
Tracks Pro subscriptions. One active row per user.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → auth.users |
| `plan` | text | `free` or `pro` |
| `status` | text | `active`, `cancelled`, `expired` |
| `started_at` | timestamptz | |
| `expires_at` | timestamptz | Null = never expires |
| `payment_ref` | text | Stripe subscription ID |
| `created_at` | timestamptz | |

**Index:** Unique on `(user_id)` where `status = 'active'`

When a user upgrades via Stripe, insert a row here with `plan='pro'`, `status='active'`, `payment_ref=stripe_subscription_id`.
When they cancel, update `status='cancelled'` and set `expires_at` to the period end date.

---

### `travel_documents`
User's passport, visa, insurance documents.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → auth.users |
| `document_type` | text | `passport`, `visa`, `travel_insurance`, `hotel_booking`, `flight_ticket`, `travel_card`, `vaccination` |
| `document_name` | text | e.g. "UK Passport" |
| `expiry_date` | date | Used for expiry colour coding |
| `notes` | text | Optional notes |
| `created_at` | timestamptz | |

---

### `trip_collaborators`
Invited collaborators on a group trip.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK → trips |
| `user_email` | text | Invitee's email |
| `role` | text | `editor` or `viewer` |
| `invite_status` | text | `pending` or `accepted` |
| `invited_at` | timestamptz | |

---

### `destination_votes`
Group members' votes on destination options.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `trip_id` | uuid | FK → trips |
| `user_email` | text | Voter's email |
| `destination_id` | text | Destination slug |
| `vote` | text | `like`, `dislike`, or `love` |
| `voted_at` | timestamptz | |

**Unique:** `(trip_id, user_email, destination_id)` — one vote per person per destination

---

### `activity_votes`
Group members' votes on specific activities in an itinerary.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `trip_id` | uuid | FK → trips |
| `day_number` | integer | Which day of the itinerary |
| `activity_id` | text | Activity identifier |
| `user_email` | text | |
| `vote` | text | `keep`, `remove`, or `maybe` |
| `voted_at` | timestamptz | |

---

### `public_trips`
Trips shared to the community feed.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `trip_id` | uuid | FK → trips |
| `user_id` | uuid | FK → auth.users |
| `display_name` | text | Author display name |
| `avatar_initial` | text | Single letter for avatar |
| `destination` | text | |
| `country` | text | |
| `duration` | integer | Trip length in days |
| `travel_style` | text | |
| `budget_tier` | text | `budget`, `mid`, or `luxury` |
| `cover_photo_query` | text | Unsplash query for cover image |
| `upvotes` | integer | Upvote count |
| `saves_count` | integer | How many users saved this trip |
| `is_featured` | boolean | Admin-curated featured trips |
| `published_at` | timestamptz | |

---

### `trip_upvotes`
Tracks which users upvoted which community trips (prevents double-voting).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `public_trip_id` | uuid | FK → public_trips |
| `user_id` | uuid | FK → auth.users |
| `created_at` | timestamptz | |

**Unique:** `(public_trip_id, user_id)`

---

### `journal_entries`
Daily journal entries for a trip (Pro feature).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `trip_id` | uuid | FK → trips |
| `user_id` | uuid | FK → auth.users |
| `day_number` | integer | Which day of the trip |
| `content` | text | Journal text |
| `mood` | text | `great`, `good`, `okay`, `rough` |
| `photo_urls` | text[] | Array of photo URLs |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Unique:** `(trip_id, day_number)` — one entry per day

---

### `notifications`
In-app notifications (trip reminders, passport expiry alerts).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `user_id` | uuid | FK → auth.users |
| `type` | text | e.g. `trip_reminder`, `passport_expiry`, `price_alert` |
| `title` | text | Short headline |
| `body` | text | Full notification text |
| `is_read` | boolean | |
| `action_url` | text | Where to go when clicked |
| `created_at` | timestamptz | |

**Index:** `notifications_user_unread_idx` on `(user_id, is_read, created_at DESC)`

---

### `price_alerts`
User-set flight or hotel price targets.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `user_id` | uuid | FK → auth.users |
| `trip_id` | uuid | Optional FK → trips |
| `alert_type` | text | `flight` or `hotel` |
| `destination` | text | |
| `travel_date` | date | Target travel date |
| `origin` | text | For flights: departure airport/city |
| `target_price` | numeric | Trigger when price drops below this |
| `currency` | text | |
| `is_active` | boolean | |
| `created_at` | timestamptz | |

> A cron job needs to be built to check these alerts and send emails via Resend. See `TODO_PRICE_MONITORING` comments in the codebase.

---

### `affiliate_clicks`
Tracks clicks on affiliate partner links.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `user_id` | uuid | Nullable FK → auth.users |
| `platform` | text | e.g. `airalo`, `worldnomads`, `wise` |
| `destination` | text | |
| `clicked_at` | timestamptz | |

---

### `error_logs`
Client-side errors logged from `DriftError` component.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `user_id` | uuid | Nullable |
| `endpoint` | text | Which API route failed |
| `error_message` | text | |
| `created_at` | timestamptz | |

---

## Row Level Security (RLS)

All tables with user data should have RLS enabled. Recommended policies:

```sql
-- Enable RLS on all user tables
alter table trips enable row level security;
alter table travel_documents enable row level security;
alter table journal_entries enable row level security;
alter table notifications enable row level security;
alter table price_alerts enable row level security;

-- Users can only see their own data
create policy "own trips" on trips
  for all using (auth.uid() = user_id);

create policy "own documents" on travel_documents
  for all using (auth.uid() = user_id);

create policy "own journal" on journal_entries
  for all using (auth.uid() = user_id);

create policy "own notifications" on notifications
  for all using (auth.uid() = user_id);

-- Public trips are readable by everyone
create policy "public trips readable" on public_trips
  for select using (true);
```

Add these in the Supabase SQL Editor after running the migration files.
</content>
</invoke>