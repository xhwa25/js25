-- Phase 2: indexes used by the planned category, region, year, and search filters.
create index if not exists idx_places_category
  on public.places(category);

create index if not exists idx_places_continent
  on public.places(continent);

create index if not exists idx_places_visit_year
  on public.places(visit_year);

create index if not exists idx_places_country
  on public.places(country);

create index if not exists idx_places_city
  on public.places(city);
