import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import PublicLayout from './components/PublicLayout';
import PublicRoute from './components/routes/PublicRoute';
import PrivateRoute from './components/routes/PrivateRoute';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const SchedulePage = lazy(() => import('./pages/public/SchedulePage'));
const AvailabilitySettings = lazy(() => import('./pages/dashboard/AvailabilitySettings'));
const ScheduleList = lazy(() => import('./pages/dashboard/ScheduleList'));
const SuccessPage = lazy(() => import('./pages/public/SuccessPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    }>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Auth routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard/agendamentos" replace />} />
          <Route path="agendamentos" element={<ScheduleList />} />
          <Route path="disponibilidade" element={<AvailabilitySettings />} />
        </Route>

        {/* Public scheduling routes */}
        <Route path="/agenda/:username" element={<PublicLayout />}>
          <Route index element={<SchedulePage />} />
          <Route path="sucesso" element={<SuccessPage />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;