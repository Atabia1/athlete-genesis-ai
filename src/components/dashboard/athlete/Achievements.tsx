import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccessibilitySettings } from "@/context/UserPreferencesContext";

interface AchievementsProps {
  visible: boolean;
  recentAchievements: Array<{
    title: string;
    description: string;
    date: string;
    icon: React.ElementType;
  }>;
}

/**
 * Achievements component for the Athlete Dashboard
 * 
 * Displays recent achievements and milestones
 */
const Achievements: React.FC<AchievementsProps> = ({ visible, recentAchievements }) => {
  const { accessibilitySettings } = useAccessibilitySettings();

  if (!visible) return null;

  return (
    <Card className="shadow-lg border border-gray-200/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
        <div className="flex items-center">
          <div className="p-2 bg-amber-100 rounded-md text-amber-600 mr-3">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Recent Achievements</CardTitle>
            <CardDescription>Your latest milestones and records</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {recentAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            
            return (
              <div
                key={index}
                className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="mr-4 flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{achievement.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 py-3 px-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          asChild
        >
          <Link to="/achievements">
            <span>View all achievements</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Achievements;
