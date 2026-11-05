"use client";

import Link from "next/link";
import { useState } from "react";

type LinkCategory = "BUMDes" | "Layanan" | "Media sosial" | "Informasi" | "Survei";

type DashboardLink = {
  id: number;
  title: string;
  url: string;
  category: LinkCategory;
  isActive: boolean;
  order: number;
  clicks: number;
};

const demoLinks: DashboardLink[] = [
  {
    id: 1,
    title: "Pendaftaran BUMDes",
    url: "https://example.com/pendaftaran-bumdes",
    category: "BUMDes",
    isActive: true,
    order: 1,
    clicks: 428,
  },
  {
    id: 2,
    title: "Website Resmi Desa",
    url: "https://example.com/website-desa",
    category: "Informasi",
    isActive: true,
    order: 2,
    clicks: 316,
  },
  {
    id: 3,
    title: "Instagram Desa",
    url: "https://example.com/instagram-desa",
    category: "Media sosial",
    isActive: true,
    order: 3,
    clicks: 274,
  },
  {
    id: 4,
    title: "Kuisioner Anti Korupsi",
    url: "https://example.com/kuisioner-anti-korupsi",
    category: "Survei",
    isActive: false,
    order: 4,
    clicks: 183,
  },
  {
    id: 5,
    title: "Kuisioner Perilaku Masyarakat",
    url: "https://example.com/kuisioner-masyarakat",
    category: "Survei",
    isActive: true,
    order: 5,
    clicks: 83,
  },
];

const categories: LinkCategory[] = [
  "BUMDes",
  "Layanan",
  "Media sosial",
  "Informasi",
  "Survei",
];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-700 text-sm font-extrabold text-white shadow-sm">
      FB
    </div>
  );
}

export function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [status, setStatus] = useState("Semua status");

  const activeCount = demoLinks.filter((link) => link.isActive).length;
  const totalClicks = demoLinks.reduce((total, link) => total + link.clicks, 0);

  const normalizedQuery = query.trim().toLocaleLowerCase("id");
  const filteredLinks = demoLinks.filter((link) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${link.title} ${link.url} ${link.category}`
        .toLocaleLowerCase("id")
        .includes(normalizedQuery);
    const matchesCategory =
      category === "Semua kategori" || link.category === category;
    const matchesStatus =
      status === "Semua status" ||
      (status === "Aktif" ? link.isActive : !link.isActive);

    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-900 lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 px-5 py-6 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark />
          <span>
            <span className="block text-sm font-bold">Desa Fajar Baru</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Pusat Informasi
            </span>
          </span>
        </Link>

        <div className="mt-10">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Menu utama
          </p>
          <nav aria-label="Navigasi admin" className="mt-3 space-y-1">
            <a
              href="#dashboard"
              aria-current="page"
              className="flex min-h-11 items-center gap-3 rounded-xl bg-emerald-400/15 px-3 text-sm font-semibold text-emerald-100 ring-1 ring-inset ring-emerald-300/10"
            >
              <span className="h-2 w-2 rounded-sm bg-emerald-300" />
              Dashboard
            </a>
            <a
              href="#links"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <span className="h-2 w-2 rounded-sm border border-slate-500" />
              Kelola tautan
            </a>
            <span className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-500">
              <span className="h-2 w-2 rounded-sm border border-slate-700" />
              Analitik
              <span className="ml-auto text-[10px]">Segera</span>
            </span>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-800 text-xs font-bold text-white">
              AD
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Admin Desa</p>
              <p className="truncate text-[10px] text-slate-400">
                Pratinjau dashboard
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main id="dashboard" className="min-w-0 flex-1">
        <header className="flex min-h-[76px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Admin <span className="px-1 text-slate-300">/</span> Dashboard
            </p>
            <h1 className="mt-1 text-lg font-extrabold tracking-tight sm:text-xl">
              Kelola Tautan
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 sm:text-sm"
          >
            Lihat portal
            <span aria-hidden="true" className="ml-2 text-base">
              ↗
            </span>
          </Link>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <section aria-label="Ringkasan tautan" className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <p className="text-sm font-medium text-slate-500">Total tautan</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight">
                {demoLinks.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">Tersimpan di daftar</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <p className="text-sm font-medium text-slate-500">Tautan aktif</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-700">
                {activeCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {demoLinks.length - activeCount} tautan nonaktif
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <p className="text-sm font-medium text-slate-500">Total klik</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-cyan-800">
                {totalClicks.toLocaleString("id-ID")}
              </p>
              <p className="mt-1 text-xs text-slate-400">Data metrik contoh</p>
            </div>
          </section>

          <section id="links" className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Daftar portal
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                  Semua tautan
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Menampilkan {filteredLinks.length} dari {demoLinks.length} tautan
              </p>
            </div>

            <div
              role="note"
              className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 sm:text-sm"
            >
              Ini pratinjau UI dengan data contoh. Daftar belum terhubung ke
              Supabase; URL dan angka klik bukan data produksi.
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.02] sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari tautan</span>
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari berdasarkan judul atau URL..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>
              <label>
                <span className="sr-only">Filter kategori</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-48"
                >
                  <option>Semua kategori</option>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Filter status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-40"
                >
                  <option>Semua status</option>
                  <option>Aktif</option>
                  <option>Nonaktif</option>
                </select>
              </label>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th scope="col" className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Judul tautan
                      </th>
                      <th scope="col" className="px-4 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Kategori
                      </th>
                      <th scope="col" className="px-4 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Urutan
                      </th>
                      <th scope="col" className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Klik
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLinks.map((link) => (
                      <tr
                        key={link.id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="max-w-[360px] px-5 py-4">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {link.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {link.url}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {link.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              link.isActive
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                link.isActive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            {link.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm font-medium tabular-nums text-slate-600">
                          {link.order}
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums text-slate-700">
                          {link.clicks.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    {filteredLinks.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-14 text-center text-sm text-slate-500"
                        >
                          Tidak ada tautan yang cocok. Coba ubah kata kunci atau
                          filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                Urutan tautan mengikuti nomor prioritas yang ditampilkan.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
