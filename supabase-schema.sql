-- Driftplan database schema for Supabase
-- Run this in the Supabase SQL editor

create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  home_city text,
  passport_country text default 'India',
  currency text default 'USD',
  travel_style text,
  created_at timestamptz default now() not null
);

alter table public.users enable row level security;

create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);


create table if not exists public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  destination text not null,
  dates text,
  travelers integer default 1,
  budget numeric,
  status text default 'draft' check (status in ('draft', 'saved', 'shared')),
  share_token text unique,
  itinerary_data jsonb,
  created_at timestamptz default now() not null
);

alter table public.trips enable row level security;

create policy "Users can read own trips" on public.trips
  for select using (auth.uid() = user_id);

create policy "Anyone can read shared trips" on public.trips
  for select using (status = 'shared');

create policy "Users can insert own trips" on public.trips
  for insert with check (auth.uid() = user_id);

create policy "Users can update own trips" on public.trips
  for update using (auth.uid() = user_id);

create policy "Users can delete own trips" on public.trips
  for delete using (auth.uid() = user_id);


create table if not exists public.itinerary_days (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips on delete cascade not null,
  day_number integer not null,
  day_data jsonb not null
);

alter table public.itinerary_days enable row level security;

create policy "Users can read own itinerary days" on public.itinerary_days
  for select using (
    exists (select 1 from public.trips where trips.id = trip_id and trips.user_id = auth.uid())
  );

create policy "Users can insert own itinerary days" on public.itinerary_days
  for insert with check (
    exists (select 1 from public.trips where trips.id = trip_id and trips.user_id = auth.uid())
  );

create policy "Users can update own itinerary days" on public.itinerary_days
  for update using (
    exists (select 1 from public.trips where trips.id = trip_id and trips.user_id = auth.uid())
  );


create table if not exists public.planning_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users,
  session_messages jsonb not null default '[]',
  created_at timestamptz default now() not null
);

alter table public.planning_sessions enable row level security;

create policy "Users can read own sessions" on public.planning_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on public.planning_sessions
  for insert with check (auth.uid() = user_id);


-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
