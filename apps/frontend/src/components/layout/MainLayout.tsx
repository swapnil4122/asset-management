import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    }
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        isMobileOpen={isMobileOpen}
        toggleCollapse={toggleCollapse} 
      />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        } pl-0`}
      >
        <Navbar toggleMobileMenu={toggleCollapse} />
        
        <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-700">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer info (optional, but good for premium feel) */}
        <footer className="px-8 py-6 border-t border-background-card text-center text-text-secondary text-xs">
          &copy; 2026 AssetMgmt Platform. Secured by Blockchain Technology.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
