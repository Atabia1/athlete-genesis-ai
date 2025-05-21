
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface TopNavigationProps {
  onMenuClick: () => void;
  children?: React.ReactNode;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ 
  onMenuClick,
  children
}) => {
  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden mr-2" 
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="text-xl font-bold">Dashboard</div>
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </header>
  );
};
