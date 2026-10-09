-- Overlay state untuk halaman /bracket, /sesaatlagi, /win, dan /inmatch.
-- Single-row tables (id = 1) mengikuti pola single-room mode project ini.
-- Cara pakai: jalankan di Supabase Dashboard > SQL Editor > New query > Run.
-- File ini idempoten — aman di-run ulang setiap ada update.

-- ─── 1. Tabel bracket (12 slot nama tim) ───
create table if not exists public.bracket (
  id integer primary key,
  m1a text not null default 'TIM 1',
  m1b text not null default 'TIM 2',
  m2a text not null default 'TIM 3',
  m2b text not null default 'TIM 4',
  m3a text not null default 'TIM 5',
  m3b text not null default 'TIM 6',
  m4a text not null default 'TIM 7',
  m4b text not null default 'WINNER M1',
  m5a text not null default 'WINNER M2',
  m5b text not null default 'WINNER M3',
  fa  text not null default 'WINNER M4',
  fb  text not null default 'WINNER M5',
  updated_at timestamptz not null default now()
);

insert into public.bracket (id)
values (1)
on conflict (id) do nothing;

-- ─── 2. Tabel sesaatlagi (info match + countdown + winner override) ───
-- Countdown berbasis TARGET WAKTU: sisa = target_at - now (epoch ms).
-- total_sec/running/started_at dipertahankan untuk kompatibilitas lama.
create table if not exists public.sesaatlagi (
  id integer primary key,
  blue text not null default '',
  red text not null default '',
  game text not null default '',
  stage text not null default 'PENYISIHAN',
  total_sec integer not null default 0,
  running boolean not null default false,
  started_at bigint,
  target_at bigint,
  winner text not null default '',
  updated_at timestamptz not null default now()
);

-- Untuk database yang sudah menjalankan migrasi versi lama:
alter table public.sesaatlagi add column if not exists target_at bigint;

insert into public.sesaatlagi (id)
values (1)
on conflict (id) do nothing;

-- ─── 3. Tabel overlay_control (kontrol overlay bawah InMatch + player stats) ───
-- Ditulis dari /control (atau hotkey E/I/H di halaman /inmatch),
-- dibaca realtime oleh halaman /inmatch di semua perangkat.
create table if not exists public.overlay_control (
  id integer primary key,
  active_overlay text not null default 'none',
  side_item_visible boolean not null default true,
  player_stats_visible boolean not null default false,
  player_stats_metric text not null default 'gold',
  updated_at timestamptz not null default now()
);

insert into public.overlay_control (id)
values (1)
on conflict (id) do nothing;

-- Nama caster untuk overlay InMatch (teks hitam di atas info patch).
-- Untuk database yang sudah menjalankan migrasi versi lama:
alter table public.overlay_control add column if not exists caster_name text not null default '';

-- ─── 4. RLS: buka akses anon (sama seperti tabel rooms/match_setup) ───
alter table public.bracket enable row level security;
alter table public.sesaatlagi enable row level security;
alter table public.overlay_control enable row level security;

drop policy if exists "open all" on public.bracket;
create policy "open all" on public.bracket
  for all using (true) with check (true);

drop policy if exists "open all" on public.sesaatlagi;
create policy "open all" on public.sesaatlagi
  for all using (true) with check (true);

drop policy if exists "open all" on public.overlay_control;
create policy "open all" on public.overlay_control
  for all using (true) with check (true);

-- ─── 5. Realtime: daftarkan ketiga tabel ke publication ───
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bracket'
  ) then
    alter publication supabase_realtime add table public.bracket;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sesaatlagi'
  ) then
    alter publication supabase_realtime add table public.sesaatlagi;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'overlay_control'
  ) then
    alter publication supabase_realtime add table public.overlay_control;
  end if;
end
$$;
