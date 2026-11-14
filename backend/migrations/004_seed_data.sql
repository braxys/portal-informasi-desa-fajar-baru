-- ==============================================================================
-- MIGRASI 004: SEED DATA (Data Awal Desa Fajar Baru)
-- Tanggal: 2026-11-04
-- ==============================================================================

INSERT INTO public.links (title, description, url, category, icon, is_active, is_featured, display_order)
SELECT seed.title, seed.description, seed.url, seed.category, seed.icon,
       seed.is_active, seed.is_featured, seed.display_order
FROM (VALUES
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
)) AS seed(title, description, url, category, icon, is_active, is_featured, display_order)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.links AS existing
    WHERE existing.title = seed.title
      AND existing.url = seed.url
);
