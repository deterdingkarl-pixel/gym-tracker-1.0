-- Iron Log: Tabelle für Cloud-Synchronisierung
-- Im Supabase-Dashboard unter "SQL Editor" ausführen.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security aktivieren: jeder Nutzer sieht/ändert nur seine eigene Zeile.
alter table public.user_data enable row level security;

create policy "Nutzer lesen eigene Daten"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "Nutzer schreiben eigene Daten"
  on public.user_data for insert
  with check (auth.uid() = user_id);

create policy "Nutzer aktualisieren eigene Daten"
  on public.user_data for update
  using (auth.uid() = user_id);

create policy "Nutzer löschen eigene Daten"
  on public.user_data for delete
  using (auth.uid() = user_id);
