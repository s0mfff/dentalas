-- DentalAssist: clean Supabase setup.
-- Run the whole file once in the SQL Editor of the project used in .env.
-- The app currently has no authentication, so catalogue mutations are public.

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tool-images',
  'tool-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_read_tool_images" on storage.objects;
drop policy if exists "public_insert_tool_images" on storage.objects;
drop policy if exists "public_update_tool_images" on storage.objects;
drop policy if exists "public_delete_tool_images" on storage.objects;

create policy "public_read_tool_images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'tool-images');

create policy "public_insert_tool_images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'tool-images');

create policy "public_update_tool_images"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'tool-images')
  with check (bucket_id = 'tool-images');

create policy "public_delete_tool_images"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'tool-images');

create table if not exists public.storage_zone_items (
  id uuid primary key default gen_random_uuid(),
  zone_id text not null,
  dental_tool_id uuid not null references public.dental_tools(id) on delete cascade,
  sort_order integer not null default 0,
  unique (zone_id, dental_tool_id)
);

create index if not exists idx_storage_zone_items_zone_id
  on public.storage_zone_items (zone_id, sort_order);

create index if not exists idx_storage_zone_items_dental_tool_id
  on public.storage_zone_items (dental_tool_id);

alter table public.storage_zone_items enable row level security;

grant select, insert, update, delete
  on public.storage_zone_items
  to anon, authenticated;

drop policy if exists "public_read_storage_zone_items" on public.storage_zone_items;
drop policy if exists "anon_insert_storage_zone_items" on public.storage_zone_items;
drop policy if exists "anon_update_storage_zone_items" on public.storage_zone_items;
drop policy if exists "anon_delete_storage_zone_items" on public.storage_zone_items;

create policy "public_read_storage_zone_items"
  on public.storage_zone_items for select
  to anon, authenticated
  using (true);

create policy "anon_insert_storage_zone_items"
  on public.storage_zone_items for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_storage_zone_items"
  on public.storage_zone_items for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon_delete_storage_zone_items"
  on public.storage_zone_items for delete
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
