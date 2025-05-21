import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { useAccessibilitySettings } from "@/context/UserPreferencesContext";

interface WeeklyGoalsProps {
  visible: boolean;
  weeklyGoals: Array<{
    name: string;
    completed: number;
    total: number;
    color: string;
    unit?: string;
  }>;
}

/**
 * WeeklyGoals component for the Athlete Dashboard
 * 
 * Displays progress bars for weekly goals
 */
const WeeklyGoals: React.FC<WeeklyGoalsProps> = ({ visible, weeklyGoals }) => {
  const { accessibilitySettings } = useAccessibilitySettings();

  if (!visible) return null;

  return (
    <Card className="shadow-lg border border-gray-200/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-md text-green-600 mr-3">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Weekly Goals</CardTitle>
            <CardDescription>Track your progress towards targets</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {weeklyGoals.map((goal, index) => {
            const percentage = Math.round((goal.completed / goal.total) * 100);
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: goal.color }}
                      aria-hidden="true"
                    ></div>
                    <span className={`font-medium ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}`}>
                      {goal.name}
                    </span>
                  </div>
                  <span className={`${accessibilitySettings.largeText ? 'text-base' : 'text-sm'} font-medium`}>
                    {goal.completed}{goal.unit ? goal.unit : ''} / {goal.total}{goal.unit ? goal.unit : ''}
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={percentage}
                    className={`h-${accessibilitySettings.largeText ? '3' : '2'}`}
                    indicatorClassName={`bg-gradient-to-r from-${goal.color.replace('#', '')} to-${goal.color.replace('#', '')}/80`}
                    aria-label={`${goal.name} progress: ${percentage}%`}
                  />
                  {accessibilitySettings.highContrast && (
                    <span
                      className="absolute text-xs font-bold text-white px-1 rounded"
                      style={{
                        backgroundColor: goal.color,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: `${Math.min(Math.max(percentage - 5, 0), 95)}%`,
                        display: percentage < 10 ? 'none' : 'block'
                      }}
                    >
                      {percentage}%
                    </span>
                  )}
                </div>
                {percentage >= 100 && (
                  <div className="text-green-600 text-xs font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Goal completed!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoals;
