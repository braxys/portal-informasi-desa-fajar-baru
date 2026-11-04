"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsSummary, TrafficEventType } from "@/types/database";

interface LogEventParams {
  eventType: TrafficEventType;
  linkId?: string;
  source?: string;
}

/**
 * Merekam aktivitas pindaian QR Code, kunjungan halaman, atau klik tautan
 * Berfungsi sebagai instrumen pembuktian Indikator SDGs Desa 16.10.2
 */
export async function logTrafficEvent({
  eventType,
  linkId,
  source = "direct",
}: LogEventParams): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "unknown";

    // Simpan log ke tabel traffic_logs
    const { error: insertError } = await supabase.from("traffic_logs").insert([
      {
        event_type: eventType,
        link_id: linkId || null,
        source: source,
        user_agent: userAgent.slice(0, 500),
      },
    ]);

    if (insertError) {
      console.warn("Log traffic gagal:", insertError.message);
    }

    // Jika berupa klik link, naikkan agregat counter di tabel links
    if (eventType === "link_click" && linkId) {
      await supabase.rpc("increment_link_click", {
        target_link_id: linkId,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Error logging traffic event:", err);
    return { success: false };
  }
}

/**
 * Mengambil ringkasan analitik untuk Dashboard Admin Desa
 * Digunakan sebagai bukti capaian target SDGs 16.10.2 pada laporan akhir
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  // 1. Ambil agregat dari traffic_logs
  const { data: logs, error: logsError } = await supabase
    .from("traffic_logs")
    .select("event_type, source, link_id");

  // 2. Ambil klik link dari tabel links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, click_count")
    .order("click_count", { ascending: false });

  if (logsError) {
    console.error("Gagal mengambil data logs:", logsError.message);
  }
  if (linksError) {
    console.error("Gagal mengambil data links:", linksError.message);
  }

  const safeLogs = logs || [];
  const safeLinks = links || [];

  let totalPageViews = 0;
  let totalQrScans = 0;
  let totalLinkClicks = 0;
  const sourceBreakdown: Record<string, number> = {};

  safeLogs.forEach((log) => {
    if (log.event_type === "page_view") totalPageViews++;
    if (log.event_type === "qr_scan") totalQrScans++;
    if (log.event_type === "link_click") totalLinkClicks++;

    const src = log.source || "direct";
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  });

  const topLinks = safeLinks.map((l) => ({
    id: l.id,
    title: l.title,
    clicks: l.click_count || 0,
  }));

  return {
    totalPageViews,
    totalQrScans,
    totalLinkClicks,
    sourceBreakdown,
    topLinks,
  };
}
