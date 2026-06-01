create table if not exists travel_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('passport','visa','travel_insurance','hotel_booking','flight_ticket','travel_card','vaccination')),
  document_name text not null,
  expiry_date date,
  notes text,
  created_at timestamptz default now()
);

create index travel_documents_user_idx on travel_documents(user_id);
