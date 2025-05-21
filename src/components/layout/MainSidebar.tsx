
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, BarChart, Dumbbell, Utensils, Settings, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MainSidebarProps {
  className?: string;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <div className={cn("bg-gray-50 border-r p-4 flex flex-col h-full", className)}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold px-4 mb-6">Athlete GPT</h2>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => navigate('/dashboard')}
        >
          <Home className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => navigate('/dashboard/training-plans')}
        >
          <Dumbbell className="mr-2 h-5 w-5" />
          Training Plans
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/workout-analytics')}
        >
          <BarChart className="mr-2 h-5 w-5" />
          Analytics
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/nutrition-dashboard')}
        >
          <Utensils className="mr-2 h-5 w-5" />
          Nutrition
        </Button>
      </div>
      
      <div className="mt-auto space-y-1">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/team-analytics')}
        >
          <Users className="mr-2 h-5 w-5" />
          Team
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/profile')}
        >
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );
};
