
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Flame, Trophy, ArrowRight, Dumbbell, Heart, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface WelcomeWidgetProps {
  userName?: string;
}

const WelcomeWidget = ({ userName = "Athlete" }: WelcomeWidgetProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get current time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format time as HH:MM AM/PM
  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date as "Monday, January 1"
  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for today's workout
  const todaysWorkout = {
    name: "Upper Body Strength",
    time: "5:30 PM",
    duration: "45 min",
    completed: 0,
    total: 5,
    streak: 4
  };

  // Calculate workout completion percentage
  const completionPercentage = (todaysWorkout.completed / todaysWorkout.total) * 100;

  return (
    <Card className="border-athleteBlue-200 shadow-sm overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -mt-10 -mr-10"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-athleteBlue-600 to-athleteBlue-400 bg-clip-text text-transparent">
              {getGreeting()}, {userName}
            </CardTitle>
            <CardDescription className="mt-1">
              {formatDate()} • {formatTime()}
            </CardDescription>
          </div>
          <Badge className="bg-athleteBlue-100 text-athleteBlue-700 hover:bg-athleteBlue-200 flex items-center">
            <Flame className="h-3 w-3 mr-1 text-red-500" />
            {todaysWorkout.streak} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-athleteBlue-50 to-athleteGreen-50 p-4 rounded-lg mb-4 border border-athleteBlue-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-athleteBlue-700 flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-athleteBlue-600" />
                Today's Focus
              </h3>
              <div className="text-lg font-bold">{todaysWorkout.name}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {todaysWorkout.time}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {todaysWorkout.duration}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Workout Progress</span>
              <span className="font-medium">{todaysWorkout.completed}/{todaysWorkout.total} exercises</span>
            </div>
            <Progress
              value={completionPercentage}
              className="h-2"
              // Fix for the indicatorClassName issue
              style={{
                "--progress-background": "#3b82f6"
              } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full text-green-600 mr-2">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Recovery Status</div>
              <div className="text-sm font-medium">Fully Recovered</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-2">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Energy Level</div>
              <div className="text-sm font-medium">High</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600 mr-2">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Weekly Goal</div>
              <div className="text-sm font-medium">On Track</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full bg-athleteBlue-600 hover:bg-athleteBlue-700 text-white">
          <Calendar className="mr-2 h-4 w-4" />
          Start Today's Workout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WelcomeWidget;
