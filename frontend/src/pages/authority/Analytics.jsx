import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const categoryData = [
  { name: 'Roads', value: 82 },
  { name: 'Lighting', value: 64 },
  { name: 'Waste', value: 54 },
  { name: 'Drainage', value: 39 },
  { name: 'Safety', value: 27 },
];

const priorityData = [
  { name: 'High', value: 19, color: '#0f766e' }, // dark emerald
  { name: 'Medium', value: 46, color: '#eab308' }, // yellow
  { name: 'Low', value: 35, color: '#d1fae5' }, // light emerald
];

const timeData = [
  { day: 'Aug 21', time: 1.8 },
  { day: 'Aug 28', time: 2.1 },
  { day: 'Sep 04', time: 1.5 },
  { day: 'Sep 11', time: 3.2 },
  { day: 'Sep 18', time: 4.5 },
];

export default function Analytics() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">City Performance</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h2>
          <p className="text-slate-500">Patterns that help teams act before problems grow.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          Last 30 days ▼
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Volume</div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Issues by category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Mix</div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Issues by priority</h3>
          <div className="flex items-center justify-center h-64">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900">1,284</span>
                <span className="text-xs text-slate-400">total</span>
              </div>
            </div>
            <div className="w-1/2 space-y-4">
              {priorityData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Average Days</div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Resolution time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={val => `${val}d`} />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">Resolution Rate</div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Department performance</h3>
          <div className="space-y-6">
            <ProgressBar label="Road & Infrastructure" percentage={84} />
            <ProgressBar label="Public Lighting" percentage={78} />
            <ProgressBar label="Sanitation" percentage={73} />
            <ProgressBar label="Water & Drainage" percentage={61} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-900 font-bold">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className="bg-emerald-700 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
