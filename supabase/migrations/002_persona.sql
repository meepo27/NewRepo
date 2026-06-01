alter table users add column if not exists persona jsonb;
alter table users add column if not exists persona_generated_at timestamptz;
