-- ==============================================================================
-- MIGRASI 006: UNIQUE CONSTRAINT (Cegah Data Duplikat)
-- Tanggal: 2026-11-04
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_links_title_url'
          AND conrelid = 'public.links'::regclass
    ) THEN
        ALTER TABLE public.links
            ADD CONSTRAINT uq_links_title_url UNIQUE (title, url);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_markers_name_coords'
          AND conrelid = 'public.markers'::regclass
    ) THEN
        ALTER TABLE public.markers
            ADD CONSTRAINT uq_markers_name_coords UNIQUE (name, latitude, longitude);
    END IF;
END;
$$;
