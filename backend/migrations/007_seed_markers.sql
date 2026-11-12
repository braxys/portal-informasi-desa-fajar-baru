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
    'SDN 1 Fajar Baru',
    -5.3439045,
    105.2682266,
    'Fasilitas pendidikan dasar negeri formal untuk siswa-siswi warga Fajar Baru.',
    'pendidikan',
    true,
    2
)
ON CONFLICT ON CONSTRAINT uq_markers_name_coords DO NOTHING;
