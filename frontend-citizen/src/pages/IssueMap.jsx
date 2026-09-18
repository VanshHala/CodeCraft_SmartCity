import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PRIORITY_COLOR = (score) => (score >= 20 ? "red" : score >= 8 ? "orange" : "green");

export default function IssueMap() {
  const [clusters, setClusters] = useState([]);
  useEffect(() => { fetch("/api/clusters").then((r) => r.json()).then(setClusters); }, []);

  return (
    <MapContainer center={[23.1091, 72.5343]} zoom={15} style={{ height: "80vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {clusters.map((c) => (
        <CircleMarker key={c.id} center={[c.centroidLat, c.centroidLng]}
          radius={8} pathOptions={{ color: PRIORITY_COLOR(c.priorityScore) }}>
          <Popup>
            <b>{c.issueType}</b><br />
            Priority: {c.priorityScore.toFixed(1)}<br />
            Reports: {c.reportCount}<br />
            Status: {c.status}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
