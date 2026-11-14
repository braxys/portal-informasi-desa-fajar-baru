"use client";

import { useEffect, useRef } from "react";

/**
 * Mencatat satu kunjungan halaman publik. Dikirim sekali per muat halaman
 * lewat beacon supaya tidak menahan navigasi.
 */
export function PageViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const payload = JSON.stringify({
      eventType: "page_view",
      source: "portal_web",
    });

    try {
      const queued = navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
      if (queued) return;
    } catch {
      // Fall through to fetch when the beacon API is unavailable.
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
}
