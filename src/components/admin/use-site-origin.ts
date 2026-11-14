"use client";

import { useSyncExternalStore } from "react";

function subscribeToNothing() {
  return () => undefined;
}

function getBrowserOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    window.location.origin
  );
}

/**
 * Origin situs di browser. Nilai kosong saat render server, lalu terisi
 * setelah hidrasi supaya markup awal dan akhir tetap sama.
 */
export function useSiteOrigin() {
  return useSyncExternalStore(subscribeToNothing, getBrowserOrigin, () => "");
}

export function isLocalOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
}
