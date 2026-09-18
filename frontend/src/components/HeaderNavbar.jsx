import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import {
  Building2, ShieldCheck, HardHat, User,
  AlertTriangle, Award, Sparkles, Bell, ChevronDown,
  LogOut, Layers, Wrench, Droplet, Zap, Trash2, Filter
} from 'lucide-react';

export default function HeaderNavbar() {
  const {
    userRole,
    setUserRole,
    currentUser,
    logoutUser,
    selectedDepartment,
    setSelectedDepartment,
    citizenProfile,
    weatherAlert
  } = useCivicData();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const departments = [
    { id: 'ALL', label: '🏛️ Command Center (All)', badge: 'ALL' },
    { id: 'ROAD', label: '🛣️ Roads & Infrastructure', badge: 'ROAD' },
    { id: 'WATER', label: '💧 Water & Drainage', badge: 'WATER' },
    { id: 'ELECTRICAL', label: '⚡ Electrical & Lights', badge: 'ELECTRICAL' },
    { id: 'SANITATION', label: '🧹 Sanitation & Waste', badge: 'SANITATION' },
  ];

  const getDeptIcon = (dept) => {
    switch (dept) {
      case 'ROAD': return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
      case 'WATER': return <Droplet className="w-3.5 h-3.5 text-blue-500" />;
      case 'ELECTRICAL': return <Zap className="w-3.5 h-3.5 text-yellow-500" />;
      case 'SANITATION': return <Trash2 className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Building2 className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm font-sans">

      {/* Weather hazard strip */}
      {weatherAlert?.active && (
        <div className="bg-amber-500 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-bold bg-amber-700/40 px-2 py-0.5 rounded text-[11px]">
            {weatherAlert.severity} Alert
          </span>
          <span className="truncate">{weatherAlert.message}</span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[1.15rem] font-bold text-slate-900 tracking-tight font-display">
                  CivicPulse
                </span>
                <span className="hidden sm:inline text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                  SmartCity Tech
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                Multi-Department Civic Lifecycle
              </p>
            </div>
          </div>

          {/* Department / Role Selector Bar */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* If Authority, show Department Filter dropdown */}
            {userRole === 'AUTHORITY' && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600 pl-2 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-slate-400" />
                  Dept:
                </span>
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedDepartment === dept.id
                        ? 'bg-white text-blue-700 font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dept.label.split(' ')[0]} {dept.badge}
                  </button>
                ))}
              </div>
            )}

            {/* Role Tab Navigation */}
            <nav className="tab-bar ml-2">
              <button
                id="role-citizen"
                onClick={() => setUserRole('CITIZEN')}
                className={`tab-item ${userRole === 'CITIZEN' ? 'active' : ''}`}
              >
                <User className="w-3.5 h-3.5" />
                Citizen Portal
              </button>
              <button
                id="role-authority"
                onClick={() => setUserRole('AUTHORITY')}
                className={`tab-item ${userRole === 'AUTHORITY' ? 'active' : ''}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Authority Dashboard
              </button>
              <button
                id="role-worker"
                onClick={() => setUserRole('WORKER')}
                className={`tab-item ${userRole === 'WORKER' ? 'active' : ''}`}
              >
                <HardHat className="w-3.5 h-3.5" />
                Worker App
              </button>
            </nav>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            
            {/* Reward Points (citizen only) */}
            {userRole === 'CITIZEN' && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-700">{citizenProfile.rewardPoints} pts</span>
              </div>
            )}

            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            {/* User Account & Logout Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {currentUser?.avatar || (userRole === 'CITIZEN' ? 'VH' : userRole === 'AUTHORITY' ? 'MC' : 'RK')}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser?.name || (userRole === 'CITIZEN' ? 'Vansh Hala' : userRole === 'AUTHORITY' ? 'Commissioner' : 'Raj Kumar')}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight font-medium flex items-center gap-1">
                    {userRole === 'AUTHORITY' && getDeptIcon(selectedDepartment)}
                    {currentUser?.badge || (userRole === 'AUTHORITY' ? `${selectedDepartment} Dept` : userRole)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser?.name || 'Logged User'}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.email || 'user@civicpulse.org'}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                      {currentUser?.badge || userRole}
                    </span>
                  </div>

                  {userRole === 'AUTHORITY' && (
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Switch Department View:</p>
                      <div className="space-y-1">
                        {departments.map((dept) => (
                          <button
                            key={dept.id}
                            onClick={() => {
                              setSelectedDepartment(dept.id);
                              setShowUserMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between ${
                              selectedDepartment === dept.id
                                ? 'bg-blue-50 text-blue-700 font-bold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span>{dept.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logoutUser();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out & Switch Role
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile department & role nav */}
        <div className="md:hidden flex flex-col border-t border-slate-100 py-2 gap-2">
          {userRole === 'AUTHORITY' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${
                    selectedDepartment === dept.id ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {dept.badge}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-1">
            {[
              { role: 'CITIZEN', label: 'Citizen', icon: User },
              { role: 'AUTHORITY', label: 'Authority', icon: ShieldCheck },
              { role: 'WORKER', label: 'Worker', icon: HardHat },
            ].map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userRole === role
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
