create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean default false,
  action_url text,
  created_at timestamptz default now()
);

create index notifications_user_unread_idx on notifications(user_id, is_read, created_at desc);
