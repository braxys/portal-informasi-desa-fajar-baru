"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/icons";
import type { Marker, MarkerJenisInfo } from "@/types/database";

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
  { value: "fasilitas", label: "Fasilitas" },
  { value: "layanan", label: "Layanan" },
];

const DEFAULT_SUPPLEMENTAL_MARKERS: Marker[] = [
  {
    id: "default-kantor",
    name: "Balai Desa Fajar Baru",
    latitude: -5.3436945,
    longitude: 105.2680212,
    keterangan: "Pusat pelayanan administrasi kependudukan, surat pengantar, perizinan, dan koordinasi pemerintahan Desa Fajar Baru.",
    jenis_info: "kantor",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-fasilitas",
    name: "Puskesdes Fajar Baru",
    latitude: -5.3392,
    longitude: 105.2672,
    keterangan: "Pos kesehatan desa untuk pemeriksaan kesehatan umum, posyandu balita, penanganan darurat ringan, dan imunisasi warga.",
    jenis_info: "fasilitas",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-layanan",
    name: "Posyandu Lansia Sentosa",
    latitude: -5.3468,
    longitude: 105.266,
    keterangan: "Pos pelayanan terpadu pembinaan kesehatan lansia, cek tensi rutin, senam sehat, dan posko informasi kegiatan warga.",
    jenis_info: "layanan",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function VillageMapSection({ markers }: VillageMapSectionProps) {
  const [mapFilter, setMapFilter] = useState<"semua" | MarkerJenisInfo>("semua");
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Jika data database kurang dari 2, lengkapi dengan titik patokan resmi Fajar Baru
  const enrichedMarkers = useMemo(() => {
    if (!markers || markers.length === 0) return DEFAULT_SUPPLEMENTAL_MARKERS;
    if (markers.length === 1) {
      const existingNames = new Set(markers.map((m) => m.name.toLowerCase()));
      const extra = DEFAULT_SUPPLEMENTAL_MARKERS.filter(
        (m) => !existingNames.has(m.name.toLowerCase())
      );
      return [...markers, ...extra];
    }
    return markers;
  }, [markers]);

  const [selectedId, setSelectedId] = useState<string | null>(enrichedMarkers[0]?.id ?? null);

  const visibleMarkers = useMemo(
    () => enrichedMarkers.filter((marker) => mapFilter === "semua" || marker.jenis_info === mapFilter),
    [enrichedMarkers, mapFilter],
  );

  const selectedMarker = visibleMarkers.find((marker) => marker.id === selectedId) ?? visibleMarkers[0];

  const selectedMarkerUrl = selectedMarker?.jenis_info === "kantor"
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
          <h2 className="section-title mx-auto">Peta interaktif desa.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Peta geografis Desa Fajar Baru dengan garis batas administrasi resmi BPS/HDX 2020. Klik marker untuk melihat penjelasan detail lokasi dan petunjuk arah.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_-30px_rgba(15,67,58,.3)]">
          {/* Header Kontrol: Filter Kategori */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:px-7 sm:flex-row sm:items-center sm:justify-between">
            {/* Title & Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fajar-100 text-fajar-700 shadow-sm">
                <Icon name="map" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Peta Fasilitas & Lokasi Desa</h3>
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
                        marker.jenis_info === "fasilitas" ? (isCurrent ? "bg-white" : "bg-indigo-600") :
                        (isCurrent ? "bg-white" : "bg-amber-600")
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
              <div className="absolute bottom-4 left-4 z-[500] hidden sm:flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] text-slate-600 shadow-md border border-slate-200/80">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Klik marker untuk fokus & buka detail</span>
              </div>
            </div>

            {/* Sidebar Penjelasan Detail Lokasi */}
            <aside className="border-t border-slate-100 bg-white p-5 sm:p-7 lg:border-l lg:border-t-0 flex flex-col justify-between" aria-live="polite">
              {selectedMarker ? (
                <div className="space-y-5">
                  {/* Status & Kategori Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      selectedMarker.jenis_info === "kantor"
                        ? "bg-teal-50 text-teal-800 border border-teal-200"
                        : selectedMarker.jenis_info === "fasilitas"
                          ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        selectedMarker.jenis_info === "kantor" ? "bg-teal-600" :
                        selectedMarker.jenis_info === "fasilitas" ? "bg-indigo-600" : "bg-amber-600"
                      }`} />
                      {selectedMarker.jenis_info === "kantor" ? "Kantor Pemerintahan" :
                       selectedMarker.jenis_info === "fasilitas" ? "Fasilitas Umum" : "Layanan Warga"}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      Aktif
                    </span>
                  </div>

                  {/* Icon & Nama Tempat */}
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm text-white ${
                      selectedMarker.jenis_info === "kantor" ? "bg-gradient-to-br from-teal-600 to-emerald-700" :
                      selectedMarker.jenis_info === "fasilitas" ? "bg-gradient-to-br from-indigo-600 to-blue-700" :
                      "bg-gradient-to-br from-amber-500 to-orange-600"
                    }`}>
                      <Icon name="pin" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold leading-snug text-slate-900">
                        {selectedMarker.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Wilayah Administrasi Desa Fajar Baru
                      </p>
                    </div>
                  </div>

                  {/* Keterangan / Penjelasan Detail */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Deskripsi Layanan & Peran
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                      {selectedMarker.keterangan || "Tidak ada keterangan tambahan untuk lokasi ini."}
                    </p>
                  </div>

                  {/* Spesifikasi Detail Teknis */}
                  <div className="space-y-2.5 text-xs">
                    {/* Alamat & Kecamatan */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Kecamatan / Kab:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        Jati Agung, Lampung Selatan
                      </span>
                    </div>

                    {/* Koordinat GPS */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
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

                    {/* Status Wilayah */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500">Batas Desa:</span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Dalam Area Fajar Baru
                      </span>
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

              {/* Tips Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                Pilih marker atau nama lokasi untuk melihat rute & petunjuk arah
              </div>
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
