import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BarChart, 
  Calendar, 
  Dumbbell, 
  Heart, 
  Settings, 
  User, 
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

const MainSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/today', label: 'Today', icon: Calendar },
    { path: '/workouts', label: 'Workouts', icon: Dumbbell },
    { path: '/nutrition', label: 'Nutrition', icon: Heart },
    { path: '/performance', label: 'Performance', icon: BarChart },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings, badge: 'New' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex flex-col h-full ${isCollapsed ? 'w-20' : 'w-64'} border-r border-gray-200 dark:border-gray-700 transition-all duration-200`}>
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-xl ${isCollapsed ? 'hidden' : ''}`}>Athlete.AI</span>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${location.pathname === item.path ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
            >
              <item.icon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className={`${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <Menu className="h-4 w-4 mr-2" />
          <span className={`${isCollapsed ? 'hidden' : ''}`}>Menu</span>
        </Button>
      </div>
    </div>
  );
};

export default MainSidebar;
