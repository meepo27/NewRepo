create table if not exists trip_collaborators (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_email text not null,
  role text not null default 'viewer' check (role in ('editor','viewer')),
  invite_status text not null default 'pending' check (invite_status in ('pending','accepted')),
  invited_at timestamptz default now()
);

create table if not exists destination_votes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_email text not null,
  destination_id text not null,
  vote text not null check (vote in ('like','dislike','love')),
  voted_at timestamptz default now(),
  unique(trip_id, user_email, destination_id)
);

create table if not exists activity_votes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  day_number integer not null,
  activity_id text not null,
  user_email text not null,
  vote text not null check (vote in ('keep','remove','maybe')),
  voted_at timestamptz default now(),
  unique(trip_id, user_email, activity_id)
);
