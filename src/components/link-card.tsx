"use client";

import { Icon } from "@/components/ui/icon";
import { getCategoryMeta, getLinkIconName } from "@/lib/link-meta";
import type { Link } from "@/types/database";

interface LinkCardProps {
  link: Link;
  source?: string;
  featured?: boolean;
}

export function LinkCard({ link, source = "web_direct", featured = false }: LinkCardProps) {
  const category = getCategoryMeta(link.category);
  const iconName = getLinkIconName(link);

  function handleClick() {
    // Fire-and-forget: jangan menahan navigasi warga hanya untuk analytics.
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "link_click",
        linkId: link.id,
        source,
      }),
      keepalive: true,
    }).catch(() => {
      // Kegagalan tracking tidak boleh mengganggu pengalaman pengguna.
    });
  }

  if (featured) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 p-4 text-white shadow-lg shadow-emerald-900/25 ring-1 ring-white/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 sm:gap-4 sm:p-5"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl"
        />
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 sm:h-14 sm:w-14">
          <Icon name={iconName} size={26} />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/20">
            <Icon name="sparkles" size={11} />
            Paling Dibutuhkan
          </span>
          <span className="block text-[15px] font-bold leading-snug sm:text-base">
            {link.title}
          </span>
          {link.description ? (
            <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-emerald-50/90 sm:text-sm">
              {link.description}
            </span>
          ) : null}
        </span>
        <Icon
          name="arrow-right"
          size={20}
          className="relative shrink-0 text-white/80 transition group-hover:translate-x-0.5 group-hover:text-white"
        />
      </a>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group flex items-center gap-3.5 rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60 sm:gap-4 sm:p-4"
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${category.accentClassName} text-white shadow-sm sm:h-12 sm:w-12`}
      >
        <Icon name={iconName} size={22} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block truncate text-[15px] font-semibold text-slate-900">
            {link.title}
          </span>
        </span>
        {link.description ? (
          <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-slate-500 sm:text-[13px]">
            {link.description}
          </span>
        ) : null}
      </span>

      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
        <Icon name="chevron-right" size={17} />
      </span>
    </a>
  );
}
