import React from 'react';
import { useCivicData } from '../context/CivicDataContext';
import { UserCheck, Sparkles, MapPin, CheckCircle2, X } from 'lucide-react';

export default function AssignWorkerModal({ cluster, onClose }) {
  const { suggestWorkers, assignWorkerToCluster } = useCivicData();

  if (!cluster) return null;

  const candidates = suggestWorkers(cluster.id);

  const handleAssign = (workerId) => {
    assignWorkerToCluster(cluster.id, workerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Assign Field Worker</h3>
            <p className="text-xs text-slate-400">
              Ranking candidates for <span className="text-teal-400 font-semibold">{cluster.issueType}</span> (Priority: {cluster.priorityScore})
            </p>
          </div>
        </div>

        {/* Algorithm Score Explanation Header */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Scoring Formula: <code className="text-teal-300">Domain Match × Priority Score × (1 / 1+DistKm) × (1 / 1+ActiveTasks)</code>
          </span>
        </div>

        {/* Candidates List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {candidates.map((cand, idx) => (
            <div 
              key={cand.workerId}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                idx === 0 
                  ? 'bg-teal-950/30 border-teal-500/50 shadow-lg shadow-teal-950/40' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100 text-sm">{cand.name}</span>
                  <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    {cand.department}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Best Match
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {cand.distanceKm} km away
                  </span>
                  <span>Active Tasks: <strong className="text-slate-200">{cand.activeTasks}</strong></span>
                  <span>Fit Score: <strong className="text-teal-400">{cand.fitScore}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleAssign(cand.workerId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  idx === 0 
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-900/50' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                Assign Worker
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
