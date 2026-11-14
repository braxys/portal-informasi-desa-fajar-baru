-- ==============================================================================
-- MIGRASI 010: TAMBAH KOLOM MAPS_URL KE TABEL MARKERS
-- Tanggal: 2026-11-12
-- ==============================================================================

ALTER TABLE public.markers
ADD COLUMN IF NOT EXISTS maps_url TEXT;

COMMENT ON COLUMN public.markers.maps_url IS 'Tautan Google Maps opsional untuk rute navigasi langsung';
