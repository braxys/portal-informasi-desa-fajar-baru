"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction, type AuthActionResult } from "@/actions/auth";
import { Icon } from "@/components/ui/icon";

interface LoginFormProps {
  redirectTo: string;
  configured: boolean;
}

const INITIAL_STATE: AuthActionResult = { success: false };

async function loginFormAction(
  _previousState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  return loginAction(formData);
}

export function LoginForm({ redirectTo, configured }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginFormAction,
    INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-100" />
        <div className="absolute -left-28 -top-24 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 p-9 text-white lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-base font-black ring-1 ring-white/25">
                FB
              </span>
              <div>
                <p className="text-sm font-bold tracking-tight">
                  Portal Informasi Desa
                </p>
                <p className="text-[11px] text-emerald-100">
                  Desa Fajar Baru
                </p>
              </div>
            </div>

            <h2 className="mt-10 text-2xl font-extrabold leading-tight tracking-tight">
              Kelola informasi desa
              <br />
              dalam satu tempat.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-emerald-50/90">
              Perangkat desa dapat menambah, mengubah, dan menonaktifkan tautan
              yang tampil di portal warga.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-emerald-50/90">
              {[
                "Perubahan langsung tampil di portal publik",
                "Pantau jumlah klik tiap tautan",
                "Aman dengan autentikasi Supabase",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                    <Icon name="check" size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/"
            className="relative inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-emerald-50 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Icon name="arrow-left" size={14} />
            Kembali ke portal warga
          </Link>
        </aside>

        <div className="p-6 sm:p-9">
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 text-sm font-black text-white shadow-sm">
              FB
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">
                Portal Informasi Desa
              </p>
              <p className="text-[11px] text-slate-500">Desa Fajar Baru</p>
            </div>
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100 lg:mt-0">
            <Icon name="lock" size={12} />
            Area Admin
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
            Masuk ke Dashboard
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Gunakan email dan kata sandi yang terdaftar sebagai perangkat desa.
          </p>

          {!configured ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              <Icon
                name="alert-triangle"
                size={16}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <span>
                Supabase belum dikonfigurasi. Isi{" "}
                <code className="font-semibold">.env.local</code> terlebih dahulu
                agar login dapat digunakan.
              </span>
            </div>
          ) : null}

          {state.error ? (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800"
            >
              <Icon
                name="alert-triangle"
                size={16}
                className="mt-0.5 shrink-0 text-rose-500"
              />
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-slate-400">
                  <Icon name="mail" size={16} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@fajarbaru.desa"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-slate-400">
                  <Icon name="lock" size={16} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-xl text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={16}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending || !configured}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:from-emerald-700 hover:to-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Icon name="refresh" size={16} className="animate-spin" />
                  Memproses…
                </>
              ) : (
                <>
                  Masuk
                  <Icon name="arrow-right" size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
            Halaman ini hanya untuk perangkat desa.
            <br />
            Hubungi pengelola portal jika lupa kata sandi.
          </p>
        </div>
      </div>
    </div>
  );
}
