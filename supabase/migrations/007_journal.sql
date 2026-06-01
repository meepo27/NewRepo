create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  day_number integer not null,
  content text,
  mood text check (mood in ('great','good','okay','rough')),
  photo_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(trip_id, day_number)
);
