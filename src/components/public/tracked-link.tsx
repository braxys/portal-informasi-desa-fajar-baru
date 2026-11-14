"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  linkId: string;
}

function sendClick(linkId: string) {
  const payload = JSON.stringify({
    eventType: "link_click",
    linkId,
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
}

export function TrackedLink({
  linkId,
  onClick,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    sendClick(linkId);
  }

  return <a {...props} onClick={handleClick} />;
}
