"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { LinksManager } from "@/components/admin/links-manager";
import { MarkersManager } from "@/components/admin/markers-manager";
import { QrCodeManager } from "@/components/admin/qr-code-manager";
import {
  useLiveLinkStats,
  useLiveQrStats,
} from "@/components/admin/use-live-stats";
import { Icon, VillageLogo, type IconName } from "@/components/shared/icons";
import type {
  Link as VillageLink,
  Marker,
  QrCode,
} from "@/types/database";

interface DashboardStats {
  pageViews: number;
  qrScans: number;
}

interface DashboardTabsProps {
  links: VillageLink[];
  markers: Marker[];
  qrCodes: QrCode[];
  userEmail: string;
  stats: DashboardStats;
}

type TabId = "links" | "markers" | "qrcode";

const NAV_ITEMS: {
  id: TabId;
  label: string;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    id: "links",
    label: "Tautan",
    title: "Kelola tautan",
    description:
      "Atur tautan layanan dan informasi yang tampil di portal publik.",
    icon: "link",
  },
  {
    id: "markers",
    label: "Titik peta",
    title: "Titik lokasi peta",
    description:
      "Kelola lokasi fasilitas desa yang ditampilkan pada peta wilayah.",
    icon: "map",
  },
  {
    id: "qrcode",
    label: "QR Code",
    title: "Kelola QR code",
    description:
      "Buat QR code untuk tiap kebutuhan, pantau jumlah pindainya, lalu unduh gambarnya untuk dicetak.",
    icon: "qrcode",
  },
];

const numberFormatter = new Intl.NumberFormat("id-ID");

function StatCard({
  icon,
  label,
  value,
  detail,
  live = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  detail: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#e7eeea] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fajar-50 text-fajar-700">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-slate-400">
        {live && (
          <span
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
            aria-hidden
          />
        )}
        <span>{detail}</span>
      </p>
    </div>
  );
}

export function DashboardTabs({
  links: initialLinks,
  markers: initialMarkers,
  qrCodes: initialQrCodes,
  userEmail,
  stats,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("links");
  const [links, setLinks] = useState<VillageLink[]>(initialLinks);
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [qrCodes, setQrCodes] = useState<QrCode[]>(initialQrCodes);
  const liveStatus = useLiveLinkStats(setLinks);
  const qrLiveStatus = useLiveQrStats(setQrCodes);
  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab)!;
  const activeLinks = links.filter((link) => link.is_active).length;
  const totalClicks = links.reduce(
    (total, link) => total + (link.click_count || 0),
    0,
  );
  // Selisih antara riwayat log dan counter QR yang masih ada, supaya pindai
  // dari QR yang sudah dihapus tetap terhitung pada total.
  const [scanBaseline] = useState(
    () =>
      stats.qrScans -
      initialQrCodes.reduce(
        (total, qrCode) => total + (qrCode.scan_count || 0),
        0,
      ),
  );
  // Pindai milik QR yang baru dihapus dari sesi ini tetap ikut dihitung.
  const [deletedScans, setDeletedScans] = useState(0);
  const totalScans = Math.max(
    0,
    scanBaseline +
      deletedScans +
      qrCodes.reduce((total, qrCode) => total + (qrCode.scan_count || 0), 0),
  );

  return (
    <div className="min-h-screen bg-[#f7f9f7]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-fajar-900 lg:flex">
        <Link
          href="/admin/dashboard"
          className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          <VillageLogo />
          <span>
            <span className="block text-sm font-bold leading-tight text-white">
              Desa Fajar Baru
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/70">
              Dashboard admin
            </span>
          </span>
        </Link>

        <nav className="flex-1 px-3 py-5" aria-label="Navigasi dashboard">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100/50">
            Menu
          </p>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeTab;
              const count =
                item.id === "links"
                  ? links.length
                  : item.id === "markers"
                    ? markers.length
                    : qrCodes.length;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "border-fajar-200 bg-white/10 text-white"
                      : "border-transparent text-emerald-50/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-[11px] font-semibold text-emerald-100/60 tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100/50">
              Masuk sebagai
            </p>
            <p
              className="mt-1 truncate text-xs font-semibold text-white"
              title={userEmail}
            >
              {userEmail}
            </p>
            <form action={logoutAction} className="mt-3">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md border border-white/15 px-2.5 py-2 text-xs font-semibold text-emerald-50/80 transition hover:bg-white/10 hover:text-white"
              >
                <Icon name="logout" size={15} />
                Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-[#e7eeea] bg-white">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="shrink-0 lg:hidden"
                aria-label="Dashboard admin Desa Fajar Baru"
              >
                <Image
                  src="/brand/logo-lampung-selatan.png"
                  alt="Lambang Kabupaten Lampung Selatan"
                  width={384}
                  height={549}
                  priority
                  className="h-9 w-auto"
                />
              </Link>
              <div className="min-w-0">
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
                  Admin / {activeItem.label}
                </p>
                <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  {activeItem.title}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Link
                href="/"
                aria-label="Lihat portal publik"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:px-3"
              >
                <Icon name="external" size={14} />
                <span className="hidden sm:inline">Lihat portal</span>
              </Link>
              <form action={logoutAction} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Keluar dari dashboard"
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3"
                >
                  <Icon name="logout" size={15} />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <nav
          className="border-b border-[#e7eeea] bg-white px-4 lg:hidden"
          aria-label="Navigasi dashboard mobile"
        >
          <div className="flex gap-1 overflow-x-auto py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-fajar-50 text-fajar-800"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon name={item.icon} size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {activeItem.description}
          </p>

          <section
            aria-label="Ringkasan aktivitas portal"
            className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4"
          >
            <StatCard
              icon="link"
              label="Tautan aktif"
              value={numberFormatter.format(activeLinks)}
              detail={`${numberFormatter.format(links.length)} tautan terdaftar`}
            />
            <StatCard
              icon="chart"
              label="Klik tautan"
              value={numberFormatter.format(totalClicks)}
              detail={
                liveStatus === "live"
                  ? "Klik masuk diperbarui otomatis"
                  : "Diperbarui tiap 20 detik"
              }
              live={liveStatus === "live"}
            />
            <StatCard
              icon="qrcode"
              label="Pindai QR"
              value={numberFormatter.format(totalScans)}
              detail={
                qrLiveStatus === "live"
                  ? "Pindai masuk diperbarui otomatis"
                  : "Total pindai seluruh QR code"
              }
              live={qrLiveStatus === "live"}
            />
            <StatCard
              icon="users"
              label="Kunjungan halaman"
              value={numberFormatter.format(stats.pageViews)}
              detail="Total kunjungan portal publik"
            />
          </section>

          <div className="mt-6">
            {activeTab === "links" ? (
              <LinksManager links={links} setLinks={setLinks} />
            ) : activeTab === "markers" ? (
              <MarkersManager markers={markers} setMarkers={setMarkers} />
            ) : (
              <QrCodeManager
                qrCodes={qrCodes}
                setQrCodes={setQrCodes}
                links={links}
                onQrDeleted={(qrCode) =>
                  setDeletedScans((total) => total + (qrCode.scan_count || 0))
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
