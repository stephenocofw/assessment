import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { InitialReportForm } from './components/forms/InitialReportForm';
import { InvestigationForm } from './components/forms/InvestigationForm';
import { InvestigationList } from './components/InvestigationList';
import { Settings } from './components/Settings';
import { MarketingPage } from './components/MarketingPage';
import { TrendsPage } from './components/analytics/TrendsPage';

function App() {
  return (
    <IncidentProvider>
      <Router>
        <Routes>
          {/* Public Marketing Route */}
          <Route path="/welcome" element={<MarketingPage />} />

          {/* Protected/Dashboard Routes */}
          <Route element={
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<InitialReportForm />} />
            <Route path="/investigations" element={<InvestigationList />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/investigations/:id" element={<InvestigationForm />} />
          </Route>
        </Routes>
      </Router>
    </IncidentProvider>
  );
}

export default App;
