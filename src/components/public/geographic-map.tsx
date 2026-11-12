"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker as LeafletMarker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Marker, MarkerJenisInfo } from "@/types/database";

const center: [number, number] = [-5.3436945, 105.2680212];

// Village boundary from BPS/HDX 2020 data (196 points, verbatim [lat, lon]).
// Source: github.com/JfrAziz/indonesia-district – id1803070_jati_agung.geojson, village code id1803070018.
const approximateBoundary: [number, number][] = [
  [-5.320594,105.271811],[-5.320688,105.271678],[-5.322277,105.271996],[-5.327947,105.27392],
  [-5.334368,105.275204],[-5.336969,105.276392],[-5.337152,105.276953],[-5.338247,105.279085],
  [-5.339789,105.280009],[-5.340235,105.280137],[-5.340451,105.280245],[-5.341217,105.280628],
  [-5.3422,105.281119],[-5.343428,105.281611],[-5.344196,105.282091],[-5.344214,105.281286],
  [-5.344214,105.280831],[-5.344215,105.280556],[-5.344671,105.280492],[-5.344915,105.280503],
  [-5.345159,105.28044],[-5.345127,105.280493],[-5.345308,105.280493],[-5.345488,105.280461],
  [-5.345573,105.280323],[-5.345722,105.280302],[-5.345828,105.280144],[-5.345982,105.280149],
  [-5.346661,105.27999],[-5.347468,105.279832],[-5.347701,105.279917],[-5.347913,105.279822],
  [-5.348343,105.279573],[-5.348371,105.279575],[-5.348821,105.279605],[-5.349012,105.279499],
  [-5.349267,105.27952],[-5.349596,105.279362],[-5.34984,105.279574],[-5.350116,105.279553],
  [-5.350445,105.279426],[-5.350715,105.279198],[-5.351013,105.278753],[-5.351724,105.278786],
  [-5.351883,105.278563],[-5.352457,105.277642],[-5.352664,105.277351],[-5.352865,105.277351],
  [-5.353269,105.27715],[-5.35363,105.277002],[-5.354001,105.27677],[-5.354383,105.276346],
  [-5.354606,105.276251],[-5.354702,105.275859],[-5.354957,105.275478],[-5.355148,105.275108],
  [-5.355266,105.275108],[-5.355307,105.275108],[-5.355615,105.275129],[-5.355626,105.274833],
  [-5.355568,105.274351],[-5.355674,105.273588],[-5.355908,105.273059],[-5.355887,105.272773],
  [-5.355844,105.272339],[-5.355643,105.271937],[-5.355648,105.271716],[-5.355654,105.271492],
  [-5.355739,105.270984],[-5.355813,105.270433],[-5.355845,105.270158],[-5.355511,105.269845],
  [-5.355427,105.269517],[-5.355342,105.269093],[-5.355395,105.268522],[-5.355417,105.267728],
  [-5.355406,105.267029],[-5.355205,105.266859],[-5.355078,105.266594],[-5.355025,105.266298],
  [-5.354972,105.266097],[-5.35477,105.26598],[-5.354611,105.265821],[-5.354494,105.265673],
  [-5.354224,105.265509],[-5.35416,105.265117],[-5.354118,105.264778],[-5.354033,105.264535],
  [-5.353906,105.264344],[-5.353646,105.264381],[-5.353572,105.264243],[-5.353391,105.264116],
  [-5.353211,105.264169],[-5.35302,105.264137],[-5.352903,105.264179],[-5.352606,105.264607],
  [-5.352571,105.264808],[-5.352345,105.2648],[-5.35202,105.264927],[-5.351904,105.265083],
  [-5.351912,105.265293],[-5.351472,105.265336],[-5.351299,105.26557],[-5.350895,105.266282],
  [-5.350216,105.266378],[-5.349908,105.266275],[-5.349615,105.26632],[-5.3495,105.266538],
  [-5.349377,105.266435],[-5.349348,105.266281],[-5.349019,105.266109],[-5.348891,105.266277],
  [-5.348759,105.266404],[-5.34871,105.266607],[-5.348557,105.266603],[-5.348294,105.266435],
  [-5.348273,105.266246],[-5.347981,105.266287],[-5.347788,105.26625],[-5.347755,105.26609],
  [-5.347446,105.265679],[-5.347265,105.265654],[-5.347142,105.265344],[-5.347002,105.265237],
  [-5.346821,105.265278],[-5.346763,105.265118],[-5.346352,105.265155],[-5.346027,105.265126],
  [-5.345957,105.265023],[-5.345847,105.265013],[-5.345623,105.265093],[-5.345491,105.265091],
  [-5.345395,105.264706],[-5.344906,105.264724],[-5.344641,105.264363],[-5.344436,105.264435],
  [-5.344201,105.264615],[-5.34399,105.264353],[-5.343754,105.264305],[-5.342687,105.264368],
  [-5.342125,105.264323],[-5.3413,105.262962],[-5.3411,105.263121],[-5.340407,105.263305],
  [-5.339924,105.263347],[-5.339894,105.263268],[-5.339852,105.263214],[-5.339466,105.26334],
  [-5.339315,105.263313],[-5.339236,105.263196],[-5.338941,105.26306],[-5.33879,105.263132],
  [-5.33873,105.263322],[-5.338639,105.263355],[-5.338513,105.263162],[-5.338319,105.26315],
  [-5.338139,105.262934],[-5.338078,105.262732],[-5.33794,105.262527],[-5.337704,105.262545],
  [-5.337542,105.262647],[-5.337361,105.262617],[-5.336166,105.261774],[-5.336332,105.261707],
  [-5.334188,105.261197],[-5.334008,105.261016],[-5.333635,105.261342],[-5.333123,105.26097],
  [-5.332679,105.261412],[-5.33247,105.26162],[-5.331957,105.261992],[-5.331957,105.262064],
  [-5.331808,105.261952],[-5.326416,105.257914],[-5.326378,105.257975],[-5.326003,105.257907],
  [-5.324994,105.258493],[-5.323478,105.258384],[-5.321528,105.257194],[-5.320842,105.256362],
  [-5.315592,105.261496],[-5.315352,105.261731],[-5.313617,105.264865],[-5.313378,105.26653],
  [-5.313711,105.266633],[-5.314446,105.268347],[-5.314691,105.269576],[-5.316165,105.270312],
  [-5.316656,105.271049],[-5.317639,105.271049],[-5.318621,105.271049],[-5.319358,105.270804],
  [-5.319849,105.271295],[-5.32034,105.27154],[-5.320586,105.271786],[-5.320594,105.271811],
];

