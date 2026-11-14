-- ==============================================================================
-- MIGRASI 011: REALTIME UNTUK COUNTER KLIK TAUTAN
-- Tanggal: 2026-11-14
-- Deskripsi:
--   Mendaftarkan tabel public.links ke publikasi Supabase Realtime supaya
--   dashboard admin menerima perubahan click_count secara langsung tanpa
--   memuat ulang halaman.
-- ==============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) AND NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'links'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.links';
    END IF;
END
$$;
