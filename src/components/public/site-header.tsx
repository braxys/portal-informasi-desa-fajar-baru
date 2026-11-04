"use client";

import { useState } from "react";
import { Icon, VillageLogo } from "@/components/shared/icons";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#beranda"
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
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navigasi utama"
        >
          {[
            ["Beranda", "#beranda"],
            ["Layanan", "#layanan"],
            ["Peta Desa", "#peta"],
            ["Kontak", "#kontak"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#layanan"
          className="hidden items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fajar-700 md:flex"
        >
          Akses Layanan <Icon name="arrow" size={17} />
        </a>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl md:hidden"
          aria-label="Navigasi mobile"
        >
          {[
            ["Beranda", "#beranda"],
            ["Layanan", "#layanan"],
            ["Peta Desa", "#peta"],
            ["Kontak", "#kontak"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-semibold last:border-0"
            >
              {label} <Icon name="chevron" size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
