create table if not exists api_usage (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  identifier_type text not null check (identifier_type in ('user', 'ip')),
  endpoint text not null,
  created_at timestamptz default now()
);

create index api_usage_identifier_idx on api_usage(identifier, identifier_type, endpoint, created_at);
