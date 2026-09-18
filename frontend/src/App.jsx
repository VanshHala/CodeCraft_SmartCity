import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyReports from './pages/citizen/MyReports';
import IssueDetails from './pages/citizen/IssueDetails';
import AuthorityOverview from './pages/authority/Overview';
import AuthorityAnalytics from './pages/authority/Analytics';
import WorkerTasks from './pages/worker/Tasks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout role="citizen" />}>
          <Route path="/" element={<CitizenDashboard />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/reports" element={<MyReports />} />
          <Route path="/reports/:id" element={<IssueDetails />} />
        </Route>
        
        <Route element={<AppLayout role="authority" />}>
          <Route path="/operations" element={<AuthorityOverview />} />
          <Route path="/operations/analytics" element={<AuthorityAnalytics />} />
        </Route>

        <Route element={<AppLayout role="worker" />}>
          <Route path="/worker" element={<WorkerTasks />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
