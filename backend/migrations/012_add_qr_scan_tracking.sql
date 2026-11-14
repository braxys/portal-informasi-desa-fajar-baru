-- ==============================================================================
-- MIGRASI 012: PELACAKAN PINDAI QR CODE
-- Tanggal: 2026-11-14
-- Deskripsi:
--   1. Menambah kolom scan_count pada public.links sebagai agregat pindai.
--   2. Function atomic increment_qr_scan untuk menaikkan counter.
--   3. Backfill scan_count dari traffic_logs (event_type = 'qr_scan').
-- ==============================================================================

ALTER TABLE public.links
    ADD COLUMN IF NOT EXISTS scan_count INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_qr_scan(target_link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.links
    SET scan_count = scan_count + 1
    WHERE id = target_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Samakan agregat dengan riwayat log yang sudah ada (idempoten, tidak menurunkan).
UPDATE public.links AS l
SET scan_count = GREATEST(l.scan_count, counts.total)
FROM (
    SELECT link_id, COUNT(*)::int AS total
    FROM public.traffic_logs
    WHERE event_type = 'qr_scan'
      AND link_id IS NOT NULL
    GROUP BY link_id
) AS counts
WHERE l.id = counts.link_id;
