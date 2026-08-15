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
