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
  { value: "semua", label: "Semua" },
  { value: "kantor", label: "Kantor" },
  { value: "fasilitas", label: "Fasilitas" },
  { value: "layanan", label: "Layanan" },
];

export function VillageMapSection({ markers }: VillageMapSectionProps) {
  const [mapFilter, setMapFilter] = useState<"semua" | MarkerJenisInfo>("semua");
  const [selectedId, setSelectedId] = useState<string | null>(markers[0]?.id ?? null);
  const visibleMarkers = useMemo(
    () => markers.filter((marker) => mapFilter === "semua" || marker.jenis_info === mapFilter),
    [markers, mapFilter],
  );
  const selectedMarker = visibleMarkers.find((marker) => marker.id === selectedId) ?? visibleMarkers[0];

  return (
    <section id="peta" className="scroll-mt-20 bg-[#eef4f1] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-kicker">Jelajahi Wilayah</p>
          <h2 className="section-title mx-auto">Peta interaktif desa.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Peta geografis Desa Fajar Baru. Data lokasi ditampilkan setelah diverifikasi.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_-30px_rgba(15,67,58,.3)]">
          <div className="flex flex-col border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fajar-100 text-fajar-700"><Icon name="map" /></div>
              <div><h3 className="font-bold text-slate-900">Peta Desa Fajar Baru</h3><p className="mt-0.5 text-xs text-slate-500">Pilih kategori untuk menyaring lokasi</p></div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-0" aria-label="Filter kategori lokasi">
              {filters.map(({ value, label }) => (
                <button key={value} type="button" aria-pressed={mapFilter === value} onClick={() => {
                  setMapFilter(value);
                  const first = markers.find((marker) => value === "semua" || marker.jenis_info === value);
                  setSelectedId(first?.id ?? null);
                }} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${mapFilter === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_310px]">
            <div className="relative h-[430px] sm:h-[520px]">
              <GeographicMap markers={visibleMarkers} onSelect={setSelectedId} />
            </div>
            <aside className="border-t border-slate-100 p-5 sm:p-7 lg:border-l lg:border-t-0" aria-live="polite">
              {selectedMarker ? <>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-fajar-700">Lokasi dipilih</p>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-fajar-100 text-fajar-700"><Icon name="pin" size={23} /></div>
                <h4 className="mt-5 text-lg font-bold leading-snug text-slate-900">{selectedMarker.name}</h4>
                {selectedMarker.keterangan && <p className="mt-3 text-sm leading-6 text-slate-500">{selectedMarker.keterangan}</p>}
                <p className="mt-4 text-sm capitalize text-slate-600">Kategori: {selectedMarker.jenis_info}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.latitude},${selectedMarker.longitude}`} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-fajar-700">
                  Buka di Google Maps <Icon name="arrow" size={17} />
                </a>
              </> : <p className="py-8 text-sm text-slate-500">Belum ada lokasi tersedia.</p>}
            </aside>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">Peta © <a className="underline" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Lokasi desa merupakan pusat indikatif; bukan batas administrasi.</p>
      </div>
    </section>
  );
}
