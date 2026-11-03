-- ============================================================
-- Migration Tambahan keamanan & manajemen pembayaran
-- ============================================================

-- 1. Tabel rekening bank
create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  nomor_rekening text not null unique,
  bank text not null,
  nama_pemilik text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Tabel QRIS (gambar kode QR / data link)
create table if not exists public.qris (
  id uuid primary key default gen_random_uuid(),
  qr_image_url text not null,
  label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Tambahkan kolom referensi bank ke aplikasi pendaftar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicants'
      AND column_name = 'bank_rekening'
  ) THEN
    ALTER TABLE public.applicants ADD COLUMN bank_rekening text;
    ALTER TABLE public.applicants ADD COLUMN bank_nama text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'applicants'
      AND column_name = 'qris_image_url'
  ) THEN
    ALTER TABLE public.applicants ADD COLUMN qris_image_url text;
  END IF;
END $$;

-- 4. RLS untuk bank_accounts
alter table public.bank_accounts enable row level security;

drop policy if exists "public read bank_accounts" on public.bank_accounts;
create policy "public read bank_accounts"
  on public.bank_accounts for select
  using (true);

drop policy if exists "public insert bank_accounts" on public.bank_accounts;
create policy "public insert bank_accounts"
  on public.bank_accounts for insert
  with check (true);

drop policy if exists "public update bank_accounts" on public.bank_accounts;
create policy "public update bank_accounts"
  on public.bank_accounts for update
  using (true)
  with check (true);

drop policy if exists "public delete bank_accounts" on public.bank_accounts;
create policy "public delete bank_accounts"
  on public.bank_accounts for delete
  using (true);

-- 5. RLS untuk qris
alter table public.qris enable row level security;

drop policy if exists "public read qris" on public.qris;
create policy "public read qris"
  on public.qris for select
  using (true);

drop policy if exists "public insert qris" on public.qris;
create policy "public insert qris"
  on public.qris for insert
  with check (true);

drop policy if exists "public update qris" on public.qris;
create policy "public update qris"
  on public.qris for update
  using (true)
  with check (true);

drop policy if exists "public delete qris" on public.qris;
create policy "public delete qris"
  on public.qris for delete
  using (true);

-- 6. Hanya admin yang bisa mengelola
-- (Opsional: batasi ke role admin/superadmin)
