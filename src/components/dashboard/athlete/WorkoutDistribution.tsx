import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Maximize2 } from "lucide-react";
import { useTheme } from "@/context/UserPreferencesContext";
import { useAccessibilitySettings } from "@/context/UserPreferencesContext";

interface WorkoutDistributionProps {
  visible: boolean;
  workoutDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

/**
 * WorkoutDistribution component for the Athlete Dashboard
 * 
 * Displays a pie chart showing the distribution of workout types
 */
const WorkoutDistribution: React.FC<WorkoutDistributionProps> = ({ visible, workoutDistribution }) => {
  const { resolvedTheme } = useTheme();
  const { accessibilitySettings } = useAccessibilitySettings();

  if (!visible) return null;

  return (
    <Card className="shadow-lg border border-gray-200/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-md text-purple-600 mr-3">
            <Maximize2 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Workout Distribution</CardTitle>
            <CardDescription>Breakdown of your training focus</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]" aria-label="Workout distribution pie chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={workoutDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={accessibilitySettings.largeText ? 90 : 80}
                innerRadius={accessibilitySettings.largeText ? 60 : 50}
                fill="#8884d8"
                dataKey="value"
                animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelStyle={{
                  fontSize: accessibilitySettings.largeText ? 14 : 12,
                  fontWeight: 500,
                  fill: resolvedTheme === 'dark' ? '#e2e8f0' : '#334155'
                }}
              >
                {workoutDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'} 
                    strokeWidth={accessibilitySettings.highContrast ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {workoutDistribution.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              ></div>
              <span className={`text-sm ${accessibilitySettings.largeText ? 'text-base' : ''}`}>
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutDistribution;
