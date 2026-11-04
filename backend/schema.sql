-- ==============================================================================
-- SKEMA DATABASE: PORTAL INFORMASI DESA FAJAR BARU
-- Proyek: Kapita Selekta Informatika (Kelompok 3 - ITERA 2026)
-- Target SDGs: SDGs Desa 16 (Kelembagaan Desa yang Tangguh - Indikator 16.10.2)
-- ==============================================================================

-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: links (Daftar Tautan Informasi Desa)
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'informasi', -- 'bumdes', 'layanan', 'medsos', 'informasi', 'survei'
    icon VARCHAR(50) DEFAULT 'link',                   -- Nama icon / identifier UI
    is_active BOOLEAN NOT NULL DEFAULT true,           -- Toggle tampil di publik
    is_featured BOOLEAN NOT NULL DEFAULT false,        -- Sorotan utama (misal: Oprec BUMDes)
    display_order INTEGER NOT NULL DEFAULT 0,          -- Urutan prioritas tampilan
    click_count INTEGER NOT NULL DEFAULT 0,            -- Agregat klik cepat
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk performa query publik
CREATE INDEX IF NOT EXISTS idx_links_active_order ON public.links (is_active, display_order ASC);

-- Trigger untuk otomatis update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_links_updated_at ON public.links;
CREATE TRIGGER trigger_links_updated_at
    BEFORE UPDATE ON public.links
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


-- 3. TABEL: traffic_logs (Pencatatan Pindaian QR & Kunjungan untuk SDGs 16.10.2)
CREATE TABLE IF NOT EXISTS public.traffic_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,                    -- 'qr_scan', 'page_view', 'link_click'
    link_id UUID REFERENCES public.links(id) ON DELETE SET NULL,
    source VARCHAR(100) DEFAULT 'direct',              -- 'qr_poster', 'qr_balai_desa', 'web_direct', 'whatsapp'
    user_agent TEXT,
    ip_hash VARCHAR(64),                               -- Anonymized hash IP untuk metrik pengunjung unik
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk filter analitik laporan
CREATE INDEX IF NOT EXISTS idx_traffic_logs_created_at ON public.traffic_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_event_type ON public.traffic_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_source ON public.traffic_logs (source);


-- 4. FUNCTION ATOMIC: increment_link_click
CREATE OR REPLACE FUNCTION public.increment_link_click(target_link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.links
    SET click_count = click_count + 1
    WHERE id = target_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk TABEL links:
-- a. Publik (anonim & login) bisa membaca link yang aktif
DROP POLICY IF EXISTS "Public can view active links" ON public.links;
CREATE POLICY "Public can view active links"
    ON public.links FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- b. Admin (authenticated) bisa melihat semua link (aktif & non-aktif)
DROP POLICY IF EXISTS "Admin can view all links" ON public.links;
CREATE POLICY "Admin can view all links"
    ON public.links FOR SELECT
    TO authenticated
<<<<<<< HEAD
    USING (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

-- c. Admin (authenticated) bisa INSERT link
DROP POLICY IF EXISTS "Admin can insert links" ON public.links;
CREATE POLICY "Admin can insert links"
    ON public.links FOR INSERT
    TO authenticated
<<<<<<< HEAD
    WITH CHECK (true);
=======
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

-- d. Admin (authenticated) bisa UPDATE link
DROP POLICY IF EXISTS "Admin can update links" ON public.links;
CREATE POLICY "Admin can update links"
    ON public.links FOR UPDATE
    TO authenticated
<<<<<<< HEAD
    USING (true)
    WITH CHECK (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

-- e. Admin (authenticated) bisa DELETE link
DROP POLICY IF EXISTS "Admin can delete links" ON public.links;
CREATE POLICY "Admin can delete links"
    ON public.links FOR DELETE
    TO authenticated
<<<<<<< HEAD
    USING (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692


-- Kebijakan RLS untuk TABEL traffic_logs:
-- a. Siapa pun (anon & authenticated) boleh insert log (ketika warga scan QR / klik)
DROP POLICY IF EXISTS "Anyone can insert traffic logs" ON public.traffic_logs;
CREATE POLICY "Anyone can insert traffic logs"
    ON public.traffic_logs FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- b. Hanya Admin (authenticated) yang boleh membaca data analitik untuk laporan
DROP POLICY IF EXISTS "Only admin can view traffic logs" ON public.traffic_logs;
CREATE POLICY "Only admin can view traffic logs"
    ON public.traffic_logs FOR SELECT
    TO authenticated
<<<<<<< HEAD
    USING (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692


-- 6. DATA AWAL (SEED DATA KHUSUS DESA FAJAR BARU)
INSERT INTO public.links (title, description, url, category, icon, is_active, is_featured, display_order)
VALUES
(
    'Pendaftaran Pengurus BUMDes Fajar Baru',
    'Formulir open recruitment pengurus Badan Usaha Milik Desa Fajar Baru.',
    'https://forms.google.com',
    'bumdes',
    'users',
    true,
    true,
    1
),
(
    'Website Resmi Desa Fajar Baru',
    'Portal resmi informasi pemerintahan dan profil Desa Fajar Baru, Jati Agung.',
    'https://fajarbaru.desa.id',
    'layanan',
    'globe',
    true,
    false,
    2
),
(
    'Instagram Resmi Desa Fajar Baru',
    'Kanal dokumentasi kegiatan dan kabar terbaru seputar desa.',
    'https://instagram.com',
    'medsos',
    'instagram',
    true,
    false,
    3
),
(
    'Survei Kepuasan & Layanan Masyarakat',
    'Kuesioner evaluasi penyebaran informasi dan layanan publik desa.',
    'https://forms.google.com',
    'survei',
    'clipboard-list',
    true,
    false,
    4
)
ON CONFLICT DO NOTHING;
