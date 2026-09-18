import { Link } from 'react-router-dom';
import { recentReports } from '../../data/mockData';

export default function Tasks() {
  // Mock assigned tasks for the worker
  const myTasks = recentReports.filter(r => r.status === 'Assigned' || r.status === 'In Progress');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">FIELD OPERATIONS</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">Today's Tasks</h2>
          <p className="text-sm text-slate-500 mt-1">Your prioritized task list based on severity and distance.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No tasks assigned for today. Great job!
          </div>
        ) : (
          myTasks.map(task => (
            <div key={task.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 shadow-sm">
                    {task.type === 'Pothole' && <i className="ph-duotone ph-road text-2xl text-slate-600"></i>}
                    {task.type === 'Broken streetlight' && <i className="ph-duotone ph-lightbulb text-2xl text-amber-500"></i>}
                    {task.type === 'Waste collection' && <i className="ph-duotone ph-trash text-2xl text-emerald-600"></i>}
                    {task.type === 'Drainage problem' && <i className="ph-duotone ph-drop text-2xl text-teal-600"></i>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">{task.type}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${task.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {task.priority === 'High' ? '[HIGH] HIGH' : task.priority === 'Medium' ? '[MED] MEDIUM' : '[LOW] LOW'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <i className="ph-bold ph-map-pin"></i> {task.location}
                    </div>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <i className="ph-bold ph-navigation-arrow"></i> 2.4 km away (Est. 8 mins)
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${task.coords[0]},${task.coords[1]}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all text-center">
                    <i className="ph-bold ph-navigation-arrow text-base"></i> Navigate
                  </a>
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition-all text-center">
                    <i className="ph-bold ph-check-circle text-base"></i> Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
