import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TaskList({ workerId }) {
  const [tasks, setTasks] = useState([]);
  const navigateReact = useNavigate();
  
  useEffect(() => {
    if (!workerId) return;
    fetch(`/api/workers/${workerId}/tasks`).then((r) => r.json()).then(setTasks);
  }, [workerId]);

  function navigate(task) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`, "_blank");
  }

  return (
    <div className="p-4 space-y-3">
      {tasks.map((t) => (
        <div key={t.id} className="border rounded p-3">
          <div className="flex justify-between">
            <span className={t.priorityScore >= 20 ? "text-red-600 font-bold" : "text-orange-600"}>
              {t.priorityScore >= 20 ? "HIGH" : "MEDIUM"} — {t.issueType}
            </span>
            <span>{t.distanceKm.toFixed(1)} km away</span>
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => navigate(t)} className="bg-blue-600 text-white px-3 py-1 rounded">
              Navigate
            </button>
            <button onClick={() => navigateReact(`/resolve/${t.id}`)} className="bg-green-600 text-white px-3 py-1 rounded">
              Resolve
            </button>
          </div>
        </div>
      ))}
      {tasks.length === 0 && <div className="text-gray-500">No active tasks assigned to you.</div>}
    </div>
  );
}
