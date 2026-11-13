import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/shared/icons";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Login Admin | Desa Fajar Baru",
};

function VillageLandscape() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 900 1100"
    >
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8c9d4" />
          <stop offset=".58" stopColor="#d0d5c1" />
          <stop offset="1" stopColor="#647d53" />
        </linearGradient>
        <linearGradient id="hills" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#526d57" />
          <stop offset=".55" stopColor="#718354" />
          <stop offset="1" stopColor="#3e6745" />
        </linearGradient>
        <linearGradient id="field" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#799453" />
          <stop offset="1" stopColor="#1f4d38" />
        </linearGradient>
        <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#092b35" stopOpacity=".08" />
          <stop offset=".55" stopColor="#112e2c" stopOpacity=".22" />
          <stop offset="1" stopColor="#061e1a" stopOpacity=".82" />
        </linearGradient>
        <filter id="soft">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <path d="M0 0h900v1100H0z" fill="url(#sky)" />
      <g fill="#fff" filter="url(#soft)" opacity=".42">
        <ellipse cx="227" cy="210" rx="180" ry="48" />
        <ellipse cx="650" cy="160" rx="220" ry="58" />
        <ellipse cx="473" cy="306" rx="250" ry="42" />
      </g>
      <path
        d="m0 468 116-89 84 54 130-174 114 141 104-118 91 89 89-79 172 123v318H0Z"
        fill="#72847a"
        opacity=".66"
      />
      <path
        d="m0 512 116-89 84 54 130-174 114 141 104-118 91 89 89-79 172 123v318H0Z"
        fill="#506c61"
        opacity=".72"
      />
      <path
        d="M0 579c127-77 205-73 316-22 135 63 221 30 339-30 93-47 158-42 245 4v569H0Z"
        fill="url(#hills)"
      />
      <path
        d="M0 689c125-77 226-70 338-19 107 49 218 51 324-18 83-54 156-52 238-20v468H0Z"
        fill="url(#field)"
      />
      <g fill="none" stroke="#b2bd70" strokeOpacity=".36" strokeWidth="5">
        <path d="M-50 757c197-65 347-55 511 17s314 91 493-2" />
        <path d="M-30 821c184-61 353-54 525 21s300 75 440 2" />
        <path d="M-40 887c178-47 355-37 522 33s302 70 447 18" />
        <path d="M-60 954c172-42 349-23 523 45s326 65 474 25" />
      </g>
      <g fill="#234b39" opacity=".8">
        <path d="M85 693h9v111h-9z" />
        <circle cx="89" cy="682" r="37" />
        <circle cx="66" cy="698" r="27" />
        <circle cx="110" cy="704" r="30" />
        <path d="M775 563h11v162h-11z" />
        <circle cx="780" cy="548" r="48" />
        <circle cx="749" cy="571" r="32" />
        <circle cx="810" cy="581" r="35" />
        <path d="M690 637h8v105h-8z" />
        <circle cx="694" cy="627" r="31" />
        <circle cx="674" cy="644" r="22" />
        <circle cx="714" cy="648" r="24" />
      </g>
      <path d="M0 0h900v1100H0z" fill="url(#shade)" />
    </svg>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-dvh bg-[#edf3f0] p-3 sm:p-4 lg:p-5">
      <div className="mx-auto grid min-h-[calc(100dvh-24px)] max-w-[1600px] grid-cols-1 overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_28px_90px_-42px_rgba(15,67,58,.38)] sm:rounded-[30px] lg:min-h-[calc(100dvh-40px)] lg:grid-cols-[1.2fr_1fr]">
        <section
          aria-label="Informasi Desa Fajar Baru"
          className="relative flex min-h-[390px] flex-col justify-between overflow-hidden p-6 text-white sm:min-h-[430px] sm:p-8 lg:min-h-[680px] lg:p-10 xl:p-12"
        >
          <VillageLandscape />
          <div className="relative z-10 flex w-fit items-center gap-2.5 rounded-2xl border border-white/55 bg-white px-3 py-2 text-slate-900 shadow-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-700 text-xs font-extrabold tracking-tight text-white">
              DF
            </span>
            <span>
              <span className="block text-xs font-extrabold leading-tight">
                Desa Fajar Baru
              </span>
              <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.17em] text-fajar-700">
                Pusat Informasi
              </span>
            </span>
          </div>

          <div className="relative z-10 mt-12 max-w-[560px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/45 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/95">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" />
              Portal terpadu masyarakat
            </div>
            <h1 className="max-w-[520px] font-[family-name:var(--font-manrope)] text-[2.4rem] font-extrabold leading-[1.06] tracking-[-0.055em] sm:text-5xl lg:text-[3.55rem]">
              Informasi desa,
              <span className="block text-emerald-300">lebih dekat</span>
              untuk semua.
            </h1>
            <p className="mt-5 max-w-[460px] text-sm leading-6 text-white/85 sm:text-[15px]">
              Kelola layanan publik, informasi warga, dan potensi Desa Fajar
              Baru dalam satu ruang kerja yang aman.
            </p>
            <div className="mt-7 grid max-w-[480px] grid-cols-3 gap-2 sm:gap-3">
              {[
                ["12", "Layanan aktif"],
                ["24/7", "Akses informasi"],
                ["Aman", "Data terlindungi"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-slate-950/45 px-3 py-3 sm:px-4 sm:py-4"
                >
                  <p className="text-sm font-extrabold sm:text-base">{value}</p>
                  <p className="mt-1 text-[9px] font-medium leading-4 text-white/75 sm:text-[10px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 flex items-center justify-between gap-3 text-[10px] font-medium text-white/80">
            <span>⌖ Desa Fajar Baru, Indonesia</span>
            <span className="hidden sm:inline">Melayani dengan sepenuh hati</span>
          </div>
        </section>

        <section className="flex min-h-[580px] flex-col bg-[radial-gradient(ellipse_at_100%_0%,rgba(16,185,129,.08),transparent_38%),#fbfdfc] px-6 py-7 sm:px-10 sm:py-9 lg:min-h-[680px] lg:px-12 lg:py-10 xl:px-16">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-fajar-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-telaga-700"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m14 18-6-6 6-6M8 12h13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Kembali ke portal
          </Link>

          <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-10 sm:py-12">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_12px_24px_-12px_rgba(15,23,42,.65)]">
              <Icon name="shield" size={23} />
            </div>
            <p className="section-kicker !text-[10px] !tracking-[0.18em]">
              Area administrator
            </p>
            <h2 className="mt-2 text-[1.8rem] font-extrabold leading-tight tracking-[-0.045em] text-slate-900 sm:text-[2rem]">
              Selamat datang kembali.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Masuk untuk mengelola Portal Informasi Desa Fajar Baru.
            </p>

            <div className="mt-7">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>

            <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-600 text-emerald-700">
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-bold text-emerald-900">
                  Akses khusus perangkat desa
                </p>
                <p className="mt-1 text-[10px] leading-4 text-emerald-800/70">
                  Gunakan akun resmi yang telah terdaftar untuk membuka
                  dashboard.
                </p>
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-[10px] font-medium text-slate-400">
            <span>© 2025 Pemerintah Desa Fajar Baru</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              v1.0
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}
