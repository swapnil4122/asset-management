import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
// import { useAuth } from '../../hooks/useAuth';

const DashboardLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] flex">
      {/* Sidebar - Fixed Left */}
      <Sidebar 
        isCollapsed={false} 
        isMobileOpen={isMobileOpen}
        toggleCollapse={toggleMobileMenu} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px]">
        {/* Top Navbar - Sticky */}
        <Navbar toggleMobileMenu={toggleMobileMenu} />
        
        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-700">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-[#1F2937] text-center text-[#9CA3AF] text-xs">
          &copy; 2026 AssetMgmt Platform. Secured by Blockchain Technology.
        </footer>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
