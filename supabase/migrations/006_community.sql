create table if not exists public_trips (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  avatar_initial text,
  destination text not null,
  country text not null,
  duration integer not null,
  travel_style text,
  budget_tier text,
  cover_photo_query text,
  upvotes integer default 0,
  saves_count integer default 0,
  is_featured boolean default false,
  published_at timestamptz default now()
);

create table if not exists trip_upvotes (
  id uuid primary key default gen_random_uuid(),
  public_trip_id uuid not null references public_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(public_trip_id, user_id)
);
