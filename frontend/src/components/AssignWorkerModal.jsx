import React from 'react';
import { useCivicData } from '../context/CivicDataContext';
import { UserCheck, Sparkles, MapPin, X } from 'lucide-react';

export default function AssignWorkerModal({ cluster, onClose }) {
  const { suggestWorkers, assignWorkerToCluster } = useCivicData();
  if (!cluster) return null;

  const candidates = suggestWorkers(cluster.id);

  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 btn-ghost p-2">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">Assign Field Worker</h3>
            <p className="text-xs text-slate-500">
              Ranking for <span className="font-semibold text-blue-700">{cluster.issueType}</span> · Priority Score: {cluster.priorityScore}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2 text-xs text-blue-700 font-medium">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
          Algorithm: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px] ml-1">
            Domain Match × Priority × (1 / 1+DistKm) × (1 / 1+ActiveTasks)
          </code>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {candidates.map((cand, idx) => (
            <div key={cand.workerId} className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
              idx === 0
                ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-100'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{cand.name}</span>
                  <span className="badge badge-gray">{cand.department}</span>
                  {idx === 0 && (
                    <span className="badge badge-blue flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Best Match
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cand.distanceKm} km</span>
                  <span>Active Tasks: <strong className="text-slate-700">{cand.activeTasks}</strong></span>
                  <span>Fit Score: <strong className="text-blue-700">{cand.fitScore}</strong></span>
                </div>
              </div>

              <button
                onClick={() => { assignWorkerToCluster(cluster.id, cand.workerId); onClose(); }}
                className={idx === 0 ? 'btn-primary' : 'btn-secondary'}
              >
                Assign
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}
