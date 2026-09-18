import { Link } from 'react-router-dom';
import { recentReports } from '../../data/mockData';
import { StatusBadge } from './Dashboard';

export default function MyReports() {
  // Only show reports given by user as per requirement
  const myReports = recentReports.filter(report => report.id === '1024' || report.id === '1022' || report.id === '1021');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Activity</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">My reports</h2>
          <p className="text-sm text-slate-500 mt-1">Track every issue you've raised with the city.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/report" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-civic-700 hover:bg-civic-800 text-white font-semibold text-sm shadow-sm shadow-civic-700/20 transition-all hover:shadow-md">
            <i className="ph-bold ph-plus text-base"></i>
            New report
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-white rounded-lg border border-slate-200/80 p-1 shadow-sm">
          <button className="px-4 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-md">All reports</button>
          <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition">In Progress</button>
          <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition">Resolved</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-60">
            <i className="ph ph-magnifying-glass text-xs absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input type="text" className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-sm" placeholder="Search my reports..." />
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5">
            <i className="ph ph-funnel text-xs"></i>
            Filter
          </button>
        </div>
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
              {myReports.map(report => (
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
              {myReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    You haven't submitted any reports yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
