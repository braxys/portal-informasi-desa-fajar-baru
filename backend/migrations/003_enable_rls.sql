-- ==============================================================================
-- MIGRASI 003: ROW LEVEL SECURITY (RLS)
-- Tanggal: 2026-11-04
-- ==============================================================================

-- Aktifkan RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk tabel links:
DROP POLICY IF EXISTS "Public can view active links" ON public.links;
CREATE POLICY "Public can view active links"
    ON public.links FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Admin can view all links" ON public.links;
CREATE POLICY "Admin can view all links"
    ON public.links FOR SELECT
    TO authenticated
<<<<<<< HEAD
    USING (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

DROP POLICY IF EXISTS "Admin can insert links" ON public.links;
CREATE POLICY "Admin can insert links"
    ON public.links FOR INSERT
    TO authenticated
<<<<<<< HEAD
    WITH CHECK (true);
=======
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

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

DROP POLICY IF EXISTS "Admin can delete links" ON public.links;
CREATE POLICY "Admin can delete links"
    ON public.links FOR DELETE
    TO authenticated
<<<<<<< HEAD
    USING (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

-- Kebijakan RLS untuk tabel traffic_logs:
DROP POLICY IF EXISTS "Anyone can insert traffic logs" ON public.traffic_logs;
CREATE POLICY "Anyone can insert traffic logs"
    ON public.traffic_logs FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Only admin can view traffic logs" ON public.traffic_logs;
CREATE POLICY "Only admin can view traffic logs"
    ON public.traffic_logs FOR SELECT
    TO authenticated
<<<<<<< HEAD
    USING (true);
=======
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
