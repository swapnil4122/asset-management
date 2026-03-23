import React, { useState } from 'react';
import { Bell, Search, Wallet, User, ChevronDown, LogOut, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { ThemeToggle } from '../ThemeToggle';

interface NavbarProps {
  toggleMobileMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const { connect, address, isConnected } = useWallet();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-16 sticky top-4 mx-6 bg-background-primary/80 backdrop-blur-md border border-background-card z-40 px-6 flex items-center justify-between rounded-2xl shadow-lg transition-all duration-300">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleMobileMenu}
        className="mr-4 p-2 text-text-secondary hover:text-text-primary hover:bg-background-card rounded-xl lg:hidden transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Search Bar */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
        <input 
          type="text" 
          placeholder="Search assets, transactions..." 
          className="w-full bg-background-secondary border border-background-card rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Wallet Connect Button */}
        <button 
          onClick={() => !isConnected && connect()}
          className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all group border ${
            isConnected 
              ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' 
              : 'bg-background-card border-background-card hover:border-accent-blue/30 text-text-primary hover:bg-accent-blue/10'
          }`}
        >
          <Wallet size={18} className={`mr-2 ${isConnected ? 'text-accent-green' : 'text-accent-blue'}`} />
          <span>{isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-card rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-red rounded-full border-2 border-background-primary"></span>
        </button>

        {/* User Profile */}
        <div className="relative pl-2 border-l border-background-card">
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center cursor-pointer group"
          >
            <div className="text-right mr-3 hidden sm:block">
              <p className="text-sm font-bold text-text-primary leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                {user?.role || 'Guest'}
              </p>
            </div>
            <div className="w-9 h-9 bg-background-card rounded-xl flex items-center justify-center border border-white/5 overflow-hidden ring-2 ring-transparent group-hover:ring-accent-blue/30 transition-all duration-300">
               <User size={20} className="text-text-secondary" />
            </div>
            <ChevronDown size={14} className={`ml-1 text-text-secondary group-hover:text-text-primary transition-all ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsUserMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-48 bg-background-secondary border border-background-card rounded-2xl shadow-2xl p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-card rounded-xl transition-all">
                  <User size={16} className="mr-3" />
                  Profile
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-card rounded-xl transition-all">
                  <Settings size={16} className="mr-3" />
                  Settings
                </button>
                <div className="h-px bg-background-card my-2"></div>
                <button 
                  onClick={() => { logout(); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center px-3 py-2 text-sm text-accent-red hover:bg-accent-red/10 rounded-xl transition-all"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
