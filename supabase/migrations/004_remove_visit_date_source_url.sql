-- Remove fields no longer used by the application.
-- IF EXISTS keeps this safe for databases created from the updated Phase 2 schema.
alter table public.places
  drop column if exists visit_date,
  drop column if exists source_url;
