-- Phase 2 development seed data.
-- These records are fictional and can be replaced by project-maintainer data later.
insert into public.places (
  name,
  description,
  category,
  continent,
  country,
  city,
  address,
  latitude,
  longitude,
  visit_year,
  image_url
)
values
  (
    'Haneul Park',
    'A wide-open hillside park known for silver grass and city views.',
    'ATTRACTION',
    'ASIA',
    'South Korea',
    'Seoul',
    '95 Haneulgongwon-ro, Mapo-gu',
    37.5663,
    126.8858,
    2025,
    'https://images.example.com/haneul-park.jpg'
  ),
  (
    'Lina Stores',
    'A colorful London pasta shop with a tiny counter and handmade dishes.',
    'RESTAURANT',
    'EUROPE',
    'United Kingdom',
    'London',
    '18 Greek Street, Soho',
    51.5139,
    -0.1314,
    2025,
    'https://images.example.com/lina-stores.jpg'
  ),
  (
    'The Grounds of Alexandria',
    'A garden cafe and bakery in a converted industrial precinct.',
    'CAFE',
    'OCEANIA',
    'Australia',
    'Sydney',
    '41-43a Harris Street, Alexandria',
    -33.9102,
    151.1949,
    2024,
    'https://images.example.com/grounds-alexandria.jpg'
  ),
  (
    'Myeongdong Market',
    'A lively Seoul shopping district filled with street food and local brands.',
    'SHOPPING',
    'ASIA',
    'South Korea',
    'Seoul',
    'Myeongdong-gil, Jung-gu',
    37.5636,
    126.9869,
    2024,
    'https://images.example.com/myeongdong-market.jpg'
  ),
  (
    'Palais de Tokyo',
    'A contemporary art museum overlooking the Seine and Eiffel Tower.',
    'ATTRACTION',
    'EUROPE',
    'France',
    'Paris',
    '13 Avenue du President Wilson',
    48.8649,
    2.2977,
    2023,
    'https://images.example.com/palais-de-tokyo.jpg'
  ),
  (
    'Dover Street Market',
    'A multi-floor edit of fashion, art, and design in New York.',
    'SHOPPING',
    'NORTH_AMERICA',
    'United States',
    'New York',
    '160 Lexington Avenue, Manhattan',
    40.7448,
    -73.9811,
    2023,
    'https://images.example.com/dover-street-market.jpg'
  );
