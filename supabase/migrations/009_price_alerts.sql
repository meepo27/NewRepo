create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_id uuid references trips(id) on delete cascade,
  alert_type text not null check (alert_type in ('flight','hotel')),
  destination text not null,
  travel_date date,
  origin text,
  target_price numeric not null,
  currency text not null default 'USD',
  is_active boolean default true,
  created_at timestamptz default now()
  -- TODO_PRICE_MONITORING: cron job will read active alerts and check prices
);
