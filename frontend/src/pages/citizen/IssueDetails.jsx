import { ArrowLeft, Map as MapIcon, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { recentReports } from '../../data/mockData';
import { StatusBadge } from './Dashboard';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

export default function IssueDetails() {
  const { id } = useParams();
  const issue = recentReports.find(r => r.id === id) || recentReports[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Link to="/reports" className="flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800">
        <ArrowLeft size={16} /> Back to reports
      </Link>

      <div className="flex gap-6">
        <div className="w-2/3">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full">
            <div className="h-80 bg-slate-200 relative">
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow-sm text-sm font-bold text-slate-900">
                {issue.id}
              </div>
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                [Photo of {issue.type}]
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-1/3">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-semibold text-slate-400 tracking-wider">REPORT #{issue.id}</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> High
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{issue.type}</h1>
            <p className="text-slate-600 text-sm mb-8 flex-1">{issue.description}</p>
            
            <div className="grid grid-cols-2 gap-y-6 mb-8">
              <div>
                <div className="text-xs text-slate-500 mb-1">Reported</div>
                <div className="text-sm font-semibold text-slate-900">18 Sep 2026 · 9:42 AM</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Department</div>
                <div className="text-sm font-semibold text-slate-900">{issue.department}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Status</div>
                <StatusBadge status={issue.status} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
              <MapIcon className="text-slate-400 mt-0.5" size={20} />
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Location</div>
                <div className="text-sm font-medium text-slate-900">{issue.location}</div>
              </div>
              <button className="ml-auto text-slate-400 hover:text-slate-600">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-2/3">
          <div>
            <div className="text-xs font-semibold text-slate-400 tracking-wider mb-4 uppercase">Progress</div>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Resolution timeline</h3>
              <span className="text-sm text-slate-500">Last updated today</span>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="relative border-l-2 border-emerald-500 ml-4 space-y-10 py-2">
                <TimelineItem title="Report submitted" time="18 Sep · 9:42 AM" completed={true} />
                <TimelineItem title="AI classified" time="18 Sep 2026" completed={true} />
                <TimelineItem title="Department assigned" time="18 Sep 2026" completed={true} />
                <TimelineItem title="Worker assigned" time="18 Sep 2026" completed={true} />
                <TimelineItem title="Work in progress" time="Today · 11:08 AM" completed={true} />
                <TimelineItem title="Resolved" time="Awaiting completion" completed={false} isLast={true} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-4 uppercase">Assigned Worker</div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                RP
              </div>
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  Raj Patel <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-slate-500">Road maintenance · 2.1 km away</div>
              </div>
            </div>
            
            <button className="w-full border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 mb-4 transition-colors">
              Contact worker
            </button>
            
            <div className="h-32 rounded-lg border border-slate-200 overflow-hidden mb-4 relative">
              <MapContainer center={issue.coords} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <CircleMarker center={issue.coords} radius={6} pathOptions={{ color: 'white', weight: 2, fillColor: '#10b981', fillOpacity: 1 }} />
              </MapContainer>
            </div>
            
            <button className="w-full bg-emerald-50 text-emerald-700 rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
              <Send size={16} /> Open route in Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ title, time, completed, isLast = false }) {
  return (
    <div className="relative pl-8">
      <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${completed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        {completed && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
      </div>
      <div className="flex flex-col">
        <span className={`font-semibold text-sm ${completed ? 'text-slate-900' : 'text-slate-500'}`}>{title}</span>
        <span className="text-xs text-slate-500 mt-1">{time}</span>
      </div>
    </div>
  );
}
