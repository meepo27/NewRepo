create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  started_at timestamptz default now(),
  expires_at timestamptz,
  payment_ref text,
  created_at timestamptz default now()
);

create unique index subscriptions_user_idx on subscriptions(user_id) where status = 'active';
