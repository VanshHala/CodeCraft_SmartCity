import React, { useState } from 'react';
import { useCivicData, DEMO_CENTER } from '../context/CivicDataContext';
import MapView from '../components/MapView';
import VoiceIntakeModal from '../components/VoiceIntakeModal';
import { 
  Camera, 
  MapPin, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Award, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Compass, 
  Flame, 
  Upload,
  ArrowRight
} from 'lucide-react';

export default function CitizenPortal() {
  const { 
    clusters, 
    myReports, 
    citizenProfile, 
    submitReport 
  } = useCivicData();

  const [activeSubTab, setActiveSubTab] = useState('report'); // report | map | route | rewards

  // Form State
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState('POTHOLE');
  const [photoUrl, setPhotoUrl] = useState('');
  const [coords, setCoords] = useState({ lat: 23.1292, lng: 72.5448 });
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Route Planner State
  const [routeMode, setRouteMode] = useState('fastest'); // fastest | safest
  const [routeOrigin, setRouteOrigin] = useState('Nirma University Main Gate');
  const [routeDest, setRouteDest] = useState('SG Highway Junction');

  // Simulated Route Data over Demo Area
  const routeData = {
    fastest: {
      mode: 'fastest',
      distanceKm: 4.2,
      etaMinutes: 11,
      detourPercent: 0,
      flaggedStretchesAvoided: 0,
      safetyScore: 68,
      points: [
        [23.1287, 72.5446],
        [23.1295, 72.5452], // passes near high priority pothole!
        [23.1310, 72.5470],
        [23.1330, 72.5490]
      ]
    },
    safest: {
      mode: 'safest',
      distanceKm: 4.8,
      etaMinutes: 13,
      detourPercent: 14,
      flaggedStretchesAvoided: 2,
      safetyScore: 96,
      points: [
        [23.1287, 72.5446],
        [23.1270, 72.5420], // detours around pothole via clear ward road
        [23.1290, 72.5480],
        [23.1330, 72.5490]
      ]
    }
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSubmitStatus({ type: 'info', text: `GPS Location acquired: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` });
        },
        () => {
          setSubmitStatus({ type: 'warning', text: 'Location permission denied. Using campus demo coordinates.' });
        }
      );
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate photo upload & Gemini AI classification trigger
      const mockUrl = URL.createObjectURL(file);
      setPhotoUrl(mockUrl);
      setIsAnalyzingAi(true);

      setTimeout(() => {
        setIsAnalyzingAi(false);
        // Gemini AI classification simulation
        setIssueType('POTHOLE');
        setSubmitStatus({ type: 'success', text: 'Gemini AI Vision analyzed photo: Pothole detected (Severity: 8/10, Dept: Road Work)' });
      }, 800);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords) {
      setSubmitStatus({ type: 'error', text: 'Please capture GPS location first.' });
      return;
    }

    const res = await submitReport({
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      description,
      issueType,
      lat: coords.lat,
      lng: coords.lng
    });

    if (res.mergedIntoExistingCluster) {
      setSubmitStatus({
        type: 'merged',
        text: `Duplicate detected! Your report merged with existing Issue #${res.clusterId} (${res.clusterReportCount} citizen reports combined). Priority score boosted to ${res.severity * res.clusterReportCount}.`
      });
    } else {
      setSubmitStatus({
        type: 'created',
        text: `Report submitted successfully! Created new tracked Issue Cluster #${res.clusterId}. +15 Reward Points added.`
      });
    }

    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveSubTab('report')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'report'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>

          <button
            onClick={() => setActiveSubTab('map')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'map'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Issue Map & My Reports ({myReports.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('route')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'route'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Risk-Aware Route Planner</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rewards')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'rewards'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: REPORT AN ISSUE */}
      {activeSubTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Side */}
          <div className="lg:col-span-6 space-y-5">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 font-display">Report a Civic Issue</h2>
                  <p className="text-xs text-slate-400">Captured reports are deduplicated & prioritized automatically</p>
                </div>
                
                {/* Voice Intake Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(true)}
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>AI Voice Input</span>
                </button>
              </div>

              {/* Status Alert */}
              {submitStatus && (
                <div className={`p-3.5 rounded-xl text-xs font-medium border flex items-start space-x-2.5 ${
                  submitStatus.type === 'merged' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                  submitStatus.type === 'created' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                  submitStatus.type === 'success' ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' :
                  'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
                  <div>{submitStatus.text}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    1. Capture / Upload Evidence Photo
                  </label>
                  <div className="relative border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-xl p-4 text-center bg-slate-900/60 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handlePhotoSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {photoUrl ? (
                      <div className="relative">
                        <img src={photoUrl} alt="Preview" className="w-full h-36 object-cover rounded-lg border border-slate-700" />
                        {isAnalyzingAi && (
                          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center rounded-lg text-teal-400 text-xs font-bold gap-2">
                            <Sparkles className="w-4 h-4 animate-spin" />
                            <span>Gemini Vision AI Extracting...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                        <div className="text-xs text-slate-300 font-semibold">Tap to take photo or drag file here</div>
                        <p className="text-[10px] text-slate-500">Supports JPG, PNG with auto GPS metadata</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Description / Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Deep pothole near main gate causing severe vehicle swerving..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Category Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    3. Category (Gemini AI Pre-filled)
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="POTHOLE">🕳️ Pothole / Road Damage</option>
                    <option value="STREETLIGHT">💡 Streetlight / Dark Patch</option>
                    <option value="WATER">💧 Water Leakage / Pipeline Rupture</option>
                    <option value="GARBAGE">🗑️ Waste / Dump Bin Overflow</option>
                    <option value="SAFETY">⚠️ Public Safety Hazard</option>
                    <option value="OTHER">📍 Other Infrastructure Defect</option>
                  </select>
                </div>

                {/* Location GPS capture button */}
                <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span>GPS: <strong>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCaptureLocation}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 px-3 py-1.5 rounded-lg font-semibold"
                  >
                    Re-detect GPS
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:opacity-95 text-slate-950 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-teal-950/50 transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Civic Issue</span>
                </button>
              </form>
            </div>
          </div>

          {/* Map Preview Side */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl h-[480px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>Live GPS Pin Preview</span>
                </span>
                <span className="text-[11px] text-slate-400">Ward 4 — Campus Region</span>
              </div>
              <div className="flex-1">
                <MapView 
                  clusters={clusters} 
                  center={[coords.lat, coords.lng]}
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: ISSUE MAP & MY REPORTS */}
      {activeSubTab === 'map' && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 h-[520px]">
            <MapView clusters={clusters} showHeatmap={true} />
          </div>

          {/* My Submitted Reports List */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>My Reported Issues Timeline</span>
            </h3>

            <div className="space-y-3">
              {myReports.map((rep) => (
                <div key={rep.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={rep.photoUrl} alt="Report" className="w-14 h-14 object-cover rounded-lg border border-slate-700" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-xs">{rep.issueType}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                          {rep.mergedCount > 1 ? `${rep.mergedCount} reports merged` : '1 report'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{rep.description}</p>
                      <span className="text-[10px] text-slate-500">Submitted at {rep.createdAt}</span>
                    </div>
                  </div>

                  {/* Status Pipeline Tracker */}
                  <div className="flex items-center space-x-1 sm:space-x-2 text-[10px]">
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-1 rounded-md font-bold">1. Reported</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-md font-bold">2. Verified</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-md font-bold">3. Assigned</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="bg-slate-800 text-slate-500 px-2 py-1 rounded-md font-bold">4. Resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RISK-AWARE ROUTE PLANNER */}
      {activeSubTab === 'route' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-display">Risk-Aware Route Planner</h3>
                <p className="text-xs text-slate-400">Same Dijkstra algorithm with swappable risk edge-cost function</p>
              </div>

              {/* Start & End Pickers */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Origin</label>
                  <input
                    type="text"
                    value={routeOrigin}
                    onChange={(e) => setRouteOrigin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Destination</label>
                  <input
                    type="text"
                    value={routeDest}
                    onChange={(e) => setRouteDest(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Toggle Buttons: Fastest vs Safest Route */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setRouteMode('fastest')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    routeMode === 'fastest'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider">⚡ Fastest Route</div>
                  <div className="text-[11px] opacity-80 mt-1">Direct path, ignores open defects</div>
                </button>

                <button
                  onClick={() => setRouteMode('safest')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    routeMode === 'safest'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider">🛡️ Safest Route</div>
                  <div className="text-[11px] opacity-80 mt-1">Detours around active hazards</div>
                </button>
              </div>

              {/* Route Metrics Summary Card */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Selected Mode:</span>
                  <span className={routeMode === 'safest' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {routeMode === 'safest' ? 'Safest Hazard-Free' : 'Fastest Shortest'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase">Distance & ETA</span>
                    <strong className="text-slate-100 text-sm">{routeData[routeMode].distanceKm} km</strong>
                    <span className="text-slate-400 text-xs ml-1">({routeData[routeMode].etaMinutes} mins)</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase">Route Safety Index</span>
                    <strong className="text-teal-400 text-sm">{routeData[routeMode].safetyScore} / 100</strong>
                  </div>
                </div>

                {routeMode === 'safest' ? (
                  <p className="text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                    🛡️ Safest route detours +{routeData.safest.detourPercent}% ({routeData.safest.distanceKm - routeData.fastest.distanceKm} km), avoiding {routeData.safest.flaggedStretchesAvoided} active high-severity pothole stretch.
                  </p>
                ) : (
                  <p className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    ⚠️ Fastest route passes through 1 active high-severity pothole area near SG Highway.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 h-[500px]">
              <MapView 
                clusters={clusters} 
                routePath={routeData[routeMode]}
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LEADERBOARD & REWARDS */}
      {activeSubTab === 'rewards' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-display">Citizen Leaderboard & Trust Tier</h3>
              <p className="text-xs text-slate-400">Verified reports boost your reporter trust weight in the deduplication engine</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Your Rewards: {citizenProfile.rewardPoints} Points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Reporter Trust Score</span>
              <div className="text-2xl font-extrabold text-teal-400">{citizenProfile.trustScore} / 1.0</div>
              <p className="text-[11px] text-slate-500 mt-1">100% verified accuracy weight</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Verified Contributions</span>
              <div className="text-2xl font-extrabold text-slate-100">{citizenProfile.verifiedCount} / {citizenProfile.totalSubmitted}</div>
              <p className="text-[11px] text-slate-500 mt-1">Civic issues resolved</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Current Tier Rank</span>
              <div className="text-lg font-extrabold text-amber-400">{citizenProfile.rank}</div>
              <p className="text-[11px] text-slate-500 mt-1">Eligible for property tax rebate</p>
            </div>
          </div>
        </div>
      )}

      {/* Voice Intake Modal */}
      <VoiceIntakeModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptComplete={(text) => setDescription(text)}
      />
    </div>
  );
}
