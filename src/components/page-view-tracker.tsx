"use client";

import { useEffect, useRef } from "react";

interface PageViewTrackerProps {
  source?: string;
}

/**
 * Mencatat kunjungan halaman publik. Jika warga datang dari QR code
 * (contoh: /?src=qr_balai_desa), event `qr_scan` juga dicatat sehingga
 * metrik SDGs Desa 16.10.2 punya data pembanding.
 */
export function PageViewTracker({ source = "web_direct" }: PageViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }
    hasTracked.current = true;

    const events: Array<"page_view" | "qr_scan"> = ["page_view"];

    if (source.startsWith("qr")) {
      events.push("qr_scan");
    }

    events.forEach((eventType) => {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, source }),
        keepalive: true,
      }).catch(() => {
        // Tracking bersifat opsional, jangan sampai mengganggu render halaman.
      });
    });
  }, [source]);

  return null;
}
