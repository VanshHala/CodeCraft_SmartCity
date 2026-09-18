import { Camera, Image as ImageIcon } from 'lucide-react';

export default function ReportIssue() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-12">
        <div className="text-xs font-semibold text-slate-400 tracking-wider mb-2 uppercase">New Report</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tell us what needs attention.</h2>
        <div className="flex justify-between items-center">
          <p className="text-slate-500">Your report helps city teams respond faster and keep the neighborhood moving.</p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Draft saved
          </div>
        </div>
      </div>

      <div className="flex justify-between relative mb-12">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
        <Step number="1" label="Capture issue" active={true} />
        <Step number="2" label="Location" active={false} />
        <Step number="3" label="Description" active={false} />
        <Step number="4" label="Review" active={false} />
        <Step number="5" label="Submitted" active={false} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs font-semibold text-slate-400 tracking-wider mb-1">STEP 1 OF 4</div>
            <h3 className="text-2xl font-bold text-slate-900">Capture the issue</h3>
            <p className="text-slate-500 mt-1">A clear photo helps our team understand and route your report.</p>
          </div>
          <Camera className="text-emerald-700 bg-emerald-50 p-2 rounded-lg" size={40} />
        </div>

        <div className="border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30 flex flex-col items-center justify-center py-16 mb-8">
          <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-4">
            <ImageIcon size={24} />
          </div>
          <div className="text-slate-900 font-semibold mb-1">Take a photo or upload an image</div>
          <div className="text-slate-500 text-sm mb-6">JPG or PNG · Max 10 MB</div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
              <Camera size={16} /> Camera
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
              <ImageIcon size={16} /> Choose file
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Save draft
          </button>
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm opacity-50 cursor-not-allowed">
            Continue <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ number, label, active }) {
  return (
    <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm bg-white
        ${active ? 'border-emerald-600 text-emerald-600' : 'border-slate-200 text-slate-400'}`}>
        {number}
      </div>
      <span className={`text-xs font-semibold ${active ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}
