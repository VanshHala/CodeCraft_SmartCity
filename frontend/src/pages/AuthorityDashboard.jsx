import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import MapView from '../components/MapView';
import VerifyAiModal from '../components/VerifyAiModal';
import AssignWorkerModal from '../components/AssignWorkerModal';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Sparkles, 
  Flame, 
  Activity, 
  Filter, 
  Search,
  Sliders
} from 'lucide-react';

export default function AuthorityDashboard() {
  const { clusters, overridePriority } = useCivicData();
  const [activeTab, setActiveTab] = useState('queue'); // queue | heatmap | health
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [verifyModalCluster, setVerifyModalCluster] = useState(null);
  const [assignModalCluster, setAssignModalCluster] = useState(null);
  const [editingPriorityId, setEditingPriorityId] = useState(null);
  const [tempPriorityScore, setTempPriorityScore] = useState('');

  // Calculate KPI Summary
  const kpiTotal = clusters.length;
  const kpiPending = clusters.filter(c => c.status === 'REPORTED' || c.status === 'VERIFIED').length;
  const kpiInProgress = clusters.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
  const kpiResolved = clusters.filter(c => c.status === 'RESOLVED').length;

  // Filtered Cluster Rows
  const filteredClusters = clusters.filter(c => {
    if (filterCategory !== 'ALL' && c.issueType !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchQuery && !c.description.toLowerCase().includes(searchQuery.toLowerCase()) && !c.issueType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const handlePrioritySave = (id) => {
    if (tempPriorityScore) {
      overridePriority(id, tempPriorityScore);
      setEditingPriorityId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-display flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>Municipal Authority Command Center</span>
          </h2>
          <p className="text-xs text-slate-400">Real-time issue cluster triage, worker dispatch & city health score</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'queue' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Issue Queue ({clusters.length})
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'heatmap' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hotspot Map
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'health' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            City Health Score
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Clusters</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{kpiTotal}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-amber-500/20 text-center">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Pending Triage</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{kpiPending}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-blue-500/20 text-center">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">In Dispatch</span>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">{kpiInProgress}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-emerald-500/20 text-center">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{kpiResolved}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-teal-500/20 text-center bg-teal-950/20">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">City Health Index</span>
          <div className="text-2xl font-extrabold text-teal-300 mt-1">88 / 100</div>
        </div>
      </div>

      {/* TAB 1: ISSUE QUEUE TABLE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="ALL">All Categories</option>
                <option value="POTHOLE">Potholes</option>
                <option value="STREETLIGHT">Streetlights</option>
                <option value="WATER">Water Leaks</option>
                <option value="GARBAGE">Garbage</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="VERIFIED">Verified AI</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Sorted by Priority Formula (Severity × Reports × Recency × Criticality)
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-3 px-4">Priority Score</th>
                    <th className="py-3 px-4">Cluster / Issue</th>
                    <th className="py-3 px-4">Reports</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status & SLA</th>
                    <th className="py-3 px-4">Assigned Worker</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredClusters.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Priority Score Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            c.priorityScore >= 20 ? 'bg-rose-500 shadow-glow-crimson' :
                            c.priorityScore >= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          
                          {editingPriorityId === c.id ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                step="0.1"
                                defaultValue={c.priorityScore}
                                onChange={(e) => setTempPriorityScore(e.target.value)}
                                className="w-16 bg-slate-950 border border-teal-500 text-teal-300 font-bold px-1 py-0.5 rounded text-xs"
                              />
                              <button onClick={() => handlePrioritySave(c.id)} className="text-teal-400 font-bold px-1.5">✓</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingPriorityId(c.id); setTempPriorityScore(c.priorityScore); }}
                              className="font-extrabold text-slate-100 text-sm hover:text-teal-400 hover:underline"
                              title="Click to override priority score"
                            >
                              {c.priorityScore}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Issue Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-100">{c.issueType}</div>
                        <p className="text-slate-400 line-clamp-1 text-[11px]">{c.description}</p>
                      </td>

                      {/* Reports Count */}
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md font-mono text-[11px]">
                          {c.reportCount} report{c.reportCount > 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-semibold">{c.department}</span>
                      </td>

                      {/* Status & SLA */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            c.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            c.status === 'ASSIGNED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            c.status === 'VERIFIED' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {c.status}
                          </span>

                          <div className="text-[10px] text-slate-400">
                            {c.daysOpen > c.targetDays ? (
                              <span className="text-rose-400 font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Overdue ({c.daysOpen}d / {c.targetDays}d target)
                              </span>
                            ) : (
                              <span>Target: {c.targetDays}d ({c.daysOpen}d open)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Worker */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-medium">
                          {c.assignedWorkerName || <span className="text-slate-500 italic">Unassigned</span>}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setVerifyModalCluster(c)}
                          className="bg-slate-800 hover:bg-slate-700 text-teal-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-700"
                        >
                          Verify AI
                        </button>
                        <button
                          onClick={() => setAssignModalCluster(c)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-[11px] font-bold shadow-md shadow-blue-900/40"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOTSPOT MAP */}
      {activeTab === 'heatmap' && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 h-[550px]">
          <MapView clusters={clusters} showHeatmap={true} />
        </div>
      )}

      {/* TAB 3: CITY HEALTH SCORE ANALYTICS */}
      {activeTab === 'health' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-display">Ward Infrastructure Health Scorecard</h3>
              <p className="text-xs text-slate-400">Aggregated sub-scores for Ward 4 (Campus & SG Highway Region)</p>
            </div>
            <div className="text-2xl font-extrabold text-teal-400">Overall: 88 / 100</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Road Quality</span>
              <div className="text-xl font-bold text-rose-400 mt-1">74 / 100</div>
              <p className="text-[10px] text-slate-500 mt-1">1 open pothole cluster</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Lighting</span>
              <div className="text-xl font-bold text-amber-400 mt-1">85 / 100</div>
              <p className="text-[10px] text-slate-500 mt-1">1 dark patch flagged</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Water Supply</span>
              <div className="text-xl font-bold text-blue-400 mt-1">82 / 100</div>
              <p className="text-[10px] text-slate-500 mt-1">1 pipe leak repair active</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Sanitation</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">98 / 100</div>
              <p className="text-[10px] text-slate-500 mt-1">0 open garbage dumps</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Safety Index</span>
              <div className="text-xl font-bold text-teal-400 mt-1">95 / 100</div>
              <p className="text-[10px] text-slate-500 mt-1">No structural hazards</p>
            </div>
          </div>
        </div>
      )}

      {/* Verify AI Modal */}
      {verifyModalCluster && (
        <VerifyAiModal
          cluster={verifyModalCluster}
          onClose={() => setVerifyModalCluster(null)}
        />
      )}

      {/* Assign Worker Modal */}
      {assignModalCluster && (
        <AssignWorkerModal
          cluster={assignModalCluster}
          onClose={() => setAssignModalCluster(null)}
        />
      )}

    </div>
  );
}
