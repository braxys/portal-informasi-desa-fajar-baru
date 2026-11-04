"use client";

import { useState, useMemo } from "react";
import { Icon } from "@/components/shared/icons";
import type { Marker, MarkerJenisInfo } from "@/types/database";

// Koordinat bounding box Desa Fajar Baru untuk konversi lat/lng → posisi peta
const BOUNDS = {
  latMin: -5.3050,
  latMax: -5.2990,
  lngMin: 105.2310,
  lngMax: 105.2380,
};

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * 100;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * 100;
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

interface VillageMapSectionProps {
  markers: Marker[];
}

export function VillageMapSection({ markers }: VillageMapSectionProps) {
  const [mapFilter, setMapFilter] = useState<"semua" | MarkerJenisInfo>("semua");
  const [selectedId, setSelectedId] = useState<string | null>(markers[0]?.id || null);
  const [zoom, setZoom] = useState(1);

  const visibleMarkers = useMemo(
    () =>
      markers.filter(
        (m) => mapFilter === "semua" || m.jenis_info === mapFilter,
      ),
    [markers, mapFilter],
  );

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedId) || markers[0],
    [markers, selectedId],
  );

  if (!selectedMarker) {
    return (
      <section id="peta" className="bg-[#eef4f1] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-10">
          <p className="section-kicker">Jelajahi Wilayah</p>
          <h2 className="section-title mx-auto">Peta interaktif desa.</h2>
          <p className="mt-5 text-slate-500">Belum ada lokasi tersedia.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="peta" className="bg-[#eef4f1] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-kicker">Jelajahi Wilayah</p>
          <h2 className="section-title mx-auto">Peta interaktif desa.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Temukan kantor desa, fasilitas publik, dan titik layanan penting
            di sekitar Anda.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_-30px_rgba(15,67,58,.3)]">
          <div className="flex flex-col border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fajar-100 text-fajar-700">
                <Icon name="map" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Peta Desa Fajar Baru
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Pilih kategori untuk menyaring lokasi
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-0">
              {[
                ["semua", "Semua"],
                ["kantor", "Kantor"],
                ["fasilitas", "Fasilitas"],
                ["layanan", "Layanan"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const filter = value as "semua" | MarkerJenisInfo;
                    setMapFilter(filter);
                    const first = markers.find(
                      (m) => filter === "semua" || m.jenis_info === filter,
                    );
                    if (first) setSelectedId(first.id);
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                    mapFilter === value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_310px]">
            <div className="map-canvas relative h-[430px] overflow-hidden sm:h-[520px]">
              <div
                className="absolute inset-0 transition-transform duration-500"
                style={{ transform: `scale(${zoom})` }}
              >
                <svg
                  className="h-full w-full"
                  viewBox="0 0 900 540"
                  preserveAspectRatio="xMidYMid slice"
                  aria-label="Peta ilustratif Desa Fajar Baru"
                >
                  <rect width="900" height="540" fill="#e8eee9" />
                  <path
                    d="M0 65C140 110 226 83 343 51c126-34 214 31 337 21 86-7 148-38 220-15v156c-148-13-242 37-378 17-144-21-257-13-392 25C77 270 37 260 0 250V65Z"
                    fill="#dce8dc"
                  />
                  <path
                    d="M0 370c132-52 240-20 351 16 123 41 238 31 352-19 77-34 136-41 197-16v189H0V370Z"
                    fill="#d6e5d8"
                  />
                  <g stroke="#fff" strokeWidth="18" fill="none">
                    <path d="M-40 150c180 8 242 119 404 110s232-111 365-82c70 15 123 52 211 54" />
                    <path d="M170-30c5 121 34 192 96 266 77 91 67 200 46 334" />
                    <path d="M622-30c-25 117-7 187 50 251 66 75 78 162 29 349" />
                  </g>
                  <g
                    stroke="#b9c6bd"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="9 8"
                  >
                    <path d="M-40 150c180 8 242 119 404 110s232-111 365-82c70 15 123 52 211 54" />
                    <path d="M170-30c5 121 34 192 96 266 77 91 67 200 46 334" />
                    <path d="M622-30c-25 117-7 187 50 251 66 75 78 162 29 349" />
                  </g>
                  <path
                    d="M0 436c117-30 179 15 272-11s167-98 261-104 138 48 213 56c60 7 93-9 154-34"
                    fill="none"
                    stroke="#9dd4da"
                    strokeWidth="10"
                  />
                  <g fill="#c6d8c7">
                    <circle cx="95" cy="90" r="38" />
                    <circle cx="430" cy="116" r="48" />
                    <circle cx="812" cy="441" r="53" />
                    <circle cx="493" cy="462" r="33" />
                  </g>
                  <g fill="#fff" stroke="#cad5cd" strokeWidth="2">
                    <rect x="380" y="185" width="40" height="30" rx="4" />
                    <rect x="435" y="170" width="55" height="35" rx="4" />
                    <rect x="530" y="300" width="46" height="32" rx="4" />
                    <rect x="245" y="340" width="48" height="34" rx="4" />
                    <rect x="682" y="98" width="44" height="30" rx="4" />
                  </g>
                  <g
                    fill="#7e9585"
                    fontFamily="Arial, sans-serif"
                    fontSize="13"
                    fontWeight="600"
                  >
                    <text x="348" y="285">Jl. Fajar Utama</text>
                    <text x="686" y="260">Jl. Pembangunan</text>
                    <text x="83" y="410">Area Persawahan</text>
                  </g>
                </svg>

                {visibleMarkers.map((marker) => {
                  const pos = latLngToXY(marker.latitude, marker.longitude);
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => setSelectedId(marker.id)}
                      className={`map-marker ${
                        selectedMarker.id === marker.id ? "is-active" : ""
                      }`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      aria-label={`Pilih ${marker.name}`}
                    >
                      <Icon name="pin" size={22} />
                    </button>
                  );
                })}
              </div>

              <div className="absolute left-4 top-4 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:left-6 sm:top-6">
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(1.35, zoom + 0.1))}
                  className="map-control"
                  aria-label="Perbesar peta"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(0.9, zoom - 0.1))}
                  className="map-control border-t border-slate-200"
                  aria-label="Perkecil peta"
                >
                  −
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/92 p-4 shadow-xl backdrop-blur sm:hidden">
                <p className="text-[10px] font-bold uppercase tracking-wider text-fajar-700">
                  Lokasi dipilih
                </p>
                <p className="mt-1 text-sm font-bold">
                  {selectedMarker.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedMarker.keterangan}
                </p>
              </div>
            </div>

            <aside className="hidden border-l border-slate-100 p-7 sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-fajar-700">
                Lokasi dipilih
              </p>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-fajar-100 text-fajar-700">
                <Icon name="pin" size={23} />
              </div>
              <h4 className="mt-5 text-lg font-bold leading-snug text-slate-900">
                {selectedMarker.name}
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {selectedMarker.keterangan}
              </p>
              <div className="my-6 h-px bg-slate-100" />
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Icon name="clock" size={18} />
                  <div>
                    <p className="font-semibold text-slate-800">
                      Jam pelayanan
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Senin–Jumat, 08.00–15.00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="building" size={18} />
                  <div>
                    <p className="font-semibold text-slate-800">Kategori</p>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {selectedMarker.jenis_info}
                    </p>
                  </div>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.latitude},${selectedMarker.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-fajar-700"
              >
                Buka petunjuk arah <Icon name="arrow" size={17} />
              </a>
            </aside>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-slate-400">
          Peta bersifat ilustratif dan akan diperbarui secara berkala.
        </p>
      </div>
    </section>
  );
}
