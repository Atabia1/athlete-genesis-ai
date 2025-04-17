
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const WelcomeWidget = () => {
  // Get current time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          {getGreeting()}, User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Your personalized training plan is ready. Here's what your day looks like.
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="font-semibold text-athleteBlue-700">Today's Focus</div>
            <div className="text-lg">Upper Body Strength</div>
          </div>
          <Button className="bg-athleteBlue-600 hover:bg-athleteBlue-700">
            <Calendar className="mr-2 h-4 w-4" />
            View Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeWidget;
