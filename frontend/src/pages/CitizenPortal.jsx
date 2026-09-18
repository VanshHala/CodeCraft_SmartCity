import React, { useState } from 'react';
import { useCivicData, DEMO_CENTER } from '../context/CivicDataContext';
import MapView from '../components/MapView';
import VoiceIntakeModal from '../components/VoiceIntakeModal';
import {
  Camera, MapPin, Mic, Sparkles, CheckCircle2, AlertTriangle,
  Navigation, Award, Clock, ArrowRight, ChevronRight,
  Shield, TrendingUp, Star
} from 'lucide-react';

export default function CitizenPortal() {
  const { clusters, myReports, citizenProfile, submitReport } = useCivicData();
  const [activeSubTab, setActiveSubTab] = useState('report');

  // Report form state
  const [description, setDescription]   = useState('');
  const [issueType, setIssueType]        = useState('POTHOLE');
  const [photoUrl, setPhotoUrl]          = useState('');
  const [coords, setCoords]             = useState({ lat: 23.1292, lng: 72.5448 });
  const [isVoiceOpen, setIsVoiceOpen]   = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Route planner state
  const [routeMode, setRouteMode] = useState('fastest');

  const routeData = {
    fastest: {
      mode: 'fastest', distanceKm: 4.2, etaMinutes: 11,
      detourPercent: 0, flaggedStretchesAvoided: 0, safetyScore: 68,
      points: [[23.1287,72.5446],[23.1295,72.5452],[23.1310,72.5470],[23.1330,72.5490]]
    },
    safest: {
      mode: 'safest', distanceKm: 4.8, etaMinutes: 13,
      detourPercent: 14, flaggedStretchesAvoided: 2, safetyScore: 96,
      points: [[23.1287,72.5446],[23.1270,72.5420],[23.1290,72.5480],[23.1330,72.5490]]
    }
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSubmitStatus({ type: 'info', text: `GPS acquired: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}` });
        },
        () => setSubmitStatus({ type: 'warning', text: 'Location permission denied — using campus demo coordinates.' })
      );
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
    setIsAnalyzingAi(true);
    setTimeout(() => {
      setIsAnalyzingAi(false);
      setIssueType('POTHOLE');
      setSubmitStatus({ type: 'ai', text: 'Gemini Vision AI: Pothole detected · Severity 8/10 · Dept: Road Infrastructure' });
    }, 900);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await submitReport({
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      description, issueType, lat: coords.lat, lng: coords.lng
    });
    setSubmitStatus(res.mergedIntoExistingCluster
      ? { type: 'merged', text: `Duplicate detected — merged into Cluster #${res.clusterId} (${res.clusterReportCount} reports). Priority boosted.` }
      : { type: 'created', text: `New Cluster #${res.clusterId} created! +15 reward points added to your account.` }
    );
    setDescription('');
  };

  const tabs = [
    { id: 'report',  label: 'Report Issue',  icon: Camera },
    { id: 'map',     label: `My Reports (${myReports.length})`, icon: MapPin },
    { id: 'route',   label: 'Route Planner', icon: Navigation },
    { id: 'rewards', label: 'Leaderboard',   icon: Award },
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Citizen Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">Report issues, track resolution and find safe routes</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-sm font-semibold text-blue-700">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>AI-powered · Auto-deduplicated · Real-time tracked</span>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div className="tab-bar w-full sm:w-auto inline-flex">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSubTab(id)}
            className={`tab-item ${activeSubTab === id ? 'active' : ''}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ─── TAB: REPORT ─── */}
      {activeSubTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Form Card */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900">Submit a Civic Issue</h2>
                <p className="text-xs text-slate-500 mt-0.5">Auto-deduplication · AI classification · Instant priority scoring</p>
              </div>
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="btn-secondary text-xs"
              >
                <Mic className="w-3.5 h-3.5" />
                Voice Input
              </button>
            </div>

            {/* Status banner */}
            {submitStatus && (
              <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs font-medium ${
                submitStatus.type === 'merged'  ? 'bg-amber-50 border-amber-200 text-amber-800' :
                submitStatus.type === 'created' ? 'bg-green-50 border-green-200 text-green-800' :
                submitStatus.type === 'ai'      ? 'bg-blue-50 border-blue-200 text-blue-800' :
                'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  1 · Evidence Photo
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl transition-colors cursor-pointer overflow-hidden bg-slate-50">
                  <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {photoUrl ? (
                    <div className="relative">
                      <img src={photoUrl} alt="Preview" className="w-full h-40 object-cover" />
                      {isAnalyzingAi && (
                        <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center gap-2 text-white text-xs font-bold">
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Gemini AI analyzing image...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-sm font-semibold text-slate-700">Tap to capture or upload photo</div>
                      <div className="text-xs text-slate-400">Auto-analyzed by Gemini Vision AI</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  2 · Description
                </label>
                <textarea
                  rows={3}
                  placeholder="E.g., Large pothole near main gate causing vehicles to swerve dangerously..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  3 · Category (Gemini pre-filled)
                </label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="input-field">
                  <option value="POTHOLE">🕳️ Pothole / Road Damage</option>
                  <option value="STREETLIGHT">💡 Streetlight / Dark Patch</option>
                  <option value="WATER">💧 Water Leakage / Pipe Burst</option>
                  <option value="GARBAGE">🗑️ Waste / Garbage Overflow</option>
                  <option value="SAFETY">⚠️ Public Safety Hazard</option>
                  <option value="OTHER">📍 Other Infrastructure Issue</option>
                </select>
              </div>

              {/* GPS */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                </div>
                <button type="button" onClick={handleCaptureLocation} className="btn-ghost text-blue-600 text-xs">
                  Re-detect GPS
                </button>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Submit Civic Issue
              </button>
            </form>
          </div>

          {/* Map Preview */}
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Live GPS Pin Preview
              </span>
              <span className="badge badge-blue">Ward 4 — Campus Region</span>
            </div>
            <div className="flex-1 min-h-[380px]">
              <MapView clusters={clusters} center={[coords.lat, coords.lng]} />
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: MY REPORTS ─── */}
      {activeSubTab === 'map' && (
        <div className="space-y-5">
          <div className="card overflow-hidden" style={{ height: '480px' }}>
            <MapView clusters={clusters} showHeatmap />
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              My Submitted Issues
            </h3>
            <div className="space-y-3">
              {myReports.map((rep) => (
                <div key={rep.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 card-hover">
                  <img src={rep.photoUrl} alt="Report" className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{rep.issueType}</span>
                      {rep.mergedCount > 1 && (
                        <span className="badge badge-blue">{rep.mergedCount} reports merged</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{rep.description}</p>
                    <div className="text-[11px] text-slate-400">Submitted at {rep.createdAt}</div>
                  </div>
                  {/* Status pipeline */}
                  <div className="flex items-center gap-1 text-[10px] font-bold flex-wrap">
                    <span className="badge badge-green">1. Reported ✓</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="badge badge-blue">2. Verified</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="badge badge-amber">3. Assigned</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="badge badge-gray">4. Resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: ROUTE PLANNER ─── */}
      {activeSubTab === 'route' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 space-y-4">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900">Risk-Aware Route Planner</h2>
                <p className="text-xs text-slate-500 mt-0.5">Dijkstra/A* with risk-adjusted edge cost using live issue data</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Origin</label>
                  <input type="text" defaultValue="Nirma University Main Gate" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
                  <input type="text" defaultValue="SG Highway Junction" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { mode: 'fastest', label: '⚡ Fastest', sub: 'Direct path, ignores hazards', color: 'amber' },
                  { mode: 'safest',  label: '🛡️ Safest',  sub: 'Avoids high-severity issues', color: 'green' }
                ].map(({ mode, label, sub, color }) => (
                  <button
                    key={mode}
                    onClick={() => setRouteMode(mode)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      routeMode === mode
                        ? color === 'green'
                          ? 'border-green-400 bg-green-50 shadow-md shadow-green-100'
                          : 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`text-xs font-bold ${routeMode === mode ? (color === 'green' ? 'text-green-800' : 'text-amber-800') : 'text-slate-700'}`}>
                      {label}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${routeMode === mode ? (color === 'green' ? 'text-green-600' : 'text-amber-600') : 'text-slate-400'}`}>
                      {sub}
                    </div>
                  </button>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Distance', value: `${routeData[routeMode].distanceKm} km` },
                  { label: 'ETA', value: `${routeData[routeMode].etaMinutes} min` },
                  { label: 'Safety Index', value: `${routeData[routeMode].safetyScore}/100` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">{label}</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{value}</div>
                  </div>
                ))}
              </div>

              <div className={`p-3.5 rounded-xl border text-xs font-medium ${
                routeMode === 'safest'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                {routeMode === 'safest'
                  ? `✅ Detours +${routeData.safest.detourPercent}% (${(routeData.safest.distanceKm - routeData.fastest.distanceKm).toFixed(1)} km), avoiding ${routeData.safest.flaggedStretchesAvoided} active hazard stretch(es).`
                  : `⚠️ Fastest route passes through 1 active high-severity pothole cluster near campus gate.`
                }
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 card overflow-hidden" style={{ height: '480px' }}>
            <MapView clusters={clusters} routePath={routeData[routeMode]} />
          </div>
        </div>
      )}

      {/* ─── TAB: REWARDS ─── */}
      {activeSubTab === 'rewards' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Reward Points', value: citizenProfile.rewardPoints, sub: 'Eligible for tax rebate at 200 pts', icon: Award, color: 'amber' },
              { label: 'Reporter Trust Score', value: `${citizenProfile.trustScore}/1.0`, sub: '100% verified accuracy weight', icon: Shield, color: 'blue' },
              { label: 'Issues Resolved', value: `${citizenProfile.verifiedCount}/${citizenProfile.totalSubmitted}`, sub: 'Your contributed reports', icon: CheckCircle2, color: 'green' },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="stat-card flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  color === 'amber' ? 'bg-amber-100' :
                  color === 'blue'  ? 'bg-blue-100'  : 'bg-green-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    color === 'amber' ? 'text-amber-600' :
                    color === 'blue'  ? 'text-blue-600'  : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</div>
                  <div className="text-2xl font-display font-bold text-slate-900 mt-0.5">{value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="text-base font-display font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Civic Rank — {citizenProfile.rank}
            </h3>
            <p className="text-xs text-slate-500 mb-5">Earn points for each verified civic report to unlock higher tiers and municipal benefits.</p>

            <div className="space-y-3">
              {[
                { tier: 'Civic Observer (Tier 1)', pts: '0–50 pts',   done: true  },
                { tier: 'Civic Guardian (Tier 2)', pts: '51–200 pts', done: true  },
                { tier: 'Civic Champion (Tier 3)',  pts: '201–500 pts', done: false },
                { tier: 'Civic Hero (Tier 4)',      pts: '500+ pts',   done: false },
              ].map(({ tier, pts, done }) => (
                <div key={tier} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                  done ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      done ? 'bg-blue-600' : 'bg-slate-300'
                    }`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <span className="w-2 h-2 rounded-full bg-white block" />}
                    </div>
                    <span className={`text-sm font-semibold ${done ? 'text-blue-800' : 'text-slate-500'}`}>{tier}</span>
                  </div>
                  <span className="badge badge-blue">{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <VoiceIntakeModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptComplete={(text) => setDescription(text)}
      />
    </div>
  );
}
