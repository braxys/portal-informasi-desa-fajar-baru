-- ==============================================================================
-- MIGRASI 007: SEED MARKERS (Titik Lokasi Desa Fajar Baru)
-- Tanggal: 2026-11-04
-- ==============================================================================

INSERT INTO public.markers (name, latitude, longitude, keterangan, jenis_info, is_active, display_order)
VALUES
(
    'Balai Desa Fajar Baru',
    -5.3436945,
    105.2680212,
    'Pusat pelayanan administrasi kependudukan, perizinan, dan pemerintahan Desa Fajar Baru.',
    'kantor',
    true,
    1
),
(
    'Puskesdes Fajar Baru',
    -5.3392000,
    105.2672000,
    'Pusat pelayanan kesehatan dasar, pemeriksaan warga, dan imunisasi desa.',
    'fasilitas',
    true,
    2
),
(
    'Posyandu Lansia Sentosa',
    -5.3468000,
    105.2660000,
    'Pos pelayanan terpadu kesehatan lansia dan balita warga Fajar Baru.',
    'layanan',
    true,
    3
)
ON CONFLICT ON CONSTRAINT uq_markers_name_coords DO NOTHING;
