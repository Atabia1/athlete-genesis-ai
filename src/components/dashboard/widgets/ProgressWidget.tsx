import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const ProgressWidget = () => {
  // Mock progress data
  const workoutProgress = {
    completed: 12,
    total: 16,
    percentage: 75
  };

  const weeklyStats = {
    workoutsCompleted: 4,
    caloriesBurned: 2850,
    avgDuration: 45
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Workout Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {workoutProgress.completed} of {workoutProgress.total} Workouts
            </span>
            <Badge variant="secondary">{workoutProgress.percentage}%</Badge>
          </div>
          <Progress value={workoutProgress.percentage} className="h-2 mt-2" />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Weekly Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Workouts</span>
              <Badge variant="outline">{weeklyStats.workoutsCompleted}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Calories Burned</span>
              <Badge variant="outline">{weeklyStats.caloriesBurned}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg. Duration</span>
              <Badge variant="outline">{weeklyStats.avgDuration} min</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Consistency</span>
              <div className="flex items-center text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+15%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressWidget;
