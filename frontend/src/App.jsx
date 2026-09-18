import React from 'react';
import { CivicDataProvider, useCivicData } from './context/CivicDataContext';
import HeaderNavbar from './components/HeaderNavbar';
import AiCopilotWidget from './components/AiCopilotWidget';
import CitizenPortal from './pages/CitizenPortal';
import AuthorityDashboard from './pages/AuthorityDashboard';
import WorkerApp from './pages/WorkerApp';

function MainAppContent() {
  const { userRole } = useCivicData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header & Role Switcher */}
      <HeaderNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {userRole === 'CITIZEN' && <CitizenPortal />}
        {userRole === 'AUTHORITY' && <AuthorityDashboard />}
        {userRole === 'WORKER' && <WorkerApp />}
      </main>

      {/* Floating AI Civic Assistant */}
      <AiCopilotWidget />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>CivicPulse &copy; 2026 Technofora CodeCraft Hackathon · SmartCity Tech Track · Nirma University</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CivicDataProvider>
      <MainAppContent />
    </CivicDataProvider>
  );
}
