
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
  ClipboardList,
  WifiOff,
  Download,
  CreditCard,
  Zap,
  Brain
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/PlanContext";
import { cn } from "@/lib/utils";
import NetworkStatus from "@/components/ui/network-status";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { OfflineStatusHeader } from "@/components/ui/offline-status-header";
import { AccessibilitySettingsButton, AccessibilityDocumentationButton } from '@/shared/components/accessibility';
import { LanguageSelector } from '@/shared/components/language';
import { useTranslation } from '@/shared/hooks';
import UserProfileDropdown from './UserProfileDropdown';

/**
 * DashboardLayout: Main layout component for all dashboard pages
 *
 * This component provides the common layout structure for all dashboard views,
 * including the sidebar navigation, header, and content area. It adapts its
 * appearance and navigation options based on the user type (athlete or coach).
 *
 * Features:
 * - Responsive sidebar that collapses on mobile devices
 * - User type-specific navigation items
 * - Themed UI elements based on user type (blue for athletes, orange for coaches)
 * - Consistent header with user information
 * - Logout functionality
 */

/**
 * Props for the DashboardLayout component
 */
interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

/**
 * DashboardLayout Component
 * @param children - The content to display in the main area
 * @param title - The title to display in the header
 */
const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = usePlan();
  const { isOnline } = useNetworkStatus();
  const { t, getDirection } = useTranslation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  /**
   * Navigation items for athletes
   * Each item includes an icon, label, path, and description
   */
  const athleteNavItems = [
    {
      icon: WifiOff,
      label: 'Saved Workouts',
      path: '/dashboard/offline-workouts',
      description: 'Access workouts when offline'
    },
    {
      icon: Clock,
      label: "Today's Plan",
      path: '/today',
      description: 'View and log your daily activities'
    },
    {
      icon: Activity,
      label: 'Workout Analytics',
      path: '/dashboard/workouts',
      description: 'Access your workout plans and analytics'
    },
    {
      icon: Utensils,
      label: 'Nutrition Plan',
      path: '/dashboard/nutrition',
      description: 'Track meals and nutrition'
    },
    {
      icon: Activity,
      label: 'Health Dashboard',
      path: '/dashboard/health',
      description: 'Track your health metrics and insights'
    },
    {
      icon: Brain,
      label: 'AI Features',
      path: '/dashboard/ai-features',
      description: 'Access AI-powered features'
    },
    {
      icon: TrendingUp,
      label: 'Progress Tracking',
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
      icon: CreditCard,
      label: 'Subscription',
      path: '/dashboard/subscription',
      description: 'Manage your subscription'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/dashboard/settings',
      description: 'Manage your preferences'
    },
  ];

  /**
   * Navigation items for coaches
   * Focused on team management and analytics
   */
  const coachNavItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/coach',
      description: 'Team overview and metrics'
    },
    {
      icon: Users,
      label: 'Team Roster',
      path: '/coach/roster',
      description: 'Manage your athletes'
    },
    {
      icon: Calendar,
      label: 'Schedule',
      path: '/coach/calendar',
      description: 'Team schedule and events'
    },
    {
      icon: BarChart2,
      label: 'Performance',
      path: '/coach/analytics',
      description: 'Team performance insights'
    },
    {
      icon: ClipboardList,
      label: 'Training Programs',
      path: '/coach/plans',
      description: 'Manage training plans'
    },
    {
      icon: Brain,
      label: 'AI Features',
      path: '/dashboard/ai-features',
      description: 'Access AI-powered features'
    },
    {
      icon: CreditCard,
      label: 'Subscription',
      path: '/dashboard/subscription',
      description: 'Manage your subscription'
    },
    {
      icon: Settings,
      label: 'Team Settings',
      path: '/coach/settings',
      description: 'Manage team settings'
    },
  ];

  const navItems = userType === 'coach' ? coachNavItems : athleteNavItems;

  /**
   * Returns the appropriate theme gradient based on user type
   * - Orange/red for coaches
   * - Blue/green for athletes
   */
  const getThemeColor = () => {
    return userType === 'coach'
      ? 'from-orange-600 to-red-600'
      : 'from-athleteBlue-600 to-athleteGreen-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md z-20 transition-transform transform md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static`}
      >
        <div className="p-4 border-b dark:border-gray-700">
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
                      ? `bg-gray-100 dark:bg-gray-700 ${userType === 'coach' ? 'text-orange-600 dark:text-orange-400' : 'text-athleteBlue-600 dark:text-athleteBlue-400'} font-medium`
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${
                    location.pathname === item.path
                      ? userType === 'coach' ? 'text-orange-600 dark:text-orange-400' : 'text-athleteBlue-600 dark:text-athleteBlue-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} />
                  <div className="flex flex-col">
                    <span className="dark:text-gray-200">{item.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden group-hover:block">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 space-y-2">
          {/* Show accessibility documentation button in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <AccessibilityDocumentationButton className="w-full justify-start mb-2" />
          )}

          <Button
            variant="outline"
            className="w-full justify-start text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('app.logout')}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col" dir={getDirection()}>
        {/* Offline Status Header */}
        <OfflineStatusHeader />

        {/* Header */}
        <header className={cn(
          "bg-white dark:bg-gray-800 shadow-sm py-4 px-6",
          "border-b border-gray-200 dark:border-gray-700"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? t('actions.close', 'Close') : t('actions.open', 'Open')}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <NetworkStatus className="mr-2" />
              <LanguageSelector
                showName={false}
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              />
              <AccessibilitySettingsButton className="text-gray-500 hover:text-gray-700" />
              <span className={cn(
                "hidden md:inline-block px-3 py-1 rounded-full text-sm font-medium",
                userType === 'coach' ? "bg-orange-100 text-orange-800" : "bg-athleteBlue-100 text-athleteBlue-800"
              )}>
                {userType === 'coach' ? t('nav.coach', 'Coach') : t('nav.athlete', 'Athlete')}
              </span>
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto dark:text-gray-200">
          {!isOnline && (
            <div className="mb-6">
              <OfflineIndicator
                variant="banner"
                message="You are currently offline. Your data will be saved locally and synced when you reconnect."
              />
            </div>
          )}
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
