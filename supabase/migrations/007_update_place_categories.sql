-- Replace the legacy place categories with the six categories used by Locations.
alter table public.places
  drop constraint if exists places_category_check;

update public.places
set category = case category
  when 'EVENT' then 'ENTERTAINMENT'
  when 'OTHER' then 'PHOTO SPOT'
  when 'HOTEL' then 'ATTRACTION'
  else category
end
where category in ('EVENT', 'OTHER', 'HOTEL');

alter table public.places
  add constraint places_category_check check (category in (
    'ATTRACTION',
    'RESTAURANT',
    'CAFE',
    'SHOPPING',
    'PHOTO SPOT',
    'ENTERTAINMENT'
  ));
