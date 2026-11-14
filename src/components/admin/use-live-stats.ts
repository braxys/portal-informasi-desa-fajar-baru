"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Link, QrCode } from "@/types/database";

const POLL_INTERVAL_MS = 20000;

export type LiveStatsStatus = "connecting" | "live" | "polling";

function hasChanged<T>(row: T, fresh: Partial<T>) {
  return (Object.keys(fresh) as (keyof T)[]).some(
    (key) => key !== "id" && row[key] !== fresh[key],
  );
}

/**
 * Menjaga counter (klik/pindai/status) tetap terbaru: mendengarkan perubahan
 * tabel lewat Supabase Realtime, dengan polling sebagai cadangan bila realtime
 * tidak tersedia.
 */
function useLiveTableStats<T extends { id: string }>(
  table: "links" | "qr_codes",
  columns: string,
  setRows: Dispatch<SetStateAction<T[]>>,
): LiveStatsStatus {
  const [status, setStatus] = useState<LiveStatsStatus>("connecting");
  const statusRef = useRef<LiveStatsStatus>("connecting");

  useEffect(() => {
    const supabase = createClient();
    const channelName = `admin-${table}-stats-${Date.now()}-${Math.floor(
      Math.random() * 1e6,
    )}`;
    let cancelled = false;

    function updateStatus(next: LiveStatsStatus) {
      statusRef.current = next;
      setStatus(next);
    }

    async function refresh() {
      if (document.visibilityState !== "visible") return;

      const { data, error } = await supabase.from(table).select(columns);

      if (cancelled || error || !data) return;

      const rows = data as unknown as (T & { id: string })[];
      const latest = new Map<string, Partial<T>>(
        rows.map((row) => [row.id, row]),
      );

      setRows((current) => {
        let changed = false;
        const next = current.map((row) => {
          const fresh = latest.get(row.id);
          if (!fresh || !hasChanged(row, fresh)) return row;
          changed = true;
          return { ...row, ...fresh };
        });
        return changed ? next : current;
      });
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table },
        (payload) => {
          const next = payload.new as Partial<T> & { id?: string };
          if (!next?.id) return;

          setRows((current) =>
            current.map((row) =>
              row.id === next.id ? ({ ...row, ...next } as T) : row,
            ),
          );
        },
      )
      .subscribe((state) => {
        if (cancelled) return;
        if (state === "SUBSCRIBED") {
          updateStatus("live");
          return;
        }
        if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") {
          updateStatus("polling");
        }
      });

    // Polling hanya dipakai saat realtime tidak aktif.
    const interval = window.setInterval(() => {
      if (statusRef.current !== "live") void refresh();
    }, POLL_INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === "visible") void refresh();
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      void supabase.removeChannel(channel);
    };
  }, [table, columns, setRows]);

  return status;
}

export function useLiveLinkStats(
  setLinks: Dispatch<SetStateAction<Link[]>>,
): LiveStatsStatus {
  return useLiveTableStats<Link>(
    "links",
    "id, click_count, is_active",
    setLinks,
  );
}

export function useLiveQrStats(
  setQrCodes: Dispatch<SetStateAction<QrCode[]>>,
): LiveStatsStatus {
  return useLiveTableStats<QrCode>(
    "qr_codes",
    "id, scan_count, is_active",
    setQrCodes,
  );
}
