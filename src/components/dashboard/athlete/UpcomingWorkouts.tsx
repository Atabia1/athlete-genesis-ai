import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccessibilitySettings } from "@/context/UserPreferencesContext";

interface UpcomingWorkoutsProps {
  visible: boolean;
  upcomingWorkouts: Array<{
    day: string;
    name: string;
    time: string;
    duration: string;
    type: string;
    color: string;
  }>;
}

/**
 * UpcomingWorkouts component for the Athlete Dashboard
 * 
 * Displays a list of upcoming workouts with details
 */
const UpcomingWorkouts: React.FC<UpcomingWorkoutsProps> = ({ visible, upcomingWorkouts }) => {
  const { accessibilitySettings } = useAccessibilitySettings();

  if (!visible) return null;

  return (
    <Card className="shadow-lg border border-gray-200/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Upcoming Workouts</CardTitle>
            <CardDescription>Your scheduled training sessions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {upcomingWorkouts.map((workout, index) => (
            <div
              key={index}
              className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="mr-4 flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: workout.color }}
                  aria-hidden="true"
                >
                  {workout.day.substring(0, 2)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                      {workout.name}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1">{workout.day}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2"
                    style={{
                      color: workout.color,
                      borderColor: workout.color,
                      backgroundColor: `${workout.color}10`
                    }}
                  >
                    {workout.type}
                  </Badge>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{workout.time}</span>
                  <span className="mx-2">•</span>
                  <span>{workout.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 py-3 px-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          asChild
        >
          <Link to="/workouts/schedule">
            <span>View full schedule</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingWorkouts;
