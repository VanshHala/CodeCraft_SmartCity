import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import { ShieldCheck, Sparkles, X, Check } from 'lucide-react';

export default function VerifyAiModal({ cluster, onClose }) {
  const { verifyCluster } = useCivicData();
  const [issueType, setIssueType] = useState(cluster?.issueType || 'POTHOLE');
  const [severity, setSeverity] = useState(cluster?.severity || 7);
  const [department, setDepartment] = useState(cluster?.department || 'ROAD');

  if (!cluster) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCluster(cluster.id, issueType, parseInt(severity), department);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Verify AI Classification</h3>
            <p className="text-xs text-slate-400">Issue Cluster #{cluster.id} — Gemini AI Confidence: {(cluster.aiConfidence * 100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 mb-5 space-y-2">
          <div className="text-xs text-slate-400">Original Citizen Report Description:</div>
          <div className="text-sm text-slate-200 italic font-medium">"{cluster.description}"</div>
          {cluster.photoUrl && (
            <img src={cluster.photoUrl} alt="Report evidence" className="w-full h-32 object-cover rounded-lg mt-2 border border-slate-800" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Issue Category
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            >
              <option value="POTHOLE">Pothole / Road Damage</option>
              <option value="STREETLIGHT">Streetlight / Electrical</option>
              <option value="WATER">Water Leakage / Pipe Burst</option>
              <option value="GARBAGE">Garbage / Waste Overflow</option>
              <option value="SAFETY">Safety Hazard / Open Drain</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Assigned Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="ROAD">Road Infrastructure</option>
                <option value="ELECTRICAL">Electrical & Lighting</option>
                <option value="WATER">Water Works</option>
                <option value="SANITATION">Sanitation & Waste</option>
                <option value="SAFETY">Public Safety</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Severity Score (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Verify AI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
