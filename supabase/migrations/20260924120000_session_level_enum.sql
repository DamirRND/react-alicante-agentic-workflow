-- Issue #2: show each session's level. A new enum keeps the allowed values
-- part of the schema (same reasoning as `session_track` in
-- 20260918100000_session_track_enum.sql) so `pnpm db:types` generates a
-- union type instead of a plain string.

-- `create type` has no `if not exists` clause, so guard it manually by
-- checking pg_type first, safe to re-run.
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'session_level'
      and n.nspname = 'public'
  ) then
    create type public.session_level as enum (
      'beginner',
      'intermediate',
      'advanced'
    );
  end if;
end $$;

-- The table already has rows, so the column starts nullable, gets backfilled,
-- then is locked to not null — all in this one migration.
alter table public.sessions
  add column if not exists level public.session_level;

update public.sessions set level = 'beginner' where id = 'opening-keynote';
update public.sessions set level = 'intermediate' where id = 'build-your-agentic-workflow';
update public.sessions set level = 'advanced' where id = 'server-components-deep-dive';
update public.sessions set level = 'advanced' where id = 'rsc-payload-budget';
update public.sessions set level = 'intermediate' where id = 'agent-context-windows';
update public.sessions set level = 'advanced' where id = 'micro-frontends-2026';
update public.sessions set level = 'intermediate' where id = 'testing-ai-generated-code';
update public.sessions set level = 'beginner' where id = 'closing-panel';

alter table public.sessions
  alter column level set not null;

-- No RLS change needed: the existing "Sessions are publicly readable" policy
-- from 20260917090000_create_sessions.sql is `using (true)` with no column
-- list, so it already covers this new column for anon and authenticated.
