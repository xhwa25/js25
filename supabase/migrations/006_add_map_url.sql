-- Optional Google Maps link for each place.
alter table public.places
  add column if not exists map_url text;
