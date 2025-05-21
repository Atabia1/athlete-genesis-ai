
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { MainSidebar } from '@/components/layout/MainSidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

/**
 * Dashboard Layout Component
 * 
 * This component provides the main layout for the dashboard, including
 * the top navigation, main sidebar, and mobile sidebar.
 */
const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully.",
        description: "Redirecting to the home page...",
      })
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out.",
        description: "Please try again or contact support.",
      })
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Sidebar (Hidden on small screens) */}
      <MainSidebar className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-gray-50" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={toggleMobileSidebar}>
        {/* Mobile Sidebar Content */}
        <nav className="flex flex-col space-y-2">
          <a href="/dashboard" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/dashboard/training-plans" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Training Plans
          </a>
          {/* Add more mobile navigation links here */}
        </nav>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </MobileSidebar>

      {/* Page Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <TopNavigation onMenuClick={toggleMobileSidebar}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/subscription')}>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TopNavigation>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
