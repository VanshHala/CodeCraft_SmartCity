import { Link } from 'react-router-dom';
import { citizenStats, recentReports, currentUser } from '../../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Thursday, 18 September 2026</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
            Good morning, {currentUser.name.split(' ')[0]} <span className="text-amber-400 text-xl">✦</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Help make your neighborhood better, one report at a time.</p>
        </div>
        <div>
          <Link to="/report" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-civic-700 hover:bg-civic-800 text-white font-semibold text-sm shadow-sm shadow-civic-700/20 transition-all hover:shadow-md">
            <i className="ph-bold ph-plus text-base"></i>
            Report an issue
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          icon={<i className="ph-bold ph-file-text text-xl"></i>} 
          label="Reports submitted" 
          value={citizenStats.submitted} 
          subtext="+3 this month" 
          subtextColor="text-emerald-600"
          bgClass="bg-blue-50 text-blue-600"
        />
        <KpiCard 
          icon={<i className="ph-bold ph-hourglass-high text-xl"></i>} 
          label="In progress" 
          value={citizenStats.inProgress} 
          subtext="2 need attention" 
          subtextColor="text-amber-600"
          bgClass="bg-amber-50 text-amber-600"
        />
        <KpiCard 
          icon={<i className="ph-bold ph-check-circle text-xl"></i>} 
          label="Resolved" 
          value={citizenStats.resolved} 
          subtext="71% resolution rate" 
          subtextColor="text-emerald-600"
          bgClass="bg-emerald-50 text-emerald-600"
        />
        <KpiCard 
          icon={<i className="ph-bold ph-map-pin text-xl"></i>} 
          label="Nearby issues" 
          value={citizenStats.nearby} 
          subtext="Within 2 km" 
          subtextColor="text-slate-500"
          bgClass="bg-purple-50 text-purple-600"
        />
      </section>

      <section className="space-y-3 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Activity</p>
            <h2 className="text-lg font-bold text-slate-900">Recent reports</h2>
          </div>
          <Link to="/reports" className="inline-flex items-center gap-1.5 text-xs font-semibold text-civic-700 hover:text-civic-800 group">
            View all 
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Issue</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4 text-right pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 border border-slate-200/50 flex items-center justify-center text-slate-400">
                          {report.type === 'Pothole' && <i className="ph-duotone ph-road text-xl"></i>}
                          {report.type === 'Broken streetlight' && <i className="ph-duotone ph-lightbulb text-xl"></i>}
                          {report.type === 'Waste collection' && <i className="ph-duotone ph-trash text-xl"></i>}
                          {report.type === 'Drainage problem' && <i className="ph-duotone ph-drop text-xl"></i>}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{report.type}</div>
                          <div className="text-[11px] text-slate-400 font-mono">#{report.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{report.location}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <span className={`w-2 h-2 rounded-full ${report.priority === 'High' ? 'bg-red-600' : report.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-600'}`}></span>
                        {report.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{report.reported}</td>
                    <td className="py-3.5 px-4 text-right pr-6">
                      <Link to={`/reports/${report.id}`} className="text-slate-400 hover:text-slate-700">
                        <i className="ph-bold ph-arrow-right text-base"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, subtext, subtextColor, bgClass }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-slate-400 hover:text-slate-600 cursor-pointer">
          <i className="ph-bold ph-arrow-up-right text-base"></i>
        </span>
      </div>
      <div>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <div className="text-3xl font-extrabold text-slate-900 mt-1">{value}</div>
        <p className={`text-xs font-medium ${subtextColor} mt-1`}>{subtext}</p>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200/60";
  if (status === 'In Progress') colorClass = "bg-amber-50 text-amber-700 border-amber-200/60";
  if (status === 'Assigned') colorClass = "bg-blue-50 text-blue-700 border-blue-200/60";
  if (status === 'Verified') colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200/60";
  if (status === 'Resolved') colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colorClass}`}>
      {status}
    </span>
  );
}
