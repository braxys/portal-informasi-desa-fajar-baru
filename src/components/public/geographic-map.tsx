"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker as LeafletMarker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Marker } from "@/types/database";

const center: [number, number] = [-5.3436945, 105.2680212];

// Digitized approximately from user's Google Maps screenshot; not an official boundary.
const approximateBoundary: [number, number][] = [
  [-5.3125441, 105.2303122], [-5.3132628, 105.2352743], [-5.3159577, 105.2382515],
  [-5.32009, 105.2385222], [-5.3235035, 105.2403265], [-5.3279053, 105.2414092],
  [-5.332307, 105.2424016], [-5.3367087, 105.2430331], [-5.340302, 105.2440255],
  [-5.3427274, 105.2465517], [-5.3469495, 105.2488071], [-5.3529681, 105.2515137],
  [-5.3570105, 105.2498898], [-5.3607835, 105.248356], [-5.3632987, 105.2485365],
  [-5.3653648, 105.2456495], [-5.3669818, 105.2418603], [-5.3678801, 105.2375298],
  [-5.3683293, 105.2330188], [-5.3676106, 105.2295905], [-5.3656343, 105.2280568],
  [-5.3625801, 105.2289589], [-5.3606038, 105.2309438], [-5.3573699, 105.2309438],
  [-5.3545851, 105.2292296], [-5.3515309, 105.2285078], [-5.3488359, 105.2271546],
  [-5.3456918, 105.2267035], [-5.3433562, 105.2250795], [-5.3412901, 105.2239969],
  [-5.3396731, 105.2251697], [-5.3377867, 105.2253502], [-5.3356307, 105.223636],
  [-5.3332053, 105.2230045], [-5.3300612, 105.2221925], [-5.3272764, 105.220749],
  [-5.3252103, 105.219937], [-5.323234, 105.2184033], [-5.3217069, 105.2187642],
  [-5.3209883, 105.2209294], [-5.3189222, 105.222824], [-5.3162272, 105.2248089],
  [-5.3138916, 105.2267937],
];

function FitMarkers({ markers }: { markers: Marker[] }) {
  const map = useMap();
  const points = useMemo(() => markers.map((marker) => [marker.latitude, marker.longitude] as [number, number]), [markers]);

  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [36, 36], maxZoom: 15 });
    else if (points.length === 1) map.setView(points[0], 15);
    else map.setView(center, 13);
  }, [map, points]);

  return null;
}

export function GeographicMap({ markers, onSelect }: {
  markers: Marker[];
  onSelect: (id: string) => void;
}) {
  const icon = useMemo(() => L.divIcon({
    className: "village-map-pin",
    html: '<span aria-hidden="true"></span>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }), []);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full" aria-label="Peta geografis Desa Fajar Baru">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMarkers markers={markers} />
      <Polygon
        positions={approximateBoundary}
        pathOptions={{ color: "#dc2626", weight: 3, dashArray: "6 7", fillColor: "#ef4444", fillOpacity: 0.08 }}
      >
        <Popup>Batas perkiraan dari screenshot. Bukan batas administrasi resmi.</Popup>
      </Polygon>
      {markers.map((marker) => (
        <LeafletMarker key={marker.id} position={[marker.latitude, marker.longitude]} icon={icon} eventHandlers={{ click: () => onSelect(marker.id) }}>
          <Popup>
            <strong>{marker.name}</strong><br />
            <span>{marker.jenis_info}</span>
            {marker.keterangan && <><br />{marker.keterangan}</>}
            <br /><a href={marker.jenis_info === "kantor" ? "https://maps.app.goo.gl/Xc7RmVGfKvzirQsc7" : `https://www.google.com/maps/search/?api=1&query=${marker.latitude},${marker.longitude}`} target="_blank" rel="noreferrer">Buka di Google Maps</a>
          </Popup>
        </LeafletMarker>
      ))}
    </MapContainer>
  );
}
