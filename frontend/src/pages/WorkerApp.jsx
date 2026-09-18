import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import { 
  HardHat, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Camera, 
  Clock, 
  AlertTriangle, 
  Phone,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function WorkerApp() {
  const { clusters, resolveCluster } = useCivicData();

  // Active Field Worker profile (e.g., Raj Kumar - ROAD Dept, Worker #1)
  const activeWorkerId = 1;
  const workerName = "Raj Kumar";
  const workerDept = "ROAD";

  // Filter tasks assigned to worker or open in worker domain
  const myTasks = clusters.filter(c => c.assignedWorkerId === activeWorkerId || (c.status !== 'RESOLVED' && c.department === workerDept));

  const [selectedTask, setSelectedTask] = useState(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolveSuccess, setResolveSuccess] = useState(false);

  const handleNavigate = (task) => {
    // Deep-link into native device maps app (Google Maps / OSM)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${task.centroidLat},${task.centroidLng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      resolveCluster(
        selectedTask.id,
        activeWorkerId,
        afterPhotoUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
        resolutionNotes || 'Pothole filled with cold asphalt mix. Surface leveled.'
      );
      setResolveSuccess(true);
      setTimeout(() => {
        setResolveSuccess(false);
        setSelectedTask(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fadeIn pb-12">
      
      {/* Worker Profile Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-orange-950/40">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-1.5">
              <span>{workerName}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                {workerDept} DEPT
              </span>
            </h2>
            <p className="text-xs text-slate-400">Field Dispatch Worker ID #0412</p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400 block">Assigned Tasks</span>
          <strong className="text-amber-400 text-base">{myTasks.filter(t => t.status !== 'RESOLVED').length} Active</strong>
        </div>
      </div>

      {/* TASK DETAIL / RESOLVE SCREEN */}
      {selectedTask ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <button
              onClick={() => setSelectedTask(null)}
              className="text-xs text-slate-400 hover:text-white font-semibold"
            >
              ← Back to Task List
            </button>
            <span className="text-xs font-mono text-teal-400">Cluster #{selectedTask.id}</span>
          </div>

          {resolveSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span>Issue marked as RESOLVED! Citizen notified.</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">{selectedTask.issueType} Repair Task</h3>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                Priority Score: {selectedTask.priorityScore}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{selectedTask.description}</p>
          </div>

          {/* Navigation Action Card */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <div className="flex items-center gap-1 font-semibold text-slate-100">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Nirma Campus Access Rd</span>
              </div>
              <span className="text-[11px] text-slate-400">GPS: {selectedTask.centroidLat.toFixed(4)}, {selectedTask.centroidLng.toFixed(4)}</span>
            </div>

            <button
              onClick={() => handleNavigate(selectedTask)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-blue-900/40"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate GPS</span>
            </button>
          </div>

          {/* Before Photo Comparison */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              "Before" Evidence Photo (Reported by Citizen)
            </span>
            <img src={selectedTask.photoUrl} alt="Before" className="w-full h-40 object-cover rounded-xl border border-slate-800" />
          </div>

          {/* Resolve Form */}
          <form onSubmit={handleResolveSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Upload "After" Resolution Evidence Photo
              </label>
              <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-3 text-center bg-slate-900/60 cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {afterPhotoUrl ? (
                  <img src={afterPhotoUrl} alt="After" className="w-full h-32 object-cover rounded-lg border border-slate-700" />
                ) : (
                  <div className="space-y-1 py-2">
                    <Camera className="w-6 h-6 text-slate-500 mx-auto" />
                    <span className="text-xs text-slate-300 font-semibold block">Tap to capture completion photo</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Worker Completion Notes
              </label>
              <textarea
                rows={2}
                placeholder="Describe repair work executed on site..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-slate-950 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Issue as RESOLVED</span>
            </button>
          </form>

        </div>
      ) : (
        /* TODAY'S TASKS LIST VIEW */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Today's Task Queue</span>
            <span>Sorted by Priority & Distance</span>
          </div>

          {myTasks.map((t) => (
            <div 
              key={t.id}
              onClick={() => setSelectedTask(t)}
              className="glass-card p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between space-x-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    t.priorityScore >= 20 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    t.priorityScore >= 10 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {t.priorityScore >= 20 ? '[HIGH]' : t.priorityScore >= 10 ? '[MED]' : '[LOW]'}
                  </span>
                  <span className="font-bold text-slate-100 text-sm">{t.issueType}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-1">{t.description}</p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> 0.4 km away
                  </span>
                  <span>{t.reportCount} reports merged</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNavigate(t); }}
                  className="p-2 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700"
                  title="Navigate GPS"
                >
                  <Navigation className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
