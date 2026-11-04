"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
import { Icon, VillageLogo } from "@/components/shared/icons";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
<<<<<<< HEAD
        <a
=======
        <Link
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
          href="/"
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
          className="hidden items-center gap-8 md:flex"
          aria-label="Navigasi utama"
        >
          {[
            ["Beranda", "/"],
            ["Layanan", "/layanan"],
            ["Peta Desa", "/peta"],
            ["Kontak", "/kontak"],
          ].map(([label, href]) => (
<<<<<<< HEAD
            <a
              key={label}
              href={href}
              className={`nav-link ${pathname === href ? "active" : ""}`}
=======
            <Link
              key={label}
              className={`nav-link ${pathname === href ? "active" : ""}`}
              href={href}
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
<<<<<<< HEAD
          <a
=======
          <Link
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
            href="/admin/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Admin
<<<<<<< HEAD
          </a>
          <a
=======
          </Link>
          <Link
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
            href="/layanan"
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fajar-700"
          >
            Akses Layanan <Icon name="arrow" size={17} />
<<<<<<< HEAD
          </a>
=======
          </Link>
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
        </div>

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
            ["Beranda", "/"],
            ["Layanan", "/layanan"],
            ["Peta Desa", "/peta"],
            ["Kontak", "/kontak"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-semibold last:border-0 ${
                pathname === href ? "text-fajar-700" : ""
              }`}
            >
              {label} <Icon name="chevron" size={18} />
            </Link>
          ))}
<<<<<<< HEAD
          <a
=======
          <Link
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center rounded-xl bg-slate-900 py-3 text-sm font-bold text-white"
          >
            Login Admin
<<<<<<< HEAD
          </a>
=======
          </Link>
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
        </nav>
      )}
    </header>
  );
}
