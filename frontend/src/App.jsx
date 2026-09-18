import React from 'react';
import { CivicDataProvider, useCivicData } from './context/CivicDataContext';
import HeaderNavbar from './components/HeaderNavbar';
import AiCopilotWidget from './components/AiCopilotWidget';
import LoginPage from './pages/LoginPage';
import CitizenPortal from './pages/CitizenPortal';
import AuthorityDashboard from './pages/AuthorityDashboard';
import WorkerApp from './pages/WorkerApp';

function MainAppContent() {
  const { isAuthenticated, userRole } = useCivicData();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <HeaderNavbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="animate-fade-up">
          {userRole === 'CITIZEN'   && <CitizenPortal />}
          {userRole === 'AUTHORITY' && <AuthorityDashboard />}
          {userRole === 'WORKER'    && <WorkerApp />}
        </div>
      </main>

      <AiCopilotWidget />

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        CivicPulse &copy; 2026 &nbsp;·&nbsp; Technofora CodeCraft Hackathon &nbsp;·&nbsp;
        SmartCity Tech Track &nbsp;·&nbsp; Nirma University, Ahmedabad
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
