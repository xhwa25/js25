-- Phase 2: public read access with no anonymous write access.
alter table public.places enable row level security;

revoke insert, update, delete, truncate, references, trigger
  on table public.places
  from anon;

grant select on table public.places to anon;

create policy "Anonymous users can read places"
  on public.places
  for select
  to anon
  using (true);
