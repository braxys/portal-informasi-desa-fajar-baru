"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, VillageLogo } from "@/components/shared/icons";
import { siteConfig } from "@/lib/site-config";

const sections = [
  ["Beranda", "/#beranda"],
  ["Profil", "/#profil"],
  ["Layanan", "/#layanan"],
  ["Peta Desa", "/#peta"],
  ["Kontak", "/#kontak"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/#beranda"
          className="flex items-center gap-3"
          aria-label="Kembali ke beranda"
        >
          <VillageLogo priority />
          <div>
            <div className="text-sm font-bold leading-tight tracking-[-0.01em] text-slate-900 sm:text-base">
              Desa Fajar Baru
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-fajar-700">
              Pusat Informasi
            </div>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navigasi utama"
        >
          {sections.map(([label, href]) => (
            <Link key={label} className="nav-link" href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Admin
          </Link>
          <Link
            href="/#layanan"
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fajar-700"
          >
            Akses Layanan <Icon name="arrow" size={17} />
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl lg:hidden"
          aria-label="Navigasi mobile"
        >
          {sections.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-semibold last:border-0"
            >
              {label} <Icon name="chevron" size={18} />
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold text-slate-500">
              Media sosial
            </span>
            <div className="flex gap-2">
              {siteConfig.sameAs.map((href) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kunjungi profil resmi ${new URL(href).hostname}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-fajar-300 hover:text-fajar-700"
                >
                  <Icon
                    name={href.includes("instagram") ? "instagram" : "tiktok"}
                    size={17}
                  />
                </a>
              ))}
            </div>
          </div>
          <Link
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center justify-center rounded-xl bg-slate-900 py-3 text-sm font-bold text-white"
          >
            Login Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
