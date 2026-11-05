import { Icon, VillageLogo } from "@/components/shared/icons";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="kontak" className="scroll-mt-20 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <VillageLogo />
              <div>
                <p className="font-bold">Desa Fajar Baru</p>
                <p className="mt-1 text-xs text-slate-400">Pemerintah Desa</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Portal terpadu untuk membangun pelayanan publik yang terbuka,
              mudah diakses, dan dekat dengan masyarakat.
            </p>
          </div>
          <div>
            <h3 className="footer-title">Kontak & Alamat</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <Icon name="pin" size={18} />
                <span>
                  Balai Desa Fajar Baru
                  <br />
                  Kec. Jati Agung, Lampung Selatan
                </span>
              </div>
              <a
                href="mailto:desafajarbaru@gmail.com"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Icon name="mail" size={18} /> desafajarbaru@gmail.com
              </a>
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Icon name="phone" size={18} /> +62 812 3456 7890
              </a>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Tautan Cepat</h3>
            <nav
              className="mt-5 grid gap-3 text-sm text-slate-400"
              aria-label="Navigasi footer"
            >
              <Link className="footer-link" href="/">
                Beranda
              </Link>
              <Link className="footer-link" href="/layanan">
                Layanan publik
              </Link>
              <Link className="footer-link" href="/peta">
                Peta desa
              </Link>
              <Link className="footer-link" href="/#kontak">
                Hubungi kami
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 Pemerintah Desa Fajar Baru. Hak cipta dilindungi.</p>
          <p>Dibuat untuk pelayanan masyarakat yang lebih baik.</p>
        </div>
      </div>
    </footer>
  );
}
