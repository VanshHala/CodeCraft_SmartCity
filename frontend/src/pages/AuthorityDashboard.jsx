import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import MapView from '../components/MapView';
import VerifyAiModal from '../components/VerifyAiModal';
import AssignWorkerModal from '../components/AssignWorkerModal';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, UserCheck,
  Sparkles, Activity, Search, TrendingUp, BarChart3, Map
} from 'lucide-react';

export default function AuthorityDashboard() {
  const { clusters, overridePriority, selectedDepartment, setSelectedDepartment, currentUser } = useCivicData();
  const [activeTab, setActiveTab] = useState('queue');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus]     = useState('ALL');
  const [searchQuery, setSearchQuery]       = useState('');
  const [verifyCluster, setVerifyCluster]   = useState(null);
  const [assignCluster, setAssignCluster]   = useState(null);
  const [editingId, setEditingId]           = useState(null);
  const [tempScore, setTempScore]           = useState('');

  // Department-filtered base list
  const deptClusters = clusters.filter(c => {
    if (!selectedDepartment || selectedDepartment === 'ALL') return true;
    return c.department === selectedDepartment;
  });

  const kpi = {
    total:      deptClusters.length,
    pending:    deptClusters.filter(c => c.status === 'REPORTED' || c.status === 'VERIFIED').length,
    inProgress: deptClusters.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length,
    resolved:   deptClusters.filter(c => c.status === 'RESOLVED').length,
  };

  const filtered = deptClusters.filter(c => {
    if (filterCategory !== 'ALL' && c.issueType !== filterCategory) return false;
    if (filterStatus   !== 'ALL' && c.status    !== filterStatus)   return false;
    if (searchQuery && !c.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.issueType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const statusClass = (s) => {
    const m = {
      REPORTED: 'status-reported', VERIFIED: 'status-verified',
      ASSIGNED: 'status-assigned', IN_PROGRESS: 'status-in-progress', RESOLVED: 'status-resolved'
    };
    return `badge ${m[s] || 'badge-gray'}`;
  };

  const priorityClass = (score) =>
    score >= 20 ? 'badge priority-high' : score >= 10 ? 'badge priority-med' : 'badge priority-low';

  const tabs = [
    { id: 'queue',   label: `Issue Queue (${deptClusters.length})`, icon: Activity },
    { id: 'heatmap', label: 'Hotspot Map', icon: Map },
    { id: 'health',  label: 'City Health Score', icon: BarChart3 },
  ];

  const getDepartmentLabel = (dept) => {
    switch (dept) {
      case 'ROAD': return 'Roads & Infrastructure Department';
      case 'WATER': return 'Water Supply & Drainage Department';
      case 'ELECTRICAL': return 'Electrical & Streetlighting Department';
      case 'SANITATION': return 'Sanitation & Waste Management Department';
      default: return 'All Municipal Departments (Command Center)';
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Department Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {selectedDepartment === 'ALL' ? 'Command Center' : `${selectedDepartment} Dept View`}
            </span>
            {currentUser?.name && (
              <span className="text-xs text-slate-300">
                Logged in as <strong className="text-white">{currentUser.name}</strong>
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            {getDepartmentLabel(selectedDepartment)}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing real-time AI cluster queues, risk priority scores & worker dispatch for this department.
          </p>
        </div>

        {/* Quick dept switcher buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 shrink-0">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ROAD', label: '🛣️ Roads' },
            { id: 'WATER', label: '💧 Water' },
            { id: 'ELECTRICAL', label: '⚡ Electrical' },
            { id: 'SANITATION', label: '🧹 Sanitation' },
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDepartment(d.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDepartment === d.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Authority Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time issue triage · Worker dispatch · City health monitoring</p>
        </div>
        <div className="badge badge-blue text-xs px-4 py-2 rounded-xl">
          Priority Formula: Severity × Reports × Recency × Centrality
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Clusters', value: kpi.total,      color: 'slate', border: '' },
          { label: 'Pending Triage', value: kpi.pending,    color: 'amber', border: 'border-amber-200' },
          { label: 'In Dispatch',    value: kpi.inProgress, color: 'blue',  border: 'border-blue-200' },
          { label: 'Resolved',       value: kpi.resolved,   color: 'green', border: 'border-green-200' },
          { label: 'City Health',    value: '88/100',        color: 'blue',  border: 'border-blue-200', special: true },
        ].map(({ label, value, color, border, special }) => (
          <div key={label} className={`stat-card border ${border || 'border-slate-200'} ${special ? 'bg-blue-gradient text-white col-span-1' : ''}`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${special ? 'text-blue-100' : `text-${color}-500`}`}>{label}</div>
            <div className={`text-3xl font-display font-extrabold leading-none ${special ? 'text-white' : `text-${color === 'slate' ? 'slate-900' : `${color}-600`}`}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`tab-item ${activeTab === id ? 'active' : ''}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ─── TAB: QUEUE ─── */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="card p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search issues..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9" />
            </div>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field md:w-40">
              <option value="ALL">All Categories</option>
              <option value="POTHOLE">Pothole</option>
              <option value="STREETLIGHT">Streetlight</option>
              <option value="WATER">Water</option>
              <option value="GARBAGE">Garbage</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field md:w-40">
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <div className="text-xs text-slate-400 ml-auto hidden md:block">
              Showing {filtered.length} of {clusters.length} clusters
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Issue / Description</th>
                    <th>Reports</th>
                    <th>Dept.</th>
                    <th>Status · SLA</th>
                    <th>Assigned Worker</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      {/* Priority Score — click to edit */}
                      <td>
                        <div className="flex items-center gap-2">
                          {editingId === c.id ? (
                            <div className="flex items-center gap-1">
                              <input type="number" step="0.1" defaultValue={c.priorityScore}
                                onChange={(e) => setTempScore(e.target.value)}
                                className="w-16 border border-blue-400 rounded-lg px-1 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 outline-none" />
                              <button onClick={() => { overridePriority(c.id, tempScore); setEditingId(null); }}
                                className="text-green-600 font-bold text-xs px-1">✓</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingId(c.id); setTempScore(c.priorityScore); }}
                              className={`${priorityClass(c.priorityScore)} cursor-pointer hover:opacity-80`}
                              title="Click to override">
                              {c.priorityScore}
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="max-w-[220px]">
                        <div className="font-bold text-slate-900 text-sm">{c.issueType}</div>
                        <div className="text-slate-400 text-xs truncate mt-0.5">{c.description}</div>
                      </td>

                      <td>
                        <span className="badge badge-gray">{c.reportCount} report{c.reportCount > 1 ? 's' : ''}</span>
                      </td>

                      <td>
                        <span className="text-sm font-semibold text-slate-700">{c.department}</span>
                      </td>

                      <td>
                        <div className="space-y-1.5">
                          <span className={statusClass(c.status)}>{c.status}</span>
                          {c.daysOpen > c.targetDays ? (
                            <div className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Overdue {c.daysOpen}d / {c.targetDays}d
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400">{c.daysOpen}d / {c.targetDays}d target</div>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="text-sm text-slate-700 font-medium">
                          {c.assignedWorkerName || <span className="text-slate-400 italic">Unassigned</span>}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setVerifyCluster(c)} className="btn-secondary text-xs py-1.5 px-3">
                            Verify AI
                          </button>
                          <button onClick={() => setAssignCluster(c)} className="btn-primary text-xs py-1.5 px-3">
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: HEATMAP ─── */}
      {activeTab === 'heatmap' && (
        <div className="card overflow-hidden" style={{ height: 540 }}>
          <MapView clusters={clusters} showHeatmap />
        </div>
      )}

      {/* ─── TAB: CITY HEALTH ─── */}
      {activeTab === 'health' && (
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Ward Infrastructure Health Scorecard</h2>
              <p className="text-sm text-slate-500 mt-0.5">Ward 4 — Campus & SG Highway Region</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold uppercase">Overall Score</div>
              <div className="text-4xl font-display font-extrabold text-blue-600">88<span className="text-lg text-slate-400">/100</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { label: 'Road Quality',   score: 74,  sub: '1 open pothole cluster',  color: 'red'  },
              { label: 'Street Lighting',score: 85,  sub: '1 dark stretch flagged',  color: 'amber'},
              { label: 'Water Supply',   score: 82,  sub: 'Pipe leak in repair',     color: 'blue' },
              { label: 'Sanitation',     score: 98,  sub: '0 open garbage clusters', color: 'green'},
              { label: 'Public Safety',  score: 95,  sub: 'No structural hazards',   color: 'green'},
            ].map(({ label, score, sub, color }) => (
              <div key={label} className="stat-card border border-slate-200 text-center space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
                <div className={`text-3xl font-display font-extrabold ${
                  color === 'red'   ? 'text-red-600'   :
                  color === 'amber' ? 'text-amber-600' :
                  color === 'blue'  ? 'text-blue-600'  : 'text-green-600'
                }`}>{score}</div>
                <div className={`w-full h-1.5 rounded-full bg-slate-100 overflow-hidden`}>
                  <div className={`h-full rounded-full ${
                    color === 'red'   ? 'bg-red-500'   :
                    color === 'amber' ? 'bg-amber-500' :
                    color === 'blue'  ? 'bg-blue-500'  : 'bg-green-500'
                  }`} style={{ width: `${score}%` }} />
                </div>
                <div className="text-[11px] text-slate-400">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {verifyCluster && <VerifyAiModal cluster={verifyCluster} onClose={() => setVerifyCluster(null)} />}
      {assignCluster && <AssignWorkerModal cluster={assignCluster} onClose={() => setAssignCluster(null)} />}
    </div>
  );
}
