import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ComponentsPage from './pages/ComponentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LibraryPage from './pages/LibraryPage';
import AdvancedComponentsPage from './pages/AdvancedComponentsPage';
import DiscoverPage from './pages/DiscoverPage';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="components" element={<ComponentsPage />} />
          <Route path="components/advanced" element={<AdvancedComponentsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Placeholder routes for other links */}
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
