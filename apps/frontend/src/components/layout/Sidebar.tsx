import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Briefcase, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, toggleCollapse }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assets', path: '/assets', icon: Briefcase },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#111827] border-r border-[#1F2937] transition-all duration-300 z-[60] flex flex-col ${
        isMobileOpen ? 'w-[240px] translate-x-0' : 'w-[240px] -translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-background-card">
        <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center shrink-0">
          <ShieldCheck className="text-white" size={20} />
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-xl tracking-tight text-text-primary">
            AssetMgmt
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-accent-blue/10 text-accent-blue shadow-sm border border-accent-blue/20' 
                : 'text-text-secondary hover:bg-background-card hover:text-text-primary'
              }
            `}
          >
            <item.icon size={22} className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="fixed left-20 ml-2 px-2 py-1 bg-background-card text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/5">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-background-card space-y-2">
        <button 
          onClick={toggleCollapse}
          className="w-full flex lg:flex items-center px-3 py-2.5 rounded-xl text-text-secondary hover:bg-background-card hover:text-text-primary transition-all hidden"
        >
          {isCollapsed ? <ChevronRight size={22} className="mx-auto" /> : (
            <>
              <ChevronLeft size={22} className="mr-3" />
              <span className="font-medium text-sm">Collapse Sidebar</span>
            </>
          )}
        </button>
        {/* On mobile, this button should probably close the sidebar instead of collapsing */}
        <button 
          onClick={toggleCollapse}
          className="w-full flex lg:hidden items-center px-3 py-2.5 rounded-xl text-text-secondary hover:bg-background-card hover:text-text-primary transition-all"
        >
           <ChevronLeft size={22} className="mr-3" />
           <span className="font-medium text-sm">Close Menu</span>
        </button>
        <button className="w-full flex items-center px-3 py-2.5 rounded-xl text-accent-red hover:bg-accent-red/10 transition-all font-bold">
          <LogOut size={22} className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
