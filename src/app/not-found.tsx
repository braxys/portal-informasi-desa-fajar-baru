import type { Metadata } from "next";
import Link from "next/link";
import { Icon, VillageLogo } from "@/components/shared/icons";

/**
 * Halaman 404 kustom.
 *
 * Tanpa berkas ini, Next memakai halaman bawaan yang mewarisi metadata root
 * layout sehingga menghasilkan dua tag robots yang bertentangan
 * (`noindex` dari Next + `index, follow` dari root). Metadata di bawah
 * memastikan hanya `noindex` yang keluar, dan pengunjung mendapat jalan
 * kembali ke konten utama alih-alih halaman buntu.
 */
export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: "/#beranda", label: "Beranda", icon: "building" as const },
  { href: "/#profil", label: "Profil desa", icon: "shield" as const },
  { href: "/#layanan", label: "Layanan publik", icon: "link" as const },
  { href: "/#peta", label: "Peta desa", icon: "map" as const },
];

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#f7f9f7] px-5 py-16 text-center">
      <VillageLogo priority />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-fajar-700">
        Error 404
      </p>
      <h1 className="mt-3 max-w-xl text-3xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
        Alamat yang Anda tuju tidak tersedia di portal Desa Fajar Baru. Mungkin
        tautannya sudah berubah atau salah ketik.
      </p>

      <nav
        aria-label="Tautan alternatif"
        className="mt-9 grid w-full max-w-lg gap-3 sm:grid-cols-2"
      >
        {suggestions.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-fajar-300 hover:text-fajar-700"
          >
            <Icon name={icon} size={18} />
            {label}
            <Icon name="arrow" size={16} />
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-fajar-700"
      >
        Kembali ke beranda <Icon name="arrow" size={17} />
      </Link>
    </main>
  );
}
