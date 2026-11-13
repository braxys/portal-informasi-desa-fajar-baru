import Image from "next/image";
import { Icon } from "@/components/shared/icons";

interface HeroSectionProps {
  serviceCount: number;
  markerCount: number;
}

export function HeroSection({ serviceCount, markerCount }: HeroSectionProps) {
  return (
    <section id="beranda" className="relative scroll-mt-20 pt-20">
      <div className="hero-grid absolute inset-0 top-20 opacity-60" />
      <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-fajar-200/70 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-fajar-800 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-fajar-500 ring-4 ring-fajar-100" />
            Portal Terpadu Masyarakat
          </div>
          <h1 className="max-w-2xl text-[3.25rem] font-bold leading-[1.03] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.65rem]">
            Desa Fajar Baru,{" "}
            <span className="text-fajar-700">lebih dekat</span> untuk semua.
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
                {serviceCount > 0 ? serviceCount : "—"}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">
                Layanan warga
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {markerCount > 0 ? markerCount : "—"}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">
                Titik lokasi peta
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                35365
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">
                Kode pos
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="hero-image relative aspect-[4/4.5] overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_-25px_rgba(15,67,58,.38)]">
            <Image
              src="/images/hero-persawahan.jpg"
              alt="Ilustrasi persawahan hijau"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-fajar-900/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="rounded-2xl border border-white/25 bg-slate-950/65 p-5 text-white">
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
        </div>
      </div>
    </section>
  );
}