function FitMarkers({ markers }: { markers: Marker[] }) {
  const map = useMap();
  const points = useMemo(() => markers.map((marker) => [marker.latitude, marker.longitude] as [number, number]), [markers]);

  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
    else if (points.length === 1) map.setView(points[0], 15);
    else map.setView(center, 13);
  }, [map, points]);

  return null;
}

export type MarkerStyleType = "modern" | "badge" | "radar";

export function getCategoryLabel(jenis: MarkerJenisInfo): { label: string; badgeClass: string; colorHex: string } {
  switch (jenis) {
    case "kantor":
      return { label: "Kantor Pemerintahan", badgeClass: "bg-teal-50 text-teal-800 border-teal-200", colorHex: "#0f766e" };
    case "layanan":
      return { label: "Layanan Warga", badgeClass: "bg-amber-50 text-amber-800 border-amber-200", colorHex: "#d97706" };
    case "pendidikan":
      return { label: "Pendidikan", badgeClass: "bg-rose-50 text-rose-800 border-rose-200", colorHex: "#e11d48" };
    default:
      return { label: "Lokasi Desa", badgeClass: "bg-slate-50 text-slate-800 border-slate-200", colorHex: "#0f766e" };
  }
}

function getCategoryIconSvg(category: MarkerJenisInfo): string {
  if (category === "kantor") {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4 18h16M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l10 7H2z"/></svg>`;
  }
  if (category === "pendidikan") {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
  }
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createCustomMarkerIcon(
  marker: Marker,
  style: MarkerStyleType = "modern",
  isSelected: boolean = false
): L.DivIcon {
  const iconSvg = getCategoryIconSvg(marker.jenis_info);
  const selectedClass = isSelected ? "is-selected" : "";
  const categoryClass = `category-${marker.jenis_info}`;

  if (style === "badge") {
    const html = `
      <div class="pin-badge ${categoryClass} ${selectedClass}">
        <div class="badge-box">
          <span class="badge-icon">${iconSvg}</span>
          <span class="badge-title">${escapeHtml(marker.name)}</span>
        </div>
        <div class="badge-pointer"></div>
      </div>
    `;
    return L.divIcon({
      className: "custom-leaflet-marker",
      html,
      iconSize: [120, 38],
      iconAnchor: [60, 38],
      popupAnchor: [0, -40],
    });
  }

  if (style === "radar") {
    const html = `
      <div class="pin-radar ${categoryClass} ${selectedClass}">
        <div class="radar-wave"></div>
        <div class="radar-core"></div>
      </div>
    `;
    return L.divIcon({
      className: "custom-leaflet-marker",
      html,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -18],
    });
  }

  // Default: Modern Teardrop Pin
  const html = `
    <div class="pin-modern ${categoryClass} ${selectedClass}">
      <div class="pin-pulse-ring"></div>
      <div class="pin-head">
        ${iconSvg}
      </div>
      <div class="pin-tip"></div>
      <div class="pin-shadow"></div>
    </div>
  `;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html,
    iconSize: [38, 48],
    iconAnchor: [19, 46],
    popupAnchor: [0, -48],
  });
}

