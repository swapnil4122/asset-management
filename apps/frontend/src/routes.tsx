import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Assets from './pages/Assets';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'assets', element: <Assets /> },
      { path: 'marketplace', element: <Marketplace /> },
    ],
  },
]);
