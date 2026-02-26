import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import { storage } from '@/lib/storage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userProfile = storage.getUserProfile();
  
  if (!userProfile) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
