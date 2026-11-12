import Image from "next/image";
import { Icon } from "@/components/shared/icons";

export function HeroSection() {
  return (
    <section id="beranda" className="relative scroll-mt-20 pt-20">
      <div className="hero-grid absolute inset-0 top-20 opacity-60" />
      <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-fajar-200/70 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-fajar-800 shadow-sm backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-fajar-500 ring-4 ring-fajar-100" />
            Portal Terpadu Masyarakat
          </div>
          <h1 className="max-w-2xl text-[3.25rem] font-bold leading-[1.03] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.65rem]">
            Desa Fajar Baru,{" "}
            <span className="gradient-text">lebih dekat</span> untuk semua.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Satu pintu portal resmi untuk mengakses informasi, peta wilayah,
            layanan publik, dan partisipasi warga Desa Fajar Baru, Jati Agung,
            Lampung Selatan dengan cepat, mudah, dan transparan.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#layanan" className="primary-button">
              Jelajahi layanan <Icon name="arrow" size={19} />
            </a>
            <a href="#peta" className="secondary-button">
              <Icon name="map" size={19} /> Lihat peta desa
            </a>
          </div>
          <div className="mt-11 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-6">
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                5+
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">
                Layanan digital
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                24/7
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">
                Akses informasi
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-fajar-700">
                <span className="h-2 w-2 rounded-full bg-fajar-500" />{" "}
                Aktif
              </div>
              <div className="mt-2 text-xs font-medium text-slate-500">
                Status portal
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -left-8 top-20 h-52 w-52 rounded-full bg-fajar-200/30 blur-3xl" />
          <div className="absolute -right-8 bottom-20 h-52 w-52 rounded-full bg-telaga-100/30 blur-3xl" />
          <div className="hero-image relative aspect-[4/4.5] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-25px_rgba(15,67,58,.38)] sm:rounded-[2.5rem]">
            <Image
              src="https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200"
              alt="Pemandangan hijau persawahan sebagai representasi alam Desa Fajar Baru"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-fajar-900/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="rounded-2xl border border-white/25 bg-white/16 p-5 text-white backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-fajar-700">
                    <Icon name="building" size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fajar-100">
                      Visi Desa
                    </p>
                    <p className="mt-1 font-semibold leading-snug">
                      Maju, mandiri, dan melayani sepenuh hati.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -left-5 top-9 hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fajar-100 text-fajar-700">
              <Icon name="users" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Untuk warga
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                Mudah & inklusif
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
