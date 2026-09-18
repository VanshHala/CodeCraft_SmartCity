import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { DEMO_CENTER } from '../context/CivicDataContext';
import { AlertCircle, CheckCircle2, Clock, MapPin, User, Flame } from 'lucide-react';

// Custom Pin Marker Creator function
const createCustomIcon = (issueType, priorityScore, status) => {
  let color = '#10b981'; // Low priority green
  if (priorityScore >= 20) {
    color = '#ef4444'; // High priority red
  } else if (priorityScore >= 10) {
    color = '#f59e0b'; // Medium orange
  }

  if (status === 'RESOLVED') {
    color = '#64748b'; // Muted grey
  }

  const svgMap = {
    POTHOLE: '🕳️',
    STREETLIGHT: '💡',
    WATER: '💧',
    GARBAGE: '🗑️',
    SAFETY: '⚠️',
    OTHER: '📍'
  };

  const emoji = svgMap[issueType] || '📍';

  const html = `
    <div style="
      background-color: ${color};
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px ${color}80, 0 4px 6px rgba(0,0,0,0.4);
      border: 2px solid white;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s ease;
    ">
      ${emoji}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

export default function MapView({ 
  clusters = [], 
  routePath = null, 
  center = [DEMO_CENTER.lat, DEMO_CENTER.lng], 
  zoom = 15,
  showHeatmap = false,
  onPinClick = null 
}) {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        {/* Light-mode Map Tiles — CartoDB Positron */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Heatmap Hotspot Radius Visualization if Enabled */}
        {showHeatmap && clusters.map(c => (
          <Circle
            key={`heat-${c.id}`}
            center={[c.centroidLat, c.centroidLng]}
            radius={c.priorityScore * 12}
            pathOptions={{
              color: c.priorityScore >= 20 ? '#ef4444' : c.priorityScore >= 10 ? '#f59e0b' : '#10b981',
              fillColor: c.priorityScore >= 20 ? '#ef4444' : c.priorityScore >= 10 ? '#f59e0b' : '#10b981',
              fillOpacity: 0.25,
              weight: 1
            }}
          />
        ))}

        {/* Route Line if Provided */}
        {routePath && (
          <Polyline
            positions={routePath.points}
            pathOptions={{
              color: routePath.mode === 'safest' ? '#10b981' : '#f59e0b',
              weight: 6,
              opacity: 0.85,
              dashArray: routePath.mode === 'safest' ? '' : '10, 10'
            }}
          />
        )}

        {/* Issue Pins */}
        {clusters.map((c) => (
          <Marker
            key={c.id}
            position={[c.centroidLat, c.centroidLng]}
            icon={createCustomIcon(c.issueType, c.priorityScore, c.status)}
            eventHandlers={{
              click: () => onPinClick && onPinClick(c)
            }}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    c.priorityScore >= 20 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    c.priorityScore >= 10 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {c.priorityScore >= 20 ? '[HIGH] PRIORITY' : c.priorityScore >= 10 ? '[MED] PRIORITY' : '[LOW] PRIORITY'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">ID #{c.id}</span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5 mb-1">
                  <span>{c.issueType}</span>
                  <span className="text-xs text-slate-400 font-normal">({c.department})</span>
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                  {c.description}
                </p>

                <div className="grid grid-cols-2 gap-1 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-slate-400 mb-2">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500">Priority Score</span>
                    <span className="font-bold text-teal-400 text-xs">{c.priorityScore}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500">Merged Reports</span>
                    <span className="font-bold text-slate-200 text-xs">{c.reportCount} reports</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{c.daysOpen}d ago</span>
                  </span>
                  <span className={`font-semibold ${
                    c.status === 'RESOLVED' ? 'text-emerald-400' :
                    c.status === 'ASSIGNED' ? 'text-blue-400' : 'text-amber-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
