import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import {
  Building2, User, ShieldCheck, HardHat, ArrowRight,
  Sparkles, CheckCircle2, Lock, Mail, Wrench, Droplet,
  Zap, Trash2, MapPin, Layers, Award
} from 'lucide-react';

export default function LoginPage() {
  const { loginUser } = useCivicData();
  const [activeTab, setActiveTab] = useState('AUTHORITY'); // CITIZEN | AUTHORITY | WORKER
  const [department, setDepartment] = useState('ROAD');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Preset demo credentials for quick 1-click testing
  const demoAccounts = [
    {
      role: 'CITIZEN',
      name: 'Vansh Hala',
      email: 'vansh@nirmauni.ac.in',
      badge: 'Civic Guardian (Tier 2)',
      department: 'GENERAL',
      avatar: 'VH',
      icon: User,
      color: 'from-blue-600 to-indigo-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50/50',
      description: 'Report civic issues, track AI resolution timeline & earn reward points.'
    },
    {
      role: 'AUTHORITY',
      name: 'Eng. Rajesh Verma',
      email: 'roads.dept@amc.gov.in',
      badge: 'Roads & Highways Dept Lead',
      department: 'ROAD',
      avatar: 'RV',
      icon: Wrench,
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/50',
      description: 'Manage pothole, road damage queues & auto-assign field maintenance teams.'
    },
    {
      role: 'AUTHORITY',
      name: 'Eng. Priya Sharma',
      email: 'water.dept@amc.gov.in',
      badge: 'Water Supply & Drainage Dept',
      department: 'WATER',
      avatar: 'PS',
      icon: Droplet,
      color: 'from-cyan-600 to-blue-600',
      borderColor: 'border-cyan-200',
      bgColor: 'bg-cyan-50/50',
      description: 'Monitor water leaks, drainage blockages & monsoon waterlogging alerts.'
    },
    {
      role: 'AUTHORITY',
      name: 'Anil Mehta',
      email: 'electrical.dept@amc.gov.in',
      badge: 'Electrical & Streetlights Dept',
      department: 'ELECTRICAL',
      avatar: 'AM',
      icon: Zap,
      color: 'from-yellow-600 to-amber-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50/50',
      description: 'Oversee streetlight outages, dark zone reports & power grid hazards.'
    },
    {
      role: 'AUTHORITY',
      name: 'Sunita Devi',
      email: 'sanitation.dept@amc.gov.in',
      badge: 'Sanitation & Waste Mgmt',
      department: 'SANITATION',
      avatar: 'SD',
      icon: Trash2,
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/50',
      description: 'Dispatch dump trucks, clean illegal garbage hubs & track cleanliness KPIs.'
    },
    {
      role: 'AUTHORITY',
      name: 'Dr. A.K. Vyas',
      email: 'commissioner@amc.gov.in',
      badge: 'Municipal Commissioner (All Depts)',
      department: 'ALL',
      avatar: 'AV',
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-700',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50/50',
      description: 'Full city-wide command dashboard with AI duplicate clustering & heatmaps.'
    },
    {
      role: 'WORKER',
      name: 'Raj Kumar',
      email: 'worker.raj@civicpulse.org',
      badge: 'Road Technician (Field ID #101)',
      department: 'ROAD',
      workerId: 1,
      avatar: 'RK',
      icon: HardHat,
      color: 'from-slate-700 to-slate-900',
      borderColor: 'border-slate-300',
      bgColor: 'bg-slate-50',
      description: 'Mobile field app: view assigned repair tasks, risk route & submit proof.'
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email or phone number.');
      return;
    }
    setError('');

    let assignedDept = 'GENERAL';
    let badgeText = 'Verified User';

    if (activeTab === 'AUTHORITY') {
      assignedDept = department;
      badgeText = department === 'ALL' ? 'Municipal Command Center' : `${department} Department Official`;
    } else if (activeTab === 'WORKER') {
      assignedDept = department;
      badgeText = 'Field Service Technician';
    } else {
      badgeText = 'Verified Citizen';
    }

    loginUser({
      email,
      password: password || 'demo123',
      role: activeTab,
      department: assignedDept,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      badge: badgeText
    });
  };

  const handleQuickDemoLogin = (account) => {
    loginUser({
      email: account.email,
      password: 'demo_password',
      role: account.role,
      department: account.department,
      name: account.name,
      badge: account.badge,
      avatar: account.avatar,
      workerId: account.workerId
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-display">CivicPulse</span>
                <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  SmartCity Platform
                </span>
              </div>
              <p className="text-xs text-slate-400">Nirma University · CodeCraft Hackathon '26</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Driven Civic Issue Clustering & Department Allocation</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 py-10 z-10 flex-1 flex flex-col justify-center">

        {/* Hero title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-display">
            Multi-Department Civic Operations Portal
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Role-based authenticated access for Citizens, Department Authorities (Roads, Water, Electrical, Sanitation), and Field Technicians.
          </p>
        </div>

        {/* Role Selector & Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Top: Interactive Login Form (5 cols) */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Sign In to Your Workspace</h2>
              <p className="text-xs text-slate-500 mt-1">Select your role and department to proceed</p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('CITIZEN'); setError(''); }}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'CITIZEN'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('AUTHORITY'); setError(''); }}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'AUTHORITY'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authority</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('WORKER'); setError(''); }}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'WORKER'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HardHat className="w-4 h-4" />
                <span>Worker</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Department Dropdown (only for Authority or Worker) */}
              {(activeTab === 'AUTHORITY' || activeTab === 'WORKER') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department Access View
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  >
                    <option value="ROAD">🛣️ Roads & Infrastructure Department</option>
                    <option value="WATER">💧 Water Supply & Drainage Department</option>
                    <option value="ELECTRICAL">⚡ Electrical & Streetlighting Department</option>
                    <option value="SANITATION">🧹 Sanitation & Waste Management</option>
                    {activeTab === 'AUTHORITY' && (
                      <option value="ALL">🏛️ Municipal Command Center (All Departments)</option>
                    )}
                  </select>
                </div>
              )}

              {/* Email / ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activeTab === 'WORKER' ? 'Worker ID / Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'CITIZEN' ? 'vansh@nirmauni.ac.in' :
                      activeTab === 'AUTHORITY' ? 'roads.dept@amc.gov.in' : 'worker.raj@civicpulse.org'
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group mt-2"
              >
                <span>Log In to {activeTab === 'CITIZEN' ? 'Citizen Portal' : activeTab === 'AUTHORITY' ? `${department} Department` : 'Worker App'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Right: Quick 1-Click Demo Accounts (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Quick 1-Click Demo Sign-In
                </h3>
                <p className="text-xs text-slate-400">Click any role to test department-wise access instantly</p>
              </div>
              <span className="text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2.5 py-1 rounded-full">
                Hackathon Demo Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {demoAccounts.map((acc, index) => {
                const IconComponent = acc.icon;
                return (
                  <div
                    key={index}
                    onClick={() => handleQuickDemoLogin(acc)}
                    className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${acc.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                            {acc.avatar}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                              {acc.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {acc.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.bgColor} ${acc.borderColor} text-slate-200 flex items-center gap-1`}>
                          <IconComponent className="w-3 h-3 shrink-0 text-amber-400" />
                          {acc.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {acc.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-semibold text-blue-400 group-hover:text-blue-300">
                      <span>Sign in as {acc.role === 'AUTHORITY' ? acc.department : acc.role}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500 z-10">
        CivicPulse &copy; 2026 &nbsp;·&nbsp; Technofora CodeCraft Hackathon &nbsp;·&nbsp; SmartCity Tech Track &nbsp;·&nbsp; Nirma University
      </footer>

    </div>
  );
}
