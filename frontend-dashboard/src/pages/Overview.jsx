import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer as RLMapContainer, TileLayer as RLTileLayer, useMap } from "react-leaflet";

function AssignModal({ cluster, onClose, onAssign }) {
  const [workers, setWorkers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/workers").then(r => r.json()),
      fetch(`/api/clusters/${cluster.id}/suggest-worker`).then(r => r.json())
    ]).then(([w, s]) => {
      setWorkers(w);
      setSuggestions(s);
      if (s.length > 0) {
        setSelectedWorkerId(s[0].workerId);
      } else if (w.length > 0) {
        setSelectedWorkerId(w[0].id);
      }
    });
  }, [cluster.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedWorkerId) {
      onAssign(cluster.id, selectedWorkerId);
    }
  };

  const getScoreInfo = (wId) => {
    const s = suggestions.find(x => x.workerId === wId);
    return s ? ` | Score: ${s.score.toFixed(1)}, Dist: ${s.distanceKm.toFixed(1)}km` : "";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Assign Worker</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Worker</label>
            <select 
              className="w-full border rounded p-2" 
              value={selectedWorkerId} 
              onChange={e => setSelectedWorkerId(e.target.value)}
            >
              {workers.map(w => (
                <option key={w.id} value={w.id}>
                  #{w.id} {w.department} (Tasks: {w.activeTaskCount || 0}){getScoreInfo(w.id)}
                </option>
              ))}
              {workers.length === 0 && <option value="">No workers available</option>}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={!selectedWorkerId}>Assign</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HeatmapLayer({ heatData, show }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!layerRef.current && heatData.length > 0) {
      layerRef.current = L.heatLayer(
        heatData.map(p => [p.lat, p.lng, p.weight * 0.1]), // Leaflet.heat expects [lat, lng, intensity]
        { radius: 25, blur: 15, maxZoom: 17 }
      );
    }
    
    if (show && layerRef.current) {
      layerRef.current.addTo(map);
    } else if (!show && layerRef.current) {
      map.removeLayer(layerRef.current);
    }
    
    return () => {
      if (layerRef.current && map.hasLayer(layerRef.current)) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, heatData, show]);
  
  return null;
}

export default function Overview() {
  const [clusters, setClusters] = useState([]);
  const [assigningCluster, setAssigningCluster] = useState(null);
  const [heatData, setHeatData] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const fetchClusters = () => fetch("/api/clusters").then((r) => r.json()).then(setClusters);
  const fetchHeatmap = () => fetch("/api/analytics/heatmap").then((r) => r.json()).then(setHeatData);
  const fetchAlerts = () => fetch("/api/analytics/alerts").then((r) => r.json()).then(setAlerts);

  useEffect(() => { 
    fetchClusters(); 
    fetchHeatmap();
    fetchAlerts();
  }, []);

  const handleAssign = (clusterId, workerId) => {
    fetch(`/api/clusters/${clusterId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId: parseInt(workerId) })
    }).then(() => {
      setAssigningCluster(null);
      fetchClusters();
      fetchHeatmap();
    });
  };

  const counts = clusters.reduce((acc, c) => {
    acc.total++; acc[c.status] = (acc[c.status] || 0) + 1; return acc;
  }, { total: 0 });

  const targetDays = { POTHOLE: 7, STREETLIGHT: 3, WATER: 2 };
  
  const getDaysOpen = (dateString) => {
    if (!dateString) return 0;
    const reportedDate = new Date(dateString);
    const diffTime = new Date() - reportedDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`p-4 rounded font-bold ${a.severity === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-yellow-100 text-yellow-800'}`}>
              ⚠️ {a.message}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Issues" value={counts.total} />
        <KpiCard label="Pending" value={(counts.REPORTED || 0) + (counts.VERIFIED || 0)} />
        <KpiCard label="In Progress" value={counts.IN_PROGRESS || 0} />
        <KpiCard label="Resolved" value={counts.RESOLVED || 0} />
      </div>
      
      <div className="mb-6 bg-white p-4 border rounded relative z-0">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Issue Heatmap</h2>
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2 rounded font-bold ${showHeatmap ? "bg-red-600 text-white" : "bg-gray-200 text-black"}`}
          >
            {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
          </button>
        </div>
        <div className="h-64 rounded overflow-hidden">
          <RLMapContainer center={[23.03, 72.58]} zoom={11} style={{ height: "100%", width: "100%" }}>
            <RLTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <HeatmapLayer heatData={heatData} show={showHeatmap} />
          </RLMapContainer>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead><tr className="text-left border-b">
          <th>Type</th><th>Priority</th><th>Reports</th><th>Status</th><th>Action</th>
        </tr></thead>
        <tbody>
          {clusters.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2">{c.issueType}</td>
              <td>{c.priorityScore.toFixed(1)}</td>
              <td>{c.reportCount}</td>
              <td className="flex items-center py-2">
                {c.status}
                {c.status !== "RESOLVED" && getDaysOpen(c.firstReportedAt) > (targetDays[c.issueType] || 5) && (
                  <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">Overdue</span>
                )}
              </td>
              <td>
                <button 
                  onClick={() => setAssigningCluster(c)} 
                  className="text-blue-600 underline"
                  disabled={c.status === "RESOLVED"}
                >
                  {c.status === "ASSIGNED" ? `Reassign (#${c.assignedWorkerId})` : "Assign Worker"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {assigningCluster && (
        <AssignModal 
          cluster={assigningCluster} 
          onClose={() => setAssigningCluster(null)} 
          onAssign={handleAssign} 
        />
      )}
    </div>
  );
}

function KpiCard({ label, value }) {
  return <div className="border rounded p-4 text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>;
}
