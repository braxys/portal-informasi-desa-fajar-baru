-- ==============================================================================
-- MIGRASI 014: TABEL QR CODES (QR MANDIRI DENGAN PELACAKAN PINDAI)
-- Tanggal: 2026-11-14
-- Deskripsi:
--   1. Membuat tabel public.qr_codes supaya setiap QR punya identitas sendiri,
--      target URL sendiri, dan counter pindai sendiri.
--   2. Menambah kolom qr_code_id pada traffic_logs agar pindai QR tercatat
--      per QR (bukan hanya per tautan).
--   3. Function atomic increment_qr_code_scan untuk menaikkan counter pindai.
--   4. RLS: publik hanya boleh membaca QR aktif, admin boleh CRUD penuh.
--   5. Mendaftarkan qr_codes ke publikasi Supabase Realtime agar dashboard
--      menerima perubahan scan_count tanpa memuat ulang halaman.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    scan_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_active_created
    ON public.qr_codes (is_active, created_at DESC);

DROP TRIGGER IF EXISTS trigger_qr_codes_updated_at ON public.qr_codes;
CREATE TRIGGER trigger_qr_codes_updated_at
    BEFORE UPDATE ON public.qr_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Hubungkan log pindai ke QR yang dipindai. ON DELETE SET NULL menjaga riwayat
-- analitik tetap ada walaupun QR dihapus.
ALTER TABLE public.traffic_logs
    ADD COLUMN IF NOT EXISTS qr_code_id UUID
    REFERENCES public.qr_codes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_traffic_logs_qr_code_id
    ON public.traffic_logs (qr_code_id);

-- Function atomic: increment_qr_code_scan
CREATE OR REPLACE FUNCTION public.increment_qr_code_scan(target_qr_code_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.qr_codes
    SET scan_count = scan_count + 1
    WHERE id = target_qr_code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active qr codes" ON public.qr_codes;
CREATE POLICY "Public can view active qr codes"
    ON public.qr_codes FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Admin can view all qr codes" ON public.qr_codes;
CREATE POLICY "Admin can view all qr codes"
    ON public.qr_codes FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin can insert qr codes" ON public.qr_codes;
CREATE POLICY "Admin can insert qr codes"
    ON public.qr_codes FOR INSERT
    TO authenticated
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin can update qr codes" ON public.qr_codes;
CREATE POLICY "Admin can update qr codes"
    ON public.qr_codes FOR UPDATE
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin can delete qr codes" ON public.qr_codes;
CREATE POLICY "Admin can delete qr codes"
    ON public.qr_codes FOR DELETE
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Realtime untuk counter pindai QR
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) AND NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'qr_codes'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_codes';
    END IF;
END
$$;
