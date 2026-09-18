import React from 'react';
import { useCivicData } from '../context/CivicDataContext';
import { 
  Building2, 
  ShieldCheck, 
  HardHat, 
  User, 
  AlertTriangle, 
  Award,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function HeaderNavbar() {
  const { userRole, setUserRole, citizenProfile, weatherAlert } = useCivicData();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 shadow-xl">
      {/* Weather Hazard Alert Bar if Active */}
      {weatherAlert?.active && (
        <div className="bg-gradient-to-r from-amber-600/90 via-rose-600/90 to-amber-600/90 text-white text-xs px-4 py-1.5 font-medium flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 animate-bounce text-amber-200" />
            <span className="font-semibold tracking-wide uppercase bg-black/20 px-2 py-0.5 rounded text-[10px]">
              {weatherAlert.severity} ALERT
            </span>
            <span className="truncate">{weatherAlert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-400 p-0.5 shadow-glow-emerald flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent font-display">
                  CivicPulse
                </span>
                <span className="text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  SmartCity Tech
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Intelligent Civic Issue Lifecycle & Routing
              </p>
            </div>
          </div>

          {/* Role Switcher Controls */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setUserRole('CITIZEN')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                userRole === 'CITIZEN'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setUserRole('AUTHORITY')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                userRole === 'AUTHORITY'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authority Dashboard</span>
            </button>

            <button
              onClick={() => setUserRole('WORKER')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                userRole === 'WORKER'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Worker App</span>
            </button>
          </div>

          {/* Citizen Trust & Rewards Widget */}
          <div className="flex items-center space-x-3">
            {userRole === 'CITIZEN' && (
              <div className="flex items-center space-x-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{citizenProfile.rewardPoints} pts</span>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center space-x-1 text-xs text-teal-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trust: {citizenProfile.trustScore}</span>
                </div>
              </div>
            )}

            {/* User Profile Badge */}
            <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-teal-300">
                {userRole === 'CITIZEN' ? 'VH' : userRole === 'AUTHORITY' ? 'MC' : 'RK'}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline-block">
                {userRole === 'CITIZEN' ? 'Vansh Hala' : userRole === 'AUTHORITY' ? 'Mun. Comm. Officer' : 'Raj Kumar (Field Work)'}
              </span>
            </div>
          </div>

        </div>

        {/* Mobile Role Selector */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80">
          <button
            onClick={() => setUserRole('CITIZEN')}
            className={`text-xs px-3 py-1 rounded-md font-semibold ${userRole === 'CITIZEN' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}
          >
            Citizen
          </button>
          <button
            onClick={() => setUserRole('AUTHORITY')}
            className={`text-xs px-3 py-1 rounded-md font-semibold ${userRole === 'AUTHORITY' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Authority
          </button>
          <button
            onClick={() => setUserRole('WORKER')}
            className={`text-xs px-3 py-1 rounded-md font-semibold ${userRole === 'WORKER' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
          >
            Worker
          </button>
        </div>

      </div>
    </header>
  );
}
