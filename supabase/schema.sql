-- Run once in Supabase: SQL Editor > New query > paste > Run
create table if not exists kv (
  key text primary key,
  value jsonb not null
);

-- The site talks to this table only from the server with the service key.
-- Turn RLS on with no policies so the public anon key can never read or write it.
alter table kv enable row level security;
