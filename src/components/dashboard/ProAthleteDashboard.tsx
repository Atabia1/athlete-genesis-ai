
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, Dumbbell } from "lucide-react";
import WelcomeWidget from "./widgets/WelcomeWidget";
import WorkoutWidget from "./widgets/WorkoutWidget";

const ProAthleteDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WelcomeWidget />
        <WorkoutWidget />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-athleteBlue-600" />
              Sport Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track your sport-specific metrics and performance indicators.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-athleteBlue-600" />
              Equipment Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View and manage your equipment-specific workouts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-athleteBlue-600" />
              Advanced Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Deep dive into your performance data and trends.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProAthleteDashboard;
