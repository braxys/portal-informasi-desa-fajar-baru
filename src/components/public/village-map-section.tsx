"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/icons";
import type { Marker, MarkerJenisInfo } from "@/types/database";
import { DEFAULT_MARKERS } from "@/lib/default-markers";

const GeographicMap = dynamic(
  () => import("@/components/public/geographic-map").then((module) => module.GeographicMap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-slate-100" aria-label="Memuat peta" /> },
);

interface VillageMapSectionProps {
  markers: Marker[];
}

const filters: { value: "semua" | MarkerJenisInfo; label: string }[] = [
  { value: "semua", label: "Semua Kategori" },
  { value: "kantor", label: "Kantor" },
  { value: "layanan", label: "Layanan" },
  { value: "pendidikan", label: "Pendidikan" },
];

export function VillageMapSection({ markers }: VillageMapSectionProps) {
  const [mapFilter, setMapFilter] = useState<"semua" | MarkerJenisInfo>("semua");
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Jika data database kosong, fallback ke titik patokan resmi Fajar Baru
  const enrichedMarkers = useMemo(() => {
    if (!markers || markers.length === 0) return DEFAULT_MARKERS;
    return markers;
  }, [markers]);

  const [selectedId, setSelectedId] = useState<string | null>(enrichedMarkers[0]?.id ?? null);

  const visibleMarkers = useMemo(
    () => enrichedMarkers.filter((marker) => mapFilter === "semua" || marker.jenis_info === mapFilter),
    [enrichedMarkers, mapFilter],
  );

  const selectedMarker = visibleMarkers.find((marker) => marker.id === selectedId) ?? visibleMarkers[0];

  const selectedMarkerUrl = selectedMarker?.maps_url
    ? selectedMarker.maps_url
    : selectedMarker?.jenis_info === "kantor"
      ? "https://maps.app.goo.gl/Xc7RmVGfKvzirQsc7"
      : selectedMarker
        ? `https://www.google.com/maps/search/?api=1&query=${selectedMarker.latitude},${selectedMarker.longitude}`
        : null;

  const handleCopyCoords = () => {
    if (!selectedMarker) return;
    const text = `${selectedMarker.latitude}, ${selectedMarker.longitude}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <section id="peta" className="scroll-mt-20 bg-[#eef4f1] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-kicker">Jelajahi Wilayah</p>
          <h2 className="section-title mx-auto">Peta wilayah Desa Fajar Baru.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Peta geografis Desa Fajar Baru dengan garis batas administrasi resmi BPS/HDX 2020. Klik marker untuk melihat penjelasan detail lokasi dan petunjuk arah.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_24px_70px_-30px_rgba(15,67,58,.3)]">
          {/* Header Kontrol: Filter Kategori */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:px-7 sm:flex-row sm:items-center sm:justify-between">
            {/* Title & Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fajar-100 text-fajar-700 shadow-sm">
                <Icon name="map" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Peta Titik & Lokasi Desa</h3>
                <p className="text-xs text-slate-500">
                  {visibleMarkers.length} titik lokasi ditampilkan di Desa Fajar Baru
                </p>
              </div>
            </div>

            {/* Filter Kategori */}
            <div className="flex gap-1.5 overflow-x-auto" aria-label="Filter kategori lokasi">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mapFilter === value}
                  onClick={() => {
                    setMapFilter(value);
                    const first = enrichedMarkers.find((m) => value === "semua" || m.jenis_info === value);
                    setSelectedId(first?.id ?? null);
                  }}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    mapFilter === value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Location Chips Bar */}
          {visibleMarkers.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50/70 px-5 py-2.5 sm:px-7">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">Pilih Cepat:</span>
              <div className="flex items-center gap-2">
                {visibleMarkers.map((marker) => {
                  const isCurrent = marker.id === selectedMarker?.id;
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => setSelectedId(marker.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition shrink-0 ${
                        isCurrent
                          ? "bg-teal-700 text-white shadow-sm font-semibold"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        marker.jenis_info === "kantor" ? (isCurrent ? "bg-white" : "bg-teal-600") :
                        marker.jenis_info === "layanan" ? (isCurrent ? "bg-white" : "bg-amber-600") :
                        (isCurrent ? "bg-white" : "bg-rose-600")
                      }`} />
                      <span>{marker.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grid: Interactive Map + Detailed Aside */}
          <div className="grid lg:grid-cols-[1fr_340px]">
            {/* Peta Interaktif */}
            <div className="relative h-[450px] sm:h-[550px]">
              <GeographicMap
                markers={visibleMarkers}
                selectedId={selectedMarker?.id ?? null}
                onSelect={(id) => setSelectedId(id)}
                markerStyle="modern"
              />
              {/* Petunjuk Interaksi Melayang */}
              <div className="absolute bottom-4 left-4 z-[500] hidden sm:flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-[11px] text-slate-600 shadow-md border border-slate-200/80">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Klik marker untuk melihat detail</span>
              </div>
            </div>

            {/* Sidebar Penjelasan Detail Lokasi */}
            <aside className="border-t border-slate-100 bg-white p-5 sm:p-7 lg:border-l lg:border-t-0 flex flex-col justify-between" aria-live="polite">
              {selectedMarker ? (
                <div className="space-y-5">
                  {/* Kategori Badge */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      selectedMarker.jenis_info === "kantor"
                        ? "bg-teal-50 text-teal-800 border border-teal-200"
                        : selectedMarker.jenis_info === "layanan"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        selectedMarker.jenis_info === "kantor" ? "bg-teal-600" :
                        selectedMarker.jenis_info === "layanan" ? "bg-amber-600" : "bg-rose-600"
                      }`} />
                      {selectedMarker.jenis_info === "kantor" ? "Kantor Pemerintahan" :
                       selectedMarker.jenis_info === "layanan" ? "Layanan Warga" : "Pendidikan"}
                    </span>
                  </div>

                  {/* Icon & Nama Tempat */}
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm text-white ${
                      selectedMarker.jenis_info === "kantor" ? "bg-gradient-to-br from-teal-600 to-emerald-700" :
                      selectedMarker.jenis_info === "layanan" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                      "bg-gradient-to-br from-rose-500 to-pink-600"
                    }`}>
                      <Icon name={selectedMarker.jenis_info === "pendidikan" ? "graduation" : "pin"} size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold leading-snug text-slate-900">
                        {selectedMarker.name}
                      </h4>
                    </div>
                  </div>

                  {/* Keterangan / Penjelasan Detail */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Keterangan
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                      {selectedMarker.keterangan || "Tidak ada keterangan tambahan untuk lokasi ini."}
                    </p>
                  </div>

                  {/* Spesifikasi Detail Teknis */}
                  <div className="space-y-2.5 text-xs">
                    {/* Koordinat GPS */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500">Koordinat GPS:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-800">
                          {selectedMarker.latitude.toFixed(5)}, {selectedMarker.longitude.toFixed(5)}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCoords}
                          className="rounded px-1.5 py-0.5 text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition"
                          title="Salin koordinat"
                        >
                          {copiedCoords ? "Tersalin!" : "Salin"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Aksi Navigasi */}
                  <div className="pt-2">
                    <a
                      href={selectedMarkerUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-teal-700 shadow-md"
                    >
                      Buka Rute di Google Maps <Icon name="arrow" size={17} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <Icon name="pin" size={32} />
                  <p className="mt-3 text-sm">Pilih salah satu marker pada peta untuk melihat detail lokasi.</p>
                </div>
              )}
            </aside>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Garis merah putus-putus menunjukkan batas desa dari data BPS/HDX 2020. Peta ©{" "}
          <a className="underline" href="https://www.openstreetmap.org/copyright">
            OpenStreetMap contributors
          </a>
          .
        </p>
      </div>
    </section>
  );
}
