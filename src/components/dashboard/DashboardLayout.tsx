/**
 * Dashboard Layout Component
 * 
 * This component provides the main layout for the dashboard, including
 * the navigation sidebar, header, and content area.
 * 
 * It handles user authentication, feature access, and theme settings.
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/context/ThemeContext';
import { useFeatureAccess } from '@/context/FeatureAccessContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { SyncBanner } from '@/components/ui/sync-banner';
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  User,
  Download,
  Zap
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer';
import { createMockNavigate } from '@/utils/test-utils';
import { createMockParams } from '@/utils/test-utils';
import { createMockSearchParams } from '@/utils/test-utils';

/**
 * Dashboard Layout Component
 */
const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { hasFeatureAccess } = useFeatureAccess();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Determine if the current route is a coach or team route
  const isCoachRoute = location.pathname.startsWith('/dashboard/coach');
  const isTeamRoute = location.pathname.startsWith('/dashboard/team');

  // Extract coach or team ID from the URL
  const coachId = isCoachRoute ? location.pathname.split('/').pop() : null;
  const teamId = isTeamRoute ? location.pathname.split('/').pop() : null;

  // Mock data for testing purposes
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      // Mock useParams based on the current route
      if (isCoachRoute && coachId) {
        createMockParams({ coachId: `coach-${coachId}` });
      } else if (isTeamRoute && teamId) {
        createMockParams({ teamId: `team-${teamId}` });
      }

      // Mock useNavigate
      createMockNavigate();

      // Mock search params
      createMockSearchParams({});
    }
  }, [location.pathname, isCoachRoute, isTeamRoute, coachId, teamId]);

  // Function to handle navigation based on user type and feature access
  const handleNavigation = (path: string) => {
    if (path.startsWith('/dashboard/coach/') || path.startsWith('/dashboard/team/')) {
      // Extract the ID from the path
      const id = path.split('/').pop();

      if (path.startsWith('/dashboard/coach/')) {
        // Navigate to the coach dashboard if the user has access
        if (hasFeatureAccess('coach_management')) {
          navigate(`/dashboard/coach/${id}`);
        } else {
          // Redirect to the subscription page if the user doesn't have access
          navigate('/dashboard/subscription');
        }
      } else if (path.startsWith('/dashboard/team/')) {
        // Navigate to the team dashboard if the user has access
        if (hasFeatureAccess('team_management')) {
          navigate(`/dashboard/team/${id}`);
        } else {
          // Redirect to the subscription page if the user doesn't have access
          navigate('/dashboard/subscription');
        }
      }
    } else {
      // For other paths, navigate directly
      navigate(path);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 antialiased">
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <Sidebar onNavigation={handleNavigation} />
      </MobileSidebar>

      {/* Desktop Sidebar */}
      <Sidebar className="w-64 flex-shrink-0 border-r bg-white" onNavigation={handleNavigation} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNavigation onMenuClick={() => setIsSidebarOpen(true)}>
          <SyncBanner />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || ""} alt={user?.first_name} />
                  <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/export')}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export Data</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/subscription')}>
                <Zap className="mr-2 h-4 w-4" />
                <span>Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TopNavigation>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full p-4">
            <Outlet />
          </ScrollArea>
        </div>

        {/* Footer */}
        <footer className="border-t p-4 text-center text-sm text-gray-500">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Athlete Genesis AI. All rights reserved.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link">Customize Dashboard</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Customize Dashboard</DialogTitle>
                  <DialogDescription>
                    Make changes to your dashboard here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <DashboardCustomizer />
              </DialogContent>
            </Dialog>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