function FocusSelectedMarker({ selectedMarker }: { selectedMarker?: Marker }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!selectedMarker) return;
    map.flyTo([selectedMarker.latitude, selectedMarker.longitude], 16, {
      duration: 0.8,
      easeLinearity: 0.25,
    });
  }, [map, selectedMarker]);

  return null;
}

export function GeographicMap({
  markers,
  selectedId,
  onSelect,
  markerStyle = "modern",
}: {
  markers: Marker[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  markerStyle?: MarkerStyleType;
}) {
  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedId),
    [markers, selectedId]
  );
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const isFirstSelect = useRef(true);

  useEffect(() => {
    if (isFirstSelect.current) {
      isFirstSelect.current = false;
      return;
    }
    if (!selectedId) return;
    const markerInstance = markerRefs.current.get(selectedId);
    if (markerInstance && !markerInstance.isPopupOpen()) {
      markerInstance.openPopup();
    }
  }, [selectedId]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label="Peta geografis Desa Fajar Baru"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMarkers markers={markers} />
      <FocusSelectedMarker selectedMarker={selectedMarker} />

      <Polygon
        positions={approximateBoundary}
        pathOptions={{
          color: "#dc2626",
          weight: 3,
          dashArray: "6 7",
          fillColor: "#ef4444",
          fillOpacity: 0.08,
        }}
      >
        <Popup>Batas Desa Fajar Baru (sumber: BPS/HDX 2020)</Popup>
      </Polygon>

      {markers.map((marker) => {
        const isSelected = marker.id === selectedId;
        const icon = createCustomMarkerIcon(marker, markerStyle, isSelected);
        const category = getCategoryLabel(marker.jenis_info);
        const mapsUrl =
          marker.maps_url ||
          (marker.jenis_info === "kantor"
            ? "https://maps.app.goo.gl/Xc7RmVGfKvzirQsc7"
            : `https://www.google.com/maps/search/?api=1&query=${marker.latitude},${marker.longitude}`);

        return (
          <LeafletMarker
            key={marker.id}
            ref={(node) => {
              if (node) {
                markerRefs.current.set(marker.id, node);
              } else {
                markerRefs.current.delete(marker.id);
              }
            }}
            position={[marker.latitude, marker.longitude]}
            icon={icon}
            zIndexOffset={isSelected ? 1000 : 1}
            eventHandlers={{ click: () => onSelect(marker.id) }}
          >
            <Popup maxWidth={290} minWidth={250} autoPan={true}>
              <div className="overflow-hidden font-sans">
                {/* Header Kategori */}
                <div
                  className={`flex items-center justify-between px-3.5 py-2 text-xs font-bold border-b ${
                    marker.jenis_info === "kantor"
                      ? "bg-teal-50 text-teal-800 border-teal-100"
                      : marker.jenis_info === "layanan"
                        ? "bg-amber-50 text-amber-800 border-amber-100"
                        : "bg-rose-50 text-rose-800 border-rose-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        marker.jenis_info === "kantor"
                          ? "bg-teal-600"
                          : marker.jenis_info === "layanan"
                            ? "bg-amber-600"
                            : "bg-rose-600"
                      }`}
                    />
                    {category.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Fajar Baru</span>
                </div>

                {/* Konten Detail */}
                <div className="p-3.5 bg-white space-y-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {marker.name}
                    </h4>
                    {marker.keterangan && (
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {marker.keterangan}
                      </p>
                    )}
                  </div>

                  {/* Koordinat */}
                  <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100 text-[11px] font-mono flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[10px]">Koordinat:</span>
                    <span className="font-semibold text-slate-700">
                      {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
                    </span>
                  </div>

                  {/* Aksi */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-700 shadow-sm"
                  >
                    <span>Buka Rute di Google Maps</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M14 7l5 5-5 5" />
                    </svg>
                  </a>
                </div>
              </div>
            </Popup>
          </LeafletMarker>
        );
      })}
    </MapContainer>
  );
}
