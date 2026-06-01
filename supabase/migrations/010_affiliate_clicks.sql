create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  platform text not null,
  destination text,
  clicked_at timestamptz default now()
);

create table if not exists error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  endpoint text,
  error_message text,
  created_at timestamptz default now()
);
