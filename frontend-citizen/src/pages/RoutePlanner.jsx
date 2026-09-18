import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from "react-leaflet";

function MapClickHandler({ setFrom, setTo, from, to }) {
  useMapEvents({
    click(e) {
      if (!from) {
        setFrom(e.latlng);
      } else if (!to) {
        setTo(e.latlng);
      } else {
        setFrom(e.latlng);
        setTo(null);
      }
    }
  });
  return null;
}

export default function RoutePlanner() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState("fastest");

  async function fetchRoute(selectedMode) {
    if (!from || !to) return;
    setMode(selectedMode);
    const params = new URLSearchParams({
      fromLat: from.lat, fromLng: from.lng, toLat: to.lat, toLng: to.lng, mode: selectedMode,
    });
    const res = await fetch(`/api/route?${params}`);
    if (res.ok) {
        setRoute(await res.json());
    } else {
        console.error("Failed to fetch route");
    }
  }

  return (
    <div>
      <div className="flex gap-2 p-2">
        <button onClick={() => fetchRoute("fastest")} className={mode === "fastest" ? "font-bold underline border p-2" : "border p-2"}>Fastest Route</button>
        <button onClick={() => fetchRoute("safest")} className={mode === "safest" ? "font-bold underline border p-2" : "border p-2"}>Safest Route</button>
        <span className="p-2 text-sm text-gray-600">Click map to set Start (first click) then End (second click)</span>
      </div>
      {route && route.distanceKm > 0 && (
        <p className="px-2 text-sm">
          {mode === "fastest"
            ? `Fastest: ${route.distanceKm} km, passes ${route.flaggedStretchesAvoided === 0 ? "0" : "≥1"} flagged stretch`
            : `Safest: ${route.distanceKm} km (+${route.detourVsFastestPercent}%), avoids all flagged stretches`}
        </p>
      )}
      {route && route.distanceKm === 0 && (
        <p className="px-2 text-sm text-red-500">Route not found.</p>
      )}
      <MapContainer center={[23.1091, 72.5343]} zoom={15} style={{ height: "70vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler setFrom={setFrom} setTo={setTo} from={from} to={to} />
        {from && <Marker position={from} />}
        {to && <Marker position={to} />}
        {route && route.path.length > 0 && (
          <Polyline positions={route.path.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: mode === "safest" ? "green" : "orange", weight: 5 }} />
        )}
      </MapContainer>
    </div>
  );
}
