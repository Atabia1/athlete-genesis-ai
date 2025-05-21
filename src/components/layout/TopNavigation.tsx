
import React from 'react';

interface TopNavigationProps {
  onMenuClick: () => void;
  children?: React.ReactNode;
}

/**
 * Top Navigation Component
 * 
 * The main navigation bar at the top of the dashboard
 */
export const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuClick, children }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center">
        <button 
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
        <div className="hidden md:flex md:items-center md:gap-4 md:px-6">
          <nav className="flex items-center space-x-4">
            <a 
              href="/dashboard" 
              className="text-sm font-medium hover:text-gray-900"
            >
              Dashboard
            </a>
            <a 
              href="/dashboard/training-plans" 
              className="text-sm font-medium hover:text-gray-900"
            >
              Training Plans
            </a>
          </nav>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </header>
  );
};
