
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
  ClipboardList
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePlan } from "@/context/PlanContext";

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
    // In a real app, you would implement logout logic here
    navigate('/');
  };

  // Define navigation items based on user type
  const athleteNavItems = [
    { icon: Clock, label: "Today's Activities", path: '/today' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Workouts', path: '/dashboard/workouts' },
    { icon: Utensils, label: 'Nutrition', path: '/dashboard/nutrition' },
    { icon: BarChart2, label: 'Progress', path: '/dashboard/progress' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const coachNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
    { icon: Users, label: 'Athlete Roster', path: '/coach/roster' },
    { icon: Calendar, label: 'Team Calendar', path: '/coach/calendar' },
    { icon: Settings, label: 'Settings', path: '/coach/settings' },
  ];

  const navItems = userType === 'coach' ? coachNavItems : athleteNavItems;

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
            <span className="text-xl font-bold bg-gradient-to-r from-athleteBlue-600 to-athleteGreen-600 bg-clip-text text-transparent">
              Athlete GPT
            </span>
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-gray-100 text-athleteBlue-600 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${
                    location.pathname === item.path 
                      ? 'text-athleteBlue-600'
                      : 'text-gray-500'
                  }`} />
                  <span>{item.label}</span>
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
        <header className="bg-white shadow-sm py-4 px-6">
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
              <Avatar>
                <AvatarFallback className="bg-athleteBlue-100 text-athleteBlue-700">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
