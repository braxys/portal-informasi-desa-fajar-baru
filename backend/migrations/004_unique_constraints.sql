-- ==============================================================================
-- MIGRASI 004: UNIQUE CONSTRAINT (Cegah Data Duplikat)
-- Tanggal: 2026-11-04
-- ==============================================================================

-- Drop constraint lama jika ada (constraint otomatis drop index-nya)
ALTER TABLE public.links DROP CONSTRAINT IF EXISTS uq_links_title_url;
ALTER TABLE public.markers DROP CONSTRAINT IF EXISTS uq_markers_name_coords;

-- Unique constraint untuk links: title + url tidak boleh sama
ALTER TABLE public.links
ADD CONSTRAINT uq_links_title_url UNIQUE (title, url);

-- Unique constraint untuk markers: name + latitude + longitude tidak boleh sama
ALTER TABLE public.markers
ADD CONSTRAINT uq_markers_name_coords UNIQUE (name, latitude, longitude);
