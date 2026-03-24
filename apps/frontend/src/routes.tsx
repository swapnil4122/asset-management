import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Assets from './pages/Assets';
import Login from './pages/Login';
import Register from './pages/Register';
import AssetRegistration from './pages/CreateAsset';
import AssetDetail from './pages/AssetDetail';
import VerifierDashboard from './pages/VerifierDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Onboarding from './pages/Onboarding';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export const router = createBrowserRouter([
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/success',


    element: <GoogleCallback />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/onboarding',
    element: <ProtectedRoute requireOnboarding={false} />,
    children: [
      { path: '', element: <Onboarding /> },
    ],
  },

  {
    path: '/',
    element: <ProtectedRoute requireOnboarding={true} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'assets', element: <Assets /> },
          { path: 'assets/new', element: <AssetRegistration /> },
          { path: 'marketplace', element: <Marketplace /> },
          { path: 'marketplace/:id', element: <AssetDetail /> },
          { path: 'verifier', element: <VerifierDashboard /> },
        ],
      },
    ],
  },
]);

