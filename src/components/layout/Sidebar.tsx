
import React from 'react';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
  onNavigation?: (path: string) => void;
}

/**
 * Sidebar Component
 * 
 * A navigation sidebar for the dashboard
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  className = "", 
  children,
  onNavigation 
}) => {
  return (
    <div className={`hidden md:flex flex-col h-screen bg-white border-r ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Athlete Genesis AI</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {children || (
          <ul className="space-y-1">
            <SidebarItem icon="home" href="/dashboard" label="Dashboard" onNavigation={onNavigation} />
            <SidebarItem icon="activity" href="/dashboard/training-plans" label="Training Plans" onNavigation={onNavigation} />
            <SidebarItem icon="chart" href="/dashboard/analytics" label="Analytics" onNavigation={onNavigation} />
            <SidebarItem icon="users" href="/dashboard/team" label="Team" onNavigation={onNavigation} />
            <SidebarItem icon="settings" href="/dashboard/settings" label="Settings" onNavigation={onNavigation} />
          </ul>
        )}
      </nav>
      <div className="p-4 border-t">
        <div className="text-xs text-gray-500">
          <p>Athlete Genesis AI v1.0</p>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
  onNavigation?: (path: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, onNavigation }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigation) {
      onNavigation(href);
    }
  };

  return (
    <li>
      <a 
        href={href} 
        className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100"
        onClick={handleClick}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </a>
    </li>
  );
};
