
import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Utensils, 
  BarChart2, 
  Settings, 
  User, 
  Menu, 
  X, 
  LogOut,
  Clock,
  Users,
  Heart,
  MessageSquare,
  Activity,
  TrendingUp,
  ClipboardList
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePlan } from "@/context/PlanContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = usePlan();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Define navigation items based on user type with enhanced organization
  const athleteNavItems = [
    { 
      icon: Clock, 
      label: "Today's Activities", 
      path: '/today',
      description: 'View and log your daily activities'
    },
    { 
      icon: Activity, 
      label: 'Workouts', 
      path: '/dashboard/workouts',
      description: 'Access your workout plans'
    },
    { 
      icon: Utensils, 
      label: 'Nutrition', 
      path: '/dashboard/nutrition',
      description: 'Track meals and nutrition'
    },
    { 
      icon: TrendingUp, 
      label: 'Progress', 
      path: '/dashboard/progress',
      description: 'Monitor your progress'
    },
    { 
      icon: Heart, 
      label: 'Well-being', 
      path: '/dashboard/well-being',
      description: 'Track your recovery and health'
    },
    { 
      icon: MessageSquare, 
      label: 'Coach Chat', 
      path: '/dashboard/coach-chat',
      description: 'Message your coach'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/dashboard/settings',
      description: 'Manage your preferences'
    },
  ];

  const coachNavItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Overview', 
      path: '/coach',
      description: 'Team overview and metrics'
    },
    { 
      icon: Users, 
      label: 'Athlete Roster', 
      path: '/coach/roster',
      description: 'Manage your athletes'
    },
    { 
      icon: Calendar, 
      label: 'Team Calendar', 
      path: '/coach/calendar',
      description: 'Schedule and events'
    },
    { 
      icon: BarChart2, 
      label: 'Team Analytics', 
      path: '/coach/analytics',
      description: 'Performance insights'
    },
    { 
      icon: ClipboardList, 
      label: 'Training Plans', 
      path: '/coach/plans',
      description: 'Manage training plans'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/coach/settings',
      description: 'Manage team settings'
    },
  ];

  const navItems = userType === 'coach' ? coachNavItems : athleteNavItems;

  const getThemeColor = () => {
    return userType === 'coach' 
      ? 'from-orange-600 to-red-600' 
      : 'from-athleteBlue-600 to-athleteGreen-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-20 transition-transform transform md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static`}
      >
        <div className="p-4 border-b">
          <Link to={userType === 'coach' ? "/coach" : "/dashboard"} className="flex items-center space-x-2">
            <span className={`text-xl font-bold bg-gradient-to-r ${getThemeColor()} bg-clip-text text-transparent`}>
              {userType === 'coach' ? 'Coach Dashboard' : 'Athlete GPT'}
            </span>
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`group flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ${
                    location.pathname === item.path 
                      ? `bg-gray-100 ${userType === 'coach' ? 'text-orange-600' : 'text-athleteBlue-600'} font-medium`
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${
                    location.pathname === item.path 
                      ? userType === 'coach' ? 'text-orange-600' : 'text-athleteBlue-600'
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-gray-500 hidden group-hover:block">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={cn(
          "bg-white shadow-sm py-4 px-6",
          "border-b border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={cn(
                "hidden md:inline-block px-3 py-1 rounded-full text-sm font-medium",
                userType === 'coach' ? "bg-orange-100 text-orange-800" : "bg-athleteBlue-100 text-athleteBlue-800"
              )}>
                {userType === 'coach' ? 'Coach' : 'Athlete'}
              </span>
              <Avatar>
                <AvatarFallback className={cn(
                  userType === 'coach' 
                    ? "bg-orange-100 text-orange-700" 
                    : "bg-athleteBlue-100 text-athleteBlue-700"
                )}>
                  {userType === 'coach' ? 'C' : 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className={cn(
            "max-w-7xl mx-auto",
            "animate-fade-in"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
