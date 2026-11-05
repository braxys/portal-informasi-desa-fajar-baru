-- ==============================================================================
-- MIGRASI 007: SEED MARKERS (Titik Lokasi Desa Fajar Baru)
-- Tanggal: 2026-11-04
-- ==============================================================================

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
