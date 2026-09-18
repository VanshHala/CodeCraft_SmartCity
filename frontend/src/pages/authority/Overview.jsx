import { useState } from 'react';
import { authorityStats, recentReports } from '../../data/mockData';

export default function Overview() {
  const pendingReports = recentReports.filter(r => r.status !== 'Resolved');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-400 mb-1">
            <span>Thursday, 18 September 2026</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Live Operational Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">City Operations Center</h1>
          <p className="text-sm text-slate-500 mt-0.5">A clear view of what needs attention across municipal sectors and emergency response teams.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="px-3.5 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5">
            <i className="ph ph-clock-counter-clockwise text-sm"></i> History Log
          </button>
          <button className="px-3.5 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition shadow-sm shadow-emerald-700/20 flex items-center gap-1.5">
            <i className="ph-bold ph-plus text-sm"></i> Dispatch New Team
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          icon={<i className="ph-bold ph-chart-line text-lg"></i>}
          label="Total issues"
          value={authorityStats.totalIssues.toLocaleString()}
          subtext="8.4%"
          subtextLabel="vs last month benchmark"
          bgClass="bg-blue-50 text-blue-600"
          trend="up"
        />
        <KpiCard 
          icon={<i className="ph-bold ph-warning-circle text-lg"></i>}
          label="Pending review"
          value={authorityStats.pending}
          subtext="18 high priority"
          subtextLabel="Awaiting department triage"
          bgClass="bg-amber-50 text-amber-600"
          isBadge={true}
          badgeClass="bg-rose-50 text-rose-700 border-rose-200/60"
        />
        <KpiCard 
          icon={<i className="ph-bold ph-hourglass-high text-lg"></i>}
          label="In progress"
          value={authorityStats.inProgress || "156"}
          subtext="42 due today"
          subtextLabel="Active on-site taskforces"
          bgClass="bg-orange-50 text-orange-600"
          subtextColor="text-amber-700"
        />
        <KpiCard 
          icon={<i className="ph-bold ph-check-circle text-lg"></i>}
          label="Resolved"
          value={authorityStats.resolved}
          subtext="69% resolution"
          subtextLabel="+14% faster close rate"
          bgClass="bg-emerald-50 text-emerald-700"
          subtextColor="text-emerald-700"
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Live Monitoring</span>
            <h2 className="text-lg font-bold text-slate-900">Issue activity & spatial heat</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <i className="ph ph-magnifying-glass text-xs absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-sm" placeholder="Search issues..." />
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5">
              <i className="ph ph-funnel text-xs"></i> Filters
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5">
              <i className="ph ph-stack text-xs"></i> Heatmap
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col relative h-[460px]">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="relative w-56 sm:w-64 bg-white/95 backdrop-blur rounded-lg shadow-sm border border-slate-200">
                <i className="ph ph-magnifying-glass text-xs absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" className="w-full text-xs pl-8 pr-3 py-1.5 bg-transparent border-0 rounded-lg focus:ring-0 text-slate-800 font-medium" defaultValue="New York, NY" />
              </div>
            </div>
            <div className="absolute top-16 left-4 z-20 flex flex-col rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white/95 backdrop-blur divide-y divide-slate-100">
              <button className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold">+</button>
              <button className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold">−</button>
            </div>

            <div className="relative w-full h-full bg-[#e5ede0] overflow-hidden flex items-center justify-center" style={{
              backgroundImage: 'radial-gradient(#b8d5b8 1.5px, transparent 1.5px), linear-gradient(to right, rgba(200, 215, 195, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 215, 195, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px, 48px 48px, 48px 48px'
            }}>
              <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-85" preserveAspectRatio="none" viewBox="0 0 1000 600">
                <path d="M 280,0 Q 290,180 270,300 T 210,600 L 0,600 L 0,0 Z" fill="#cbe2f8"></path>
                <path d="M 640,0 Q 610,210 670,320 T 780,600 L 1000,600 L 1000,0 Z" fill="#cbe2f8"></path>
                <line stroke="#f59e0b" strokeDasharray="2 2" strokeWidth="4" x1="280" x2="350" y1="210" y2="220"></line>
                <line stroke="#64748b" strokeWidth="5" x1="590" x2="690" y1="260" y2="300"></line>
                <line stroke="#64748b" strokeWidth="4" x1="570" x2="710" y1="310" y2="350"></line>
                <path d="M 320,60 L 620,120 M 340,110 L 610,170 M 350,170 L 600,230 M 370,230 L 590,290 M 380,290 L 580,360" opacity="0.8" stroke="#ffffff" strokeWidth="3"></path>
                <path d="M 390,40 L 460,420 M 440,30 L 510,430 M 500,40 L 560,440" opacity="0.9" stroke="#fcd34d" strokeWidth="3.5"></path>
                <rect fill="#bbf7d0" height="130" opacity="0.8" rx="6" stroke="#86efac" strokeWidth="1" width="70" x="420" y="80"></rect>
                <text fill="#166534" fontFamily="sans-serif" fontSize="10" fontWeight="600" x="430" y="150">Central Park</text>
                <text fill="#0369a1" fontFamily="sans-serif" fontSize="11" fontWeight="600" x="140" y="240">Hudson River</text>
                <text fill="#0369a1" fontFamily="sans-serif" fontSize="11" fontWeight="600" x="730" y="220">East River</text>
                <text fill="#334155" fontFamily="sans-serif" fontSize="14" fontWeight="700" letterSpacing="1" x="435" y="270">MANHATTAN</text>
              </svg>

              <div className="absolute top-[38%] left-[54%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group">
                <span className="absolute -inset-2.5 rounded-full bg-rose-500 animate-pulse opacity-50"></span>
                <div className="relative w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center text-white scale-110">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold whitespace-nowrap opacity-90 shadow-md">
                  #SC1024 (Selected)
                </div>
              </div>

              <div className="absolute top-[32%] left-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20">
                <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-md"></div>
              </div>
              <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20">
                <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md"></div>
              </div>
              <div className="absolute top-[64%] left-[58%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20">
                <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-md"></div>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>High</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>Low</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>Resolved</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Selected Issue</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> High
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Pothole</h3>
                  <span className="text-xs font-mono font-medium text-slate-400">#SC1024</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Deep roadway hazard threatening vehicle axle integrity.</p>
              </div>
              
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-44 group">
                <div className="w-full h-full bg-slate-300"></div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur rounded text-[10px] font-medium text-white flex items-center gap-1">
                  <i className="ph ph-camera"></i> Citizen Attachment
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <i className="ph-bold ph-map-pin text-rose-600 text-sm shrink-0"></i>
                  <span className="truncate">125 W 42nd Street, Manhattan</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <i className="ph-bold ph-wrench text-slate-400 text-sm shrink-0"></i>
                  <span>Road & Infrastructure Department</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <i className="ph-bold ph-clock text-slate-400 text-sm shrink-0"></i>
                  <span>Reported 2 hours ago by verified citizen</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 space-y-2">
              <button className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2">
                <i className="ph-bold ph-user-plus text-sm"></i> Assign worker
              </button>
              <button className="w-full py-2 px-4 rounded-lg text-emerald-800 hover:bg-emerald-50 text-xs font-semibold transition text-center block">
                View full details →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inbox</span>
            <h2 className="text-base font-bold text-slate-900">Recent issues queue</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm">
              <i className="ph ph-export text-sm"></i> Export report
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1.5">
              <i className="ph-bold ph-funnel-simple text-sm"></i> Filter Queue
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              <tr>
                <th className="py-3.5 pl-6 pr-4">Issue</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Reported</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingReports.map((report, idx) => (
                <tr key={report.id} className={`hover:bg-slate-50/80 transition group ${idx === 0 ? 'bg-emerald-50/30' : ''}`}>
                  <td className="py-3.5 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                        {report.type === 'Pothole' && <i className="ph-duotone ph-road text-xl text-slate-500"></i>}
                        {report.type === 'Broken streetlight' && <i className="ph-duotone ph-lightbulb text-xl text-amber-500"></i>}
                        {report.type === 'Waste collection' && <i className="ph-duotone ph-trash text-xl text-emerald-600"></i>}
                        {report.type === 'Drainage problem' && <i className="ph-duotone ph-drop text-xl text-teal-600"></i>}
                        {report.type !== 'Pothole' && report.type !== 'Broken streetlight' && report.type !== 'Waste collection' && report.type !== 'Drainage problem' && <div className="w-full h-full bg-slate-300"></div>}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{report.type}</div>
                        <div className="font-mono text-[11px] text-slate-400">#{report.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{report.location}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${report.priority === 'High' ? 'text-rose-600' : report.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.priority === 'High' ? 'bg-rose-600' : report.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-600'}`}></span>
                      {report.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{report.reported}</td>
                  <td className="py-3.5 pl-4 pr-6 text-right">
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-white transition">
                      <i className="ph-bold ph-arrow-right text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, subtext, subtextLabel, bgClass, trend, isBadge, badgeClass, subtextColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-slate-300 group-hover:text-slate-500 transition">
          <i className="ph ph-arrow-up-right text-base"></i>
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
          {isBadge ? (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badgeClass}`}>
              {subtext}
            </span>
          ) : (
            <span className={`text-xs ${subtextColor ? subtextColor : 'font-semibold text-emerald-600 flex items-center gap-0.5'}`}>
              {trend === 'up' && <i className="ph ph-trend-up"></i>}
              {subtext}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{subtextLabel}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200/60";
  if (status === 'In Progress') colorClass = "bg-amber-50 text-amber-800 border-amber-200/60";
  if (status === 'Assigned') colorClass = "bg-blue-50 text-blue-800 border-blue-200/60";
  if (status === 'Verified') colorClass = "bg-purple-50 text-purple-800 border-purple-200/60";
  if (status === 'Resolved') colorClass = "bg-emerald-50 text-emerald-800 border-emerald-200/60";
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorClass}`}>
      {status}
    </span>
  );
}
