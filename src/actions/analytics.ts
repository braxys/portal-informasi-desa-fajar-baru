"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isLocalMarkerPreviewEnabled } from "@/lib/marker-preview";
import type { AnalyticsSummary, TrafficEventType } from "@/types/database";

interface LogEventParams {
  eventType: TrafficEventType;
  linkId?: string;
  qrCodeId?: string;
  source?: string;
}

/**
 * Merekam aktivitas pindaian QR Code, kunjungan halaman, atau klik tautan
 * Berfungsi sebagai instrumen pembuktian Indikator SDGs Desa 16.10.2
 */
export async function logTrafficEvent({
  eventType,
  linkId,
  qrCodeId,
  source = "direct",
}: LogEventParams): Promise<{ success: boolean }> {
  if (isLocalMarkerPreviewEnabled()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "unknown";

    // Simpan log ke tabel traffic_logs
    const { error: insertError } = await supabase.from("traffic_logs").insert([
      {
        event_type: eventType,
        link_id: linkId || null,
        qr_code_id: qrCodeId || null,
        source: source,
        user_agent: userAgent.slice(0, 500),
      },
    ]);

    if (insertError) {
      console.warn("Log traffic gagal:", insertError.message);
      return { success: false };
    }

    // Jika berupa klik link, naikkan agregat counter di tabel links
    if (eventType === "link_click" && linkId) {
      await supabase.rpc("increment_link_click", {
        target_link_id: linkId,
      });
    }

    // Jika berupa pindai QR, naikkan agregat counter pindai di tabel links
    if (eventType === "qr_scan" && linkId) {
      await supabase.rpc("increment_qr_scan", {
        target_link_id: linkId,
      });
    }

    // Pindai QR mandiri punya counter sendiri di tabel qr_codes
    if (eventType === "qr_scan" && qrCodeId) {
      await supabase.rpc("increment_qr_code_scan", {
        target_qr_code_id: qrCodeId,
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
 *
 * Perhitungan dilakukan lewat RPC agregasi (COUNT ... GROUP BY) di database,
 * bukan dengan menarik seluruh baris traffic_logs ke aplikasi. Cara ini tetap
 * akurat setelah log melewati batas 1000 baris PostgREST, dan hanya
 * mengirimkan beberapa baris hasil agregat ke server.
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  // 1. Ambil agregat event & sumber dari traffic_logs lewat RPC
  const { data: summaryRows, error: summaryError } = await supabase.rpc(
    "traffic_summary",
  );

  // 2. Ambil tautan dengan klik terbanyak langsung dari tabel links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, click_count")
    .order("click_count", { ascending: false });

  if (summaryError) {
    console.error("Gagal mengambil agregat traffic_logs:", summaryError.message);
  }
  if (linksError) {
    console.error("Gagal mengambil data links:", linksError.message);
  }

  const safeRows = (summaryRows || []) as {
    event_type: TrafficEventType;
    source: string | null;
    total: number | string;
  }[];

  let totalPageViews = 0;
  let totalQrScans = 0;
  let totalLinkClicks = 0;
  const sourceBreakdown: Record<string, number> = {};

  for (const row of safeRows) {
    const total = Number(row.total) || 0;

    if (row.event_type === "page_view") totalPageViews += total;
    if (row.event_type === "qr_scan") totalQrScans += total;
    if (row.event_type === "link_click") totalLinkClicks += total;

    const src = row.source || "direct";
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + total;
  }

  const topLinks = (links || []).map((l) => ({
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
