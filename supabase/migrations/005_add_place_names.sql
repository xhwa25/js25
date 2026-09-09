-- Add language-specific display names while preserving all existing records.
alter table public.places
  add column if not exists english_name text,
  add column if not exists korean_name text;

alter table public.places
  alter column name drop not null;
