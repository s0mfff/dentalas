-- Run this entire file once in Supabase SQL Editor for the project used in .env.
-- Temporary policy for the current app, which does not have authentication yet.

create extension if not exists pgcrypto;

create table if not exists public.dental_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null default '',
  tags text[] not null default '{}',
  image_url text,
  storage_location text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.dental_tools add column if not exists image_url text;
alter table public.dental_tools enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.dental_tools to anon, authenticated;

drop policy if exists "anon_select_dental_tools" on public.dental_tools;
drop policy if exists "anon_insert_dental_tools" on public.dental_tools;
drop policy if exists "anon_update_dental_tools" on public.dental_tools;
drop policy if exists "anon_delete_dental_tools" on public.dental_tools;
drop policy if exists "public_read_dental_tools" on public.dental_tools;

create policy "public_read_dental_tools"
  on public.dental_tools for select
  to anon, authenticated
  using (true);

create policy "anon_insert_dental_tools"
  on public.dental_tools for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_dental_tools"
  on public.dental_tools for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon_delete_dental_tools"
  on public.dental_tools for delete
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
