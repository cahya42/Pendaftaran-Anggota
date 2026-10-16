-- ============================================================
-- KOPERASI KONSUMEN HOS TJOKROAMINOTO — Tabel pendaftar anggota
-- Jalankan di Supabase Dashboard > SQL Editor > New query
-- ============================================================

create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  reg_no text not null unique,
  nia text,
  nama text not null,
  nik text not null,
  ttl text,
  gender text,
  pekerjaan text,
  hp text,
  email text,
  alamat text,
  simpanan_pokok integer not null default 25000,
  simpanan_wajib integer not null default 10000,
  metode text,
  status text not null default 'Menunggu',
  tanggal_daftar text,
  ktp_url text,
  selfie_url text,
  ttd_url text,
  created_at timestamptz not null default now()
);

-- Izinkan anon key membaca/menulis (formulir publik).
-- Catatan: anon key BOLEH terekspos di frontend, tapi atur RLS
-- ketat bila aplikasi sudah butuh login pengurus.
alter table public.applicants enable row level security;

drop policy if exists "public read applicants" on public.applicants;
create policy "public read applicants"
  on public.applicants for select
  using (true);

drop policy if exists "public insert applicants" on public.applicants;
create policy "public insert applicants"
  on public.applicants for insert
  with check (true);

drop policy if exists "public update applicants" on public.applicants;
create policy "public update applicants"
  on public.applicants for update
  using (true);
