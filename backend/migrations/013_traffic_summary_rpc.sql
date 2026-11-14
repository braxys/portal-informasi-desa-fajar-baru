-- ==============================================================================
-- MIGRASI 013: AGREGASI KUNJUNGAN HALAMAN UNTUK DASHBOARD ADMIN
-- Tanggal: 2026-11-14
-- Deskripsi:
--   Kartu "Kunjungan halaman" pada dashboard admin sebelumnya dihitung di
--   aplikasi dengan menarik SELURUH baris traffic_logs lewat PostgREST.
--   PostgREST membatasi jumlah baris yang dikembalikan (default 1000), jadi
--   setelah log melewati batas itu angka kunjungan berhenti bertambah.
--
--   Fungsi ini memindahkan perhitungan ke database (COUNT ... GROUP BY)
--   sehingga hasilnya tetap akurat untuk data berapa pun besarnya.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.traffic_summary()
RETURNS TABLE (event_type TEXT, source TEXT, total BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        logs.event_type::TEXT,
        COALESCE(NULLIF(logs.source, ''), 'direct')::TEXT AS source,
        COUNT(*)::BIGINT AS total
    FROM public.traffic_logs AS logs
    GROUP BY logs.event_type, COALESCE(NULLIF(logs.source, ''), 'direct');
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

COMMENT ON FUNCTION public.traffic_summary() IS
    'Agregat jumlah event per tipe dan sumber untuk dashboard admin (SDGs 16.10.2).';

-- Hanya admin yang boleh membaca agregat, sejalan dengan kebijakan RLS
-- "Only admin can view traffic logs" pada tabel traffic_logs.
REVOKE ALL ON FUNCTION public.traffic_summary() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traffic_summary() TO authenticated;
