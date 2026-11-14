import Link from "next/link";
import { Suspense } from "react";
import { Icon, VillageLogo } from "@/components/shared/icons";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Login Admin | Desa Fajar Baru",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-dvh bg-[#f7f9f7]">
      <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="hidden bg-fajar-900 px-10 py-10 text-white lg:flex lg:flex-col xl:px-14">
          <Link
            href="/"
            className="flex w-fit items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <VillageLogo priority />
            <span>
              <span className="block text-sm font-bold leading-tight">
                Desa Fajar Baru
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-fajar-200">
                Pusat Informasi
              </span>
            </span>
          </Link>

          <div className="my-auto max-w-sm py-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-fajar-200">
              Pemerintah Desa Fajar Baru
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] xl:text-5xl">
              Dashboard
              <span className="block">admin desa.</span>
            </h1>
            <p className="mt-5 text-sm leading-6 text-emerald-50/80">
              Kelola tautan layanan, titik lokasi peta, dan kode QR portal dari
              satu halaman.
            </p>

            <div className="mt-8 border-t border-white/15 pt-5 text-sm leading-6 text-emerald-50/75">
              <p className="font-semibold text-white">Balai Desa Fajar Baru</p>
              <p>Kec. Jati Agung, Kab. Lampung Selatan</p>
              <p>Lampung 35365</p>
            </div>
          </div>

          <p className="text-[11px] text-emerald-100/60">
            Akses khusus administrator desa.
          </p>
        </aside>

        <section className="flex min-h-dvh flex-col px-5 py-6 sm:px-10 lg:px-14 lg:py-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 lg:hidden"
              aria-label="Kembali ke portal desa"
            >
              <VillageLogo priority />
              <span>
                <span className="block text-sm font-bold leading-tight text-slate-900">
                  Desa Fajar Baru
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-fajar-700">
                  Pusat Informasi
                </span>
              </span>
            </Link>

            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-fajar-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-telaga-700"
            >
              <Icon name="back" size={16} />
              <span className="hidden sm:inline">Kembali ke portal</span>
              <span className="sm:hidden">Portal</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center py-10 sm:py-14">
            <div className="w-full max-w-[400px] lg:mx-auto">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-fajar-700">
                Area administrator
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                Masuk ke dashboard
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Gunakan akun administrator desa yang sudah terdaftar.
              </p>

              <div className="mt-7">
                <Suspense
                  fallback={
                    <div
                      className="h-[318px] rounded-xl border border-[#e7eeea] bg-white"
                      aria-label="Memuat formulir login"
                    />
                  }
                >
                  <LoginForm />
                </Suspense>
              </div>

              <p className="mt-6 border-t border-[#e7eeea] pt-5 text-xs leading-5 text-slate-500">
                Lupa kata sandi? Hubungi Sekretariat Desa untuk pengaturan ulang
                akun.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            © {currentYear} Pemerintah Desa Fajar Baru
          </p>
        </section>
      </div>
    </main>
  );
}
