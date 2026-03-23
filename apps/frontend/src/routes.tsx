import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Assets from './pages/Assets';
import Login from './pages/Login';
import AssetRegistration from './pages/CreateAsset';
import AssetDetail from './pages/AssetDetail';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'assets', element: <Assets /> },
      { path: 'assets/new', element: <AssetRegistration /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'marketplace/:id', element: <AssetDetail /> },
    ],
  },
]);
