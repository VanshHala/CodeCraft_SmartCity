import React, { useState } from 'react';
import { useCivicData } from '../context/CivicDataContext';
import {
  Building2, User, ShieldCheck, HardHat, ArrowRight,
  Sparkles, Lock, Mail, Wrench, Droplet,
  Zap, Trash2, Layers
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
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
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
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
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
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-800',
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
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
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
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
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
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
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
      borderColor: 'border-slate-200',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-800',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">CivicPulse</span>
                <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                  SmartCity Tech
                </span>
              </div>
              <p className="text-xs text-slate-500">Nirma University · CodeCraft Hackathon '26</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>AI-Driven Multi-Department Issue Lifecycle & Priority Routing</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 z-10 flex-1 flex flex-col justify-center">

        {/* Hero title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
            Department-Wise Civic Operations Portal
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Select your role or department workspace to access real-time issue queues, risk maps, and field dispatch workflows.
          </p>
        </div>

        {/* Role Selector & Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Top: Interactive Login Form (5 cols) */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200">
            
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 font-display">Sign In to Your Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select access role and department to proceed</p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="tab-bar grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => { setActiveTab('CITIZEN'); setError(''); }}
                className={`tab-item flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'CITIZEN'
                    ? 'active bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('AUTHORITY'); setError(''); }}
                className={`tab-item flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'AUTHORITY'
                    ? 'active bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authority</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('WORKER'); setError(''); }}
                className={`tab-item flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'WORKER'
                    ? 'active bg-white text-blue-700 shadow-sm'
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
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Department Access View
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="input-field w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all"
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
                <label className="block text-xs font-medium text-slate-600 mb-1">
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
                    className="input-field w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all"
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
                className="btn-primary w-full justify-center text-sm font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 group mt-2"
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
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-display">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  1-Click Quick Demo Sign-In
                </h3>
                <p className="text-xs text-slate-500">Click any profile card below to test department views instantly</p>
              </div>
              <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
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
                    className="group bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${acc.color} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}>
                            {acc.avatar}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {acc.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 block font-mono truncate">
                              {acc.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${acc.bgColor} ${acc.borderColor} ${acc.textColor} flex items-center gap-1.5`}>
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          {acc.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {acc.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
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
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 z-10">
        CivicPulse &copy; 2026 &nbsp;·&nbsp; Technofora CodeCraft Hackathon &nbsp;·&nbsp; SmartCity Tech Track &nbsp;·&nbsp; Nirma University, Ahmedabad
      </footer>

    </div>
  );
}
