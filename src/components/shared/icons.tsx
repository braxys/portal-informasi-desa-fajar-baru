import Image from "next/image";
import type { ReactNode } from "react";

export type IconName = "arrow" | "back" | "briefcase" | "building" | "chart" | "check" | "chevron" | "chevron-down" | "chevron-up" | "clipboard" | "clock" | "edit" | "external" | "eye" | "eye-off" | "graduation" | "instagram" | "link" | "logout" | "mail" | "map" | "menu" | "pin" | "plus" | "qrcode" | "search" | "share" | "shield" | "tiktok" | "trash" | "users" | "x"

export function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5" />
        <path d="m10 7-5 5 5 5" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5l8-3 8 3v16M2 21h20M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M9 21v-5h6v5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    check: <path d="m5 13 4 4L19 7" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    "chevron-up": <path d="m6 15 6-6 6 6" />,
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4a3 3 0 0 1 6 0v2H9V4ZM9 12h6M9 16h4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z" />
        <path d="m14 6 3 3" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4 10 14" />
        <path d="M19 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    "eye-off": (
      <>
        <path d="M3 3 21 21M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 4.1 9.5 6-.3.8-1.2 2.1-2.6 3.3M6.2 6.2C4.2 7.5 3 9.5 2.5 11c.8 1.9 4.3 6 9.5 6 1 0 1.9-.2 2.7-.5" />
      </>
    ),
    graduation: (
      <>
        <path d="M22 10v6" />
        <path d="M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
      </>
    ),
    link: (
      <>
        <path d="M10 13.5a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 10.5a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 19.6l1.1-1.1" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5M21 12H9" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    qrcode: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM20 14h1M14 20h3M20 17v4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.7 6.8-4.4m-6.8 7 6.8 4.4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.5 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5 7.5-9.5V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    tiktok: (
      <path d="M15 4c.5 2.7 2 4.2 5 4.5V12c-1.9-.1-3.5-.7-5-1.8V16a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.6a2 2 0 1 0 1 1.7V4h3Z" />
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    x: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

export function VillageLogo({ priority = false }: { priority?: boolean }) {
  return (
    <div className="village-logo">
      <Image
        src="/brand/logo-lampung-selatan.png"
        alt="Lambang Kabupaten Lampung Selatan"
        width={384}
        height={549}
        priority={priority}
        sizes="48px"
        className="h-full w-full object-contain"
      />
    </div>
  )
}
