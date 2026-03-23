import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Briefcase, User } from 'lucide-react';

const MainLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    { name: 'Assets', path: '/assets', icon: <Briefcase size={20} /> },
    {
      name: 'Marketplace',
      path: '/marketplace',
      icon: <ShoppingCart size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            AssetMgmt
          </h1>
        </div>
        <nav className="mt-4 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <span className="mr-3 opacity-80">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-end">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">Swapnil Singh</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-200 shadow-sm">
              <User size={20} />
            </div>
          </div>
        </header>
        <div className="p-8 pb-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
