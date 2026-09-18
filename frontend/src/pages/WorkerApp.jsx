import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import {
  HardHat, MapPin, Navigation, CheckCircle2, Camera,
  AlertTriangle, ChevronRight, Clock, Zap
} from 'lucide-react';

export default function WorkerApp() {
  const { clusters, resolveCluster } = useCivicData();

  const activeWorkerId = 1;
  const workerName     = 'Raj Kumar';
  const workerDept     = 'ROAD';

  const myTasks = clusters.filter(c =>
    c.assignedWorkerId === activeWorkerId ||
    (c.status !== 'RESOLVED' && c.department === workerDept)
  );

  const [selectedTask, setSelectedTask]     = useState(null);
  const [afterPhotoUrl, setAfterPhotoUrl]   = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolveSuccess, setResolveSuccess] = useState(false);

  const handleNavigate = (task) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${task.centroidLat},${task.centroidLng}`,
      '_blank'
    );
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) setAfterPhotoUrl(URL.createObjectURL(file));
  };

  const handleResolve = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    resolveCluster(
      selectedTask.id, activeWorkerId,
      afterPhotoUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
      resolutionNotes || 'Pothole filled with cold asphalt mix. Surface levelled and compacted.'
    );
    setResolveSuccess(true);
    setTimeout(() => { setResolveSuccess(false); setSelectedTask(null); setAfterPhotoUrl(''); setResolutionNotes(''); }, 1800);
  };

  const priorityLabel = (score) =>
    score >= 20 ? { label: 'HIGH', cls: 'badge priority-high' }
    : score >= 10 ? { label: 'MED', cls: 'badge priority-med' }
    : { label: 'LOW', cls: 'badge priority-low' };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">

      {/* Worker Header */}
      <div className="card p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-gradient shadow-md shadow-amber-200 flex items-center justify-center">
            <HardHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900">{workerName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="badge badge-amber">{workerDept} DEPT</span>
              <span className="text-xs text-slate-400">Field Worker ID #0412</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Active Tasks</div>
          <div className="text-3xl font-display font-extrabold text-amber-600 leading-tight">
            {myTasks.filter(t => t.status !== 'RESOLVED').length}
          </div>
        </div>
      </div>

      {/* ─── TASK DETAIL / RESOLVE VIEW ─── */}
      {selectedTask ? (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button onClick={() => setSelectedTask(null)} className="btn-ghost text-slate-500">
              ← Back to List
            </button>
            <span className="text-xs font-mono text-slate-400">Cluster #{selectedTask.id}</span>
          </div>

          {resolveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Issue marked RESOLVED — Citizen notified!
            </div>
          )}

          {!resolveSuccess && (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">{selectedTask.issueType} Repair Task</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedTask.description}</p>
                </div>
                <span className={priorityLabel(selectedTask.priorityScore).cls}>
                  {priorityLabel(selectedTask.priorityScore).label}
                </span>
              </div>

              {/* Navigate card */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-4 rounded-xl">
                <div>
                  <div className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    Nirma Campus Access Road
                  </div>
                  <div className="text-xs text-blue-600 mt-0.5">
                    GPS: {selectedTask.centroidLat.toFixed(4)}, {selectedTask.centroidLng.toFixed(4)}
                  </div>
                </div>
                <button onClick={() => handleNavigate(selectedTask)} className="btn-primary">
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              </div>

              {/* Before photo */}
              <div>
                <div className="text-sm font-medium text-slate-500 mb-2">
                  "Before" Evidence — Reported by Citizen
                </div>
                <img src={selectedTask.photoUrl} alt="Before" className="w-full h-44 object-cover rounded-xl border border-slate-200" />
              </div>

              {/* Resolve form */}
              <form onSubmit={handleResolve} className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Submit Resolution</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    After Photo — Completion Evidence
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl transition-colors cursor-pointer overflow-hidden bg-slate-50">
                    <input type="file" accept="image/*" onChange={handlePhotoSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {afterPhotoUrl ? (
                      <img src={afterPhotoUrl} alt="After" className="w-full h-36 object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 gap-2">
                        <Camera className="w-7 h-7 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-600">Tap to upload "after" photo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Resolution Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe work done on site..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3 text-sm bg-green-gradient">
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Issue as RESOLVED
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        /* ─── TASK LIST ─── */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Today's Task Queue</span>
            <span>Sorted by Priority Score</span>
          </div>

          {myTasks.map((t) => {
            const { label, cls } = priorityLabel(t.priorityScore);
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className="w-full card card-hover p-4 flex items-center gap-4 text-left"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cls}>{label}</span>
                    <span className="text-sm font-bold text-slate-900">{t.issueType}</span>
                    <span className="badge badge-gray">{t.reportCount} report{t.reportCount > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> 0.4 km away
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.daysOpen}d open
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" /> Score: {t.priorityScore}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNavigate(t); }}
                    className="btn-secondary p-2"
                    title="Open in Maps"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </button>
            );
          })}

          {myTasks.length === 0 && (
            <div className="card p-10 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400" />
              <p className="font-semibold">All tasks completed! 🎉</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
