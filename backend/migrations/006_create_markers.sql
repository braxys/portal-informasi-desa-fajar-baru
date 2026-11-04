-- ==============================================================================
-- MIGRASI 005: TABEL MARKERS (Titik Lokasi di Peta Desa)
-- Tanggal: 2026-11-04
-- ==============================================================================

-- TABEL: markers
CREATE TABLE IF NOT EXISTS public.markers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    keterangan TEXT,
    jenis_info VARCHAR(50) NOT NULL DEFAULT 'fasilitas', -- 'kantor', 'fasilitas', 'layanan'
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query peta
CREATE INDEX IF NOT EXISTS idx_markers_active ON public.markers (is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_markers_jenis ON public.markers (jenis_info);

-- Trigger update updated_at
DROP TRIGGER IF EXISTS trigger_markers_updated_at ON public.markers;
CREATE TRIGGER trigger_markers_updated_at
    BEFORE UPDATE ON public.markers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.markers ENABLE ROW LEVEL SECURITY;

-- Publik bisa lihat marker aktif
DROP POLICY IF EXISTS "Public can view active markers" ON public.markers;
CREATE POLICY "Public can view active markers"
    ON public.markers FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Admin bisa kelola semua
DROP POLICY IF EXISTS "Admin can manage markers" ON public.markers;
CREATE POLICY "Admin can manage markers"
    ON public.markers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed data: titik lokasi Desa Fajar Baru (koordinat real Kec. Jati Agung, Lampung Selatan)
INSERT INTO public.markers (name, latitude, longitude, keterangan, jenis_info, is_active, display_order)
VALUES
(
    'Balai Desa Fajar Baru',
    -5.3025000,
    105.2347000,
    'Pusat pelayanan administrasi masyarakat',
    'kantor',
    true,
    1
),
(
    'Puskesdes',
    -5.3018000,
    105.2365000,
    'Fasilitas kesehatan tingkat desa',
    'fasilitas',
    true,
    2
),
(
    'Posko Pelayanan',
    -5.3032000,
    105.2330000,
    'Titik informasi dan layanan warga',
    'layanan',
    true,
    3
)
ON CONFLICT ON CONSTRAINT uq_markers_name_coords DO NOTHING;
