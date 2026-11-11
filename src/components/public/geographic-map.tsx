"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker as LeafletMarker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Marker } from "@/types/database";

const center: [number, number] = [-5.3436945, 105.2680212];

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
      {markers.map((marker) => (
        <LeafletMarker key={marker.id} position={[marker.latitude, marker.longitude]} icon={icon} eventHandlers={{ click: () => onSelect(marker.id) }}>
          <Popup>
            <strong>{marker.name}</strong><br />
            <span>{marker.jenis_info}</span>
            {marker.keterangan && <><br />{marker.keterangan}</>}
            <br /><a href={`https://www.google.com/maps/search/?api=1&query=${marker.latitude},${marker.longitude}`} target="_blank" rel="noreferrer">Buka di Google Maps</a>
          </Popup>
        </LeafletMarker>
      ))}
    </MapContainer>
  );
}
