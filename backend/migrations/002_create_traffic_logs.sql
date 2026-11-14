-- ==============================================================================
-- MIGRASI 002: TABEL TRAFFIC_LOGS (Analitik SDGs 16.10.2)
-- Tanggal: 2026-11-04
-- ==============================================================================

-- TABEL: traffic_logs
CREATE TABLE IF NOT EXISTS public.traffic_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    link_id UUID REFERENCES public.links(id) ON DELETE SET NULL,
    source VARCHAR(100) DEFAULT 'direct',
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk filter analitik laporan
CREATE INDEX IF NOT EXISTS idx_traffic_logs_created_at ON public.traffic_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_event_type ON public.traffic_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_source ON public.traffic_logs (source);

-- Function atomic: increment_link_click
CREATE OR REPLACE FUNCTION public.increment_link_click(target_link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.links
    SET click_count = click_count + 1
    WHERE id = target_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
