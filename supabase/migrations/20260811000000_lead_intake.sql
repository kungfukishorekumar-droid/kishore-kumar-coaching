-- ============================================================================
-- Lead intake queue + Row Level Security
--
-- Why this file exists: the schema and its RLS policies previously lived only
-- as copy-paste instructions in a markdown doc. That means the security posture
-- of the database was undocumented in code, unreviewable in a diff, and
-- impossible to recreate reliably — if the project were ever rebuilt, whether
-- RLS came back on was down to whoever remembered.
--
-- Apply with:  supabase db push
-- Or paste into the Supabase SQL editor. Safe to re-run (idempotent).
-- ============================================================================

-- ── The intake queue ────────────────────────────────────────────────────────
-- `payload` is jsonb because both websites post a lead-shaped JSON blob and the
-- CRM (a separate repo) drains it. The database deliberately enforces nothing
-- about the blob's shape — src/lib/server/validate.ts is the gate, and the
-- Edge Function re-validates for the Spartacus site. Storing it as jsonb keeps
-- the queue decoupled from CRM field renames.
create table if not exists public.public_leads (
  id         uuid primary key default gen_random_uuid(),
  payload    jsonb       not null,
  created_at timestamptz not null default now(),
  -- Set by the CRM as it drains the queue; NULL means "not yet processed".
  processed_at timestamptz
);

-- The CRM's drain query is "oldest unprocessed first", so index exactly that.
-- Partial index: once a row is processed it is irrelevant to the hot query, and
-- excluding those keeps the index small no matter how much history accumulates.
create index if not exists public_leads_unprocessed_idx
  on public.public_leads (created_at)
  where processed_at is null;

-- Attribution/reporting per site. Both sites stamp payload->>'source'.
create index if not exists public_leads_source_idx
  on public.public_leads ((payload ->> 'source'));

-- ── Row Level Security ──────────────────────────────────────────────────────
-- This is the part that matters. With RLS off, the publishable/anon key can
-- read every lead in the table — every name, phone number and WhatsApp number
-- the funnel has ever captured. RLS on with no SELECT policy means the anon key
-- can read nothing, whatever it tries.
alter table public.public_leads enable row level security;

-- The service_role key bypasses RLS entirely, which is how /api/lead writes
-- server-side. No policy is needed for it, and none should be added.

-- Deliberately NO policies for anon/authenticated:
--   • no SELECT → the queue is unreadable from the browser
--   • no UPDATE/DELETE → it cannot be tampered with or emptied
--
-- An anon INSERT policy is intentionally absent as well. It was needed while
-- the browser wrote directly to Supabase; now that /api/lead and the Edge
-- Function both insert with the service_role key, granting anon INSERT would
-- re-open a spam vector for no benefit. If lead capture starts failing with
-- 401/403 on the publishable key, the fix is to set SUPABASE_SERVICE_ROLE_KEY
-- on the server — NOT to add an INSERT policy here.
-- (src/lib/server/leads.ts logs `lead.needs_service_role_key` for exactly this.)

-- ── Verification ────────────────────────────────────────────────────────────
-- After applying, confirm RLS is actually on:
--
--   select relname, relrowsecurity
--     from pg_class
--    where relname = 'public_leads';
--   -- relrowsecurity must be true
--
-- And confirm the anon key cannot read (should return 0 rows / permission
-- denied, never lead data):
--
--   set role anon;
--   select count(*) from public.public_leads;
--   reset role;
