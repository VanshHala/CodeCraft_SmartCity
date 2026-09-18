import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useCivicData } from '../context/CivicDataContext';

export default function VerifyAiModal({ cluster, onClose }) {
  const { verifyCluster } = useCivicData();
  const [issueType, setIssueType]   = useState(cluster?.issueType || 'POTHOLE');
  const [severity, setSeverity]     = useState(cluster?.severity  || 7);
  const [department, setDepartment] = useState(cluster?.department || 'ROAD');

  if (!cluster) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCluster(cluster.id, issueType, parseInt(severity), department);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <button onClick={onClose} className="absolute top-4 right-4 btn-ghost p-2 rounded-lg">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">Verify AI Classification</h3>
            <p className="text-xs text-slate-500">Cluster #{cluster.id} · Gemini Confidence: {(cluster.aiConfidence * 100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
          <p className="text-xs text-slate-500 mb-1">Citizen Description:</p>
          <p className="text-sm font-semibold text-slate-800 italic">"{cluster.description}"</p>
          {cluster.photoUrl && (
            <img src={cluster.photoUrl} alt="Evidence" className="w-full h-32 object-cover rounded-lg mt-3 border border-slate-200" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="input-field">
              <option value="POTHOLE">Pothole / Road Damage</option>
              <option value="STREETLIGHT">Streetlight / Electrical</option>
              <option value="WATER">Water Leakage / Pipe Burst</option>
              <option value="GARBAGE">Garbage / Waste Overflow</option>
              <option value="SAFETY">Safety Hazard</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field">
                <option value="ROAD">Road Infrastructure</option>
                <option value="ELECTRICAL">Electrical & Lighting</option>
                <option value="WATER">Water Works</option>
                <option value="SANITATION">Sanitation</option>
                <option value="SAFETY">Public Safety</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Severity (1–10)</label>
              <input type="number" min="1" max="10" value={severity}
                onChange={(e) => setSeverity(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">
              <Sparkles className="w-4 h-4" />
              Confirm & Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
