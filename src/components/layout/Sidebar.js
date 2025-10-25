import React, { useState, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Boxes,
  Users,
  UserPlus,
  Warehouse,
  Truck,
  FileText,
  LogOut,
  ChevronLeft,
  Menu,
  Sun,
  Moon,
  FileInput,
} from 'lucide-react';

// --- Helper function to get initials ---
const getInitials = (name = '') => {
    const words = name.split(/[\s_-]/).filter(Boolean);
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

// --- SidebarItem Component ---
const SidebarItem = ({ to, icon: Icon, children, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center h-12 px-3 my-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors duration-200 ${
        isActive ? 'bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary' : ''
      } ${isCollapsed ? 'justify-center' : ''}`
    }
  >
    <Icon size={22} className="flex-shrink-0" />
    <span className={`ml-4 text-sm font-medium whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
      {children}
    </span>
  </NavLink>
);

// --- Profile Popover Component ---
const ProfilePopover = ({ user, logout, isCollapsed }) => {
    const popoverClasses = isCollapsed
        ? 'absolute bottom-0 left-full ml-4' // Positioned to the right for collapsed
        : 'absolute bottom-full mb-2 left-0 w-full'; // Positioned on top for expanded

    return (
        <div 
            className={`z-50 w-60 bg-foreground dark:bg-dark-border rounded-lg shadow-xl p-3
                       transition-all duration-300 ease-in-out
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                       ${popoverClasses}`}
        >
            <div className="flex items-center p-2">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                    {getInitials(user.username)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold text-text dark:text-dark-text truncate">{user.username}</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary capitalize">{user.role}</p>
                </div>
            </div>
            <hr className="my-2 border-border dark:border-dark-border/50" />
            <button
                onClick={logout}
                className="w-full flex items-center p-2 rounded-md text-red-500 hover:bg-red-500/10"
            >
                <LogOut size={18} className="mr-2" />
                <span className="text-sm font-medium">Logout</span>
            </button>
        </div>
    );
};

// --- Main Sidebar Component ---
const Sidebar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard", roles: ['admin', 'dubai-staff', 'india-staff', 'salesman', 'labor', 'accountant'] },
    { to: "/tiles", icon: Boxes, text: "Tiles", roles: ['admin', 'dubai-staff', 'india-staff'] },
    { to: "/parties", icon: Users, text: "Parties", roles: ['admin', 'dubai-staff', 'salesman'] },
    { to: "/salesmen", icon: UserPlus, text: "Salesmen", roles: ['admin'] },
    { to: "/bookings", icon: FileText, text: "Bookings", roles: ['admin', 'dubai-staff', 'salesman'] },
    { 
      to: "/dispatches/process", 
      icon: FileInput, // New icon for clarity
      text: "Process Notes", 
      roles: ['admin', 'dubai-staff'] 
    },
    { 
      to: "/dispatches", 
      icon: Truck, 
      text: "All Dispatches", 
      roles: ['admin', 'dubai-staff'] 
    },    { to: "/restocks", icon: Warehouse, text: "Restocks", roles: ['admin', 'dubai-staff', 'india-staff'] },
  ];

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* --- Header with Logo and Toggle Button --- */}
      <div className="flex items-center h-20 px-4 border-b border-border dark:border-dark-border">
        {!isCollapsed && !isMobile && (
          <Link to="/" className="text-2xl font-bold text-primary dark:text-dark-primary">
            Mega Dubai
          </Link>
        )}
        <button
          onClick={() => (isMobile ? setMobileOpen(false) : setIsCollapsed(!isCollapsed))}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-border ml-auto"
        >
          {isMobile ? <ChevronLeft size={24} /> : isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* --- Role-Based Navigation --- */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item) => 
          item.roles.includes(user?.role) && (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              isCollapsed={isCollapsed && !isMobile}
            >
              {item.text}
            </SidebarItem>
          )
        )}
      </nav>

      {/* --- Footer with Theme Toggle and User Profile --- */}
      <div className="px-2 py-3 border-t border-border dark:border-dark-border">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center h-12 px-3 my-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-border ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
        >
          {theme === 'light' ? <Sun size={22} /> : <Moon size={22} />}
          {(!isCollapsed || isMobile) && <span className="ml-4 text-sm font-medium">Theme</span>}
        </button>

        {user && (
          <div className="relative group">
            <div className={`flex items-center mt-2 p-2 rounded-lg cursor-pointer`}>
              <div className="h-10 w-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-bold text-white">
                {getInitials(user.username)}
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text dark:text-dark-text truncate">{user.username}</p>
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary capitalize">{user.role}</p>
                </div>
              )}
            </div>
            <ProfilePopover user={user} logout={logout} isCollapsed={isCollapsed && !isMobile} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`bg-foreground dark:bg-dark-foreground flex-col h-screen sticky top-0 hidden lg:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent(false)}
      </aside>
      
      {/* Mobile Header & Sidebar */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-foreground dark:bg-dark-foreground border-b border-border dark:border-dark-border sticky top-0 z-30">
        <Link to="/" className="text-xl font-bold text-primary dark:text-dark-primary">Mega Dubai</Link>
        <button onClick={() => setMobileOpen(true)} className="p-2"><Menu size={24} /></button>
      </header>
      {isMobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-foreground dark:bg-dark-foreground flex flex-col transition-transform duration-300 z-50 lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent(true)}
      </aside>
    </>
  );
};

export default Sidebar;
