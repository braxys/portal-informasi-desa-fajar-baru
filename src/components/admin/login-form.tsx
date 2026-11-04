"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
=======
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("redirect", redirect);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success === false && result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
<<<<<<< HEAD
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
=======
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
          {error}
        </div>
      )}

      <div>
<<<<<<< HEAD
        <label
          htmlFor="admin-email"
          className="mb-2 block text-xs font-bold text-slate-800"
        >
          Alamat email
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(error)}
            className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 shadow-[0_2px_5px_rgba(15,23,42,.035)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-telaga-700 focus:ring-4 focus:ring-telaga-700/10"
            placeholder="admin@desa.id"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-xs font-bold text-slate-800"
        >
          Kata sandi
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" strokeLinecap="round" />
          </svg>
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 shadow-[0_2px_5px_rgba(15,23,42,.035)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-telaga-700 focus:ring-4 focus:ring-telaga-700/10"
            placeholder="Masukkan kata sandi"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-telaga-700"
          >
            <svg
              aria-hidden="true"
              className="h-[17px] w-[17px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              {showPassword ? (
                <>
                  <path
                    d="M3 3 21 21M10.6 10.6a2 2 0 0 0 2.8 2.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 4.1 9.5 6-.3.8-1.2 2.1-2.6 3.3M6.2 6.2C4.2 7.5 3 9.5 2.5 11c.8 1.9 4.3 6 9.5 6 1 0 1.9-.2 2.7-.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="2.5" />
                </>
              )}
            </svg>
          </button>
        </div>
=======
        <label className="mb-1.5 block text-sm font-bold text-slate-700">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm focus:border-fajar-500 focus:outline-none"
          placeholder="admin@desa.id"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm focus:border-fajar-500 focus:outline-none"
          placeholder="••••••••"
        />
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
      </div>

      <button
        type="submit"
        disabled={isPending}
<<<<<<< HEAD
        className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#0891b2] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgba(5,150,105,.7)] transition hover:brightness-105 hover:shadow-[0_16px_30px_-12px_rgba(5,150,105,.75)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-telaga-700 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Memeriksa akun..." : "Masuk ke Dashboard"}
        {!isPending && (
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
=======
        className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-fajar-700 disabled:opacity-50"
      >
        {isPending ? "Masuk..." : "Masuk ke Dashboard"}
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
      </button>
    </form>
  );
}
